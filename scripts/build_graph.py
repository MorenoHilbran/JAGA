"""
Build Apache AGE graph from relational data.
Reads data from PostgreSQL tables and creates graph nodes and edges.
"""

import sys
import os
from pathlib import Path
from datetime import datetime

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.src.database import get_db_context, age_conn
from backend.src.models import Participant, Provider, Doctor, Claim
from backend.config import settings
from sqlalchemy import func
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class GraphBuilder:
    """Build Apache AGE graph from relational data"""
    
    def __init__(self):
        self.graph_name = settings.AGE_GRAPH_NAME
        self.stats = {
            "nodes_created": 0,
            "edges_created": 0,
            "start_time": None,
            "end_time": None
        }
    
    def clear_graph(self):
        """Clear existing graph data"""
        logger.info(f"Clearing existing graph '{self.graph_name}'...")
        
        try:
            # Drop and recreate graph
            age_conn.drop_graph(cascade=True)
            age_conn.create_graph()
            logger.info("✓ Graph cleared and recreated")
        except Exception as e:
            logger.warning(f"Could not clear graph: {e}")
            # Graph might not exist, that's okay
            age_conn.create_graph()
    
    def create_participant_nodes(self):
        """Create Participant nodes in graph"""
        logger.info("\n1. Creating Participant nodes...")
        
        with get_db_context() as db:
            participants = db.query(Participant).all()
            
            for i, p in enumerate(participants):
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    CREATE (:Participant {{
                        participant_id: '{p.participant_id}',
                        age_band: '{p.age_band}',
                        gender: '{p.gender}',
                        region: '{p.region_code}'
                    }})
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["nodes_created"] += 1
                
                if (i + 1) % 1000 == 0:
                    logger.info(f"  Created {i + 1}/{len(participants)} Participant nodes")
        
        logger.info(f"✓ Created {len(participants)} Participant nodes")
    
    def create_provider_nodes(self):
        """Create Provider nodes in graph"""
        logger.info("\n2. Creating Provider nodes...")
        
        with get_db_context() as db:
            providers = db.query(Provider).all()
            
            for p in providers:
                bed_count = p.bed_count if p.bed_count else 0
                
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    CREATE (:Provider {{
                        provider_id: '{p.provider_id}',
                        provider_name: '{p.provider_name.replace("'", "''")}',
                        facility_type: '{p.facility_type}',
                        region: '{p.region_code}',
                        bed_count: {bed_count}
                    }})
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["nodes_created"] += 1
        
        logger.info(f"✓ Created {len(providers)} Provider nodes")
    
    def create_doctor_nodes(self):
        """Create Doctor nodes in graph"""
        logger.info("\n3. Creating Doctor nodes...")
        
        with get_db_context() as db:
            doctors = db.query(Doctor).all()
            
            for d in doctors:
                # Calculate years in practice
                years_in_practice = (datetime.now().date() - d.practice_start_date).days // 365
                
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    CREATE (:Doctor {{
                        doctor_id: '{d.doctor_id}',
                        specialty: '{d.specialty}',
                        years_in_practice: {years_in_practice}
                    }})
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["nodes_created"] += 1
        
        logger.info(f"✓ Created {len(doctors)} Doctor nodes")
    
    def create_claim_nodes(self):
        """Create Claim nodes in graph"""
        logger.info("\n4. Creating Claim nodes...")
        
        with get_db_context() as db:
            claims = db.query(Claim).all()
            
            for i, c in enumerate(claims):
                # Convert arrays to string representation
                diagnosis_str = ','.join(c.diagnosis_codes) if c.diagnosis_codes else ''
                procedure_str = ','.join(c.procedure_codes) if c.procedure_codes else ''
                los = c.length_of_stay if c.length_of_stay else 0
                
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    CREATE (:Claim {{
                        claim_id: '{c.claim_id}',
                        claim_date: '{c.claim_date.isoformat()}',
                        claim_amount: {c.claim_amount},
                        diagnosis_codes: '{diagnosis_str}',
                        procedure_codes: '{procedure_str}',
                        length_of_stay: {los}
                    }})
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["nodes_created"] += 1
                
                if (i + 1) % 5000 == 0:
                    logger.info(f"  Created {i + 1}/{len(claims)} Claim nodes")
        
        logger.info(f"✓ Created {len(claims)} Claim nodes")
    
    def create_visits_edges(self):
        """Create VISITS edges (Participant -> Provider)"""
        logger.info("\n5. Creating VISITS edges...")
        
        with get_db_context() as db:
            # Aggregate visit data
            visits = db.query(
                Claim.participant_id,
                Claim.provider_id,
                func.min(Claim.claim_date).label('first_visit'),
                func.max(Claim.claim_date).label('last_visit'),
                func.count(Claim.claim_id).label('visit_count'),
                func.sum(Claim.claim_amount).label('total_amount')
            ).group_by(Claim.participant_id, Claim.provider_id).all()
            
            for i, v in enumerate(visits):
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    MATCH (participant:Participant {{participant_id: '{v.participant_id}'}}),
                          (provider:Provider {{provider_id: '{v.provider_id}'}})
                    CREATE (participant)-[:VISITS {{
                        first_visit_date: '{v.first_visit.isoformat()}',
                        last_visit_date: '{v.last_visit.isoformat()}',
                        total_visits: {v.visit_count},
                        total_amount: {v.total_amount}
                    }}]->(provider)
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["edges_created"] += 1
                
                if (i + 1) % 1000 == 0:
                    logger.info(f"  Created {i + 1}/{len(visits)} VISITS edges")
        
        logger.info(f"✓ Created {len(visits)} VISITS edges")
    
    def create_treats_edges(self):
        """Create TREATS edges (Doctor -> Participant)"""
        logger.info("\n6. Creating TREATS edges...")
        
        with get_db_context() as db:
            # Aggregate treatment data
            treatments = db.query(
                Claim.doctor_id,
                Claim.participant_id,
                func.min(Claim.claim_date).label('first_treatment'),
                func.max(Claim.claim_date).label('last_treatment'),
                func.count(Claim.claim_id).label('treatment_count')
            ).filter(Claim.doctor_id.isnot(None)).group_by(
                Claim.doctor_id, Claim.participant_id
            ).all()
            
            for i, t in enumerate(treatments):
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    MATCH (doctor:Doctor {{doctor_id: '{t.doctor_id}'}}),
                          (participant:Participant {{participant_id: '{t.participant_id}'}})
                    CREATE (doctor)-[:TREATS {{
                        first_treatment_date: '{t.first_treatment.isoformat()}',
                        last_treatment_date: '{t.last_treatment.isoformat()}',
                        treatment_count: {t.treatment_count}
                    }}]->(participant)
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["edges_created"] += 1
                
                if (i + 1) % 1000 == 0:
                    logger.info(f"  Created {i + 1}/{len(treatments)} TREATS edges")
        
        logger.info(f"✓ Created {len(treatments)} TREATS edges")
    
    def create_works_at_edges(self):
        """Create WORKS_AT edges (Doctor -> Provider)"""
        logger.info("\n7. Creating WORKS_AT edges...")
        
        with get_db_context() as db:
            # Get doctor affiliations
            doctors = db.query(Doctor).all()
            
            edge_count = 0
            for doctor in doctors:
                if doctor.affiliated_providers:
                    for provider_id in doctor.affiliated_providers:
                        cypher = f"""
                        SELECT * FROM cypher('{self.graph_name}', $$
                            MATCH (doctor:Doctor {{doctor_id: '{doctor.doctor_id}'}}),
                                  (provider:Provider {{provider_id: '{provider_id}'}})
                            CREATE (doctor)-[:WORKS_AT {{
                                affiliation_start_date: '{doctor.practice_start_date.isoformat()}'
                            }}]->(provider)
                        $$) as (result agtype);
                        """
                        
                        try:
                            age_conn.execute_cypher(cypher)
                            self.stats["edges_created"] += 1
                            edge_count += 1
                        except Exception as e:
                            # Provider might not exist in graph
                            logger.debug(f"Could not create WORKS_AT edge: {e}")
        
        logger.info(f"✓ Created {edge_count} WORKS_AT edges")
    
    def create_generates_edges(self):
        """Create GENERATES edges (Participant -> Claim)"""
        logger.info("\n8. Creating GENERATES edges...")
        
        with get_db_context() as db:
            claims = db.query(Claim).all()
            
            for i, c in enumerate(claims):
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    MATCH (participant:Participant {{participant_id: '{c.participant_id}'}}),
                          (claim:Claim {{claim_id: '{c.claim_id}'}})
                    CREATE (participant)-[:GENERATES {{
                        claim_date: '{c.claim_date.isoformat()}'
                    }}]->(claim)
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["edges_created"] += 1
                
                if (i + 1) % 5000 == 0:
                    logger.info(f"  Created {i + 1}/{len(claims)} GENERATES edges")
        
        logger.info(f"✓ Created {len(claims)} GENERATES edges")
    
    def create_submits_edges(self):
        """Create SUBMITS edges (Provider -> Claim)"""
        logger.info("\n9. Creating SUBMITS edges...")
        
        with get_db_context() as db:
            claims = db.query(Claim).all()
            
            for i, c in enumerate(claims):
                cypher = f"""
                SELECT * FROM cypher('{self.graph_name}', $$
                    MATCH (provider:Provider {{provider_id: '{c.provider_id}'}}),
                          (claim:Claim {{claim_id: '{c.claim_id}'}})
                    CREATE (provider)-[:SUBMITS {{
                        submission_date: '{c.claim_date.isoformat()}'
                    }}]->(claim)
                $$) as (result agtype);
                """
                
                age_conn.execute_cypher(cypher)
                self.stats["edges_created"] += 1
                
                if (i + 1) % 5000 == 0:
                    logger.info(f"  Created {i + 1}/{len(claims)} SUBMITS edges")
        
        logger.info(f"✓ Created {len(claims)} SUBMITS edges")
    
    def verify_graph(self):
        """Verify graph construction"""
        logger.info("\n10. Verifying graph...")
        
        # Count nodes by label
        for label in ["Participant", "Provider", "Doctor", "Claim"]:
            cypher = f"""
            SELECT * FROM cypher('{self.graph_name}', $$
                MATCH (n:{label})
                RETURN count(n) as count
            $$) as (count agtype);
            """
            result = age_conn.execute_cypher(cypher)
            count = result[0]['count'] if result else 0
            logger.info(f"  {label} nodes: {count}")
        
        # Count edges by type
        for rel_type in ["VISITS", "TREATS", "WORKS_AT", "GENERATES", "SUBMITS"]:
            cypher = f"""
            SELECT * FROM cypher('{self.graph_name}', $$
                MATCH ()-[r:{rel_type}]->()
                RETURN count(r) as count
            $$) as (count agtype);
            """
            result = age_conn.execute_cypher(cypher)
            count = result[0]['count'] if result else 0
            logger.info(f"  {rel_type} edges: {count}")
    
    def build(self):
        """Main graph building process"""
        logger.info("=" * 60)
        logger.info("JAGA Graph Builder - Apache AGE")
        logger.info("=" * 60)
        
        self.stats["start_time"] = datetime.now()
        
        try:
            # Clear existing graph
            self.clear_graph()
            
            # Create nodes
            self.create_participant_nodes()
            self.create_provider_nodes()
            self.create_doctor_nodes()
            self.create_claim_nodes()
            
            # Create edges
            self.create_visits_edges()
            self.create_treats_edges()
            self.create_works_at_edges()
            self.create_generates_edges()
            self.create_submits_edges()
            
            # Verify
            self.verify_graph()
            
            self.stats["end_time"] = datetime.now()
            duration = (self.stats["end_time"] - self.stats["start_time"]).total_seconds()
            
            logger.info("\n" + "=" * 60)
            logger.info("✓ Graph construction completed!")
            logger.info("=" * 60)
            logger.info(f"\nStatistics:")
            logger.info(f"  Nodes created: {self.stats['nodes_created']}")
            logger.info(f"  Edges created: {self.stats['edges_created']}")
            logger.info(f"  Duration: {duration:.1f} seconds")
            logger.info(f"\nNext steps:")
            logger.info(f"  1. Run feature engineering: python scripts/run_feature_engineering.py")
            logger.info(f"  2. Run risk detection: python scripts/run_risk_detection.py")
            logger.info(f"  3. Start backend: cd backend && uvicorn src.main:app --reload")
            
        except Exception as e:
            logger.error("\n" + "=" * 60)
            logger.error("✗ Graph construction failed!")
            logger.error("=" * 60)
            logger.error(f"Error: {str(e)}")
            raise


def main():
    builder = GraphBuilder()
    builder.build()


if __name__ == "__main__":
    main()
