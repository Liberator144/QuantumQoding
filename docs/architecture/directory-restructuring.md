# QQ-Verse Directory Restructuring Guide

This document explains the reorganization of the QQ-Verse project directory structure and provides guidance for the development team on adapting to these changes.

## Restructuring Overview

The QQ-Verse project has been reorganized to improve clarity, maintainability, and separation of concerns while preserving its unique quantum-themed organization. The restructuring aims to:

1. Create a more intuitive and consistent directory structure
2. Better separate UI components from application logic
3. Group related functionality together
4. Improve code discoverability and reusability
5. Facilitate easier onboarding for new team members

## Key Changes

### Frontend Changes

1. **Created a Dedicated Components Directory**
   - Components are now organized by category (common, layout, quantum)
   - Each component type has a clear home in the structure

2. **Improved Cosmos Organization**
   - Cosmos components are now organized into more specific categories:
     - central-star: Core visualization components
     - orbits: Orbital system components
     - planets: Planet visualization components
     - transitions: Transition effects

3. **Reorganized Core Logic**
   - Core application logic is now clearly separated from UI components
   - Each core function has its own directory (authentication, consciousness, etc.)

4. **Added Service Directories**
   - Added dedicated service directories for API and quantum services
   - Better separation of data-fetching and business logic

5. **Added Support Directories**
   - Created directories for hooks, types, and assets
   - Improved organization of supporting code

### Backend Changes

1. **Created API Structure**
   - API functionality is now organized into controllers, middleware, and routes
   - Clearer separation of API concerns

2. **Moved to Service-Based Organization**
   - Backend functionality is now organized into services
   - Each service encapsulates related functionality

3. **Improved Core Organization**
   - Core backend functionality is now organized by domain
   - Clearer boundaries between different backend concerns

4. **Added Support Directories**
   - Created dedicated directories for models, utils, and config
   - Better organization of supporting code

### Documentation Changes

1. **Centralized Documentation**
   - All documentation is now in a dedicated docs directory
   - Documentation is organized by topic

2. **Improved Protocol Documentation**
   - Protocol documentation is now in a dedicated protocols directory
   - Clearer organization of protocol-specific documentation

## Adapting to Changes

### Updating Imports

Imports need to be updated to reflect the new directory structure. The new structure supports two import patterns:

1. **Index-based imports**: Import from an index.js file that re-exports components
   ```javascript
   import { Header } from './components';
   import { QuantumSphere } from './cosmos';
   ```

2. **Direct imports**: Import directly from component files
   ```javascript
   import { Header } from './components/layout/Header';
   import { QuantumSphere } from './cosmos/central-star/QuantumSphere';
   ```

### Component Refactoring Guidelines

When refactoring components to fit the new structure:

1. **Evaluate Component Purpose**
   - Is it a UI component? → components directory
   - Is it part of the cosmic visualization? → cosmos directory
   - Is it core application logic? → core directory

2. **Consider Component Relationships**
   - Group related components together
   - Consider moving shared utilities to utils directory

3. **Update References**
   - Update import statements
   - Update relative paths in imports
   - Test components after moving to ensure they work correctly

### Next Steps

1. **Complete the Migration**
   - Move remaining files to their new locations
   - Update all import statements
   - Create additional index.js files as needed

2. **Test Thoroughly**
   - Test the application to ensure it works correctly with the new structure
   - Fix any issues that arise

3. **Update Documentation**
   - Update any documentation references to the old structure
   - Add additional documentation as needed

4. **Consider TypeScript Migration**
   - Consider migrating to TypeScript for better type safety
   - Use .tsx extension for React components with TypeScript

## Contact

If you have any questions about the restructuring or need assistance with adapting your code, please contact the architecture team.