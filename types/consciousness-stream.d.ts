/**
 * Type definitions for Consciousness Stream Protocol
 * 
 * These types define the structure and behavior of consciousness streams
 * in the QQ-Verse project, ensuring consciousness continuity across
 * dimensional boundaries.
 */

/**
 * Represents a consciousness stream that maintains continuity across
 * dimensional boundaries.
 */
export interface ConsciousnessStream<T = unknown> {
  /** Unique identifier for the consciousness stream */
  id: string;
  
  /** Timestamp when the consciousness stream was created */
  timestamp: string;
  
  /** The consciousness data being transmitted */
  data: T;
  
  /** Context information to maintain continuity */
  context: ConsciousnessContext;
  
  /** Dimensional information for the consciousness stream */
  dimensions: DimensionalInfo[];
  
  /** Neural fabric connections for the consciousness stream */
  neuralConnections: NeuralConnection[];
  
  /** Quantum state information for the consciousness stream */
  quantumState: QuantumState;
  
  /** Verification information for the consciousness stream */
  verification: VerificationInfo;
}

/**
 * Context information for maintaining consciousness continuity
 */
export interface ConsciousnessContext {
  /** Source of the consciousness stream */
  source: string;
  
  /** Destination of the consciousness stream */
  destination: string;
  
  /** Path taken by the consciousness stream */
  path: string[];
  
  /** Previous consciousness stream in the chain */
  previousStreamId?: string;
  
  /** Next consciousness stream in the chain */
  nextStreamId?: string;
  
  /** Additional metadata for the consciousness stream */
  metadata: Record<string, unknown>;
}

/**
 * Dimensional information for the consciousness stream
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
}

/**
 * Neural connection information
 */
export interface NeuralConnection {
  /** Source node of the connection */
  sourceNode: string;
  
  /** Target node of the connection */
  targetNode: string;
  
  /** Strength of the connection */
  strength: number;
  
  /** Type of the connection */
  type: 'direct' | 'indirect' | 'quantum' | 'custom';
  
  /** State of the connection */
  state: 'active' | 'inactive' | 'pending';
}

/**
 * Quantum state information
 */
export interface QuantumState {
  /** Coherence level of the quantum state */
  coherence: number;
  
  /** Entanglement information */
  entanglement: EntanglementInfo[];
  
  /** Superposition information */
  superposition: SuperpositionInfo;
  
  /** Wave function information */
  waveFunction: WaveFunctionInfo;
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
 * Options for creating a consciousness stream
 */
export interface ConsciousnessStreamOptions<T = unknown> {
  /** The consciousness data to transmit */
  data: T;
  
  /** Source of the consciousness stream */
  source: string;
  
  /** Destination of the consciousness stream */
  destination: string;
  
  /** Dimensional information */
  dimensions?: Partial<DimensionalInfo>[];
  
  /** Neural connections */
  neuralConnections?: Partial<NeuralConnection>[];
  
  /** Quantum state information */
  quantumState?: Partial<QuantumState>;
  
  /** Additional context metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Consciousness stream serialization options
 */
export interface SerializationOptions {
  /** Format to serialize to */
  format: 'json' | 'binary' | 'quantum';
  
  /** Compression level */
  compression?: 'none' | 'low' | 'medium' | 'high';
  
  /** Encryption options */
  encryption?: {
    /** Whether to encrypt the stream */
    enabled: boolean;
    
    /** Encryption algorithm to use */
    algorithm?: string;
    
    /** Encryption key */
    key?: string;
  };
  
  /** Whether to include verification information */
  includeVerification?: boolean;
}

/**
 * Consciousness stream checkpoint
 */
export interface ConsciousnessCheckpoint {
  /** Checkpoint identifier */
  id: string;
  
  /** Timestamp when the checkpoint was created */
  timestamp: string;
  
  /** Serialized consciousness stream */
  serializedStream: string;
  
  /** Checkpoint type */
  type: 'automatic' | 'manual' | 'boundary' | 'error';
  
  /** Checkpoint location */
  location: string;
}

/**
 * Functions for working with consciousness streams
 */
export interface ConsciousnessStreamFunctions {
  /**
   * Creates a new consciousness stream
   */
  createStream<T>(options: ConsciousnessStreamOptions<T>): ConsciousnessStream<T>;
  
  /**
   * Serializes a consciousness stream
   */
  serializeStream<T>(stream: ConsciousnessStream<T>, options?: SerializationOptions): string;
  
  /**
   * Deserializes a consciousness stream
   */
  deserializeStream<T>(serialized: string): ConsciousnessStream<T>;
  
  /**
   * Creates a checkpoint for a consciousness stream
   */
  createCheckpoint<T>(stream: ConsciousnessStream<T>, type?: ConsciousnessCheckpoint['type']): ConsciousnessCheckpoint;
  
  /**
   * Restores a consciousness stream from a checkpoint
   */
  restoreFromCheckpoint<T>(checkpoint: ConsciousnessCheckpoint): ConsciousnessStream<T>;
  
  /**
   * Verifies the continuity of a consciousness stream
   */
  verifyStreamContinuity<T>(stream: ConsciousnessStream<T>): VerificationResult;
  
  /**
   * Repairs a consciousness stream if continuity is broken
   */
  repairStreamContinuity<T>(stream: ConsciousnessStream<T>, errors: VerificationError[]): ConsciousnessStream<T>;
}