# 🚀 JAGA - Running Guide

**Complete guide to run all JAGA services**  
**Author**: Renggo  
**Last Updated**: 2026-10-09 16:03 WIB

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Status Check](#database-status-check)
3. [Loading Data](#loading-data)
4. [Running Detection Engine](#running-detection-engine)
5. [Starting Backend API](#starting-backend-api)
6. [Starting Frontend](#starting-frontend)
7. [Monitoring & Troubleshooting](#monitoring--troubleshooting)

---

## Prerequisites

### Required Software
- ✅ PostgreSQL running on port 5433
- ✅ Python 3.11+ with venv
- ✅ Node.js 18+

### Check Services
```bash
# Check PostgreSQL is running
netstat -an | findstr :5433

# Should show: TCP    0.0.0.0:5433    ...    LISTENING
```

---

## Database Status Check

### Quick Status Check
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python view_detection_results.py
```

**Expected Output:**
```
=== Database Status ===
Participants: 10,000
Providers: 100
Doctors: 500
Claims: 110,750
Risk Signals: 75 (or more after detection)
```

---

## Loading Data

### Current Status
- ✅ Participants: Loaded (10,000)
- ✅ Providers: Loaded (100)
- ✅ Doctors: Loaded (500)
- ✅ Claims: Fully loaded (110,750 unique claims)

### Option 1: Load All Claims (Recommended if starting fresh)

**Terminal 1 - Load Data:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python load_claims_simple.py
```

**Terminal 2 - Monitor Progress:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python monitor_data.py
```

This will:
- Remove 500 duplicate claim_ids from CSV automatically
- Load 110,750 unique claims
- Take about 10-15 minutes
- Update progress every 1,000 claims
- Auto-stop when complete

**Note:** The script will ask to clear existing data (3 second countdown). Press Ctrl+C to cancel if you want to keep existing data.

### Option 2: Check Current Data Status

**Quick database check:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python monitor_data.py
```

Press Ctrl+C to stop monitoring.

### Option 3: Clear and Reload All Data

If data is corrupted or you want fresh start:

```bash
cd backend
venv\Scripts\python -c "import psycopg2; conn = psycopg2.connect(host='127.0.0.1', port=5433, database='jkn_riskgraph', user='postgres', password='postgres'); cur = conn.cursor(); cur.execute('TRUNCATE TABLE claims CASCADE'); conn.commit(); print('Claims table cleared'); conn.close()"
```

Then run: `backend\venv\Scripts\python load_claims_simple.py`

---

## Running Detection Engine

### Step 1: Check if Already Running

```bash
tasklist | findstr python
```

If you see multiple python.exe processes, detection might be running.

### Step 2: Run Detection

**Simple Run (no save):**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python scripts\run_detection_rules.py
```

**Run and Save to Database:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python scripts\run_detection_rules.py --save
```

**Run Specific Rules Only:**
```bash
# Only cloning and referral
backend\venv\Scripts\python scripts\run_detection_rules.py --rules cloning referral --save
```

### Step 3: Monitor Detection Progress

**View detection results:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python view_detection_results.py
```

This will show:
- Total risk signals detected
- Signals by type (cloning, prolonged LOS, repeat billing, etc.)
- Signals by confidence level
- Top entities with most signals
- Recent signals detected
- Risk networks count
- Investigations count

Run this script anytime to check detection status.

### Expected Results

With 110,750 claims, you should get approximately:
- **Cloning Detection**: 50-80 signals
- **Referral Concentration**: 10-20 signals
- **Prolonged LOS**: 5-15 signals
- **Repeat Billing**: 5-10 signals
- **Total**: 70-125 signals

### Execution Time

- **Cloning Detection**: 2-4 minutes
- **Referral Concentration**: 1-2 minutes
- **Prolonged LOS**: 1-2 minutes
- **Repeat Billing**: 2-3 minutes
- **Total**: 6-11 minutes

### View Detection Results

**Quick signal count:**
```bash
cd backend
venv\Scripts\python -c "import psycopg2; conn = psycopg2.connect(host='127.0.0.1', port=5433, database='jkn_riskgraph', user='postgres', password='postgres'); cur = conn.cursor(); cur.execute('SELECT COUNT(*) FROM risk_signals'); print(f'Risk Signals: {cur.fetchone()[0]}'); conn.close()"
```

**Full detection summary:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python view_detection_results.py
```

---

## Starting Backend API

### Terminal 1: Backend API Server

```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA\backend"
venv\Scripts\activate
python -m uvicorn src.main:app --reload --port 8000
```

**Expected Output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

### Test API Endpoints

**In browser, open:**
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Stats: http://localhost:8000/api/stats/summary

**Or in another terminal:**
```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/stats/summary
```

### Keep This Terminal Open

The API server must stay running for frontend to work.

---

## Starting Frontend

### Terminal 2: Frontend Dev Server

```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA\frontend"
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Open in Browser

Navigate to: **http://localhost:5173**

You should see:
1. **Landing Page** - JAGA Intelligence System
2. Click "Masuk Dashboard" or navigate to `/dashboard`
3. **Dashboard** - Shows risk networks (if detection ran)
4. **Network Detail** - Click any network to see visualization

### Keep This Terminal Open

The frontend dev server must stay running.

---

## Monitoring & Troubleshooting

### Monitor All Services

**Monitor database status in real-time:**

```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python monitor_data.py
```

Updates every 10 seconds with:
- Participants count
- Providers count
- Doctors count
- Claims count
- Claims loading progress %

Press `Ctrl+C` to stop.

**View detection results:**

```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python view_detection_results.py
```

Shows complete detection summary:
- Total signals and breakdown by type
- Confidence levels
- Top entities with most signals
- Recent signals detected
- Risk networks and investigations

### Common Issues

#### Issue 1: Database Connection Error

**Error:** `connection to server at "localhost", port 5432 failed`

**Solution:** PostgreSQL is using port 5433, not 5432. The .env file should have:
```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/jkn_riskgraph
```

#### Issue 2: Module Not Found

**Error:** `ModuleNotFoundError: No module named 'src'`

**Solution:** Always run scripts from project root, not from backend:
```bash
# Wrong
cd backend
python scripts/run_detection_rules.py

# Correct
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python scripts/run_detection_rules.py
```

#### Issue 3: Frontend Shows Mock Data

**Reason:** Detection engine hasn't run yet or generated no signals.

**Solution:** 
1. Run detection engine with `--save` flag
2. Check signals generated: `SELECT COUNT(*) FROM risk_signals`
3. Restart backend API server
4. Refresh frontend

#### Issue 4: Claims Loading Stuck

**Symptoms:** Progress stops updating, same count for 5+ minutes

**Solution:**
1. Check if python process is running: `tasklist | findstr python`
2. Kill stuck process: `taskkill /IM python.exe /F`
3. Restart loading script

#### Issue 5: Unicode Encoding Errors

**Error:** `UnicodeEncodeError: 'charmap' codec can't encode character`

**Solution:** Already fixed in scripts. If you see this, make sure you're using the latest version of the scripts.

---

## Complete Workflow

### First Time Setup

```bash
# 1. Check database
cd backend
venv\Scripts\python -c "import psycopg2; conn = psycopg2.connect(host='127.0.0.1', port=5433, database='jkn_riskgraph', user='postgres', password='postgres'); print('Database OK'); conn.close()"

# 2. Load data (if needed)
cd ..
backend\venv\Scripts\python load_claims_simple.py

# 3. Run detection
backend\venv\Scripts\python scripts\run_detection_rules.py --save

# 4. Start backend (Terminal 1)
cd backend
venv\Scripts\activate
python -m uvicorn src.main:app --reload --port 8000

# 5. Start frontend (Terminal 2)
cd frontend
npm run dev

# 6. Open browser
start http://localhost:5173
```

### Daily Development

```bash
# Terminal 1: Backend
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA\backend"
venv\Scripts\activate
python -m uvicorn src.main:app --reload --port 8000

# Terminal 2: Frontend
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA\frontend"
npm run dev

# Browser: http://localhost:5173
```

### Re-run Detection

```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python scripts\run_detection_rules.py --save
```

---

## Quick Reference Commands

### Database Queries

**Check all table counts:**
```bash
cd backend
venv\Scripts\python -c "import psycopg2; conn = psycopg2.connect(host='127.0.0.1', port=5433, database='jkn_riskgraph', user='postgres', password='postgres'); cur = conn.cursor(); tables = ['participants', 'providers', 'doctors', 'claims', 'risk_signals', 'risk_networks']; print('=== Database Status ==='); [print(f'{t}: {cur.execute(f\"SELECT COUNT(*) FROM {t}\") or cur.fetchone()[0]:,}') for t in tables]; conn.close()"
```

**Clear detection results (start fresh):**
```bash
cd backend
venv\Scripts\python -c "import psycopg2; conn = psycopg2.connect(host='127.0.0.1', port=5433, database='jkn_riskgraph', user='postgres', password='postgres'); cur = conn.cursor(); cur.execute('TRUNCATE TABLE risk_signals CASCADE'); cur.execute('TRUNCATE TABLE risk_networks CASCADE'); conn.commit(); print('Detection data cleared'); conn.close()"
```

### Service Management

**Check what's running:**
```bash
netstat -ano | findstr :8000    # Backend API
netstat -ano | findstr :5173    # Frontend
netstat -ano | findstr :5433    # Database
tasklist | findstr python       # Python processes
tasklist | findstr node         # Node processes
```

**Kill processes if needed:**
```bash
taskkill /F /IM python.exe      # Kill all Python
taskkill /F /IM node.exe        # Kill all Node
```

---

## Performance Tips

1. **Use Current Data**: 46,828 claims is enough for testing. Don't wait for full load.

2. **Run Specific Rules**: If testing, run one rule at a time:
   ```bash
   backend\venv\Scripts\python scripts\run_detection_rules.py --rules cloning --save
   ```

3. **Monitor in Separate Terminal**: Always keep a monitoring terminal open.

4. **API Logs**: Watch backend terminal for API requests when using frontend.

5. **Browser DevTools**: Open F12 to see network requests and debug frontend issues.

---

## Success Indicators

### ✅ System is Working When:

1. **Database**: All counts > 0
2. **Detection**: Risk signals > 0
3. **Backend API**: Returns data at `/api/stats/summary`
4. **Frontend**: Dashboard shows network cards (not mock data)
5. **Network Visualization**: Graph displays when clicking a network

### 🎯 Full System Test:

1. Load data ✓
2. Run detection ✓
3. Start backend API ✓
4. Start frontend ✓
5. Open http://localhost:5173 ✓
6. See dashboard with networks ✓
7. Click a network ✓
8. See graph visualization ✓
9. Click "Konfirmasi & Bekukan" ✓
10. See decision dialog ✓

**If all 10 steps work: JAGA is fully operational! 🎉**

---

## Next Steps After System is Running

1. **All claims loaded** ✅ (110,750 unique claims)
2. **Implement risk fusion** (group signals into networks)
3. **Add more detection rules** (upcoding, etc.)
4. **Statistical detection** (Paundra's work)
5. **Graph analytics** (Paundra's work)
6. **Performance optimization**
7. **Demo preparation**

---

## Support

**If stuck:**
1. Check this guide's troubleshooting section
2. Check `DETECTION_ENGINE_COMPLETE.md` for technical details
3. Check `SESSION_SUMMARY.md` for what was accomplished
4. Check backend logs in Terminal 1
5. Check frontend logs in Terminal 2
6. Check browser console (F12)

**Quick health check:**
```bash
cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA"
backend\venv\Scripts\python view_detection_results.py
```

---

**Good luck, Renggo! You've built something amazing! 🚀**

**Project Status: 90% Complete - Full System Integration Working!**

**Last Updated: 2026-10-09 16:03 WIB**

---

## What's New (2026-10-09):
- ✅ All 110,750 claims loaded (duplicate handling fixed)
- ✅ 67 risk networks created via risk fusion
- ✅ Frontend-backend fully connected (CORS fixed)
- ✅ Data normalization (snake_case ↔ camelCase)
- ✅ Pagination for browsing all 67 networks
- ✅ TailwindCSS v4 configured
- ✅ Table layout fixed (no overlap)
