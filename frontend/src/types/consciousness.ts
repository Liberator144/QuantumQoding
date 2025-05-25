/**
 * Consciousness Types
 * 
 * This module provides type definitions for consciousness stream management.
 * 
 * @version 1.0.0
 */

/**
 * Consciousness stream interface
 */
export interface ConsciousnessStream {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'paused';
  createdAt: number;
  updatedAt: number;
  properties: Record<string, any>;
}

/**
 * Consciousness stream packet header interface
 */
export interface ConsciousnessStreamPacketHeader {
  packetId: string;
  streamId: string;
  sourceId: string;
  targetId: string;
  timestamp: number;
  contextPreservationFlags: {
    preserveQuantumState: boolean;
    preserveContext: boolean;
  };
}

/**
 * Consciousness stream packet payload interface
 */
export interface ConsciousnessStreamPacketPayload<T = any> {
  data: T;
  quantumState?: {
    id: string;
    [key: string]: any;
  };
  context?: Record<string, any>;
}

/**
 * Consciousness stream packet interface
 */
export interface ConsciousnessStreamPacket<T = any> {
  header: ConsciousnessStreamPacketHeader;
  payload: ConsciousnessStreamPacketPayload<T>;
}

/**
 * Consciousness stream serialization options interface
 */
export interface SerializationOptions {
  preserveTypes: boolean;
  compressionLevel: 'none' | 'low' | 'medium' | 'high';
  includeMetadata: boolean;
}

/**
 * Consciousness stream verification result interface
 */
export interface StreamVerificationResult {
  isIntact: boolean;
  contextPreservationScore: number;
  quantumCoherenceScore: number;
  issues?: {
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    location: string;
  }[];
  recommendations?: {
    type: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    action: string;
  }[];
}

/**
 * Consciousness synchronization interface
 */
export interface ConsciousnessSynchronization {
  id: string;
  sourceStreamId: string;
  targetStreamId: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  completedTimestamp?: number;
  packetsSent: number;
  packetsReceived: number;
  coherenceScore: number;
  error?: string;
}

/**
 * Consciousness synchronization options interface
 */
export interface SynchronizationOptions {
  strategy: 'full' | 'incremental' | 'selective';
  preserveQuantumState: boolean;
  preserveContext: boolean;
  bidirectional: boolean;
  selectiveProperties?: string[];
}

/**
 * Consciousness checkpoint interface
 */
export interface ConsciousnessCheckpoint {
  id: string;
  streamId: string;
  timestamp: number;
  state: Record<string, any>;
  quantumStateIds: string[];
  contextData: Record<string, any>;
}

/**
 * Consciousness restoration result interface
 */
export interface RestorationResult {
  success: boolean;
  streamId: string;
  checkpointId: string;
  timestamp: number;
  coherenceScore: number;
  error?: string;
}