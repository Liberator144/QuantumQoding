#!/bin/bash

# QQ-Verse Setup Validation Script
# Tests the setup.sh script functionality without running full installation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Test function
run_test() {
    local test_name="$1"
    local test_command="$2"
    
    ((TOTAL_TESTS++))
    echo -n "Testing $test_name... "
    
    if eval "$test_command" >/dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}FAIL${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                QQ-VERSE SETUP VALIDATION                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Test 1: Script exists and is executable
run_test "setup.sh exists and is executable" "[ -x ./setup.sh ]"

# Test 2: Script has proper shebang
run_test "setup.sh has bash shebang" "head -1 ./setup.sh | grep -q '#!/bin/bash'"

# Test 3: Script contains required functions
run_test "setup.sh contains check_prerequisites function" "grep -q 'check_prerequisites()' ./setup.sh"
run_test "setup.sh contains install_dependencies function" "grep -q 'install_dependencies()' ./setup.sh"
run_test "setup.sh contains create_environment_files function" "grep -q 'create_environment_files()' ./setup.sh"
run_test "setup.sh contains initialize_quantum_systems function" "grep -q 'initialize_quantum_systems()' ./setup.sh"

# Test 4: Script has error handling
run_test "setup.sh has error handling (set -e)" "grep -q 'set -e' ./setup.sh"
run_test "setup.sh has retry mechanism" "grep -q 'retry_command' ./setup.sh"

# Test 5: Script has logging functionality
run_test "setup.sh has logging functions" "grep -q 'log_info()' ./setup.sh"
run_test "setup.sh has error logging" "grep -q 'log_error()' ./setup.sh"

# Test 6: Script has quantum coherence features
run_test "setup.sh has quantum logging" "grep -q 'log_quantum' ./setup.sh"
run_test "setup.sh has neural fabric initialization" "grep -q 'neural-fabric.json' ./setup.sh"
run_test "setup.sh has consciousness stream setup" "grep -q 'consciousness-stream.json' ./setup.sh"

# Test 7: Script creates helper files
run_test "setup.sh creates development start script" "grep -q 'start-dev.sh' ./setup.sh"
run_test "setup.sh creates quick test script" "grep -q 'quick-test.sh' ./setup.sh"
run_test "setup.sh generates setup report" "grep -q 'SETUP_REPORT.md' ./setup.sh"

# Test 8: Script has proper environment setup
run_test "setup.sh creates frontend .env.local" "grep -q 'frontend/.env.local' ./setup.sh"
run_test "setup.sh creates backend .env" "grep -q 'backend/.env' ./setup.sh"

# Test 9: Script has dependency management
run_test "setup.sh installs root dependencies" "grep -q 'npm install' ./setup.sh"
run_test "setup.sh handles frontend dependencies" "grep -q 'cd.*frontend.*npm install' ./setup.sh"
run_test "setup.sh handles backend dependencies" "grep -q 'cd.*backend.*npm install' ./setup.sh"

# Test 10: Script has build processes
run_test "setup.sh builds TypeScript projects" "grep -q 'npm run build' ./setup.sh"

# Test 11: Script syntax check
run_test "setup.sh has valid bash syntax" "bash -n ./setup.sh"

# Test 12: Check for required project structure
run_test "frontend directory exists" "[ -d ./frontend ]"
run_test "backend directory exists" "[ -d ./backend ]"
run_test "root package.json exists" "[ -f ./package.json ]"
run_test "frontend package.json exists" "[ -f ./frontend/package.json ]"
run_test "backend package.json exists" "[ -f ./backend/package.json ]"

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    VALIDATION RESULTS                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ All validation tests passed!${NC}"
    echo -e "${GREEN}The setup.sh script is ready for use.${NC}"
    echo ""
    echo "To run the setup:"
    echo "  ./setup.sh"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some validation tests failed.${NC}"
    echo -e "${YELLOW}Please review the setup.sh script before running.${NC}"
    echo ""
    exit 1
fi
