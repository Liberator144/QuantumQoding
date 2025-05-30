/**
 * QuantumQonnect Star System - Shared Module Exports
 * Central export point for all shared functionality
 */

// Export all types and interfaces
export * from './types';

// Export base star module class
export { BaseStarModule } from './BaseStarModule';

// Export utility functions
export * from './utils';

// Export shared services
export * from './services';

// Re-export commonly used types for convenience
export type {
  StarModule,
  StarConfig,
  StarFeature,
  StarRoutes,
  StarServices,
  StarModels,
  StarMetrics,
  StarInitOptions,
  StarEventData,
  IntegrationMessage,
  ConsciousnessStreamData,
  StarOrbit
} from './types';