"""
View detection results from the database
"""
import psycopg2

# Connect
conn = psycopg2.connect(
    host='127.0.0.1',
    port=5433,
    database='jkn_riskgraph',
    user='postgres',
    password='postgres'
)
cur = conn.cursor()

print('='*80)
print('JAGA - Detection Results Summary')
print('='*80)

# Total signals
cur.execute('SELECT COUNT(*) FROM risk_signals')
total = cur.fetchone()[0]
print(f'\nTotal Risk Signals: {total}')

# Signals by type
print('\n--- Signals by Type ---')
cur.execute('SELECT signal_type, COUNT(*) FROM risk_signals GROUP BY signal_type ORDER BY COUNT(*) DESC')
for row in cur.fetchall():
    print(f'  {row[0]}: {row[1]}')

# Signals by confidence level
print('\n--- Signals by Confidence Level ---')
cur.execute("""
    SELECT 
        CASE 
            WHEN confidence >= 0.8 THEN 'High (>=0.8)'
            WHEN confidence >= 0.6 THEN 'Medium (0.6-0.8)'
            ELSE 'Low (<0.6)'
        END as confidence_level,
        COUNT(*) as count
    FROM risk_signals
    GROUP BY confidence_level
    ORDER BY MIN(confidence) DESC
""")
for row in cur.fetchall():
    print(f'  {row[0]}: {row[1]}')

# Top entities with most signals
print('\n--- Top 10 Entities with Most Signals ---')
cur.execute("""
    SELECT entity_id, entity_type, COUNT(*) as signal_count
    FROM risk_signals
    GROUP BY entity_id, entity_type
    ORDER BY signal_count DESC
    LIMIT 10
""")
for row in cur.fetchall():
    print(f'  {row[0]} ({row[1]}): {row[2]} signals')

# Recent signals
print('\n--- Last 10 Signals Detected ---')
cur.execute("""
    SELECT signal_id, signal_type, entity_id, entity_type, confidence, signal_score
    FROM risk_signals
    ORDER BY detected_at DESC
    LIMIT 10
""")
for row in cur.fetchall():
    print(f'  {row[1]} - {row[2]} ({row[3]}) - confidence: {row[4]:.2f}, score: {row[5]:.2f}')

# Check risk networks
cur.execute('SELECT COUNT(*) FROM risk_networks')
networks = cur.fetchone()[0]
print(f'\nRisk Networks: {networks}')

# Check investigations
cur.execute('SELECT COUNT(*) FROM investigations')
investigations = cur.fetchone()[0]
print(f'Investigations: {investigations}')

print('\n' + '='*80)

cur.close()
conn.close()
