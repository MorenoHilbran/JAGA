"""
Load only claims data.
"""
import csv
import psycopg2
from psycopg2.extras import execute_batch

conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='jkn_riskgraph',
    user='postgres',
    password='jaga2026'
)
conn.autocommit = False
cur = conn.cursor()

print("Loading claims...")
with open('/tmp/claims.csv', 'r') as f:
    reader = csv.DictReader(f)
    claims = []
    seen_ids = set()
    duplicates = 0
    for row in reader:
        if row['claim_id'] in seen_ids:
            duplicates += 1
            continue
        seen_ids.add(row['claim_id'])
        claims.append((
            row['claim_id'],
            row['participant_id'],
            row['provider_id'],
            row['doctor_id'],
            row['claim_date'],
            float(row['claim_amount']),
            eval(row['diagnosis_codes']),
            eval(row['procedure_codes']),
            row['admission_date'] if row['admission_date'] else None,
            row['discharge_date'] if row['discharge_date'] else None,
            int(float(row['length_of_stay'])) if row['length_of_stay'] else None,
            row['claim_status']
        ))
    
    if duplicates > 0:
        print(f"  Skipped {duplicates} duplicate claims")
    
    execute_batch(cur, """
        INSERT INTO claims (claim_id, participant_id, provider_id, doctor_id, claim_date,
                            claim_amount, diagnosis_codes, procedure_codes, admission_date,
                            discharge_date, length_of_stay, claim_status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, claims, page_size=1000)
    conn.commit()
    print(f"Loaded {len(claims)} claims")

conn.close()
print("\nClaims loading completed successfully!")
