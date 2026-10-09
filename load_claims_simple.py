"""
Simple reliable data loader
"""
import psycopg2
import pandas as pd
import ast
import sys

print('JAGA Data Loader - Simple Version')
print('='*60)

# Connect
try:
    conn = psycopg2.connect(
        host='127.0.0.1',
        port=5433,
        database='jkn_riskgraph',
        user='postgres',
        password='postgres'
    )
    conn.autocommit = False
    cur = conn.cursor()
    print('Connected to database')
except Exception as e:
    print(f'Connection error: {e}')
    sys.exit(1)

# Check status
cur.execute('SELECT COUNT(*) FROM claims')
existing = cur.fetchone()[0]
print(f'Existing claims: {existing}')

if existing > 0:
    print('Table has data. Clear it? (Ctrl+C to cancel)')
    import time
    time.sleep(3)
    cur.execute('TRUNCATE TABLE claims CASCADE')
    conn.commit()
    print('Table cleared')

# Load data
print('Reading CSV...')
df = pd.read_csv('database/seeds/claims.csv')
total = len(df)
print(f'Total rows in CSV: {total:,}')

# Remove duplicates (keep first occurrence)
print('Checking for duplicates...')
duplicates = df[df['claim_id'].duplicated(keep='first')]
if len(duplicates) > 0:
    print(f'Found {len(duplicates)} duplicate claim_ids, removing...')
    df = df.drop_duplicates(subset=['claim_id'], keep='first')
    print(f'Unique claims to load: {len(df):,}')
else:
    print('No duplicates found')

total = len(df)

# Convert arrays
print('Processing data...')
df['diagnosis_codes'] = df['diagnosis_codes'].apply(lambda x: ast.literal_eval(x) if pd.notna(x) else [])
df['procedure_codes'] = df['procedure_codes'].apply(lambda x: ast.literal_eval(x) if pd.notna(x) else [])

# Insert one by one with progress
print('Loading claims...')
insert_sql = """
INSERT INTO claims (claim_id, participant_id, provider_id, doctor_id, claim_date, 
                   claim_amount, diagnosis_codes, procedure_codes, admission_date, 
                   discharge_date, length_of_stay, claim_status)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

loaded = 0
for idx, row in df.iterrows():
    try:
        cur.execute(insert_sql, (
            row['claim_id'],
            row['participant_id'],
            row['provider_id'],
            row['doctor_id'] if pd.notna(row['doctor_id']) else None,
            row['claim_date'],
            row['claim_amount'],
            row['diagnosis_codes'],
            row['procedure_codes'],
            row['admission_date'] if pd.notna(row['admission_date']) else None,
            row['discharge_date'] if pd.notna(row['discharge_date']) else None,
            int(row['length_of_stay']) if pd.notna(row['length_of_stay']) else None,
            row['claim_status']
        ))
        
        loaded += 1
        
        # Commit every 1000
        if loaded % 1000 == 0:
            conn.commit()
            pct = loaded * 100 // total
            print(f'  {loaded:,} / {total:,} ({pct}%)')
            
    except Exception as e:
        print(f'Error at row {idx}: {e}')
        conn.rollback()
        continue

# Final commit
conn.commit()
print(f'\nLoaded {loaded:,} claims successfully!')

# Verify
cur.execute('SELECT COUNT(*) FROM claims')
final_count = cur.fetchone()[0]
print(f'Verified: {final_count:,} claims in database')

cur.close()
conn.close()
print('Done!')
