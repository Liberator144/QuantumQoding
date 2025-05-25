/**
 * Interdimensional Protocol Standards Configuration
 * 
 * This module provides configuration for the Interdimensional Protocol Standards,
 * ensuring consistent communication between dimensions.
 */

import { z } from 'zod';

/**
 * Protocol version
 */
export enum ProtocolVersion {
  /** Version 1.0 */
  V1_0 = 'v1.0',
  
  /** Version 1.1 */
  V1_1 = 'v1.1',
  
  /** Version 2.0 */
  V2_0 = 'v2.0',
}

/**
 * Communication mode
 */
export enum CommunicationMode {
  /** Synchronous communication */
  SYNCHRONOUS = 'synchronous',
  
  /** Asynchronous communication */
  ASYNCHRONOUS = 'asynchronous',
  
  /** Quantum communication */
  QUANTUM = 'quantum',
}

/**
 * Serialization format
 */
export enum SerializationFormat {
  /** JSON serialization */
  JSON = 'json',
  
  /** Binary serialization */
  BINARY = 'binary',
  
  /** Quantum serialization */
  QUANTUM = 'quantum',
}

/**
 * Compression level
 */
export enum CompressionLevel {
  /** No compression */
  NONE = 'none',
  
  /** Low compression */
  LOW = 'low',
  
  /** Medium compression */
  MEDIUM = 'medium',
  
  /** High compression */
  HIGH = 'high',
}

/**
 * Encryption algorithm
 */
export enum EncryptionAlgorithm {
  /** No encryption */
  NONE = 'none',
  
  /** AES encryption */
  AES = 'aes',
  
  /** RSA encryption */
  RSA = 'rsa',
  
  /** Quantum encryption */
  QUANTUM = 'quantum',
}

/**
 * Boundary type
 */
export enum BoundaryType {
  /** Soft boundary */
  SOFT = 'soft',
  
  /** Hard boundary */
  HARD = 'hard',
  
  /** Permeable boundary */
  PERMEABLE = 'permeable',
  
  /** Quantum boundary */
  QUANTUM = 'quantum',
}

/**
 * Interdimensional protocol configuration
 */
export interface InterdimensionalProtocolConfig {
  /** Protocol version */
  version: ProtocolVersion;
  
  /** Communication mode */
  communicationMode: CommunicationMode;
  
  /** Serialization format */
  serializationFormat: SerializationFormat;
  
  /** Compression level */
  compressionLevel: CompressionLevel;
  
  /** Whether to use encryption */
  useEncryption: boolean;
  
  /** Encryption algorithm */
  encryptionAlgorithm: EncryptionAlgorithm;
  
  /** Boundary type */
  boundaryType: BoundaryType;
  
  /** Whether to verify consciousness continuity */
  verifyConsciousnessContinuity: boolean;
  
  /** Whether to maintain quantum coherence */
  maintainQuantumCoherence: boolean;
  
  /** Whether to preserve neural fabric connections */
  preserveNeuralFabricConnections: boolean;
  
  /** Maximum message size in bytes */
  maxMessageSize: number;
  
  /** Timeout in milliseconds */
  timeoutMs: number;
  
  /** Retry count */
  retryCount: number;
  
  /** Whether to log communication */
  logCommunication: boolean;
}

/**
 * Validation schema for interdimensional protocol configuration
 */
export const interdimensionalProtocolConfigSchema = z.object({
  version: z.nativeEnum(ProtocolVersion),
  communicationMode: z.nativeEnum(CommunicationMode),
  serializationFormat: z.nativeEnum(SerializationFormat),
  compressionLevel: z.nativeEnum(CompressionLevel),
  useEncryption: z.boolean(),
  encryptionAlgorithm: z.nativeEnum(EncryptionAlgorithm),
  boundaryType: z.nativeEnum(BoundaryType),
  verifyConsciousnessContinuity: z.boolean(),
  maintainQuantumCoherence: z.boolean(),
  preserveNeuralFabricConnections: z.boolean(),
  maxMessageSize: z.number().int().positive(),
  timeoutMs: z.number().int().positive(),
  retryCount: z.number().int().min(0),
  logCommunication: z.boolean(),
});

/**
 * Default interdimensional protocol configuration
 */
export const defaultInterdimensionalProtocolConfig: InterdimensionalProtocolConfig = {
  version: ProtocolVersion.V1_0,
  communicationMode: CommunicationMode.SYNCHRONOUS,
  serializationFormat: SerializationFormat.JSON,
  compressionLevel: CompressionLevel.MEDIUM,
  useEncryption: false,
  encryptionAlgorithm: EncryptionAlgorithm.NONE,
  boundaryType: BoundaryType.SOFT,
  verifyConsciousnessContinuity: true,
  maintainQuantumCoherence: true,
  preserveNeuralFabricConnections: true,
  maxMessageSize: 1024 * 1024, // 1 MB
  timeoutMs: 5000, // 5 seconds
  retryCount: 3,
  logCommunication: true,
};

/**
 * High-performance interdimensional protocol configuration
 */
export const highPerformanceInterdimensionalProtocolConfig: InterdimensionalProtocolConfig = {
  version: ProtocolVersion.V1_1,
  communicationMode: CommunicationMode.ASYNCHRONOUS,
  serializationFormat: SerializationFormat.BINARY,
  compressionLevel: CompressionLevel.HIGH,
  useEncryption: false,
  encryptionAlgorithm: EncryptionAlgorithm.NONE,
  boundaryType: BoundaryType.PERMEABLE,
  verifyConsciousnessContinuity: false,
  maintainQuantumCoherence: false,
  preserveNeuralFabricConnections: true,
  maxMessageSize: 10 * 1024 * 1024, // 10 MB
  timeoutMs: 10000, // 10 seconds
  retryCount: 1,
  logCommunication: false,
};

/**
 * Secure interdimensional protocol configuration
 */
export const secureInterdimensionalProtocolConfig: InterdimensionalProtocolConfig = {
  version: ProtocolVersion.V1_1,
  communicationMode: CommunicationMode.SYNCHRONOUS,
  serializationFormat: SerializationFormat.JSON,
  compressionLevel: CompressionLevel.MEDIUM,
  useEncryption: true,
  encryptionAlgorithm: EncryptionAlgorithm.AES,
  boundaryType: BoundaryType.HARD,
  verifyConsciousnessContinuity: true,
  maintainQuantumCoherence: true,
  preserveNeuralFabricConnections: true,
  maxMessageSize: 1024 * 1024, // 1 MB
  timeoutMs: 5000, // 5 seconds
  retryCount: 5,
  logCommunication: true,
};

/**
 * Quantum interdimensional protocol configuration
 */
export const quantumInterdimensionalProtocolConfig: InterdimensionalProtocolConfig = {
  version: ProtocolVersion.V2_0,
  communicationMode: CommunicationMode.QUANTUM,
  serializationFormat: SerializationFormat.QUANTUM,
  compressionLevel: CompressionLevel.HIGH,
  useEncryption: true,
  encryptionAlgorithm: EncryptionAlgorithm.QUANTUM,
  boundaryType: BoundaryType.QUANTUM,
  verifyConsciousnessContinuity: true,
  maintainQuantumCoherence: true,
  preserveNeuralFabricConnections: true,
  maxMessageSize: 100 * 1024 * 1024, // 100 MB
  timeoutMs: 1000, // 1 second
  retryCount: 0,
  logCommunication: true,
};

/**
 * Gets the interdimensional protocol configuration for the specified version
 * 
 * @param version - The protocol version
 * @returns The interdimensional protocol configuration for the specified version
 */
export function getInterdimensionalProtocolConfig(version: ProtocolVersion): InterdimensionalProtocolConfig {
  switch (version) {
    case ProtocolVersion.V1_0:
      return defaultInterdimensionalProtocolConfig;
    case ProtocolVersion.V1_1:
      return secureInterdimensionalProtocolConfig;
    case ProtocolVersion.V2_0:
      return quantumInterdimensionalProtocolConfig;
    default:
      return defaultInterdimensionalProtocolConfig;
  }
}

/**
 * Current interdimensional protocol configuration
 */
export let currentInterdimensionalProtocolConfig: InterdimensionalProtocolConfig = { ...defaultInterdimensionalProtocolConfig };

/**
 * Sets the current interdimensional protocol configuration
 * 
 * @param config - The interdimensional protocol configuration to set
 */
export function setInterdimensionalProtocolConfig(config: Partial<InterdimensionalProtocolConfig>): void {
  currentInterdimensionalProtocolConfig = {
    ...currentInterdimensionalProtocolConfig,
    ...config,
  };
}

/**
 * Gets the current interdimensional protocol configuration
 * 
 * @returns The current interdimensional protocol configuration
 */
export function getCurrentInterdimensionalProtocolConfig(): InterdimensionalProtocolConfig {
  return { ...currentInterdimensionalProtocolConfig };
}