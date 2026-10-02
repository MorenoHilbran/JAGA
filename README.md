# JAGA - Jaringan Analitik Guard Anti-fraud

**Graph Analytics-Based Healthcare Fraud Detection Platform for JKN (Jaminan Kesehatan Nasional)**

---

## 🎯 Overview

JAGA is an intelligent risk detection platform that uses graph analytics and AI to identify fraud, waste, and abuse in Indonesia's national healthcare program (JKN). Unlike traditional transaction-based systems, JAGA analyzes relationships and networks among healthcare providers, doctors, patients, and claims to detect sophisticated fraud schemes.

### Key Features

- **Network-Level Detection**: Identifies suspicious clusters and coordinated fraud schemes
- **Multi-Layered AI**: Combines rule engines, statistical anomaly detection, graph analytics, and machine learning
- **Explainable Risk Scores**: Transparent AI that explains why networks are flagged
- **Human-in-the-Loop**: Assists investigators without automating fraud determination
- **Interactive Visualization**: Cytoscape.js-powered network visualization

---

## 🏗️ Project Structure

```
JAGA/
├── backend/                  # Python FastAPI backend
│   ├── src/
│   │   ├── api/             # REST API endpoints
│   │   ├── data/            # Data ingestion & ETL
│   │   ├── graph/           # Graph construction & queries
│   │   ├── detection/       # Risk detection engine
│   │   │   ├── rules/       # Rule-based detection
│   │   │   ├── statistical/ # Anomaly detection
│   │   │   ├── graph_analytics/ # Graph algorithms
│   │   │   └── ml/          # Machine learning models
│   │   ├── explainability/  # Risk explanation engine
│   │   └── utils/           # Utilities
│   └── tests/               # Unit & integration tests
│
├── frontend/                 # React + Vite frontend
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       └── services/        # API clients
│
├── database/                 # Database setup
│   ├── schema/              # SQL schemas
│   ├── migrations/          # Migrations
│   └── seeds/               # Synthetic data
│
├── scripts/                  # Utility scripts
└── docs/                     # Documentation
```

---

## 🚀 Tech Stack

### Backend
- **Python 3.11+** - Core language
- **FastAPI** - Modern async web framework
- **PostgreSQL 16+** - Relational database
- **Apache AGE** - Graph database extension for PostgreSQL
- **NetworkX** - Graph algorithms library
- **Scikit-learn** - Machine learning
- **LightGBM** - Gradient boosting (future)

### Frontend
- **React 18+** - UI library
- **Vite** - Build tool
- **Material-UI (MUI)** - Component library
- **Cytoscape.js** - Network visualization
- **Recharts** - Data visualization
- **React Router** - Routing
- **Axios** - HTTP client

### Database
- **PostgreSQL 16+** - Primary database
- **Apache AGE** - Graph extension (openCypher queries)

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 16+** ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

---

## 🛠️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/MorenoHilbran/JAGA.git
cd JAGA
```

### 2. Database Setup

#### Install PostgreSQL
Ensure PostgreSQL 16+ is installed and running.

#### Install Apache AGE Extension

**On Linux/WSL:**
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y postgresql-server-dev-16 build-essential

# Clone and build Apache AGE
git clone https://github.com/apache/age.git
cd age
make install
```

**On Windows:**
- Apache AGE has limited Windows support
- Recommended: Use WSL2 (Windows Subsystem for Linux) or Docker
- See: https://age.apache.org/age-manual/master/intro/setup.html

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE jkn_riskgraph;
\c jkn_riskgraph

# Install AGE extension
CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

# Verify installation
SELECT * FROM ag_catalog.ag_graph;
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL=postgresql://postgres:password@localhost:5432/jkn_riskgraph

# Run database migrations
python scripts/run_migrations.py

# Start backend server
uvicorn src.main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with backend API URL
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

### 5. Generate Synthetic Data

```bash
cd scripts

# Generate synthetic JKN data
python generate_synthetic_data.py --participants 10000 --providers 100 --doctors 500 --claims 100000

# Load data into database
python load_synthetic_data.py

# Build graph
python build_graph.py
```

### 6. Run Detection Pipeline

```bash
# Compute features
python run_feature_engineering.py

# Run risk detection
python run_risk_detection.py

# View results in frontend
# Navigate to http://localhost:5173
```

---

## 🎮 Usage

### For Investigators

1. **Login** to the Investigation Dashboard
2. **Review Priority Queue** - See top 20 high-risk networks
3. **Click Network** to view details
4. **Explore Visualization** - Interactive graph showing relationships
5. **Review Risk Explanation** - AI explains why network is suspicious
6. **Examine Claims** - Drill into individual claim details
7. **Make Decision** - Confirm risk, dismiss, or need more evidence

### For Developers

#### Run Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

#### Run Linters
```bash
# Backend
cd backend
flake8 src/
black src/

# Frontend
cd frontend
npm run lint
```

#### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 🧪 Development

### Adding a New Detection Rule

1. Create rule file in `backend/src/detection/rules/`
2. Implement rule logic with signature:
```python
def detect_rule_name(graph_db, config) -> List[RiskSignal]:
    # Rule logic here
    return signals
```
3. Register rule in `backend/src/detection/rules/__init__.py`
4. Add rule configuration in `config.yaml`
5. Add tests in `backend/tests/detection/rules/`

### Adding a New API Endpoint

1. Create route in `backend/src/api/`
2. Define Pydantic models for request/response
3. Implement business logic
4. Add endpoint to router
5. Test with pytest
6. Document in OpenAPI (auto-generated)

### Adding a New Frontend Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Create API service in `frontend/src/services/`
4. Connect component to API
5. Style with Material-UI components

---

## 📊 Project Status

See [PROGRESS.md](./PROGRESS.md) for detailed progress tracking.

**Current Phase**: Phase 1 - Project Setup  
**Overall Progress**: 5%  
**Estimated Completion**: 4-6 weeks (with 3 developers)

---

## 👥 Team

- **Renggo** - Backend, Database, DevOps
- **Moreno** - Backend, Detection Engine
- **Paundra** - Frontend, Visualization

---

## 📚 Documentation

- [User Requirements Specification (URS)](./docs/JKN_RiskGraph_URS.md)
- [Functional Specification Document (FSD) Part 1](./docs/JKN_RiskGraph_FSD_Part1.md)
- [Functional Specification Document (FSD) Part 2](./docs/JKN_RiskGraph_FSD_Part2.md)
- [Project Concept](./docs/HEALTHKATHON%202026%20-%20JAGA_%20Jaringan%20Analitik%20Guard%20Anti-fraud.md)

---

## 🔒 Security & Privacy

JAGA handles sensitive healthcare data. Key privacy measures:

- **PII Protection**: Patient names hashed, DOB stored as age bands
- **Encryption**: TLS for data in transit, AES-256 for data at rest
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: All user actions logged
- **UU PDP Compliance**: Follows Indonesian data protection regulations

---

## 🐛 Troubleshooting

### Apache AGE Installation Issues
- **Windows**: Use WSL2 or Docker
- **Linux**: Ensure `postgresql-server-dev` is installed
- **Version mismatch**: AGE version must match PostgreSQL version

### Database Connection Issues
```bash
# Test PostgreSQL connection
psql -U postgres -h localhost -d jkn_riskgraph

# Check PostgreSQL is running
sudo systemctl status postgresql

# Check PostgreSQL logs
tail -f /var/log/postgresql/postgresql-16-main.log
```

### Backend Port Already in Use
```bash
# Change port in uvicorn command
uvicorn src.main:app --reload --port 8001
```

### Frontend Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is developed for Healthkathon 2026 - BPJS Kesehatan.

---

## 🙏 Acknowledgments

- BPJS Kesehatan for providing the challenge
- Healthkathon 2026 organizers
- Apache AGE community
- Open source libraries and contributors

---

## 📞 Contact

For questions or support, contact the development team:
- GitHub: [MorenoHilbran/JAGA](https://github.com/MorenoHilbran/JAGA)

---

**Built with ❤️ for Indonesian Healthcare**
