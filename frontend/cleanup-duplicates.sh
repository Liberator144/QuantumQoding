#!/bin/bash

# TypeScript Extension Cleanup Script
# Systematic resolution of .ts/.tsx duplicates

echo "🚀 Starting TypeScript Extension Cleanup..."

cd src

# Function to check if file contains JSX
contains_jsx() {
    local file="$1"
    if [ -f "$file" ]; then
        grep -q "<.*>" "$file" 2>/dev/null
        return $?
    fi
    return 1
}

# Function to check if file contains React imports
contains_react() {
    local file="$1"
    if [ -f "$file" ]; then
        grep -q "from ['\"]react['\"]" "$file" 2>/dev/null || grep -q "import.*React" "$file" 2>/dev/null
        return $?
    fi
    return 1
}

# Function to resolve duplicate
resolve_duplicate() {
    local base="$1"
    local ts_file="${base}.ts"
    local tsx_file="${base}.tsx"
    
    echo "Resolving: $base"
    
    # Check if both files exist
    if [ ! -f "$ts_file" ] || [ ! -f "$tsx_file" ]; then
        echo "  ⚠️  One file missing, skipping"
        return
    fi
    
    # Check JSX content
    tsx_has_jsx=$(contains_jsx "$tsx_file" && echo "yes" || echo "no")
    ts_has_jsx=$(contains_jsx "$ts_file" && echo "yes" || echo "no")
    
    # Check React imports
    tsx_has_react=$(contains_react "$tsx_file" && echo "yes" || echo "no")
    ts_has_react=$(contains_react "$ts_file" && echo "yes" || echo "no")
    
    echo "  📊 Analysis:"
    echo "    .tsx: JSX=$tsx_has_jsx, React=$tsx_has_react"
    echo "    .ts:  JSX=$ts_has_jsx, React=$ts_has_react"
    
    # Decision logic
    if [ "$tsx_has_jsx" = "yes" ]; then
        echo "  ✅ Keeping .tsx (contains JSX)"
        rm "$ts_file"
    elif [ "$ts_has_jsx" = "yes" ]; then
        echo "  ✅ Keeping .ts (contains JSX - unusual but possible)"
        rm "$tsx_file"
    elif [ "$tsx_has_react" = "yes" ] && [ "$ts_has_react" = "no" ]; then
        echo "  ✅ Keeping .tsx (React component)"
        rm "$ts_file"
    elif [ "$ts_has_react" = "no" ] && [ "$tsx_has_react" = "no" ]; then
        echo "  ✅ Keeping .ts (no React/JSX)"
        rm "$tsx_file"
    else
        # Compare file sizes and keep the larger one
        ts_size=$(wc -l < "$ts_file" 2>/dev/null || echo 0)
        tsx_size=$(wc -l < "$tsx_file" 2>/dev/null || echo 0)
        
        if [ "$tsx_size" -gt "$ts_size" ]; then
            echo "  ✅ Keeping .tsx (larger file)"
            rm "$ts_file"
        else
            echo "  ✅ Keeping .ts (larger or equal file)"
            rm "$tsx_file"
        fi
    fi
    
    echo ""
}

# List of known duplicates to resolve
duplicates=(
    "./core/authentication/QuantumPortalCore"
    "./cosmos/central-star/QuantumSphere"
    "./cosmos/navigation/WormholeNavigationSystem"
    "./cosmos/navigation/NavigationControls"
    "./cosmos/navigation/NavigationProvider"
    "./cosmos/stars/QQ-UnityPortal/UserProfile"
    "./cosmos/planets/FeaturePlanet"
    "./cosmos/planets/PlanetPattern"
    "./cosmos/transitions/WormholeTransition"
    "./cosmos/transitions/UITransition"
    "./cosmos/transitions/CameraEffects"
    "./cosmos/transitions/UITransitionGroup"
    "./components/visualization/index"
    "./components/quantum-visualization/index"
    "./components/quantum/index"
    "./design-system/integration/ThemeToggle"
    "./design-system/integration/QuantumButton"
    "./design-system/integration/DesignSystemProvider"
    "./design-system/components/navigation"
    "./design-system/components/modal"
    "./design-system/components/input"
    "./design-system/components/button"
    "./design-system/components/card"
    "./design-system/components/tooltip"
    "./design-system/components/index"
    "./router/PrivateRoute"
    "./router/StarSystemRoute"
    "./router/RouteTransition"
    "./router/QuantumRouter"
)

# Process each duplicate
for duplicate in "${duplicates[@]}"; do
    resolve_duplicate "$duplicate"
done

echo "🎉 Cleanup completed!"
echo ""
echo "📊 Remaining files:"
find . -name "*.ts" -o -name "*.tsx" | wc -l
echo ""
echo "🔍 Checking for remaining duplicates:"
find . -name '*.ts' | sed 's/\.ts$//' | while read base; do 
    if [ -f "${base}.tsx" ]; then 
        echo "STILL DUPLICATE: ${base}"
    fi 
done