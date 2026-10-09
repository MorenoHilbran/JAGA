"""
Detection Pipeline Runner

Executes all detection rules and saves risk signals to the database.
This script is the main entry point for running the fraud detection engine.

Usage:
    python scripts/run_detection_rules.py [--run-id RUN_ID] [--save]
"""

import sys
import os
from pathlib import Path
from datetime import datetime
import uuid
import argparse

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from src.database import engine, SessionLocal
from src.models import RiskSignal, Base
from src.detection.rules.base import RuleEngine
from src.detection.rules.cloning import CloningDetectionRule
from src.detection.rules.referral_concentration import ReferralConcentrationRule
from src.detection.rules.prolonged_los import ProlongedLOSRule
from src.detection.rules.repeat_billing import RepeatBillingRule


def save_signals_to_db(db_session: Session, signals: list, run_id: str) -> int:
    """
    Save risk signals to the database.
    
    Args:
        db_session: Database session
        signals: List of RiskSignal objects
        run_id: Detection run ID
        
    Returns:
        Number of signals saved
    """
    print(f"\n{'='*60}")
    print("Saving signals to database...")
    print(f"{'='*60}")
    
    saved_count = 0
    
    for signal in signals:
        try:
            # Convert to database model
            db_signal = RiskSignal(
                entity_type=signal.entity_type.value,
                entity_id=signal.entity_id,
                signal_type=signal.signal_type.value,
                detection_method=signal.detection_method.value,
                signal_score=signal.signal_score,
                confidence=signal.confidence,
                evidence=signal.evidence,
                explanation=signal.explanation,
                related_entities=signal.related_entities,
                related_claim_id=signal.related_claim_id,
                detected_at=signal.detected_at,
                detection_run_id=run_id
            )
            
            db_session.add(db_signal)
            saved_count += 1
            
        except Exception as e:
            print(f"  ⚠ Error saving signal for {signal.entity_id}: {e}")
            continue
    
    # Commit all signals
    try:
        db_session.commit()
        print(f"✓ Successfully saved {saved_count} signals to database")
    except Exception as e:
        db_session.rollback()
        print(f"✗ Error committing signals: {e}")
        raise
    
    return saved_count


def print_summary(signals: list, execution_stats: dict):
    """
    Print detection run summary.
    
    Args:
        signals: List of RiskSignal objects
        execution_stats: Dictionary with execution statistics
    """
    print(f"\n{'='*60}")
    print("DETECTION RUN SUMMARY")
    print(f"{'='*60}")
    
    # Overall statistics
    print(f"\nTotal signals generated: {len(signals)}")
    
    # By signal type
    print("\nSignals by type:")
    signal_types = {}
    for signal in signals:
        signal_type = signal.signal_type.value
        signal_types[signal_type] = signal_types.get(signal_type, 0) + 1
    
    for signal_type, count in sorted(signal_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {signal_type}: {count}")
    
    # By entity type
    print("\nSignals by entity type:")
    entity_types = {}
    for signal in signals:
        entity_type = signal.entity_type.value
        entity_types[entity_type] = entity_types.get(entity_type, 0) + 1
    
    for entity_type, count in sorted(entity_types.items(), key=lambda x: x[1], reverse=True):
        print(f"  - {entity_type}: {count}")
    
    # Risk score distribution
    print("\nRisk score distribution:")
    critical = sum(1 for s in signals if s.signal_score >= 80)
    high = sum(1 for s in signals if 60 <= s.signal_score < 80)
    medium = sum(1 for s in signals if 30 <= s.signal_score < 60)
    low = sum(1 for s in signals if s.signal_score < 30)
    
    print(f"  - CRITICAL (≥80): {critical}")
    print(f"  - HIGH (60-79): {high}")
    print(f"  - MEDIUM (30-59): {medium}")
    print(f"  - LOW (<30): {low}")
    
    # Execution statistics
    print("\nRule execution statistics:")
    total_time = 0
    for rule_name, stats in execution_stats.items():
        exec_time = stats['execution_time_seconds']
        total_time += exec_time
        status_icon = "✓" if stats['status'] == 'success' else "✗"
        print(f"  {status_icon} {rule_name}: {stats['signals_generated']} signals in {exec_time:.2f}s")
    
    print(f"\nTotal execution time: {total_time:.2f}s")
    
    # Top flagged entities
    print("\nTop 10 flagged entities by risk score:")
    top_signals = sorted(signals, key=lambda x: x.signal_score, reverse=True)[:10]
    for i, signal in enumerate(top_signals, 1):
        print(f"  {i}. {signal.entity_type.value} {signal.entity_id}: "
              f"{signal.signal_score:.1f} ({signal.signal_type.value})")
    
    print(f"\n{'='*60}\n")


def main():
    """Main execution function"""
    parser = argparse.ArgumentParser(description="Run fraud detection rules")
    parser.add_argument(
        '--run-id', 
        type=str, 
        default=None,
        help='Detection run ID (auto-generated if not provided)'
    )
    parser.add_argument(
        '--save',
        action='store_true',
        help='Save signals to database'
    )
    parser.add_argument(
        '--rules',
        nargs='+',
        help='Specific rules to run (default: all)',
        choices=['cloning', 'referral', 'los', 'repeat']
    )
    
    args = parser.parse_args()
    
    # Generate run ID
    run_id = args.run_id or f"run_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}"
    
    print(f"\n{'='*60}")
    print("JAGA FRAUD DETECTION ENGINE")
    print(f"{'='*60}")
    print(f"Run ID: {run_id}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print(f"Save to database: {args.save}")
    print(f"{'='*60}\n")
    
    # Create database session
    db_session = SessionLocal()
    
    try:
        # Initialize rule engine
        engine = RuleEngine(db_session)
        
        # Register rules based on arguments
        if args.rules:
            print("Registering selected rules...")
            if 'cloning' in args.rules:
                engine.register_rule(CloningDetectionRule())
            if 'referral' in args.rules:
                engine.register_rule(ReferralConcentrationRule())
            if 'los' in args.rules:
                engine.register_rule(ProlongedLOSRule())
            if 'repeat' in args.rules:
                engine.register_rule(RepeatBillingRule())
        else:
            print("Registering all rules...")
            engine.register_rule(CloningDetectionRule())
            engine.register_rule(ReferralConcentrationRule())
            engine.register_rule(ProlongedLOSRule())
            engine.register_rule(RepeatBillingRule())
        
        print(f"Registered {len(engine.list_rules())} rules\n")
        
        # Execute all rules
        signals = engine.execute_all(detection_run_id=run_id)
        
        # Get execution statistics
        execution_stats = engine.get_stats()
        
        # Print summary
        print_summary(signals, execution_stats)
        
        # Save to database if requested
        if args.save:
            saved_count = save_signals_to_db(db_session, signals, run_id)
            print(f"\n✓ Detection run complete: {saved_count} signals saved")
        else:
            print("\n⚠ Signals not saved (use --save flag to save to database)")
        
        return 0
        
    except Exception as e:
        print(f"\n✗ Error during detection run: {e}")
        import traceback
        traceback.print_exc()
        return 1
        
    finally:
        db_session.close()


if __name__ == "__main__":
    sys.exit(main())
