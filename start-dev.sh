#!/bin/bash
echo "🚀 Starting QQ-Verse Development Environment..."

cleanup() {
     echo "🛑 Shutting down development servers..."
    pkill -P $$ 2>/dev/null || true
     exit 0
 }

trap cleanup SIGINT SIGTERM

echo "🔧 Starting backend server..."
cd backend && npm run dev &

sleep 3

echo "🎨 Starting frontend server..."
cd ../frontend && npm run dev &

echo "✅ Development servers started!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop all servers"

wait
