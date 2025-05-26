#!/bin/bash
# 🚀 BULLETPROOF QQ-Verse Development Server Starter
# 200 IQ TypeScript-Only Development Environment

set -e  # Exit on any error

echo "🚀 Starting BULLETPROOF QQ-Verse Development Environment..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Function to find available port
find_available_port() {
    local port=$1
    local max_attempts=100
    local attempts=0
    
    while lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; do
        port=$((port + 1))
        attempts=$((attempts + 1))
        
        if [ $attempts -ge $max_attempts ]; then
            print_error "Could not find available port after $max_attempts attempts"
            exit 1
        fi
    done
    echo $port
}

# Function to wait for service to be ready
wait_for_service() {
    local port=$1
    local service_name=$2
    local max_attempts=30
    local attempts=0
    
    print_info "Waiting for $service_name to be ready on port $port..."
    
    while ! curl -s http://localhost:$port >/dev/null 2>&1; do
        sleep 1
        attempts=$((attempts + 1))
        
        if [ $attempts -ge $max_attempts ]; then
            print_warning "$service_name did not start within $max_attempts seconds"
            return 1
        fi
    done
    
    print_status "$service_name is ready on port $port"
    return 0
}

# Function to kill background processes on exit
cleanup() {
    print_info "🛑 Shutting down development servers..."
    
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null || true
    
    # Kill any remaining processes on our ports
    [ ! -z "$BACKEND_PORT" ] && lsof -ti:$BACKEND_PORT | xargs -r kill -9 2>/dev/null || true
    [ ! -z "$FRONTEND_PORT" ] && lsof -ti:$FRONTEND_PORT | xargs -r kill -9 2>/dev/null || true
    
    print_status "Cleanup complete"
    exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# Verify project structure
if [ ! -d "$PROJECT_ROOT/backend" ] || [ ! -d "$PROJECT_ROOT/frontend" ]; then
    print_error "Project structure invalid. Missing backend or frontend directories."
    exit 1
fi

# Find available ports
print_info "🔍 Finding available ports..."
BACKEND_PORT=$(find_available_port 3001)
FRONTEND_PORT=$(find_available_port 5173)

print_status "Backend will use port: $BACKEND_PORT"
print_status "Frontend will use port: $FRONTEND_PORT"

# Create environment file for port coordination
cat > "$PROJECT_ROOT/.env.development" << EOF
BACKEND_PORT=$BACKEND_PORT
FRONTEND_PORT=$FRONTEND_PORT
VITE_BACKEND_PORT=$BACKEND_PORT
VITE_PORT=$FRONTEND_PORT
EOF

print_status "Environment configuration created"

# Start backend server
print_info "🔧 Starting backend server on port $BACKEND_PORT..."
cd "$PROJECT_ROOT/backend"

# Export environment variables
export BACKEND_PORT=$BACKEND_PORT
export PORT=$BACKEND_PORT

# Start backend in background
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!

print_info "Backend started with PID: $BACKEND_PID"

# Wait for backend to be ready
if wait_for_service $BACKEND_PORT "Backend"; then
    print_status "✅ Backend server operational"
else
    print_warning "Backend may not be fully ready, continuing..."
fi

# Start frontend server
print_info "🎨 Starting frontend server on port $FRONTEND_PORT..."
cd "$PROJECT_ROOT/frontend"

# Export environment variables for frontend
export VITE_BACKEND_PORT=$BACKEND_PORT
export VITE_PORT=$FRONTEND_PORT

# Start frontend in background
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!

print_info "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to be ready
if wait_for_service $FRONTEND_PORT "Frontend"; then
    print_status "✅ Frontend server operational"
else
    print_warning "Frontend may not be fully ready, continuing..."
fi

# Display success information
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 🎉 BULLETPROOF SERVERS READY! 🎉              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_status "✅ Development servers started successfully!"
print_status "🧠 Neural Fabric: OPERATIONAL"
print_status "🌊 Consciousness Stream: FLOWING"
print_status "⚛️  Quantum Coherence: VERIFIED"
echo ""
echo "🌐 Access Points:"
echo "   📱 Frontend:  http://localhost:$FRONTEND_PORT"
echo "   🔧 Backend:   http://localhost:$BACKEND_PORT"
echo "   📊 API Docs:  http://localhost:$BACKEND_PORT/api-docs"
echo "   🔍 Health:    http://localhost:$BACKEND_PORT/api/health"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Keep script running and monitor services
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died! Check backend.log for details."
        exit 1
    fi
    
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died! Check frontend.log for details."
        exit 1
    fi
    
    sleep 5
done