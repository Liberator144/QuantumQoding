/**
 * Database Adapter Interface
 * 
 * Defines the interface that all database adapters must implement.
 * This ensures consistency across different data sources and enables seamless integration.
 * 
 * @version 1.0.0
 */

import { BaseEntity } from '../schemas/BaseSchema';

/**
 * Database adapter options
 */
export interface DatabaseAdapterOptions {
  /** Debug mode */
  debugMode?: boolean;
  
  /** Connection timeout (ms) */
  connectionTimeout?: number;
  
  /** Operation timeout (ms) */
  operationTimeout?: number;
  
  /** Retry attempts */
  retryAttempts?: number;
  
  /** Retry delay (ms) */
  retryDelay?: number;
  
  /** Cache enabled */
  cacheEnabled?: boolean;
  
  /** Cache TTL (ms) */
  cacheTTL?: number;
  
  /** Batch size for operations */
  batchSize?: number;
  
  /** Adapter-specific options */
  [key: string]: any;
}

/**
 * Query options
 */
export interface QueryOptions {
  /** Limit results */
  limit?: number;
  
  /** Skip results */
  skip?: number;
  
  /** Sort options */
  sort?: Record<string, 1 | -1>;
  
  /** Include relationships */
  includeRelationships?: boolean;
  
  /** Include quantum state */
  includeQuantumState?: boolean;
  
  /** Operation timeout (ms) */
  timeout?: number;
  
  /** Use cache */
  useCache?: boolean;
  
  /** Query-specific options */
  [key: string]: any;
}

/**
 * Update options
 */
export interface UpdateOptions {
  /** Update multiple documents */
  multi?: boolean;
  
  /** Upsert document */
  upsert?: boolean;
  
  /** Return updated document */
  returnUpdated?: boolean;
  
  /** Operation timeout (ms) */
  timeout?: number;
  
  /** Update-specific options */
  [key: string]: any;
}

/**
 * Database adapter interface
 */
export interface DatabaseAdapter {
  /** Adapter name */
  readonly name: string;
  
  /** Adapter type */
  readonly type: string;
  
  /** Adapter options */
  readonly options: DatabaseAdapterOptions;
  
  /** Is connected */
  readonly isConnected: boolean;
  
  /**
   * Connect to the database
   * @returns Promise resolving to connection success
   */
  connect(): Promise<boolean>;
  
  /**
   * Disconnect from the database
   * @returns Promise resolving to disconnection success
   */
  disconnect(): Promise<boolean>;
  
  /**
   * Find entities by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  find<T extends BaseEntity>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  
  /**
   * Find one entity by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  findOne<T extends BaseEntity>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T | null>;
  
  /**
   * Find entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  findById<T extends BaseEntity>(collection: string, id: string, options?: QueryOptions): Promise<T | null>;
  
  /**
   * Insert entity
   * @param collection - Collection name
   * @param entity - Entity to insert
   * @returns Promise resolving to inserted entity
   */
  insert<T extends BaseEntity>(collection: string, entity: T): Promise<T>;
  
  /**
   * Insert multiple entities
   * @param collection - Collection name
   * @param entities - Entities to insert
   * @returns Promise resolving to inserted entities
   */
  insertMany<T extends BaseEntity>(collection: string, entities: T[]): Promise<T[]>;
  
  /**
   * Update entity
   * @param collection - Collection name
   * @param query - Query object
   * @param update - Update object
   * @param options - Update options
   * @returns Promise resolving to update result
   */
  update<T extends BaseEntity>(collection: string, query: Record<string, any>, update: Partial<T>, options?: UpdateOptions): Promise<{ matched: number; modified: number; upserted?: T }>;
  
  /**
   * Update entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param update - Update object
   * @param options - Update options
   * @returns Promise resolving to updated entity or null
   */
  updateById<T extends BaseEntity>(collection: string, id: string, update: Partial<T>, options?: UpdateOptions): Promise<T | null>;
  
  /**
   * Delete entity
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to number of deleted entities
   */
  delete(collection: string, query: Record<string, any>): Promise<number>;
  
  /**
   * Delete entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @returns Promise resolving to deletion success
   */
  deleteById(collection: string, id: string): Promise<boolean>;
  
  /**
   * Count entities
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to entity count
   */
  count(collection: string, query: Record<string, any>): Promise<number>;
  
  /**
   * Check if collection exists
   * @param collection - Collection name
   * @returns Promise resolving to existence check result
   */
  collectionExists(collection: string): Promise<boolean>;
  
  /**
   * Create collection
   * @param collection - Collection name
   * @returns Promise resolving to creation success
   */
  createCollection(collection: string): Promise<boolean>;
  
  /**
   * Drop collection
   * @param collection - Collection name
   * @returns Promise resolving to drop success
   */
  dropCollection(collection: string): Promise<boolean>;
  
  /**
   * Get collection names
   * @returns Promise resolving to collection names
   */
  getCollectionNames(): Promise<string[]>;
  
  /**
   * Execute raw query
   * @param query - Raw query
   * @returns Promise resolving to query result
   */
  executeRawQuery<T>(query: any): Promise<T>;
  
  /**
   * Watch collection for changes
   * @param collection - Collection name
   * @param callback - Change callback
   * @returns Promise resolving to watch ID
   */
  watch(collection: string, callback: (change: any) => void): Promise<string>;
  
  /**
   * Stop watching collection
   * @param watchId - Watch ID
   * @returns Promise resolving to stop success
   */
  stopWatch(watchId: string): Promise<boolean>;
}