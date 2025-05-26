#!/bin/bash

# QQ-Verse Development Environment Startup Script
# This script starts both backend and frontend servers for development

echo "🚀 Starting QQ-Verse Development Environment..."

# Function to cleanup background processes
cleanup() {
     echo ""
     echo "🛑 Shutting down development servers..."
    if [[ -n "$BACKEND_PID" ]]; then
        kill "$BACKEND_PID" 2>/dev/null
        wait "$BACKEND_PID" 2>/dev/null
    fi
    if [[ -n "$FRONTEND_PID" ]]; then
        kill "$FRONTEND_PID" 2>/dev/null
        wait "$FRONTEND_PID" 2>/dev/null
    fi
     echo "✅ Development servers stopped"
     exit 0
 }

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend server
 echo "🔧 Starting backend server..."
if [[ ! -d "backend" ]]; then
    echo "❌ Backend directory not found"
    exit 1
fi
 cd backend
if ! npm run dev & then
    echo "❌ Failed to start backend server"
    exit 1
fi
 BACKEND_PID=$!
 cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
 echo "🎨 Starting frontend server..."
if [[ ! -d "frontend" ]]; then
    echo "❌ Frontend directory not found"
    cleanup
fi
 cd frontend
if ! npm run dev & then
    echo "❌ Failed to start frontend server"
    cleanup
fi
 FRONTEND_PID=$!
 cd ..

# Wait for both servers to start
sleep 2

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
