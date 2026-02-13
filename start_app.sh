#!/bin/bash
echo "Starting Portfolio Tracker with Podman..."

# Ensure podman-compose is installed
if ! command -v podman-compose &> /dev/null; then
    echo "podman-compose not found. Installing..."
    sudo apt-get install -y podman-compose
fi

# Build and start
echo "Building and starting containers..."
podman-compose up --build -d

echo ""
echo "Application started!"
echo "Frontend: http://localhost:8080"
echo "Backend:  http://localhost:5001"
