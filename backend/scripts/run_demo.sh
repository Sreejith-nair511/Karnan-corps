#!/bin/bash

# Demo script for Karnan Solar Verification Backend
# This script demonstrates the full pipeline:
# 1. Start services
# 2. Post sample CSV
# 3. Poll job until done
# 4. Print location of output audit folders

set -e  # Exit on any error

echo "=== Karnan Solar Verification Demo ==="

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null
then
    echo "docker-compose could not be found. Please install Docker Desktop or Docker Compose."
    exit 1
fi

# Start services
echo "Starting services with docker-compose..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to start..."
sleep 10

# Check if backend is ready
echo "Checking if backend is ready..."
until curl -s http://localhost:8000/health > /dev/null
do
    echo "Waiting for backend to be ready..."
    sleep 5
done

echo "Backend is ready!"

# Create demo data directory if it doesn't exist
mkdir -p data/examples

# Create sample CSV if it doesn't exist
if [ ! -f "data/examples/sites.csv" ]; then
    echo "Creating sample CSV..."
    cat > data/examples/sites.csv << EOF
sample_id,lat,lon,state
site_001,28.6139,77.2090,Delhi
site_002,19.0760,72.8777,Mumbai
site_003,12.9716,77.5946,Karnataka
site_004,13.0827,80.2707,Tamil Nadu
site_005,22.5726,88.3639,West Bengal
EOF
fi

# Post sample CSV
echo "Posting sample CSV..."
RESPONSE=$(curl -s -X POST "http://localhost:8000/api/v1/uploads/csv" \
    -H "accept: application/json" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@data/examples/sites.csv")

echo "Response: $RESPONSE"

# Extract job_id from response
JOB_ID=$(echo $RESPONSE | grep -o '"job_id":"[^"]*"' | cut -d'"' -f4)

if [ -z "$JOB_ID" ]; then
    echo "Failed to extract job_id from response"
    docker-compose logs backend
    exit 1
fi

echo "Job ID: $JOB_ID"

# Poll job status until done
echo "Polling job status..."
while true; do
    STATUS_RESPONSE=$(curl -s "http://localhost:8000/api/v1/jobs/$JOB_ID")
    STATUS=$(echo $STATUS_RESPONSE | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    PROGRESS=$(echo $STATUS_RESPONSE | grep -o '"progress":[0-9]*' | cut -d':' -f2)
    
    echo "Status: $STATUS, Progress: $PROGRESS%"
    
    if [ "$STATUS" = "done" ]; then
        echo "Job completed successfully!"
        break
    elif [ "$STATUS" = "failed" ]; then
        echo "Job failed!"
        docker-compose logs backend
        exit 1
    fi
    
    sleep 5
done

# Show results
echo "=== Demo Results ==="
echo "Audit folders are located in: data/outputs/"
echo "You can view the results by checking the database or the output files."

echo "Demo completed successfully!"