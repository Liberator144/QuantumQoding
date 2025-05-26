#!/bin/bash
# QQ-Verse Development Server Starter

echo "🚀 Starting QQ-Verse Development Environment..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Function to find available port
find_available_port() {
    local port=$1
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
    done
    echo $port
}

# Find available ports
BACKEND_PORT=$(find_available_port 3001)
FRONTEND_PORT=$(find_available_port 5173)

echo "🔧 Starting backend server on port $BACKEND_PORT..."
cd "$PROJECT_ROOT/backend" && BACKEND_PORT=$BACKEND_PORT npm run dev &
BACKEND_PID=$!

# Wait for backend to start and capture actual port
sleep 5

# Start frontend server with backend port configuration
echo "🎨 Starting frontend server on port $FRONTEND_PORT..."
cd "$PROJECT_ROOT/frontend" && VITE_BACKEND_PORT=$BACKEND_PORT VITE_PORT=$FRONTEND_PORT npm run dev &
FRONTEND_PID=$!

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
echo "🔧 Backend: http://localhost:$BACKEND_PORT"
echo "📊 API Docs: http://localhost:$BACKEND_PORT/api-docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
