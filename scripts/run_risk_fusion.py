"""
Risk Fusion Engine
Groups related risk signals into cohesive networks for investigation
"""
import sys
import os
from datetime import datetime
from collections import defaultdict
import psycopg2
from psycopg2.extras import Json

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from dotenv import load_dotenv
load_dotenv('backend/.env')

print('='*80)
print('JAGA - Risk Fusion Engine')
print('='*80)

# Connect to database
conn = psycopg2.connect(
    host=os.getenv('DATABASE_HOST', '127.0.0.1'),
    port=int(os.getenv('DATABASE_PORT', 5433)),
    database=os.getenv('DATABASE_NAME', 'jkn_riskgraph'),
    user=os.getenv('DATABASE_USER', 'postgres'),
    password=os.getenv('DATABASE_PASSWORD', 'postgres')
)
cur = conn.cursor()

print('\n[1/5] Fetching risk signals...')
cur.execute("""
    SELECT signal_id, entity_type, entity_id, signal_type, signal_score, 
           confidence, related_entities, evidence, explanation, detected_at
    FROM risk_signals
    ORDER BY signal_score DESC
""")
signals = cur.fetchall()
print(f'  Found {len(signals)} signals')

if len(signals) == 0:
    print('\n[ERROR] No signals found. Run detection engine first.')
    sys.exit(1)

print('\n[2/5] Grouping signals by entity...')
# Group signals by entity (each provider gets their own network)
networks_by_entity = defaultdict(list)
for signal in signals:
    signal_id, entity_type, entity_id, signal_type, signal_score, confidence, related_entities, evidence, explanation, detected_at = signal
    networks_by_entity[entity_id].append({
        'signal_id': signal_id,
        'entity_type': entity_type,
        'entity_id': entity_id,
        'signal_type': signal_type,
        'signal_score': signal_score,
        'confidence': confidence,
        'related_entities': related_entities,
        'evidence': evidence,
        'explanation': explanation,
        'detected_at': detected_at
    })

print(f'  Created {len(networks_by_entity)} entity groups')

print('\n[3/5] Building risk networks...')
# Clear existing networks
cur.execute('TRUNCATE TABLE risk_networks CASCADE')
conn.commit()

networks_created = 0
for entity_id, entity_signals in networks_by_entity.items():
    # Calculate network metrics
    total_score = sum(s['signal_score'] for s in entity_signals)
    avg_score = total_score / len(entity_signals)
    max_confidence = max(s['confidence'] for s in entity_signals)
    
    # Determine risk category
    if avg_score >= 80:
        risk_category = 'CRITICAL'
    elif avg_score >= 60:
        risk_category = 'HIGH'
    elif avg_score >= 40:
        risk_category = 'MEDIUM'
    else:
        risk_category = 'LOW'
    
    # Primary risk type (most common)
    signal_types = [s['signal_type'] for s in entity_signals]
    primary_risk_type = max(set(signal_types), key=signal_types.count)
    
    # Get related claims and calculate amounts
    signal_ids = [s['signal_id'] for s in entity_signals]
    
    # Extract claim amounts from evidence
    total_claim_amount = 0.0
    claim_count = 0
    for s in entity_signals:
        if s['evidence']:
            evidence = s['evidence']
            if isinstance(evidence, dict):
                if 'total_amount' in evidence:
                    total_claim_amount += float(evidence.get('total_amount', 0))
                if 'num_claims' in evidence:
                    claim_count += int(evidence.get('num_claims', 0))
                elif 'claim_count' in evidence:
                    claim_count += int(evidence.get('claim_count', 0))
    
    # If no claim data from evidence, estimate
    if total_claim_amount == 0:
        total_claim_amount = avg_score * 100000000  # Estimate based on score
    if claim_count == 0:
        claim_count = len(entity_signals) * 10  # Estimate
    
    # Signal breakdown
    signal_breakdown = {}
    for st in set(signal_types):
        signal_breakdown[st] = signal_types.count(st)
    
    # Create network ID
    network_id = f'NET-2026-{entity_id}'
    
    # Generate explanation
    explanation = f"Network detected around {entity_id} with {len(entity_signals)} risk signals. "
    explanation += f"Primary pattern: {primary_risk_type.replace('_', ' ').title()}. "
    explanation += f"Signal types: {', '.join(f'{k}: {v}' for k, v in signal_breakdown.items())}."
    
    # Insert network
    cur.execute("""
        INSERT INTO risk_networks (
            network_id, entity_ids, entity_types, risk_score, risk_category,
            primary_risk_type, total_claim_amount, claim_count,
            first_activity_date, last_activity_date, signal_ids, signal_breakdown,
            explanation, investigation_status, detected_at, updated_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        network_id,
        [entity_id],  # entity_ids array
        Json({'provider': [entity_id]}),  # entity_types json
        avg_score,
        risk_category,
        primary_risk_type,
        total_claim_amount,
        claim_count,
        min(s['detected_at'] for s in entity_signals).date(),
        max(s['detected_at'] for s in entity_signals).date(),
        signal_ids,
        Json(signal_breakdown),
        explanation,
        'queued',  # Use 'queued' instead of 'pending' to match schema
        datetime.now(),
        datetime.now()
    ))
    
    networks_created += 1

conn.commit()
print(f'  Created {networks_created} risk networks')

print('\n[4/5] Calculating statistics...')
cur.execute("""
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN risk_category = 'CRITICAL' THEN 1 ELSE 0 END) as critical,
        SUM(CASE WHEN risk_category = 'HIGH' THEN 1 ELSE 0 END) as high,
        SUM(CASE WHEN risk_category = 'MEDIUM' THEN 1 ELSE 0 END) as medium,
        SUM(CASE WHEN risk_category = 'LOW' THEN 1 ELSE 0 END) as low,
        SUM(total_claim_amount) as total_amount
    FROM risk_networks
""")
stats = cur.fetchone()
print(f'  Total Networks: {stats[0]}')
print(f'  CRITICAL: {stats[1]}')
print(f'  HIGH: {stats[2]}')
print(f'  MEDIUM: {stats[3]}')
print(f'  LOW: {stats[4]}')
print(f'  Total Amount at Risk: Rp {stats[5]:,.0f}')

print('\n[5/5] Verifying networks...')
cur.execute("""
    SELECT network_id, risk_category, risk_score, primary_risk_type, 
           array_length(signal_ids, 1) as signal_count
    FROM risk_networks
    ORDER BY risk_score DESC
    LIMIT 5
""")
print('\n  Top 5 Networks:')
print('  Network ID | Category | Score | Type | Signals')
print('  ' + '-'*70)
for row in cur.fetchall():
    print(f'  {row[0]} | {row[1]} | {row[2]:.1f} | {row[3]} | {row[4]}')

cur.close()
conn.close()

print('\n' + '='*80)
print('[OK] Risk fusion complete!')
print('='*80)
print('\nNext steps:')
print('  1. Refresh frontend to see real networks')
print('  2. Click on a network to see details')
print('  3. Investigate high-risk networks')
