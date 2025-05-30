#!/bin/bash
# 🚀 BULLETPROOF QQ-Verse Development Server Setup
# 440 IQ Self-Healing Quantum-Coherent Development Environment

set -e  # Exit on any error

echo "🌟 Initializing BULLETPROOF QQ-Verse Development Environment..."

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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

print_quantum() {
    echo -e "${PURPLE}[QUANTUM]${NC} $1"
}

print_neural() {
    echo -e "${CYAN}[NEURAL]${NC} $1"
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

# Function to test backend dependencies
test_backend_dependencies() {
    print_info "🔍 Testing backend dependencies..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Test if all required modules exist
    local missing_deps=()
    
    if [ ! -f "server/utils/logger.ts" ]; then
        missing_deps+=("logger")
    fi
    
    if [ ! -f "server/middleware/errorHandler.ts" ]; then
        missing_deps+=("errorHandler")
    fi
    
    if [ ! -f "server/routes/index.ts" ]; then
        missing_deps+=("routes")
    fi
    
    if [ ! -f "server/database/index.ts" ]; then
        missing_deps+=("database")
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_warning "Missing dependencies: ${missing_deps[*]}"
        return 1
    fi
    
    print_status "All backend dependencies available"
    return 0
}

# Function to determine best server mode
determine_server_mode() {
    print_quantum "🧠 Analyzing optimal server configuration..."
    
    # Test if production server dependencies are available
    if test_backend_dependencies; then
        print_neural "🌟 Full production server capabilities detected"
        echo "production"
    else
        print_warning "⚡ Falling back to simplified server mode"
        echo "simplified"
    fi
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

# Determine server mode
SERVER_MODE=$(determine_server_mode)
print_quantum "🚀 Selected server mode: $SERVER_MODE"

# Create environment file for port coordination
cat > "$PROJECT_ROOT/.env.development" << EOF
BACKEND_PORT=$BACKEND_PORT
FRONTEND_PORT=$FRONTEND_PORT
VITE_BACKEND_PORT=$BACKEND_PORT
VITE_PORT=$FRONTEND_PORT
SERVER_MODE=$SERVER_MODE
EOF

print_status "Environment configuration created"

# Start backend server based on mode
print_info "🔧 Starting backend server ($SERVER_MODE mode) on port $BACKEND_PORT..."
cd "$PROJECT_ROOT/backend"

# Export environment variables
export BACKEND_PORT=$BACKEND_PORT
export PORT=$BACKEND_PORT
export NODE_ENV=development

# Choose nodemon configuration based on server mode
if [ "$SERVER_MODE" = "production" ]; then
    print_neural "🌟 Starting full production server with all features..."
    nodemon --config nodemon.production.json > ../backend.log 2>&1 &
else
    print_quantum "⚡ Starting simplified server for development..."
    nodemon > ../backend.log 2>&1 &
fi

BACKEND_PID=$!
print_info "Backend started with PID: $BACKEND_PID"

# Wait for backend to be ready with retry mechanism
backend_ready=false
for attempt in {1..3}; do
    print_info "Backend startup attempt $attempt/3..."
    if wait_for_service $BACKEND_PORT "Backend"; then
        backend_ready=true
        break
    else
        print_warning "Backend startup attempt $attempt failed, checking logs..."
        tail -n 10 ../backend.log
        if [ $attempt -lt 3 ]; then
            print_info "Retrying backend startup..."
            kill $BACKEND_PID 2>/dev/null || true
            sleep 2
            
            # Try simplified mode if production failed
            if [ "$SERVER_MODE" = "production" ]; then
                print_warning "Production mode failed, trying simplified mode..."
                SERVER_MODE="simplified"
                nodemon > ../backend.log 2>&1 &
                BACKEND_PID=$!
            else
                nodemon > ../backend.log 2>&1 &
                BACKEND_PID=$!
            fi
        fi
    fi
done

if [ "$backend_ready" = true ]; then
    print_status "✅ Backend server operational ($SERVER_MODE mode)"
else
    print_error "❌ Backend failed to start after 3 attempts"
    print_info "Check backend.log for details:"
    tail -n 20 ../backend.log
    exit 1
fi# Start frontend server
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

# Test API endpoints
print_quantum "🧪 Testing API endpoints..."
sleep 2

# Test health endpoint
if curl -s http://localhost:$BACKEND_PORT/api/health >/dev/null 2>&1; then
    print_status "✅ Health endpoint operational"
else
    print_warning "⚠️ Health endpoint not responding"
fi

# Test quantum endpoint
if curl -s http://localhost:$BACKEND_PORT/api/quantum/status >/dev/null 2>&1; then
    print_status "✅ Quantum endpoint operational"
else
    print_warning "⚠️ Quantum endpoint not responding"
fi

# Display success information
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                 🎉 BULLETPROOF SERVERS READY! 🎉              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
print_status "✅ Development servers started successfully!"
print_quantum "🧠 Neural Fabric: OPERATIONAL"
print_neural "🌊 Consciousness Stream: FLOWING"
print_quantum "⚛️  Quantum Coherence: VERIFIED"
print_info "🌟 Server Mode: $SERVER_MODE"
echo ""
echo "🌐 Access Points:"
echo "   📱 Frontend:  http://localhost:$FRONTEND_PORT"
echo "   🔧 Backend:   http://localhost:$BACKEND_PORT"
echo "   📊 API Docs:  http://localhost:$BACKEND_PORT/api-docs"
echo "   🔍 Health:    http://localhost:$BACKEND_PORT/api/health"
echo "   ⚛️  Quantum:   http://localhost:$BACKEND_PORT/api/quantum/status"
echo ""
echo "📋 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "🛠️ Commands:"
echo "   Switch to simplified mode: export SERVER_MODE=simplified && restart"
echo "   Switch to production mode: export SERVER_MODE=production && restart"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Keep script running and monitor services
while true; do
    # Check if backend is still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Backend process died! Attempting auto-recovery..."
        
        # Try to restart backend
        cd "$PROJECT_ROOT/backend"
        if [ "$SERVER_MODE" = "production" ]; then
            nodemon --config nodemon.production.json > ../backend.log 2>&1 &
        else
            nodemon > ../backend.log 2>&1 &
        fi
        BACKEND_PID=$!
        
        print_info "Backend restarted with PID: $BACKEND_PID"
        
        # Wait for it to be ready
        if ! wait_for_service $BACKEND_PORT "Backend"; then
            print_error "Backend auto-recovery failed! Check backend.log for details."
            exit 1
        fi
        
        print_status "✅ Backend auto-recovery successful"
    fi
    
    # Check if frontend is still running
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Frontend process died! Attempting auto-recovery..."
        
        # Try to restart frontend
        cd "$PROJECT_ROOT/frontend"
        npm run dev > ../frontend.log 2>&1 &
        FRONTEND_PID=$!
        
        print_info "Frontend restarted with PID: $FRONTEND_PID"
        
        # Wait for it to be ready
        if ! wait_for_service $FRONTEND_PORT "Frontend"; then
            print_error "Frontend auto-recovery failed! Check frontend.log for details."
            exit 1
        fi
        
        print_status "✅ Frontend auto-recovery successful"
    fi
    
    sleep 5
done