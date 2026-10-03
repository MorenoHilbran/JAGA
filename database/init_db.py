"""
Database initialization script for JAGA.
Creates tables, AGE graph, and initial setup.
"""

import sys
import os

# Add backend directory to path for imports
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))
sys.path.insert(0, backend_path)

from src.database import init_database, engine, age_conn
from src.models import Base
from config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    """Initialize database schema"""
    logger.info("=" * 50)
    logger.info("JAGA Database Initialization")
    logger.info("=" * 50)
    
    logger.info(f"Database: {settings.DB_NAME}")
    logger.info(f"Host: {settings.DB_HOST}:{settings.DB_PORT}")
    logger.info(f"AGE Graph: {settings.AGE_GRAPH_NAME}")
    
    try:
        # Test connection
        logger.info("\n1. Testing database connection...")
        with engine.connect() as conn:
            result = conn.execute("SELECT version();")
            version = result.fetchone()[0]
            logger.info(f"✓ Connected to PostgreSQL: {version}")
        
        # Check AGE extension
        logger.info("\n2. Checking Apache AGE extension...")
        with engine.connect() as conn:
            result = conn.execute("SELECT extname, extversion FROM pg_extension WHERE extname = 'age';")
            row = result.fetchone()
            if row:
                logger.info(f"✓ Apache AGE extension installed: version {row[1]}")
            else:
                logger.error("✗ Apache AGE extension not found!")
                logger.error("Please install Apache AGE first:")
                logger.error("  https://age.apache.org/age-manual/master/intro/setup.html")
                return
        
        # Create relational tables
        logger.info("\n3. Creating relational tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Created tables:")
        for table_name in Base.metadata.tables.keys():
            logger.info(f"  - {table_name}")
        
        # Create AGE graph
        logger.info("\n4. Creating AGE graph...")
        if age_conn.graph_exists():
            logger.info(f"✓ Graph '{settings.AGE_GRAPH_NAME}' already exists")
        else:
            age_conn.create_graph()
            logger.info(f"✓ Created graph '{settings.AGE_GRAPH_NAME}'")
        
        logger.info("\n" + "=" * 50)
        logger.info("✓ Database initialization completed successfully!")
        logger.info("=" * 50)
        logger.info("\nNext steps:")
        logger.info("  1. Generate synthetic data: python scripts/generate_synthetic_data.py")
        logger.info("  2. Load data into database: python scripts/load_synthetic_data.py")
        logger.info("  3. Build graph: python scripts/build_graph.py")
        logger.info("  4. Start backend: cd backend && uvicorn src.main:app --reload")
        
    except Exception as e:
        logger.error("\n" + "=" * 50)
        logger.error("✗ Database initialization failed!")
        logger.error("=" * 50)
        logger.error(f"Error: {str(e)}")
        raise


if __name__ == "__main__":
    main()
