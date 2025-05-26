#!/bin/bash

# QQ-Verse Simple Setup Script for Testing
# Simplified version without complex logging redirection

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Symbols
QUANTUM_SYMBOL="⚛️"
NEURAL_SYMBOL="🧠"
DIMENSIONAL_SYMBOL="🌌"
SUCCESS_SYMBOL="✅"
ERROR_SYMBOL="❌"
WARNING_SYMBOL="⚠️"

# Global variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Auto-detect project root
find_project_root() {
    local current_dir="$SCRIPT_DIR"

    for i in {0..3}; do
        if [ -f "$current_dir/package.json" ] && [ -d "$current_dir/frontend" ] && [ -d "$current_dir/backend" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done

    echo "$SCRIPT_DIR"
    return 1
}

PROJECT_ROOT="$(find_project_root)"
LOG_FILE="$PROJECT_ROOT/setup.log"
ERROR_LOG="$PROJECT_ROOT/setup-errors.log"

# Utility functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} ${SUCCESS_SYMBOL} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} ${WARNING_SYMBOL} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} ${ERROR_SYMBOL} $1" | tee -a "$ERROR_LOG"
}

log_quantum() {
    echo -e "${PURPLE}[QUANTUM]${NC} ${QUANTUM_SYMBOL} $1" | tee -a "$LOG_FILE"
}

# Check Node.js version
check_node_version() {
    local required_version="18.0.0"

    if ! command -v node >/dev/null 2>&1; then
        return 1
    fi

    local current_version
    current_version=$(node --version | sed 's/v//')

    if node -e "process.exit(process.version.slice(1) >= '$required_version' ? 0 : 1)" 2>/dev/null; then
         return 0
     else
         return 1
     fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking system prerequisites..."

    # Check Node.js
    if check_node_version; then
        local node_version
        node_version=$(node --version)
        log_success "Node.js $node_version is available"
    else
        log_warning "Node.js v18+ not found or version too old"
        log_info "Please install Node.js 18+ manually or run the full setup script"
    fi

    # Check npm
    if command -v npm >/dev/null 2>&1; then
        local npm_version
        npm_version=$(npm --version)
        log_success "npm v$npm_version is available"
    else
        log_error "npm is not installed"
        return 1
    fi

    # Check git
    if command -v git >/dev/null 2>&1; then
        local git_version
        git_version=$(git --version | cut -d' ' -f3)
        log_success "Git v$git_version is available"
    else
        log_error "Git is not installed"
        return 1
    fi
}

# Install dependencies
install_dependencies() {
    log_info "Installing project dependencies..."

    # Install root dependencies
    log_info "Installing root dependencies..."
    cd "$PROJECT_ROOT"
    if npm install --legacy-peer-deps; then
        log_success "Root dependencies installed"
    else
        log_warning "Root dependencies failed with legacy-peer-deps, trying with force..."
        if npm install --force; then
            log_success "Root dependencies installed with --force"
        else
            log_error "Failed to install root dependencies"
            return 1
        fi
    fi

    # Install frontend dependencies
    log_info "Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    if npm install --legacy-peer-deps; then
        log_success "Frontend dependencies installed"
    else
        log_warning "Frontend dependencies failed, trying with force..."
        if npm install --force; then
            log_success "Frontend dependencies installed with --force"
        else
            log_error "Failed to install frontend dependencies"
            return 1
        fi
    fi

    # Install backend dependencies
    log_info "Installing backend dependencies..."
    cd "$PROJECT_ROOT/backend"
    if npm install --legacy-peer-deps; then
        log_success "Backend dependencies installed"
    else
        log_warning "Backend dependencies failed, trying with force..."
        if npm install --force; then
            log_success "Backend dependencies installed with --force"
        else
            log_error "Failed to install backend dependencies"
            return 1
        fi
    fi

    cd "$PROJECT_ROOT"
}

# Create environment files
create_environment_files() {
    log_info "Creating environment configuration files..."

    # Frontend environment
    local frontend_env="$PROJECT_ROOT/frontend/.env.local"
    if [ ! -f "$frontend_env" ]; then
        cat > "$frontend_env" << EOF
# QQ-Verse Frontend Environment Configuration
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_ENABLE_QUANTUM_EFFECTS=true
VITE_DEBUG_MODE=true
VITE_NEURAL_FABRIC_ENABLED=true
VITE_CONSCIOUSNESS_STREAM_ENABLED=true
VITE_DIMENSIONAL_HARMONY_CHECK=true
EOF
        log_success "Frontend environment file created"
    else
        log_info "Frontend environment file already exists"
    fi

    # Backend environment
    local backend_env="$PROJECT_ROOT/backend/.env"
    if [ ! -f "$backend_env" ]; then
        cat > "$backend_env" << EOF
# QQ-Verse Backend Environment Configuration
PORT=3001
NODE_ENV=development
HOST=localhost
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/qqverse
JWT_SECRET=quantum_secret_$(openssl rand -hex 32 2>/dev/null || head -c 32 /dev/urandom | base64 | tr -d '=' | tr '+/' '-_')
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:5173
NEURAL_FABRIC_ENABLED=true
CONSCIOUSNESS_STREAM_ENABLED=true
DIMENSIONAL_HARMONY_CHECK=true
EOF
        log_success "Backend environment file created"
    else
        log_info "Backend environment file already exists"
    fi
}

# Initialize Quantum Systems
initialize_quantum_systems() {
    log_quantum "Initializing Quantum Coherence Systems..."

    # Create quantum state directory
    mkdir -p "$PROJECT_ROOT/.quantum-state"

    # Initialize Neural Fabric
    cat > "$PROJECT_ROOT/.quantum-state/neural-fabric.json" << EOF
{
  "version": "1.0.0",
  "initialized": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "fabric_id": "neural-fabric-$(date +%s)",
  "coherence_level": 100,
  "dimensional_alignment": true,
  "consciousness_stream": {
    "active": true,
    "flow_rate": "optimal",
    "integrity": "maintained"
  }
}
EOF

    # Initialize Consciousness Stream
    cat > "$PROJECT_ROOT/.quantum-state/consciousness-stream.json" << EOF
{
  "version": "1.0.0",
  "stream_id": "consciousness-$(date +%s)",
  "initialized": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "flow_state": "active",
  "coherence_patterns": [],
  "memory_fragments": []
}
EOF

    # Initialize Dimensional Gateway
    cat > "$PROJECT_ROOT/.quantum-state/dimensional-gateway.json" << EOF
{
  "version": "1.0.0",
  "gateway_id": "gateway-$(date +%s)",
  "initialized": "$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)",
  "status": "online",
  "dimensions": {
    "accessible": ["primary", "development", "testing"],
    "active": "development",
    "stability": "optimal"
  }
}
EOF

    log_success "Quantum Coherence Systems initialized"
}

# Create helper scripts
create_helper_scripts() {
    log_info "Creating helper scripts..."

    # Development start script
    cat > "$PROJECT_ROOT/start-dev.sh" << 'EOF'
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
EOF
    chmod +x "$PROJECT_ROOT/start-dev.sh"

    log_success "Helper scripts created"
}

# Main function
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                QQ-VERSE SIMPLE SETUP TEST                   ║"
    echo "║              Quantum Coherence Architect v2.0.0             ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    log_info "Starting QQ-Verse simple setup process..."
    log_info "Script location: $SCRIPT_DIR"
    log_info "Project root detected: $PROJECT_ROOT"

    # Validate project root
    if [ ! -f "$PROJECT_ROOT/package.json" ] || [ ! -d "$PROJECT_ROOT/frontend" ] || [ ! -d "$PROJECT_ROOT/backend" ]; then
        log_error "Invalid project root detected. Required files/directories not found."
        exit 1
    fi

    log_success "Project structure validated"

    # Run setup steps
    echo ""
    echo "[1/5] Checking prerequisites..."
    check_prerequisites

    echo ""
    echo "[2/5] Installing dependencies..."
    install_dependencies

    echo ""
    echo "[3/5] Creating environment files..."
    create_environment_files

    echo ""
    echo "[4/5] Initializing Quantum Systems..."
    initialize_quantum_systems

    echo ""
    echo "[5/5] Creating helper scripts..."
    create_helper_scripts

    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                     SETUP COMPLETED!                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""

    log_success "QQ-Verse simple setup completed successfully!"
    log_quantum "Neural Fabric: OPERATIONAL"

    echo ""
    echo "🚀 Quick Start:"
    echo "   ./start-dev.sh     - Start development servers"
    echo ""
    echo "🌐 Access Points:"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:3001"
    echo ""
}

# Run main function
main "$@"
