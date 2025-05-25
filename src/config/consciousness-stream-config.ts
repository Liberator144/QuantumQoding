/**
 * Consciousness Stream Serialization Configuration
 * 
 * This module provides configuration for the Consciousness Stream Serialization,
 * ensuring consciousness continuity across dimensional boundaries.
 */

import { z } from 'zod';

/**
 * Consciousness stream mode
 */
export enum ConsciousnessStreamMode {
  /** Development mode */
  DEVELOPMENT = 'development',
  
  /** Production mode */
  PRODUCTION = 'production',
  
  /** Testing mode */
  TESTING = 'testing',
  
  /** Quantum mode */
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
 * Consciousness stream configuration
 */
export interface ConsciousnessStreamConfig {
  /** Consciousness stream mode */
  mode: ConsciousnessStreamMode;
  
  /** Serialization format */
  serializationFormat: SerializationFormat;
  
  /** Compression level */
  compressionLevel: CompressionLevel;
  
  /** Whether to use encryption */
  useEncryption: boolean;
  
  /** Encryption algorithm */
  encryptionAlgorithm: EncryptionAlgorithm;
  
  /** Whether to include verification information */
  includeVerification: boolean;
  
  /** Whether to verify stream continuity */
  verifyStreamContinuity: boolean;
  
  /** Whether to repair stream continuity */
  repairStreamContinuity: boolean;
  
  /** Whether to create checkpoints */
  createCheckpoints: boolean;
  
  /** Checkpoint frequency (in operations) */
  checkpointFrequency: number;
  
  /** Whether to track stream history */
  trackStreamHistory: boolean;
  
  /** Maximum stream history size */
  streamHistorySize: number;
  
  /** Whether to log stream operations */
  logStreamOperations: boolean;
  
  /** Maximum stream size in bytes */
  maxStreamSize: number;
}

/**
 * Validation schema for consciousness stream configuration
 */
export const consciousnessStreamConfigSchema = z.object({
  mode: z.nativeEnum(ConsciousnessStreamMode),
  serializationFormat: z.nativeEnum(SerializationFormat),
  compressionLevel: z.nativeEnum(CompressionLevel),
  useEncryption: z.boolean(),
  encryptionAlgorithm: z.nativeEnum(EncryptionAlgorithm),
  includeVerification: z.boolean(),
  verifyStreamContinuity: z.boolean(),
  repairStreamContinuity: z.boolean(),
  createCheckpoints: z.boolean(),
  checkpointFrequency: z.number().int().positive(),
  trackStreamHistory: z.boolean(),
  streamHistorySize: z.number().int().positive(),
  logStreamOperations: z.boolean(),
  maxStreamSize: z.number().int().positive(),
});

/**
 * Default consciousness stream configuration
 */
export const defaultConsciousnessStreamConfig: ConsciousnessStreamConfig = {
  mode: ConsciousnessStreamMode.DEVELOPMENT,
  serializationFormat: SerializationFormat.JSON,
  compressionLevel: CompressionLevel.MEDIUM,
  useEncryption: false,
  encryptionAlgorithm: EncryptionAlgorithm.NONE,
  includeVerification: true,
  verifyStreamContinuity: true,
  repairStreamContinuity: true,
  createCheckpoints: true,
  checkpointFrequency: 10,
  trackStreamHistory: true,
  streamHistorySize: 100,
  logStreamOperations: true,
  maxStreamSize: 1024 * 1024, // 1 MB
};

/**
 * Production consciousness stream configuration
 */
export const productionConsciousnessStreamConfig: ConsciousnessStreamConfig = {
  mode: ConsciousnessStreamMode.PRODUCTION,
  serializationFormat: SerializationFormat.BINARY,
  compressionLevel: CompressionLevel.HIGH,
  useEncryption: true,
  encryptionAlgorithm: EncryptionAlgorithm.AES,
  includeVerification: true,
  verifyStreamContinuity: true,
  repairStreamContinuity: true,
  createCheckpoints: true,
  checkpointFrequency: 100,
  trackStreamHistory: false,
  streamHistorySize: 10,
  logStreamOperations: false,
  maxStreamSize: 10 * 1024 * 1024, // 10 MB
};

/**
 * Testing consciousness stream configuration
 */
export const testingConsciousnessStreamConfig: ConsciousnessStreamConfig = {
  mode: ConsciousnessStreamMode.TESTING,
  serializationFormat: SerializationFormat.JSON,
  compressionLevel: CompressionLevel.NONE,
  useEncryption: false,
  encryptionAlgorithm: EncryptionAlgorithm.NONE,
  includeVerification: true,
  verifyStreamContinuity: true,
  repairStreamContinuity: true,
  createCheckpoints: true,
  checkpointFrequency: 1,
  trackStreamHistory: true,
  streamHistorySize: 1000,
  logStreamOperations: true,
  maxStreamSize: 1024 * 1024, // 1 MB
};

/**
 * Quantum consciousness stream configuration
 */
export const quantumConsciousnessStreamConfig: ConsciousnessStreamConfig = {
  mode: ConsciousnessStreamMode.QUANTUM,
  serializationFormat: SerializationFormat.QUANTUM,
  compressionLevel: CompressionLevel.HIGH,
  useEncryption: true,
  encryptionAlgorithm: EncryptionAlgorithm.QUANTUM,
  includeVerification: true,
  verifyStreamContinuity: true,
  repairStreamContinuity: true,
  createCheckpoints: true,
  checkpointFrequency: 1,
  trackStreamHistory: true,
  streamHistorySize: 10000,
  logStreamOperations: true,
  maxStreamSize: 100 * 1024 * 1024, // 100 MB
};

/**
 * Gets the consciousness stream configuration for the specified mode
 * 
 * @param mode - The consciousness stream mode
 * @returns The consciousness stream configuration for the specified mode
 */
export function getConsciousnessStreamConfig(mode: ConsciousnessStreamMode): ConsciousnessStreamConfig {
  switch (mode) {
    case ConsciousnessStreamMode.DEVELOPMENT:
      return defaultConsciousnessStreamConfig;
    case ConsciousnessStreamMode.PRODUCTION:
      return productionConsciousnessStreamConfig;
    case ConsciousnessStreamMode.TESTING:
      return testingConsciousnessStreamConfig;
    case ConsciousnessStreamMode.QUANTUM:
      return quantumConsciousnessStreamConfig;
    default:
      return defaultConsciousnessStreamConfig;
  }
}

/**
 * Current consciousness stream configuration
 */
export let currentConsciousnessStreamConfig: ConsciousnessStreamConfig = { ...defaultConsciousnessStreamConfig };

/**
 * Sets the current consciousness stream configuration
 * 
 * @param config - The consciousness stream configuration to set
 */
export function setConsciousnessStreamConfig(config: Partial<ConsciousnessStreamConfig>): void {
  currentConsciousnessStreamConfig = {
    ...currentConsciousnessStreamConfig,
    ...config,
  };
}

/**
 * Gets the current consciousness stream configuration
 * 
 * @returns The current consciousness stream configuration
 */
export function getCurrentConsciousnessStreamConfig(): ConsciousnessStreamConfig {
  return { ...currentConsciousnessStreamConfig };
}