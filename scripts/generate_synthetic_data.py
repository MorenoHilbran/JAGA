"""
Synthetic JKN (Jaminan Kesehatan Nasional) Data Generator
Generates realistic healthcare data for development and testing of JAGA fraud detection system.

Includes:
- Participants (patients)
- Providers (hospitals, clinics, FKTP)
- Doctors
- Claims (with embedded fraud patterns)
"""

import random
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
import json
import hashlib
import argparse
from faker import Faker
import pandas as pd
from pathlib import Path

# Initialize Faker with Indonesian locale
fake = Faker('id_ID')
Faker.seed(42)
random.seed(42)


class SyntheticDataGenerator:
    """Generate synthetic JKN healthcare data"""
    
    def __init__(self, output_dir: str = "database/seeds"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Indonesian regions (provinces)
        self.regions = [
            "DKI_JAKARTA", "JAWA_BARAT", "JAWA_TENGAH", "JAWA_TIMUR",
            "BANTEN", "BALI", "SUMATERA_UTARA", "SUMATERA_SELATAN",
            "KALIMANTAN_TIMUR", "SULAWESI_SELATAN"
        ]
        
        # ICD-10 diagnosis codes (common in Indonesia)
        self.diagnosis_codes = [
            "A09", "J00", "J06", "K29", "E11", "I10", "M54", "N39",
            "J45", "K30", "R10", "R50", "J18", "A00", "E78", "I25"
        ]
        
        # INA-CBG procedure codes (simplified)
        self.procedure_codes = [
            "P001", "P002", "P003", "P010", "P015", "P020", "P025",
            "P030", "P040", "P050", "P100", "P110", "P200", "P300"
        ]
        
        # Medical specialties
        self.specialties = [
            "Umum", "Penyakit Dalam", "Bedah", "Anak", "Kandungan",
            "Jantung", "Paru", "Saraf", "Mata", "THT", "Kulit"
        ]
        
        # Facility types
        self.facility_types = [
            "RS_TIPE_A", "RS_TIPE_B", "RS_TIPE_C", "RS_TIPE_D",
            "KLINIK", "FKTP", "PUSKESMAS"
        ]
        
    def generate_participants(self, n: int = 10000) -> List[Dict]:
        """Generate participant (patient) records"""
        print(f"Generating {n} participants...")
        
        participants = []
        for i in range(n):
            participant_id = f"P{str(i+1).zfill(8)}"
            name = fake.name()
            name_hash = hashlib.sha256(name.encode()).hexdigest()
            
            age = random.randint(0, 85)
            if age < 18:
                age_band = "0-17"
            elif age < 41:
                age_band = "18-40"
            elif age < 61:
                age_band = "41-60"
            else:
                age_band = "60+"
            
            participant = {
                "participant_id": participant_id,
                "name_hash": name_hash,
                "age_band": age_band,
                "gender": random.choice(["L", "P"]),
                "region_code": random.choice(self.regions),
                "employer_id": f"EMP{random.randint(1, 500)}" if random.random() > 0.3 else None,
                "registration_date": (datetime.now() - timedelta(days=random.randint(365, 3650))).date().isoformat(),
                "participant_status": "active"
            }
            participants.append(participant)
        
        return participants
    
    def generate_providers(self, n: int = 100) -> List[Dict]:
        """Generate healthcare provider records"""
        print(f"Generating {n} providers...")
        
        providers = []
        for i in range(n):
            provider_id = f"PROV{str(i+1).zfill(6)}"
            facility_type = random.choice(self.facility_types)
            
            # Generate realistic names based on facility type
            if "RS" in facility_type:
                name_templates = ["RS", "RSUD", "RSU", "Rumah Sakit"]
                provider_name = f"{random.choice(name_templates)} {fake.city()}"
            elif facility_type == "KLINIK":
                provider_name = f"Klinik {fake.last_name()}"
            else:
                provider_name = f"Puskesmas {fake.city()}"
            
            # Bed count based on facility type
            if facility_type == "RS_TIPE_A":
                bed_count = random.randint(400, 1000)
            elif facility_type == "RS_TIPE_B":
                bed_count = random.randint(200, 400)
            elif facility_type in ["RS_TIPE_C", "RS_TIPE_D"]:
                bed_count = random.randint(50, 200)
            else:
                bed_count = None
            
            provider = {
                "provider_id": provider_id,
                "provider_name": provider_name,
                "facility_type": facility_type,
                "region_code": random.choice(self.regions),
                "ownership_type": random.choice(["public", "private"]),
                "bed_count": bed_count,
                "services_offered": random.sample(["rawat_inap", "rawat_jalan", "igd", "laboratorium", "radiologi"], k=random.randint(2, 5)),
                "accreditation_level": random.choice(["paripurna", "utama", "madya", "dasar", None])
            }
            providers.append(provider)
        
        return providers
    
    def generate_doctors(self, n: int = 500, providers: List[Dict] = None) -> List[Dict]:
        """Generate doctor records"""
        print(f"Generating {n} doctors...")
        
        if providers is None:
            providers = []
        
        doctors = []
        for i in range(n):
            doctor_id = f"DOC{str(i+1).zfill(6)}"
            
            # Realistic Indonesian doctor names with titles
            name = fake.name()
            doctor_name = f"dr. {name}"
            
            specialty = random.choice(self.specialties)
            if specialty != "Umum" and random.random() > 0.5:
                doctor_name = f"{doctor_name}, Sp.{specialty[:3]}"
            
            # Assign to 1-3 affiliated providers
            num_affiliations = random.choices([1, 2, 3], weights=[0.6, 0.3, 0.1])[0]
            affiliated_providers = random.sample([p["provider_id"] for p in providers], 
                                                k=min(num_affiliations, len(providers))) if providers else []
            
            doctor = {
                "doctor_id": doctor_id,
                "doctor_name": doctor_name,
                "specialty": specialty,
                "license_number": f"SIP{random.randint(100000, 999999)}",
                "affiliated_providers": affiliated_providers,
                "practice_start_date": (datetime.now() - timedelta(days=random.randint(365, 10950))).date().isoformat()
            }
            doctors.append(doctor)
        
        return doctors
    
    def generate_claims(self, n: int = 100000, 
                       participants: List[Dict] = None,
                       providers: List[Dict] = None,
                       doctors: List[Dict] = None,
                       fraud_rate: float = 0.05) -> List[Dict]:
        """Generate claim records with embedded fraud patterns"""
        print(f"Generating {n} claims (with {fraud_rate*100}% fraud patterns)...")
        
        if not all([participants, providers, doctors]):
            raise ValueError("Need participants, providers, and doctors to generate claims")
        
        claims = []
        fraud_claims = []
        
        # Calculate how many fraudulent claims to inject
        n_fraud = int(n * fraud_rate)
        n_legitimate = n - n_fraud
        
        # Generate legitimate claims
        for i in range(n_legitimate):
            claim = self._generate_legitimate_claim(i, participants, providers, doctors)
            claims.append(claim)
        
        print(f"  Generated {n_legitimate} legitimate claims")
        
        # Generate fraudulent claims with specific patterns
        fraud_patterns = {
            "cloning": int(n_fraud * 0.4),
            "referral_concentration": int(n_fraud * 0.3),
            "prolonged_los": int(n_fraud * 0.2),
            "repeat_billing": int(n_fraud * 0.1)
        }
        
        claim_id_counter = n_legitimate
        
        # Cloning pattern
        for _ in range(fraud_patterns["cloning"]):
            template_claim = self._generate_legitimate_claim(claim_id_counter, participants, providers, doctors)
            # Create 5-10 similar claims
            clones = self._create_cloning_pattern(template_claim, participants, claim_id_counter, count=random.randint(5, 10))
            claims.extend(clones)
            fraud_claims.extend([c["claim_id"] for c in clones])
            claim_id_counter += len(clones)
        
        print(f"  Injected cloning pattern: {len([c for c in claims if c['claim_id'] in fraud_claims])} claims")
        
        # Referral concentration pattern
        # Will be detected in graph analytics, not individual claims
        
        # Prolonged LOS pattern
        for _ in range(fraud_patterns["prolonged_los"]):
            claim = self._generate_legitimate_claim(claim_id_counter, participants, providers, doctors)
            claim["length_of_stay"] = random.randint(10, 20)  # Abnormally long
            claim["discharge_date"] = (datetime.fromisoformat(claim["admission_date"]) + 
                                      timedelta(days=claim["length_of_stay"])).date().isoformat()
            claims.append(claim)
            fraud_claims.append(claim["claim_id"])
            claim_id_counter += 1
        
        print(f"  Injected prolonged LOS pattern: {fraud_patterns['prolonged_los']} claims")
        
        # Repeat billing pattern
        for _ in range(fraud_patterns["repeat_billing"]):
            original = self._generate_legitimate_claim(claim_id_counter, participants, providers, doctors)
            claims.append(original)
            claim_id_counter += 1
            
            # Create duplicate within 7 days
            duplicate = original.copy()
            duplicate["claim_id"] = f"CLM{str(claim_id_counter).zfill(10)}"
            duplicate["claim_date"] = (datetime.fromisoformat(original["claim_date"]) + 
                                      timedelta(days=random.randint(1, 7))).date().isoformat()
            claims.append(duplicate)
            fraud_claims.append(duplicate["claim_id"])
            claim_id_counter += 1
        
        print(f"  Injected repeat billing pattern: {fraud_patterns['repeat_billing']} duplicates")
        
        # Shuffle claims
        random.shuffle(claims)
        
        # Save fraud claim IDs for validation
        fraud_info = {
            "total_claims": len(claims),
            "fraud_claims": len(fraud_claims),
            "fraud_rate": len(fraud_claims) / len(claims),
            "fraud_claim_ids": fraud_claims
        }
        
        with open(self.output_dir / "fraud_ground_truth.json", "w") as f:
            json.dump(fraud_info, f, indent=2)
        
        print(f"  Total claims generated: {len(claims)}")
        print(f"  Fraud claims: {len(fraud_claims)} ({len(fraud_claims)/len(claims)*100:.1f}%)")
        
        return claims
    
    def _generate_legitimate_claim(self, idx: int, participants: List[Dict], 
                                   providers: List[Dict], doctors: List[Dict]) -> Dict:
        """Generate a single legitimate claim"""
        claim_id = f"CLM{str(idx+1).zfill(10)}"
        participant = random.choice(participants)
        provider = random.choice(providers)
        doctor = random.choice([d for d in doctors if provider["provider_id"] in d["affiliated_providers"]] or doctors)
        
        # Claim date within last 12 months
        claim_date = datetime.now() - timedelta(days=random.randint(0, 365))
        
        # Diagnosis and procedure codes
        num_diagnoses = random.choices([1, 2, 3], weights=[0.7, 0.2, 0.1])[0]
        num_procedures = random.choices([1, 2], weights=[0.8, 0.2])[0]
        
        diagnosis_codes = random.sample(self.diagnosis_codes, k=num_diagnoses)
        procedure_codes = random.sample(self.procedure_codes, k=num_procedures)
        
        # Claim amount (realistic range for Indonesia)
        base_amount = random.uniform(500000, 15000000)  # Rp 500K - 15M
        claim_amount = round(base_amount, -3)  # Round to thousands
        
        # Length of stay (if inpatient)
        is_inpatient = "rawat_inap" in provider.get("services_offered", []) and random.random() > 0.7
        
        if is_inpatient:
            length_of_stay = random.choices([1, 2, 3, 4, 5, 6, 7], 
                                          weights=[0.3, 0.25, 0.2, 0.15, 0.05, 0.03, 0.02])[0]
            admission_date = claim_date - timedelta(days=length_of_stay)
            discharge_date = claim_date
        else:
            length_of_stay = 0
            admission_date = None
            discharge_date = None
        
        claim = {
            "claim_id": claim_id,
            "participant_id": participant["participant_id"],
            "provider_id": provider["provider_id"],
            "doctor_id": doctor["doctor_id"],
            "claim_date": claim_date.date().isoformat(),
            "claim_amount": claim_amount,
            "diagnosis_codes": diagnosis_codes,
            "procedure_codes": procedure_codes,
            "admission_date": admission_date.date().isoformat() if admission_date else None,
            "discharge_date": discharge_date.date().isoformat() if discharge_date else None,
            "length_of_stay": length_of_stay if is_inpatient else None,
            "claim_status": "approved"
        }
        
        return claim
    
    def _create_cloning_pattern(self, template: Dict, participants: List[Dict], 
                               start_idx: int, count: int = 5) -> List[Dict]:
        """Create cloned claims (identical structure, different patients)"""
        clones = []
        
        for i in range(count):
            clone = template.copy()
            clone["claim_id"] = f"CLM{str(start_idx + i + 1).zfill(10)}"
            clone["participant_id"] = random.choice(participants)["participant_id"]
            
            # Slightly vary the date (within 30 days)
            original_date = datetime.fromisoformat(template["claim_date"])
            clone["claim_date"] = (original_date + timedelta(days=random.randint(0, 30))).date().isoformat()
            
            # Keep diagnosis, procedure, amount, LOS identical (or 95% similar)
            if random.random() > 0.95:
                clone["claim_amount"] = clone["claim_amount"] * random.uniform(0.98, 1.02)
            
            clones.append(clone)
        
        return clones
    
    def save_to_csv(self, data: List[Dict], filename: str):
        """Save data to CSV file"""
        df = pd.DataFrame(data)
        filepath = self.output_dir / f"{filename}.csv"
        df.to_csv(filepath, index=False)
        print(f"Saved {len(data)} records to {filepath}")
    
    def save_to_json(self, data: List[Dict], filename: str):
        """Save data to JSON file"""
        filepath = self.output_dir / f"{filename}.json"
        with open(filepath, "w") as f:
            json.dump(data, f, indent=2)
        print(f"Saved {len(data)} records to {filepath}")
    
    def generate_all(self, n_participants: int = 10000, n_providers: int = 100,
                    n_doctors: int = 500, n_claims: int = 100000, fraud_rate: float = 0.05):
        """Generate complete synthetic dataset"""
        print("=" * 60)
        print("JAGA Synthetic Data Generator")
        print("=" * 60)
        print(f"Output directory: {self.output_dir}")
        print()
        
        # Generate entities
        participants = self.generate_participants(n_participants)
        self.save_to_csv(participants, "participants")
        
        providers = self.generate_providers(n_providers)
        self.save_to_csv(providers, "providers")
        
        doctors = self.generate_doctors(n_doctors, providers)
        self.save_to_csv(doctors, "doctors")
        
        claims = self.generate_claims(n_claims, participants, providers, doctors, fraud_rate)
        self.save_to_csv(claims, "claims")
        
        print()
        print("=" * 60)
        print("✓ Synthetic data generation completed!")
        print("=" * 60)
        print()
        print("Generated files:")
        print(f"  - participants.csv ({n_participants} records)")
        print(f"  - providers.csv ({n_providers} records)")
        print(f"  - doctors.csv ({n_doctors} records)")
        print(f"  - claims.csv ({len(claims)} records)")
        print(f"  - fraud_ground_truth.json (fraud labels)")
        print()
        print("Next steps:")
        print("  1. Load data: python scripts/load_synthetic_data.py")
        print("  2. Build graph: python scripts/build_graph.py")


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic JKN healthcare data")
    parser.add_argument("--participants", type=int, default=10000, help="Number of participants")
    parser.add_argument("--providers", type=int, default=100, help="Number of providers")
    parser.add_argument("--doctors", type=int, default=500, help="Number of doctors")
    parser.add_argument("--claims", type=int, default=100000, help="Number of claims")
    parser.add_argument("--fraud-rate", type=float, default=0.05, help="Fraud rate (0-1)")
    parser.add_argument("--output", type=str, default="database/seeds", help="Output directory")
    
    args = parser.parse_args()
    
    generator = SyntheticDataGenerator(output_dir=args.output)
    generator.generate_all(
        n_participants=args.participants,
        n_providers=args.providers,
        n_doctors=args.doctors,
        n_claims=args.claims,
        fraud_rate=args.fraud_rate
    )


if __name__ == "__main__":
    main()
