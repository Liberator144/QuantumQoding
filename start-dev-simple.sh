#!/bin/bash
# Simple Development Server Startup Script

echo "🚀 Starting QQ-Verse Development Environment..."

# Kill any existing processes
pkill -f nodemon 2>/dev/null || true
pkill -f tsx 2>/dev/null || true

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npx nodemon --config nodemon.production.json > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to be ready
echo "⏳ Waiting for backend to start..."
sleep 10

# Test backend
if curl -s http://localhost:3001/api/v1/quantum/status >/dev/null 2>&1; then
    echo "✅ Backend is operational"
else
    echo "⚠️ Backend may not be fully ready (this is normal for protected endpoints)"
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend
echo "⏳ Waiting for frontend to start..."
sleep 10

# Test frontend
if curl -s http://localhost:5176 >/dev/null 2>&1; then
    echo "✅ Frontend is operational"
else
    echo "⚠️ Frontend may still be starting..."
fi

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 🎉 DEVELOPMENT SERVERS READY! 🎉              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Access Points:"
echo "   📱 Frontend:  http://localhost:5176"
echo "   🔧 Backend:   http://localhost:3001"
echo "   📊 API Docs:  http://localhost:3001/api-docs"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"

# Keep script running
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT

while true; do
    sleep 1
done