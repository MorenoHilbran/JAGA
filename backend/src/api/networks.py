"""
Networks API endpoints.
Handles risk network listing, filtering, and detail views.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc
from typing import Optional, List
from datetime import date

from src.database import get_db
from src.models import RiskNetwork, Claim
from src.api.schemas import (
    NetworkListResponse, 
    NetworkListItem, 
    NetworkDetail,
    RiskCategory,
    InvestigationStatus
)

router = APIRouter()


@router.get("", response_model=NetworkListResponse)
async def list_networks(
    risk_category: Optional[RiskCategory] = Query(None, description="Filter by risk category"),
    investigation_status: Optional[InvestigationStatus] = Query(None, description="Filter by investigation status"),
    date_from: Optional[date] = Query(None, description="Filter by detection date (from)"),
    date_to: Optional[date] = Query(None, description="Filter by detection date (to)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("risk_score", description="Sort field (risk_score, detected_at)"),
    sort_order: str = Query("desc", description="Sort order (asc, desc)"),
    db: Session = Depends(get_db)
):
    """
    Get list of risk networks with filtering and pagination.
    
    - **risk_category**: Filter by LOW, MEDIUM, HIGH, CRITICAL
    - **investigation_status**: Filter by queued, in_progress, confirmed, dismissed
    - **date_from**: Filter networks detected from this date
    - **date_to**: Filter networks detected until this date
    - **page**: Page number (1-indexed)
    - **page_size**: Number of items per page (max 100)
    - **sort_by**: Field to sort by (risk_score, detected_at)
    - **sort_order**: Sort direction (asc, desc)
    """
    
    # Build query
    query = db.query(RiskNetwork)
    
    # Apply filters
    if risk_category:
        query = query.filter(RiskNetwork.risk_category == risk_category.value)
    
    if investigation_status:
        query = query.filter(RiskNetwork.investigation_status == investigation_status.value)
    
    if date_from:
        query = query.filter(RiskNetwork.detected_at >= date_from)
    
    if date_to:
        query = query.filter(RiskNetwork.detected_at <= date_to)
    
    # Get total count before pagination
    total = query.count()
    
    # Apply sorting
    sort_field = getattr(RiskNetwork, sort_by, RiskNetwork.risk_score)
    if sort_order.lower() == "asc":
        query = query.order_by(asc(sort_field))
    else:
        query = query.order_by(desc(sort_field))
    
    # Apply pagination
    offset = (page - 1) * page_size
    networks = query.offset(offset).limit(page_size).all()
    
    # Convert to response model
    network_items = []
    for network in networks:
        network_items.append(NetworkListItem(
            network_id=network.network_id,
            risk_score=network.risk_score,
            risk_category=network.risk_category,
            primary_risk_type=network.primary_risk_type,
            total_claim_amount=network.total_claim_amount,
            entity_count=len(network.entity_ids) if network.entity_ids else 0,
            detected_at=network.detected_at,
            investigation_status=network.investigation_status
        ))
    
    return NetworkListResponse(
        networks=network_items,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/{network_id}", response_model=NetworkDetail)
async def get_network_detail(
    network_id: str,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific risk network.
    
    - **network_id**: Unique identifier of the network
    
    Returns detailed network information including:
    - Risk assessment details
    - Entity composition
    - Financial impact
    - Activity timeline
    - Risk signals and explanation
    - Investigation status
    """
    
    # Query network
    network = db.query(RiskNetwork).filter(
        RiskNetwork.network_id == network_id
    ).first()
    
    if not network:
        raise HTTPException(status_code=404, detail=f"Network {network_id} not found")
    
    # Convert to response model
    return NetworkDetail(
        network_id=network.network_id,
        risk_score=network.risk_score,
        risk_category=network.risk_category,
        primary_risk_type=network.primary_risk_type,
        entity_ids=network.entity_ids or [],
        entity_types=network.entity_types or {},
        total_claim_amount=network.total_claim_amount,
        claim_count=network.claim_count,
        first_activity_date=network.first_activity_date,
        last_activity_date=network.last_activity_date,
        signal_breakdown=network.signal_breakdown,
        explanation=network.explanation,
        peer_comparison=network.peer_comparison,
        investigation_status=network.investigation_status,
        assigned_to=network.assigned_to,
        detected_at=network.detected_at
    )


@router.get("/{network_id}/claims")
async def get_network_claims(
    network_id: str,
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """
    Get claims associated with a risk network.
    
    - **network_id**: Network identifier
    - **page**: Page number
    - **page_size**: Items per page
    
    Returns paginated list of claims that are part of the network.
    """
    
    # Verify network exists
    network = db.query(RiskNetwork).filter(
        RiskNetwork.network_id == network_id
    ).first()
    
    if not network:
        raise HTTPException(status_code=404, detail=f"Network {network_id} not found")
    
    # Get entity IDs from network
    entity_ids = network.entity_ids or []
    
    # Query claims involving these entities
    query = db.query(Claim).filter(
        (Claim.participant_id.in_(entity_ids)) |
        (Claim.provider_id.in_(entity_ids)) |
        (Claim.doctor_id.in_(entity_ids))
    )
    
    total = query.count()
    
    # Apply pagination
    offset = (page - 1) * page_size
    claims = query.order_by(desc(Claim.claim_date)).offset(offset).limit(page_size).all()
    
    # Convert to dict
    claim_items = []
    for claim in claims:
        claim_items.append({
            "claim_id": claim.claim_id,
            "participant_id": claim.participant_id,
            "provider_id": claim.provider_id,
            "doctor_id": claim.doctor_id,
            "claim_date": claim.claim_date.isoformat(),
            "claim_amount": claim.claim_amount,
            "diagnosis_codes": claim.diagnosis_codes,
            "procedure_codes": claim.procedure_codes,
            "admission_date": claim.admission_date.isoformat() if claim.admission_date else None,
            "discharge_date": claim.discharge_date.isoformat() if claim.discharge_date else None,
            "length_of_stay": claim.length_of_stay,
            "claim_status": claim.claim_status
        })
    
    return {
        "claims": claim_items,
        "total": total,
        "page": page,
        "page_size": page_size
    }
