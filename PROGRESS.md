# JAGA Project Progress Tracker

**Project**: JAGA - Jaringan Analitik Guard Anti-fraud  
**Team**: Renggo, Moreno, Paundra  
**Start Date**: 2026-10-02  
**Last Updated**: 2026-10-02  

---

## 📊 Project Overview

### Scope
- **Type**: MVP (Minimum Viable Product)
- **Environment**: Local Development
- **Data**: 100% Synthetic
- **Database**: PostgreSQL + Apache AGE
- **Detection Layers**: All 4 (Rules, Statistical, Graph Analytics, ML)

### Tech Stack
- **Backend**: Python 3.11 + FastAPI
- **Frontend**: React + Vite + Material-UI
- **Database**: PostgreSQL 16 + Apache AGE
- **Graph Visualization**: Cytoscape.js
- **ML**: Scikit-learn, NetworkX, LightGBM

---

## 🎯 Overall Progress: 5%

### Phase Status
- [x] Phase 0: Planning & Documentation (100%)
- [ ] Phase 1: Project Setup (10%)
- [ ] Phase 2: Database & Data Layer (0%)
- [ ] Phase 3: Backend Core (0%)
- [ ] Phase 4: Detection Engine (0%)
- [ ] Phase 5: Frontend Core (0%)
- [ ] Phase 6: Integration & Testing (0%)
- [ ] Phase 7: Polish & Demo Prep (0%)

---

## 📅 Detailed Task Breakdown

### PHASE 1: PROJECT SETUP (10% Complete)

#### 1.1 Project Structure ✅ IN PROGRESS
- [x] Create directory structure
- [x] Organize documentation files
- [ ] Create README.md
- [ ] Create .gitignore
- [ ] Create .env.example

**Owner**: Renggo  
**Status**: In Progress  
**Started**: 2026-10-02  
**Estimated**: 0.5 days  

---

#### 1.2 Backend Environment Setup ⏳ PENDING
- [ ] Create Python virtual environment
- [ ] Create requirements.txt
- [ ] Install core dependencies (FastAPI, SQLAlchemy, etc)
- [ ] Create backend/src/__init__.py files
- [ ] Create config.py for environment management
- [ ] Test backend can run (hello world endpoint)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 1 day  
**Dependencies**: 1.1

---

#### 1.3 Frontend Environment Setup ⏳ PENDING
- [ ] Initialize React + Vite project
- [ ] Install core dependencies (MUI, React Router, Axios)
- [ ] Create basic component structure
- [ ] Configure routing
- [ ] Test frontend can run (hello world page)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 1 day  
**Dependencies**: 1.1

---

#### 1.4 Database Setup ⏳ PENDING
- [ ] Create PostgreSQL database (jkn_riskgraph)
- [ ] Install Apache AGE extension
- [ ] Test AGE extension working
- [ ] Create database connection from backend
- [ ] Document database connection setup

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 1 day  
**Dependencies**: 1.2

---

### PHASE 2: DATABASE & DATA LAYER (0% Complete)

#### 2.1 Database Schema Design ⏳ PENDING
- [ ] Design relational tables (participants, providers, doctors, claims)
- [ ] Design graph schema (nodes, edges, properties)
- [ ] Create SQL migration scripts
- [ ] Document schema design decisions

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 1.4

---

#### 2.2 Synthetic Data Generator ⏳ PENDING
- [ ] Design realistic JKN data structure
- [ ] Generate participants (10K records)
- [ ] Generate providers (100 records)
- [ ] Generate doctors (500 records)
- [ ] Generate claims (100K records over 12 months)
- [ ] Inject fraud patterns (5% of data)
  - [ ] Cloning patterns
  - [ ] Referral concentration
  - [ ] Prolonged LOS
  - [ ] Repeat billing
- [ ] Create data loading script
- [ ] Test data quality

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 2.1

---

#### 2.3 Data Ingestion Pipeline ⏳ PENDING
- [ ] ETL script for loading synthetic data
- [ ] Data validation rules
- [ ] Entity resolution logic
- [ ] Error handling and logging
- [ ] Test full data load

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 2.2

---

#### 2.4 Graph Construction ⏳ PENDING
- [ ] AGE graph creation queries
- [ ] Node creation (Participant, Doctor, Provider, Claim)
- [ ] Edge creation (VISITS, TREATS, WORKS_AT, GENERATES, SUBMITS)
- [ ] Graph indexing
- [ ] Test graph queries
- [ ] Performance optimization

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 2.3

---

### PHASE 3: BACKEND CORE (0% Complete)

#### 3.1 API Foundation ⏳ PENDING
- [ ] FastAPI app setup with routers
- [ ] Database session management
- [ ] Error handling middleware
- [ ] Request/response models (Pydantic)
- [ ] API documentation (auto-generated)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 1.2, 2.1

---

#### 3.2 Core API Endpoints ⏳ PENDING
- [ ] GET /api/networks - List priority networks
- [ ] GET /api/networks/{id} - Get network details
- [ ] GET /api/networks/{id}/claims - Get network claims
- [ ] GET /api/graph/query - Query graph data
- [ ] GET /api/stats/summary - Dashboard statistics
- [ ] POST /api/investigation/decision - Record investigation decision

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 3.1

---

#### 3.3 Graph Query Module ⏳ PENDING
- [ ] AGE query wrapper functions
- [ ] Network expansion queries (N-hop neighbors)
- [ ] Entity retrieval queries
- [ ] Relationship queries
- [ ] Query optimization
- [ ] Caching layer

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 2.4, 3.1

---

### PHASE 4: DETECTION ENGINE (0% Complete)

#### 4.1 Feature Engineering ⏳ PENDING
- [ ] Compute provider features (claim_rate, avg_amount, etc)
- [ ] Compute doctor features (referral_rate, patient_count, etc)
- [ ] Compute graph features (degree, centrality)
- [ ] Peer group definition logic
- [ ] Peer statistics computation
- [ ] Feature storage optimization

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 2.4

---

#### 4.2 Rule-Based Detection ⏳ PENDING
- [ ] Rule engine framework
- [ ] Rule 1: Cloning detection
- [ ] Rule 2: Referral concentration
- [ ] Rule 3: Prolonged LOS
- [ ] Rule 4: Repeat billing
- [ ] Rule 5: Upcoding detection
- [ ] Rule execution pipeline
- [ ] Rule output storage

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 4 days  
**Dependencies**: 4.1

---

#### 4.3 Statistical Anomaly Detection ⏳ PENDING
- [ ] Peer group assignment
- [ ] Isolation Forest implementation
- [ ] Local Outlier Factor implementation
- [ ] Z-score/IQR outlier detection
- [ ] Anomaly score computation
- [ ] Integration with rule engine

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 4.1

---

#### 4.4 Graph Analytics ⏳ PENDING
- [ ] Degree centrality computation
- [ ] Betweenness centrality computation
- [ ] Community detection (Louvain algorithm)
- [ ] Motif detection (referral triangles, etc)
- [ ] Graph signal generation
- [ ] Performance optimization

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 4 days  
**Dependencies**: 4.1, 3.3

---

#### 4.5 Machine Learning Models ⏳ PENDING
- [ ] Training data preparation
- [ ] Feature vector creation (400+ features)
- [ ] Gradient boosting model training (LightGBM)
- [ ] Model evaluation (AUC-ROC, F-score)
- [ ] Model saving/loading
- [ ] Prediction pipeline
- [ ] Model versioning

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 5 days  
**Dependencies**: 4.1, 4.2, 4.3
**Note**: Requires labeled data - may defer to post-MVP

---

#### 4.6 Risk Fusion & Scoring ⏳ PENDING
- [ ] Signal collection from all layers
- [ ] Signal normalization
- [ ] Weighted aggregation algorithm
- [ ] Network-level aggregation
- [ ] Score calibration
- [ ] Risk categorization (LOW/MEDIUM/HIGH/CRITICAL)
- [ ] Priority queue generation

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 4.2, 4.3, 4.4

---

#### 4.7 Explainability Engine ⏳ PENDING
- [ ] Signal attribution computation
- [ ] Template-based NLG (Indonesian)
- [ ] Peer comparison data preparation
- [ ] Explanation API endpoint
- [ ] Explanation caching

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 4.6

---

### PHASE 5: FRONTEND CORE (0% Complete)

#### 5.1 Layout & Navigation ⏳ PENDING
- [ ] App shell with header/sidebar
- [ ] Navigation menu
- [ ] User profile menu (mock)
- [ ] Route configuration
- [ ] Responsive layout
- [ ] Theme setup (Material-UI)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 1.3

---

#### 5.2 Investigation Dashboard ⏳ PENDING
- [ ] Priority queue table component
- [ ] Risk score visualization (gauge/badge)
- [ ] Filter panel
- [ ] Sorting functionality
- [ ] Pagination
- [ ] Real-time updates (polling/websocket)
- [ ] Statistics cards

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 4 days  
**Dependencies**: 5.1, 3.2

---

#### 5.3 Network Detail View ⏳ PENDING
- [ ] Network summary card
- [ ] Tab navigation (Overview, Claims, Timeline, AI Insights)
- [ ] Risk explanation panel
- [ ] Peer comparison charts
- [ ] Claims data table
- [ ] Timeline visualization
- [ ] Action buttons (Confirm/Dismiss/Need Evidence)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 5 days  
**Dependencies**: 5.1, 3.2

---

#### 5.4 Network Visualization ⏳ PENDING
- [ ] Cytoscape.js integration
- [ ] Graph rendering component
- [ ] Node styling (by entity type)
- [ ] Edge styling (by relationship type)
- [ ] Interactive controls (zoom, pan, filter)
- [ ] Layout algorithms (force-directed, hierarchical)
- [ ] Node/edge tooltips
- [ ] Highlight suspicious patterns
- [ ] Performance optimization (500+ nodes)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 5 days  
**Dependencies**: 5.3, 3.3

---

#### 5.5 Charts & Visualizations ⏳ PENDING
- [ ] Risk trend chart (line chart)
- [ ] Signal breakdown chart (horizontal bar)
- [ ] Peer comparison chart (box plot)
- [ ] Activity timeline
- [ ] Distribution histograms
- [ ] Chart library setup (Recharts/Chart.js)

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 5.2, 5.3

---

### PHASE 6: INTEGRATION & TESTING (0% Complete)

#### 6.1 End-to-End Integration ⏳ PENDING
- [ ] Backend + Frontend integration
- [ ] API client error handling
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] API mocking for development

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 5.4

---

#### 6.2 Testing ⏳ PENDING
- [ ] Backend unit tests (pytest)
- [ ] API endpoint tests
- [ ] Detection rule tests
- [ ] Graph query tests
- [ ] Frontend component tests (Jest/React Testing Library)
- [ ] Integration tests
- [ ] Manual testing scenarios

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 3 days  
**Dependencies**: 6.1

---

#### 6.3 Performance Optimization ⏳ PENDING
- [ ] Database query optimization
- [ ] API response time optimization
- [ ] Frontend rendering optimization
- [ ] Graph visualization performance
- [ ] Caching strategy
- [ ] Load testing

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 6.2

---

### PHASE 7: POLISH & DEMO PREP (0% Complete)

#### 7.1 Documentation ⏳ PENDING
- [ ] README.md with setup instructions
- [ ] API documentation
- [ ] Developer guide
- [ ] User guide
- [ ] Demo script
- [ ] Architecture diagrams

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 6.3

---

#### 7.2 Demo Preparation ⏳ PENDING
- [ ] Demo dataset with clear fraud patterns
- [ ] Demo scenario walkthrough
- [ ] Screenshots/screen recording
- [ ] Presentation slides
- [ ] Practice run

**Owner**: TBD  
**Status**: Pending  
**Estimated**: 2 days  
**Dependencies**: 7.1

---

## 📈 Progress Metrics

### Completed Tasks: 2 / 100+ tasks
### Estimated Total Effort: ~80 developer-days
### Team Size: 3 developers
### Estimated Timeline: 4-6 weeks (with parallel work)

---

## 🚧 Current Blockers

None currently.

---

## 🎯 This Week's Focus (Week 1: 2026-10-02 to 2026-10-06)

### Priority Tasks
1. Complete project structure setup
2. Set up backend environment
3. Set up frontend environment
4. Set up PostgreSQL + Apache AGE
5. Design database schema
6. Start synthetic data generator

### Task Assignments
- **Renggo**: Project setup, database setup
- **Moreno**: TBD
- **Paundra**: TBD

---

## 📝 Notes & Decisions

### 2026-10-02
- Project structure created
- Documentation organized into docs/ folder
- Using PostgreSQL + Apache AGE (as specified in requirements)
- MVP scope: All 4 detection layers
- Development environment: Local only
- Data: 100% synthetic

---

## 🔄 Next Steps

1. Complete Phase 1 setup tasks (environment, database)
2. Assign tasks to team members
3. Design database schema
4. Create synthetic data generator
5. Build backend API foundation

---

## 📞 Team Communication

### Daily Standups
- Time: TBD
- Format: What did you do? What will you do? Any blockers?

### Weekly Reviews
- Every: TBD
- Review progress, adjust priorities, demo progress

---

## 🎓 Learning Resources

### Apache AGE
- Official docs: https://age.apache.org/
- Getting started: https://age.apache.org/age-manual/master/intro/setup.html

### Graph Analytics
- NetworkX docs: https://networkx.org/documentation/stable/
- Graph algorithms: https://en.wikipedia.org/wiki/Graph_theory

### FastAPI
- Official docs: https://fastapi.tiangolo.com/

### React + Vite
- Vite docs: https://vitejs.dev/
- React docs: https://react.dev/

### Cytoscape.js
- Docs: https://js.cytoscape.org/
- Examples: https://js.cytoscape.org/demos/

---

**Last Updated**: 2026-10-02 by Renggo
