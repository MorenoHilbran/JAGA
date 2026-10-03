-- JAGA Database Schema Creation Script
-- Creates relational tables for the fraud detection platform

-- Participants (Patients)
CREATE TABLE IF NOT EXISTS participants (
    participant_id VARCHAR(50) PRIMARY KEY,
    name_hash VARCHAR(64) NOT NULL,
    age_band VARCHAR(20),
    gender VARCHAR(10),
    region_code VARCHAR(20),
    employer_id VARCHAR(50),
    registration_date DATE,
    participant_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_participants_region ON participants(region_code);

-- Providers (Hospitals, Clinics)
CREATE TABLE IF NOT EXISTS providers (
    provider_id VARCHAR(50) PRIMARY KEY,
    provider_name VARCHAR(200) NOT NULL,
    facility_type VARCHAR(50),
    region_code VARCHAR(20),
    ownership_type VARCHAR(50),
    bed_count INTEGER,
    services_offered TEXT[],
    accreditation_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_providers_facility_type ON providers(facility_type);
CREATE INDEX IF NOT EXISTS idx_providers_region ON providers(region_code);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id VARCHAR(50) PRIMARY KEY,
    doctor_name VARCHAR(200) NOT NULL,
    specialty VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    affiliated_providers TEXT[],
    practice_start_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors(specialty);

-- Claims
CREATE TABLE IF NOT EXISTS claims (
    claim_id VARCHAR(50) PRIMARY KEY,
    participant_id VARCHAR(50) NOT NULL REFERENCES participants(participant_id),
    provider_id VARCHAR(50) NOT NULL REFERENCES providers(provider_id),
    doctor_id VARCHAR(50) REFERENCES doctors(doctor_id),
    claim_date DATE NOT NULL,
    claim_amount FLOAT NOT NULL,
    diagnosis_codes TEXT[] NOT NULL,
    procedure_codes TEXT[] NOT NULL,
    admission_date DATE,
    discharge_date DATE,
    length_of_stay INTEGER,
    claim_status VARCHAR(20) DEFAULT 'approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_participant ON claims(participant_id);
CREATE INDEX IF NOT EXISTS idx_claims_provider ON claims(provider_id);
CREATE INDEX IF NOT EXISTS idx_claims_doctor ON claims(doctor_id);
CREATE INDEX IF NOT EXISTS idx_claims_date ON claims(claim_date);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(claim_status);

-- Risk Signals
CREATE TABLE IF NOT EXISTS risk_signals (
    signal_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    signal_type VARCHAR(50) NOT NULL,
    detection_method VARCHAR(50) NOT NULL,
    signal_score FLOAT NOT NULL,
    confidence FLOAT DEFAULT 1.0,
    related_claim_id VARCHAR(50) REFERENCES claims(claim_id),
    related_entities JSONB,
    evidence JSONB,
    explanation TEXT,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    detection_run_id VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_risk_signals_entity ON risk_signals(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_signals_type ON risk_signals(signal_type);
CREATE INDEX IF NOT EXISTS idx_risk_signals_detected_at ON risk_signals(detected_at);

-- Risk Networks
CREATE TABLE IF NOT EXISTS risk_networks (
    network_id VARCHAR(50) PRIMARY KEY,
    entity_ids TEXT[] NOT NULL,
    entity_types JSONB NOT NULL,
    risk_score FLOAT NOT NULL,
    risk_category VARCHAR(20) NOT NULL,
    primary_risk_type VARCHAR(50) NOT NULL,
    total_claim_amount FLOAT NOT NULL,
    claim_count INTEGER NOT NULL,
    first_activity_date DATE NOT NULL,
    last_activity_date DATE NOT NULL,
    signal_ids INTEGER[],
    signal_breakdown JSONB,
    explanation TEXT,
    peer_comparison JSONB,
    investigation_status VARCHAR(20) DEFAULT 'queued',
    assigned_to VARCHAR(50),
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_risk_networks_score ON risk_networks(risk_score);
CREATE INDEX IF NOT EXISTS idx_risk_networks_category ON risk_networks(risk_category);
CREATE INDEX IF NOT EXISTS idx_risk_networks_status ON risk_networks(investigation_status);
CREATE INDEX IF NOT EXISTS idx_risk_networks_detected_at ON risk_networks(detected_at);

-- Investigations
CREATE TABLE IF NOT EXISTS investigations (
    investigation_id SERIAL PRIMARY KEY,
    network_id VARCHAR(50) NOT NULL REFERENCES risk_networks(network_id),
    investigator_id VARCHAR(50) NOT NULL,
    investigator_name VARCHAR(200),
    decision VARCHAR(20) NOT NULL,
    confidence_level VARCHAR(20),
    notes TEXT,
    dismissal_reason VARCHAR(100),
    helpful_signals TEXT[],
    feedback_score INTEGER,
    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time_spent_minutes INTEGER
);

CREATE INDEX IF NOT EXISTS idx_investigations_network ON investigations(network_id);

-- Entity Features
CREATE TABLE IF NOT EXISTS entity_features (
    feature_id SERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    time_window INTEGER NOT NULL,
    features JSONB NOT NULL,
    peer_group_id VARCHAR(50),
    peer_statistics JSONB,
    computed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entity_features_entity ON entity_features(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_features_peer_group ON entity_features(peer_group_id);
CREATE INDEX IF NOT EXISTS idx_entity_features_computed_at ON entity_features(computed_at);

-- Print success message
SELECT 'Tables created successfully!' AS status;
