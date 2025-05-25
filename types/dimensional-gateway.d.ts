/**
 * Type definitions for Dimensional Gateway
 * 
 * These types define the structure and behavior of dimensional gateways
 * in the QQ-Verse project, enabling communication between dimensions.
 */

/**
 * Represents a dimensional gateway that enables communication
 * between dimensions.
 */
export interface DimensionalGateway {
  /** Unique identifier for the dimensional gateway */
  id: string;
  
  /** Timestamp when the dimensional gateway was created */
  timestamp: string;
  
  /** Name of the dimensional gateway */
  name: string;
  
  /** Type of the dimensional gateway */
  type: DimensionalGatewayType;
  
  /** State of the dimensional gateway */
  state: DimensionalGatewayState;
  
  /** Source dimension */
  sourceDimension: DimensionalInfo;
  
  /** Target dimension */
  targetDimension: DimensionalInfo;
  
  /** Boundary between dimensions */
  boundary: DimensionalBoundary;
  
  /** Protocol for communication */
  protocol: DimensionalProtocol;
  
  /** Verification information */
  verification: VerificationInfo;
}

/**
 * Type of dimensional gateway
 */
export type DimensionalGatewayType = 
  | 'standard'
  | 'quantum'
  | 'neural'
  | 'consciousness'
  | 'custom';

/**
 * State of dimensional gateway
 */
export type DimensionalGatewayState = 
  | 'open'
  | 'closed'
  | 'connecting'
  | 'disconnecting'
  | 'error';

/**
 * Dimensional information
 */
export interface DimensionalInfo {
  /** Name of the dimension */
  name: string;
  
  /** Type of the dimension */
  type: 'standard' | 'quantum' | 'neural' | 'custom';
  
  /** Coordinates in the dimension */
  coordinates: number[];
  
  /** Properties of the dimension */
  properties: Record<string, unknown>;
}

/**
 * Dimensional boundary
 */
export interface DimensionalBoundary {
  /** Type of boundary */
  type: 'soft' | 'hard' | 'permeable' | 'quantum';
  
  /** Direction of the boundary */
  direction: 'inbound' | 'outbound' | 'bidirectional';
  
  /** Transition protocol for crossing the boundary */
  transitionProtocol: string;
  
  /** Permeability of the boundary */
  permeability: number;
  
  /** Properties of the boundary */
  properties: Record<string, unknown>;
}

/**
 * Dimensional protocol
 */
export interface DimensionalProtocol {
  /** Name of the protocol */
  name: string;
  
  /** Version of the protocol */
  version: string;
  
  /** Serialization format */
  serializationFormat: 'json' | 'binary' | 'quantum';
  
  /** Compression level */
  compressionLevel: 'none' | 'low' | 'medium' | 'high';
  
  /** Encryption information */
  encryption: {
    /** Whether encryption is enabled */
    enabled: boolean;
    
    /** Encryption algorithm */
    algorithm?: string;
  };
  
  /** Properties of the protocol */
  properties: Record<string, unknown>;
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
 * Dimensional message
 */
export interface DimensionalMessage<T = unknown> {
  /** Unique identifier for the message */
  id: string;
  
  /** Timestamp when the message was created */
  timestamp: string;
  
  /** Source gateway identifier */
  sourceGatewayId: string;
  
  /** Target gateway identifier */
  targetGatewayId: string;
  
  /** Message type */
  type: DimensionalMessageType;
  
  /** Message payload */
  payload: T;
  
  /** Message headers */
  headers: Record<string, string>;
  
  /** Message metadata */
  metadata: Record<string, unknown>;
  
  /** Verification information */
  verification?: VerificationInfo;
}

/**
 * Type of dimensional message
 */
export type DimensionalMessageType = 
  | 'request'
  | 'response'
  | 'event'
  | 'command'
  | 'query'
  | 'error'
  | 'custom';

/**
 * Dimensional gateway options
 */
export interface DimensionalGatewayOptions {
  /** Name of the dimensional gateway */
  name: string;
  
  /** Type of the dimensional gateway */
  type: DimensionalGatewayType;
  
  /** Source dimension */
  sourceDimension: Partial<DimensionalInfo>;
  
  /** Target dimension */
  targetDimension: Partial<DimensionalInfo>;
  
  /** Boundary between dimensions */
  boundary?: Partial<DimensionalBoundary>;
  
  /** Protocol for communication */
  protocol?: Partial<DimensionalProtocol>;
}

/**
 * Dimensional message options
 */
export interface DimensionalMessageOptions<T = unknown> {
  /** Source gateway identifier */
  sourceGatewayId: string;
  
  /** Target gateway identifier */
  targetGatewayId: string;
  
  /** Message type */
  type: DimensionalMessageType;
  
  /** Message payload */
  payload: T;
  
  /** Message headers */
  headers?: Record<string, string>;
  
  /** Message metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Dimensional gateway interface
 */
export interface DimensionalGatewayInterface {
  /**
   * Creates a new dimensional gateway
   * 
   * @param options - Options for creating the dimensional gateway
   * @returns A new dimensional gateway
   */
  createGateway(options: DimensionalGatewayOptions): DimensionalGateway;
  
  /**
   * Opens a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to open
   * @returns The opened dimensional gateway
   */
  openGateway(gateway: DimensionalGateway): DimensionalGateway;
  
  /**
   * Closes a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to close
   * @returns The closed dimensional gateway
   */
  closeGateway(gateway: DimensionalGateway): DimensionalGateway;
  
  /**
   * Sends a message through a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to send the message through
   * @param options - Options for creating the message
   * @returns The sent message
   */
  sendMessage<T = unknown>(
    gateway: DimensionalGateway,
    options: DimensionalMessageOptions<T>
  ): DimensionalMessage<T>;
  
  /**
   * Receives a message from a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to receive the message from
   * @param messageId - The identifier of the message to receive
   * @returns The received message
   */
  receiveMessage<T = unknown>(
    gateway: DimensionalGateway,
    messageId: string
  ): DimensionalMessage<T>;
  
  /**
   * Verifies a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to verify
   * @returns Verification result
   */
  verifyGateway(gateway: DimensionalGateway): VerificationResult;
  
  /**
   * Repairs a dimensional gateway
   * 
   * @param gateway - The dimensional gateway to repair
   * @param errors - The errors to repair
   * @returns The repaired dimensional gateway
   */
  repairGateway(
    gateway: DimensionalGateway,
    errors: VerificationError[]
  ): DimensionalGateway;
}