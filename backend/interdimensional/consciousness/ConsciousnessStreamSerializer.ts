/**
 * Consciousness Stream Serializer
 * 
 * Provides serialization and deserialization functions for consciousness stream packets.
 * Ensures context preservation during serialization and deserialization.
 * 
 * @version 1.0.0
 */

import { ConsciousnessStreamPacket, ProtocolError, ProtocolErrorCode, ProtocolUtils } from './ConsciousnessStreamProtocol';

/**
 * Serialization format
 */
export enum SerializationFormat {
  JSON = 'json',
  BINARY = 'binary',
  QUANTUM = 'quantum'
}

/**
 * Serialization options
 */
export interface SerializationOptions {
  /** Serialization format */
  format?: SerializationFormat;
  
  /** Compression enabled */
  compression?: boolean;
  
  /** Encryption enabled */
  encryption?: boolean;
  
  /** Encryption key (required if encryption is enabled) */
  encryptionKey?: string;
  
  /** Context preservation level (0-1, higher values preserve more context) */
  contextPreservationLevel?: number;
}

/**
 * Default serialization options
 */
const DEFAULT_OPTIONS: SerializationOptions = {
  format: SerializationFormat.JSON,
  compression: false,
  encryption: false,
  contextPreservationLevel: 1.0
};

/**
 * Serialization result
 */
export interface SerializationResult {
  /** Serialized data */
  data: string | Uint8Array;
  
  /** Serialization format */
  format: SerializationFormat;
  
  /** Is compressed */
  compressed: boolean;
  
  /** Is encrypted */
  encrypted: boolean;
  
  /** Context preservation level */
  contextPreservationLevel: number;
}/**
 * Deserialization options
 */
export interface DeserializationOptions {
  /** Expected format (auto-detect if not specified) */
  expectedFormat?: SerializationFormat;
  
  /** Decryption key (required if data is encrypted) */
  decryptionKey?: string;
  
  /** Context restoration level (0-1, higher values restore more context) */
  contextRestorationLevel?: number;
  
  /** Validate packet after deserialization */
  validate?: boolean;
}

/**
 * Default deserialization options
 */
const DEFAULT_DESERIALIZATION_OPTIONS: DeserializationOptions = {
  contextRestorationLevel: 1.0,
  validate: true
};

/**
 * Deserialization result
 */
export interface DeserializationResult<T = any> {
  /** Deserialized packet */
  packet: ConsciousnessStreamPacket<T>;
  
  /** Original format */
  originalFormat: SerializationFormat;
  
  /** Was compressed */
  wasCompressed: boolean;
  
  /** Was encrypted */
  wasEncrypted: boolean;
  
  /** Context restoration level */
  contextRestorationLevel: number;
  
  /** Validation result (if validation was performed) */
  validationResult?: {
    isValid: boolean;
    errors?: ProtocolError[];
    warnings?: string[];
  };
}

/**
 * Consciousness stream serializer
 */
export class ConsciousnessStreamSerializer {  /**
   * Serialize consciousness stream packet
   * @param packet - Consciousness stream packet
   * @param options - Serialization options
   * @returns Serialization result
   */
  static serialize<T>(
    packet: ConsciousnessStreamPacket<T>,
    options: SerializationOptions = {}
  ): SerializationResult {
    // Merge options with defaults
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    
    // Validate packet before serialization
    const validationResult = ProtocolUtils.validatePacket(packet);
    
    if (!validationResult.isValid) {
      throw new ProtocolError(
        `Cannot serialize invalid packet: ${validationResult.errors?.[0]?.message}`,
        validationResult.errors?.[0]?.code || ProtocolErrorCode.INVALID_STREAM_ID
      );
    }
    
    // Prepare packet for serialization
    const preparedPacket = this.preparePacketForSerialization(
      packet,
      mergedOptions.contextPreservationLevel || 1.0
    );
    
    // Serialize based on format
    let serialized: string | Uint8Array;
    
    switch (mergedOptions.format) {
      case SerializationFormat.JSON:
        serialized = JSON.stringify(preparedPacket);
        break;
      
      case SerializationFormat.BINARY:
        serialized = this.serializeToBinary(preparedPacket);
        break;
      
      case SerializationFormat.QUANTUM:
        serialized = this.serializeToQuantum(preparedPacket);
        break;
      
      default:
        serialized = JSON.stringify(preparedPacket);
        break;
    }
    
    // Apply compression if enabled
    if (mergedOptions.compression) {
      serialized = this.compress(serialized);
    }    
    // Apply encryption if enabled
    if (mergedOptions.encryption) {
      if (!mergedOptions.encryptionKey) {
        throw new ProtocolError(
          'Encryption key is required when encryption is enabled',
          ProtocolErrorCode.INVALID_STREAM_ID
        );
      }
      
      serialized = this.encrypt(serialized, mergedOptions.encryptionKey);
    }
    
    return {
      data: serialized,
      format: mergedOptions.format || SerializationFormat.JSON,
      compressed: !!mergedOptions.compression,
      encrypted: !!mergedOptions.encryption,
      contextPreservationLevel: mergedOptions.contextPreservationLevel || 1.0
    };
  }
  
  /**
   * Deserialize consciousness stream packet
   * @param data - Serialized data
   * @param options - Deserialization options
   * @returns Deserialization result
   */
  static deserialize<T>(
    data: string | Uint8Array,
    options: DeserializationOptions = {}
  ): DeserializationResult<T> {
    // Merge options with defaults
    const mergedOptions = { ...DEFAULT_DESERIALIZATION_OPTIONS, ...options };
    
    // Detect format if not specified
    const format = mergedOptions.expectedFormat || this.detectFormat(data);
    
    // Track serialization properties
    let wasCompressed = false;
    let wasEncrypted = false;
    
    // Decrypt if encrypted
    if (this.isEncrypted(data)) {
      if (!mergedOptions.decryptionKey) {
        throw new ProtocolError(
          'Decryption key is required for encrypted data',
          ProtocolErrorCode.INVALID_STREAM_ID
        );
      }
      
      data = this.decrypt(data, mergedOptions.decryptionKey);
      wasEncrypted = true;
    }    
    // Decompress if compressed
    if (this.isCompressed(data)) {
      data = this.decompress(data);
      wasCompressed = true;
    }
    
    // Deserialize based on format
    let packet: ConsciousnessStreamPacket<T>;
    
    switch (format) {
      case SerializationFormat.JSON:
        packet = this.deserializeFromJson<T>(data as string);
        break;
      
      case SerializationFormat.BINARY:
        packet = this.deserializeFromBinary<T>(data as Uint8Array);
        break;
      
      case SerializationFormat.QUANTUM:
        packet = this.deserializeFromQuantum<T>(data as Uint8Array);
        break;
      
      default:
        throw new ProtocolError(
          `Unsupported serialization format: ${format}`,
          ProtocolErrorCode.INVALID_VERSION
        );
    }
    
    // Restore context
    packet = this.restorePacketContext(
      packet,
      mergedOptions.contextRestorationLevel || 1.0
    );
    
    // Validate if requested
    let validationResult;
    
    if (mergedOptions.validate) {
      validationResult = ProtocolUtils.validatePacket(packet);
      
      if (!validationResult.isValid) {
        console.warn(`Deserialized packet is invalid: ${validationResult.errors?.[0]?.message}`);
      }
    }
    
    return {
      packet,
      originalFormat: format,
      wasCompressed,
      wasEncrypted,
      contextRestorationLevel: mergedOptions.contextRestorationLevel || 1.0,
      validationResult
    };
  }  
  /**
   * Prepare packet for serialization
   * @param packet - Consciousness stream packet
   * @param contextPreservationLevel - Context preservation level
   * @returns Prepared packet
   */
  private static preparePacketForSerialization<T>(
    packet: ConsciousnessStreamPacket<T>,
    contextPreservationLevel: number
  ): ConsciousnessStreamPacket<T> {
    // Clone packet to avoid modifying the original
    const clonedPacket = JSON.parse(JSON.stringify(packet)) as ConsciousnessStreamPacket<T>;
    
    // Apply context preservation level
    if (contextPreservationLevel < 1.0) {
      const flags = clonedPacket.header.contextPreservationFlags;
      
      // Reduce context based on preservation level
      if (contextPreservationLevel < 0.8) {
        // Remove non-essential context
        if (flags.preserveForceVectors) {
          delete clonedPacket.payload.forceVectors;
          flags.preserveForceVectors = false;
        }
      }
      
      if (contextPreservationLevel < 0.6) {
        // Remove dimensional mapping
        if (flags.preserveDimensionalMapping) {
          delete clonedPacket.payload.dimensionalMapping;
          flags.preserveDimensionalMapping = false;
        }
      }
      
      if (contextPreservationLevel < 0.4) {
        // Remove neural fabric connections
        if (flags.preserveNeuralFabric) {
          delete clonedPacket.payload.neuralFabricConnections;
          flags.preserveNeuralFabric = false;
        }
      }
      
      if (contextPreservationLevel < 0.2) {
        // Remove quantum state
        if (flags.preserveQuantumState) {
          delete clonedPacket.payload.quantumState;
          flags.preserveQuantumState = false;
        }
      }
    }    
    return clonedPacket;
  }
  
  /**
   * Restore packet context
   * @param packet - Consciousness stream packet
   * @param contextRestorationLevel - Context restoration level
   * @returns Restored packet
   */
  private static restorePacketContext<T>(
    packet: ConsciousnessStreamPacket<T>,
    contextRestorationLevel: number
  ): ConsciousnessStreamPacket<T> {
    // Clone packet to avoid modifying the original
    const clonedPacket = JSON.parse(JSON.stringify(packet)) as ConsciousnessStreamPacket<T>;
    
    // No additional restoration needed if level is high enough
    if (contextRestorationLevel >= 0.8) {
      return clonedPacket;
    }
    
    // Restore missing context based on what's available
    const flags = clonedPacket.header.contextPreservationFlags;
    
    // Restore quantum state if missing but flag is set
    if (flags.preserveQuantumState && !clonedPacket.payload.quantumState) {
      clonedPacket.payload.quantumState = {
        coherenceLevel: 1.0,
        lastUpdated: new Date()
      };
    }
    
    // Restore neural fabric connections if missing but flag is set
    if (flags.preserveNeuralFabric && !clonedPacket.payload.neuralFabricConnections) {
      clonedPacket.payload.neuralFabricConnections = [];
    }
    
    // Restore dimensional mapping if missing but flag is set
    if (flags.preserveDimensionalMapping && !clonedPacket.payload.dimensionalMapping) {
      clonedPacket.payload.dimensionalMapping = {};
    }
    
    // Restore force vectors if missing but flag is set
    if (flags.preserveForceVectors && !clonedPacket.payload.forceVectors) {
      clonedPacket.payload.forceVectors = {};
    }
    
    return clonedPacket;
  }  
  /**
   * Serialize to binary
   * @param packet - Consciousness stream packet
   * @returns Binary data
   */
  private static serializeToBinary<T>(packet: ConsciousnessStreamPacket<T>): Uint8Array {
    // In a real implementation, use a proper binary serialization library
    // For this example, we'll convert JSON to a Uint8Array
    const jsonString = JSON.stringify(packet);
    const encoder = new TextEncoder();
    return encoder.encode(jsonString);
  }
  
  /**
   * Serialize to quantum
   * @param packet - Consciousness stream packet
   * @returns Quantum data
   */
  private static serializeToQuantum<T>(packet: ConsciousnessStreamPacket<T>): Uint8Array {
    // In a real implementation, this would use quantum serialization
    // For this example, we'll just use binary serialization with a header
    const binaryData = this.serializeToBinary(packet);
    const quantumHeader = new Uint8Array([0x51, 0x55, 0x41, 0x4E, 0x54, 0x55, 0x4D]); // "QUANTUM" in ASCII
    
    // Combine header and data
    const result = new Uint8Array(quantumHeader.length + binaryData.length);
    result.set(quantumHeader);
    result.set(binaryData, quantumHeader.length);
    
    return result;
  }
  
  /**
   * Deserialize from JSON
   * @param data - JSON string
   * @returns Consciousness stream packet
   */
  private static deserializeFromJson<T>(data: string): ConsciousnessStreamPacket<T> {
    try {
      return JSON.parse(data) as ConsciousnessStreamPacket<T>;
    } catch (error) {
      throw new ProtocolError(
        `Failed to parse JSON: ${error.message}`,
        ProtocolErrorCode.INVALID_STREAM_ID
      );
    }
  }  
  /**
   * Deserialize from binary
   * @param data - Binary data
   * @returns Consciousness stream packet
   */
  private static deserializeFromBinary<T>(data: Uint8Array): ConsciousnessStreamPacket<T> {
    try {
      // In a real implementation, use a proper binary deserialization library
      // For this example, we'll convert Uint8Array to JSON
      const decoder = new TextDecoder();
      const jsonString = decoder.decode(data);
      return this.deserializeFromJson<T>(jsonString);
    } catch (error) {
      throw new ProtocolError(
        `Failed to deserialize binary data: ${error.message}`,
        ProtocolErrorCode.INVALID_STREAM_ID
      );
    }
  }
  
  /**
   * Deserialize from quantum
   * @param data - Quantum data
   * @returns Consciousness stream packet
   */
  private static deserializeFromQuantum<T>(data: Uint8Array): ConsciousnessStreamPacket<T> {
    try {
      // In a real implementation, this would use quantum deserialization
      // For this example, we'll just check for the header and use binary deserialization
      const quantumHeader = new Uint8Array([0x51, 0x55, 0x41, 0x4E, 0x54, 0x55, 0x4D]); // "QUANTUM" in ASCII
      
      // Check header
      for (let i = 0; i < quantumHeader.length; i++) {
        if (data[i] !== quantumHeader[i]) {
          throw new Error('Invalid quantum header');
        }
      }
      
      // Extract data without header
      const binaryData = data.slice(quantumHeader.length);
      
      return this.deserializeFromBinary<T>(binaryData);
    } catch (error) {
      throw new ProtocolError(
        `Failed to deserialize quantum data: ${error.message}`,
        ProtocolErrorCode.INVALID_STREAM_ID
      );
    }
  }  
  /**
   * Detect serialization format
   * @param data - Serialized data
   * @returns Detected format
   */
  private static detectFormat(data: string | Uint8Array): SerializationFormat {
    if (typeof data === 'string') {
      // Assume JSON for string data
      return SerializationFormat.JSON;
    }
    
    // Check for quantum header
    const quantumHeader = new Uint8Array([0x51, 0x55, 0x41, 0x4E, 0x54, 0x55, 0x4D]); // "QUANTUM" in ASCII
    let isQuantum = true;
    
    for (let i = 0; i < quantumHeader.length; i++) {
      if (data[i] !== quantumHeader[i]) {
        isQuantum = false;
        break;
      }
    }
    
    if (isQuantum) {
      return SerializationFormat.QUANTUM;
    }
    
    // Default to binary for Uint8Array data
    return SerializationFormat.BINARY;
  }
  
  /**
   * Compress data
   * @param data - Data to compress
   * @returns Compressed data
   */
  private static compress(data: string | Uint8Array): Uint8Array {
    // In a real implementation, use a proper compression library
    // For this example, we'll just add a compression header
    
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      data = encoder.encode(data);
    }
    
    const compressionHeader = new Uint8Array([0x43, 0x4F, 0x4D, 0x50]); // "COMP" in ASCII
    
    // Combine header and data
    const result = new Uint8Array(compressionHeader.length + data.length);
    result.set(compressionHeader);
    result.set(data, compressionHeader.length);
    
    return result;
  }  
  /**
   * Decompress data
   * @param data - Compressed data
   * @returns Decompressed data
   */
  private static decompress(data: Uint8Array): Uint8Array {
    // In a real implementation, use a proper decompression library
    // For this example, we'll just check for the compression header and return the data
    
    const compressionHeader = new Uint8Array([0x43, 0x4F, 0x4D, 0x50]); // "COMP" in ASCII
    
    // Check header
    for (let i = 0; i < compressionHeader.length; i++) {
      if (data[i] !== compressionHeader[i]) {
        throw new Error('Invalid compression header');
      }
    }
    
    // Extract data without header
    return data.slice(compressionHeader.length);
  }
  
  /**
   * Check if data is compressed
   * @param data - Data to check
   * @returns Is compressed
   */
  private static isCompressed(data: string | Uint8Array): boolean {
    if (typeof data === 'string') {
      return false;
    }
    
    const compressionHeader = new Uint8Array([0x43, 0x4F, 0x4D, 0x50]); // "COMP" in ASCII
    
    if (data.length < compressionHeader.length) {
      return false;
    }
    
    // Check header
    for (let i = 0; i < compressionHeader.length; i++) {
      if (data[i] !== compressionHeader[i]) {
        return false;
      }
    }
    
    return true;
  }  
  /**
   * Encrypt data
   * @param data - Data to encrypt
   * @param key - Encryption key
   * @returns Encrypted data
   */
  private static encrypt(data: string | Uint8Array, key: string): Uint8Array {
    // In a real implementation, use a proper encryption library
    // For this example, we'll just add an encryption header
    
    if (typeof data === 'string') {
      const encoder = new TextEncoder();
      data = encoder.encode(data);
    }
    
    const encryptionHeader = new Uint8Array([0x45, 0x4E, 0x43, 0x52]); // "ENCR" in ASCII
    
    // Combine header and data
    const result = new Uint8Array(encryptionHeader.length + data.length);
    result.set(encryptionHeader);
    result.set(data, encryptionHeader.length);
    
    return result;
  }
  
  /**
   * Decrypt data
   * @param data - Encrypted data
   * @param key - Decryption key
   * @returns Decrypted data
   */
  private static decrypt(data: string | Uint8Array, key: string): Uint8Array {
    // In a real implementation, use a proper decryption library
    // For this example, we'll just check for the encryption header and return the data
    
    if (typeof data === 'string') {
      throw new Error('Cannot decrypt string data');
    }
    
    const encryptionHeader = new Uint8Array([0x45, 0x4E, 0x43, 0x52]); // "ENCR" in ASCII
    
    // Check header
    for (let i = 0; i < encryptionHeader.length; i++) {
      if (data[i] !== encryptionHeader[i]) {
        throw new Error('Invalid encryption header');
      }
    }
    
    // Extract data without header
    return data.slice(encryptionHeader.length);
  }  
  /**
   * Check if data is encrypted
   * @param data - Data to check
   * @returns Is encrypted
   */
  private static isEncrypted(data: string | Uint8Array): boolean {
    if (typeof data === 'string') {
      return false;
    }
    
    const encryptionHeader = new Uint8Array([0x45, 0x4E, 0x43, 0x52]); // "ENCR" in ASCII
    
    if (data.length < encryptionHeader.length) {
      return false;
    }
    
    // Check header
    for (let i = 0; i < encryptionHeader.length; i++) {
      if (data[i] !== encryptionHeader[i]) {
        return false;
      }
    }
    
    return true;
  }
}

export default ConsciousnessStreamSerializer;