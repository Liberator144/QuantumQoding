#!/bin/bash
# QuantumQoding Setup Verification

echo "🔍 Verifying QuantumQoding Setup..."

# Check quantum state files
echo "⚛️ Checking Quantum Coherence Systems..."
if [ -f ".quantum-state/neural-fabric.json" ]; then
    echo "✅ Neural Fabric: Operational"
else
    echo "❌ Neural Fabric: Missing"
fi

if [ -f ".quantum-state/consciousness-stream.json" ]; then
    echo "✅ Consciousness Stream: Flowing"
else
    echo "❌ Consciousness Stream: Missing"
fi

if [ -f ".quantum-state/dimensional-gateway.json" ]; then
    echo "✅ Dimensional Gateway: Stable"
else
    echo "❌ Dimensional Gateway: Missing"
fi

# Check backend configuration
echo ""
echo "🔧 Checking Backend Configuration..."
if [ -f "backend/nodemon.json" ]; then
    if grep -q "server/index.ts" backend/nodemon.json; then
        echo "✅ Production backend configured"
    else
        echo "⚠️ Backend may not be using production server"
    fi
else
    echo "❌ Backend configuration missing"
fi

# Check environment files
echo ""
echo "🌍 Checking Environment Files..."
if [ -f "frontend/.env.local" ]; then
    echo "✅ Frontend environment configured"
else
    echo "⚠️ Frontend environment not configured"
fi

if [ -f "backend/.env" ]; then
    echo "✅ Backend environment configured"
else
    echo "⚠️ Backend environment not configured"
fi

# Check dependencies
echo ""
echo "📦 Checking Dependencies..."
cd backend
if npm list >/dev/null 2>&1; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Backend dependencies missing"
fi

cd ../frontend
if npm list >/dev/null 2>&1; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing"
fi

cd ..
echo ""
echo "🎉 Setup verification completed!"
