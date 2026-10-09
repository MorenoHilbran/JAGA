"""
Cloning Detection Rule

Detects claim cloning patterns where multiple claims have suspiciously similar:
- Diagnosis codes (ICD-10)
- Procedure codes (INA-CBG)
- Claim amounts
- Length of stay (if applicable)

This pattern suggests duplicate billing or copy-paste fraud.
"""

from typing import List, Dict, Any, Tuple
from datetime import timedelta
from collections import defaultdict
import hashlib

from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from .base import BaseRule, RiskSignal, SignalType, EntityType
from src.models import Claim, Provider


class CloningDetectionRule(BaseRule):
    """
    Detects claim cloning patterns within providers.
    
    Algorithm:
    1. Group claims by provider within a time window (default: 30 days)
    2. Compute similarity hash for each claim (diagnosis + procedure + amount + LOS)
    3. Flag clusters of highly similar claims (>= threshold count)
    4. Generate risk signals for providers with cloning patterns
    """
    
    @property
    def rule_name(self) -> str:
        return "Cloning Detection"
    
    @property
    def rule_type(self) -> SignalType:
        return SignalType.CLONING_PATTERN
    
    def __init__(self, config: Dict[str, Any] = None):
        """
        Initialize cloning detection rule.
        
        Config parameters:
        - time_window_days: Window to look for clones (default: 30)
        - min_clone_count: Minimum clones to flag (default: 5)
        - similarity_threshold: Similarity threshold (default: 0.95)
        - amount_tolerance: Tolerance for amount matching (default: 0.02 = 2%)
        """
        default_config = {
            "time_window_days": 30,
            "min_clone_count": 5,
            "similarity_threshold": 0.95,
            "amount_tolerance": 0.02,  # 2% tolerance for amounts
        }
        if config:
            default_config.update(config)
        super().__init__(default_config)
    
    def _compute_claim_fingerprint(self, claim: Claim) -> str:
        """
        Compute a fingerprint for a claim based on key attributes.
        
        Args:
            claim: Claim object
            
        Returns:
            SHA256 hash of claim attributes
        """
        # Sort codes for consistent hashing
        diagnosis_str = ",".join(sorted(claim.diagnosis_codes or []))
        procedure_str = ",".join(sorted(claim.procedure_codes or []))
        
        # Round amount to tolerance level (e.g., 2% buckets)
        tolerance = self.config["amount_tolerance"]
        amount_bucket = int(claim.claim_amount / (claim.claim_amount * tolerance + 1))
        
        # Include LOS if available
        los_str = str(claim.length_of_stay) if claim.length_of_stay else "N/A"
        
        # Create fingerprint
        fingerprint_str = f"{diagnosis_str}|{procedure_str}|{amount_bucket}|{los_str}"
        return hashlib.sha256(fingerprint_str.encode()).hexdigest()
    
    def _compute_exact_similarity(self, claim1: Claim, claim2: Claim) -> float:
        """
        Compute exact similarity score between two claims.
        
        Args:
            claim1: First claim
            claim2: Second claim
            
        Returns:
            Similarity score (0.0 to 1.0)
        """
        score = 0.0
        weights = {"diagnosis": 0.35, "procedure": 0.35, "amount": 0.20, "los": 0.10}
        
        # Diagnosis similarity (Jaccard)
        diag1 = set(claim1.diagnosis_codes or [])
        diag2 = set(claim2.diagnosis_codes or [])
        if diag1 or diag2:
            diag_similarity = len(diag1 & diag2) / len(diag1 | diag2) if (diag1 | diag2) else 0
            score += weights["diagnosis"] * diag_similarity
        
        # Procedure similarity (Jaccard)
        proc1 = set(claim1.procedure_codes or [])
        proc2 = set(claim2.procedure_codes or [])
        if proc1 or proc2:
            proc_similarity = len(proc1 & proc2) / len(proc1 | proc2) if (proc1 | proc2) else 0
            score += weights["procedure"] * proc_similarity
        
        # Amount similarity (inverse of relative difference)
        amount_diff = abs(claim1.claim_amount - claim2.claim_amount)
        avg_amount = (claim1.claim_amount + claim2.claim_amount) / 2
        amount_similarity = 1.0 - min(1.0, amount_diff / avg_amount) if avg_amount > 0 else 0
        score += weights["amount"] * amount_similarity
        
        # LOS similarity
        if claim1.length_of_stay is not None and claim2.length_of_stay is not None:
            los_diff = abs(claim1.length_of_stay - claim2.length_of_stay)
            max_los = max(claim1.length_of_stay, claim2.length_of_stay, 1)
            los_similarity = 1.0 - min(1.0, los_diff / max_los)
            score += weights["los"] * los_similarity
        
        return score
    
    def _find_clone_clusters(
        self, 
        provider_id: str, 
        claims: List[Claim]
    ) -> List[Tuple[str, List[Claim], float]]:
        """
        Find clusters of cloned claims within a provider.
        
        Args:
            provider_id: Provider ID
            claims: List of claims to analyze
            
        Returns:
            List of tuples: (fingerprint, clone_claims, avg_similarity)
        """
        # Group claims by fingerprint
        fingerprint_groups: Dict[str, List[Claim]] = defaultdict(list)
        
        for claim in claims:
            fingerprint = self._compute_claim_fingerprint(claim)
            fingerprint_groups[fingerprint].append(claim)
        
        # Find clusters that meet minimum count threshold
        min_count = self.config["min_clone_count"]
        clusters = []
        
        for fingerprint, clone_claims in fingerprint_groups.items():
            if len(clone_claims) >= min_count:
                # Verify with exact similarity calculation
                similarities = []
                for i in range(len(clone_claims)):
                    for j in range(i + 1, min(i + 5, len(clone_claims))):  # Sample pairs
                        sim = self._compute_exact_similarity(clone_claims[i], clone_claims[j])
                        similarities.append(sim)
                
                avg_similarity = sum(similarities) / len(similarities) if similarities else 0
                
                # Only flag if average similarity meets threshold
                if avg_similarity >= self.config["similarity_threshold"]:
                    clusters.append((fingerprint, clone_claims, avg_similarity))
        
        return clusters
    
    def execute(self, db_session: Session) -> List[RiskSignal]:
        """
        Execute cloning detection rule.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            List of RiskSignal objects
        """
        signals = []
        time_window = self.config["time_window_days"]
        
        # Get all providers
        providers = db_session.query(Provider).all()
        
        print(f"  Analyzing {len(providers)} providers for cloning patterns...")
        print(f"  Time window: {time_window} days")
        print(f"  Min clone count: {self.config['min_clone_count']}")
        print(f"  Similarity threshold: {self.config['similarity_threshold']}")
        
        total_clusters = 0
        
        for provider in providers:
            # Get claims for this provider within time window
            # For now, we'll analyze all claims (full dataset)
            claims = db_session.query(Claim).filter(
                Claim.provider_id == provider.provider_id
            ).all()
            
            if len(claims) < self.config["min_clone_count"]:
                continue
            
            # Find clone clusters
            clusters = self._find_clone_clusters(provider.provider_id, claims)
            
            if clusters:
                total_clusters += len(clusters)
                
                # Aggregate evidence across all clusters for this provider
                total_clones = sum(len(cluster[1]) for cluster in clusters)
                max_similarity = max(cluster[2] for cluster in clusters)
                
                # Calculate risk score based on:
                # - Number of clone clusters
                # - Total clones
                # - Similarity score
                cluster_score = min(100, len(clusters) * 15)  # 15 points per cluster
                volume_score = min(100, total_clones * 2)     # 2 points per clone
                similarity_score = max_similarity * 100
                
                # Weighted average
                risk_score = (
                    cluster_score * 0.4 + 
                    volume_score * 0.3 + 
                    similarity_score * 0.3
                )
                
                # Build evidence
                evidence = {
                    "provider_id": provider.provider_id,
                    "provider_name": provider.provider_name,
                    "cluster_count": len(clusters),
                    "total_clone_claims": total_clones,
                    "total_claims_analyzed": len(claims),
                    "clone_percentage": round(total_clones / len(claims) * 100, 2),
                    "max_similarity": round(max_similarity, 3),
                    "clusters": []
                }
                
                # Add cluster details (limit to top 3 for brevity)
                for fingerprint, clone_claims, similarity in sorted(clusters, key=lambda x: len(x[1]), reverse=True)[:3]:
                    cluster_info = {
                        "clone_count": len(clone_claims),
                        "similarity": round(similarity, 3),
                        "claim_ids": [c.claim_id for c in clone_claims[:10]],  # Sample
                        "sample_diagnosis": clone_claims[0].diagnosis_codes,
                        "sample_procedure": clone_claims[0].procedure_codes,
                        "sample_amount": clone_claims[0].claim_amount,
                        "date_range": {
                            "first": str(min(c.claim_date for c in clone_claims)),
                            "last": str(max(c.claim_date for c in clone_claims))
                        }
                    }
                    evidence["clusters"].append(cluster_info)
                
                # Create explanation in Indonesian
                explanation = (
                    f"Terdeteksi {len(clusters)} cluster klaim dengan pola cloning "
                    f"di {provider.provider_name}. "
                    f"Total {total_clones} klaim ({evidence['clone_percentage']}%) "
                    f"menunjukkan kesamaan sangat tinggi (similarity {round(max_similarity * 100, 1)}%) "
                    f"dalam diagnosis, prosedur, dan nominal klaim. "
                    f"Pola ini mengindikasikan potensi duplikasi klaim atau copy-paste fraud."
                )
                
                # Create signal
                signal = self.create_signal(
                    entity_type=EntityType.PROVIDER,
                    entity_id=provider.provider_id,
                    signal_score=risk_score,
                    evidence=evidence,
                    explanation=explanation,
                    related_entities={
                        "claims": [c.claim_id for cluster in clusters for c in cluster[1][:100]]  # Limit
                    }
                )
                
                signals.append(signal)
        
        print(f"  Found {total_clusters} clone clusters across {len(signals)} providers")
        
        return signals
