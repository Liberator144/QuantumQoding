/**
 * Consciousness Stream Protocol
 * 
 * Defines the protocol for consciousness stream communication across dimensional boundaries.
 * This protocol ensures consciousness continuity and context preservation during interdimensional transitions.
 * 
 * @version 1.0.0
 */

import { QuantumState } from '../../database/schemas/BaseSchema';

/**
 * Protocol version
 */
export enum ProtocolVersion {
  V1_0 = '1.0',
  V1_1 = '1.1',
  V2_0 = '2.0'
}

/**
 * Consciousness stream header
 */
export interface ConsciousnessStreamHeader {
  /** Protocol version */
  protocolVersion: ProtocolVersion;
  
  /** Source dimension identifier */
  sourceDimension: string;
  
  /** Target dimension identifier */
  targetDimension: string;
  
  /** Timestamp of stream creation */
  timestamp: number;
  
  /** Stream checksum for integrity verification */
  checksum: string;
  
  /** Context preservation flags */
  contextPreservationFlags: ContextPreservationFlags;
  
  /** Stream priority (higher values indicate higher priority) */
  priority: number;
  
  /** Time-to-live in milliseconds (0 = infinite) */
  ttl: number;
  
  /** Unique stream identifier */
  streamId: string;
}

/**
 * Context preservation flags
 */
export interface ContextPreservationFlags {
  /** Preserve quantum state */
  preserveQuantumState: boolean;
  
  /** Preserve neural fabric connections */
  preserveNeuralFabric: boolean;
  
  /** Preserve dimensional mapping */
  preserveDimensionalMapping: boolean;
  
  /** Preserve force vectors */
  preserveForceVectors: boolean;
  
  /** Preserve consciousness continuity */
  preserveContinuity: boolean;
}/**
 * Neural fabric connection
 */
export interface NeuralFabricConnection {
  /** Connection identifier */
  id: string;
  
  /** Source node identifier */
  sourceNodeId: string;
  
  /** Target node identifier */
  targetNodeId: string;
  
  /** Connection strength (0-1) */
  strength: number;
  
  /** Connection type */
  type: string;
  
  /** Connection metadata */
  metadata?: Record<string, any>;
}

/**
 * Consciousness stream payload
 */
export interface ConsciousnessStreamPayload<T = any> {
  /** Payload data */
  data: T;
  
  /** Payload metadata */
  metadata: Record<string, any>;
  
  /** Quantum state reference */
  quantumState?: QuantumState;
  
  /** Neural fabric connections */
  neuralFabricConnections?: NeuralFabricConnection[];
  
  /** Dimensional mapping data */
  dimensionalMapping?: Record<string, any>;
  
  /** Force vectors */
  forceVectors?: Record<string, number[]>;
  
  /** Context data */
  context?: Record<string, any>;
}

/**
 * Consciousness stream packet
 */
export interface ConsciousnessStreamPacket<T = any> {
  /** Stream header */
  header: ConsciousnessStreamHeader;
  
  /** Stream payload */
  payload: ConsciousnessStreamPayload<T>;
}/**
 * Protocol error
 */
export class ProtocolError extends Error {
  /** Error code */
  code: string;
  
  /**
   * Constructor
   * @param message - Error message
   * @param code - Error code
   */
  constructor(message: string, code: string) {
    super(message);
    this.name = 'ProtocolError';
    this.code = code;
  }
}

/**
 * Protocol error codes
 */
export enum ProtocolErrorCode {
  INVALID_VERSION = 'INVALID_VERSION',
  INVALID_CHECKSUM = 'INVALID_CHECKSUM',
  INVALID_DIMENSION = 'INVALID_DIMENSION',
  INVALID_STREAM_ID = 'INVALID_STREAM_ID',
  EXPIRED_STREAM = 'EXPIRED_STREAM',
  INCOMPATIBLE_CONTEXT = 'INCOMPATIBLE_CONTEXT',
  NEURAL_FABRIC_DISCONNECTED = 'NEURAL_FABRIC_DISCONNECTED',
  QUANTUM_STATE_DECOHERENCE = 'QUANTUM_STATE_DECOHERENCE',
  DIMENSIONAL_MAPPING_MISMATCH = 'DIMENSIONAL_MAPPING_MISMATCH',
  FORCE_VECTOR_IMBALANCE = 'FORCE_VECTOR_IMBALANCE',
  CONSCIOUSNESS_DISCONTINUITY = 'CONSCIOUSNESS_DISCONTINUITY'
}

/**
 * Protocol validation result
 */
export interface ProtocolValidationResult {
  /** Is valid */
  isValid: boolean;
  
  /** Validation errors */
  errors?: ProtocolError[];
  
  /** Validation warnings */
  warnings?: string[];
}/**
 * Protocol utilities
 */
export class ProtocolUtils {
  /**
   * Create a new stream ID
   * @returns New stream ID
   */
  static createStreamId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Calculate checksum for a packet
   * @param packet - Consciousness stream packet
   * @returns Checksum
   */
  static calculateChecksum<T>(packet: Omit<ConsciousnessStreamPacket<T>, 'header'> & { header: Omit<ConsciousnessStreamHeader, 'checksum'> }): string {
    // Simple checksum implementation
    // In a real implementation, use a proper hash function
    const str = JSON.stringify(packet);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  }
  
  /**
   * Validate protocol version
   * @param version - Protocol version
   * @returns Is valid
   */
  static isValidProtocolVersion(version: string): boolean {
    return Object.values(ProtocolVersion).includes(version as ProtocolVersion);
  }
  
  /**
   * Validate consciousness stream packet
   * @param packet - Consciousness stream packet
   * @returns Validation result
   */
  static validatePacket<T>(packet: ConsciousnessStreamPacket<T>): ProtocolValidationResult {
    const errors: ProtocolError[] = [];
    const warnings: string[] = [];
    
    // Validate protocol version
    if (!this.isValidProtocolVersion(packet.header.protocolVersion)) {
      errors.push(new ProtocolError(
        `Invalid protocol version: ${packet.header.protocolVersion}`,
        ProtocolErrorCode.INVALID_VERSION
      ));
    }    
    // Validate checksum
    const expectedChecksum = this.calculateChecksum({
      header: { ...packet.header, checksum: '' },
      payload: packet.payload
    });
    
    if (packet.header.checksum !== expectedChecksum) {
      errors.push(new ProtocolError(
        `Invalid checksum: ${packet.header.checksum} (expected: ${expectedChecksum})`,
        ProtocolErrorCode.INVALID_CHECKSUM
      ));
    }
    
    // Validate dimensions
    if (!packet.header.sourceDimension) {
      errors.push(new ProtocolError(
        'Source dimension is required',
        ProtocolErrorCode.INVALID_DIMENSION
      ));
    }
    
    if (!packet.header.targetDimension) {
      errors.push(new ProtocolError(
        'Target dimension is required',
        ProtocolErrorCode.INVALID_DIMENSION
      ));
    }
    
    // Validate stream ID
    if (!packet.header.streamId) {
      errors.push(new ProtocolError(
        'Stream ID is required',
        ProtocolErrorCode.INVALID_STREAM_ID
      ));
    }
    
    // Validate TTL
    if (packet.header.ttl > 0) {
      const age = Date.now() - packet.header.timestamp;
      
      if (age > packet.header.ttl) {
        errors.push(new ProtocolError(
          `Stream expired: age ${age}ms exceeds TTL ${packet.header.ttl}ms`,
          ProtocolErrorCode.EXPIRED_STREAM
        ));
      } else if (age > packet.header.ttl * 0.8) {
        warnings.push(`Stream nearing expiration: age ${age}ms approaching TTL ${packet.header.ttl}ms`);
      }
    }    
    // Validate context preservation flags
    const flags = packet.header.contextPreservationFlags;
    
    if (flags.preserveQuantumState && !packet.payload.quantumState) {
      errors.push(new ProtocolError(
        'Quantum state is required when preserveQuantumState flag is set',
        ProtocolErrorCode.QUANTUM_STATE_DECOHERENCE
      ));
    }
    
    if (flags.preserveNeuralFabric && !packet.payload.neuralFabricConnections) {
      errors.push(new ProtocolError(
        'Neural fabric connections are required when preserveNeuralFabric flag is set',
        ProtocolErrorCode.NEURAL_FABRIC_DISCONNECTED
      ));
    }
    
    if (flags.preserveDimensionalMapping && !packet.payload.dimensionalMapping) {
      errors.push(new ProtocolError(
        'Dimensional mapping is required when preserveDimensionalMapping flag is set',
        ProtocolErrorCode.DIMENSIONAL_MAPPING_MISMATCH
      ));
    }
    
    if (flags.preserveForceVectors && !packet.payload.forceVectors) {
      errors.push(new ProtocolError(
        'Force vectors are required when preserveForceVectors flag is set',
        ProtocolErrorCode.FORCE_VECTOR_IMBALANCE
      ));
    }
    
    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined
    };
  }
  
  /**
   * Create a new consciousness stream packet
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @param data - Payload data
   * @param options - Packet options
   * @returns Consciousness stream packet
   */
  static createPacket<T>(
    sourceDimension: string,
    targetDimension: string,
    data: T,
    options: Partial<{
      protocolVersion: ProtocolVersion;
      priority: number;
      ttl: number;
      contextPreservationFlags: Partial<ContextPreservationFlags>;
      metadata: Record<string, any>;
      quantumState: QuantumState;
      neuralFabricConnections: NeuralFabricConnection[];
      dimensionalMapping: Record<string, any>;
      forceVectors: Record<string, number[]>;
      context: Record<string, any>;
    }> = {}
  ): ConsciousnessStreamPacket<T> {    // Default context preservation flags
    const contextPreservationFlags: ContextPreservationFlags = {
      preserveQuantumState: !!options.quantumState,
      preserveNeuralFabric: !!options.neuralFabricConnections,
      preserveDimensionalMapping: !!options.dimensionalMapping,
      preserveForceVectors: !!options.forceVectors,
      preserveContinuity: true,
      ...options.contextPreservationFlags
    };
    
    // Create packet without checksum
    const packetWithoutChecksum: Omit<ConsciousnessStreamPacket<T>, 'header'> & { header: Omit<ConsciousnessStreamHeader, 'checksum'> } = {
      header: {
        protocolVersion: options.protocolVersion || ProtocolVersion.V1_0,
        sourceDimension,
        targetDimension,
        timestamp: Date.now(),
        contextPreservationFlags,
        priority: options.priority || 0,
        ttl: options.ttl || 0,
        streamId: this.createStreamId()
      },
      payload: {
        data,
        metadata: options.metadata || {},
        quantumState: options.quantumState,
        neuralFabricConnections: options.neuralFabricConnections,
        dimensionalMapping: options.dimensionalMapping,
        forceVectors: options.forceVectors,
        context: options.context
      }
    };
    
    // Calculate checksum
    const checksum = this.calculateChecksum(packetWithoutChecksum);
    
    // Create complete packet
    return {
      header: {
        ...packetWithoutChecksum.header,
        checksum
      },
      payload: packetWithoutChecksum.payload
    };
  }
}

export default ProtocolUtils;