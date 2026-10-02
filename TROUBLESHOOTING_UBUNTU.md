# Ubuntu WSL2 Apache AGE Installation Guide - TROUBLESHOOTING ADDENDUM

**Issue:** Ubuntu "resolute" (19.04) with PostgreSQL GPG key errors  
**Date:** 2026-10-02  
**User:** Renggo

---

## 🚨 CRITICAL ISSUE IDENTIFIED

Your Ubuntu installation is **Ubuntu 19.04 "resolute"** which is:
- ❌ **End of Life (EOL)** - no security updates since January 2020
- ❌ **Very old** - released in April 2019
- ❌ **Incompatible** with modern PostgreSQL repositories

**Evidence from your output:**
```
Hit:1 http://archive.ubuntu.com/ubuntu resolute InRelease
```

---

## ✅ IMMEDIATE SOLUTION: Fix GPG Key Issue

Since you're already in this Ubuntu, let's fix the PostgreSQL repository key first, then compile AGE:

### Step 1: Fix PostgreSQL GPG Key

Run these commands in your Ubuntu terminal:

```bash
# Download and add the PostgreSQL GPG key properly
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Verify key was added
sudo apt-key list | grep -A 2 "PostgreSQL"
```

**Expected output:**
```
OK
pub   rsa4096 2011-10-13 [SC]
      B97B 0AFC AA1A 47F0 44F2  44A0 7FCC 7D46 ACCC 4CF8
uid           [ unknown] PostgreSQL Debian Repository
```

### Step 2: Update package lists again

```bash
sudo apt update
```

**This time it should work without the GPG error.**

### Step 3: Try installing PostgreSQL dev files

```bash
sudo apt install -y postgresql-server-dev-16
```

**⚠️ POTENTIAL ISSUE:** Ubuntu 19.04 repositories may not have PostgreSQL 16 packages.

**If you get "Unable to locate package postgresql-server-dev-16":**

Try PostgreSQL 12 or 14 instead:
```bash
# Try PostgreSQL 14
sudo apt install -y postgresql-server-dev-14

# Or PostgreSQL 12
sudo apt install -y postgresql-server-dev-12
```

**⚠️ WARNING:** Compiling AGE with PostgreSQL 14/12 dev files may create compatibility issues with your Windows PostgreSQL 16!

---

## 🔄 BETTER SOLUTION: Upgrade to Ubuntu 24.04 LTS (RECOMMENDED)

Your Ubuntu is 5 years old and end-of-life. I **strongly recommend** upgrading:

### Option A: Upgrade existing Ubuntu (Complex)

```bash
# Not recommended - upgrading from 19.04 to 24.04 is risky
# Would need: 19.04 → 19.10 → 20.04 → 22.04 → 24.04
```

### Option B: Install fresh Ubuntu 24.04 (RECOMMENDED)

**From Windows PowerShell:**

```powershell
# Unregister old Ubuntu (optional - backs up your data first!)
wsl --unregister Ubuntu

# Or keep it and install alongside:
# List available Ubuntu versions
wsl --list --online

# Install Ubuntu 24.04 LTS
wsl --install Ubuntu-24.04

# Or install Ubuntu 22.04 LTS (also works well)
wsl --install Ubuntu-22.04
```

**This gives you:**
- ✅ Fresh, supported Ubuntu version
- ✅ All security updates
- ✅ Compatible with PostgreSQL 16 repositories
- ✅ Proper package versions for Apache AGE

---

## ⚡ QUICK DECISION GUIDE

### If you want to proceed NOW with current Ubuntu 19.04:

**Run these commands:**
```bash
# Fix GPG key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update
sudo apt update

# Try to install PostgreSQL dev files
sudo apt install -y postgresql-server-dev-14

# Check if it worked
pg_config --version
```

**Pros:** Continue immediately  
**Cons:** May have compatibility issues, unsupported OS

---

### If you want to do it RIGHT (recommended):

**Install Ubuntu 24.04 fresh (takes 10 minutes):**

**From Windows CMD/PowerShell:**
```powershell
# See what's available
wsl --list --online

# Install Ubuntu 24.04
wsl --install Ubuntu-24.04

# Wait for install, then launch
wsl -d Ubuntu-24.04
```

**Then follow the original UBUNTU_AGE_SETUP.md guide from Step 2 onwards.**

**Pros:** Clean, modern, supported, guaranteed to work  
**Cons:** 10 extra minutes for install

---

## 💡 MY STRONG RECOMMENDATION

**Install Ubuntu 24.04 LTS fresh.** Here's why:

1. **Your current Ubuntu is 5+ years old** and end-of-life
2. **Security risk** - no updates since 2020
3. **Compatibility issues** - PostgreSQL 16 may not work properly
4. **Takes only 10 minutes** extra
5. **Prevents future problems** during AGE compilation

---

## 🎯 WHAT DO YOU WANT TO DO?

**Reply with:**

**A)** Continue with Ubuntu 19.04 (I'll help you work around the issues)

**B)** Install fresh Ubuntu 24.04 LTS (recommended - takes 10 min)

**C)** Skip AGE entirely for now, work on other backend tasks

---

**Current situation:**
- ⏸️ Stuck at PostgreSQL repository GPG key error
- ⚠️ Running Ubuntu 19.04 (EOL, unsupported)
- ⏰ Time: 12:37 PM

**What's your choice?** 🚀
