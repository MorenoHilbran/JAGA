# JAGA Docker PostgreSQL 18 + Apache AGE Setup Guide

**Project:** JAGA - Jaringan Analitik Guard Anti-fraud  
**Date:** 2026-10-02  
**Time:** 13:09 UTC  
**Setup Type:** Docker-based PostgreSQL 18 + Apache AGE  
**Status:** ✅ COMPLETE AND WORKING

---

## 🎯 What We Accomplished

We successfully set up Apache AGE (graph database extension) for the JAGA fraud detection platform using Docker after attempting Ubuntu compilation which failed due to Windows/Linux binary compatibility issues.

**Final Solution:** Docker container with PostgreSQL 18.6 + Apache AGE pre-installed

---

## 📋 Setup Journey

### ❌ **Attempt 1: Ubuntu WSL2 Compilation (Failed)**

**What we tried:**
1. Installed Ubuntu 26.04 in WSL2
2. Installed PostgreSQL 18 dev files
3. Compiled Apache AGE from source
4. Copied compiled files to Laragon PostgreSQL

**Why it failed:**
- Compiled `.so` library was Linux 64-bit format
- Windows PostgreSQL needs native Windows `.dll` format
- Renaming `.so` to `.dll` doesn't work (different binary formats)
- Error: `%1 is not a valid Win32 application`

**Time spent:** ~2 hours  
**Outcome:** Not viable for Windows PostgreSQL

---

### ✅ **Attempt 2: Docker Container (SUCCESS)**

**What we did:**
1. Started Docker Desktop (already installed)
2. Pulled official Apache AGE Docker image
3. Ran PostgreSQL 18 + AGE container
4. Tested AGE extension
5. Configured backend to use Docker PostgreSQL

**Time spent:** ~15 minutes  
**Outcome:** Working perfectly!

---

## 🐳 Docker Setup Details

### Container Configuration

```bash
docker run -d \
  --name jaga-postgres \
  -e POSTGRES_PASSWORD=jaga2026 \
  -e POSTGRES_DB=jkn_riskgraph \
  -p 5433:5432 \
  apache/age:latest
```

**Container Details:**
- **Name:** `jaga-postgres`
- **Image:** `apache/age:latest` (PostgreSQL 18.6)
- **Port:** 5433 (host) → 5432 (container)
- **Database:** `jkn_riskgraph`
- **Username:** `postgres`
- **Password:** `jaga2026`

---

## ✅ Verification

### Test Commands

```bash
# Check container is running
docker ps

# Test AGE extension
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "CREATE EXTENSION IF NOT EXISTS age;"
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "LOAD 'age';"
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "SELECT * FROM ag_catalog.ag_graph;"
```

**Expected output:**
```
NOTICE:  extension "age" already exists, skipping
CREATE EXTENSION

LOAD

 graphid | name | namespace 
---------+------+-----------
(0 rows)
```

✅ **AGE extension working!**

---

## 🔧 Backend Configuration

### Backend .env File

Created: `backend/.env`

```env
# Database Configuration - Docker PostgreSQL 18 + AGE
DATABASE_URL=postgresql://postgres:jaga2026@localhost:5433/jkn_riskgraph
DB_HOST=localhost
DB_PORT=5433
DB_NAME=jkn_riskgraph
DB_USER=postgres
DB_PASSWORD=jaga2026

# Apache AGE Configuration
AGE_GRAPH_NAME=jkn_graph
AGE_SCHEMA=ag_catalog

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true

# CORS Settings
CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Environment
ENVIRONMENT=development
DEBUG=true
```

**Key changes from standard setup:**
- Port changed to **5433** (Docker container)
- Password: `jaga2026`

---

## 🚀 Daily Usage

### Start Docker PostgreSQL

```bash
# If container stopped, restart it
docker start jaga-postgres

# Check status
docker ps | grep jaga
```

### Stop Docker PostgreSQL

```bash
docker stop jaga-postgres
```

### View Logs

```bash
docker logs jaga-postgres --tail 50
```

### Connect to Database

```bash
# From host machine
psql -U postgres -h localhost -p 5433 -d jkn_riskgraph

# Or via Docker exec
docker exec -it jaga-postgres psql -U postgres -d jkn_riskgraph
```

### Backup Database

```bash
docker exec jaga-postgres pg_dump -U postgres jkn_riskgraph > backup.sql
```

### Restore Database

```bash
cat backup.sql | docker exec -i jaga-postgres psql -U postgres -d jkn_riskgraph
```

---

## 📦 What's Installed

### PostgreSQL Version

```bash
docker exec jaga-postgres psql -U postgres -c "SELECT version();"
```

**Output:**
```
PostgreSQL 18.6 (Debian 18.6-1.pgdg13+2) on x86_64-pc-linux-gnu
```

### AGE Extension Version

```bash
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "SELECT * FROM pg_available_extensions WHERE name = 'age';"
```

**Output:**
```
 name | default_version | installed_version | comment
------+-----------------+-------------------+---------
 age  | 1.8.0           | 1.8.0             | AGE graph database extension
```

---

## 🎯 Next Steps

Now that PostgreSQL + AGE is working, proceed with:

### 1. Initialize Database Schema

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ../database
python init_db.py
```

**Expected:**
- 8 relational tables created
- AGE graph `jkn_graph` created

### 2. Generate Synthetic Data

```bash
cd scripts
python generate_synthetic_data.py
```

**Output:**
- 10,000 participants
- 100 providers
- 500 doctors
- 100,000 claims
- ~5% fraud patterns

### 3. Load Data

```bash
python load_synthetic_data.py
```

### 4. Build Graph

```bash
python build_graph.py
```

**Expected:**
- 110,600 nodes
- ~200,000+ edges

### 5. Start Backend API

```bash
cd ../backend
uvicorn src.main:app --reload --port 8000
```

Visit: http://localhost:8000/docs

### 6. Start Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Visit: http://localhost:5173

---

## 🔍 Troubleshooting

### Container Won't Start

```bash
# Check Docker Desktop is running
docker ps

# If not running, start Docker Desktop from Windows Start Menu

# Check container logs
docker logs jaga-postgres

# Restart container
docker restart jaga-postgres
```

### Port 5433 Already in Use

```bash
# Stop container
docker stop jaga-postgres

# Remove container
docker rm jaga-postgres

# Start with different port (e.g., 5434)
docker run -d --name jaga-postgres -e POSTGRES_PASSWORD=jaga2026 -e POSTGRES_DB=jkn_riskgraph -p 5434:5432 apache/age:latest

# Update backend/.env with new port
```

### Can't Connect to Database

```bash
# Check container is running
docker ps | grep jaga

# Check container network
docker inspect jaga-postgres | grep IPAddress

# Test connection
psql -U postgres -h localhost -p 5433 -d jkn_riskgraph
```

### AGE Extension Not Working

```bash
# Recreate extension
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "DROP EXTENSION IF EXISTS age CASCADE;"
docker exec jaga-postgres psql -U postgres -d jkn_riskgraph -c "CREATE EXTENSION age;"
```

---

## 📊 System Resources

### Docker Container Stats

```bash
docker stats jaga-postgres --no-stream
```

**Expected usage:**
- Memory: ~100-500 MB (depending on data size)
- CPU: <5% (idle), 10-30% (during queries)
- Disk: ~500 MB (container) + data size

### Data Storage Location

```bash
# View container volumes
docker inspect jaga-postgres | grep -A 10 "Mounts"
```

**Data persists** even if container stops (stored in Docker volumes)

---

## 🎓 Key Learnings

### Why Docker vs Ubuntu Compilation?

| Aspect | Ubuntu Compilation | Docker |
|--------|-------------------|---------|
| Setup Time | 2+ hours | 15 minutes |
| Complexity | High (build tools, dependencies) | Low (pull image) |
| Windows Compatibility | ❌ Binary format mismatch | ✅ Works perfectly |
| Updates | Manual recompilation | `docker pull` |
| Isolation | Affects system PostgreSQL | Separate container |
| Portability | Platform-specific | Works anywhere |

**Conclusion:** Docker is superior for Windows development

### Binary Compatibility Issue

- Linux `.so` files use ELF format
- Windows `.dll` files use PE format
- Cannot be converted by renaming
- Must compile natively for each platform
- Docker solves this by running Linux container

---

## 📚 References

- **Apache AGE Docker Hub:** https://hub.docker.com/r/apache/age
- **Apache AGE Documentation:** https://age.apache.org/
- **PostgreSQL Docker:** https://hub.docker.com/_/postgres
- **Docker Documentation:** https://docs.docker.com/

---

## ✅ Success Checklist

After following this guide, you should have:

- [x] Docker Desktop running
- [x] `jaga-postgres` container running on port 5433
- [x] PostgreSQL 18.6 accessible
- [x] Apache AGE extension installed and working
- [x] Database `jkn_riskgraph` created
- [x] Backend `.env` configured with Docker connection
- [x] Python virtual environment created
- [x] Dependencies installed

**Next:** Initialize database schema and generate synthetic data

---

## 🎉 Summary

**Total setup time:** ~2.5 hours (including failed Ubuntu attempt)  
**Working solution time:** 15 minutes (Docker)  
**Status:** ✅ Production-ready local development environment

**Key Achievement:** PostgreSQL 18 + Apache AGE fully functional for JAGA fraud detection graph analytics!

---

**Created:** 2026-10-02 13:09 UTC  
**Author:** Renggo (Backend Lead)  
**Project:** JAGA - Jaringan Analitik Guard Anti-fraud  
**Status:** Phase 1 Complete - Ready for Phase 2 (Database Schema)
