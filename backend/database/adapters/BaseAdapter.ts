/**
 * Base Database Adapter
 * 
 * Base implementation for all database adapters.
 * Provides common functionality and default implementations.
 * 
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { 
  DatabaseAdapter, 
  DatabaseAdapterOptions, 
  QueryOptions, 
  UpdateOptions 
} from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';

/**
 * Default adapter options
 */
const DEFAULT_OPTIONS: DatabaseAdapterOptions = {
  debugMode: false,
  connectionTimeout: 30000,
  operationTimeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  cacheEnabled: true,
  cacheTTL: 60000,
  batchSize: 100
};

/**
 * Base adapter implementation
 */
export abstract class BaseAdapter extends EventEmitter implements DatabaseAdapter {
  /** Adapter name */
  readonly name: string;
  
  /** Adapter type */
  readonly type: string;
  
  /** Adapter options */
  readonly options: DatabaseAdapterOptions;
  
  /** Is connected */
  protected _isConnected: boolean = false;
  
  /** Active watches */
  protected watches: Map<string, any> = new Map();
  
  /** Cache */
  protected cache: Map<string, { data: any; expires: number }> = new Map();
  
  /**
   * Constructor
   * @param name - Adapter name
   * @param type - Adapter type
   * @param options - Adapter options
   */
  constructor(name: string, type: string, options: DatabaseAdapterOptions = {}) {
    super();
    
    this.name = name;
    this.type = type;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    this.log(`Initialized ${this.name} adapter`);
  }
  
  /**
   * Get is connected
   */
  get isConnected(): boolean {
    return this._isConnected;
  }
  
  /**
   * Connect to the database
   * @returns Promise resolving to connection success
   */
  abstract connect(): Promise<boolean>;
  
  /**
   * Disconnect from the database
   * @returns Promise resolving to disconnection success
   */
  abstract disconnect(): Promise<boolean>;
  
  /**
   * Find entities by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  abstract find<T extends BaseEntity>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T[]>;
  
  /**
   * Find one entity by query
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  abstract findOne<T extends BaseEntity>(collection: string, query: Record<string, any>, options?: QueryOptions): Promise<T | null>;
  
  /**
   * Find entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  async findById<T extends BaseEntity>(collection: string, id: string, options?: QueryOptions): Promise<T | null> {
    return this.findOne<T>(collection, { id }, options);
  }  
  /**
   * Insert entity
   * @param collection - Collection name
   * @param entity - Entity to insert
   * @returns Promise resolving to inserted entity
   */
  abstract insert<T extends BaseEntity>(collection: string, entity: T): Promise<T>;
  
  /**
   * Insert multiple entities
   * @param collection - Collection name
   * @param entities - Entities to insert
   * @returns Promise resolving to inserted entities
   */
  abstract insertMany<T extends BaseEntity>(collection: string, entities: T[]): Promise<T[]>;
  
  /**
   * Update entity
   * @param collection - Collection name
   * @param query - Query object
   * @param update - Update object
   * @param options - Update options
   * @returns Promise resolving to update result
   */
  abstract update<T extends BaseEntity>(
    collection: string, 
    query: Record<string, any>, 
    update: Partial<T>, 
    options?: UpdateOptions
  ): Promise<{ matched: number; modified: number; upserted?: T }>;
  
  /**
   * Update entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param update - Update object
   * @param options - Update options
   * @returns Promise resolving to updated entity or null
   */
  async updateById<T extends BaseEntity>(
    collection: string, 
    id: string, 
    update: Partial<T>, 
    options?: UpdateOptions
  ): Promise<T | null> {
    const result = await this.update<T>(collection, { id }, update, { 
      ...options, 
      multi: false,
      returnUpdated: true 
    });
    
    if (result.modified === 0) {
      return null;
    }
    
    return this.findById<T>(collection, id);
  }
  
  /**
   * Delete entity
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to number of deleted entities
   */
  abstract delete(collection: string, query: Record<string, any>): Promise<number>;
  
  /**
   * Delete entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @returns Promise resolving to deletion success
   */
  async deleteById(collection: string, id: string): Promise<boolean> {
    const deleted = await this.delete(collection, { id });
    return deleted > 0;
  }
  
  /**
   * Count entities
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to entity count
   */
  abstract count(collection: string, query: Record<string, any>): Promise<number>;  
  /**
   * Check if collection exists
   * @param collection - Collection name
   * @returns Promise resolving to existence check result
   */
  abstract collectionExists(collection: string): Promise<boolean>;
  
  /**
   * Create collection
   * @param collection - Collection name
   * @returns Promise resolving to creation success
   */
  abstract createCollection(collection: string): Promise<boolean>;
  
  /**
   * Drop collection
   * @param collection - Collection name
   * @returns Promise resolving to drop success
   */
  abstract dropCollection(collection: string): Promise<boolean>;
  
  /**
   * Get collection names
   * @returns Promise resolving to collection names
   */
  abstract getCollectionNames(): Promise<string[]>;
  
  /**
   * Execute raw query
   * @param query - Raw query
   * @returns Promise resolving to query result
   */
  abstract executeRawQuery<T>(query: any): Promise<T>;
  
  /**
   * Watch collection for changes
   * @param collection - Collection name
   * @param callback - Change callback
   * @returns Promise resolving to watch ID
   */
  abstract watch(collection: string, callback: (change: any) => void): Promise<string>;
  
  /**
   * Stop watching collection
   * @param watchId - Watch ID
   * @returns Promise resolving to stop success
   */
  abstract stopWatch(watchId: string): Promise<boolean>;
  
  /**
   * Get cache key
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Cache key
   */
  protected getCacheKey(collection: string, query: Record<string, any>, options?: QueryOptions): string {
    return `${collection}:${JSON.stringify(query)}:${JSON.stringify(options || {})}`;
  }
  
  /**
   * Get from cache
   * @param key - Cache key
   * @returns Cached data or null
   */
  protected getFromCache<T>(key: string): T | null {
    if (!this.options.cacheEnabled) {
      return null;
    }
    
    const cached = this.cache.get(key);
    
    if (!cached) {
      return null;
    }
    
    // Check if expired
    if (cached.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }  
  /**
   * Set in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  protected setInCache<T>(key: string, data: T): void {
    if (!this.options.cacheEnabled) {
      return;
    }
    
    const expires = Date.now() + (this.options.cacheTTL || 60000);
    
    this.cache.set(key, {
      data,
      expires
    });
  }
  
  /**
   * Clear cache
   * @param collection - Collection name (optional, if provided only clears cache for this collection)
   */
  protected clearCache(collection?: string): void {
    if (!this.options.cacheEnabled) {
      return;
    }
    
    if (collection) {
      // Clear cache for collection
      const prefix = `${collection}:`;
      
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
      
      this.log(`Cleared cache for collection: ${collection}`);
    } else {
      // Clear all cache
      this.cache.clear();
      this.log('Cleared all cache');
    }
  }
  
  /**
   * Generate ID
   * @returns Generated ID
   */
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  protected log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[${this.name}Adapter] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  protected logError(message: string, error: any): void {
    console.error(`[${this.name}Adapter] ${message}`, error);
    this.emit('error', { message, error });
  }
}