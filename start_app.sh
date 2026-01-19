#!/bin/bash

# HackITAll Start Script
# Starts Database (Docker), Backend (Spring Boot), and Frontend (Vite)

# Get the absolute path to the project root
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to handle script termination
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Killing Backend (PID $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONT_PID" ]; then
        echo "Killing Frontend (PID $FRONT_PID)..."
        kill $FRONT_PID 2>/dev/null
    fi

    if [ ! -z "$CLIPPY_PID" ]; then
        echo "Killing Clippy (PID $CLIPPY_PID)..."
        kill $CLIPPY_PID 2>/dev/null
    fi
    
    echo "👋 Shutdown complete."
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo "🚀 Starting HackITAll Application Stack..."

# 1. Start Database
echo "============================================"
echo "📦 Step 1: Starting Database (Docker)"
echo "============================================"
cd "$PROJECT_ROOT/springbackend-main-master"

# Try 'docker compose' first (modern), fall back to 'docker-compose'
if docker compose up -d 2>/dev/null; then
    echo "✓ Database started with 'docker compose'"
elif docker-compose up -d 2>/dev/null; then
    echo "✓ Database started with 'docker-compose'"
else
    echo "❌ Failed to start database. Please ensure Docker is running."
    exit 1
fi

echo ""

# 2. Start Backend
echo "============================================"
echo "☕ Step 2: Starting Backend (Spring Boot)"
echo "============================================"
echo "Logs will appear below. Starting in background..."

./mvnw spring-boot:run > "$PROJECT_ROOT/backend.log" 2>&1 &
BACKEND_PID=$!
echo "✓ Backend started with PID $BACKEND_PID"
echo "  (Output responding to file $PROJECT_ROOT/backend.log)"

echo ""

# 3. Start Frontend
echo "============================================"
echo "⚛️ Step 3: Starting Frontend (Vite)"
echo "============================================"
cd "$PROJECT_ROOT/front"

npm run dev &
FRONT_PID=$!
echo "✓ Frontend started with PID $FRONT_PID"

echo ""

# 4. Start AI Service
echo "============================================"
echo "📎 Step 4: Starting Clippy AI Service"
echo "============================================"
python3 "$PROJECT_ROOT/clippy_server.py" > "$PROJECT_ROOT/clippy.log" 2>&1 &
CLIPPY_PID=$!
echo "✓ Clippy Server started with PID $CLIPPY_PID"

echo ""
echo "============================================"
echo "🎉 App is running!"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:8090"
echo "   - AI:       http://localhost:18000"
echo "   - Logs:     $PROJECT_ROOT/backend.log"
echo "   - Press CTRL+C to stop everything"
echo "============================================"

# Wait for user input to keep script running
wait
