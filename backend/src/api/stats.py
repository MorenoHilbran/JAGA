"""
Statistics API endpoints.
Provides summary statistics for the dashboard.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict

from src.database import get_db
from src.models import RiskNetwork, Claim, Participant, Provider, Doctor
from src.api.schemas import StatsResponse

router = APIRouter()


@router.get("/summary", response_model=StatsResponse)
async def get_summary_stats(db: Session = Depends(get_db)):
    """
    Get summary statistics for dashboard.
    
    Returns:
        - Total risk networks detected
        - Count by risk category
        - Total amount at risk
        - Pending investigations count
    """
    
    # Count networks by risk category
    network_stats = db.query(
        RiskNetwork.risk_category,
        func.count(RiskNetwork.network_id).label('count'),
        func.sum(RiskNetwork.total_claim_amount).label('total_amount')
    ).group_by(RiskNetwork.risk_category).all()
    
    # Initialize counts
    stats = {
        'total_networks': 0,
        'critical_count': 0,
        'high_count': 0,
        'medium_count': 0,
        'low_count': 0,
        'total_amount_at_risk': 0.0,
        'pending_investigations': 0
    }
    
    # Populate from query results
    for category, count, amount in network_stats:
        stats['total_networks'] += count
        stats['total_amount_at_risk'] += float(amount or 0)
        
        if category == 'CRITICAL':
            stats['critical_count'] = count
        elif category == 'HIGH':
            stats['high_count'] = count
        elif category == 'MEDIUM':
            stats['medium_count'] = count
        elif category == 'LOW':
            stats['low_count'] = count
    
    # Count pending investigations
    pending = db.query(func.count(RiskNetwork.network_id)).filter(
        RiskNetwork.investigation_status == 'queued'
    ).scalar()
    stats['pending_investigations'] = pending or 0
    
    return StatsResponse(**stats)


@router.get("/overview")
async def get_overview_stats(db: Session = Depends(get_db)):
    """
    Get additional overview statistics.
    
    Returns:
        - Total participants, providers, doctors
        - Total claims and claim amount
        - Data freshness metrics
    """
    
    total_participants = db.query(func.count(Participant.participant_id)).scalar() or 0
    total_providers = db.query(func.count(Provider.provider_id)).scalar() or 0
    total_doctors = db.query(func.count(Doctor.doctor_id)).scalar() or 0
    total_claims = db.query(func.count(Claim.claim_id)).scalar() or 0
    total_claim_amount = db.query(func.sum(Claim.claim_amount)).scalar() or 0.0
    
    # Get date range of claims
    date_range = db.query(
        func.min(Claim.claim_date).label('first_claim'),
        func.max(Claim.claim_date).label('last_claim')
    ).first()
    
    return {
        "entities": {
            "participants": total_participants,
            "providers": total_providers,
            "doctors": total_doctors
        },
        "claims": {
            "total_count": total_claims,
            "total_amount": float(total_claim_amount),
            "date_range": {
                "first": date_range.first_claim.isoformat() if date_range.first_claim else None,
                "last": date_range.last_claim.isoformat() if date_range.last_claim else None
            }
        }
    }
