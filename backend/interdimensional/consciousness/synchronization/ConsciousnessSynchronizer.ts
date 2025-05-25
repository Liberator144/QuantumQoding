/**
 * Consciousness Synchronizer
 * 
 * This module provides a synchronizer for consciousness streams,
 * ensuring coherent state across multiple streams.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  ConsciousnessStream, 
  ConsciousnessStreamPacket,
  ConsciousnessStreamManager 
} from '../ConsciousnessStreamProtocol';
import { QuantumStateManager, QuantumState } from '../../quantum/QuantumStateManager';
import { QuantumCoherenceVerifier } from '../../quantum/QuantumCoherenceVerifier';

/**
 * Synchronization status
 */
export enum SynchronizationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Synchronization strategy
 */
export enum SynchronizationStrategy {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  SELECTIVE = 'selective',
}

/**
 * Synchronization options
 */
export interface SynchronizationOptions {
  strategy: SynchronizationStrategy;
  preserveQuantumState: boolean;
  preserveContext: boolean;
  bidirectional: boolean;
  selectiveProperties?: string[];
}

/**
 * Synchronization result
 */
export interface SynchronizationResult {
  id: string;
  sourceStreamId: string;
  targetStreamId: string;
  status: SynchronizationStatus;
  timestamp: number;
  completedTimestamp?: number;
  packetsSent: number;
  packetsReceived: number;
  coherenceScore: number;
  error?: string;
}

/**
 * Consciousness Synchronizer
 */
export class ConsciousnessSynchronizer {
  private streamManager: ConsciousnessStreamManager;
  private stateManager: QuantumStateManager;
  private coherenceVerifier: QuantumCoherenceVerifier;
  private synchronizations: Map<string, SynchronizationResult>;
  
  /**
   * Constructor
   */
  constructor() {
    this.streamManager = new ConsciousnessStreamManager();
    this.stateManager = new QuantumStateManager();
    this.coherenceVerifier = new QuantumCoherenceVerifier();
    this.synchronizations = new Map();
  }
  
  /**
   * Synchronize consciousness streams
   */
  public synchronizeStreams(
    sourceStreamId: string,
    targetStreamId: string,
    options: SynchronizationOptions
  ): SynchronizationResult {
    // Get streams
    const sourceStream = this.streamManager.getStream(sourceStreamId);
    const targetStream = this.streamManager.getStream(targetStreamId);
    
    if (!sourceStream) {
      throw new Error(`Source stream ${sourceStreamId} not found`);
    }
    
    if (!targetStream) {
      throw new Error(`Target stream ${targetStreamId} not found`);
    }
    
    // Create synchronization result
    const synchronizationId = uuidv4();
    const result: SynchronizationResult = {
      id: synchronizationId,
      sourceStreamId,
      targetStreamId,
      status: SynchronizationStatus.PENDING,
      timestamp: Date.now(),
      packetsSent: 0,
      packetsReceived: 0,
      coherenceScore: 0,
    };
    
    this.synchronizations.set(synchronizationId, result);
    
    try {
      // Perform synchronization based on strategy
      switch (options.strategy) {
        case SynchronizationStrategy.FULL:
          this.performFullSynchronization(result, sourceStream, targetStream, options);
          break;
          
        case SynchronizationStrategy.INCREMENTAL:
          this.performIncrementalSynchronization(result, sourceStream, targetStream, options);
          break;
          
        case SynchronizationStrategy.SELECTIVE:
          this.performSelectiveSynchronization(result, sourceStream, targetStream, options);
          break;
      }
      
      // Verify coherence
      result.coherenceScore = this.verifyCoherence(sourceStream, targetStream);
      
      // Update result
      result.status = SynchronizationStatus.COMPLETED;
      result.completedTimestamp = Date.now();
      
      return result;
    } catch (error) {
      // Update result with error
      result.status = SynchronizationStatus.FAILED;
      result.completedTimestamp = Date.now();
      result.error = error instanceof Error ? error.message : String(error);
      
      return result;
    }
  }
  
  /**
   * Get synchronization result
   */
  public getSynchronization(synchronizationId: string): SynchronizationResult | undefined {
    return this.synchronizations.get(synchronizationId);
  }
  
  /**
   * Get all synchronization results
   */
  public getAllSynchronizations(): SynchronizationResult[] {
    return Array.from(this.synchronizations.values());
  }
  
  /**
   * Perform full synchronization
   */
  private performFullSynchronization(
    result: SynchronizationResult,
    sourceStream: ConsciousnessStream,
    targetStream: ConsciousnessStream,
    options: SynchronizationOptions
  ): void {
    // Get all packets from source stream
    const sourcePackets = this.streamManager.getStreamPackets(sourceStream.id);
    
    // Send all packets to target stream
    for (const packet of sourcePackets) {
      this.synchronizePacket(result, packet, targetStream, options);
    }
    
    // If bidirectional, synchronize from target to source
    if (options.bidirectional) {
      const targetPackets = this.streamManager.getStreamPackets(targetStream.id);
      
      for (const packet of targetPackets) {
        this.synchronizePacket(result, packet, sourceStream, options);
      }
    }
  }
  
  /**
   * Perform incremental synchronization
   */
  private performIncrementalSynchronization(
    result: SynchronizationResult,
    sourceStream: ConsciousnessStream,
    targetStream: ConsciousnessStream,
    options: SynchronizationOptions
  ): void {
    // Get latest synchronization between these streams
    const latestSynchronization = this.getLatestSynchronization(sourceStream.id, targetStream.id);
    
    // If no previous synchronization, perform full synchronization
    if (!latestSynchronization) {
      this.performFullSynchronization(result, sourceStream, targetStream, options);
      return;
    }
    
    // Get packets since last synchronization
    const sourcePackets = this.streamManager.getStreamPacketsSince(
      sourceStream.id,
      latestSynchronization.completedTimestamp || latestSynchronization.timestamp
    );
    
    // Send new packets to target stream
    for (const packet of sourcePackets) {
      this.synchronizePacket(result, packet, targetStream, options);
    }
    
    // If bidirectional, synchronize from target to source
    if (options.bidirectional) {
      const targetPackets = this.streamManager.getStreamPacketsSince(
        targetStream.id,
        latestSynchronization.completedTimestamp || latestSynchronization.timestamp
      );
      
      for (const packet of targetPackets) {
        this.synchronizePacket(result, packet, sourceStream, options);
      }
    }
  }
  
  /**
   * Perform selective synchronization
   */
  private performSelectiveSynchronization(
    result: SynchronizationResult,
    sourceStream: ConsciousnessStream,
    targetStream: ConsciousnessStream,
    options: SynchronizationOptions
  ): void {
    if (!options.selectiveProperties || options.selectiveProperties.length === 0) {
      throw new Error('Selective properties are required for selective synchronization');
    }
    
    // Get all packets from source stream
    const sourcePackets = this.streamManager.getStreamPackets(sourceStream.id);
    
    // Filter packets by selective properties
    const filteredPackets = sourcePackets.filter(packet => {
      const packetData = packet.payload.data;
      
      if (!packetData) {
        return false;
      }
      
      // Check if packet contains any of the selective properties
      return options.selectiveProperties!.some(property => 
        property in packetData
      );
    });
    
    // Send filtered packets to target stream
    for (const packet of filteredPackets) {
      this.synchronizePacket(result, packet, targetStream, options);
    }
    
    // If bidirectional, synchronize from target to source
    if (options.bidirectional) {
      const targetPackets = this.streamManager.getStreamPackets(targetStream.id);
      
      const filteredTargetPackets = targetPackets.filter(packet => {
        const packetData = packet.payload.data;
        
        if (!packetData) {
          return false;
        }
        
        // Check if packet contains any of the selective properties
        return options.selectiveProperties!.some(property => 
          property in packetData
        );
      });
      
      for (const packet of filteredTargetPackets) {
        this.synchronizePacket(result, packet, sourceStream, options);
      }
    }
  }
  
  /**
   * Synchronize packet
   */
  private synchronizePacket(
    result: SynchronizationResult,
    packet: ConsciousnessStreamPacket<any>,
    targetStream: ConsciousnessStream,
    options: SynchronizationOptions
  ): void {
    // Create new packet for target stream
    const newPacket: Partial<ConsciousnessStreamPacket<any>> = {
      header: {
        streamId: targetStream.id,
        sourceId: packet.header.sourceId,
        targetId: packet.header.targetId,
        contextPreservationFlags: {
          preserveQuantumState: options.preserveQuantumState,
          preserveContext: options.preserveContext,
        },
      },
      payload: {
        data: packet.payload.data,
      },
    };
    
    // Add quantum state if preserving
    if (options.preserveQuantumState && packet.payload.quantumState) {
      newPacket.payload!.quantumState = packet.payload.quantumState;
    }
    
    // Send packet to target stream
    this.streamManager.sendPacket(targetStream.id, newPacket);
    
    // Update result
    result.packetsSent++;
    result.packetsReceived++;
  }
  
  /**
   * Get latest synchronization between streams
   */
  private getLatestSynchronization(
    sourceStreamId: string,
    targetStreamId: string
  ): SynchronizationResult | undefined {
    const synchronizations = Array.from(this.synchronizations.values())
      .filter(sync => 
        (sync.sourceStreamId === sourceStreamId && sync.targetStreamId === targetStreamId) ||
        (sync.sourceStreamId === targetStreamId && sync.targetStreamId === sourceStreamId)
      )
      .filter(sync => sync.status === SynchronizationStatus.COMPLETED)
      .sort((a, b) => 
        (b.completedTimestamp || b.timestamp) - (a.completedTimestamp || a.timestamp)
      );
    
    return synchronizations[0];
  }
  
  /**
   * Verify coherence between streams
   */
  private verifyCoherence(
    sourceStream: ConsciousnessStream,
    targetStream: ConsciousnessStream
  ): number {
    // Get quantum states from streams
    const sourceQuantumStates = this.getStreamQuantumStates(sourceStream.id);
    const targetQuantumStates = this.getStreamQuantumStates(targetStream.id);
    
    // If no quantum states, return default coherence
    if (sourceQuantumStates.length === 0 || targetQuantumStates.length === 0) {
      return 1.0;
    }
    
    // Verify coherence between quantum states
    const coherenceScores: number[] = [];
    
    for (const sourceState of sourceQuantumStates) {
      for (const targetState of targetQuantumStates) {
        const result = this.coherenceVerifier.verifyCoherence(sourceState, targetState);
        coherenceScores.push(result.coherenceScore);
      }
    }
    
    // Calculate average coherence score
    return coherenceScores.reduce((sum, score) => sum + score, 0) / coherenceScores.length;
  }
  
  /**
   * Get quantum states from stream
   */
  private getStreamQuantumStates(streamId: string): QuantumState[] {
    const packets = this.streamManager.getStreamPackets(streamId);
    const quantumStateIds = new Set<string>();
    
    // Collect unique quantum state IDs
    for (const packet of packets) {
      if (packet.payload.quantumState?.id) {
        quantumStateIds.add(packet.payload.quantumState.id);
      }
    }
    
    // Get quantum states
    const quantumStates: QuantumState[] = [];
    
    for (const stateId of quantumStateIds) {
      const state = this.stateManager.getState(stateId);
      
      if (state) {
        quantumStates.push(state);
      }
    }
    
    return quantumStates;
  }
}