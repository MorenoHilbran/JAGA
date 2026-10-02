# Quick Fix: PostgreSQL GPG Key Error on Ubuntu 26.04

**Issue:** GPG key verification failed for PostgreSQL repository  
**Ubuntu Version:** 26.04.1 LTS (resolute)  
**PostgreSQL Target:** 16 (to match Windows installation)

---

## 🔧 IMMEDIATE FIX

Run these commands in your Ubuntu terminal (where you are now):

### Step 1: Fix GPG Key with Modern Method

```bash
# Download PostgreSQL GPG key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-archive-keyring.gpg

# Check if key file was created
ls -la /usr/share/keyrings/postgresql-archive-keyring.gpg
```

**Expected:** File exists (~12 KB)

---

### Step 2: Remove Old Repository Entry

```bash
# Remove the problematic repository file
sudo rm -f /etc/apt/sources.list.d/pgdg.list
```

---

### Step 3: Add Repository with Proper GPG Signature

```bash
# Add repository with signed-by directive
echo "deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt resolute-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list

# Verify the file was created
cat /etc/apt/sources.list.d/pgdg.list
```

**Expected output:**
```
deb [signed-by=/usr/share/keyrings/postgresql-archive-keyring.gpg] http://apt.postgresql.org/pub/repos/apt resolute-pgdg main
```

---

### Step 4: Update Package Lists

```bash
sudo apt update
```

**Expected:** NO GPG key errors! Should show:
```
Hit:1 http://archive.ubuntu.com/ubuntu resolute InRelease
Hit:2 http://archive.ubuntu.com/ubuntu resolute-updates InRelease
Hit:3 http://archive.ubuntu.com/ubuntu resolute-backports InRelease
Get:4 http://apt.postgresql.org/pub/repos/apt resolute-pgdg InRelease [189 kB]
Hit:5 http://security.ubuntu.com/ubuntu resolute-security InRelease
Fetched 189 kB in 1s
Reading package lists... Done
```

✅ **No errors = SUCCESS!**

---

### Step 5: Install PostgreSQL 16 Development Files

```bash
sudo apt install -y postgresql-server-dev-16
```

**Expected:** Installation completes successfully

---

### Step 6: Verify Installation

```bash
# Check pg_config
pg_config --version

# Check location
which pg_config
```

**Expected output:**
```
PostgreSQL 16.x
/usr/bin/pg_config
```

---

## ✅ SUCCESS CHECKLIST

After running all commands, verify:
- [ ] `sudo apt update` runs without GPG errors
- [ ] `postgresql-server-dev-16` installs successfully
- [ ] `pg_config --version` shows PostgreSQL 16.x
- [ ] No error messages

---

## 🚀 NEXT STEPS

Once PostgreSQL dev files are installed, continue with Apache AGE compilation:

```bash
cd ~
git clone https://github.com/apache/age.git
cd age
git checkout release/PG16/1.5.0
make PG_CONFIG=/usr/bin/pg_config
sudo make install PG_CONFIG=/usr/bin/pg_config
```

See `UBUNTU_AGE_SETUP.md` for full details.

---

**Created:** 2026-10-02  
**Issue:** GPG key verification on Ubuntu 26.04  
**Resolution:** Modern signed-by GPG key method
