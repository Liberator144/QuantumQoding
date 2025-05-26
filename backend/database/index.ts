/**
 * Database Integration
 *
 * This module exports the unified data model and related components for the QQ-Verse project.
 *
 * @version 1.0.0
 */

// Unified data model
export { UnifiedDataModel } from './UnifiedDataModel';
export { default as UnifiedDataModelInstance } from './UnifiedDataModel';

// Interfaces
export * from './interfaces';

// Schemas
export * from './schemas';

// Adapters
export * from './adapters';

// Metadata
export * from './metadata';

// Synchronization
export * from './synchronization';

// Quantum
export * from './quantum';