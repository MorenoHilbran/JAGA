"""
Database connection and session management for JAGA backend.
Provides SQLAlchemy engine, session factory, and Apache AGE connection utilities.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import psycopg2
from psycopg2.extras import RealDictCursor
import logging

from config import settings

logger = logging.getLogger(__name__)

# SQLAlchemy setup for relational tables
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db() -> Session:
    """
    Dependency function to get database session.
    Use in FastAPI endpoints with Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    """
    Context manager for database session.
    Use in scripts and non-FastAPI code.
    
    Example:
        with get_db_context() as db:
            db.query(Model).all()
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


# Apache AGE Connection
class AGEConnection:
    """
    Apache AGE graph database connection manager.
    Handles raw psycopg2 connections for executing openCypher queries.
    """
    
    def __init__(self):
        self.connection_params = {
            "host": settings.DB_HOST,
            "port": settings.DB_PORT,
            "database": settings.DB_NAME,
            "user": settings.DB_USER,
            "password": settings.DB_PASSWORD,
        }
        self.graph_name = settings.AGE_GRAPH_NAME
        self.age_schema = settings.AGE_SCHEMA
    
    def get_connection(self):
        """Get a raw psycopg2 connection"""
        conn = psycopg2.connect(**self.connection_params)
        
        # Set up AGE for this connection
        with conn.cursor() as cur:
            cur.execute("LOAD 'age';")
            cur.execute(f"SET search_path = {self.age_schema}, \"$user\", public;")
        
        conn.commit()
        return conn
    
    @contextmanager
    def get_cursor(self):
        """
        Context manager for AGE cursor.
        
        Example:
            with age_conn.get_cursor() as cur:
                cur.execute(cypher_query)
                results = cur.fetchall()
        """
        conn = self.get_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        try:
            yield cur
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            cur.close()
            conn.close()
    
    def execute_cypher(self, cypher_query: str, parameters: dict = None):
        """
        Execute an openCypher query via Apache AGE.
        
        Args:
            cypher_query: openCypher query string
            parameters: Query parameters (optional)
        
        Returns:
            Query results as list of dictionaries
        
        Example:
            results = age_conn.execute_cypher('''
                SELECT * FROM cypher('jkn_graph', $$
                    MATCH (p:Provider)-[:SUBMITS]->(c:Claim)
                    WHERE c.claim_amount > 5000000
                    RETURN p, c
                $$) as (provider agtype, claim agtype);
            ''')
        """
        with self.get_cursor() as cur:
            if parameters:
                cur.execute(cypher_query, parameters)
            else:
                cur.execute(cypher_query)
            return cur.fetchall()
    
    def create_graph(self):
        """Create the AGE graph if it doesn't exist"""
        with self.get_cursor() as cur:
            try:
                cur.execute(f"SELECT * FROM ag_catalog.create_graph('{self.graph_name}');")
                logger.info(f"Created AGE graph: {self.graph_name}")
            except psycopg2.errors.DuplicateObject:
                logger.info(f"AGE graph already exists: {self.graph_name}")
    
    def drop_graph(self, cascade: bool = True):
        """Drop the AGE graph (careful!)"""
        with self.get_cursor() as cur:
            cascade_str = "CASCADE" if cascade else ""
            cur.execute(f"SELECT * FROM ag_catalog.drop_graph('{self.graph_name}', true);")
            logger.warning(f"Dropped AGE graph: {self.graph_name}")
    
    def graph_exists(self) -> bool:
        """Check if the graph exists"""
        with self.get_cursor() as cur:
            cur.execute(f"""
                SELECT EXISTS(
                    SELECT 1 FROM ag_catalog.ag_graph 
                    WHERE name = '{self.graph_name}'
                );
            """)
            return cur.fetchone()['exists']


# Global AGE connection instance
age_conn = AGEConnection()


def init_database():
    """
    Initialize database: create tables and graph.
    Call this during application startup or in setup scripts.
    """
    logger.info("Initializing database...")
    
    # Create relational tables
    Base.metadata.create_all(bind=engine)
    logger.info("Created relational tables")
    
    # Create AGE graph
    age_conn.create_graph()
    logger.info("AGE graph initialized")


def get_age_connection() -> AGEConnection:
    """
    Dependency function to get AGE connection.
    Use in FastAPI endpoints if needed.
    """
    return age_conn
