/**
 * Quantum Coherence Manager
 * 
 * Manages quantum coherence for database entities.
 * 
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { BaseEntity, QuantumState } from '../schemas/BaseSchema';
import { MetadataManager, MetadataType } from '../metadata/MetadataManager';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';

/**
 * Quantum coherence level
 */
export enum CoherenceLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  PERFECT = 'perfect'
}

/**
 * Quantum coherence checkpoint
 */
export interface CoherenceCheckpoint {
  /** Checkpoint ID */
  id: string;
  
  /** Checkpoint name */
  name: string;
  
  /** Checkpoint timestamp */
  timestamp: Date;
  
  /** Entity ID */
  entityId: string;
  
  /** Entity type */
  entityType: string;
  
  /** Coherence level */
  coherenceLevel: CoherenceLevel;
  
  /** Coherence score (0-1) */
  coherenceScore: number;
  
  /** Quantum state */
  quantumState: QuantumState;
  
  /** Previous checkpoint ID */
  previousCheckpointId?: string;
  
  /** Checkpoint data */
  data?: any;
}

/**
 * Quantum coherence verification result
 */
export interface CoherenceVerificationResult {
  /** Is coherent */
  isCoherent: boolean;
  
  /** Coherence level */
  coherenceLevel: CoherenceLevel;
  
  /** Coherence score (0-1) */
  coherenceScore: number;
  
  /** Verification errors */
  errors?: string[];
  
  /** Verification warnings */
  warnings?: string[];
}/**
 * Quantum coherence manager options
 */
export interface QuantumCoherenceManagerOptions {
  /** Checkpoints collection name */
  checkpointsCollection?: string;
  
  /** Automatic checkpoint interval (ms) */
  automaticCheckpointInterval?: number;
  
  /** Maximum checkpoints per entity */
  maxCheckpointsPerEntity?: number;
  
  /** Minimum coherence score */
  minimumCoherenceScore?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default quantum coherence manager options
 */
const DEFAULT_OPTIONS: QuantumCoherenceManagerOptions = {
  checkpointsCollection: '_quantum_checkpoints',
  automaticCheckpointInterval: 60000,
  maxCheckpointsPerEntity: 10,
  minimumCoherenceScore: 0.7,
  debugMode: false
};

/**
 * Quantum coherence manager
 */
export class QuantumCoherenceManager extends EventEmitter {
  /** Options */
  private options: QuantumCoherenceManagerOptions;
  
  /** Database adapter */
  private adapter: DatabaseAdapter;
  
  /** Metadata manager */
  private metadataManager: MetadataManager;
  
  /** Automatic checkpoint timers */
  private automaticCheckpointTimers: Map<string, NodeJS.Timeout> = new Map();
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param adapter - Database adapter
   * @param metadataManager - Metadata manager
   * @param options - Quantum coherence manager options
   */
  constructor(
    adapter: DatabaseAdapter,
    metadataManager: MetadataManager,
    options: QuantumCoherenceManagerOptions = {}
  ) {
    super();
    
    this.adapter = adapter;
    this.metadataManager = metadataManager;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }  
  /**
   * Initialize quantum coherence manager
   * @returns Promise resolving to initialization success
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if adapter is connected
      if (!this.adapter.isConnected) {
        throw new Error('Adapter is not connected');
      }
      
      // Check if metadata manager is initialized
      if (!this.metadataManager) {
        throw new Error('Metadata manager is required');
      }
      
      // Check if checkpoints collection exists
      const exists = await this.adapter.collectionExists(this.options.checkpointsCollection!);
      
      if (!exists) {
        // Create checkpoints collection
        await this.adapter.createCollection(this.options.checkpointsCollection!);
      }
      
      this.isInitialized = true;
      this.log('Quantum coherence manager initialized');
      
      return true;
    } catch (error) {
      this.logError('Failed to initialize quantum coherence manager', error);
      return false;
    }
  }
  
  /**
   * Ensure initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Quantum coherence manager not initialized');
    }
  }
  
  /**
   * Create checkpoint
   * @param name - Checkpoint name
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @param data - Checkpoint data
   * @returns Promise resolving to checkpoint
   */
  async createCheckpoint(
    name: string,
    entityId: string,
    entityType: string,
    data?: any
  ): Promise<CoherenceCheckpoint> {    this.ensureInitialized();
    
    try {
      // Get entity quantum state
      const quantumState = await this.getEntityQuantumState(entityId, entityType);
      
      // Get previous checkpoint
      const previousCheckpoint = await this.getLatestCheckpoint(entityId);
      
      // Calculate coherence level and score
      const coherence = this.calculateCoherence(quantumState, previousCheckpoint?.quantumState);
      
      // Create checkpoint
      const checkpoint: CoherenceCheckpoint = {
        id: this.generateId(),
        name,
        timestamp: new Date(),
        entityId,
        entityType,
        coherenceLevel: coherence.coherenceLevel,
        coherenceScore: coherence.coherenceScore,
        quantumState,
        previousCheckpointId: previousCheckpoint?.id,
        data
      };
      
      // Store checkpoint
      await this.adapter.insert(this.options.checkpointsCollection!, checkpoint);
      
      // Limit checkpoints
      await this.limitCheckpoints(entityId);
      
      // Emit event
      this.emit('checkpoint-created', checkpoint);
      
      return checkpoint;
    } catch (error) {
      this.logError(`Failed to create checkpoint for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Get entity quantum state
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @returns Promise resolving to quantum state
   */
  private async getEntityQuantumState(entityId: string, entityType: string): Promise<QuantumState> {
    try {
      // Get quantum state from metadata
      const metadata = await this.metadataManager.getQuantumMetadata(entityId);
      
      if (metadata) {
        return metadata;
      }      
      // Create new quantum state
      const quantumState: QuantumState = {
        coherenceLevel: 1.0,
        lastUpdated: new Date()
      };
      
      // Store quantum state
      await this.metadataManager.setQuantumMetadata(entityId, entityType, quantumState);
      
      return quantumState;
    } catch (error) {
      this.logError(`Failed to get quantum state for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Calculate coherence
   * @param currentState - Current quantum state
   * @param previousState - Previous quantum state
   * @returns Coherence level and score
   */
  private calculateCoherence(
    currentState: QuantumState,
    previousState?: QuantumState
  ): { coherenceLevel: CoherenceLevel; coherenceScore: number } {
    // If no previous state, coherence is perfect
    if (!previousState) {
      return {
        coherenceLevel: CoherenceLevel.PERFECT,
        coherenceScore: 1.0
      };
    }
    
    // Calculate time difference
    const timeDiff = currentState.lastUpdated.getTime() - previousState.lastUpdated.getTime();
    const timeFactor = Math.min(1.0, Math.max(0.0, 1.0 - (timeDiff / (24 * 60 * 60 * 1000))));
    
    // Calculate state difference
    const stateDiff = Math.abs(currentState.coherenceLevel - previousState.coherenceLevel);
    
    // Calculate coherence score
    const coherenceScore = Math.min(1.0, Math.max(0.0, timeFactor * (1.0 - stateDiff)));
    
    // Determine coherence level
    let coherenceLevel: CoherenceLevel;
    
    if (coherenceScore >= 0.9) {
      coherenceLevel = CoherenceLevel.PERFECT;
    } else if (coherenceScore >= 0.7) {
      coherenceLevel = CoherenceLevel.HIGH;
    } else if (coherenceScore >= 0.5) {
      coherenceLevel = CoherenceLevel.MEDIUM;
    } else if (coherenceScore >= 0.3) {
      coherenceLevel = CoherenceLevel.LOW;
    } else {
      coherenceLevel = CoherenceLevel.NONE;
    }    
    return {
      coherenceLevel,
      coherenceScore
    };
  }
  
  /**
   * Get latest checkpoint
   * @param entityId - Entity ID
   * @returns Promise resolving to latest checkpoint or null
   */
  async getLatestCheckpoint(entityId: string): Promise<CoherenceCheckpoint | null> {
    this.ensureInitialized();
    
    try {
      // Find latest checkpoint
      const checkpoints = await this.adapter.find<CoherenceCheckpoint>(
        this.options.checkpointsCollection!,
        { entityId },
        { limit: 1, sort: { timestamp: -1 } }
      );
      
      return checkpoints.length > 0 ? checkpoints[0] : null;
    } catch (error) {
      this.logError(`Failed to get latest checkpoint for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Get checkpoints
   * @param entityId - Entity ID
   * @param limit - Limit
   * @returns Promise resolving to checkpoints
   */
  async getCheckpoints(entityId: string, limit?: number): Promise<CoherenceCheckpoint[]> {
    this.ensureInitialized();
    
    try {
      // Find checkpoints
      return await this.adapter.find<CoherenceCheckpoint>(
        this.options.checkpointsCollection!,
        { entityId },
        { limit, sort: { timestamp: -1 } }
      );
    } catch (error) {
      this.logError(`Failed to get checkpoints for entity: ${entityId}`, error);
      throw error;
    }
  }  
  /**
   * Limit checkpoints
   * @param entityId - Entity ID
   */
  private async limitCheckpoints(entityId: string): Promise<void> {
    try {
      // Get checkpoints
      const checkpoints = await this.adapter.find<CoherenceCheckpoint>(
        this.options.checkpointsCollection!,
        { entityId },
        { sort: { timestamp: -1 } }
      );
      
      // Check if too many checkpoints
      if (checkpoints.length > this.options.maxCheckpointsPerEntity!) {
        // Get checkpoints to delete
        const checkpointsToDelete = checkpoints.slice(this.options.maxCheckpointsPerEntity!);
        
        // Delete checkpoints
        for (const checkpoint of checkpointsToDelete) {
          await this.adapter.deleteById(this.options.checkpointsCollection!, checkpoint.id);
        }
      }
    } catch (error) {
      this.logError(`Failed to limit checkpoints for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Verify coherence
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @returns Promise resolving to verification result
   */
  async verifyCoherence(entityId: string, entityType: string): Promise<CoherenceVerificationResult> {
    this.ensureInitialized();
    
    try {
      // Get latest checkpoint
      const latestCheckpoint = await this.getLatestCheckpoint(entityId);
      
      if (!latestCheckpoint) {
        // No checkpoint, create one
        const checkpoint = await this.createCheckpoint('Initial checkpoint', entityId, entityType);
        
        return {
          isCoherent: true,
          coherenceLevel: checkpoint.coherenceLevel,
          coherenceScore: checkpoint.coherenceScore
        };
      }      
      // Get entity quantum state
      const quantumState = await this.getEntityQuantumState(entityId, entityType);
      
      // Calculate coherence
      const coherence = this.calculateCoherence(quantumState, latestCheckpoint.quantumState);
      
      // Check if coherent
      const isCoherent = coherence.coherenceScore >= this.options.minimumCoherenceScore!;
      
      // Create verification result
      const result: CoherenceVerificationResult = {
        isCoherent,
        coherenceLevel: coherence.coherenceLevel,
        coherenceScore: coherence.coherenceScore
      };
      
      // Add errors and warnings
      if (!isCoherent) {
        result.errors = ['Coherence score below minimum threshold'];
      } else if (coherence.coherenceScore < 0.9) {
        result.warnings = ['Coherence score below optimal level'];
      }
      
      return result;
    } catch (error) {
      this.logError(`Failed to verify coherence for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Start automatic checkpoints
   * @param entityId - Entity ID
   * @param entityType - Entity type
   */
  startAutomaticCheckpoints(entityId: string, entityType: string): void {
    this.ensureInitialized();
    
    // Stop existing timer
    this.stopAutomaticCheckpoints(entityId);
    
    // Start new timer
    const timer = setInterval(async () => {
      try {
        await this.createCheckpoint('Automatic checkpoint', entityId, entityType);
      } catch (error) {
        this.logError(`Failed to create automatic checkpoint for entity: ${entityId}`, error);
      }
    }, this.options.automaticCheckpointInterval);
    
    // Store timer
    this.automaticCheckpointTimers.set(entityId, timer);
    
    this.log(`Started automatic checkpoints for entity: ${entityId}`);
  }  
  /**
   * Stop automatic checkpoints
   * @param entityId - Entity ID
   */
  stopAutomaticCheckpoints(entityId: string): void {
    // Get timer
    const timer = this.automaticCheckpointTimers.get(entityId);
    
    if (timer) {
      // Clear timer
      clearInterval(timer);
      
      // Remove timer
      this.automaticCheckpointTimers.delete(entityId);
      
      this.log(`Stopped automatic checkpoints for entity: ${entityId}`);
    }
  }
  
  /**
   * Recover coherence
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @returns Promise resolving to recovery success
   */
  async recoverCoherence(entityId: string, entityType: string): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      // Get latest checkpoint
      const latestCheckpoint = await this.getLatestCheckpoint(entityId);
      
      if (!latestCheckpoint) {
        // No checkpoint, create one
        await this.createCheckpoint('Recovery checkpoint', entityId, entityType);
        return true;
      }
      
      // Get entity quantum state
      const quantumState = await this.getEntityQuantumState(entityId, entityType);
      
      // Update quantum state
      quantumState.coherenceLevel = 1.0;
      quantumState.lastUpdated = new Date();
      
      // Store quantum state
      await this.metadataManager.setQuantumMetadata(entityId, entityType, quantumState);
      
      // Create recovery checkpoint
      await this.createCheckpoint('Recovery checkpoint', entityId, entityType);
      
      return true;
    } catch (error) {
      this.logError(`Failed to recover coherence for entity: ${entityId}`, error);
      return false;
    }
  }  
  /**
   * Generate ID
   * @returns Generated ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop all automatic checkpoint timers
    for (const [entityId, timer] of this.automaticCheckpointTimers.entries()) {
      clearInterval(timer);
    }
    
    // Clear timers
    this.automaticCheckpointTimers.clear();
    
    this.isInitialized = false;
    
    this.log('Quantum coherence manager disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[QuantumCoherenceManager] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[QuantumCoherenceManager] ${message}`, error);
  }
}

export default QuantumCoherenceManager;