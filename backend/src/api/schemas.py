"""
Pydantic schemas for API request/response models.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import date, datetime
from enum import Enum


class RiskCategory(str, Enum):
    """Risk category levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class InvestigationStatus(str, Enum):
    """Investigation status"""
    QUEUED = "queued"
    IN_PROGRESS = "in_progress"
    CONFIRMED = "confirmed"
    DISMISSED = "dismissed"


# ============================================================================
# Network Schemas
# ============================================================================

class NetworkListItem(BaseModel):
    """Network item in list view"""
    network_id: str
    risk_score: float = Field(..., ge=0, le=100, description="Risk score 0-100")
    risk_category: RiskCategory
    primary_risk_type: str
    total_claim_amount: float
    entity_count: int = Field(..., description="Number of entities in network")
    detected_at: datetime
    investigation_status: InvestigationStatus
    
    class Config:
        json_schema_extra = {
            "example": {
                "network_id": "NET001",
                "risk_score": 85.5,
                "risk_category": "HIGH",
                "primary_risk_type": "CLONING_PATTERN",
                "total_claim_amount": 125000000.0,
                "entity_count": 15,
                "detected_at": "2026-10-03T08:00:00",
                "investigation_status": "queued"
            }
        }


class NetworkListResponse(BaseModel):
    """Response for GET /api/networks"""
    networks: List[NetworkListItem]
    total: int
    page: int
    page_size: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "networks": [],
                "total": 0,
                "page": 1,
                "page_size": 20
            }
        }


class SignalBreakdown(BaseModel):
    """Breakdown of risk signals by detection method"""
    rule_based: float = Field(0.0, description="Contribution from rule-based detection")
    statistical: float = Field(0.0, description="Contribution from statistical anomaly detection")
    graph_analytics: float = Field(0.0, description="Contribution from graph analytics")
    ml_model: float = Field(0.0, description="Contribution from ML models")


class NetworkDetail(BaseModel):
    """Detailed network information"""
    network_id: str
    risk_score: float
    risk_category: RiskCategory
    primary_risk_type: str
    
    # Network composition
    entity_ids: List[str]
    entity_types: Dict[str, int]
    
    # Financial impact
    total_claim_amount: float
    claim_count: int
    
    # Time period
    first_activity_date: date
    last_activity_date: date
    
    # Risk signals
    signal_breakdown: Optional[SignalBreakdown] = None
    explanation: Optional[str] = None
    peer_comparison: Optional[Dict[str, Any]] = None
    
    # Investigation
    investigation_status: InvestigationStatus
    assigned_to: Optional[str] = None
    detected_at: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "network_id": "NET001",
                "risk_score": 85.5,
                "risk_category": "HIGH",
                "primary_risk_type": "CLONING_PATTERN",
                "entity_ids": ["PROV001", "DOC045", "P00123"],
                "entity_types": {"provider": 1, "doctor": 1, "participant": 1},
                "total_claim_amount": 125000000.0,
                "claim_count": 150,
                "first_activity_date": "2026-01-15",
                "last_activity_date": "2026-09-30",
                "signal_breakdown": {
                    "rule_based": 60.0,
                    "statistical": 25.0,
                    "graph_analytics": 15.0,
                    "ml_model": 0.0
                },
                "explanation": "Network menunjukkan pola klaim yang sangat mirip...",
                "investigation_status": "queued",
                "detected_at": "2026-10-03T08:00:00"
            }
        }


# ============================================================================
# Claim Schemas
# ============================================================================

class ClaimItem(BaseModel):
    """Claim information"""
    claim_id: str
    participant_id: str
    provider_id: str
    doctor_id: Optional[str]
    claim_date: date
    claim_amount: float
    diagnosis_codes: List[str]
    procedure_codes: List[str]
    admission_date: Optional[date] = None
    discharge_date: Optional[date] = None
    length_of_stay: Optional[int] = None
    claim_status: str
    
    class Config:
        json_schema_extra = {
            "example": {
                "claim_id": "CLM0000000001",
                "participant_id": "P00000001",
                "provider_id": "PROV000001",
                "doctor_id": "DOC000001",
                "claim_date": "2026-09-15",
                "claim_amount": 5500000.0,
                "diagnosis_codes": ["A09", "J00"],
                "procedure_codes": ["P001", "P010"],
                "admission_date": "2026-09-13",
                "discharge_date": "2026-09-15",
                "length_of_stay": 2,
                "claim_status": "approved"
            }
        }


class ClaimListResponse(BaseModel):
    """Response for claims list"""
    claims: List[ClaimItem]
    total: int
    page: int
    page_size: int


# ============================================================================
# Stats Schemas
# ============================================================================

class StatsResponse(BaseModel):
    """Dashboard statistics"""
    total_networks: int = Field(0, description="Total risk networks detected")
    critical_count: int = Field(0, description="Networks with CRITICAL risk")
    high_count: int = Field(0, description="Networks with HIGH risk")
    medium_count: int = Field(0, description="Networks with MEDIUM risk")
    low_count: int = Field(0, description="Networks with LOW risk")
    total_amount_at_risk: float = Field(0.0, description="Total claim amount in risky networks")
    pending_investigations: int = Field(0, description="Networks queued for investigation")
    
    class Config:
        json_schema_extra = {
            "example": {
                "total_networks": 0,
                "critical_count": 0,
                "high_count": 0,
                "medium_count": 0,
                "low_count": 0,
                "total_amount_at_risk": 0.0,
                "pending_investigations": 0
            }
        }


# ============================================================================
# Filter Schemas
# ============================================================================

class NetworkFilterParams(BaseModel):
    """Query parameters for network filtering"""
    risk_category: Optional[RiskCategory] = None
    region: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    investigation_status: Optional[InvestigationStatus] = None
    page: int = Field(1, ge=1)
    page_size: int = Field(20, ge=1, le=100)
    sort_by: str = Field("risk_score", description="Sort field")
    sort_order: str = Field("desc", description="Sort order (asc/desc)")


# ============================================================================
# Health Check Schema
# ============================================================================

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    database: str
    timestamp: datetime
    
    class Config:
        json_schema_extra = {
            "example": {
                "status": "healthy",
                "version": "1.0.0",
                "database": "connected",
                "timestamp": "2026-10-03T08:00:00"
            }
        }
