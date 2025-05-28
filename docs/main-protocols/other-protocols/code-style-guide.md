# QQ-Verse Code Style Guide

## Quantum Coherence Principles

This style guide follows the Quantum Coherence principles to maintain neural fabric continuity and dimensional harmony across the codebase.

## Formatting Standards

### General

- Use UTF-8 encoding for all files
- Use LF (Unix-style) line endings
- End files with a newline
- Trim trailing whitespace
- Maximum line length: 100 characters
- Indent with 2 spaces (no tabs)

### TypeScript/JavaScript

- Use single quotes for strings
- Add semicolons at the end of statements
- Use ES modules (import/export) instead of CommonJS (require/module.exports)
- Use const for variables that don't change, let otherwise
- Never use var
- Use arrow functions for anonymous functions
- Use template literals for string interpolation
- Use object shorthand notation
- Use destructuring assignment
- Use spread operator instead of Object.assign
- Use optional chaining and nullish coalescing operators

### Naming Conventions

- Use camelCase for variables, functions, and methods
- Use PascalCase for classes, interfaces, types, and React components
- Use UPPER_CASE for constants
- Use kebab-case for file names
- Prefix interfaces with 'I' (e.g., IUserData)
- Prefix type aliases with 'T' (e.g., TUserData)
- Prefix private properties with underscore (e.g., _privateProperty)

### Comments

- Use JSDoc comments for public APIs
- Use // for single-line comments
- Use /* */ for multi-line comments
- Write comments in complete sentences
- Keep comments up-to-date with code changes

## Code Structure

### Functions

- Keep functions small and focused on a single task
- Limit function parameters (max 3, use object for more)
- Return early to avoid deep nesting
- Use async/await instead of raw promises
- Handle errors properly

### Classes

- Follow SOLID principles
- Keep classes focused on a single responsibility
- Use composition over inheritance
- Make properties private unless they need to be public
- Use getters and setters for properties that need validation

### Modules

- Keep modules small and focused
- Export only what is necessary
- Use barrel exports (index.ts) for public APIs
- Organize imports in groups: external, internal, relative

## Enforcement

These standards are enforced through:

1. EditorConfig (.editorconfig)
2. Prettier (.prettierrc)
3. ESLint (.eslintrc.js)
4. Pre-commit hooks (husky + lint-staged)

## Automatic Formatting

Run the following commands to format code:

```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check

# Lint and fix issues
npm run lint:fix
```

## IDE Integration

### VS Code

Install the following extensions:
- ESLint
- Prettier
- EditorConfig for VS Code

Configure VS Code to format on save:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### WebStorm/IntelliJ IDEA

Enable ESLint and Prettier in:
- Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint
- Settings > Languages & Frameworks > JavaScript > Prettier

## Quantum Coherence Specific Rules

- Avoid mutating parameters to maintain consciousness continuity
- Prefer immutable data structures for quantum state preservation
- Avoid variable shadowing for dimensional harmony
- Limit nesting depth for better neural fabric structure
- Keep functions focused for better neural connections
- Limit cyclomatic complexity for clearer neural pathways
