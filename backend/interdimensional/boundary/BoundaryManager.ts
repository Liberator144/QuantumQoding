/**
 * Boundary Manager
 * 
 * Manages boundaries between dimensions, ensuring proper isolation and controlled
 * interaction between different dimensional contexts.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  ConsciousnessStreamPacket 
} from '../consciousness/ConsciousnessStreamProtocol';
import { 
  QuantumState 
} from '../quantum/QuantumStateManager';
import {
  NeuralFabricManager,
  NeuralNodeType,
  NeuralConnectionType
} from '../neural/NeuralFabricManager';

/**
 * Boundary type
 */
export enum BoundaryType {
  /** Permeable boundary */
  PERMEABLE = 'PERMEABLE',
  
  /** Semi-permeable boundary */
  SEMI_PERMEABLE = 'SEMI_PERMEABLE',
  
  /** Impermeable boundary */
  IMPERMEABLE = 'IMPERMEABLE',
  
  /** Quantum boundary */
  QUANTUM = 'QUANTUM',
  
  /** Custom boundary */
  CUSTOM = 'CUSTOM'
}/**
 * Boundary state
 */
export enum BoundaryState {
  /** Open boundary */
  OPEN = 'OPEN',
  
  /** Closed boundary */
  CLOSED = 'CLOSED',
  
  /** Partially open boundary */
  PARTIALLY_OPEN = 'PARTIALLY_OPEN',
  
  /** Quantum entangled boundary */
  QUANTUM_ENTANGLED = 'QUANTUM_ENTANGLED'
}

/**
 * Boundary permission
 */
export enum BoundaryPermission {
  /** Allow all */
  ALLOW_ALL = 'ALLOW_ALL',
  
  /** Deny all */
  DENY_ALL = 'DENY_ALL',
  
  /** Allow consciousness */
  ALLOW_CONSCIOUSNESS = 'ALLOW_CONSCIOUSNESS',
  
  /** Allow quantum */
  ALLOW_QUANTUM = 'ALLOW_QUANTUM',
  
  /** Allow data */
  ALLOW_DATA = 'ALLOW_DATA',
  
  /** Custom permission */
  CUSTOM = 'CUSTOM'
}

/**
 * Boundary
 */
export interface Boundary {
  /** Boundary ID */
  id: string;
  
  /** Boundary name */
  name: string;
  
  /** Boundary type */
  type: BoundaryType;
  
  /** Boundary state */
  state: BoundaryState;
  
  /** Source dimension ID */
  sourceDimensionId: string;
  
  /** Target dimension ID */
  targetDimensionId: string;  
  /** Permissions */
  permissions: BoundaryPermission[];
  
  /** Custom permissions */
  customPermissions?: Record<string, any>;
  
  /** Quantum entanglement */
  quantumEntanglement?: {
    /** Entanglement type */
    type: 'direct' | 'indirect' | 'quantum' | 'custom';
    
    /** Entanglement strength */
    strength: number;
    
    /** Entanglement coherence */
    coherence: number;
  };
  
  /** Neural fabric connection ID */
  neuralFabricConnectionId?: string;
  
  /** Boundary metadata */
  metadata: Record<string, any>;
}

/**
 * Dimension
 */
export interface Dimension {
  /** Dimension ID */
  id: string;
  
  /** Dimension name */
  name: string;
  
  /** Dimension type */
  type: 'physical' | 'virtual' | 'quantum' | 'consciousness' | 'custom';
  
  /** Dimension state */
  state: 'active' | 'inactive' | 'transitioning';
  
  /** Dimension coordinates */
  coordinates: number[];
  
  /** Dimension properties */
  properties: Record<string, any>;
  
  /** Dimension metadata */
  metadata: Record<string, any>;
}/**
 * Boundary crossing
 */
export interface BoundaryCrossing {
  /** Crossing ID */
  id: string;
  
  /** Boundary ID */
  boundaryId: string;
  
  /** Source dimension ID */
  sourceDimensionId: string;
  
  /** Target dimension ID */
  targetDimensionId: string;
  
  /** Crossing timestamp */
  timestamp: string;
  
  /** Crossing type */
  type: 'consciousness' | 'quantum' | 'data' | 'custom';
  
  /** Crossing payload */
  payload: {
    /** Consciousness stream packet */
    consciousnessStreamPacket?: ConsciousnessStreamPacket<any>;
    
    /** Quantum state */
    quantumState?: QuantumState;
    
    /** Data */
    data?: any;
  };
  
  /** Crossing result */
  result: 'success' | 'failure' | 'partial';
  
  /** Crossing error */
  error?: string;
  
  /** Crossing metadata */
  metadata: Record<string, any>;
}

/**
 * Boundary manager options
 */
export interface BoundaryManagerOptions {
  /** Initial dimensions */
  initialDimensions?: Partial<Dimension>[];
  
  /** Initial boundaries */
  initialBoundaries?: Partial<Boundary>[];
  
  /** Neural fabric manager */
  neuralFabricManager?: NeuralFabricManager;
  
  /** Debug mode */
  debugMode?: boolean;
}/**
 * Boundary manager
 */
export class BoundaryManager {
  /** Dimensions */
  private dimensions: Map<string, Dimension> = new Map();
  
  /** Boundaries */
  private boundaries: Map<string, Boundary> = new Map();
  
  /** Boundary crossings */
  private boundaryCrossings: BoundaryCrossing[] = [];
  
  /** Neural fabric manager */
  private neuralFabricManager?: NeuralFabricManager;
  
  /** Debug mode */
  private debugMode: boolean;
  
  /**
   * Constructor
   * @param options - Boundary manager options
   */
  constructor(options: BoundaryManagerOptions = {}) {
    this.debugMode = options.debugMode || false;
    this.neuralFabricManager = options.neuralFabricManager;
    
    // Initialize dimensions
    if (options.initialDimensions) {
      for (const dimension of options.initialDimensions) {
        this.createDimension(dimension);
      }
    }
    
    // Initialize boundaries
    if (options.initialBoundaries) {
      for (const boundary of options.initialBoundaries) {
        this.createBoundary(boundary);
      }
    }
    
    // Log initialization
    this.log('Boundary manager initialized');
  }  
  /**
   * Create a dimension
   * @param dimension - Dimension to create
   * @returns Created dimension
   */
  public createDimension(dimension: Partial<Dimension>): Dimension {
    const newDimension: Dimension = {
      id: dimension.id || uuidv4(),
      name: dimension.name || `Dimension-${uuidv4().slice(0, 8)}`,
      type: dimension.type || 'custom',
      state: dimension.state || 'active',
      coordinates: dimension.coordinates || [0, 0, 0],
      properties: dimension.properties || {},
      metadata: dimension.metadata || {},
    };
    
    this.dimensions.set(newDimension.id, newDimension);
    
    // Log dimension creation
    this.log(`Created dimension: ${newDimension.id} (${newDimension.name})`);
    
    return newDimension;
  }
  
  /**
   * Get a dimension
   * @param dimensionId - Dimension ID
   * @returns Dimension
   */
  public getDimension(dimensionId: string): Dimension | undefined {
    return this.dimensions.get(dimensionId);
  }
  
  /**
   * Get all dimensions
   * @returns All dimensions
   */
  public getAllDimensions(): Dimension[] {
    return Array.from(this.dimensions.values());
  }
  
  /**
   * Create a boundary
   * @param boundary - Boundary to create
   * @returns Created boundary
   */
  public createBoundary(boundary: Partial<Boundary>): Boundary {
    const newBoundary: Boundary = {
      id: boundary.id || uuidv4(),
      name: boundary.name || `Boundary-${uuidv4().slice(0, 8)}`,
      type: boundary.type || BoundaryType.PERMEABLE,
      state: boundary.state || BoundaryState.OPEN,
      sourceDimensionId: boundary.sourceDimensionId || '',
      targetDimensionId: boundary.targetDimensionId || '',
      permissions: boundary.permissions || [BoundaryPermission.ALLOW_ALL],
      customPermissions: boundary.customPermissions,
      quantumEntanglement: boundary.quantumEntanglement,
      neuralFabricConnectionId: boundary.neuralFabricConnectionId,
      metadata: boundary.metadata || {},
    };    
    // Validate dimensions
    if (newBoundary.sourceDimensionId && !this.dimensions.has(newBoundary.sourceDimensionId)) {
      throw new Error(`Source dimension ${newBoundary.sourceDimensionId} does not exist`);
    }
    
    if (newBoundary.targetDimensionId && !this.dimensions.has(newBoundary.targetDimensionId)) {
      throw new Error(`Target dimension ${newBoundary.targetDimensionId} does not exist`);
    }
    
    // Create neural fabric connection if neural fabric manager is available
    if (this.neuralFabricManager && !newBoundary.neuralFabricConnectionId) {
      // Create source and target nodes
      const sourceNode = this.neuralFabricManager.addNode({
        type: NeuralNodeType.CUSTOM,
        name: `Dimension-${newBoundary.sourceDimensionId}`,
        metadata: {
          dimensionId: newBoundary.sourceDimensionId,
          boundaryId: newBoundary.id,
        },
      });
      
      const targetNode = this.neuralFabricManager.addNode({
        type: NeuralNodeType.CUSTOM,
        name: `Dimension-${newBoundary.targetDimensionId}`,
        metadata: {
          dimensionId: newBoundary.targetDimensionId,
          boundaryId: newBoundary.id,
        },
      });
      
      // Create connection
      const connection = this.neuralFabricManager.connectNodes(
        sourceNode.id,
        targetNode.id,
        NeuralConnectionType.CUSTOM,
        {
          strength: 1.0,
          bidirectional: true,
          metadata: {
            boundaryId: newBoundary.id,
            boundaryType: newBoundary.type,
            boundaryState: newBoundary.state,
          },
        }
      );
      
      // Set neural fabric connection ID
      newBoundary.neuralFabricConnectionId = connection.id;
    }    
    this.boundaries.set(newBoundary.id, newBoundary);
    
    // Log boundary creation
    this.log(`Created boundary: ${newBoundary.id} (${newBoundary.name})`);
    
    return newBoundary;
  }
  
  /**
   * Get a boundary
   * @param boundaryId - Boundary ID
   * @returns Boundary
   */
  public getBoundary(boundaryId: string): Boundary | undefined {
    return this.boundaries.get(boundaryId);
  }
  
  /**
   * Get all boundaries
   * @returns All boundaries
   */
  public getAllBoundaries(): Boundary[] {
    return Array.from(this.boundaries.values());
  }
  
  /**
   * Get boundaries between dimensions
   * @param sourceDimensionId - Source dimension ID
   * @param targetDimensionId - Target dimension ID
   * @returns Boundaries between dimensions
   */
  public getBoundariesBetweenDimensions(
    sourceDimensionId: string,
    targetDimensionId: string
  ): Boundary[] {
    return Array.from(this.boundaries.values()).filter(
      boundary =>
        boundary.sourceDimensionId === sourceDimensionId &&
        boundary.targetDimensionId === targetDimensionId
    );
  }
  
  /**
   * Update boundary state
   * @param boundaryId - Boundary ID
   * @param state - New state
   * @returns Updated boundary
   */
  public updateBoundaryState(boundaryId: string, state: BoundaryState): Boundary {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }    
    boundary.state = state;
    
    // Update neural fabric connection if available
    if (this.neuralFabricManager && boundary.neuralFabricConnectionId) {
      const connections = this.neuralFabricManager.getFabric().connections;
      const connection = connections.find(c => c.id === boundary.neuralFabricConnectionId);
      
      if (connection) {
        connection.state = state === BoundaryState.OPEN ? 'active' : 'inactive';
        connection.metadata = {
          ...connection.metadata,
          boundaryState: state,
          updatedAt: Date.now(),
        };
      }
    }
    
    // Log boundary state update
    this.log(`Updated boundary state: ${boundaryId} (${state})`);
    
    return boundary;
  }
  
  /**
   * Update boundary permissions
   * @param boundaryId - Boundary ID
   * @param permissions - New permissions
   * @returns Updated boundary
   */
  public updateBoundaryPermissions(
    boundaryId: string,
    permissions: BoundaryPermission[]
  ): Boundary {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }
    
    boundary.permissions = permissions;
    
    // Log boundary permissions update
    this.log(`Updated boundary permissions: ${boundaryId}`);
    
    return boundary;
  }  
  /**
   * Cross boundary with consciousness stream
   * @param boundaryId - Boundary ID
   * @param packet - Consciousness stream packet
   * @returns Boundary crossing
   */
  public crossBoundaryWithConsciousness<T>(
    boundaryId: string,
    packet: ConsciousnessStreamPacket<T>
  ): BoundaryCrossing {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }
    
    // Check if boundary is open
    if (boundary.state === BoundaryState.CLOSED) {
      return this.createBoundaryCrossing(
        boundaryId,
        'consciousness',
        { consciousnessStreamPacket: packet },
        'failure',
        'Boundary is closed'
      );
    }
    
    // Check permissions
    const hasPermission = boundary.permissions.some(
      permission =>
        permission === BoundaryPermission.ALLOW_ALL ||
        permission === BoundaryPermission.ALLOW_CONSCIOUSNESS
    );
    
    if (!hasPermission) {
      return this.createBoundaryCrossing(
        boundaryId,
        'consciousness',
        { consciousnessStreamPacket: packet },
        'failure',
        'Boundary does not allow consciousness crossing'
      );
    }
    
    // Propagate consciousness through neural fabric if available
    if (this.neuralFabricManager && boundary.neuralFabricConnectionId) {
      this.neuralFabricManager.propagateConsciousness(
        packet,
        boundary.sourceDimensionId,
        boundary.targetDimensionId
      );
    }    
    // Create boundary crossing
    return this.createBoundaryCrossing(
      boundaryId,
      'consciousness',
      { consciousnessStreamPacket: packet },
      'success'
    );
  }
  
  /**
   * Cross boundary with quantum state
   * @param boundaryId - Boundary ID
   * @param quantumState - Quantum state
   * @returns Boundary crossing
   */
  public crossBoundaryWithQuantumState(
    boundaryId: string,
    quantumState: QuantumState
  ): BoundaryCrossing {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }
    
    // Check if boundary is open
    if (boundary.state === BoundaryState.CLOSED) {
      return this.createBoundaryCrossing(
        boundaryId,
        'quantum',
        { quantumState },
        'failure',
        'Boundary is closed'
      );
    }
    
    // Check permissions
    const hasPermission = boundary.permissions.some(
      permission =>
        permission === BoundaryPermission.ALLOW_ALL ||
        permission === BoundaryPermission.ALLOW_QUANTUM
    );
    
    if (!hasPermission) {
      return this.createBoundaryCrossing(
        boundaryId,
        'quantum',
        { quantumState },
        'failure',
        'Boundary does not allow quantum crossing'
      );
    }    
    // Synchronize quantum states through neural fabric if available
    if (this.neuralFabricManager && boundary.neuralFabricConnectionId) {
      this.neuralFabricManager.synchronizeQuantumStates(
        quantumState.id,
        `${quantumState.id}-${boundary.targetDimensionId}`
      );
    }
    
    // Create boundary crossing
    return this.createBoundaryCrossing(
      boundaryId,
      'quantum',
      { quantumState },
      'success'
    );
  }
  
  /**
   * Cross boundary with data
   * @param boundaryId - Boundary ID
   * @param data - Data
   * @returns Boundary crossing
   */
  public crossBoundaryWithData(
    boundaryId: string,
    data: any
  ): BoundaryCrossing {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }
    
    // Check if boundary is open
    if (boundary.state === BoundaryState.CLOSED) {
      return this.createBoundaryCrossing(
        boundaryId,
        'data',
        { data },
        'failure',
        'Boundary is closed'
      );
    }
    
    // Check permissions
    const hasPermission = boundary.permissions.some(
      permission =>
        permission === BoundaryPermission.ALLOW_ALL ||
        permission === BoundaryPermission.ALLOW_DATA
    );
    
    if (!hasPermission) {
      return this.createBoundaryCrossing(
        boundaryId,
        'data',
        { data },
        'failure',
        'Boundary does not allow data crossing'
      );
    }    
    // Create boundary crossing
    return this.createBoundaryCrossing(
      boundaryId,
      'data',
      { data },
      'success'
    );
  }
  
  /**
   * Get boundary crossings
   * @param boundaryId - Boundary ID
   * @returns Boundary crossings
   */
  public getBoundaryCrossings(boundaryId: string): BoundaryCrossing[] {
    return this.boundaryCrossings.filter(crossing => crossing.boundaryId === boundaryId);
  }
  
  /**
   * Create boundary crossing
   * @param boundaryId - Boundary ID
   * @param type - Crossing type
   * @param payload - Crossing payload
   * @param result - Crossing result
   * @param error - Crossing error
   * @returns Created boundary crossing
   */
  private createBoundaryCrossing(
    boundaryId: string,
    type: BoundaryCrossing['type'],
    payload: BoundaryCrossing['payload'],
    result: BoundaryCrossing['result'],
    error?: string
  ): BoundaryCrossing {
    const boundary = this.boundaries.get(boundaryId);
    
    if (!boundary) {
      throw new Error(`Boundary ${boundaryId} does not exist`);
    }
    
    const crossing: BoundaryCrossing = {
      id: uuidv4(),
      boundaryId,
      sourceDimensionId: boundary.sourceDimensionId,
      targetDimensionId: boundary.targetDimensionId,
      timestamp: new Date().toISOString(),
      type,
      payload,
      result,
      error,
      metadata: {
        boundaryType: boundary.type,
        boundaryState: boundary.state,
        boundaryPermissions: boundary.permissions,
      },
    };
    
    this.boundaryCrossings.push(crossing);
    
    // Log boundary crossing
    this.log(`Boundary crossing: ${crossing.id} (${crossing.result})`);
    
    return crossing;
  }
  
  /**
   * Log a message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.debugMode) {
      console.log(`[BoundaryManager] ${message}`);
    }
  }
}

export default BoundaryManager;