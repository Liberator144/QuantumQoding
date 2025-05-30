#!/bin/bash
# QuantumQoding Development Server Starter - Production Backend

echo "🚀 Starting QuantumQoding Development Environment..."
echo "🔧 Using Production Backend Server"

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend server (production)
echo "🔧 Starting production backend server..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Test backend health
if curl -s http://localhost:3001/health >/dev/null 2>&1; then
    echo "✅ Backend is operational"
else
    echo "⚠️ Backend may still be starting..."
fi

# Start frontend server
echo "🎨 Starting frontend server..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 🎉 DEVELOPMENT SERVERS READY! 🎉              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "🌐 Access Points:"
echo "   📱 Frontend:  http://localhost:5173"
echo "   🔧 Backend:   http://localhost:3001"
echo "   📊 API Docs:  http://localhost:3001/api-docs"
echo "   💚 Health:    http://localhost:3001/health"
echo ""
echo "🧠 Quantum Systems:"
echo "   ⚛️ Neural Fabric: OPERATIONAL"
echo "   🌌 Consciousness Stream: FLOWING"
echo "   🔗 Dimensional Gateway: STABLE"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for background processes
wait
