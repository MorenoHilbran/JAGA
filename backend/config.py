"""
JAGA Backend Configuration Module

Loads configuration from environment variables and provides
centralized access to application settings.
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database Configuration
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/jkn_riskgraph"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "jkn_riskgraph"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "password"
    
    # Apache AGE Configuration
    AGE_GRAPH_NAME: str = "jkn_graph"
    AGE_SCHEMA: str = "ag_catalog"
    
    # API Configuration
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_RELOAD: bool = True
    API_TITLE: str = "JAGA API"
    API_VERSION: str = "1.0.0"
    API_DESCRIPTION: str = "Graph Analytics-Based Healthcare Fraud Detection API"
    
    # CORS Settings
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176", "http://localhost:5177", "http://localhost:3000"]
    
    # Security
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Detection Engine Configuration
    RISK_DETECTION_ENABLED: bool = True
    DETECTION_BATCH_SIZE: int = 1000
    DETECTION_THRESHOLD_HIGH: int = 60
    DETECTION_THRESHOLD_CRITICAL: int = 80
    
    # Feature Engineering
    FEATURE_TIME_WINDOWS: str = "30,90,365"
    PEER_GROUP_MIN_SIZE: int = 5
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/jaga.log"
    
    # Redis (optional caching)
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_ENABLED: bool = False
    
    # ML Model Configuration
    ML_MODEL_PATH: str = "models/trained/"
    ML_RETRAIN_THRESHOLD: int = 100
    ML_TEST_SIZE: float = 0.15
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def time_windows(self) -> List[int]:
        """Parse time windows from comma-separated string"""
        return [int(w.strip()) for w in self.FEATURE_TIME_WINDOWS.split(",")]
    
    @property
    def is_production(self) -> bool:
        """Check if running in production environment"""
        return self.ENVIRONMENT.lower() == "production"
    
    @property
    def is_development(self) -> bool:
        """Check if running in development environment"""
        return self.ENVIRONMENT.lower() == "development"


# Create global settings instance
settings = Settings()


def get_settings() -> Settings:
    """
    Dependency function to get settings instance.
    Can be used in FastAPI dependency injection.
    """
    return settings
