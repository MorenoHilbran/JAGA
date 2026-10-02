# JAGA Project Progress Tracker

**Project**: JAGA - Jaringan Analitik Guard Anti-fraud  
**Team**: Renggo (Backend), Moreno (Frontend), Paundra (Detection Engine)  
**Start Date**: 2026-10-02  
**Last Updated**: 2026-10-02T12:00:17.047Z  

---

## 🎯 TEAM ALLOCATION & RESPONSIBILITIES

### 👤 RENGGO (Backend API + Database Lead)
**Primary Focus:** Backend API, Database, Data Pipeline, Detection Rules Framework

**Files to Own:**
- `backend/src/api/*.py` (NEW - your territory)
- `backend/src/data/*.py` (NEW - your territory)
- `backend/src/detection/rules/*.py` (NEW - your territory)
- `scripts/*.py` (enhance existing)
- `database/*.py` (enhance existing)

**✅ CAN WORK ON:**
- All backend API endpoints
- Database setup and migrations
- Data generation and loading
- Graph construction scripts
- Detection rules implementation
- Backend configuration

**❌ DO NOT TOUCH:**
- `frontend/src/*` - This is MORENO's territory
- `backend/src/detection/statistical/*` - This is PAUNDRA's territory
- `backend/src/detection/graph_analytics/*` - This is PAUNDRA's territory
- `backend/src/explainability/*` - This is PAUNDRA's territory

**Integration Points:**
- Provide API endpoints for MORENO to consume
- Provide rule execution results for PAUNDRA to integrate
- Coordinate on RiskSignal data structure with PAUNDRA

---

### 👤 MORENO (Frontend Lead)
**Primary Focus:** UI Components, Visualization, User Experience, Design System

**Files to Own:**
- `frontend/src/components/*.jsx` (NEW - your territory)
- `frontend/src/pages/*.jsx` (enhance existing - your territory)
- `frontend/src/services/api.js` (enhance existing)
- `frontend/src/theme/*.js` (NEW - your territory)
- `frontend/src/utils/*.js` (NEW - your territory)

**✅ CAN WORK ON:**
- All React components and pages
- Design system implementation (from Design.md)
- Network visualization with Cytoscape.js
- Charts and data visualizations
- User interaction flows
- Frontend styling and theming

**❌ DO NOT TOUCH:**
- `backend/*` - Backend is RENGGO and PAUNDRA's territory
- Only consume APIs, never modify backend code

**Integration Points:**
- Consume RENGGO's API endpoints
- Display PAUNDRA's risk explanations
- Coordinate on API response format with RENGGO

---

### 👤 PAUNDRA (Detection Engine Lead)
**Primary Focus:** Statistical Anomaly Detection, Graph Analytics, Risk Fusion, Explainability

**Files to Own:**
- `backend/src/detection/statistical/*.py` (NEW - your territory)
- `backend/src/detection/graph_analytics/*.py` (NEW - your territory)
- `backend/src/detection/risk_fusion.py` (NEW - your territory)
- `backend/src/explainability/*.py` (NEW - your territory)

**✅ CAN WORK ON:**
- Statistical anomaly detection (Isolation Forest, LOF, Z-score)
- Graph analytics (centrality, community detection, motifs)
- Risk fusion algorithm
- Explainability engine (NLG, signal attribution)
- ML model integration (future)

**❌ DO NOT TOUCH:**
- `frontend/*` - This is MORENO's territory
- `backend/src/api/*` - This is RENGGO's territory
- `backend/src/data/*` - This is RENGGO's territory

**Integration Points:**
- Integrate RENGGO's rule execution outputs
- Provide explanation format for MORENO to display
- Coordinate on risk signal aggregation with RENGGO

---

## ⚠️ CRITICAL: AI AGENT UPDATE PROTOCOL

**🚨 MANDATORY untuk SEMUA AI Agents (Renggo, Moreno, Paundra):**

### BEFORE EVERY COMMIT, YOU MUST:
1. ✅ **READ** this PROGRESS.md file completely
2. ✅ **FIND** your section (RENGGO / MORENO / PAUNDRA)
3. ✅ **UPDATE** your task checklist (mark ✅ for completed)
4. ✅ **ADD** any new blockers or notes
5. ✅ **UPDATE** "Last Updated by [YOUR NAME]" timestamp
6. ✅ **STAGE** PROGRESS.md: `git add PROGRESS.md`
7. ✅ **COMMIT** together with your code changes

### Example Correct Commit Flow:
```bash
# 1. Do your work
vim backend/src/api/networks.py

# 2. Stage your changes
git add backend/src/api/networks.py

# 3. UPDATE PROGRESS.md (MANDATORY!)
# - Mark completed tasks with ✅
# - Update your timestamp
vim PROGRESS.md

# 4. Stage PROGRESS.md
git add PROGRESS.md

# 5. Commit with descriptive message
git commit -m "feat(api): implement networks API endpoint

- Added GET /api/networks with pagination and filters
- Added GET /api/networks/{id} for detail view
- Added Pydantic models for request/response
- Updated RENGGO progress section

Files: backend/src/api/networks.py, PROGRESS.md"

# 6. Push to your branch
git push origin renggo/backend-api
```

### ❌ BAD Commit (Don't Do This):
```bash
git commit -m "update"
# Missing: What was updated?
# Missing: PROGRESS.md not included
# Missing: Details
```

### 🎯 Why This Protocol Matters:
- **Prevents duplicate work** - Team knows what's done
- **Real-time coordination** - AI agents can read current state
- **Clear accountability** - Who did what and when
- **Merge conflict prevention** - Clear file ownership
- **Progress visibility** - Everyone sees the big picture

---

## 📅 WEEK-BY-WEEK MILESTONES

### 🗓️ Week 1 (Oct 2-8): Setup & Foundation
**Goal:** Get all environments running, data generated, design system implemented

- **Renggo**: Database setup → Data generation → Graph construction → API skeleton
- **Moreno**: Frontend setup → Design system implementation → Base components
- **Paundra**: Algorithm study → Environment setup → Peer group logic

**Critical Path:** Renggo's database setup (blocks everyone)
**Parallel Work:** Moreno's design system, Paundra's algorithm study

---

### 🗓️ Week 2-3 (Oct 9-22): Core Development
**Goal:** All detection layers working, all UI components functional, API complete

- **Renggo**: Complete all API endpoints → Implement 5 detection rules
- **Moreno**: Dashboard + Network Detail views → Connect to API → Visualization
- **Paundra**: Statistical detection → Graph analytics → Risk fusion

**Critical Path:** API endpoints (blocks Moreno)
**Parallel Work:** Detection algorithms (Paundra), UI components (Moreno)

---

### 🗓️ Week 4-5 (Oct 23 - Nov 5): Integration & Polish
**Goal:** Everything integrated, tested, demo-ready

- **All**: Integration testing, bug fixes, performance optimization
- **All**: Demo preparation, documentation, presentation

---

## 📊 OVERALL PROGRESS METRICS

### Current Status: 15% Complete

**Phase Completion:**
- ✅ Phase 0: Planning & Documentation (100%)
- 🟡 Phase 1: Project Setup (15%)
- 🔴 Phase 2: Database & Data Layer (0%)
- 🔴 Phase 3: Backend Core (0%)
- 🔴 Phase 4: Detection Engine (0%)
- 🔴 Phase 5: Frontend Core (0%)
- 🔴 Phase 6: Integration & Testing (0%)
- 🔴 Phase 7: Polish & Demo (0%)

**Individual Progress:**
- **Renggo**: 0/30 tasks (0%)
- **Moreno**: 0/25 tasks (0%)
- **Paundra**: 0/28 tasks (0%)

**Last Global Update**: 2026-10-02T12:00:17.047Z

---

## 🔵 RENGGO'S TASK BREAKDOWN

### PHASE 1: Database & Data Pipeline (Week 1)
**Status**: 🔴 Not Started  
**Priority**: 🔥 CRITICAL PATH - Blocks everyone!

#### Task 1.1: PostgreSQL + Apache AGE Setup
**Status**: ⏳ Pending

- [ ] Install PostgreSQL 16+ on local machine
- [ ] Install Apache AGE extension (follow README.md guide)
- [ ] Create database `jkn_riskgraph`
- [ ] Install AGE extension in database
- [ ] Test AGE extension: `SELECT * FROM ag_catalog.ag_graph;`
- [ ] Document any installation issues

**Estimated Time**: 4-6 hours  
**Files**: None (system setup)  
**Blocks**: Everyone (critical path!)  
**Notes**: Check README.md for detailed instructions. Use WSL2 if on Windows.

---

#### Task 1.2: Database Schema Initialization
**Status**: ⏳ Pending

- [ ] Run `python database/init_db.py`
- [ ] Verify 8 tables created (participants, providers, doctors, claims, etc)
- [ ] Verify AGE graph 'jkn_graph' created
- [ ] Check for any errors in logs

**Estimated Time**: 30 minutes  
**Files**: `database/init_db.py` (already exists)  
**Dependencies**: Task 1.1 must be complete  
**Blocks**: Tasks 1.3, 1.4

---

#### Task 1.3: Synthetic Data Generation
**Status**: ⏳ Pending

- [ ] Run `python scripts/generate_synthetic_data.py`
- [ ] Verify output files in `database/seeds/`:
  - [ ] participants.csv (10,000 records)
  - [ ] providers.csv (100 records)
  - [ ] doctors.csv (500 records)
  - [ ] claims.csv (100,000 records)
  - [ ] fraud_ground_truth.json (fraud labels)
- [ ] Check fraud rate is ~5%
- [ ] Review fraud patterns injected

**Estimated Time**: 2-3 hours (script runs ~5-10 minutes)  
**Files**: `scripts/generate_synthetic_data.py` (already exists)  
**Dependencies**: Task 1.2  
**Blocks**: Everyone needs data!

---

#### Task 1.4: Load Data into Database
**Status**: ⏳ Pending

- [ ] Run `python scripts/load_synthetic_data.py`
- [ ] Verify data loading:
  - [ ] 10,000 participants loaded
  - [ ] 100 providers loaded
  - [ ] 500 doctors loaded
  - [ ] 100,000 claims loaded
- [ ] Check foreign key integrity (no orphaned records)
- [ ] Verify data quality metrics

**Estimated Time**: 1-2 hours (loading takes ~10 minutes)  
**Files**: `scripts/load_synthetic_data.py` (already exists)  
**Dependencies**: Task 1.3  
**Blocks**: Task 1.5

---

#### Task 1.5: Graph Construction
**Status**: ⏳ Pending

- [ ] Run `python scripts/build_graph.py`
- [ ] Verify nodes created:
  - [ ] 10,000 Participant nodes
  - [ ] 100 Provider nodes
  - [ ] 500 Doctor nodes
  - [ ] 100,000 Claim nodes
- [ ] Verify edges created:
  - [ ] VISITS edges (Participant → Provider)
  - [ ] TREATS edges (Doctor → Participant)
  - [ ] WORKS_AT edges (Doctor → Provider)
  - [ ] GENERATES edges (Participant → Claim)
  - [ ] SUBMITS edges (Provider → Claim)
- [ ] Test sample AGE query to verify graph works

**Estimated Time**: 2-3 hours (graph building takes ~15-30 minutes)  
**Files**: `scripts/build_graph.py` (already exists)  
**Dependencies**: Task 1.4  
**Blocks**: PAUNDRA's graph analytics tasks

---

### PHASE 2: Backend API Development (Week 1-2)
**Status**: 🔴 Not Started  
**Priority**: 🔥 HIGH - Blocks MORENO!

#### Task 2.1: API Foundation Enhancement
**Status**: ⏳ Pending

- [ ] Update `backend/src/main.py`:
  - [ ] Add router imports (after creating them)
  - [ ] Configure CORS for frontend (localhost:5173)
  - [ ] Add global error handling middleware
  - [ ] Add request logging middleware
- [ ] Test `/docs` endpoint shows API documentation
- [ ] Test `/health` endpoint returns status

**Estimated Time**: 2-3 hours  
**Files**: `backend/src/main.py` (enhance existing)  
**Dependencies**: Task 1.2 (database must exist)

---

#### Task 2.2: Pydantic Schemas (Response Models)
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/api/schemas.py`

- [ ] Create `NetworkListResponse` model
  - Fields: network_id, risk_score, risk_category, primary_risk_type, total_claim_amount, entity_count, detected_at
- [ ] Create `NetworkDetailResponse` model
  - Fields: all from list + explanation, signal_breakdown, peer_comparison, entity_ids
- [ ] Create `ClaimResponse` model
  - Fields: claim_id, participant_id, provider_id, claim_date, claim_amount, diagnosis_codes, procedure_codes
- [ ] Create `StatsResponse` model
  - Fields: total_networks, critical_count, high_count, total_amount_at_risk
- [ ] Add example values for auto-documentation

**Estimated Time**: 2-3 hours  
**Files**: `backend/src/api/schemas.py` (NEW FILE)

---

#### Task 2.3: Networks API Endpoint
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/api/networks.py`

- [ ] Implement `GET /api/networks`:
  - [ ] Query RiskNetwork table
  - [ ] Add filters: risk_category, region, date_range
  - [ ] Add pagination (page, limit)
  - [ ] Add sorting (by risk_score, date)
  - [ ] Return list of networks with metadata
- [ ] Implement `GET /api/networks/{network_id}`:
  - [ ] Query network detail
  - [ ] Include explanation
  - [ ] Include signal breakdown
  - [ ] Include peer comparison data
  - [ ] Return 404 if not found
- [ ] Implement `GET /api/networks/{network_id}/claims`:
  - [ ] Query claims associated with network
  - [ ] Return paginated claim list
- [ ] Add router to main.py: `app.include_router(networks.router, prefix="/api/networks", tags=["networks"])`
- [ ] Test all endpoints with `/docs`

**Estimated Time**: 6-8 hours  
**Files**: `backend/src/api/networks.py` (NEW FILE)  
**Dependencies**: Task 2.2 (schemas), Task 1.5 (data must exist)  
**Blocks**: MORENO's dashboard connection (critical!)

---

#### Task 2.4: Stats API Endpoint
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/api/stats.py`

- [ ] Implement `GET /api/stats/summary`:
  - [ ] Count total networks
  - [ ] Count by risk category (CRITICAL, HIGH, MEDIUM, LOW)
  - [ ] Sum total amount at risk
  - [ ] Count pending investigations
  - [ ] Return dashboard summary statistics
- [ ] Add router to main.py
- [ ] Test endpoint

**Estimated Time**: 2-3 hours  
**Files**: `backend/src/api/stats.py` (NEW FILE)  
**Dependencies**: Task 2.2, Task 1.5

---

#### Task 2.5: Graph Query API Endpoint
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/api/graph.py`

- [ ] Implement `GET /api/graph/network/{network_id}`:
  - [ ] Query AGE graph for network entities
  - [ ] Get all nodes in network (Participant, Provider, Doctor, Claim)
  - [ ] Get all edges (VISITS, TREATS, etc)
  - [ ] Format for Cytoscape.js consumption
  - [ ] Return graph data as JSON
- [ ] Test with sample network_id

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/api/graph.py` (NEW FILE)  
**Dependencies**: Task 1.5 (graph must exist)  
**Blocks**: MORENO's network visualization

---

### PHASE 3: Detection Rules Framework (Week 2)
**Status**: 🔴 Not Started  
**Priority**: 🟡 MEDIUM - Feeds into PAUNDRA's work

#### Task 3.1: Rule Engine Base Classes
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/base.py`

- [ ] Create `BaseRule` abstract class:
  - [ ] Method: `execute(db_session) -> List[RiskSignal]`
  - [ ] Property: `rule_name`
  - [ ] Property: `rule_type`
  - [ ] Property: `confidence`
- [ ] Create `RuleEngine` class:
  - [ ] Method: `register_rule(rule: BaseRule)`
  - [ ] Method: `execute_all() -> List[RiskSignal]`
  - [ ] Method: `execute_one(rule_name) -> List[RiskSignal]`
- [ ] Create `RiskSignal` dataclass:
  - Fields: signal_type, entity_type, entity_id, score, confidence, evidence, explanation

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/rules/base.py` (NEW FILE)

---

#### Task 3.2: Cloning Detection Rule
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/cloning.py`

- [ ] Implement `CloningDetectionRule(BaseRule)`:
  - [ ] Query claims within same provider + 30-day window
  - [ ] Compute similarity score (diagnosis, procedure, amount, LOS)
  - [ ] Flag clusters with >90% similarity across >=5 claims
  - [ ] Generate CLONING_PATTERN signals
  - [ ] Include evidence: claim_ids, similarity_score, provider_id
- [ ] Test with synthetic data (should detect injected cloning patterns)
- [ ] Register rule in engine

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/rules/cloning.py` (NEW FILE)  
**Dependencies**: Task 3.1

---

#### Task 3.3: Referral Concentration Rule
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/referral_concentration.py`

- [ ] Implement `ReferralConcentrationRule(BaseRule)`:
  - [ ] Calculate referral % per doctor → provider
  - [ ] Compute peer group average (doctors with same specialty + region)
  - [ ] Flag if concentration >2σ above peer median
  - [ ] Generate REFERRAL_CONCENTRATION signals
  - [ ] Include: doctor_id, provider_id, percentage, peer_avg, deviation
- [ ] Test with synthetic data
- [ ] Register rule

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/rules/referral_concentration.py` (NEW FILE)  
**Dependencies**: Task 3.1

---

#### Task 3.4: Prolonged LOS Rule
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/prolonged_los.py`

- [ ] Implement `ProlongedLOSRule(BaseRule)`:
  - [ ] Calculate average LOS per provider × diagnosis
  - [ ] Compare to peer group (same facility_type + region)
  - [ ] Flag if average LOS >2σ above peer median
  - [ ] Generate PROLONGED_LOS signals
  - [ ] Include: provider_id, diagnosis, avg_los, peer_avg, deviation
- [ ] Test with synthetic data
- [ ] Register rule

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/rules/prolonged_los.py` (NEW FILE)  
**Dependencies**: Task 3.1

---

#### Task 3.5: Repeat Billing Rule
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/repeat_billing.py`

- [ ] Implement `RepeatBillingRule(BaseRule)`:
  - [ ] Find claims with same participant + provider + procedure within 7 days
  - [ ] Exclude legitimate follow-ups
  - [ ] Flag potential duplicates
  - [ ] Generate REPEAT_BILLING signals
  - [ ] Include: claim_pair_ids, time_gap, procedure_code
- [ ] Test with synthetic data
- [ ] Register rule

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/rules/repeat_billing.py` (NEW FILE)  
**Dependencies**: Task 3.1

---

#### Task 3.6: Upcoding Detection Rule
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/rules/upcoding.py`

- [ ] Implement `UpcodingRule(BaseRule)`:
  - [ ] Calculate % of "severe" diagnoses per provider
  - [ ] Compare to peer group average
  - [ ] Flag if >2σ above peer median
  - [ ] Generate UPCODING signals
  - [ ] Include: provider_id, severe_pct, peer_avg, deviation
- [ ] Test with synthetic data
- [ ] Register rule

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/rules/upcoding.py` (NEW FILE)  
**Dependencies**: Task 3.1

---

#### Task 3.7: Rule Execution Pipeline
**Status**: ⏳ Pending

**CREATE NEW FILE**: `scripts/run_detection_rules.py`

- [ ] Import all detection rules
- [ ] Register all rules in engine
- [ ] Execute all rules
- [ ] Save RiskSignal outputs to database (risk_signals table)
- [ ] Log execution statistics
- [ ] Test end-to-end pipeline

**Estimated Time**: 2-3 hours  
**Files**: `scripts/run_detection_rules.py` (NEW FILE)  
**Dependencies**: Tasks 3.2-3.6

---

### INTEGRATION POINTS

**With MORENO:**
- **Checkpoint Week 1 End**: API contract agreement
  - Agree on exact JSON format for NetworkResponse, StatsResponse
  - Document in README or API_CONTRACT.md
  - MORENO can start mocking API responses

**With PAUNDRA:**
- **Checkpoint Week 2 Day 2**: RiskSignal format agreement
  - Agree on RiskSignal dataclass fields
  - Document how to aggregate signals
  - PAUNDRA can start consuming rule outputs

---

### CURRENT STATUS SUMMARY

**Last Updated by RENGGO**: 2026-10-02T12:00:17.047Z

**Completed Tasks**: 0/30 ☐  
**In Progress**: 0 ⏳  
**Blocked**: 0 🚧  
**Pending**: 30 ⏸️

**Current Blockers**: None (you're the critical path - start with Task 1.1!)

**Help Needed**: None

**Notes**: 
- Start with database setup (Task 1.1) immediately - this blocks everyone!
- Data generation and loading (Tasks 1.3-1.5) are automated scripts - should be quick
- API endpoints (Tasks 2.3-2.5) are highest priority for MORENO
- Detection rules can be done incrementally (one at a time)

---

## 🎨 MORENO'S TASK BREAKDOWN

### PHASE 1: Frontend Setup & Design System (Week 1)
**Status**: 🔴 Not Started  
**Priority**: 🟡 MEDIUM - Can work in parallel

#### Task 1.1: Environment Setup
**Status**: ⏳ Pending

- [ ] Navigate to frontend: `cd frontend`
- [ ] Install dependencies: `npm install`
- [ ] Verify installation successful (check node_modules exists)
- [ ] Start dev server: `npm run dev`
- [ ] Verify frontend accessible at http://localhost:5173
- [ ] Check hot reload works

**Estimated Time**: 30 minutes  
**Files**: None (environment setup)  
**Dependencies**: None (can start immediately!)

---

#### Task 1.2: Design System Theme Configuration
**Status**: ⏳ Pending

**CREATE NEW FILE**: `frontend/src/theme/jaga-theme.js`

- [ ] Read `Design.md` thoroughly (understand color palette, typography, spacing)
- [ ] Create MUI theme with colors from Design.md:
  - [ ] Primary: `#35F2A0` (Signal Green)
  - [ ] Secondary: `#0D1130` (Deep Navy)
  - [ ] Error: `#FF5C67` (Critical Alert Red)
  - [ ] Warning: `#FF9F43` (High Risk Orange)
  - [ ] Background: `#0e112a` (Deep Navy Base)
  - [ ] Surface elevations: `#0D1130`, `#131735`, `#30334d`
- [ ] Configure typography:
  - [ ] Install fonts: Plus Jakarta Sans, Inter, JetBrains Mono
  - [ ] Setup font families in theme
  - [ ] Configure font sizes and weights from Design.md
- [ ] Configure spacing system (4px/8px modular base)
- [ ] Configure border radius (4px base, per Design.md)
- [ ] Export configured theme

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/theme/jaga-theme.js` (NEW FILE)  
**Dependencies**: Task 1.1  
**Reference**: Design.md lines 1-138

---

#### Task 1.3: Apply Theme to App
**Status**: ⏳ Pending

**ENHANCE FILE**: `frontend/src/App.jsx`

- [ ] Import jaga-theme
- [ ] Wrap app with `<ThemeProvider theme={jagaTheme}>`
- [ ] Add `<CssBaseline />` for consistent baseline
- [ ] Test theme colors appear correctly
- [ ] Verify typography renders with correct fonts

**Estimated Time**: 30 minutes  
**Files**: `frontend/src/App.jsx` (enhance existing)  
**Dependencies**: Task 1.2

---

#### Task 1.4: Base UI Components Library
**Status**: ⏳ Pending

**CREATE NEW FILES**: `frontend/src/components/*.jsx`

**Component 1.4.1**: `frontend/src/components/JagaButton.jsx`
- [ ] Signal Primary variant (green bg, dark text)
- [ ] Tactical Secondary variant (transparent with border)
- [ ] Critical Action variant (red)
- [ ] Apply Design.md button styles
- [ ] Export component

**Component 1.4.2**: `frontend/src/components/RiskBadge.jsx`
- [ ] CRITICAL variant (red)
- [ ] HIGH variant (orange)
- [ ] MEDIUM variant (yellow)
- [ ] LOW variant (green)
- [ ] Apply Design.md badge styles (1px stroke, translucent fill)
- [ ] Use JetBrains Mono font for labels

**Component 1.4.3**: `frontend/src/components/JagaCard.jsx`
- [ ] Surface elevation 1 style
- [ ] Surface elevation 2 style (hover state)
- [ ] Ghost hairline borders (rgba(255,255,255,0.08))
- [ ] 4px border radius

**Estimated Time**: 6-8 hours total  
**Files**: 3 new component files  
**Dependencies**: Task 1.3  
**Reference**: Design.md lines 199-208

---

### PHASE 2: Investigation Dashboard (Week 1-2)
**Status**: 🔴 Not Started  
**Priority**: 🔥 HIGH - Core user interface

#### Task 2.1: Enhanced Dashboard Layout
**Status**: ⏳ Pending

**ENHANCE FILE**: `frontend/src/pages/Dashboard.jsx`

- [ ] Apply Design.md dark telemetry theme:
  - [ ] Dark background (`#0e112a`)
  - [ ] Surface containers with elevation
  - [ ] Ghost hairlines between sections
- [ ] Replace mock data with API call (when RENGGO's API ready):
  - [ ] Create `loadNetworks()` function
  - [ ] Call `GET /api/networks` from api service
  - [ ] Handle loading state
  - [ ] Handle error state
  - [ ] Handle empty state
- [ ] Keep existing table structure
- [ ] Apply Design.md table styles (compact rows, tabular numbers)

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/pages/Dashboard.jsx` (enhance)  
**Dependencies**: Task 1.4, RENGGO's Task 2.3 (API endpoint)  
**Blocks**: ⚠️ Blocked until RENGGO finishes API

---

#### Task 2.2: Dashboard Filter Panel
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/FilterPanel.jsx`

- [ ] Risk category filter (dropdown: ALL, CRITICAL, HIGH, MEDIUM, LOW)
- [ ] Region filter (dropdown with Indonesian provinces)
- [ ] Date range filter (date pickers)
- [ ] Risk type filter (checkboxes: Cloning, Referral, LOS, etc)
- [ ] Apply filters button
- [ ] Clear filters button
- [ ] Style with Design.md input field styles
- [ ] Integrate with Dashboard.jsx

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/components/FilterPanel.jsx` (NEW)  
**Dependencies**: Task 2.1

---

#### Task 2.3: Stats Summary Cards
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/StatsCard.jsx`

- [ ] Reusable metric card component
- [ ] Props: title, value, trend, color
- [ ] Apply Design.md card elevation styles
- [ ] Add loading skeleton state
- [ ] Export component

**USE IN DASHBOARD**:
- [ ] Replace existing Card components with StatsCard
- [ ] Connect to `GET /api/stats/summary` API
- [ ] Display: Total Networks, Critical Count, High Count, Amount at Risk
- [ ] Add trend indicators (up/down arrows)

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/StatsCard.jsx` (NEW), Dashboard.jsx (enhance)  
**Dependencies**: Task 2.1, RENGGO's Task 2.4 (stats API)

---

#### Task 2.4: Risk Score Visualization
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/RiskScoreGauge.jsx`

- [ ] Circular gauge visualization (0-100)
- [ ] Color-coded by risk category
- [ ] Animated transition
- [ ] Compact size for table cells
- [ ] Export component

**USE IN DASHBOARD**:
- [ ] Replace simple score text with RiskScoreGauge
- [ ] Show in table risk score column

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/RiskScoreGauge.jsx` (NEW)  
**Dependencies**: Task 2.1

---

#### Task 2.5: Pagination Component
**Status**: ⏳ Pending

- [ ] Create pagination controls
- [ ] Page size selector (10, 20, 50, 100)
- [ ] Page navigation (prev, next, jump to page)
- [ ] Total count display
- [ ] Integrate with Dashboard table

**Estimated Time**: 2-3 hours  
**Files**: `frontend/src/components/Pagination.jsx` (NEW)  
**Dependencies**: Task 2.1

---

### PHASE 3: Network Detail View (Week 2)
**Status**: 🔴 Not Started  
**Priority**: 🔥 HIGH - Core investigation workflow

#### Task 3.1: Enhanced Network Detail Page
**Status**: ⏳ Pending

**ENHANCE FILE**: `frontend/src/pages/NetworkDetail.jsx`

- [ ] Connect to API `GET /api/networks/{id}`:
  - [ ] Load network detail on mount
  - [ ] Handle loading state
  - [ ] Handle error state (network not found)
- [ ] Apply Design.md styling (dark theme, elevations)
- [ ] Enhance summary card with real data
- [ ] Keep existing tab structure

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/pages/NetworkDetail.jsx` (enhance)  
**Dependencies**: RENGGO's Task 2.3 (API endpoint)  
**Blocks**: ⚠️ Blocked until RENGGO finishes API

---

#### Task 3.2: Risk Explanation Panel
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/RiskExplanationPanel.jsx`

- [ ] Display AI-generated explanation (plain Indonesian text)
- [ ] Show signal breakdown (horizontal bar chart with Recharts)
- [ ] Display top contributing factors (ordered list)
- [ ] Apply Design.md typography (Inter for body text)
- [ ] Integrate into NetworkDetail Overview tab

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/components/RiskExplanationPanel.jsx` (NEW)  
**Dependencies**: Task 3.1, PAUNDRA's explainability output format

---

#### Task 3.3: Peer Comparison Charts
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/PeerComparisonChart.jsx`

- [ ] Box plot visualization (Recharts)
- [ ] Show entity value vs peer distribution
- [ ] Highlight statistical significance (σ markers)
- [ ] Color-code deviations (>2σ = red, 1-2σ = orange)
- [ ] Integrate into NetworkDetail Overview tab

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/components/PeerComparisonChart.jsx` (NEW)  
**Dependencies**: Task 3.1

---

#### Task 3.4: Claims Data Table
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/ClaimsTable.jsx`

- [ ] Connect to API `GET /api/networks/{id}/claims`
- [ ] Paginated table with MUI DataGrid
- [ ] Columns: Claim ID, Participant, Date, Amount, Diagnosis, Procedure, Similarity Score, Flags
- [ ] Sortable columns
- [ ] Searchable/filterable
- [ ] Export to CSV button
- [ ] Apply Design.md table styles (compact rows, tabular nums)
- [ ] Integrate into NetworkDetail Claims tab

**Estimated Time**: 5-6 hours  
**Files**: `frontend/src/components/ClaimsTable.jsx` (NEW)  
**Dependencies**: Task 3.1, RENGGO's Task 2.3 (claims API)

---

#### Task 3.5: Timeline Visualization
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/ActivityTimeline.jsx`

- [ ] Timeline chart with Recharts
- [ ] X-axis: Time (months/weeks)
- [ ] Y-axis: Activity intensity (claim count or amount)
- [ ] Markers for key events (first suspicious claim, peak, latest)
- [ ] Pattern annotations (AI-generated labels)
- [ ] Hover tooltips with details
- [ ] Integrate into NetworkDetail Timeline tab

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/components/ActivityTimeline.jsx` (NEW)  
**Dependencies**: Task 3.1

---

### PHASE 4: Network Visualization (Week 2-3)
**Status**: 🔴 Not Started  
**Priority**: 🔥 CRITICAL - Signature feature!

#### Task 4.1: Cytoscape.js Integration
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/NetworkGraph.jsx`

- [ ] Install Cytoscape.js: `npm install cytoscape cytoscape-react`
- [ ] Create graph container component
- [ ] Connect to API `GET /api/graph/network/{id}`
- [ ] Parse graph data (nodes and edges)
- [ ] Initialize Cytoscape instance
- [ ] Test basic rendering (nodes and edges appear)

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/NetworkGraph.jsx` (NEW)  
**Dependencies**: Task 3.1, RENGGO's Task 2.5 (graph API)  
**Blocks**: ⚠️ Blocked until RENGGO finishes graph API

---

#### Task 4.2: Node Styling (by Entity Type)
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/components/NetworkGraph.jsx`

- [ ] Style Provider nodes (large blue circles, 16px)
- [ ] Style Doctor nodes (medium green circles, 12px)
- [ ] Style Participant nodes (small orange circles, 8px)
- [ ] Style Claim nodes (gray squares, 10px)
- [ ] Add labels to nodes (entity names)
- [ ] Apply Design.md colors and styles

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/NetworkGraph.jsx` (enhance)  
**Dependencies**: Task 4.1  
**Reference**: Design.md lines 217-219

---

#### Task 4.3: Edge Styling (by Relationship Type)
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/components/NetworkGraph.jsx`

- [ ] Style VISITS edges (blue, 2px)
- [ ] Style TREATS edges (green, 2px)
- [ ] Style WORKS_AT edges (purple, 1px dashed)
- [ ] Style GENERATES edges (gray, 1px)
- [ ] Style SUBMITS edges (orange, 2px)
- [ ] Edge thickness = relationship strength (claim count)
- [ ] Highlight suspicious edges (red/orange per risk signals)

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/NetworkGraph.jsx` (enhance)  
**Dependencies**: Task 4.2

---

#### Task 4.4: Interactive Controls
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/components/NetworkGraph.jsx`

- [ ] Zoom controls (zoom in, zoom out, reset)
- [ ] Pan controls (drag to pan)
- [ ] Node click → show detail tooltip
- [ ] Edge click → show relationship details
- [ ] Filter controls:
  - [ ] Show/hide entity types
  - [ ] Show/hide edge types
  - [ ] Highlight specific paths
- [ ] Layout algorithm selector:
  - [ ] Force-directed (default)
  - [ ] Hierarchical
  - [ ] Circular
  - [ ] Grid

**Estimated Time**: 5-6 hours  
**Files**: `frontend/src/components/NetworkGraph.jsx` (enhance)  
**Dependencies**: Task 4.3

---

#### Task 4.5: Performance Optimization
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/components/NetworkGraph.jsx`

- [ ] Implement node clustering for large graphs (>500 nodes)
- [ ] Lazy loading for large networks
- [ ] Canvas rendering optimization
- [ ] Debounce zoom/pan events
- [ ] Test with large network (simulate 1000+ nodes)
- [ ] Add loading spinner

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/NetworkGraph.jsx` (enhance)  
**Dependencies**: Task 4.4

---

#### Task 4.6: Integrate Graph into Network Detail
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/pages/NetworkDetail.jsx`

- [ ] Import NetworkGraph component
- [ ] Add to "Network Visualization" tab
- [ ] Pass network_id as prop
- [ ] Add legend explaining node/edge types
- [ ] Add instructions for user interaction
- [ ] Test end-to-end visualization flow

**Estimated Time**: 1-2 hours  
**Files**: `frontend/src/pages/NetworkDetail.jsx` (enhance)  
**Dependencies**: Task 4.5

---

### PHASE 5: Investigation Workflow (Week 3)
**Status**: 🔴 Not Started  
**Priority**: 🟡 MEDIUM - User actions

#### Task 5.1: Investigation Decision Dialog
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/InvestigationDialog.jsx`

- [ ] Modal dialog component
- [ ] Decision selection (radio buttons):
  - [ ] Confirm Risk & Escalate
  - [ ] Dismiss as False Positive
  - [ ] Need More Evidence
- [ ] Confidence level input (dropdown: High, Medium, Low)
- [ ] Notes textarea (optional)
- [ ] Dismissal reason (if dismissing)
- [ ] Submit button
- [ ] Cancel button
- [ ] Style with Design.md modal styles

**Estimated Time**: 4-5 hours  
**Files**: `frontend/src/components/InvestigationDialog.jsx` (NEW)

---

#### Task 5.2: Integrate Decision Actions
**Status**: ⏳ Pending

**ENHANCE**: `frontend/src/pages/NetworkDetail.jsx`

- [ ] Add action buttons to summary card:
  - [ ] "Confirm Risk" button (red)
  - [ ] "Dismiss" button (gray)
  - [ ] "Need Evidence" button (yellow)
- [ ] On button click → open InvestigationDialog
- [ ] On submit → call API `POST /api/investigation/decision`
- [ ] Show success message
- [ ] Navigate back to dashboard
- [ ] Handle API errors

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/pages/NetworkDetail.jsx` (enhance)  
**Dependencies**: Task 5.1, RENGGO's investigation API (future)

---

### PHASE 6: Charts & Additional Visualizations (Week 3)
**Status**: 🔴 Not Started  
**Priority**: 🟢 LOW - Enhancement

#### Task 6.1: Risk Trend Chart
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/RiskTrendChart.jsx`

- [ ] Line chart with Recharts
- [ ] X-axis: Time (past 30 days)
- [ ] Y-axis: Risk detection count
- [ ] Multiple lines (by risk type)
- [ ] Hover tooltips
- [ ] Legend
- [ ] Export as image button

**Estimated Time**: 3-4 hours  
**Files**: `frontend/src/components/RiskTrendChart.jsx` (NEW)

---

#### Task 6.2: Signal Breakdown Chart
**Status**: ⏳ Pending

**CREATE NEW COMPONENT**: `frontend/src/components/SignalBreakdownChart.jsx`

- [ ] Horizontal bar chart with Recharts
- [ ] Shows contribution of each detection method
- [ ] Color-coded bars
- [ ] Percentage labels
- [ ] Used in Risk Explanation Panel

**Estimated Time**: 2-3 hours  
**Files**: `frontend/src/components/SignalBreakdownChart.jsx` (NEW)

---

### INTEGRATION POINTS

**With RENGGO:**
- **Week 1 End**: API contract agreement
  - Need exact JSON structure for:
    - NetworkListResponse
    - NetworkDetailResponse
    - StatsResponse
    - GraphDataResponse
  - Agree on error response format
  - Document API contract

**With PAUNDRA:**
- **Week 3 Start**: Explanation format
  - Need structure for risk explanation JSON
  - Need signal attribution format
  - Need peer comparison data structure

---

### CURRENT STATUS SUMMARY

**Last Updated by MORENO**: 2026-10-02T12:00:17.047Z

**Completed Tasks**: 0/25 ☐  
**In Progress**: 0 ⏳  
**Blocked**: 2 🚧 (Tasks 2.1, 3.1 - waiting for RENGGO's API)  
**Pending**: 23 ⏸️

**Current Blockers**: 
- ⚠️ Task 2.1 (Dashboard API connection) - Blocked until RENGGO finishes Task 2.3
- ⚠️ Task 3.1 (Network Detail API connection) - Blocked until RENGGO finishes Task 2.3
- ⚠️ Task 4.1 (Graph visualization) - Blocked until RENGGO finishes Task 2.5

**Can Work On Now** (not blocked):
- ✅ Task 1.1 - Environment setup (START HERE!)
- ✅ Task 1.2 - Design system implementation
- ✅ Task 1.3 - Apply theme
- ✅ Task 1.4 - Base UI components
- ✅ All components can be built without backend API (use mock data)

**Help Needed**: None

**Notes**:
- Start with environment setup (Task 1.1) and design system (Task 1.2-1.4)
- These can be done completely in parallel while RENGGO works on backend
- Build all UI components with mock data first
- Connect to real API when RENGGO finishes endpoints (Week 2)
- Network visualization (Task 4.1-4.6) is the most complex - allocate more time
- Design.md is your reference - read it thoroughly before starting styling

---

## 🧠 PAUNDRA'S TASK BREAKDOWN

### PHASE 1: Study & Setup (Week 1)
**Status**: 🔴 Not Started  
**Priority**: 🟡 MEDIUM - Can work in parallel

#### Task 1.1: Algorithm Research & Documentation
**Status**: ⏳ Pending

- [ ] Read `docs/JKN_RiskGraph_FSD_Part1.md` (FR-RISK-001 to FR-RISK-030)
- [ ] Read `docs/JKN_RiskGraph_FSD_Part2.md` (AI Integration section)
- [ ] Study Isolation Forest algorithm:
  - [ ] Understand how it detects outliers
  - [ ] Read scikit-learn documentation
  - [ ] Note: Good for high-dimensional feature spaces
- [ ] Study Local Outlier Factor (LOF):
  - [ ] Understand density-based detection
  - [ ] Compare to Isolation Forest
- [ ] Study Louvain algorithm:
  - [ ] Understand community detection
  - [ ] Check NetworkX implementation
- [ ] Study centrality measures:
  - [ ] Degree centrality (simple count)
  - [ ] Betweenness centrality (bridge nodes)
- [ ] Create notes document with your understanding

**Estimated Time**: 4-6 hours (reading & note-taking)  
**Files**: None (research task)  
**Dependencies**: None (can start immediately!)

---

#### Task 1.2: Python Environment Setup
**Status**: ⏳ Pending

- [ ] Navigate to backend: `cd backend`
- [ ] Create virtual environment: `python -m venv venv`
- [ ] Activate: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux)
- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Verify imports work:
  ```python
  import sklearn
  import networkx as nx
  import scipy
  import pandas as pd
  ```
- [ ] Test scikit-learn Isolation Forest:
  ```python
  from sklearn.ensemble import IsolationForest
  # Create simple test
  ```

**Estimated Time**: 30 minutes  
**Files**: None (environment setup)  
**Dependencies**: None

---

### PHASE 2: Statistical Anomaly Detection (Week 2)
**Status**: 🔴 Not Started  
**Priority**: 🔥 HIGH - Core detection capability

#### Task 2.1: Peer Group Definition Logic
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/statistical/peer_groups.py`

- [ ] Create `PeerGroupManager` class:
  - [ ] Method: `define_peer_groups(providers: List) -> Dict`
  - [ ] Grouping criteria:
    - [ ] facility_type (RS Tipe A/B/C/D, Klinik, FKTP)
    - [ ] region_code (province level)
    - [ ] service_mix (cluster by services_offered similarity)
    - [ ] patient_volume tier (small/medium/large)
  - [ ] Use k-means clustering for service_mix similarity
  - [ ] Return mapping: provider_id → peer_group_id
- [ ] Method: `get_peer_statistics(peer_group_id, metric) -> Dict`
  - [ ] Calculate median, mean, std dev, IQR for metric
  - [ ] Return peer group stats
- [ ] Test with synthetic data
- [ ] Document peer group assignments

**Estimated Time**: 5-6 hours  
**Files**: `backend/src/detection/statistical/peer_groups.py` (NEW)  
**Dependencies**: Task 1.2, RENGGO's Task 1.5 (data must be loaded)

---

#### Task 2.2: Feature Engineering Helper
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/statistical/features.py`

- [ ] Create `FeatureExtractor` class:
  - [ ] Method: `extract_provider_features(provider_id) -> Dict`
    - [ ] claim_rate (claims per month)
    - [ ] average_claim_amount
    - [ ] procedure_distribution (% of each procedure code)
    - [ ] diagnosis_distribution (% of each diagnosis code)
    - [ ] patient_turnover_rate
    - [ ] average_los
    - [ ] referral_in_count, referral_out_count
  - [ ] Method: `extract_doctor_features(doctor_id) -> Dict`
    - [ ] patient_count
    - [ ] referral_rate (% patients referred)
    - [ ] referral_concentration (% to top provider)
    - [ ] claim_amount_per_patient
    - [ ] specialty_mismatch_rate
  - [ ] Method: `create_feature_vector(entity_id, entity_type) -> np.array`
    - [ ] Convert features to numerical array for ML
- [ ] Test feature extraction

**Estimated Time**: 6-8 hours  
**Files**: `backend/src/detection/statistical/features.py` (NEW)  
**Dependencies**: Task 2.1

---

#### Task 2.3: Isolation Forest Implementation
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/statistical/isolation_forest.py`

- [ ] Create `IsolationForestDetector` class:
  - [ ] Method: `train_models(peer_groups) -> Dict[str, IsolationForest]`
    - [ ] For each peer group:
      - [ ] Extract feature vectors for all entities in group
      - [ ] Train Isolation Forest model (contamination=0.05)
      - [ ] Save model per peer group
    - [ ] Return trained models
  - [ ] Method: `detect_anomalies(entity_id, peer_group_id) -> RiskSignal`
    - [ ] Load appropriate model
    - [ ] Extract entity features
    - [ ] Compute anomaly score
    - [ ] If score > threshold (e.g., 0.7):
      - [ ] Generate MULTIVARIATE_ANOMALY signal
      - [ ] Include: entity_id, score, feature_importances
    - [ ] Return signal or None
- [ ] Test with synthetic data (should detect injected fraud patterns)
- [ ] Tune contamination parameter

**Estimated Time**: 6-8 hours  
**Files**: `backend/src/detection/statistical/isolation_forest.py` (NEW)  
**Dependencies**: Task 2.2

---

#### Task 2.4: Local Outlier Factor Implementation
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/statistical/lof.py`

- [ ] Create `LOFDetector` class:
  - [ ] Method: `compute_lof_scores(peer_group) -> Dict[str, float]`
    - [ ] Extract feature vectors for peer group
    - [ ] Apply LocalOutlierFactor (n_neighbors=20)
    - [ ] Compute LOF score for each entity
    - [ ] Return entity_id → lof_score mapping
  - [ ] Method: `detect_outliers(threshold=-1.5) -> List[RiskSignal]`
    - [ ] Flag entities with LOF score < threshold
    - [ ] Generate LOCAL_OUTLIER signals
    - [ ] Include: entity_id, lof_score, peer_group_id
    - [ ] Return list of signals
- [ ] Test with synthetic data
- [ ] Compare results with Isolation Forest (should complement each other)

**Estimated Time**: 5-6 hours  
**Files**: `backend/src/detection/statistical/lof.py` (NEW)  
**Dependencies**: Task 2.2

---

#### Task 2.5: Z-Score Outlier Detection
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/statistical/zscore.py`

- [ ] Create `ZScoreDetector` class:
  - [ ] Method: `detect_univariate_outliers(metric_name, threshold=2.0) -> List[RiskSignal]`
    - [ ] For each peer group:
      - [ ] Get metric values for all entities
      - [ ] Calculate mean and std dev
      - [ ] Compute z-scores
      - [ ] Flag entities with |z-score| > threshold
    - [ ] Generate STATISTICAL_OUTLIER signals
    - [ ] Include: entity_id, metric_name, value, peer_mean, z_score
    - [ ] Return list of signals
  - [ ] Method: `detect_all_metrics() -> List[RiskSignal]`
    - [ ] Run detection for all key metrics:
      - [ ] claim_rate
      - [ ] average_claim_amount
      - [ ] average_los
      - [ ] referral_concentration
    - [ ] Return aggregated signals
- [ ] Test with synthetic data

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/statistical/zscore.py` (NEW)  
**Dependencies**: Task 2.2

---

### PHASE 3: Graph Analytics (Week 2-3)
**Status**: 🔴 Not Started  
**Priority**: 🔥 HIGH - Network analysis

#### Task 3.1: Graph Data Loader
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/graph_analytics/graph_loader.py`

- [ ] Create `GraphLoader` class:
  - [ ] Method: `load_graph_from_age() -> nx.Graph`
    - [ ] Query AGE graph via backend/src/database.py
    - [ ] Load all nodes and edges
    - [ ] Convert to NetworkX Graph object
    - [ ] Add node attributes (entity_type, properties)
    - [ ] Add edge attributes (relationship_type, weights)
    - [ ] Return NetworkX graph
  - [ ] Method: `get_subgraph(entity_ids) -> nx.Graph`
    - [ ] Extract subgraph for specific entities
    - [ ] Used for analyzing suspicious networks
- [ ] Test graph loading
- [ ] Check graph statistics (node count, edge count, density)

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/graph_analytics/graph_loader.py` (NEW)  
**Dependencies**: Task 1.2, RENGGO's Task 1.5 (graph must be built)  
**Blocks**: ⚠️ Blocked until RENGGO finishes graph construction

---

#### Task 3.2: Centrality Measures
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/graph_analytics/centrality.py`

- [ ] Create `CentralityAnalyzer` class:
  - [ ] Method: `compute_degree_centrality(graph) -> Dict`
    - [ ] Calculate degree for each node
    - [ ] Normalize by max possible degree
    - [ ] Return node_id → centrality_score
  - [ ] Method: `compute_betweenness_centrality(graph) -> Dict`
    - [ ] Use NetworkX betweenness_centrality()
    - [ ] May be slow for large graphs - consider sampling
    - [ ] Return node_id → betweenness_score
  - [ ] Method: `detect_high_centrality_nodes(threshold_percentile=95) -> List[RiskSignal]`
    - [ ] Flag nodes in top 5% centrality
    - [ ] Generate HIGH_DEGREE_CENTRALITY or HIGH_BETWEENNESS_CENTRALITY signals
    - [ ] Include: node_id, centrality_score, percentile
    - [ ] Compare to peer group centrality
    - [ ] Return signals
- [ ] Test with synthetic graph
- [ ] Analyze which providers/doctors have abnormal centrality

**Estimated Time**: 5-6 hours  
**Files**: `backend/src/detection/graph_analytics/centrality.py` (NEW)  
**Dependencies**: Task 3.1

---

#### Task 3.3: Community Detection
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/graph_analytics/community.py`

- [ ] Create `CommunityDetector` class:
  - [ ] Method: `detect_communities(graph) -> Dict`
    - [ ] Apply Louvain algorithm: `nx.community.louvain_communities()`
    - [ ] Return node_id → community_id mapping
  - [ ] Method: `analyze_community_characteristics(community_id) -> Dict`
    - [ ] Member count
    - [ ] Internal edge density
    - [ ] Claim volume within community
    - [ ] Diagnosis/procedure concentration
    - [ ] Average claim amount
  - [ ] Method: `detect_anomalous_communities() -> List[RiskSignal]`
    - [ ] Flag communities with:
      - [ ] Unusually high internal claim density
      - [ ] High concentration of specific procedure codes
      - [ ] High average claim amounts
    - [ ] Generate ANOMALOUS_COMMUNITY signals
    - [ ] Include: community_id, member_ids, anomaly_reasons
    - [ ] Return signals
- [ ] Test community detection
- [ ] Visualize communities (optional, for debugging)

**Estimated Time**: 6-8 hours  
**Files**: `backend/src/detection/graph_analytics/community.py` (NEW)  
**Dependencies**: Task 3.1

---

#### Task 3.4: Motif Detection
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/graph_analytics/motifs.py`

- [ ] Create `MotifDetector` class:
  - [ ] Method: `detect_referral_triangles() -> List[RiskSignal]`
    - [ ] Find pattern: Doctor → Provider A → Provider B (referral chain)
    - [ ] Flag suspicious triangles (circular referrals)
    - [ ] Generate SUSPICIOUS_MOTIF signals
  - [ ] Method: `detect_cloning_stars() -> List[RiskSignal]`
    - [ ] Find pattern: One participant → multiple identical claims
    - [ ] Flag star patterns with high claim similarity
    - [ ] Generate SUSPICIOUS_MOTIF signals
  - [ ] Method: `detect_provider_clusters() -> List[RiskSignal]`
    - [ ] Find: Multiple providers with overlapping patient sets + similar claim patterns
    - [ ] Flag potential collusion
    - [ ] Generate SUSPICIOUS_MOTIF signals
- [ ] Test motif detection on synthetic data
- [ ] Should detect some of the injected fraud patterns

**Estimated Time**: 6-8 hours  
**Files**: `backend/src/detection/graph_analytics/motifs.py` (NEW)  
**Dependencies**: Task 3.1

---

### PHASE 4: Risk Fusion & Aggregation (Week 3)
**Status**: 🔴 Not Started  
**Priority**: 🔥 CRITICAL - Integrates everything!

#### Task 4.1: Signal Collection & Normalization
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/detection/risk_fusion.py`

- [ ] Create `RiskFusionEngine` class:
  - [ ] Method: `collect_signals(entity_id) -> List[RiskSignal]`
    - [ ] Query all RiskSignal records for entity from database
    - [ ] Collect from:
      - [ ] Rule engine outputs (RENGGO's detection rules)
      - [ ] Statistical signals (your Tasks 2.3-2.5)
      - [ ] Graph analytics signals (your Tasks 3.2-3.4)
      - [ ] (Future) ML model predictions
    - [ ] Return aggregated list
  - [ ] Method: `normalize_signal(signal: RiskSignal) -> float`
    - [ ] Convert different signal formats to 0-100 scale:
      - [ ] Binary flags (rule matches) → configured weight (e.g., 75)
      - [ ] Z-scores → linear mapping (3σ = 75, 5σ = 95)
      - [ ] ML probabilities → direct mapping (0.85 → 85)
      - [ ] Percentiles → direct mapping (95th percentile → 75)
    - [ ] Return normalized score 0-100

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/risk_fusion.py` (NEW)  
**Dependencies**: Tasks 2.3-2.5, 3.2-3.4, RENGGO's Task 3.7

---

#### Task 4.2: Weighted Aggregation Algorithm
**Status**: ⏳ Pending

**ENHANCE FILE**: `backend/src/detection/risk_fusion.py`

- [ ] Add to `RiskFusionEngine`:
  - [ ] Method: `compute_entity_risk_score(entity_id) -> float`
    - [ ] Collect all signals for entity
    - [ ] Normalize each signal
    - [ ] Apply weights:
      - [ ] Rule signals: weight = 0.25
      - [ ] Statistical signals: weight = 0.30
      - [ ] Graph signals: weight = 0.20
      - [ ] ML predictions: weight = 0.25
    - [ ] Formula: `score = Σ(signal_score × weight × confidence) / Σ(weight × confidence)`
    - [ ] Return composite score (0-100)
  - [ ] Method: `categorize_risk(score) -> str`
    - [ ] 0-29: LOW
    - [ ] 30-59: MEDIUM
    - [ ] 60-79: HIGH
    - [ ] 80-100: CRITICAL
    - [ ] Return category

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/risk_fusion.py` (enhance)  
**Dependencies**: Task 4.1

---

#### Task 4.3: Network-Level Aggregation
**Status**: ⏳ Pending

**ENHANCE FILE**: `backend/src/detection/risk_fusion.py`

- [ ] Add to `RiskFusionEngine`:
  - [ ] Method: `compute_network_risk_score(entity_ids: List) -> float`
    - [ ] Compute risk score for each entity in network
    - [ ] Calculate max entity score (ceiling)
    - [ ] Calculate average entity score (typical behavior)
    - [ ] Apply network multipliers:
      - [ ] Size multiplier (larger networks = higher risk)
      - [ ] Density multiplier (more connections = coordination?)
      - [ ] Temporal sync multiplier (activity spikes together?)
    - [ ] Formula: `network_score = max(entity_scores) × network_multiplier + avg(entity_scores) × (1 - network_multiplier)`
    - [ ] Return network risk score (0-100)
  - [ ] Method: `identify_networks() -> List[List[entity_id]]`
    - [ ] Use connected components from graph
    - [ ] Filter networks with risk signals
    - [ ] Return list of suspicious networks

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/detection/risk_fusion.py` (enhance)  
**Dependencies**: Task 4.2, Task 3.1 (graph data)

---

#### Task 4.4: Priority Queue Generation
**Status**: ⏳ Pending

**ENHANCE FILE**: `backend/src/detection/risk_fusion.py`

- [ ] Add to `RiskFusionEngine`:
  - [ ] Method: `generate_priority_queue(limit=500) -> List[RiskNetwork]`
    - [ ] Identify all suspicious networks
    - [ ] Compute risk score for each
    - [ ] Calculate financial impact (total claim amount)
    - [ ] Calculate novelty factor (new pattern vs known)
    - [ ] Priority formula: `priority = risk_score × financial_impact × novelty × (1 - historical_fp_rate)`
    - [ ] Sort by priority (highest first)
    - [ ] Take top N (default 500)
    - [ ] Return prioritized list
  - [ ] Method: `save_risk_networks_to_db(networks: List)`
    - [ ] Insert/update records in risk_networks table
    - [ ] Set investigation_status = 'queued'
    - [ ] Store all metadata (signals, explanations, etc)

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/detection/risk_fusion.py` (enhance)  
**Dependencies**: Task 4.3

---

#### Task 4.5: Risk Fusion Pipeline Script
**Status**: ⏳ Pending

**CREATE NEW FILE**: `scripts/run_risk_fusion.py`

- [ ] Import RiskFusionEngine
- [ ] Load all signals from database
- [ ] Run fusion algorithm
- [ ] Generate priority queue
- [ ] Save to database
- [ ] Log statistics:
  - [ ] Total networks detected
  - [ ] Breakdown by risk category
  - [ ] Total financial impact
- [ ] Test end-to-end pipeline

**Estimated Time**: 2-3 hours  
**Files**: `scripts/run_risk_fusion.py` (NEW)  
**Dependencies**: Task 4.4

---

### PHASE 5: Explainability Engine (Week 3-4)
**Status**: 🔴 Not Started  
**Priority**: 🟡 MEDIUM - Makes AI transparent

#### Task 5.1: Signal Attribution
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/explainability/attribution.py`

- [ ] Create `SignalAttributor` class:
  - [ ] Method: `compute_signal_contributions(network_id) -> Dict`
    - [ ] Get all signals for network
    - [ ] Calculate each signal's contribution to final score
    - [ ] Formula: `contribution = (signal_score × weight × confidence) / total_score`
    - [ ] Group by detection method (rule/statistical/graph/ml)
    - [ ] Return breakdown: {method: percentage_contribution}
  - [ ] Method: `rank_contributing_factors(network_id, top_n=5) -> List`
    - [ ] Get all signals
    - [ ] Sort by contribution to score
    - [ ] Return top N signals with descriptions
- [ ] Test with sample network

**Estimated Time**: 4-5 hours  
**Files**: `backend/src/explainability/attribution.py` (NEW)  
**Dependencies**: Task 4.5 (risk networks must exist)

---

#### Task 5.2: Template-Based NLG (Indonesian)
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/explainability/nlg_templates.py`

- [ ] Create Indonesian language explanation templates:
  - [ ] Template for referral concentration:
    - `"Dr. {doctor_name} merujuk {percentage}% pasien ke {provider_name}, dibandingkan rata-rata peer {peer_avg}% (deviasi {sigma}σ)"`
  - [ ] Template for cloning:
    - `"{count} klaim menunjukkan similarity {similarity_pct}% dalam diagnosis, prosedur, dan biaya di {provider_name} dalam periode {days} hari"`
  - [ ] Template for prolonged LOS:
    - `"Rata-rata lama rawat untuk diagnosis {diagnosis} adalah {avg_los} hari, dibandingkan peer group {peer_avg} hari (deviasi {sigma}σ)"`
  - [ ] Template for high centrality:
    - `"{entity_name} memiliki koneksi abnormal tinggi ({degree} connections), berada di percentile ke-{percentile}"`
  - [ ] Template for anomalous community:
    - `"Terdeteksi komunitas {size} entitas dengan density internal {density} dan konsentrasi prosedur {procedure_code} sebesar {percentage}%"`
- [ ] Create `NLGGenerator` class:
  - [ ] Method: `generate_explanation(network_id) -> str`
    - [ ] Get top 3-5 contributing signals
    - [ ] For each signal, populate appropriate template
    - [ ] Combine into coherent narrative (2-3 paragraphs)
    - [ ] Return Indonesian text explanation
- [ ] Test with sample networks

**Estimated Time**: 5-6 hours  
**Files**: `backend/src/explainability/nlg_templates.py` (NEW)  
**Dependencies**: Task 5.1

---

#### Task 5.3: Peer Comparison Formatter
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/explainability/peer_comparison.py`

- [ ] Create `PeerComparisonFormatter` class:
  - [ ] Method: `format_peer_comparison(entity_id, metric) -> Dict`
    - [ ] Get entity value for metric
    - [ ] Get peer group statistics (median, mean, std dev, quartiles)
    - [ ] Calculate percentile ranking
    - [ ] Calculate z-score
    - [ ] Calculate deviation from peer median
    - [ ] Return formatted data:
      ```python
      {
        "metric_name": "average_claim_amount",
        "entity_value": 7200000,
        "peer_median": 4800000,
        "peer_mean": 5100000,
        "peer_std": 1200000,
        "percentile": 92,
        "z_score": 3.2,
        "deviation": "3.2σ above",
        "is_significant": True
      }
      ```
  - [ ] Method: `format_all_comparisons(entity_id) -> List[Dict]`
    - [ ] Format comparisons for all relevant metrics
    - [ ] Return list for frontend display
- [ ] Test formatting

**Estimated Time**: 3-4 hours  
**Files**: `backend/src/explainability/peer_comparison.py` (NEW)  
**Dependencies**: Task 2.1 (peer groups)

---

#### Task 5.4: Explainability API Integration
**Status**: ⏳ Pending

**CREATE NEW FILE**: `backend/src/api/explainability.py`

- [ ] Implement API endpoint: `GET /api/networks/{id}/explanation`
  - [ ] Get network detail from database
  - [ ] Generate signal attribution (Task 5.1)
  - [ ] Generate NLG explanation (Task 5.2)
  - [ ] Generate peer comparisons (Task 5.3)
  - [ ] Return combined explanation JSON:
    ```python
    {
      "network_id": "...",
      "explanation_text": "...",  # Indonesian
      "signal_breakdown": {...},
      "top_factors": [...],
      "peer_comparisons": [...]
    }
    ```
- [ ] Add router to main.py
- [ ] Test endpoint
- [ ] Document response format for MORENO

**Estimated Time**: 2-3 hours  
**Files**: `backend/src/api/explainability.py` (NEW)  
**Dependencies**: Tasks 5.1, 5.2, 5.3

---

### INTEGRATION POINTS

**With RENGGO:**
- **Week 2 Day 2**: RiskSignal format agreement
  - Need to agree on exact RiskSignal dataclass/model
  - How to store signals in database
  - How to query signals by entity_id
  - Document the contract

**With MORENO:**
- **Week 3 Start**: Explanation format agreement
  - Need to agree on exact JSON structure for explanation API
  - What fields frontend needs
  - How to display signal breakdown
  - How to render peer comparison charts

---

### CURRENT STATUS SUMMARY

**Last Updated by PAUNDRA**: 2026-10-02T12:00:17.047Z

**Completed Tasks**: 0/28 ☐  
**In Progress**: 0 ⏳  
**Blocked**: 1 🚧 (Task 3.1 - waiting for RENGGO's graph)  
**Pending**: 27 ⏸️

**Current Blockers**:
- ⚠️ Task 3.1 (Graph loading) - Blocked until RENGGO finishes Task 1.5 (graph construction)
- Graph analytics tasks (3.2-3.4) depend on 3.1

**Can Work On Now** (not blocked):
- ✅ Task 1.1 - Algorithm research (START HERE!)
- ✅ Task 1.2 - Environment setup
- ✅ Task 2.1 - Peer group logic (can work with database after RENGGO loads data)
- ✅ Tasks 2.2-2.5 - Statistical detection (after RENGGO loads data)
- All statistical detection can be done before graph is ready

**Help Needed**: None

**Notes**:
- Start with algorithm research (Task 1.1) and environment setup (Task 1.2)
- Peer group logic and feature engineering (Tasks 2.1-2.2) are foundational - prioritize these
- Statistical detection (Tasks 2.3-2.5) can be done in parallel once features ready
- Graph analytics (Tasks 3.1-3.4) blocked until RENGGO finishes graph construction
- Risk fusion (Phase 4) is critical - integrates everything from you and RENGGO
- Explainability (Phase 5) makes the AI transparent for investigators
- Your work is the "intelligence" layer - take time to understand algorithms deeply
- Test each detector independently before integration

---

## 🚧 CURRENT BLOCKERS SUMMARY

### 🔴 Critical Path Items (Block Others):
1. **RENGGO Task 1.1**: PostgreSQL + AGE setup → Blocks everyone
2. **RENGGO Task 1.3-1.5**: Data generation & loading → Blocks everyone
3. **RENGGO Task 2.3**: API endpoints → Blocks MORENO's dashboard connection

### 🟡 Can Work In Parallel (Not Blocked):
- **MORENO Tasks 1.1-1.4**: Frontend setup & design system
- **PAUNDRA Tasks 1.1-1.2**: Algorithm study & environment
- **PAUNDRA Tasks 2.1-2.5**: Statistical detection (after data loaded)

### 🔵 Integration Dependencies:
- **PAUNDRA Task 3.1**: Needs RENGGO Task 1.5 (graph construction)
- **MORENO Task 2.1**: Needs RENGGO Task 2.3 (API endpoints)
- **MORENO Task 4.1**: Needs RENGGO Task 2.5 (graph API)
- **PAUNDRA Task 4.1**: Needs RENGGO Task 3.7 (rule outputs)

---

## 📞 INTEGRATION CHECKPOINTS

### Checkpoint 1: API Contract (Week 1, Friday Oct 4)
**Attendees**: Renggo + Moreno  
**Agenda**:
- Review API endpoint URLs
- Agree on request/response JSON format
- Document error response format
- Define pagination format
- Test with sample JSON

**Deliverable**: `API_CONTRACT.md` document

---

### Checkpoint 2: RiskSignal Format (Week 2, Tuesday Oct 8)
**Attendees**: Renggo + Paundra  
**Agenda**:
- Review RiskSignal dataclass design
- Agree on how to store in database
- Define how to query by entity_id
- Test signal aggregation

**Deliverable**: Updated `backend/src/detection/rules/base.py` with agreed format

---

### Checkpoint 3: Explanation Format (Week 3, Monday Oct 14)
**Attendees**: Paundra + Moreno  
**Agenda**:
- Review explanation JSON structure
- Agree on signal breakdown format
- Define peer comparison data format
- Test frontend rendering

**Deliverable**: `backend/src/api/explainability.py` with documented response format

---

### Checkpoint 4: Integration Testing (Week 4, Monday Oct 21)
**Attendees**: All (Renggo, Moreno, Paundra)  
**Agenda**:
- End-to-end testing session
- Backend → Frontend flow
- Detection → Visualization flow
- Identify bugs and issues
- Create fix task list

**Deliverable**: Bug list + Priority fixes

---

## 🎯 SUCCESS CRITERIA

### Week 1 Target (Oct 2-8):
- [ ] **RENGGO**: Database setup complete, data loaded, graph built, API skeleton working
- [ ] **MORENO**: Design system implemented, base components ready, Dashboard structure done
- [ ] **PAUNDRA**: Algorithms understood, environment ready, peer groups defined

### Week 2-3 Target (Oct 9-22):
- [ ] **RENGGO**: All API endpoints functional, 5 detection rules working
- [ ] **MORENO**: Dashboard + Network Detail connected to API, network visualization rendering
- [ ] **PAUNDRA**: All statistical detectors working, graph analytics complete, risk fusion operational

### Week 4+ Target (Oct 23+):
- [ ] **ALL**: Full system integration, all features working end-to-end
- [ ] **ALL**: Bug fixes complete, performance optimized
- [ ] **ALL**: Demo ready, documentation complete

---

## 📊 PROGRESS TRACKING

### How to Update This File:

**Every time you commit code, update your section:**

1. Mark completed tasks: `- [x] Task description`
2. Update your timestamp: `Last Updated by [NAME]: [ISO timestamp]`
3. Update completed task count
4. Add notes if needed
5. Commit PROGRESS.md with your code changes

**Example Update:**

```markdown
**Last Updated by RENGGO**: 2026-10-03T09:23:15.000Z

**Completed Tasks**: 5/30 ☐  
**In Progress**: 1 ⏳ (Task 2.3 - API endpoints)  
**Blocked**: 0 🚧  
**Pending**: 24 ⏸️

**Current Blockers**: None

**Help Needed**: None

**Notes**: 
- Completed database setup and data loading
- Graph construction finished successfully
- Started working on API endpoints
- Network API partially done, need to finish claims endpoint tomorrow
```

---

## ⚠️ FINAL REMINDER TO ALL AI AGENTS

**🚨 YOU MUST UPDATE PROGRESS.MD BEFORE EVERY COMMIT 🚨**

This is not optional. This is how the team coordinates work.

**If you commit code without updating PROGRESS.md, your AI Agent is not following protocol.**

**Steps to follow:**
1. Do your coding work
2. Test your code
3. Open PROGRESS.md
4. Find YOUR section (RENGGO / MORENO / PAUNDRA)
5. Mark completed tasks with ✅
6. Update your timestamp
7. Add notes
8. Save PROGRESS.md
9. Stage both your code AND PROGRESS.md
10. Commit with descriptive message
11. Push

**This keeps everyone in sync and prevents duplicate work.**

---

**End of PROGRESS.md**

**Last Global Update**: 2026-10-02T12:00:17.047Z  
**File Version**: 2.0  
**Total Tasks Defined**: 83 tasks across 3 team members  
**Current Overall Progress**: 15%

---

## 📌 QUICK REFERENCE

### File Ownership Map:
- **RENGGO**: `backend/src/api/`, `backend/src/data/`, `backend/src/detection/rules/`, `scripts/`, `database/`
- **MORENO**: `frontend/src/` (all subdirectories)
- **PAUNDRA**: `backend/src/detection/statistical/`, `backend/src/detection/graph_analytics/`, `backend/src/explainability/`

### Critical Path:
RENGGO Task 1.1 → 1.2 → 1.3 → 1.4 → 1.5 (Database & Data) → Unblocks everyone else

### Current Priorities:
1. **RENGGO**: Start Task 1.1 immediately (database setup)
2. **MORENO**: Start Task 1.1-1.4 (design system) - can work in parallel
3. **PAUNDRA**: Start Task 1.1-1.2 (study & setup) - can work in parallel

### Integration Schedule:
- Week 1 Fri: API contract (Renggo + Moreno)
- Week 2 Tue: RiskSignal format (Renggo + Paundra)
- Week 3 Mon: Explanation format (Paundra + Moreno)
- Week 4 Mon: Full integration test (All)

---

**🚀 Let's build JAGA! Good luck team!**
