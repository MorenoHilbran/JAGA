# Ubuntu WSL2 Apache AGE Installation Guide

**Project:** JAGA - Jaringan Analitik Guard Anti-fraud  
**Component:** Apache AGE (Graph Database Extension for PostgreSQL 16)  
**Environment:** Ubuntu 26.04 LTS in WSL2 + Windows PostgreSQL 16  
**Date:** 2026-10-02  
**Author:** Renggo (Backend Lead)

---

## 🎯 Overview

This guide walks you through compiling Apache AGE in Ubuntu WSL2 and integrating it with your existing Windows PostgreSQL 16 installation.

**What is Apache AGE?**
- Graph database extension for PostgreSQL
- Supports openCypher queries
- Enables network/relationship analysis for fraud detection

**Why compile in Ubuntu?**
- AGE has limited Windows build support
- Ubuntu provides proper build tools
- WSL2 allows seamless file sharing with Windows

**Timeline:** 45-60 minutes

---

## ✅ Prerequisites

Before starting, verify you have:

- [x] Windows 10/11 with WSL2 enabled
- [ ] **Ubuntu 26.04 LTS installed in WSL2** (we'll install this in Step 0)
- [x] PostgreSQL 16 installed on Windows
- [x] Internet connection
- [x] Administrator rights (for copying files)

**Verify your setup:**

```bash
# Check WSL version
wsl --version
# Should show: WSL version: 2.x.x.x

# Check Ubuntu distribution
wsl --list --verbose
# Should show: Ubuntu or Ubuntu-26.04 Running 2

# Check PostgreSQL version (from Windows CMD)
psql --version
# Should show: psql (PostgreSQL) 16.x

# Check pg_config location
where pg_config
# Should show: C:\Program Files\PostgreSQL\16\bin\pg_config.exe
```

---

## 📋 Step-by-Step Installation

### Step 0: Install Ubuntu 26.04 in WSL2 (If Not Already Installed)

**Check if you already have Ubuntu installed:**

```bash
wsl --list --verbose
```

**If you only see `docker-desktop` and NO Ubuntu distribution:**

**Option A: Install from Microsoft Store (Recommended)**

1. Open **Microsoft Store** app
2. Search for **"Ubuntu 26.04 LTS"** or just **"Ubuntu"**
3. Click **Get** or **Install**
4. Wait for download (~500MB-1GB)
5. Click **Launch** or type `ubuntu` in Windows Terminal
6. **First time setup:**
   - Create UNIX username (e.g., `renggo`)
   - Create UNIX password
   - Remember this password! (needed for `sudo` commands)

**Option B: Install via Command Line**

From Windows PowerShell (as Administrator):

```powershell
# List available Ubuntu versions
wsl --list --online

# Install Ubuntu (latest LTS)
wsl --install -d Ubuntu

# Or install specific version
wsl --install -d Ubuntu-26.04
```

Wait for installation to complete, then launch Ubuntu.

**Verify Ubuntu is installed:**

```bash
wsl --list --verbose
# Should now show: Ubuntu or Ubuntu-26.04 Running 2
```

**Set as default (optional):**

```bash
wsl --set-default Ubuntu
```

---

### Step 1: Access Ubuntu WSL2

Open Windows Terminal or PowerShell and enter Ubuntu:

```bash
wsl -d Ubuntu
```

Or simply:

```bash
wsl
```

**Expected output:**
```
renggo@Pandora:/mnt/c/Users/acer$
# Or similar prompt with your username
```

**Verify you're in Ubuntu:**
```bash
cat /etc/os-release
```

Should show: `Ubuntu 26.04` or similar

**Check kernel:**
```bash
uname -a
```

Should show: Linux kernel version (not MINGW64)

---

### Step 2: Update System & Install Build Dependencies

**2.1: Update package lists**

```bash
sudo apt update && sudo apt upgrade -y
```

**Time:** 2-5 minutes  
**Expected:** Package lists updated, system upgraded

**2.2: Install build tools**

```bash
sudo apt install -y \
  build-essential \
  libreadline-dev \
  zlib1g-dev \
  flex \
  bison \
  git \
  wget \
  gnupg2 \
  lsb-release
```

**Time:** 3-5 minutes  
**Expected:** ~50-80MB of packages installed

**2.3: Add PostgreSQL 16 repository**

```bash
# Import PostgreSQL GPG key (new method for Ubuntu 26.04)
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg

# Add PostgreSQL repository
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# If lsb_release not found, install it first:
sudo apt install -y lsb-release

# Or manually specify Ubuntu codename:
# echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt noble-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# Update package lists again
sudo apt update
```

**Expected output:**
```
OK
deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt noble-pgdg main
Hit:1 http://archive.ubuntu.com/ubuntu oracular InRelease
Get:2 http://apt.postgresql.org/pub/repos/apt noble-pgdg InRelease [117 kB]
...
```

**Note:** Ubuntu 26.04 may use newer GPG key management. The above command uses the modern method.

**2.4: Install PostgreSQL 16 development files**

```bash
sudo apt install -y postgresql-server-dev-16
```

**Time:** 2-3 minutes  
**Expected:** PostgreSQL development headers installed

**2.5: Verify pg_config**

```bash
pg_config --version
```

**Expected output:**
```
PostgreSQL 16.14
```

**✅ Checkpoint:** Build environment ready!

---

### Step 3: Clone & Compile Apache AGE

**3.1: Clone AGE repository**

```bash
cd ~
git clone https://github.com/apache/age.git
cd age
```

**Time:** 1-2 minutes  
**Size:** ~15MB download

**3.2: Checkout PostgreSQL 16 compatible version**

```bash
git checkout release/PG16/1.5.0
```

**Expected output:**
```
Switched to branch 'release/PG16/1.5.0'
```

**3.3: Compile AGE**

```bash
make PG_CONFIG=/usr/bin/pg_config
```

**Time:** 5-10 minutes  
**Expected output:**
```
gcc -Wall -Wmissing-prototypes ...
... (many compilation lines) ...
gcc -Wall -Wmissing-prototypes ... -o age.so
```

**⚠️ Watch for errors!** If compilation fails:
- Check `gcc --version` (should be 11.x or higher)
- Verify all dependencies installed
- Check internet connection

**3.4: Install compiled files**

```bash
sudo make install PG_CONFIG=/usr/bin/pg_config
```

**Time:** 10-20 seconds  
**Expected output:**
```
/bin/mkdir -p '/usr/lib/postgresql/16/lib'
/bin/mkdir -p '/usr/share/postgresql/16/extension'
/usr/bin/install -c -m 755 age.so '/usr/lib/postgresql/16/lib/age.so'
/usr/bin/install -c -m 644 age.control '/usr/share/postgresql/16/extension/'
/usr/bin/install -c -m 644 age--1.5.0.sql '/usr/share/postgresql/16/extension/'
...
```

**3.5: Verify compiled files**

```bash
ls -lh /usr/lib/postgresql/16/lib/age.so
ls -lh /usr/share/postgresql/16/extension/age*
```

**Expected output:**
```
-rwxr-xr-x 1 root root 1.2M Oct  2 12:30 /usr/lib/postgresql/16/lib/age.so
-rw-r--r-- 1 root root  187 Oct  2 12:30 /usr/share/postgresql/16/extension/age.control
-rw-r--r-- 1 root root  85K Oct  2 12:30 /usr/share/postgresql/16/extension/age--1.5.0.sql
...
```

**✅ Checkpoint:** Apache AGE compiled successfully!

---

### Step 4: Copy Files to Windows PostgreSQL

This is the **critical integration step** - copying compiled files from Ubuntu to Windows PostgreSQL.

**4.1: Define Windows paths**

In Ubuntu WSL2, your Windows drives are mounted at `/mnt/`:
- `C:\` = `/mnt/c/`
- `D:\` = `/mnt/d/`

```bash
# Define paths (as environment variables for convenience)
export WIN_PG_LIB="/mnt/c/Program Files/PostgreSQL/16/lib"
export WIN_PG_EXT="/mnt/c/Program Files/PostgreSQL/16/share/extension"
```

**4.2: Verify Windows paths exist**

```bash
ls -la "$WIN_PG_LIB" | head -10
ls -la "$WIN_PG_EXT" | head -10
```

**Expected:** You should see existing PostgreSQL files

**4.3: Copy library file**

```bash
sudo cp /usr/lib/postgresql/16/lib/age.so "$WIN_PG_LIB/"
```

**4.4: Copy extension files**

```bash
sudo cp /usr/share/postgresql/16/extension/age.control "$WIN_PG_EXT/"
sudo cp /usr/share/postgresql/16/extension/age--1.5.0.sql "$WIN_PG_EXT/"
sudo cp /usr/share/postgresql/16/extension/age--*.sql "$WIN_PG_EXT/"
```

**4.5: Verify files copied**

```bash
ls -lh "$WIN_PG_LIB/age.so"
ls -lh "$WIN_PG_EXT/age"*
```

**Expected output:**
```
-rwxr-xr-x 1 root root 1.2M Oct  2 12:35 /mnt/c/Program Files/PostgreSQL/16/lib/age.so
-rw-r--r-- 1 root root  187 Oct  2 12:35 /mnt/c/Program Files/PostgreSQL/16/share/extension/age.control
-rw-r--r-- 1 root root  85K Oct  2 12:35 /mnt/c/Program Files/PostgreSQL/16/share/extension/age--1.5.0.sql
...
```

**⚠️ TROUBLESHOOTING: Permission Denied**

If you get "Permission denied" errors when copying:

**Option A: Copy to temporary location first**

```bash
# Create temp directory
mkdir -p /mnt/c/Users/acer/Desktop/age_temp

# Copy files there
cp /usr/lib/postgresql/16/lib/age.so /mnt/c/Users/acer/Desktop/age_temp/
cp /usr/share/postgresql/16/extension/age* /mnt/c/Users/acer/Desktop/age_temp/

# Then manually copy using Windows File Explorer:
# 1. Open File Explorer as Administrator
# 2. Navigate to C:\Users\acer\Desktop\age_temp\
# 3. Copy age.so to C:\Program Files\PostgreSQL\16\lib\
# 4. Copy age*.sql and age.control to C:\Program Files\PostgreSQL\16\share\extension\
```

**Option B: Change directory permissions (Windows)**

From Windows CMD (as Administrator):
```cmd
icacls "C:\Program Files\PostgreSQL\16\lib" /grant Users:(OI)(CI)F
icacls "C:\Program Files\PostgreSQL\16\share\extension" /grant Users:(OI)(CI)F
```

Then retry copying from Ubuntu.

**✅ Checkpoint:** Files copied to Windows PostgreSQL!

---

### Step 5: Enable AGE Extension in PostgreSQL

Exit Ubuntu and return to Windows CMD or PowerShell.

**5.1: Restart PostgreSQL service (optional but recommended)**

From Windows CMD (as Administrator):

```cmd
net stop postgresql-x64-16
net start postgresql-x64-16
```

**Expected output:**
```
The postgresql-x64-16 service is stopping.
The postgresql-x64-16 service was stopped successfully.

The postgresql-x64-16 service is starting.
The postgresql-x64-16 service was started successfully.
```

**5.2: Connect to PostgreSQL**

```bash
psql -U postgres
```

Enter your PostgreSQL password when prompted.

**5.3: Create AGE extension**

Inside `psql`:

```sql
CREATE EXTENSION age;
```

**Expected output:**
```
CREATE EXTENSION
```

**5.4: Load AGE into session**

```sql
LOAD 'age';
SET search_path = ag_catalog, "$user", public;
```

**Expected output:**
```
LOAD
SET
```

**5.5: Verify AGE installation**

```sql
SELECT * FROM pg_available_extensions WHERE name = 'age';
```

**Expected output:**
```
 name | default_version | installed_version |                    comment
------+-----------------+-------------------+-----------------------------------------------
 age  | 1.5.0           | 1.5.0             | AGE graph database extension
(1 row)
```

**5.6: Test AGE graph catalog**

```sql
SELECT * FROM ag_catalog.ag_graph;
```

**Expected output:**
```
 graphid | name | namespace
---------+------+-----------
(0 rows)
```

**✅ SUCCESS!** Empty table means AGE is working correctly!

**5.7: Exit psql**

```sql
\q
```

---

## 🎉 Installation Complete!

**What you've accomplished:**
- ✅ Compiled Apache AGE 1.5.0 in Ubuntu WSL2
- ✅ Integrated AGE with Windows PostgreSQL 16
- ✅ Verified AGE extension works correctly
- ✅ **UNBLOCKED:** Everyone on the team can now proceed!

---

## 🧪 Verification Checklist

Run these commands to verify everything works:

**From Windows CMD/PowerShell:**

```bash
# 1. Check AGE extension exists
psql -U postgres -c "SELECT extname, extversion FROM pg_extension WHERE extname = 'age';"

# Expected: age | 1.5.0

# 2. Check AGE library file
dir "C:\Program Files\PostgreSQL\16\lib\age.so"

# Expected: File exists

# 3. Check AGE extension files
dir "C:\Program Files\PostgreSQL\16\share\extension\age*"

# Expected: Multiple age*.sql files + age.control
```

---

## 🚀 Next Steps

Now that Apache AGE is installed, proceed with JAGA implementation:

### Immediate Next Steps:

1. **Create Backend Environment**
   ```bash
   cd "D:\KULIAH\GIAT\Healthkathon 26\JAGA\backend"
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Create .env Configuration**
   - Copy `.env.example` to `.env`
   - Set your PostgreSQL password

3. **Initialize Database**
   ```bash
   cd database
   python init_db.py
   ```

4. **Generate Synthetic Data**
   ```bash
   cd scripts
   python generate_synthetic_data.py
   python load_synthetic_data.py
   python build_graph.py
   ```

**See `README.md` for detailed next steps.**

---

## ❓ Troubleshooting

### Issue: "could not open extension control file"

**Cause:** AGE files not properly copied to Windows PostgreSQL

**Solution:**
```bash
# Verify files exist
ls -la "C:\Program Files\PostgreSQL\16\share\extension\age.control"
ls -la "C:\Program Files\PostgreSQL\16\lib\age.so"

# If missing, repeat Step 4 (copying files)
```

### Issue: "could not load library"

**Cause:** PostgreSQL version mismatch or corrupted .so file

**Solution:**
```bash
# Verify PostgreSQL versions match
pg_config --version  # In Ubuntu
psql --version       # In Windows

# Both should show PostgreSQL 16.x

# If mismatch, recompile AGE with correct pg_config
```

### Issue: Compilation errors in Step 3.3

**Cause:** Missing dependencies or incompatible compiler

**Solution:**
```bash
# Install additional dependencies
sudo apt install -y gcc-11 g++-11 make

# Set compiler explicitly
export CC=gcc-11
export CXX=g++-11

# Retry compilation
make clean
make PG_CONFIG=/usr/bin/pg_config
```

### Issue: Permission denied when copying files

**Solution:** See "Option A" and "Option B" in Step 4.5 above

---

## 📚 References

- **Apache AGE Documentation:** https://age.apache.org/
- **AGE GitHub Repository:** https://github.com/apache/age
- **PostgreSQL Extensions:** https://www.postgresql.org/docs/16/extend-extensions.html
- **WSL2 Documentation:** https://learn.microsoft.com/en-us/windows/wsl/

---

## 📝 Notes

**Compilation time breakdown:**
- System update: 2-5 min
- Dependencies: 3-5 min
- AGE compilation: 5-10 min
- File copying: 2-3 min
- PostgreSQL setup: 2-3 min
- **Total: 14-26 minutes** (actual work)
- **Total with reading: 45-60 minutes**

**File sizes:**
- `age.so`: ~1.2 MB (compiled library)
- `age--1.5.0.sql`: ~85 KB (SQL definitions)
- `age.control`: ~187 bytes (extension metadata)

**Security notes:**
- AGE runs with same permissions as PostgreSQL
- No additional security configuration needed
- Graph data stored in PostgreSQL database
- Use PostgreSQL's existing security features (roles, permissions, SSL)

---

## ✅ Installation Complete Confirmation

When you've completed all steps successfully, you should be able to run:

```sql
psql -U postgres -c "
CREATE EXTENSION IF NOT EXISTS age;
LOAD 'age';
SET search_path = ag_catalog, \"\$user\", public;
SELECT * FROM ag_catalog.create_graph('test_graph');
SELECT * FROM ag_catalog.drop_graph('test_graph', true);
"
```

**Expected output:**
```
CREATE EXTENSION
LOAD
SET
 create_graph
--------------

(1 row)

 drop_graph
------------

(1 row)
```

**If you see this output - SUCCESS! Apache AGE is fully operational! 🎉**

---

**Created by:** Renggo (Backend Lead)  
**Date:** 2026-10-02  
**Project:** JAGA - Jaringan Analitik Guard Anti-fraud  
**Version:** 1.0.0

---

**Next Document:** See `QUICKSTART.md` for continuing with JAGA setup
