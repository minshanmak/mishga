#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build frontend
echo "Building React frontend..."
cd frontend
npm install
npm run build
cd ..

# Install Python backend dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt
pip install gunicorn psycopg[binary]
