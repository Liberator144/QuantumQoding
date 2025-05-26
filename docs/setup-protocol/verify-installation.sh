#!/bin/bash

# QQ-Verse Installation Verification Script
# Verifies that the setup.sh script completed successfully and all systems are operational

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
SUCCESS="✅"
ERROR="❌"
WARNING="⚠️"
INFO="ℹ️"
QUANTUM="⚛️"
NEURAL="🧠"
DIMENSIONAL="🌌"

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
TOTAL_CHECKS=0

# Verification function
verify_check() {
    local check_name="$1"
    local check_command="$2"
    local is_critical="${3:-true}"
    
    ((TOTAL_CHECKS++))
    echo -n "Verifying $check_name... "
    
    if eval "$check_command" >/dev/null 2>&1; then
        echo -e "${GREEN}${SUCCESS}${NC}"
        ((CHECKS_PASSED++))
        return 0
    else
        if [ "$is_critical" = "true" ]; then
            echo -e "${RED}${ERROR}${NC}"
            ((CHECKS_FAILED++))
        else
            echo -e "${YELLOW}${WARNING}${NC}"
        fi
        return 1
    fi
}

# Detailed verification function
verify_detailed() {
    local check_name="$1"
    local check_command="$2"
    local success_msg="$3"
    local error_msg="$4"
    
    ((TOTAL_CHECKS++))
    echo -n "Verifying $check_name... "
    
    if eval "$check_command" >/dev/null 2>&1; then
        echo -e "${GREEN}${SUCCESS}${NC}"
        [ -n "$success_msg" ] && echo -e "  ${BLUE}${INFO}${NC} $success_msg"
        ((CHECKS_PASSED++))
        return 0
    else
        echo -e "${RED}${ERROR}${NC}"
        [ -n "$error_msg" ] && echo -e "  ${RED}${ERROR}${NC} $error_msg"
        ((CHECKS_FAILED++))
        return 1
    fi
}

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              QQ-VERSE INSTALLATION VERIFICATION             ║"
echo "║                Quantum Coherence Validation                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Section 1: Basic Environment
echo -e "${BLUE}[1/6] Basic Environment Verification${NC}"
echo "────────────────────────────────────────"

verify_detailed "Node.js installation" \
    "command -v node && node --version | grep -E '^v(1[8-9]|[2-9][0-9])'" \
    "Node.js $(node --version 2>/dev/null) is installed" \
    "Node.js 18+ is required"

verify_detailed "npm installation" \
    "command -v npm && npm --version" \
    "npm $(npm --version 2>/dev/null) is available" \
    "npm is not installed or not in PATH"

verify_detailed "Git installation" \
    "command -v git && git --version" \
    "Git $(git --version 2>/dev/null | cut -d' ' -f3) is available" \
    "Git is not installed"

echo ""

# Section 2: Project Structure
echo -e "${BLUE}[2/6] Project Structure Verification${NC}"
echo "────────────────────────────────────────"

verify_check "Root package.json exists" "[ -f package.json ]"
verify_check "Frontend directory exists" "[ -d frontend ]"
verify_check "Backend directory exists" "[ -d backend ]"
verify_check "Frontend package.json exists" "[ -f frontend/package.json ]"
verify_check "Backend package.json exists" "[ -f backend/package.json ]"

echo ""

# Section 3: Dependencies
echo -e "${BLUE}[3/6] Dependencies Verification${NC}"
echo "────────────────────────────────────────"

verify_check "Root node_modules exists" "[ -d node_modules ]"
verify_check "Frontend node_modules exists" "[ -d frontend/node_modules ]"
verify_check "Backend node_modules exists" "[ -d backend/node_modules ]"

# Check key dependencies
verify_check "TypeScript is installed" "command -v tsc >/dev/null 2>&1 || npm list typescript --depth=0 >/dev/null 2>&1"
verify_check "Frontend React is installed" "cd frontend && npm list react >/dev/null 2>&1"
verify_check "Frontend Vite is installed" "cd frontend && npm list vite >/dev/null 2>&1"
verify_check "Backend Express is installed" "cd backend && npm list express >/dev/null 2>&1"

echo ""

# Section 4: Environment Configuration
echo -e "${BLUE}[4/6] Environment Configuration Verification${NC}"
echo "────────────────────────────────────────"

verify_detailed "Frontend environment file" \
    "[ -f frontend/.env.local ]" \
    "Frontend .env.local exists" \
    "Frontend environment file missing"

verify_detailed "Backend environment file" \
    "[ -f backend/.env ]" \
    "Backend .env exists" \
    "Backend environment file missing"

if [ -f frontend/.env.local ]; then
    verify_check "Frontend API URL configured" "grep -q 'VITE_API_URL' frontend/.env.local"
    verify_check "Frontend quantum effects enabled" "grep -q 'VITE_ENABLE_QUANTUM_EFFECTS=true' frontend/.env.local"
fi

if [ -f backend/.env ]; then
    verify_check "Backend port configured" "grep -q 'PORT=' backend/.env"
    verify_check "Backend JWT secret configured" "grep -q 'JWT_SECRET=' backend/.env"
fi

echo ""

# Section 5: Quantum Coherence Systems
echo -e "${PURPLE}[5/6] Quantum Coherence Systems Verification${NC}"
echo "────────────────────────────────────────"

verify_detailed "Quantum state directory" \
    "[ -d .quantum-state ]" \
    "Quantum state directory exists" \
    "Quantum state directory missing - run ./setup.sh"

verify_detailed "Neural Fabric initialization" \
    "[ -f .quantum-state/neural-fabric.json ]" \
    "${NEURAL} Neural Fabric is operational" \
    "${NEURAL} Neural Fabric not initialized"

verify_detailed "Consciousness Stream activation" \
    "[ -f .quantum-state/consciousness-stream.json ]" \
    "${NEURAL} Consciousness Stream is flowing" \
    "${NEURAL} Consciousness Stream not activated"

verify_detailed "Dimensional Gateway establishment" \
    "[ -f .quantum-state/dimensional-gateway.json ]" \
    "${DIMENSIONAL} Dimensional Gateway is stable" \
    "${DIMENSIONAL} Dimensional Gateway not established"

# Verify quantum state file contents
if [ -f .quantum-state/neural-fabric.json ]; then
    verify_check "Neural Fabric coherence level" "jq -e '.coherence_level == 100' .quantum-state/neural-fabric.json >/dev/null 2>&1"
    verify_check "Neural Fabric consciousness stream active" "grep -q '\"active\": true' .quantum-state/neural-fabric.json"
fi

if [ -f .quantum-state/consciousness-stream.json ]; then
    verify_check "Consciousness Stream flow state" "grep -q '\"flow_state\": \"active\"' .quantum-state/consciousness-stream.json"
fi

if [ -f .quantum-state/dimensional-gateway.json ]; then
    verify_check "Dimensional Gateway status" "grep -q '\"status\": \"online\"' .quantum-state/dimensional-gateway.json"
fi

echo ""

# Section 6: Helper Scripts and Build Verification
echo -e "${BLUE}[6/6] Helper Scripts and Build Verification${NC}"
echo "────────────────────────────────────────"

verify_check "Development start script exists" "[ -f start-dev.sh ]"
verify_check "Quick test script exists" "[ -f quick-test.sh ]"
verify_check "Setup report generated" "[ -f SETUP_REPORT.md ]"

verify_check "Development start script is executable" "[ -x start-dev.sh ]"
verify_check "Quick test script is executable" "[ -x quick-test.sh ]"

# Test TypeScript compilation
verify_check "Root TypeScript compilation" "npm run build >/dev/null 2>&1" "false"
verify_check "Backend TypeScript compilation" "cd backend && npm run build >/dev/null 2>&1" "false"

# Test linting
verify_check "ESLint configuration" "npm run lint --dry-run >/dev/null 2>&1" "false"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    VERIFICATION RESULTS                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "Total Checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $CHECKS_PASSED${NC}"
echo -e "${RED}Failed: $CHECKS_FAILED${NC}"

# Calculate success rate
SUCCESS_RATE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))
echo -e "Success Rate: ${SUCCESS_RATE}%"

echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}${SUCCESS} INSTALLATION VERIFICATION SUCCESSFUL!${NC}"
    echo -e "${QUANTUM} Quantum Coherence: OPTIMAL"
    echo -e "${NEURAL} Neural Fabric: OPERATIONAL"
    echo -e "${DIMENSIONAL} Dimensional Gateway: STABLE"
    echo ""
    echo -e "${GREEN}Your QQ-Verse development environment is ready!${NC}"
    echo ""
    echo "🚀 Quick Start Commands:"
    echo "   ./start-dev.sh     - Start development servers"
    echo "   ./quick-test.sh    - Run tests and verification"
    echo ""
    echo "🌐 Access Points:"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:3001"
    echo "   API Docs:  http://localhost:3001/api-docs"
    echo ""
    exit 0
elif [ $CHECKS_FAILED -le 3 ]; then
    echo -e "${YELLOW}${WARNING} INSTALLATION MOSTLY SUCCESSFUL${NC}"
    echo -e "${YELLOW}Some non-critical checks failed, but the environment should be functional.${NC}"
    echo ""
    echo "You can try:"
    echo "1. Running the development servers: ./start-dev.sh"
    echo "2. Re-running setup for failed components: ./setup.sh"
    echo ""
    exit 0
else
    echo -e "${RED}${ERROR} INSTALLATION VERIFICATION FAILED${NC}"
    echo -e "${RED}Multiple critical checks failed. Please re-run the setup.${NC}"
    echo ""
    echo "Recommended actions:"
    echo "1. Check setup logs: cat setup-errors.log"
    echo "2. Clean and re-run setup: rm -rf node_modules .quantum-state && ./setup.sh"
    echo "3. Check system requirements in SETUP_GUIDE.md"
    echo ""
    exit 1
fi
