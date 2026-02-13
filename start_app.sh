#!/bin/bash
# Startup script for Portfolio Tracker

# 1. Set up PATH for local Node.js
export PATH=/usr/local/google/home/arnavgupta/.gemini/jetski/scratch/tools/node/bin:$PATH

echo "Starting Portfolio Tracker..."

# 2. Start Backend
echo "Starting Backend on port 5001..."
cd server
node server.js &
SERVER_PID=$!
cd ..

# 3. Start Frontend
echo "Starting Frontend..."
cd client
npm run dev &
CLIENT_PID=$!
cd ..

echo "App is running!"
echo "Backend: http://localhost:5001"
echo "Frontend: http://localhost:5173"
echo "Press Ctrl+C to stop."

# Wait for process and cleanup on exit
trap "kill $SERVER_PID $CLIENT_PID; exit" SIGINT SIGTERM
wait
