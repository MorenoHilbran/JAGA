# Copy Apache AGE Files to Laragon PostgreSQL 18

**Date:** 2026-10-02  
**Time:** 12:52 PM  
**Status:** AGE compiled in Ubuntu, ready to copy to Laragon

---

## 🎯 **MANUAL COPY INSTRUCTIONS**

Since automated copy is having path issues, let's do this manually (takes 2 minutes):

---

### **Step 1: Copy Files from Ubuntu to Desktop**

**Open your Ubuntu terminal** (where you compiled AGE) and run:

```bash
# Copy library file to Windows Desktop
sudo cp /usr/lib/postgresql/18/lib/age.so /mnt/c/Users/acer/Desktop/

# Copy extension files to Windows Desktop
sudo cp /usr/share/postgresql/18/extension/age*.sql /mnt/c/Users/acer/Desktop/
sudo cp /usr/share/postgresql/18/extension/age.control /mnt/c/Users/acer/Desktop/

# Verify files are on Desktop
ls -la /mnt/c/Users/acer/Desktop/age*
```

**Expected output:**
```
-rw-r--r-- 1 root root 4.0M Oct  2 19:49 /mnt/c/Users/acer/Desktop/age.so
-rw-r--r-- 1 root root 5.6K Oct  2 19:49 /mnt/c/Users/acer/Desktop/age--1.6.0--1.7.0.sql
-rw-r--r-- 1 root root  40K Oct  2 19:49 /mnt/c/Users/acer/Desktop/age--1.7.0--1.8.0.sql
-rw-r--r-- 1 root root 146K Oct  2 19:49 /mnt/c/Users/acer/Desktop/age--1.8.0.sql
-rw-r--r-- 1 root root  900 Oct  2 19:49 /mnt/c/Users/acer/Desktop/age.control
```

---

### **Step 2: Copy age.so to Laragon PostgreSQL lib folder**

**Using Windows File Explorer:**

1. Open **File Explorer**
2. Navigate to **Desktop** → You should see `age.so` file (4 MB)
3. **Copy** `age.so`
4. Navigate to: `C:\laragon\bin\postgresql\pgsql\lib\`
5. **Paste** `age.so` there

**Or via Windows CMD:**

```cmd
copy "C:\Users\acer\Desktop\age.so" "C:\laragon\bin\postgresql\pgsql\lib\"
```

---

### **Step 3: Copy extension files to Laragon PostgreSQL extension folder**

**Using Windows File Explorer:**

1. Select these files from **Desktop**:
   - `age--1.6.0--1.7.0.sql`
   - `age--1.7.0--1.8.0.sql`
   - `age--1.8.0.sql`
   - `age.control`
2. **Copy** all 4 files
3. Navigate to: `C:\laragon\bin\postgresql\pgsql\share\extension\`
4. **Paste** all files there

**Or via Windows CMD:**

```cmd
copy "C:\Users\acer\Desktop\age*.sql" "C:\laragon\bin\postgresql\pgsql\share\extension\"
copy "C:\Users\acer\Desktop\age.control" "C:\laragon\bin\postgresql\pgsql\share\extension\"
```

---

### **Step 4: Verify files are in place**

**Windows CMD:**

```cmd
dir "C:\laragon\bin\postgresql\pgsql\lib\age.so"
dir "C:\laragon\bin\postgresql\pgsql\share\extension\age*"
```

**Expected:**
- `age.so` - 4 MB
- 3 SQL files
- 1 control file

---

### **Step 5: Restart PostgreSQL in Laragon**

1. Open **Laragon** application
2. Click **PostgreSQL** in the menu
3. Click **Stop PostgreSQL**
4. Wait 2 seconds
5. Click **Start PostgreSQL**

**Or via Windows CMD:**

```cmd
# Stop PostgreSQL
taskkill /IM pg_ctl.exe /F
taskkill /IM postgres.exe /F

# Start PostgreSQL via Laragon
# (Just click "Start" in Laragon GUI)
```

---

### **Step 6: Enable AGE Extension**

**Windows CMD/PowerShell:**

```cmd
psql -U postgres -p 5432

# Inside psql, run these commands:
CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

# Test it works
SELECT * FROM ag_catalog.ag_graph;

# Should return empty table (0 rows) - this means AGE works!

# Exit
\q
```

---

## ✅ **SUCCESS CHECKLIST**

After completing all steps:

- [ ] `age.so` is in `C:\laragon\bin\postgresql\pgsql\lib\`
- [ ] 4 AGE extension files in `C:\laragon\bin\postgresql\pgsql\share\extension\`
- [ ] PostgreSQL restarted
- [ ] `CREATE EXTENSION age;` runs without errors
- [ ] `SELECT * FROM ag_catalog.ag_graph;` returns empty table

---

## 🚀 **WHAT'S NEXT?**

Once AGE extension is working, you can:

1. Create JAGA database: `CREATE DATABASE jkn_riskgraph;`
2. Initialize schema: `python database/init_db.py`
3. Generate synthetic data: `python scripts/generate_synthetic_data.py`
4. Build graph: `python scripts/build_graph.py`

---

## 📞 **NEED HELP?**

If you get errors:
- Make sure PostgreSQL is stopped before copying files
- Check file permissions (run File Explorer as Administrator if needed)
- Verify PostgreSQL version matches: `psql --version` should show 18.x

---

**Created:** 2026-10-02 12:52 PM  
**Status:** Ready to copy files  
**Next:** Enable AGE extension
