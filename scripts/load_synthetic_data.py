"""
Load synthetic data into PostgreSQL database.
Reads CSV files from database/seeds/ and inserts into tables.
"""

import sys
import os
import pandas as pd
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.src.database import get_db_context, engine
from backend.src.models import Participant, Provider, Doctor, Claim
from backend.config import settings
from sqlalchemy import text
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def load_participants(filepath: Path):
    """Load participant data from CSV"""
    logger.info(f"Loading participants from {filepath}...")
    
    df = pd.read_csv(filepath)
    
    with get_db_context() as db:
        # Clear existing data
        db.execute(text("TRUNCATE TABLE participants CASCADE"))
        
        for _, row in df.iterrows():
            participant = Participant(
                participant_id=row['participant_id'],
                name_hash=row['name_hash'],
                age_band=row['age_band'],
                gender=row['gender'],
                region_code=row['region_code'],
                employer_id=row['employer_id'] if pd.notna(row['employer_id']) else None,
                registration_date=pd.to_datetime(row['registration_date']).date(),
                participant_status=row['participant_status']
            )
            db.add(participant)
        
        db.commit()
    
    logger.info(f"✓ Loaded {len(df)} participants")


def load_providers(filepath: Path):
    """Load provider data from CSV"""
    logger.info(f"Loading providers from {filepath}...")
    
    df = pd.read_csv(filepath)
    
    with get_db_context() as db:
        # Clear existing data
        db.execute(text("TRUNCATE TABLE providers CASCADE"))
        
        for _, row in df.iterrows():
            # Parse services_offered from string to list
            services = eval(row['services_offered']) if pd.notna(row['services_offered']) else None
            
            provider = Provider(
                provider_id=row['provider_id'],
                provider_name=row['provider_name'],
                facility_type=row['facility_type'],
                region_code=row['region_code'],
                ownership_type=row['ownership_type'],
                bed_count=int(row['bed_count']) if pd.notna(row['bed_count']) else None,
                services_offered=services,
                accreditation_level=row['accreditation_level'] if pd.notna(row['accreditation_level']) else None
            )
            db.add(provider)
        
        db.commit()
    
    logger.info(f"✓ Loaded {len(df)} providers")


def load_doctors(filepath: Path):
    """Load doctor data from CSV"""
    logger.info(f"Loading doctors from {filepath}...")
    
    df = pd.read_csv(filepath)
    
    with get_db_context() as db:
        # Clear existing data
        db.execute(text("TRUNCATE TABLE doctors CASCADE"))
        
        for _, row in df.iterrows():
            # Parse affiliated_providers from string to list
            affiliations = eval(row['affiliated_providers']) if pd.notna(row['affiliated_providers']) else []
            
            doctor = Doctor(
                doctor_id=row['doctor_id'],
                doctor_name=row['doctor_name'],
                specialty=row['specialty'],
                license_number=row['license_number'],
                affiliated_providers=affiliations,
                practice_start_date=pd.to_datetime(row['practice_start_date']).date()
            )
            db.add(doctor)
        
        db.commit()
    
    logger.info(f"✓ Loaded {len(df)} doctors")


def load_claims(filepath: Path, batch_size: int = 1000):
    """Load claim data from CSV in batches"""
    logger.info(f"Loading claims from {filepath}...")
    
    df = pd.read_csv(filepath)
    total_rows = len(df)
    
    with get_db_context() as db:
        # Clear existing data
        db.execute(text("TRUNCATE TABLE claims CASCADE"))
        
        for i in range(0, total_rows, batch_size):
            batch = df.iloc[i:i+batch_size]
            
            for _, row in batch.iterrows():
                # Parse array fields
                diagnosis_codes = eval(row['diagnosis_codes']) if pd.notna(row['diagnosis_codes']) else []
                procedure_codes = eval(row['procedure_codes']) if pd.notna(row['procedure_codes']) else []
                
                claim = Claim(
                    claim_id=row['claim_id'],
                    participant_id=row['participant_id'],
                    provider_id=row['provider_id'],
                    doctor_id=row['doctor_id'] if pd.notna(row['doctor_id']) else None,
                    claim_date=pd.to_datetime(row['claim_date']).date(),
                    claim_amount=float(row['claim_amount']),
                    diagnosis_codes=diagnosis_codes,
                    procedure_codes=procedure_codes,
                    admission_date=pd.to_datetime(row['admission_date']).date() if pd.notna(row['admission_date']) else None,
                    discharge_date=pd.to_datetime(row['discharge_date']).date() if pd.notna(row['discharge_date']) else None,
                    length_of_stay=int(row['length_of_stay']) if pd.notna(row['length_of_stay']) else None,
                    claim_status=row['claim_status']
                )
                db.add(claim)
            
            db.commit()
            logger.info(f"  Loaded batch {i//batch_size + 1}/{(total_rows + batch_size - 1)//batch_size}")
    
    logger.info(f"✓ Loaded {total_rows} claims")


def verify_data():
    """Verify loaded data"""
    logger.info("\nVerifying loaded data...")
    
    with get_db_context() as db:
        participant_count = db.query(Participant).count()
        provider_count = db.query(Provider).count()
        doctor_count = db.query(Doctor).count()
        claim_count = db.query(Claim).count()
        
        logger.info(f"  Participants: {participant_count}")
        logger.info(f"  Providers: {provider_count}")
        logger.info(f"  Doctors: {doctor_count}")
        logger.info(f"  Claims: {claim_count}")
        
        # Check foreign key integrity
        claims_with_invalid_participant = db.execute(text("""
            SELECT COUNT(*) FROM claims c 
            LEFT JOIN participants p ON c.participant_id = p.participant_id 
            WHERE p.participant_id IS NULL
        """)).scalar()
        
        claims_with_invalid_provider = db.execute(text("""
            SELECT COUNT(*) FROM claims c 
            LEFT JOIN providers p ON c.provider_id = p.provider_id 
            WHERE p.provider_id IS NULL
        """)).scalar()
        
        if claims_with_invalid_participant > 0:
            logger.warning(f"  ⚠ Found {claims_with_invalid_participant} claims with invalid participant_id")
        else:
            logger.info(f"  ✓ All claims have valid participant references")
        
        if claims_with_invalid_provider > 0:
            logger.warning(f"  ⚠ Found {claims_with_invalid_provider} claims with invalid provider_id")
        else:
            logger.info(f"  ✓ All claims have valid provider references")


def main():
    """Main data loading process"""
    logger.info("=" * 60)
    logger.info("JAGA Data Loader - Load Synthetic Data")
    logger.info("=" * 60)
    
    data_dir = Path("database/seeds")
    
    if not data_dir.exists():
        logger.error(f"Data directory not found: {data_dir}")
        logger.error("Please run generate_synthetic_data.py first")
        return
    
    try:
        # Load data in order (respecting foreign key constraints)
        load_participants(data_dir / "participants.csv")
        load_providers(data_dir / "providers.csv")
        load_doctors(data_dir / "doctors.csv")
        load_claims(data_dir / "claims.csv", batch_size=1000)
        
        # Verify
        verify_data()
        
        logger.info("\n" + "=" * 60)
        logger.info("✓ Data loading completed successfully!")
        logger.info("=" * 60)
        logger.info("\nNext steps:")
        logger.info("  1. Build graph: python scripts/build_graph.py")
        logger.info("  2. Run feature engineering: python scripts/run_feature_engineering.py")
        logger.info("  3. Start backend: cd backend && uvicorn src.main:app --reload")
        
    except Exception as e:
        logger.error("\n" + "=" * 60)
        logger.error("✗ Data loading failed!")
        logger.error("=" * 60)
        logger.error(f"Error: {str(e)}")
        raise


if __name__ == "__main__":
    main()
