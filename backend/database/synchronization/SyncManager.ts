/**
 * Sync Manager
 * 
 * Manages data synchronization between different data sources.
 * 
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';
import { MetadataManager } from '../metadata/MetadataManager';

/**
 * Sync operation type
 */
export enum SyncOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  BATCH = 'batch'
}

/**
 * Sync operation
 */
export interface SyncOperation {
  /** Operation ID */
  id: string;
  
  /** Operation type */
  type: SyncOperationType;
  
  /** Source adapter */
  sourceAdapter: string;
  
  /** Target adapter */
  targetAdapter: string;
  
  /** Collection name */
  collection: string;
  
  /** Entity ID */
  entityId?: string;
  
  /** Entity data */
  data?: any;
  
  /** Batch operations */
  batchOperations?: SyncOperation[];
  
  /** Created at */
  createdAt: Date;
  
  /** Executed at */
  executedAt?: Date;
  
  /** Status */
  status: 'pending' | 'executing' | 'completed' | 'failed';
  
  /** Error */
  error?: any;
}

/**
 * Sync manager options
 */
export interface SyncManagerOptions {
  /** Sync operations collection name */
  syncOperationsCollection?: string;
  
  /** Sync interval (ms) */
  syncInterval?: number;
  
  /** Batch size */
  batchSize?: number;
  
  /** Retry attempts */
  retryAttempts?: number;
  
  /** Retry delay (ms) */
  retryDelay?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}/**
 * Default sync manager options
 */
const DEFAULT_OPTIONS: SyncManagerOptions = {
  syncOperationsCollection: '_sync_operations',
  syncInterval: 5000,
  batchSize: 100,
  retryAttempts: 3,
  retryDelay: 1000,
  debugMode: false
};

/**
 * Sync manager
 */
export class SyncManager extends EventEmitter {
  /** Options */
  private options: SyncManagerOptions;
  
  /** Primary adapter */
  private primaryAdapter: DatabaseAdapter;
  
  /** Secondary adapters */
  private secondaryAdapters: Map<string, DatabaseAdapter> = new Map();
  
  /** Metadata manager */
  private metadataManager: MetadataManager;
  
  /** Sync timer */
  private syncTimer: NodeJS.Timeout | null = null;
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /** Is syncing */
  private isSyncing: boolean = false;
  
  /**
   * Constructor
   * @param primaryAdapter - Primary database adapter
   * @param metadataManager - Metadata manager
   * @param options - Sync manager options
   */
  constructor(
    primaryAdapter: DatabaseAdapter,
    metadataManager: MetadataManager,
    options: SyncManagerOptions = {}
  ) {
    super();
    
    this.primaryAdapter = primaryAdapter;
    this.metadataManager = metadataManager;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Initialize sync manager
   * @returns Promise resolving to initialization success
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if primary adapter is connected
      if (!this.primaryAdapter.isConnected) {
        throw new Error('Primary adapter is not connected');
      }      
      // Check if metadata manager is initialized
      if (!this.metadataManager) {
        throw new Error('Metadata manager is required');
      }
      
      // Check if sync operations collection exists
      const exists = await this.primaryAdapter.collectionExists(this.options.syncOperationsCollection!);
      
      if (!exists) {
        // Create sync operations collection
        await this.primaryAdapter.createCollection(this.options.syncOperationsCollection!);
      }
      
      this.isInitialized = true;
      this.log('Sync manager initialized');
      
      return true;
    } catch (error) {
      this.logError('Failed to initialize sync manager', error);
      return false;
    }
  }
  
  /**
   * Ensure initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Sync manager not initialized');
    }
  }
  
  /**
   * Register secondary adapter
   * @param name - Adapter name
   * @param adapter - Database adapter
   */
  registerAdapter(name: string, adapter: DatabaseAdapter): void {
    // Check if adapter is connected
    if (!adapter.isConnected) {
      throw new Error(`Adapter ${name} is not connected`);
    }
    
    // Register adapter
    this.secondaryAdapters.set(name, adapter);
    
    this.log(`Registered adapter: ${name}`);
  }
  
  /**
   * Unregister secondary adapter
   * @param name - Adapter name
   */
  unregisterAdapter(name: string): void {
    // Unregister adapter
    this.secondaryAdapters.delete(name);
    
    this.log(`Unregistered adapter: ${name}`);
  }  
  /**
   * Start sync
   */
  startSync(): void {
    this.ensureInitialized();
    
    // Stop existing sync
    this.stopSync();
    
    // Start sync timer
    this.syncTimer = setInterval(() => {
      this.sync().catch(error => {
        this.logError('Sync error', error);
      });
    }, this.options.syncInterval);
    
    this.log('Sync started');
  }
  
  /**
   * Stop sync
   */
  stopSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
    
    this.log('Sync stopped');
  }
  
  /**
   * Sync
   * @returns Promise resolving to sync success
   */
  async sync(): Promise<boolean> {
    this.ensureInitialized();
    
    // Check if already syncing
    if (this.isSyncing) {
      return false;
    }
    
    this.isSyncing = true;
    
    try {
      // Get pending sync operations
      const operations = await this.getPendingSyncOperations();
      
      if (operations.length === 0) {
        this.isSyncing = false;
        return true;
      }
      
      // Execute sync operations
      for (const operation of operations) {
        await this.executeSyncOperation(operation);
      }
      
      this.isSyncing = false;
      return true;
    } catch (error) {
      this.isSyncing = false;
      this.logError('Sync failed', error);
      return false;
    }
  }  
  /**
   * Get pending sync operations
   * @returns Promise resolving to pending sync operations
   */
  private async getPendingSyncOperations(): Promise<SyncOperation[]> {
    try {
      // Get pending operations
      return await this.primaryAdapter.find<SyncOperation>(
        this.options.syncOperationsCollection!,
        { status: 'pending' },
        { limit: this.options.batchSize, sort: { createdAt: 1 } }
      );
    } catch (error) {
      this.logError('Failed to get pending sync operations', error);
      throw error;
    }
  }
  
  /**
   * Execute sync operation
   * @param operation - Sync operation
   * @returns Promise resolving to execution success
   */
  private async executeSyncOperation(operation: SyncOperation): Promise<boolean> {
    try {
      // Update operation status
      await this.updateSyncOperationStatus(operation.id, 'executing');
      
      // Get target adapter
      const targetAdapter = this.secondaryAdapters.get(operation.targetAdapter);
      
      if (!targetAdapter) {
        throw new Error(`Target adapter not found: ${operation.targetAdapter}`);
      }
      
      // Execute operation
      let success = false;
      
      switch (operation.type) {
        case SyncOperationType.CREATE:
          success = await this.executeCreateOperation(targetAdapter, operation);
          break;
        case SyncOperationType.UPDATE:
          success = await this.executeUpdateOperation(targetAdapter, operation);
          break;
        case SyncOperationType.DELETE:
          success = await this.executeDeleteOperation(targetAdapter, operation);
          break;
        case SyncOperationType.BATCH:
          success = await this.executeBatchOperation(targetAdapter, operation);
          break;
        default:
          throw new Error(`Unknown operation type: ${operation.type}`);
      }      
      // Update operation status
      if (success) {
        await this.updateSyncOperationStatus(operation.id, 'completed');
      } else {
        await this.updateSyncOperationStatus(operation.id, 'failed');
      }
      
      return success;
    } catch (error) {
      // Update operation status
      await this.updateSyncOperationStatus(operation.id, 'failed', error);
      
      this.logError(`Failed to execute sync operation: ${operation.id}`, error);
      return false;
    }
  }
  
  /**
   * Execute create operation
   * @param adapter - Target adapter
   * @param operation - Sync operation
   * @returns Promise resolving to execution success
   */
  private async executeCreateOperation(
    adapter: DatabaseAdapter,
    operation: SyncOperation
  ): Promise<boolean> {
    try {
      // Check if entity exists
      const exists = await adapter.findById(operation.collection, operation.entityId!);
      
      if (exists) {
        // Entity already exists, update instead
        await adapter.updateById(operation.collection, operation.entityId!, operation.data);
      } else {
        // Create entity
        await adapter.insert(operation.collection, operation.data);
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to execute create operation: ${operation.id}`, error);
      throw error;
    }
  }
  
  /**
   * Execute update operation
   * @param adapter - Target adapter
   * @param operation - Sync operation
   * @returns Promise resolving to execution success
   */
  private async executeUpdateOperation(
    adapter: DatabaseAdapter,
    operation: SyncOperation
  ): Promise<boolean> {    try {
      // Check if entity exists
      const exists = await adapter.findById(operation.collection, operation.entityId!);
      
      if (!exists) {
        // Entity doesn't exist, create instead
        await adapter.insert(operation.collection, operation.data);
      } else {
        // Update entity
        await adapter.updateById(operation.collection, operation.entityId!, operation.data);
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to execute update operation: ${operation.id}`, error);
      throw error;
    }
  }
  
  /**
   * Execute delete operation
   * @param adapter - Target adapter
   * @param operation - Sync operation
   * @returns Promise resolving to execution success
   */
  private async executeDeleteOperation(
    adapter: DatabaseAdapter,
    operation: SyncOperation
  ): Promise<boolean> {
    try {
      // Delete entity
      await adapter.deleteById(operation.collection, operation.entityId!);
      
      return true;
    } catch (error) {
      this.logError(`Failed to execute delete operation: ${operation.id}`, error);
      throw error;
    }
  }
  
  /**
   * Execute batch operation
   * @param adapter - Target adapter
   * @param operation - Sync operation
   * @returns Promise resolving to execution success
   */
  private async executeBatchOperation(
    adapter: DatabaseAdapter,
    operation: SyncOperation
  ): Promise<boolean> {
    try {
      // Execute batch operations
      for (const batchOperation of operation.batchOperations || []) {
        // Execute operation
        let success = false;
        
        switch (batchOperation.type) {
          case SyncOperationType.CREATE:
            success = await this.executeCreateOperation(adapter, batchOperation);
            break;          case SyncOperationType.UPDATE:
            success = await this.executeUpdateOperation(adapter, batchOperation);
            break;
          case SyncOperationType.DELETE:
            success = await this.executeDeleteOperation(adapter, batchOperation);
            break;
          default:
            throw new Error(`Unknown operation type: ${batchOperation.type}`);
        }
        
        if (!success) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to execute batch operation: ${operation.id}`, error);
      throw error;
    }
  }
  
  /**
   * Update sync operation status
   * @param operationId - Operation ID
   * @param status - Operation status
   * @param error - Operation error
   */
  private async updateSyncOperationStatus(
    operationId: string,
    status: 'pending' | 'executing' | 'completed' | 'failed',
    error?: any
  ): Promise<void> {
    try {
      // Update operation
      await this.primaryAdapter.updateById(
        this.options.syncOperationsCollection!,
        operationId,
        {
          status,
          executedAt: status === 'completed' || status === 'failed' ? new Date() : undefined,
          error: error ? error.toString() : undefined
        }
      );
    } catch (error) {
      this.logError(`Failed to update sync operation status: ${operationId}`, error);
      throw error;
    }
  }
  
  /**
   * Create sync operation
   * @param type - Operation type
   * @param sourceAdapter - Source adapter
   * @param targetAdapter - Target adapter
   * @param collection - Collection name
   * @param entityId - Entity ID
   * @param data - Entity data
   * @param batchOperations - Batch operations
   * @returns Promise resolving to operation ID
   */  async createSyncOperation(
    type: SyncOperationType,
    sourceAdapter: string,
    targetAdapter: string,
    collection: string,
    entityId?: string,
    data?: any,
    batchOperations?: SyncOperation[]
  ): Promise<string> {
    this.ensureInitialized();
    
    try {
      // Create operation
      const operation: SyncOperation = {
        id: this.generateId(),
        type,
        sourceAdapter,
        targetAdapter,
        collection,
        entityId,
        data,
        batchOperations,
        createdAt: new Date(),
        status: 'pending'
      };
      
      // Insert operation
      await this.primaryAdapter.insert(this.options.syncOperationsCollection!, operation);
      
      // Emit event
      this.emit('operation-created', operation);
      
      return operation.id;
    } catch (error) {
      this.logError('Failed to create sync operation', error);
      throw error;
    }
  }
  
  /**
   * Create entity
   * @param sourceAdapter - Source adapter
   * @param targetAdapter - Target adapter
   * @param collection - Collection name
   * @param entity - Entity
   * @returns Promise resolving to operation ID
   */
  async createEntity(
    sourceAdapter: string,
    targetAdapter: string,
    collection: string,
    entity: BaseEntity
  ): Promise<string> {
    return this.createSyncOperation(
      SyncOperationType.CREATE,
      sourceAdapter,
      targetAdapter,
      collection,
      entity.id,
      entity
    );
  }  
  /**
   * Update entity
   * @param sourceAdapter - Source adapter
   * @param targetAdapter - Target adapter
   * @param collection - Collection name
   * @param entity - Entity
   * @returns Promise resolving to operation ID
   */
  async updateEntity(
    sourceAdapter: string,
    targetAdapter: string,
    collection: string,
    entity: BaseEntity
  ): Promise<string> {
    return this.createSyncOperation(
      SyncOperationType.UPDATE,
      sourceAdapter,
      targetAdapter,
      collection,
      entity.id,
      entity
    );
  }
  
  /**
   * Delete entity
   * @param sourceAdapter - Source adapter
   * @param targetAdapter - Target adapter
   * @param collection - Collection name
   * @param entityId - Entity ID
   * @returns Promise resolving to operation ID
   */
  async deleteEntity(
    sourceAdapter: string,
    targetAdapter: string,
    collection: string,
    entityId: string
  ): Promise<string> {
    return this.createSyncOperation(
      SyncOperationType.DELETE,
      sourceAdapter,
      targetAdapter,
      collection,
      entityId
    );
  }
  
  /**
   * Batch operations
   * @param sourceAdapter - Source adapter
   * @param targetAdapter - Target adapter
   * @param collection - Collection name
   * @param operations - Batch operations
   * @returns Promise resolving to operation ID
   */
  async batchOperations(
    sourceAdapter: string,
    targetAdapter: string,
    collection: string,
    operations: SyncOperation[]
  ): Promise<string> {    return this.createSyncOperation(
      SyncOperationType.BATCH,
      sourceAdapter,
      targetAdapter,
      collection,
      undefined,
      undefined,
      operations
    );
  }
  
  /**
   * Generate ID
   * @returns Generated ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[SyncManager] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[SyncManager] ${message}`, error);
  }
}

export default SyncManager;