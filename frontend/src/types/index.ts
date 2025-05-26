/**
 * Types Index
 *
 * This module exports all type definitions for the application.
 *
 * @version 1.0.0
 */

// Export all consciousness types
export * from './consciousness';

// Export all UI types
export * from './ui';

// Export all user types
export * from './user';

// Export all store types
export * from './store';

// Export all neural types
export * from './neural';

// Export all dimensional types
export * from './dimensional';

// Export all quantum types
export * from './quantum';

// Export all API types
export * from './api';

// Re-export commonly used types for convenience
export type {
  // Consciousness
  ConsciousnessState,
  ConsciousnessStream,
  DimensionalVector,
  
  // UI
  BaseComponentProps,
  InteractiveComponentProps,
  Theme,
  ColorPalette,
  QuantumComponentProps,
  
  // User
  User,
  UserRole,
  UserStatus,
  AuthUser,
  UserPreferences,
  
  // Store
  RootState,
  Action,
  Store,
  Selector,
  
  // Neural
  NeuralNetwork,
  NetworkArchitecture,
  NeuralLayer,
  Neuron,
  TrainingConfig,
  
  // Dimensional
  Dimension,
  DimensionalCoordinates,
  DimensionalTransition,
  DimensionalSpace,
  
  // Quantum
  QuantumState,
  Complex,
  QuantumCircuit,
  Qubit,
  QuantumGate,
  
  // API
  ApiResponse,
  ApiError,
  PaginatedResponse,
  ApiRequest,
  QuantumApiResponse
} from './consciousness';

// Type utility functions
export const createTypedAction = <T>(type: string, payload: T): Action<T> => ({
  type,
  payload,
  meta: {
    timestamp: new Date(),
    source: 'typed-action'
  }
});

export const createQuantumSignature = (): string => {
  return `quantum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const isValidId = (id: string): boolean => {
  return typeof id === 'string' && id.length > 0;
};

export const createDimensionalCoordinates = (
  x: number, 
  y: number, 
  z: number, 
  w?: number
): DimensionalCoordinates => ({
  x,
  y,
  z,
  ...(w !== undefined && { w })
});

export const createComplex = (real: number, imaginary: number): Complex => ({
  real,
  imaginary
});

// Type constants
export const DEFAULT_COHERENCE_LEVEL = 0.95;
export const DEFAULT_QUANTUM_PHASE = 0;
export const DEFAULT_DIMENSIONAL_STABILITY = 0.8;
export const DEFAULT_NEURAL_LEARNING_RATE = 0.001;

// Quantum constants
export const PLANCK_CONSTANT = 6.62607015e-34;
export const SPEED_OF_LIGHT = 299792458;
export const QUANTUM_COHERENCE_THRESHOLD = 0.9;