"""
Monitor data loading progress
"""
import psycopg2
import time
import sys
from datetime import datetime

def check_progress():
    try:
        conn = psycopg2.connect(
            host='127.0.0.1',
            port=5433,
            database='jkn_riskgraph',
            user='postgres',
            password='postgres'
        )
        cur = conn.cursor()
        
        cur.execute('SELECT COUNT(*) FROM participants')
        part = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM providers')
        prov = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM doctors')
        doc = cur.fetchone()[0]
        cur.execute('SELECT COUNT(*) FROM claims')
        claims = cur.fetchone()[0]
        
        cur.close()
        conn.close()
        
        return part, prov, doc, claims
    except Exception as e:
        return None, None, None, None

print('='*60)
print('JAGA Data Loading Monitor')
print('='*60)
print('Press Ctrl+C to stop\n')

try:
    while True:
        part, prov, doc, claims = check_progress()
        
        if part is not None:
            now = datetime.now().strftime('%H:%M:%S')
            print(f'[{now}]')
            print(f'  Participants: {part:,} / 10,000')
            print(f'  Providers: {prov:,} / 100')
            print(f'  Doctors: {doc:,} / 500')
            print(f'  Claims: {claims:,} / 111,250 ({claims*100//111250 if claims > 0 else 0}%)')
            
            if claims >= 111250:
                print('\n✓ Data loading complete!')
                break
        else:
            print('Database not accessible')
        
        print()
        time.sleep(10)
        
except KeyboardInterrupt:
    print('\n\nMonitoring stopped.')
    sys.exit(0)
