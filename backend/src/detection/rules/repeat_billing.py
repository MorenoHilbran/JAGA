"""
Repeat Billing Detection Rule

Detects potential duplicate billing where the same service is billed multiple times
for the same patient at the same provider within a short time window.

This pattern may indicate billing errors or intentional duplicate claims.
"""

from typing import List, Dict, Any, Tuple
from datetime import timedelta
from collections import defaultdict

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from .base import BaseRule, RiskSignal, SignalType, EntityType
from src.models import Claim, Provider, Participant


class RepeatBillingRule(BaseRule):
    """
    Detects repeat billing patterns.
    
    Algorithm:
    1. For each participant, find claims at same provider within time window
    2. Check if same procedure codes are billed multiple times
    3. Exclude legitimate follow-ups (based on diagnosis and time gap)
    4. Flag potential duplicates
    """
    
    @property
    def rule_name(self) -> str:
        return "Repeat Billing Detection"
    
    @property
    def rule_type(self) -> SignalType:
        return SignalType.REPEAT_BILLING
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize repeat billing rule.
        
        Config parameters:
        - time_window_days: Max days between claims to consider duplicates (default: 7)
        - min_duplicate_pairs: Minimum duplicate pairs to flag provider (default: 3)
        - exclude_followup_diagnoses: List of diagnosis patterns that allow repeats (default: [])
        """
        default_config = {
            "time_window_days": 7,
            "min_duplicate_pairs": 3,
            "exclude_followup_diagnoses": [
                "Z",  # Follow-up codes
                "O",  # Pregnancy/delivery (can have multiple visits)
            ],
        }
        if config:
            default_config.update(config)
        super().__init__(default_config)
    
    def _is_legitimate_followup(self, claim1: Claim, claim2: Claim) -> bool:
        """
        Check if claims represent legitimate follow-up visits.
        
        Args:
            claim1: First claim
            claim2: Second claim
            
        Returns:
            True if likely legitimate follow-up
        """
        # Check if diagnosis codes indicate follow-up
        for diagnosis in (claim1.diagnosis_codes or []) + (claim2.diagnosis_codes or []):
            for pattern in self.config["exclude_followup_diagnoses"]:
                if diagnosis.startswith(pattern):
                    return True
        
        # Check if procedures are different (indicates progression of treatment)
        proc1 = set(claim1.procedure_codes or [])
        proc2 = set(claim2.procedure_codes or [])
        
        if proc1 != proc2:
            return True  # Different procedures, likely not duplicate
        
        return False
    
    def _find_duplicate_pairs(
        self, 
        db_session: Session
    ) -> Dict[str, List[Tuple[Claim, Claim]]]:
        """
        Find all potential duplicate claim pairs grouped by provider.
        
        Args:
            db_session: Database session
            
        Returns:
            Dictionary mapping provider_id to list of duplicate claim pairs
        """
        provider_duplicates: Dict[str, List[Tuple[Claim, Claim]]] = defaultdict(list)
        
        # Get all participants with multiple claims
        participant_ids = db_session.query(
            Claim.participant_id
        ).group_by(
            Claim.participant_id
        ).having(
            func.count(Claim.claim_id) >= 2
        ).all()
        
        participant_ids = [p[0] for p in participant_ids]
        
        print(f"  Checking {len(participant_ids)} participants with multiple claims...")
        
        time_window = timedelta(days=self.config["time_window_days"])
        
        for participant_id in participant_ids:
            # Get all claims for this participant, sorted by date
            claims = db_session.query(Claim).filter(
                Claim.participant_id == participant_id
            ).order_by(Claim.claim_date).all()
            
            # Check each pair of claims
            for i in range(len(claims)):
                for j in range(i + 1, len(claims)):
                    claim1 = claims[i]
                    claim2 = claims[j]
                    
                    # Skip if not same provider
                    if claim1.provider_id != claim2.provider_id:
                        continue
                    
                    # Skip if outside time window
                    date_diff = abs((claim2.claim_date - claim1.claim_date).days)
                    if date_diff > self.config["time_window_days"]:
                        continue
                    
                    # Skip if legitimate follow-up
                    if self._is_legitimate_followup(claim1, claim2):
                        continue
                    
                    # Check if same procedures
                    proc1 = set(claim1.procedure_codes or [])
                    proc2 = set(claim2.procedure_codes or [])
                    
                    if proc1 == proc2 and len(proc1) > 0:
                        # Potential duplicate
                        provider_duplicates[claim1.provider_id].append((claim1, claim2))
        
        return provider_duplicates
    
    def execute(self, db_session: Session) -> List[RiskSignal]:
        """
        Execute repeat billing detection.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            List of RiskSignal objects
        """
        signals = []
        
        print(f"  Analyzing for repeat billing patterns...")
        print(f"  Time window: {self.config['time_window_days']} days")
        print(f"  Min duplicate pairs threshold: {self.config['min_duplicate_pairs']}")
        
        # Find all duplicate pairs
        provider_duplicates = self._find_duplicate_pairs(db_session)
        
        print(f"  Found potential duplicates at {len(provider_duplicates)} providers")
        
        flagged = 0
        
        for provider_id, duplicate_pairs in provider_duplicates.items():
            # Only flag if minimum threshold met
            if len(duplicate_pairs) < self.config["min_duplicate_pairs"]:
                continue
            
            flagged += 1
            
            # Get provider info
            provider = db_session.query(Provider).filter(
                Provider.provider_id == provider_id
            ).first()
            
            # Calculate risk score
            pair_count_score = min(100, len(duplicate_pairs) * 15)  # 15 per pair
            
            # Calculate total duplicate amount
            total_duplicate_amount = sum(
                claim1.claim_amount + claim2.claim_amount 
                for claim1, claim2 in duplicate_pairs
            )
            
            # Financial impact score
            financial_score = min(100, (total_duplicate_amount / 1000000) * 10)  # Per million Rp
            
            risk_score = (pair_count_score * 0.6 + financial_score * 0.4)
            
            # Build evidence
            evidence = {
                "provider_id": provider_id,
                "provider_name": provider.provider_name if provider else "Unknown",
                "duplicate_pair_count": len(duplicate_pairs),
                "total_duplicate_amount": total_duplicate_amount,
                "duplicate_pairs": []
            }
            
            # Add details for each duplicate pair (limit to top 10)
            for claim1, claim2 in sorted(
                duplicate_pairs, 
                key=lambda x: x[0].claim_amount + x[1].claim_amount, 
                reverse=True
            )[:10]:
                days_apart = abs((claim2.claim_date - claim1.claim_date).days)
                
                pair_info = {
                    "claim_id_1": claim1.claim_id,
                    "claim_id_2": claim2.claim_id,
                    "participant_id": claim1.participant_id,
                    "claim_date_1": str(claim1.claim_date),
                    "claim_date_2": str(claim2.claim_date),
                    "days_apart": days_apart,
                    "procedure_codes": claim1.procedure_codes,
                    "diagnosis_codes_1": claim1.diagnosis_codes,
                    "diagnosis_codes_2": claim2.diagnosis_codes,
                    "amount_1": claim1.claim_amount,
                    "amount_2": claim2.claim_amount,
                    "total_amount": claim1.claim_amount + claim2.claim_amount
                }
                evidence["duplicate_pairs"].append(pair_info)
            
            # Get unique participants affected
            unique_participants = set(
                claim1.participant_id 
                for claim1, claim2 in duplicate_pairs
            )
            
            evidence["affected_participant_count"] = len(unique_participants)
            
            # Create explanation
            top_pair = duplicate_pairs[0]
            days_apart = abs((top_pair[1].claim_date - top_pair[0].claim_date).days)
            
            explanation = (
                f"Terdeteksi {len(duplicate_pairs)} pasangan klaim duplikat "
                f"di {provider.provider_name if provider else 'provider ini'} "
                f"yang melibatkan {len(unique_participants)} pasien. "
                f"Prosedur dan diagnosis yang sama ditagih berkali-kali dalam periode {self.config['time_window_days']} hari. "
                f"Contoh: prosedur {', '.join(top_pair[0].procedure_codes[:3])} "
                f"ditagih 2 kali dengan selang {days_apart} hari "
                f"(total Rp {top_pair[0].claim_amount + top_pair[1].claim_amount:,.0f}). "
                f"Total nilai duplikasi: Rp {total_duplicate_amount:,.0f}. "
                f"Pola ini mengindikasikan potensi duplicate billing atau kesalahan sistem."
            )
            
            # Create signal
            signal = self.create_signal(
                entity_type=EntityType.PROVIDER,
                entity_id=provider_id,
                signal_score=risk_score,
                evidence=evidence,
                explanation=explanation,
                related_entities={
                    "providers": [provider_id],
                    "participants": list(unique_participants)[:50],  # Limit
                    "claims": [c.claim_id for pair in duplicate_pairs for c in pair][:100]  # Limit
                }
            )
            
            signals.append(signal)
        
        print(f"  Flagged {flagged} providers with repeat billing patterns")
        
        return signals
