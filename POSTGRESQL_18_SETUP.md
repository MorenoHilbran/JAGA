# PostgreSQL 18 + Apache AGE Setup for Ubuntu 26.04

**PostgreSQL Version:** 18 (latest stable - 2026)  
**Apache AGE Version:** PG18/latest  
**Ubuntu:** 26.04.1 LTS (resolute)  
**Date:** 2026-10-02

---

## 🎯 **COMPLETE SETUP FOR POSTGRESQL 18**

### **Step 1: Fix GPG Key and Add PostgreSQL 18 Repository**

Run these commands in your Ubuntu terminal:

```bash
# Download PostgreSQL GPG key (modern method)
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg

# Remove old repository if exists
sudo rm -f /etc/apt/sources.list.d/pgdg.list

# Add PostgreSQL repository with proper GPG signature
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt resolute-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# Update package lists
sudo apt update
```

**Expected:** No GPG errors!

---

### **Step 2: Install PostgreSQL 18 Development Files**

```bash
# Install PostgreSQL 18 server dev files
sudo apt install -y postgresql-server-dev-18

# Install additional build dependencies
sudo apt install -y build-essential libreadline-dev zlib1g-dev flex bison git
```

**Verify installation:**
```bash
pg_config --version
```

**Expected output:**
```
PostgreSQL 18.x
```

---

### **Step 3: Clone Apache AGE (PostgreSQL 18 Branch)**

```bash
cd ~
git clone https://github.com/apache/age.git
cd age

# Checkout PostgreSQL 18 compatible branch
# Check available branches first
git branch -a | grep PG18

# Use the latest PG18 release
git checkout release/PG18/latest
# Or if that doesn't exist:
# git checkout PG18_development
```

**Note:** Apache AGE for PostgreSQL 18 may be in development branch. We'll check and use the appropriate branch.

---

### **Step 4: Compile Apache AGE for PostgreSQL 18**

```bash
# Clean any previous builds
make clean

# Configure for PostgreSQL 18
make PG_CONFIG=/usr/bin/pg_config

# Install
sudo make install PG_CONFIG=/usr/bin/pg_config
```

**Expected:** Compilation completes successfully, files installed to:
- `/usr/lib/postgresql/18/lib/age.so`
- `/usr/share/postgresql/18/extension/age*.sql`
- `/usr/share/postgresql/18/extension/age.control`

**Verify compiled files:**
```bash
ls -lh /usr/lib/postgresql/18/lib/age.so
ls -lh /usr/share/postgresql/18/extension/age*
```

---

### **Step 5: Copy Files to Windows PostgreSQL 18**

**⚠️ IMPORTANT:** You need PostgreSQL 18 installed on Windows too!

**If you have PostgreSQL 16 on Windows, you need to:**

**Option A: Install PostgreSQL 18 on Windows (recommended)**

1. Download PostgreSQL 18 from https://www.postgresql.org/download/windows/
2. Install alongside PostgreSQL 16 (use port 5433 to avoid conflict)
3. Or uninstall PostgreSQL 16 first, then install 18

**Option B: Stick with PostgreSQL 16**

If you want to keep PostgreSQL 16 on Windows, change back to:
```bash
# In Ubuntu
sudo apt install -y postgresql-server-dev-16
# And use AGE PG16 branch
```

---

**Assuming you install PostgreSQL 18 on Windows, copy files:**

```bash
# Define Windows PostgreSQL 18 paths
export WIN_PG_LIB="/mnt/c/Program Files/PostgreSQL/18/lib"
export WIN_PG_EXT="/mnt/c/Program Files/PostgreSQL/18/share/extension"

# Copy library file
sudo cp /usr/lib/postgresql/18/lib/age.so "$WIN_PG_LIB/"

# Copy extension files
sudo cp /usr/share/postgresql/18/extension/age.control "$WIN_PG_EXT/"
sudo cp /usr/share/postgresql/18/extension/age--*.sql "$WIN_PG_EXT/"

# Verify files copied
ls -lh "$WIN_PG_LIB/age.so"
ls -lh "$WIN_PG_EXT/age"*
```

---

### **Step 6: Enable AGE Extension in PostgreSQL 18**

From Windows CMD/PowerShell:

```bash
# Connect to PostgreSQL 18
psql -U postgres -p 5432

# Inside psql:
CREATE EXTENSION age;
LOAD 'age';
SET search_path = ag_catalog, "$user", public;

# Verify
SELECT * FROM pg_available_extensions WHERE name = 'age';

# Test
SELECT * FROM ag_catalog.ag_graph;

\q
```

---

## ⚠️ **DECISION POINT**

Before we continue, you need to decide:

### **Option A: PostgreSQL 18 Everywhere (Clean Slate)**

**Pros:**
- ✅ Latest PostgreSQL features
- ✅ Latest Apache AGE
- ✅ Consistent versions
- ✅ Modern, future-proof

**Cons:**
- ❌ Need to install PostgreSQL 18 on Windows
- ❌ ~10-15 minutes extra for Windows install
- ❌ Need to migrate if you have existing data

**Time:** +15 minutes for Windows PostgreSQL 18 install

---

### **Option B: Keep PostgreSQL 16 (Existing Setup)**

**Pros:**
- ✅ Use your existing Windows PostgreSQL 16
- ✅ No Windows reinstall needed
- ✅ Start immediately

**Cons:**
- ❌ Not using latest PostgreSQL
- ❌ PostgreSQL 16 is from 2023 (still good though)

**Time:** Continue immediately

---

## 🎯 **WHAT DO YOU WANT TO DO?**

**Reply with:**

**"A"** - Install PostgreSQL 18 on Windows, use PG18 everywhere (latest, clean)

**"B"** - Stick with PostgreSQL 16 on Windows, compile AGE for PG16

---

**My recommendation:** If you don't have critical data in PostgreSQL 16 yet, go with **Option A (PostgreSQL 18)**. Future-proof and latest features!

**What's your choice?** 🚀
