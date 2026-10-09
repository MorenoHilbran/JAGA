"""
Referral Concentration Detection Rule

Detects doctors who refer an abnormally high percentage of patients to specific providers,
which may indicate kickback schemes or collusion.

The rule compares each doctor's referral pattern to their peer group (same specialty + region).
"""

from typing import List, Dict, Any, Tuple
from collections import defaultdict
import statistics

from sqlalchemy import func
from sqlalchemy.orm import Session

from .base import BaseRule, RiskSignal, SignalType, EntityType
from src.models import Claim, Doctor, Provider


class ReferralConcentrationRule(BaseRule):
    """
    Detects abnormal referral concentration patterns.
    
    Algorithm:
    1. For each doctor, calculate % of patients referred to each provider
    2. Identify peer group (same specialty + region)
    3. Calculate peer group statistics (median, std dev)
    4. Flag doctors with concentration > threshold (e.g., 2 standard deviations above median)
    """
    
    @property
    def rule_name(self) -> str:
        return "Referral Concentration Detection"
    
    @property
    def rule_type(self) -> SignalType:
        return SignalType.REFERRAL_CONCENTRATION
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize referral concentration rule.
        
        Config parameters:
        - min_claims: Minimum claims for doctor to be analyzed (default: 10)
        - sigma_threshold: Std dev threshold for flagging (default: 2.0)
        - min_concentration: Minimum concentration % to flag (default: 70%)
        - min_peer_group_size: Minimum peers for comparison (default: 3)
        """
        default_config = {
            "min_claims": 10,
            "sigma_threshold": 2.0,
            "min_concentration": 70.0,  # 70%
            "min_peer_group_size": 3,
        }
        if config:
            default_config.update(config)
        super().__init__(default_config)
    
    def _get_referral_pattern(
        self, 
        db_session: Session, 
        doctor_id: str
    ) -> Dict[str, Any]:
        """
        Calculate referral pattern for a doctor.
        
        Args:
            db_session: Database session
            doctor_id: Doctor ID
            
        Returns:
            Dictionary with referral statistics
        """
        # Count claims per provider for this doctor
        referral_counts = db_session.query(
            Claim.provider_id,
            func.count(Claim.claim_id).label('claim_count')
        ).filter(
            Claim.doctor_id == doctor_id
        ).group_by(
            Claim.provider_id
        ).all()
        
        if not referral_counts:
            return None
        
        total_claims = sum(count for _, count in referral_counts)
        
        # Calculate concentration (% to top provider)
        top_provider_id, top_count = max(referral_counts, key=lambda x: x[1])
        concentration = (top_count / total_claims) * 100
        
        # Build provider distribution
        provider_distribution = {}
        for provider_id, count in referral_counts:
            provider_distribution[provider_id] = {
                'count': count,
                'percentage': round((count / total_claims) * 100, 2)
            }
        
        return {
            'total_claims': total_claims,
            'provider_count': len(referral_counts),
            'top_provider_id': top_provider_id,
            'top_provider_count': top_count,
            'concentration': round(concentration, 2),
            'provider_distribution': provider_distribution
        }
    
    def _define_peer_group(
        self, 
        db_session: Session, 
        doctor: Doctor
    ) -> List[str]:
        """
        Define peer group for a doctor (same specialty + region).
        
        Args:
            db_session: Database session
            doctor: Doctor object
            
        Returns:
            List of peer doctor IDs
        """
        # Extract region from affiliated providers
        # For simplicity, we'll use the first affiliated provider's region
        if not doctor.affiliated_providers:
            return []
        
        # Get region from first affiliated provider
        provider = db_session.query(Provider).filter(
            Provider.provider_id.in_(doctor.affiliated_providers)
        ).first()
        
        if not provider:
            return []
        
        doctor_region = provider.region_code
        
        # Find doctors with same specialty in same region
        peers = db_session.query(Doctor).join(
            Provider,
            Provider.provider_id.in_(Doctor.affiliated_providers)
        ).filter(
            Doctor.specialty == doctor.specialty,
            Doctor.doctor_id != doctor.doctor_id,
            Provider.region_code == doctor_region
        ).distinct().all()
        
        return [p.doctor_id for p in peers]
    
    def _calculate_peer_statistics(
        self,
        db_session: Session,
        peer_doctor_ids: List[str]
    ) -> Dict[str, float]:
        """
        Calculate peer group statistics for referral concentration.
        
        Args:
            db_session: Database session
            peer_doctor_ids: List of peer doctor IDs
            
        Returns:
            Dictionary with median and std dev
        """
        if len(peer_doctor_ids) < self.config["min_peer_group_size"]:
            return None
        
        concentrations = []
        
        for peer_id in peer_doctor_ids:
            pattern = self._get_referral_pattern(db_session, peer_id)
            if pattern and pattern['total_claims'] >= self.config["min_claims"]:
                concentrations.append(pattern['concentration'])
        
        if len(concentrations) < self.config["min_peer_group_size"]:
            return None
        
        return {
            'median': statistics.median(concentrations),
            'mean': statistics.mean(concentrations),
            'stdev': statistics.stdev(concentrations) if len(concentrations) > 1 else 0,
            'sample_size': len(concentrations)
        }
    
    def execute(self, db_session: Session) -> List[RiskSignal]:
        """
        Execute referral concentration detection.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            List of RiskSignal objects
        """
        signals = []
        
        # Get all doctors with sufficient claim volume
        doctors = db_session.query(Doctor).all()
        
        print(f"  Analyzing {len(doctors)} doctors for referral concentration...")
        print(f"  Min claims threshold: {self.config['min_claims']}")
        print(f"  Sigma threshold: {self.config['sigma_threshold']}")
        
        analyzed = 0
        flagged = 0
        
        for doctor in doctors:
            # Get referral pattern
            pattern = self._get_referral_pattern(db_session, doctor.doctor_id)
            
            if not pattern or pattern['total_claims'] < self.config['min_claims']:
                continue
            
            analyzed += 1
            
            # Check if concentration is above minimum threshold
            if pattern['concentration'] < self.config['min_concentration']:
                continue
            
            # Define peer group
            peer_ids = self._define_peer_group(db_session, doctor)
            
            if not peer_ids or len(peer_ids) < self.config['min_peer_group_size']:
                # No sufficient peer group, flag if concentration is very high (>80%)
                if pattern['concentration'] > 80:
                    peer_stats = None
                    deviation_sigma = None
                    should_flag = True
                else:
                    continue
            else:
                # Calculate peer statistics
                peer_stats = self._calculate_peer_statistics(db_session, peer_ids)
                
                if not peer_stats:
                    continue
                
                # Calculate z-score (standard deviations above peer median)
                if peer_stats['stdev'] > 0:
                    deviation_sigma = (pattern['concentration'] - peer_stats['median']) / peer_stats['stdev']
                else:
                    deviation_sigma = 0
                
                # Flag if above threshold
                should_flag = deviation_sigma >= self.config['sigma_threshold']
            
            if should_flag:
                flagged += 1
                
                # Calculate risk score
                concentration_score = min(100, pattern['concentration'])
                
                if deviation_sigma:
                    deviation_score = min(100, (deviation_sigma / 5) * 100)  # 5 sigma = 100
                    risk_score = (concentration_score * 0.6 + deviation_score * 0.4)
                else:
                    risk_score = concentration_score * 0.8  # Penalize lack of peer comparison
                
                # Get provider name
                top_provider = db_session.query(Provider).filter(
                    Provider.provider_id == pattern['top_provider_id']
                ).first()
                
                # Build evidence
                evidence = {
                    "doctor_id": doctor.doctor_id,
                    "doctor_name": doctor.doctor_name,
                    "specialty": doctor.specialty,
                    "total_claims": pattern['total_claims'],
                    "provider_count": pattern['provider_count'],
                    "top_provider_id": pattern['top_provider_id'],
                    "top_provider_name": top_provider.provider_name if top_provider else "Unknown",
                    "concentration_percentage": pattern['concentration'],
                    "referral_distribution": pattern['provider_distribution']
                }
                
                if peer_stats:
                    evidence["peer_statistics"] = {
                        "peer_count": peer_stats['sample_size'],
                        "peer_median_concentration": round(peer_stats['median'], 2),
                        "peer_mean_concentration": round(peer_stats['mean'], 2),
                        "peer_stdev": round(peer_stats['stdev'], 2),
                        "deviation_sigma": round(deviation_sigma, 2)
                    }
                
                # Create explanation
                if peer_stats:
                    explanation = (
                        f"Dr. {doctor.doctor_name} ({doctor.specialty}) merujuk "
                        f"{pattern['concentration']:.1f}% pasien ({pattern['top_provider_count']} dari {pattern['total_claims']} klaim) "
                        f"ke {top_provider.provider_name if top_provider else 'provider tertentu'}. "
                        f"Dibandingkan peer group ({peer_stats['sample_size']} dokter dengan spesialisasi sama), "
                        f"rata-rata rujukan adalah {peer_stats['median']:.1f}% "
                        f"(deviasi {deviation_sigma:.1f}σ). "
                        f"Pola ini mengindikasikan potensi kickback atau kolusi."
                    )
                else:
                    explanation = (
                        f"Dr. {doctor.doctor_name} ({doctor.specialty}) merujuk "
                        f"{pattern['concentration']:.1f}% pasien ({pattern['top_provider_count']} dari {pattern['total_claims']} klaim) "
                        f"ke {top_provider.provider_name if top_provider else 'provider tertentu'}. "
                        f"Konsentrasi rujukan sangat tinggi (>80%) mengindikasikan potensi kickback atau kolusi."
                    )
                
                # Create signal
                signal = self.create_signal(
                    entity_type=EntityType.DOCTOR,
                    entity_id=doctor.doctor_id,
                    signal_score=risk_score,
                    evidence=evidence,
                    explanation=explanation,
                    related_entities={
                        "providers": [pattern['top_provider_id']],
                        "doctors": [doctor.doctor_id]
                    }
                )
                
                signals.append(signal)
        
        print(f"  Analyzed {analyzed} doctors with sufficient claims")
        print(f"  Flagged {flagged} doctors with abnormal referral concentration")
        
        return signals
