#!/bin/bash
export PATH=/usr/local/google/home/arnavgupta/.gemini/jetski/scratch/tools/node/bin:$PATH

# Start server
echo "Starting server..."
node server/server.js > server.log 2>&1 &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 2

# Test 1: Add Investment (Initial)
echo "Test 1: Adding Initial Investment..."
curl -s -X POST http://localhost:5001/api/investments \
  -H "Content-Type: application/json" \
  -d '{"asset_type": "Mutual Funds", "amount": 10000, "date": "2023-01-01"}' | tee test_output.txt
echo ""

# Test 2: Add Investment (Latest)
echo "Test 2: Adding Latest Investment..."
curl -s -X POST http://localhost:5001/api/investments \
  -H "Content-Type: application/json" \
  -d '{"asset_type": "Mutual Funds", "amount": 12000, "date": "2024-01-01"}' | tee -a test_output.txt
echo ""

# Test 3: Get Investments
echo "Test 3: Fetching Investments..."
curl -s http://localhost:5001/api/investments | tee -a test_output.txt
echo ""

# Test 4: Get Metrics
echo "Test 4: Fetching Metrics..."
curl -s http://localhost:5001/api/metrics | tee -a test_output.txt
echo ""

# Kill server
kill $SERVER_PID
echo "Server stopped."

# Check logs
echo "Server Logs:"
cat server.log
