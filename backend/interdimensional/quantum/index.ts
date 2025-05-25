/**
 * Quantum State Management
 * 
 * This module exports the quantum state management components for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

// Quantum state manager
export { 
  QuantumStateManager, 
  CoherenceLevel, 
  QuantumStateVector, 
  QuantumEntanglement, 
  SynchronizationOptions,
  SynchronizationStrategy,
  VerificationLevel,
  SynchronizationResult
} from './QuantumStateManager';
export { default as QuantumStateManagerInstance } from './QuantumStateManager';

// Export other quantum components as they are implemented
export * from './QuantumStateTransformer';
export * from './QuantumCoherenceVerifier';