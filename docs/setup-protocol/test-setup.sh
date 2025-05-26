#!/bin/bash

# Test the setup.sh script functionality
# This script performs a dry-run test of the setup process

echo "🧪 Testing QQ-Verse Setup Script..."
echo ""

# Auto-detect project root
find_project_root() {
    local current_dir="$(pwd)"

    # Check up to 3 levels up from current location
    for i in {0..3}; do
        if [ -f "$current_dir/package.json" ] && [ -d "$current_dir/frontend" ] && [ -d "$current_dir/backend" ]; then
            echo "$current_dir"
            return 0
        fi
        current_dir="$(dirname "$current_dir")"
    done

    # If not found, use current directory as fallback
    echo "$(pwd)"
    return 1
}

PROJECT_ROOT="$(find_project_root)"
echo "📁 Project root detected: $PROJECT_ROOT"
echo ""

# Test 1: Check if setup.sh exists and is executable
if [ -x "$PROJECT_ROOT/setup.sh" ]; then
    echo "✅ setup.sh exists and is executable"
else
    echo "❌ setup.sh not found or not executable"
    exit 1
fi

# Test 2: Check syntax
if bash -n "$PROJECT_ROOT/setup.sh"; then
    echo "✅ setup.sh has valid bash syntax"
else
    echo "❌ setup.sh has syntax errors"
    exit 1
fi

# Test 3: Check for required functions
required_functions=(
    "check_prerequisites"
    "install_dependencies"
    "create_environment_files"
    "initialize_quantum_systems"
    "verify_quantum_coherence"
    "log_info"
    "log_error"
    "retry_command"
)

for func in "${required_functions[@]}"; do
    if grep -q "${func}()" "$PROJECT_ROOT/setup.sh"; then
        echo "✅ Function $func found"
    else
        echo "❌ Function $func missing"
        exit 1
    fi
done

# Test 4: Check for quantum coherence features
quantum_features=(
    "neural-fabric.json"
    "consciousness-stream.json"
    "dimensional-gateway.json"
    "QUANTUM_SYMBOL"
    "NEURAL_SYMBOL"
    "DIMENSIONAL_SYMBOL"
)

for feature in "${quantum_features[@]}"; do
    if grep -q "$feature" "$PROJECT_ROOT/setup.sh"; then
        echo "✅ Quantum feature $feature found"
    else
        echo "❌ Quantum feature $feature missing"
        exit 1
    fi
done

# Test 5: Check project structure
required_dirs=("frontend" "backend")
required_files=("package.json" "frontend/package.json" "backend/package.json")

for dir in "${required_dirs[@]}"; do
    if [ -d "$PROJECT_ROOT/$dir" ]; then
        echo "✅ Directory $dir exists"
    else
        echo "❌ Directory $dir missing"
        exit 1
    fi
done

for file in "${required_files[@]}"; do
    if [ -f "$PROJECT_ROOT/$file" ]; then
        echo "✅ File $file exists"
    else
        echo "❌ File $file missing"
        exit 1
    fi
done

echo ""
echo "🎉 All tests passed! The setup.sh script is ready to use."
echo ""
echo "To run the full setup:"
echo "  ./setup.sh"
echo ""
echo "The setup script will:"
echo "  • Check and install prerequisites (Node.js 18+, npm, git)"
echo "  • Install all project dependencies"
echo "  • Create environment configuration files"
echo "  • Initialize Quantum Coherence Systems"
echo "  • Build TypeScript projects"
echo "  • Set up Git hooks with Husky"
echo "  • Run initial tests and verification"
echo "  • Create helper scripts for development"
echo "  • Generate a comprehensive setup report"
echo ""
