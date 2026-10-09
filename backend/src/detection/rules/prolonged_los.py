"""
Prolonged Length of Stay (LOS) Detection Rule

Detects providers with abnormally long length of stay for specific diagnoses,
which may indicate unnecessary hospitalization to inflate billing.

The rule compares each provider's average LOS per diagnosis to their peer group.
"""

from typing import List, Dict, Any, Tuple
from collections import defaultdict
import statistics

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from .base import BaseRule, RiskSignal, SignalType, EntityType
from src.models import Claim, Provider


class ProlongedLOSRule(BaseRule):
    """
    Detects abnormally long length of stay patterns.
    
    Algorithm:
    1. For each provider, calculate average LOS per diagnosis code
    2. Define peer group (same facility_type + region)
    3. Calculate peer group statistics (median, std dev) for each diagnosis
    4. Flag providers with LOS > threshold above peer median
    """
    
    @property
    def rule_name(self) -> str:
        return "Prolonged Length of Stay Detection"
    
    @property
    def rule_type(self) -> SignalType:
        return SignalType.PROLONGED_LOS
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize prolonged LOS rule.
        
        Config parameters:
        - min_cases: Minimum cases per diagnosis to analyze (default: 5)
        - sigma_threshold: Std dev threshold for flagging (default: 2.0)
        - min_peer_group_size: Minimum peers for comparison (default: 3)
        - min_los_days: Minimum LOS to consider (default: 1)
        """
        default_config = {
            "min_cases": 5,
            "sigma_threshold": 2.0,
            "min_peer_group_size": 3,
            "min_los_days": 1,
        }
        if config:
            default_config.update(config)
        super().__init__(default_config)
    
    def _get_provider_los_by_diagnosis(
        self, 
        db_session: Session, 
        provider_id: str
    ) -> Dict[str, Dict[str, Any]]:
        """
        Calculate average LOS per diagnosis for a provider.
        
        Args:
            db_session: Database session
            provider_id: Provider ID
            
        Returns:
            Dictionary mapping diagnosis code to LOS statistics
        """
        # Get all claims with LOS data
        claims = db_session.query(Claim).filter(
            and_(
                Claim.provider_id == provider_id,
                Claim.length_of_stay.isnot(None),
                Claim.length_of_stay >= self.config["min_los_days"]
            )
        ).all()
        
        # Group by primary diagnosis (first diagnosis code)
        diagnosis_los: Dict[str, List[int]] = defaultdict(list)
        
        for claim in claims:
            if claim.diagnosis_codes and len(claim.diagnosis_codes) > 0:
                primary_diagnosis = claim.diagnosis_codes[0]
                diagnosis_los[primary_diagnosis].append(claim.length_of_stay)
        
        # Calculate statistics for each diagnosis
        los_stats = {}
        for diagnosis, los_values in diagnosis_los.items():
            if len(los_values) >= self.config["min_cases"]:
                los_stats[diagnosis] = {
                    'case_count': len(los_values),
                    'avg_los': statistics.mean(los_values),
                    'median_los': statistics.median(los_values),
                    'max_los': max(los_values),
                    'min_los': min(los_values),
                    'stdev': statistics.stdev(los_values) if len(los_values) > 1 else 0
                }
        
        return los_stats
    
    def _define_peer_group(
        self, 
        db_session: Session, 
        provider: Provider
    ) -> List[str]:
        """
        Define peer group for a provider (same facility_type + region).
        
        Args:
            db_session: Database session
            provider: Provider object
            
        Returns:
            List of peer provider IDs
        """
        peers = db_session.query(Provider).filter(
            and_(
                Provider.facility_type == provider.facility_type,
                Provider.region_code == provider.region_code,
                Provider.provider_id != provider.provider_id
            )
        ).all()
        
        return [p.provider_id for p in peers]
    
    def _calculate_peer_statistics(
        self,
        db_session: Session,
        peer_provider_ids: List[str],
        diagnosis: str
    ) -> Dict[str, float]:
        """
        Calculate peer group statistics for a specific diagnosis.
        
        Args:
            db_session: Database session
            peer_provider_ids: List of peer provider IDs
            diagnosis: Diagnosis code
            
        Returns:
            Dictionary with median and std dev
        """
        if len(peer_provider_ids) < self.config["min_peer_group_size"]:
            return None
        
        peer_avg_los = []
        
        for peer_id in peer_provider_ids:
            peer_los_stats = self._get_provider_los_by_diagnosis(db_session, peer_id)
            if diagnosis in peer_los_stats:
                peer_avg_los.append(peer_los_stats[diagnosis]['avg_los'])
        
        if len(peer_avg_los) < self.config["min_peer_group_size"]:
            return None
        
        return {
            'median': statistics.median(peer_avg_los),
            'mean': statistics.mean(peer_avg_los),
            'stdev': statistics.stdev(peer_avg_los) if len(peer_avg_los) > 1 else 0,
            'sample_size': len(peer_avg_los)
        }
    
    def execute(self, db_session: Session) -> List[RiskSignal]:
        """
        Execute prolonged LOS detection.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            List of RiskSignal objects
        """
        signals = []
        
        # Get all providers
        providers = db_session.query(Provider).all()
        
        print(f"  Analyzing {len(providers)} providers for prolonged LOS...")
        print(f"  Min cases per diagnosis: {self.config['min_cases']}")
        print(f"  Sigma threshold: {self.config['sigma_threshold']}")
        
        analyzed = 0
        flagged = 0
        
        for provider in providers:
            # Get LOS statistics by diagnosis
            los_stats = self._get_provider_los_by_diagnosis(db_session, provider.provider_id)
            
            if not los_stats:
                continue
            
            analyzed += 1
            
            # Define peer group
            peer_ids = self._define_peer_group(db_session, provider)
            
            if not peer_ids or len(peer_ids) < self.config['min_peer_group_size']:
                continue
            
            # Check each diagnosis
            flagged_diagnoses = []
            
            for diagnosis, stats in los_stats.items():
                # Calculate peer statistics for this diagnosis
                peer_stats = self._calculate_peer_statistics(db_session, peer_ids, diagnosis)
                
                if not peer_stats or peer_stats['stdev'] == 0:
                    continue
                
                # Calculate z-score (standard deviations above peer median)
                deviation_sigma = (stats['avg_los'] - peer_stats['median']) / peer_stats['stdev']
                
                # Flag if above threshold
                if deviation_sigma >= self.config['sigma_threshold']:
                    flagged_diagnoses.append({
                        'diagnosis': diagnosis,
                        'avg_los': stats['avg_los'],
                        'case_count': stats['case_count'],
                        'peer_median': peer_stats['median'],
                        'peer_mean': peer_stats['mean'],
                        'peer_stdev': peer_stats['stdev'],
                        'deviation_sigma': deviation_sigma,
                        'peer_sample_size': peer_stats['sample_size']
                    })
            
            if flagged_diagnoses:
                flagged += 1
                
                # Calculate overall risk score
                max_deviation = max(d['deviation_sigma'] for d in flagged_diagnoses)
                avg_deviation = statistics.mean([d['deviation_sigma'] for d in flagged_diagnoses])
                
                deviation_score = min(100, (max_deviation / 5) * 100)  # 5 sigma = 100
                volume_score = min(100, len(flagged_diagnoses) * 20)  # 20 per diagnosis
                
                risk_score = (deviation_score * 0.6 + volume_score * 0.4)
                
                # Build evidence
                evidence = {
                    "provider_id": provider.provider_id,
                    "provider_name": provider.provider_name,
                    "facility_type": provider.facility_type,
                    "region_code": provider.region_code,
                    "flagged_diagnosis_count": len(flagged_diagnoses),
                    "max_deviation_sigma": round(max_deviation, 2),
                    "avg_deviation_sigma": round(avg_deviation, 2),
                    "flagged_diagnoses": [
                        {
                            "diagnosis_code": d['diagnosis'],
                            "case_count": d['case_count'],
                            "avg_los_days": round(d['avg_los'], 1),
                            "peer_median_los_days": round(d['peer_median'], 1),
                            "peer_mean_los_days": round(d['peer_mean'], 1),
                            "deviation_sigma": round(d['deviation_sigma'], 2),
                            "peer_sample_size": d['peer_sample_size']
                        }
                        for d in sorted(flagged_diagnoses, key=lambda x: x['deviation_sigma'], reverse=True)[:5]  # Top 5
                    ]
                }
                
                # Create explanation
                top_diagnosis = flagged_diagnoses[0]
                explanation = (
                    f"{provider.provider_name} ({provider.facility_type}) menunjukkan "
                    f"rata-rata lama rawat abnormal tinggi untuk {len(flagged_diagnoses)} diagnosis. "
                    f"Contoh: diagnosis {top_diagnosis['diagnosis']} dengan rata-rata "
                    f"{top_diagnosis['avg_los']:.1f} hari ({top_diagnosis['case_count']} kasus), "
                    f"dibandingkan peer group {top_diagnosis['peer_median']:.1f} hari "
                    f"(deviasi {top_diagnosis['deviation_sigma']:.1f}σ dari {top_diagnosis['peer_sample_size']} faskes serupa). "
                    f"Pola ini mengindikasikan potensi perpanjangan rawat inap tidak perlu untuk inflasi biaya."
                )
                
                # Create signal
                signal = self.create_signal(
                    entity_type=EntityType.PROVIDER,
                    entity_id=provider.provider_id,
                    signal_score=risk_score,
                    evidence=evidence,
                    explanation=explanation,
                    related_entities={
                        "providers": [provider.provider_id]
                    }
                )
                
                signals.append(signal)
        
        print(f"  Analyzed {analyzed} providers with sufficient LOS data")
        print(f"  Flagged {flagged} providers with prolonged LOS patterns")
        
        return signals
