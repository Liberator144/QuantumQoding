/**
 * Database Quantum Coherence
 * 
 * This module exports database quantum coherence managers for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

// Quantum coherence manager
export { 
  QuantumCoherenceManager, 
  CoherenceLevel, 
  CoherenceCheckpoint, 
  CoherenceVerificationResult, 
  QuantumCoherenceManagerOptions 
} from './QuantumCoherenceManager';
export { default as QuantumCoherenceManagerInstance } from './QuantumCoherenceManager';

// Dimensional protocol manager
export { 
  DimensionalProtocolManager, 
  ProtocolType, 
  ProtocolFormat, 
  ProtocolMapping, 
  ProtocolTranslationResult, 
  DimensionalProtocolManagerOptions 
} from './DimensionalProtocolManager';
export { default as DimensionalProtocolManagerInstance } from './DimensionalProtocolManager';