"""
Graph API endpoints.
Handles network graph data for Cytoscape.js visualization.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional

from src.database import get_db
from src.models import RiskNetwork, Claim, Provider, Doctor, Participant, RiskSignal

router = APIRouter()


def build_graph_from_signals(
    db: Session,
    network_id: str
) -> Dict[str, Any]:
    """
    Build graph data from risk signals for a network.
    
    Args:
        db: Database session
        network_id: Network ID
        
    Returns:
        Graph data in Cytoscape.js format
    """
    # Get network
    network = db.query(RiskNetwork).filter(
        RiskNetwork.network_id == network_id
    ).first()
    
    if not network:
        return None
    
    # Get all signals for this network
    signal_ids = network.signal_ids or []
    signals = db.query(RiskSignal).filter(
        RiskSignal.signal_id.in_(signal_ids)
    ).all() if signal_ids else []
    
    # Collect all entity IDs from network and signals
    entity_ids = set(network.entity_ids or [])
    
    # Parse entity_types JSON to understand composition
    entity_types = network.entity_types or {}
    provider_ids = entity_types.get('providers', [])
    doctor_ids = entity_types.get('doctors', [])
    participant_ids = entity_types.get('participants', [])
    
    # Build nodes
    nodes = []
    edges = []
    
    # Add provider nodes
    providers = db.query(Provider).filter(Provider.provider_id.in_(provider_ids)).all()
    for provider in providers:
        # Check if this provider has signals
        provider_signals = [s for s in signals if s.entity_id == provider.provider_id]
        max_risk = max([s.signal_score for s in provider_signals], default=0)
        
        nodes.append({
            'data': {
                'id': provider.provider_id,
                'label': provider.provider_name,
                'type': 'provider',
                'entity_type': 'Faskes',
                'facility_type': provider.facility_type,
                'region': provider.region_code,
                'risk_score': max_risk,
                'signal_count': len(provider_signals),
                'details': {
                    'ownership': provider.ownership_type,
                    'bed_count': provider.bed_count,
                    'accreditation': provider.accreditation_level
                }
            }
        })
    
    # Add doctor nodes
    doctors = db.query(Doctor).filter(Doctor.doctor_id.in_(doctor_ids)).all()
    for doctor in doctors:
        doctor_signals = [s for s in signals if s.entity_id == doctor.doctor_id]
        max_risk = max([s.signal_score for s in doctor_signals], default=0)
        
        nodes.append({
            'data': {
                'id': doctor.doctor_id,
                'label': doctor.doctor_name,
                'type': 'doctor',
                'entity_type': 'Dokter',
                'specialty': doctor.specialty,
                'risk_score': max_risk,
                'signal_count': len(doctor_signals),
                'details': {
                    'license': doctor.license_number,
                    'affiliated_providers': doctor.affiliated_providers or []
                }
            }
        })
    
    # Add participant nodes (limited to avoid overcrowding)
    participants = db.query(Participant).filter(
        Participant.participant_id.in_(participant_ids[:50])  # Limit to 50
    ).all()
    for participant in participants:
        nodes.append({
            'data': {
                'id': participant.participant_id,
                'label': f"Pasien {participant.participant_id[-6:]}",  # Masked
                'type': 'participant',
                'entity_type': 'Pasien',
                'age_band': participant.age_band,
                'gender': participant.gender,
                'region': participant.region_code,
                'risk_score': 0,
                'signal_count': 0,
                'details': {
                    'status': participant.participant_status,
                    'registration_date': str(participant.registration_date)
                }
            }
        })
    
    # Build edges from claims
    # Get claims that involve entities in this network
    claims = db.query(Claim).filter(
        Claim.provider_id.in_(provider_ids)
    ).limit(200).all()  # Limit claims to avoid performance issues
    
    # Track edges to avoid duplicates
    edge_set = set()
    
    for claim in claims:
        # Participant -> Provider (visits)
        if claim.participant_id in participant_ids and claim.provider_id in provider_ids:
            edge_key = f"{claim.participant_id}-visits-{claim.provider_id}"
            if edge_key not in edge_set:
                edges.append({
                    'data': {
                        'id': edge_key,
                        'source': claim.participant_id,
                        'target': claim.provider_id,
                        'type': 'visits',
                        'label': 'kunjungan',
                        'weight': 1
                    }
                })
                edge_set.add(edge_key)
        
        # Doctor -> Participant (treats)
        if claim.doctor_id and claim.doctor_id in doctor_ids and claim.participant_id in participant_ids:
            edge_key = f"{claim.doctor_id}-treats-{claim.participant_id}"
            if edge_key not in edge_set:
                edges.append({
                    'data': {
                        'id': edge_key,
                        'source': claim.doctor_id,
                        'target': claim.participant_id,
                        'type': 'treated_by',
                        'label': 'menangani',
                        'weight': 1
                    }
                })
                edge_set.add(edge_key)
        
        # Doctor -> Provider (works_at)
        if claim.doctor_id and claim.doctor_id in doctor_ids and claim.provider_id in provider_ids:
            edge_key = f"{claim.doctor_id}-works_at-{claim.provider_id}"
            if edge_key not in edge_set:
                edges.append({
                    'data': {
                        'id': edge_key,
                        'source': claim.doctor_id,
                        'target': claim.provider_id,
                        'type': 'works_at',
                        'label': 'bekerja di',
                        'weight': 1
                    }
                })
                edge_set.add(edge_key)
    
    # Add suspicious edges from signals
    for signal in signals:
        if signal.signal_type == 'REFERRAL_CONCENTRATION':
            # Add suspicious referral edge
            evidence = signal.evidence or {}
            doctor_id = evidence.get('doctor_id')
            top_provider_id = evidence.get('top_provider_id')
            
            if doctor_id and top_provider_id:
                edge_key = f"{doctor_id}-suspicious_ref-{top_provider_id}"
                if edge_key not in edge_set:
                    edges.append({
                        'data': {
                            'id': edge_key,
                            'source': doctor_id,
                            'target': top_provider_id,
                            'type': 'circular_ref',
                            'label': f"rujukan {evidence.get('concentration_percentage', 0):.0f}%",
                            'weight': 3,
                            'suspicious': True,
                            'risk_score': signal.signal_score
                        }
                    })
                    edge_set.add(edge_key)
    
    return {
        'nodes': nodes,
        'edges': edges,
        'metadata': {
            'network_id': network_id,
            'node_count': len(nodes),
            'edge_count': len(edges),
            'providers': len(providers),
            'doctors': len(doctors),
            'participants': len(participants)
        }
    }


@router.get("/network/{network_id}")
async def get_network_graph(
    network_id: str,
    include_participants: bool = Query(True, description="Include participant nodes"),
    max_nodes: int = Query(100, ge=10, le=500, description="Maximum nodes to return"),
    db: Session = Depends(get_db)
):
    """
    Get graph data for a specific network in Cytoscape.js format.
    
    - **network_id**: ID of the risk network
    - **include_participants**: Include participant nodes (may increase graph size)
    - **max_nodes**: Maximum number of nodes to return (for performance)
    
    Returns graph data with nodes and edges in Cytoscape.js format.
    """
    
    # Check if network exists
    network = db.query(RiskNetwork).filter(
        RiskNetwork.network_id == network_id
    ).first()
    
    if not network:
        raise HTTPException(status_code=404, detail=f"Network {network_id} not found")
    
    # Build graph from signals
    graph_data = build_graph_from_signals(db, network_id)
    
    if not graph_data:
        raise HTTPException(status_code=404, detail=f"No graph data available for network {network_id}")
    
    # Limit nodes if needed
    if len(graph_data['nodes']) > max_nodes:
        # Keep providers and doctors, limit participants
        providers_doctors = [n for n in graph_data['nodes'] if n['data']['type'] in ['provider', 'doctor']]
        participants = [n for n in graph_data['nodes'] if n['data']['type'] == 'participant']
        
        remaining_slots = max_nodes - len(providers_doctors)
        limited_participants = participants[:remaining_slots] if remaining_slots > 0 else []
        
        graph_data['nodes'] = providers_doctors + limited_participants
        
        # Filter edges to only include nodes we kept
        node_ids = {n['data']['id'] for n in graph_data['nodes']}
        graph_data['edges'] = [
            e for e in graph_data['edges']
            if e['data']['source'] in node_ids and e['data']['target'] in node_ids
        ]
        
        graph_data['metadata']['node_count'] = len(graph_data['nodes'])
        graph_data['metadata']['edge_count'] = len(graph_data['edges'])
        graph_data['metadata']['limited'] = True
    
    return graph_data


@router.get("/entity/{entity_type}/{entity_id}")
async def get_entity_subgraph(
    entity_type: str,
    entity_id: str,
    depth: int = Query(1, ge=1, le=3, description="Graph traversal depth"),
    db: Session = Depends(get_db)
):
    """
    Get subgraph centered on a specific entity.
    
    - **entity_type**: Type of entity (provider, doctor, participant)
    - **entity_id**: ID of the entity
    - **depth**: How many hops to traverse (1-3)
    
    Returns subgraph in Cytoscape.js format.
    """
    
    # This is a simplified implementation
    # In production, you'd traverse the graph properly
    
    nodes = []
    edges = []
    
    # Get the entity
    if entity_type == 'provider':
        entity = db.query(Provider).filter(Provider.provider_id == entity_id).first()
        if entity:
            nodes.append({
                'data': {
                    'id': entity.provider_id,
                    'label': entity.provider_name,
                    'type': 'provider',
                    'entity_type': 'Faskes'
                }
            })
    elif entity_type == 'doctor':
        entity = db.query(Doctor).filter(Doctor.doctor_id == entity_id).first()
        if entity:
            nodes.append({
                'data': {
                    'id': entity.doctor_id,
                    'label': entity.doctor_name,
                    'type': 'doctor',
                    'entity_type': 'Dokter'
                }
            })
    
    if not nodes:
        raise HTTPException(status_code=404, detail=f"Entity {entity_id} not found")
    
    return {
        'nodes': nodes,
        'edges': edges,
        'metadata': {
            'entity_type': entity_type,
            'entity_id': entity_id,
            'depth': depth
        }
    }
