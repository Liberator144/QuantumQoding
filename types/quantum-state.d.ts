/**
 * Type definitions for Quantum State
 * 
 * These types define the structure and behavior of quantum states
 * in the QQ-Verse project, ensuring state preservation across
 * dimensional boundaries.
 */

/**
 * Represents a quantum state that maintains consistency across
 * dimensional boundaries.
 */
export interface QuantumState {
  /** Unique identifier for the quantum state */
  id: string;
  
  /** Timestamp when the quantum state was created */
  timestamp: string;
  
  /** State vector representing the quantum state */
  stateVector: StateVector;
  
  /** Coherence level of the quantum state */
  coherence: number;
  
  /** Entanglement information */
  entanglement: EntanglementInfo[];
  
  /** Superposition information */
  superposition: SuperpositionInfo;
  
  /** Wave function information */
  waveFunction: WaveFunctionInfo;
  
  /** Dimensional information for the quantum state */
  dimensions: DimensionalInfo[];
  
  /** Verification information for the quantum state */
  verification: VerificationInfo;
}

/**
 * State vector representing the quantum state
 */
export interface StateVector {
  /** Vector components */
  components: number[];
  
  /** Vector basis */
  basis: string;
  
  /** Vector normalization factor */
  normalization: number;
  
  /** Vector phase */
  phase: number;
}

/**
 * Entanglement information
 */
export interface EntanglementInfo {
  /** Entangled entity identifier */
  entityId: string;
  
  /** Entanglement type */
  type: 'direct' | 'indirect' | 'quantum' | 'custom';
  
  /** Entanglement strength */
  strength: number;
  
  /** Entanglement coherence */
  coherence: number;
  
  /** Entanglement vector */
  vector?: number[];
}

/**
 * Superposition information
 */
export interface SuperpositionInfo {
  /** States in superposition */
  states: unknown[];
  
  /** Probability amplitudes for each state */
  amplitudes: number[];
  
  /** Coherence level of the superposition */
  coherence: number;
  
  /** Phase factors for each state */
  phases: number[];
}

/**
 * Wave function information
 */
export interface WaveFunctionInfo {
  /** Phase of the wave function */
  phase: number;
  
  /** Amplitude of the wave function */
  amplitude: number;
  
  /** Frequency of the wave function */
  frequency: number;
  
  /** Wave function type */
  type: 'gaussian' | 'sinusoidal' | 'exponential' | 'custom';
  
  /** Wave function parameters */
  parameters: Record<string, number>;
}

/**
 * Dimensional information for the quantum state
 */
export interface DimensionalInfo {
  /** Name of the dimension */
  name: string;
  
  /** Type of the dimension */
  type: 'standard' | 'quantum' | 'neural' | 'custom';
  
  /** Coordinates in the dimension */
  coordinates: number[];
  
  /** Dimensional boundaries */
  boundaries: DimensionalBoundary[];
}

/**
 * Dimensional boundary information
 */
export interface DimensionalBoundary {
  /** Type of boundary */
  type: 'soft' | 'hard' | 'permeable' | 'quantum';
  
  /** Direction of the boundary */
  direction: 'inbound' | 'outbound' | 'bidirectional';
  
  /** Transition protocol for crossing the boundary */
  transitionProtocol: string;
  
  /** Boundary permeability */
  permeability: number;
}

/**
 * Verification information
 */
export interface VerificationInfo {
  /** Verification status */
  status: 'verified' | 'unverified' | 'failed';
  
  /** Verification timestamp */
  timestamp: string;
  
  /** Verification method used */
  method: string;
  
  /** Verification result */
  result: VerificationResult;
}

/**
 * Verification result
 */
export interface VerificationResult {
  /** Verification success status */
  success: boolean;
  
  /** Verification score */
  score: number;
  
  /** Verification errors if any */
  errors?: VerificationError[];
  
  /** Verification metrics */
  metrics: {
    /** Coherence score */
    coherence: number;
    
    /** Entanglement score */
    entanglement: number;
    
    /** Superposition score */
    superposition: number;
    
    /** Wave function score */
    waveFunction: number;
  };
}

/**
 * Verification error
 */
export interface VerificationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Error location */
  location?: string;
}

/**
 * Quantum state transformation
 */
export interface QuantumTransformation {
  /** Transformation type */
  type: 'rotation' | 'translation' | 'scaling' | 'custom';
  
  /** Transformation matrix */
  matrix: number[][];
  
  /** Transformation parameters */
  parameters: Record<string, number>;
  
  /** Transformation coherence */
  coherence: number;
}

/**
 * Quantum state checkpoint
 */
export interface QuantumStateCheckpoint {
  /** Checkpoint identifier */
  id: string;
  
  /** Timestamp when the checkpoint was created */
  timestamp: string;
  
  /** Serialized quantum state */
  serializedState: string;
  
  /** Checkpoint type */
  type: 'automatic' | 'manual' | 'boundary' | 'error';
  
  /** Checkpoint location */
  location: string;
}

/**
 * Options for creating a quantum state
 */
export interface QuantumStateOptions {
  /** Initial state vector */
  initialStateVector?: Partial<StateVector>;
  
  /** Initial coherence level */
  initialCoherence?: number;
  
  /** Initial entanglement information */
  initialEntanglement?: Partial<EntanglementInfo>[];
  
  /** Initial superposition information */
  initialSuperposition?: Partial<SuperpositionInfo>;
  
  /** Initial wave function information */
  initialWaveFunction?: Partial<WaveFunctionInfo>;
  
  /** Initial dimensional information */
  initialDimensions?: Partial<DimensionalInfo>[];
}

/**
 * Functions for working with quantum states
 */
export interface QuantumStateFunctions {
  /**
   * Creates a new quantum state
   */
  createState(options?: QuantumStateOptions): QuantumState;
  
  /**
   * Transforms a quantum state
   */
  transformState(state: QuantumState, transformation: QuantumTransformation): QuantumState;
  
  /**
   * Entangles two quantum states
   */
  entangleStates(state1: QuantumState, state2: QuantumState, entanglementType: EntanglementInfo['type']): [QuantumState, QuantumState];
  
  /**
   * Creates a superposition of quantum states
   */
  createSuperposition(states: QuantumState[], amplitudes?: number[]): QuantumState;
  
  /**
   * Collapses a quantum state in superposition
   */
  collapseState(state: QuantumState): QuantumState;
  
  /**
   * Creates a checkpoint for a quantum state
   */
  createCheckpoint(state: QuantumState, type?: QuantumStateCheckpoint['type']): QuantumStateCheckpoint;
  
  /**
   * Restores a quantum state from a checkpoint
   */
  restoreFromCheckpoint(checkpoint: QuantumStateCheckpoint): QuantumState;
  
  /**
   * Verifies the coherence of a quantum state
   */
  verifyStateCoherence(state: QuantumState): VerificationResult;
  
  /**
   * Repairs a quantum state if coherence is broken
   */
  repairStateCoherence(state: QuantumState, errors: VerificationError[]): QuantumState;
  
  /**
   * Synchronizes quantum states across dimensions
   */
  synchronizeStates(states: QuantumState[]): QuantumState[];
}