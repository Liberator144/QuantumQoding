#!/bin/bash

# Script to identify and clean up JavaScript files that have TypeScript equivalents

echo "🔍 DUPLICATE DETECTION: Finding JS files with TS equivalents"
echo "========================================================"

DUPLICATE_COUNT=0
CLEANED_COUNT=0
JS_FILES_TO_REMOVE=()

# Find all JavaScript files (excluding system directories)
while IFS= read -r js_file; do
    # Get the base name without extension
    base_name="${js_file%.*}"
    
    # Check for TypeScript equivalent
    if [[ "$js_file" == *.jsx ]]; then
        ts_equivalent="${base_name}.tsx"
    else
        ts_equivalent="${base_name}.ts"
    fi
    
    # Check if TypeScript file exists
    if [[ -f "$ts_equivalent" ]]; then
        echo "📁 DUPLICATE FOUND:"
        echo "   JS: $js_file"
        echo "   TS: $ts_equivalent"
        
        # Verify the TypeScript file is not empty
        if [[ -s "$ts_equivalent" ]]; then
            echo "   ✅ TypeScript file exists and is not empty"
            JS_FILES_TO_REMOVE+=("$js_file")
            ((DUPLICATE_COUNT++))
        else
            echo "   ⚠️  TypeScript file is empty, keeping JavaScript file"
        fi
        echo ""
    fi
done < <(find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v dist | grep -v build | grep -v \.backup | grep -v \.husky)

echo "📊 DUPLICATE ANALYSIS COMPLETE"
echo "=============================="
echo "JavaScript files with TypeScript equivalents: $DUPLICATE_COUNT"
echo ""

if [[ $DUPLICATE_COUNT -gt 0 ]]; then
    echo "🗑️  FILES TO REMOVE:"
    for file in "${JS_FILES_TO_REMOVE[@]}"; do
        echo "   - $file"
    done
    echo ""
    
    echo "🧹 CLEANING UP DUPLICATES..."
    for file in "${JS_FILES_TO_REMOVE[@]}"; do
        if [[ -f "$file" ]]; then
            # Create backup before removal
            backup_file="${file}.removed-duplicate.backup"
            mv "$file" "$backup_file"
            echo "   ✅ Moved $file → $backup_file"
            ((CLEANED_COUNT++))
        fi
    done
    
    echo ""
    echo "🎉 CLEANUP COMPLETE!"
    echo "   Files cleaned: $CLEANED_COUNT"
    echo "   Backups created: $CLEANED_COUNT"
else
    echo "✨ No duplicates found! All JavaScript files are unique."
fi

echo ""
echo "🔍 FINAL ANALYSIS"
echo "================="

# Count remaining files
REMAINING_JS=$(find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v dist | grep -v build | grep -v \.backup | grep -v \.husky | wc -l)
TOTAL_TS=$(find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v dist | grep -v build | wc -l)

echo "Remaining JavaScript files: $REMAINING_JS"
echo "Total TypeScript files: $TOTAL_TS"

if [[ $((REMAINING_JS + TOTAL_TS)) -gt 0 ]]; then
    TS_PERCENTAGE=$((TOTAL_TS * 100 / (REMAINING_JS + TOTAL_TS)))
    echo "TypeScript coverage: $TS_PERCENTAGE%"
fi

echo ""
echo "🛡️  Quantum Coherence Status: $([ $REMAINING_JS -eq 0 ] && echo 'PERFECT' || echo 'IN PROGRESS')"
echo "🚀 TypeScript Sovereignty: $([ $REMAINING_JS -eq 0 ] && echo 'ACHIEVED' || echo 'ADVANCING')"