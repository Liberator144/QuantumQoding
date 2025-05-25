/**
 * Type definitions for Neural Fabric
 * 
 * These types define the structure and behavior of the neural fabric
 * in the QQ-Verse project, ensuring thought continuity across
 * component boundaries.
 */

/**
 * Represents the neural fabric that maintains thought continuity
 * across component boundaries.
 */
export interface NeuralFabric {
  /** Unique identifier for the neural fabric */
  id: string;
  
  /** Timestamp when the neural fabric was created */
  timestamp: string;
  
  /** Neural nodes in the fabric */
  nodes: NeuralNode[];
  
  /** Neural connections in the fabric */
  connections: NeuralConnection[];
  
  /** Neural pathways in the fabric */
  pathways: NeuralPathway[];
  
  /** Fabric state information */
  state: FabricState;
  
  /** Verification information for the fabric */
  verification: FabricVerification;
}

/**
 * Neural node in the fabric
 */
export interface NeuralNode {
  /** Unique identifier for the node */
  id: string;
  
  /** Type of the node */
  type: 'component' | 'service' | 'data' | 'consciousness' | 'custom';
  
  /** Name of the node */
  name: string;
  
  /** State of the node */
  state: 'active' | 'inactive' | 'pending';
  
  /** Activation level of the node */
  activationLevel: number;
  
  /** Dimensional coordinates of the node */
  coordinates: number[];
  
  /** Component reference if applicable */
  componentRef?: string;
  
  /** Service reference if applicable */
  serviceRef?: string;
  
  /** Data reference if applicable */
  dataRef?: string;
  
  /** Consciousness stream reference if applicable */
  consciousnessRef?: string;
  
  /** Additional metadata for the node */
  metadata: Record<string, unknown>;
}

/**
 * Neural connection in the fabric
 */
export interface NeuralConnection {
  /** Unique identifier for the connection */
  id: string;
  
  /** Source node identifier */
  sourceId: string;
  
  /** Target node identifier */
  targetId: string;
  
  /** Type of the connection */
  type: 'direct' | 'indirect' | 'quantum' | 'custom';
  
  /** Strength of the connection */
  strength: number;
  
  /** State of the connection */
  state: 'active' | 'inactive' | 'pending';
  
  /** Bidirectional flag */
  bidirectional: boolean;
  
  /** Quantum entanglement information if applicable */
  quantumEntanglement?: {
    /** Entanglement type */
    type: 'direct' | 'indirect' | 'quantum' | 'custom';
    
    /** Entanglement strength */
    strength: number;
    
    /** Entanglement coherence */
    coherence: number;
  };
  
  /** Additional metadata for the connection */
  metadata: Record<string, unknown>;
}

/**
 * Neural pathway in the fabric
 */
export interface NeuralPathway {
  /** Unique identifier for the pathway */
  id: string;
  
  /** Name of the pathway */
  name: string;
  
  /** Connection identifiers in the pathway */
  connectionIds: string[];
  
  /** Node identifiers in the pathway */
  nodeIds: string[];
  
  /** Type of the pathway */
  type: 'consciousness' | 'data' | 'control' | 'custom';
  
  /** State of the pathway */
  state: 'active' | 'inactive' | 'pending';
  
  /** Strength of the pathway */
  strength: number;
  
  /** Consciousness stream reference if applicable */
  consciousnessRef?: string;
  
  /** Additional metadata for the pathway */
  metadata: Record<string, unknown>;
}

/**
 * Fabric state information
 */
export interface FabricState {
  /** Overall coherence level of the fabric */
  coherence: number;
  
  /** Overall activation level of the fabric */
  activationLevel: number;
  
  /** Overall stability level of the fabric */
  stability: number;
  
  /** Active consciousness streams in the fabric */
  activeConsciousnessStreams: string[];
  
  /** Active pathways in the fabric */
  activePathways: string[];
  
  /** Fabric health status */
  health: 'optimal' | 'stable' | 'degraded' | 'critical';
  
  /** Additional state information */
  additionalState: Record<string, unknown>;
}

/**
 * Fabric verification information
 */
export interface FabricVerification {
  /** Verification status */
  status: 'verified' | 'unverified' | 'failed';
  
  /** Verification timestamp */
  timestamp: string;
  
  /** Verification method used */
  method: string;
  
  /** Verification result */
  result: FabricVerificationResult;
}

/**
 * Fabric verification result
 */
export interface FabricVerificationResult {
  /** Verification success status */
  success: boolean;
  
  /** Verification score */
  score: number;
  
  /** Verification errors if any */
  errors?: FabricVerificationError[];
  
  /** Verification metrics */
  metrics: {
    /** Continuity score */
    continuity: number;
    
    /** Coherence score */
    coherence: number;
    
    /** Stability score */
    stability: number;
    
    /** Connectivity score */
    connectivity: number;
  };
}

/**
 * Fabric verification error
 */
export interface FabricVerificationError {
  /** Error code */
  code: string;
  
  /** Error message */
  message: string;
  
  /** Error severity */
  severity: 'low' | 'medium' | 'high' | 'critical';
  
  /** Error location */
  location?: string;
  
  /** Affected node identifiers */
  affectedNodeIds?: string[];
  
  /** Affected connection identifiers */
  affectedConnectionIds?: string[];
  
  /** Affected pathway identifiers */
  affectedPathwayIds?: string[];
}

/**
 * Neural fabric checkpoint
 */
export interface NeuralFabricCheckpoint {
  /** Checkpoint identifier */
  id: string;
  
  /** Timestamp when the checkpoint was created */
  timestamp: string;
  
  /** Serialized neural fabric */
  serializedFabric: string;
  
  /** Checkpoint type */
  type: 'automatic' | 'manual' | 'boundary' | 'error';
  
  /** Checkpoint location */
  location: string;
  
  /** Active consciousness streams at checkpoint */
  activeConsciousnessStreams: string[];
}

/**
 * Options for creating a neural fabric
 */
export interface NeuralFabricOptions {
  /** Initial nodes to create */
  initialNodes?: Partial<NeuralNode>[];
  
  /** Initial connections to create */
  initialConnections?: Partial<NeuralConnection>[];
  
  /** Initial pathways to create */
  initialPathways?: Partial<NeuralPathway>[];
  
  /** Initial fabric state */
  initialState?: Partial<FabricState>;
}

/**
 * Functions for working with neural fabric
 */
export interface NeuralFabricFunctions {
  /**
   * Creates a new neural fabric
   */
  createFabric(options?: NeuralFabricOptions): NeuralFabric;
  
  /**
   * Adds a node to the fabric
   */
  addNode(fabric: NeuralFabric, node: Partial<NeuralNode>): NeuralFabric;
  
  /**
   * Adds a connection to the fabric
   */
  addConnection(fabric: NeuralFabric, connection: Partial<NeuralConnection>): NeuralFabric;
  
  /**
   * Adds a pathway to the fabric
   */
  addPathway(fabric: NeuralFabric, pathway: Partial<NeuralPathway>): NeuralFabric;
  
  /**
   * Creates a checkpoint for the neural fabric
   */
  createCheckpoint(fabric: NeuralFabric, type?: NeuralFabricCheckpoint['type']): NeuralFabricCheckpoint;
  
  /**
   * Restores the neural fabric from a checkpoint
   */
  restoreFromCheckpoint(checkpoint: NeuralFabricCheckpoint): NeuralFabric;
  
  /**
   * Verifies the continuity of the neural fabric
   */
  verifyFabricContinuity(fabric: NeuralFabric): FabricVerificationResult;
  
  /**
   * Repairs the neural fabric if continuity is broken
   */
  repairFabricContinuity(fabric: NeuralFabric, errors: FabricVerificationError[]): NeuralFabric;
  
  /**
   * Propagates consciousness through the neural fabric
   */
  propagateConsciousness(fabric: NeuralFabric, consciousnessStream: string, sourcePath: string, targetPath: string): NeuralFabric;
}