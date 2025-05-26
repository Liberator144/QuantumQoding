#!/bin/bash
# QQ-Verse Quick Test Runner

echo "🧪 Running QQ-Verse Quick Tests..."

# Run linting
echo "📝 Running linting..."
npm run lint

# Run tests
echo "🔬 Running tests..."
npm test

# Verify quantum coherence
echo "⚛️ Verifying quantum coherence..."
if [ -f ".quantum-state/neural-fabric.json" ]; then
    echo "✅ Neural Fabric: Operational"
else
    echo "❌ Neural Fabric: Compromised"
fi

if [ -f ".quantum-state/consciousness-stream.json" ]; then
    echo "✅ Consciousness Stream: Flowing"
else
    echo "❌ Consciousness Stream: Interrupted"
fi

if [ -f ".quantum-state/dimensional-gateway.json" ]; then
    echo "✅ Dimensional Gateway: Stable"
else
    echo "❌ Dimensional Gateway: Unstable"
fi

echo "🎉 Quick test completed!"
