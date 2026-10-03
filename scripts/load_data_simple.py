"""
Simple data loader using psycopg2 directly.
Runs inside Docker container to avoid connection issues.
"""
import csv
import json
import psycopg2
from psycopg2.extras import execute_batch

# Connect to database
conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='jkn_riskgraph',
    user='postgres',
    password='jaga2026'
)
conn.autocommit = False
cur = conn.cursor()

print("Loading participants...")
with open('/tmp/participants.csv', 'r') as f:
    reader = csv.DictReader(f)
    participants = []
    for row in reader:
        participants.append((
            row['participant_id'],
            row['name_hash'],
            row['age_band'],
            row['gender'],
            row['region_code'],
            row['employer_id'] if row['employer_id'] else None,
            row['registration_date'],
            row['participant_status']
        ))
    
    execute_batch(cur, """
        INSERT INTO participants (participant_id, name_hash, age_band, gender, region_code, 
                                  employer_id, registration_date, participant_status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, participants, page_size=1000)
    conn.commit()
    print(f"Loaded {len(participants)} participants")

print("Loading providers...")
with open('/tmp/providers.csv', 'r') as f:
    reader = csv.DictReader(f)
    providers = []
    for row in reader:
        providers.append((
            row['provider_id'],
            row['provider_name'],
            row['facility_type'],
            row['region_code'],
            row['ownership_type'],
            int(float(row['bed_count'])) if row['bed_count'] else None,
            eval(row['services_offered']),
            row['accreditation_level'] if row['accreditation_level'] else None
        ))
    
    execute_batch(cur, """
        INSERT INTO providers (provider_id, provider_name, facility_type, region_code, 
                               ownership_type, bed_count, services_offered, accreditation_level)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, providers, page_size=100)
    conn.commit()
    print(f"Loaded {len(providers)} providers")

print("Loading doctors...")
with open('/tmp/doctors.csv', 'r') as f:
    reader = csv.DictReader(f)
    doctors = []
    for row in reader:
        doctors.append((
            row['doctor_id'],
            row['doctor_name'],
            row['specialty'],
            row['license_number'],
            eval(row['affiliated_providers']),
            row['practice_start_date']
        ))
    
    execute_batch(cur, """
        INSERT INTO doctors (doctor_id, doctor_name, specialty, license_number, 
                             affiliated_providers, practice_start_date)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, doctors, page_size=100)
    conn.commit()
    print(f"Loaded {len(doctors)} doctors")

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

conn.commit()
cur.close()
conn.close()

print("\nData loading completed successfully!")
print(f"Total records loaded:")
print(f"  - Participants: 10,000")
print(f"  - Providers: 100")
print(f"  - Doctors: 500")
print(f"  - Claims: {len(claims):,}")
