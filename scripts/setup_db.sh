#!/bin/bash

# JAGA Database Setup Script
# Sets up PostgreSQL database and Apache AGE for local development

set -e  # Exit on error

echo "=================================="
echo "JAGA Database Setup"
echo "=================================="

# Configuration (edit these as needed)
DB_NAME="jkn_riskgraph"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo ""
echo "Configuration:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST:$DB_PORT"
echo ""

# Check if PostgreSQL is running
echo "1. Checking PostgreSQL status..."
if command -v systemctl &> /dev/null; then
    sudo systemctl status postgresql | grep "active (running)" > /dev/null
    if [ $? -eq 0 ]; then
        echo "   ✓ PostgreSQL is running"
    else
        echo "   ✗ PostgreSQL is not running"
        echo "   Starting PostgreSQL..."
        sudo systemctl start postgresql
    fi
elif command -v pg_isready &> /dev/null; then
    pg_isready -h $DB_HOST -p $DB_PORT
    if [ $? -eq 0 ]; then
        echo "   ✓ PostgreSQL is running"
    else
        echo "   ✗ PostgreSQL is not responding"
        exit 1
    fi
else
    echo "   ? Cannot check PostgreSQL status"
fi

# Create database if it doesn't exist
echo ""
echo "2. Creating database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"
echo "   ✓ Database '$DB_NAME' ready"

# Check Apache AGE extension
echo ""
echo "3. Checking Apache AGE extension..."
AGE_INSTALLED=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM pg_available_extensions WHERE name='age'")

if [ "$AGE_INSTALLED" -eq "0" ]; then
    echo "   ✗ Apache AGE extension not available"
    echo ""
    echo "   Please install Apache AGE manually:"
    echo "   1. Install build dependencies:"
    echo "      sudo apt-get install postgresql-server-dev-16 build-essential"
    echo ""
    echo "   2. Clone and build AGE:"
    echo "      git clone https://github.com/apache/age.git"
    echo "      cd age"
    echo "      make install"
    echo ""
    echo "   3. Re-run this script"
    exit 1
else
    echo "   ✓ Apache AGE extension is available"
fi

# Install AGE extension in database
echo ""
echo "4. Installing AGE extension in database..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS age;" 2>/dev/null || true
echo "   ✓ AGE extension installed"

# Initialize Python environment and run init script
echo ""
echo "5. Running Python initialization script..."
if [ -d "../backend/venv" ]; then
    source ../backend/venv/bin/activate
    python ../database/init_db.py
else
    echo "   ✗ Python virtual environment not found"
    echo "   Please set up backend first:"
    echo "     cd backend"
    echo "     python -m venv venv"
    echo "     source venv/bin/activate"
    echo "     pip install -r requirements.txt"
    exit 1
fi

echo ""
echo "=================================="
echo "✓ Database setup completed!"
echo "=================================="
echo ""
echo "Connection string:"
echo "  postgresql://$DB_USER:PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "Next steps:"
echo "  1. Copy .env.example to .env and configure database credentials"
echo "  2. Generate synthetic data: python scripts/generate_synthetic_data.py"
echo "  3. Start backend: cd backend && uvicorn src.main:app --reload"
