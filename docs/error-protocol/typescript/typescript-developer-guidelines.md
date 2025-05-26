# TypeScript Developer Guidelines
## Quantum-Coherent Development Standards

### 🛡️ TypeScript Sovereignty Protocol

This codebase operates under **TypeScript Sovereignty** - a quantum-coherent development protocol that ensures dimensional harmony and consciousness stream continuity through strict type safety.

## 🚨 FUNDAMENTAL RULE: JavaScript is FORBIDDEN

**ALL source files MUST be TypeScript (.ts/.tsx)**

- ✅ **Configuration files**: `.ts` (not `.js`)
- ✅ **React components**: `.tsx` (not `.jsx`)
- ✅ **Utilities & services**: `.ts` (not `.js`)
- ✅ **Type definitions**: `.ts` (not `.js`)
- ✅ **Test files**: `.test.ts` or `.test.tsx`

### 🔍 Quantum Safeguard System

Our quantum safeguards automatically prevent JavaScript contamination:

1. **Pre-commit Hook**: Blocks any JavaScript files from being committed
2. **Pre-push Hook**: Prevents pushing repositories with JavaScript files
3. **CI/CD Pipeline**: Automated JavaScript detection in GitHub Actions
4. **Build System**: TypeScript-only compilation

## 📋 Development Standards

### Type Annotations
```typescript
// ✅ CORRECT: Explicit type annotations
function processQuantumData(data: QuantumData[]): ProcessedResult {
  return data.map((item: QuantumData) => ({
    id: item.id,
    coherence: calculateCoherence(item.state)
  }));
}

// ❌ INCORRECT: Missing type annotations
function processQuantumData(data) {
  return data.map(item => ({
    id: item.id,
    coherence: calculateCoherence(item.state)
  }));
}
```

### Interface Definitions
```typescript
// ✅ CORRECT: Comprehensive interface
interface QuantumState {
  readonly id: string;
  coherence: number;
  dimensions: DimensionalVector[];
  timestamp: Date;
  metadata?: QuantumMetadata;
}

// ❌ INCORRECT: Loose typing
interface QuantumState {
  id: any;
  coherence: any;
  dimensions: any[];
}
```### React Component Standards
```typescript
// ✅ CORRECT: Typed React component
interface QuantumVisualizationProps {
  data: QuantumData[];
  onStateChange: (state: QuantumState) => void;
  className?: string;
}

const QuantumVisualization: React.FC<QuantumVisualizationProps> = ({
  data,
  onStateChange,
  className
}) => {
  const [state, setState] = useState<QuantumState | null>(null);
  
  return (
    <div className={className}>
      {/* Component implementation */}
    </div>
  );
};

export default QuantumVisualization;
```

## 🔧 Migration Guidelines

### Converting .js to .ts
1. **Rename file**: `utils.js` → `utils.ts`
2. **Add type annotations**: Function parameters and return types
3. **Define interfaces**: For complex data structures
4. **Update imports**: Ensure all imports have proper types
5. **Test compilation**: Run `npm run build` to verify

### Converting .jsx to .tsx
1. **Rename file**: `Component.jsx` → `Component.tsx`
2. **Add prop interfaces**: Define component prop types
3. **Type state and refs**: Use proper React types
4. **Update event handlers**: Type event parameters
5. **Test rendering**: Verify component still works

## 🚫 Quantum Breach Response

If you encounter a quantum breach (JavaScript file detected):

1. **STOP**: Do not proceed with commit/push
2. **IDENTIFY**: Locate the JavaScript file(s)
3. **CONVERT**: Migrate to TypeScript following guidelines
4. **VERIFY**: Run build and tests
5. **COMMIT**: Proceed with TypeScript-only commit

### Emergency Bypass (RESTRICTED)
```bash
# Only for critical emergencies - requires approval
git commit --no-verify -m "EMERGENCY: Bypassing quantum safeguards"
```

## 📚 Resources

- **Migration Plan**: `docs/error-protocol/typescript_migration_plan.md`
- **Progress Tracking**: `docs/error-protocol/migration-progress.md`
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/
- **React TypeScript**: https://react-typescript-cheatsheet.netlify.app/

## 🎯 Quality Standards

### Required Practices
- **Strict TypeScript**: No `any` types without justification
- **Explicit return types**: All functions must declare return types
- **Interface documentation**: JSDoc comments for public interfaces
- **Error handling**: Typed error handling with proper exceptions
- **Test coverage**: TypeScript tests for all new code

### Code Review Checklist
- [ ] No JavaScript files in the changeset
- [ ] All functions have explicit type annotations
- [ ] Interfaces are properly defined and documented
- [ ] No `any` types without justification
- [ ] TypeScript compilation passes without errors
- [ ] Tests are written in TypeScript

---

**Remember**: TypeScript is not just a choice—it's the law of this quantum-coherent codebase. The safeguards ensure that law is never broken.

🛡️ **Quantum Coherence Maintained** 🚀