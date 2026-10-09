"""
Base classes for detection rules engine.

This module provides the foundation for implementing rule-based fraud detection.
Each rule extends BaseRule and implements custom detection logic.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Dict, Any, Optional
from datetime import datetime
from enum import Enum


class SignalType(str, Enum):
    """Types of risk signals that can be generated"""
    CLONING_PATTERN = "CLONING_PATTERN"
    REFERRAL_CONCENTRATION = "REFERRAL_CONCENTRATION"
    PROLONGED_LOS = "PROLONGED_LOS"
    REPEAT_BILLING = "REPEAT_BILLING"
    UPCODING = "UPCODING"
    PHANTOM_BILLING = "PHANTOM_BILLING"
    MULTIVARIATE_ANOMALY = "MULTIVARIATE_ANOMALY"
    LOCAL_OUTLIER = "LOCAL_OUTLIER"
    STATISTICAL_OUTLIER = "STATISTICAL_OUTLIER"
    HIGH_DEGREE_CENTRALITY = "HIGH_DEGREE_CENTRALITY"
    HIGH_BETWEENNESS_CENTRALITY = "HIGH_BETWEENNESS_CENTRALITY"
    ANOMALOUS_COMMUNITY = "ANOMALOUS_COMMUNITY"
    SUSPICIOUS_MOTIF = "SUSPICIOUS_MOTIF"


class EntityType(str, Enum):
    """Types of entities that can be flagged"""
    PROVIDER = "provider"
    DOCTOR = "doctor"
    PARTICIPANT = "participant"
    CLAIM = "claim"
    NETWORK = "network"


class DetectionMethod(str, Enum):
    """Detection methods"""
    RULE = "rule"
    STATISTICAL = "statistical"
    GRAPH = "graph"
    ML = "ml"


@dataclass
class RiskSignal:
    """
    A risk signal represents a single detection output.
    
    Multiple signals can be aggregated to compute network-level risk scores.
    """
    # What was flagged
    entity_type: EntityType
    entity_id: str
    
    # Type of risk
    signal_type: SignalType
    detection_method: DetectionMethod
    
    # Signal strength
    signal_score: float  # 0-100
    confidence: float = 1.0  # 0-1
    
    # Evidence and explanation
    evidence: Dict[str, Any] = field(default_factory=dict)
    explanation: Optional[str] = None
    
    # Related entities
    related_entities: Dict[str, List[str]] = field(default_factory=dict)
    related_claim_id: Optional[str] = None
    
    # Metadata
    detected_at: datetime = field(default_factory=datetime.now)
    detection_run_id: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for database insertion"""
        return {
            "entity_type": self.entity_type.value,
            "entity_id": self.entity_id,
            "signal_type": self.signal_type.value,
            "detection_method": self.detection_method.value,
            "signal_score": self.signal_score,
            "confidence": self.confidence,
            "evidence": self.evidence,
            "explanation": self.explanation,
            "related_entities": self.related_entities,
            "related_claim_id": self.related_claim_id,
            "detected_at": self.detected_at,
            "detection_run_id": self.detection_run_id,
        }


class BaseRule(ABC):
    """
    Abstract base class for all detection rules.
    
    Each rule implements execute() method that returns a list of RiskSignals.
    """
    
    def __init__(self, config: Optional[Dict[str, Any]] = None):
        """
        Initialize rule with optional configuration.
        
        Args:
            config: Rule-specific configuration (thresholds, parameters, etc.)
        """
        self.config = config or {}
        self._signals: List[RiskSignal] = []
    
    @property
    @abstractmethod
    def rule_name(self) -> str:
        """Human-readable rule name"""
        pass
    
    @property
    @abstractmethod
    def rule_type(self) -> SignalType:
        """Type of signal this rule generates"""
        pass
    
    @property
    def detection_method(self) -> DetectionMethod:
        """Detection method (always 'rule' for rule-based detection)"""
        return DetectionMethod.RULE
    
    @property
    def default_confidence(self) -> float:
        """Default confidence level for this rule (0-1)"""
        return 0.85
    
    @abstractmethod
    def execute(self, db_session) -> List[RiskSignal]:
        """
        Execute the detection rule.
        
        Args:
            db_session: SQLAlchemy database session
            
        Returns:
            List of RiskSignal objects
        """
        pass
    
    def create_signal(
        self,
        entity_type: EntityType,
        entity_id: str,
        signal_score: float,
        evidence: Dict[str, Any],
        explanation: Optional[str] = None,
        related_entities: Optional[Dict[str, List[str]]] = None,
        related_claim_id: Optional[str] = None,
        confidence: Optional[float] = None,
    ) -> RiskSignal:
        """
        Helper method to create a RiskSignal with rule defaults.
        
        Args:
            entity_type: Type of entity being flagged
            entity_id: ID of the entity
            signal_score: Risk score (0-100)
            evidence: Dictionary with supporting evidence
            explanation: Human-readable explanation
            related_entities: Dictionary mapping entity types to entity IDs
            related_claim_id: Related claim ID if applicable
            confidence: Confidence level (defaults to rule's default_confidence)
            
        Returns:
            RiskSignal object
        """
        return RiskSignal(
            entity_type=entity_type,
            entity_id=entity_id,
            signal_type=self.rule_type,
            detection_method=self.detection_method,
            signal_score=signal_score,
            confidence=confidence or self.default_confidence,
            evidence=evidence,
            explanation=explanation,
            related_entities=related_entities or {},
            related_claim_id=related_claim_id,
        )


class RuleEngine:
    """
    Rule execution engine that manages and executes multiple detection rules.
    """
    
    def __init__(self, db_session):
        """
        Initialize the rule engine.
        
        Args:
            db_session: SQLAlchemy database session
        """
        self.db_session = db_session
        self.rules: Dict[str, BaseRule] = {}
        self.execution_stats: Dict[str, Any] = {}
    
    def register_rule(self, rule: BaseRule) -> None:
        """
        Register a detection rule.
        
        Args:
            rule: Instance of a BaseRule subclass
        """
        self.rules[rule.rule_name] = rule
        print(f"[OK] Registered rule: {rule.rule_name}")
    
    def register_rules(self, rules: List[BaseRule]) -> None:
        """
        Register multiple detection rules.
        
        Args:
            rules: List of BaseRule instances
        """
        for rule in rules:
            self.register_rule(rule)
    
    def execute_rule(self, rule_name: str, detection_run_id: Optional[str] = None) -> List[RiskSignal]:
        """
        Execute a single rule by name.
        
        Args:
            rule_name: Name of the rule to execute
            detection_run_id: Optional run ID to tag signals
            
        Returns:
            List of RiskSignal objects generated by the rule
        """
        if rule_name not in self.rules:
            raise ValueError(f"Rule '{rule_name}' is not registered")
        
        rule = self.rules[rule_name]
        print(f"\n>> Executing rule: {rule.rule_name}")
        
        start_time = datetime.now()
        try:
            signals = rule.execute(self.db_session)
            
            # Tag signals with run ID
            if detection_run_id:
                for signal in signals:
                    signal.detection_run_id = detection_run_id
            
            execution_time = (datetime.now() - start_time).total_seconds()
            
            self.execution_stats[rule_name] = {
                "executed_at": start_time,
                "execution_time_seconds": execution_time,
                "signals_generated": len(signals),
                "status": "success"
            }
            
            print(f"  [OK] Generated {len(signals)} signals in {execution_time:.2f}s")
            return signals
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            self.execution_stats[rule_name] = {
                "executed_at": start_time,
                "execution_time_seconds": execution_time,
                "signals_generated": 0,
                "status": "error",
                "error": str(e)
            }
            print(f"  [ERROR] Error executing rule: {e}")
            raise
    
    def execute_all(self, detection_run_id: Optional[str] = None) -> List[RiskSignal]:
        """
        Execute all registered rules.
        
        Args:
            detection_run_id: Optional run ID to tag all signals
            
        Returns:
            Aggregated list of all RiskSignal objects
        """
        all_signals = []
        
        print(f"\n{'='*60}")
        print(f"Starting detection run with {len(self.rules)} rules")
        print(f"Run ID: {detection_run_id or 'N/A'}")
        print(f"{'='*60}")
        
        for rule_name in self.rules:
            try:
                signals = self.execute_rule(rule_name, detection_run_id)
                all_signals.extend(signals)
            except Exception as e:
                print(f"  [WARNING] Continuing despite error in {rule_name}: {e}")
        
        print(f"\n{'='*60}")
        print(f"Detection run complete")
        print(f"Total signals generated: {len(all_signals)}")
        print(f"{'='*60}\n")
        
        return all_signals
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get execution statistics for all rules.
        
        Returns:
            Dictionary with execution stats
        """
        return self.execution_stats
    
    def list_rules(self) -> List[str]:
        """
        Get list of registered rule names.
        
        Returns:
            List of rule names
        """
        return list(self.rules.keys())
