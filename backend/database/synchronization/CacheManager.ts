/**
 * Cache Manager
 * 
 * Manages data caching for database entities.
 * 
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';

/**
 * Cache entry
 */
export interface CacheEntry<T> {
  /** Data */
  data: T;
  
  /** Expires at */
  expiresAt: number;
  
  /** Last accessed at */
  lastAccessedAt: number;
  
  /** Access count */
  accessCount: number;
}

/**
 * Cache manager options
 */
export interface CacheManagerOptions {
  /** Default TTL (ms) */
  defaultTTL?: number;
  
  /** Maximum cache size */
  maxSize?: number;
  
  /** Cleanup interval (ms) */
  cleanupInterval?: number;
  
  /** Prefetch enabled */
  prefetchEnabled?: boolean;
  
  /** Prefetch threshold */
  prefetchThreshold?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default cache manager options
 */
const DEFAULT_OPTIONS: CacheManagerOptions = {
  defaultTTL: 60000,
  maxSize: 1000,
  cleanupInterval: 30000,
  prefetchEnabled: true,
  prefetchThreshold: 0.8,
  debugMode: false
};/**
 * Cache manager
 */
export class CacheManager extends EventEmitter {
  /** Options */
  private options: CacheManagerOptions;
  
  /** Database adapter */
  private adapter: DatabaseAdapter;
  
  /** Cache */
  private cache: Map<string, CacheEntry<any>> = new Map();
  
  /** Prefetch queue */
  private prefetchQueue: Set<string> = new Set();
  
  /** Cleanup timer */
  private cleanupTimer: NodeJS.Timeout | null = null;
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /** Cache statistics */
  private statistics = {
    hits: 0,
    misses: 0,
    evictions: 0,
    prefetches: 0
  };
  
  /**
   * Constructor
   * @param adapter - Database adapter
   * @param options - Cache manager options
   */
  constructor(adapter: DatabaseAdapter, options: CacheManagerOptions = {}) {
    super();
    
    this.adapter = adapter;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Initialize cache manager
   * @returns Promise resolving to initialization success
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if adapter is connected
      if (!this.adapter.isConnected) {
        throw new Error('Adapter is not connected');
      }
      
      // Start cleanup timer
      this.startCleanupTimer();
      
      this.isInitialized = true;
      this.log('Cache manager initialized');
      
      return true;
    } catch (error) {
      this.logError('Failed to initialize cache manager', error);
      return false;
    }
  }  
  /**
   * Ensure initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Cache manager not initialized');
    }
  }
  
  /**
   * Start cleanup timer
   */
  private startCleanupTimer(): void {
    // Stop existing timer
    this.stopCleanupTimer();
    
    // Start new timer
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.options.cleanupInterval);
  }
  
  /**
   * Stop cleanup timer
   */
  private stopCleanupTimer(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  
  /**
   * Cleanup
   */
  private cleanup(): void {
    const now = Date.now();
    let evictionCount = 0;
    
    // Remove expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt <= now) {
        this.cache.delete(key);
        evictionCount++;
      }
    }
    
    // Check if cache is too large
    if (this.cache.size > this.options.maxSize!) {
      // Sort entries by last accessed time
      const entries = Array.from(this.cache.entries())
        .sort((a, b) => a[1].lastAccessedAt - b[1].lastAccessedAt);
      
      // Remove oldest entries
      const removeCount = this.cache.size - this.options.maxSize!;
      
      for (let i = 0; i < removeCount; i++) {
        this.cache.delete(entries[i][0]);
        evictionCount++;
      }
    }    
    // Process prefetch queue
    this.processPrefetchQueue();
    
    // Update statistics
    this.statistics.evictions += evictionCount;
    
    if (evictionCount > 0) {
      this.log(`Cleaned up ${evictionCount} cache entries`);
    }
  }
  
  /**
   * Process prefetch queue
   */
  private async processPrefetchQueue(): Promise<void> {
    if (!this.options.prefetchEnabled || this.prefetchQueue.size === 0) {
      return;
    }
    
    // Get keys to prefetch
    const keys = Array.from(this.prefetchQueue);
    this.prefetchQueue.clear();
    
    // Prefetch in batches
    const batchSize = 10;
    
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      
      // Prefetch batch
      for (const key of batch) {
        const [collection, id] = key.split(':');
        
        try {
          // Check if already in cache
          if (this.cache.has(key)) {
            continue;
          }
          
          // Fetch entity
          const entity = await this.adapter.findById(collection, id);
          
          if (entity) {
            // Add to cache
            this.setInCache(collection, id, entity);
            
            // Update statistics
            this.statistics.prefetches++;
          }
        } catch (error) {
          this.logError(`Failed to prefetch entity: ${key}`, error);
        }
      }
    }
  }  
  /**
   * Get entity from cache
   * @param collection - Collection name
   * @param id - Entity ID
   * @returns Entity or null
   */
  get<T extends BaseEntity>(collection: string, id: string): T | null {
    this.ensureInitialized();
    
    // Get cache key
    const key = this.getCacheKey(collection, id);
    
    // Get from cache
    const entry = this.cache.get(key);
    
    if (!entry) {
      // Cache miss
      this.statistics.misses++;
      
      // Add to prefetch queue
      if (this.options.prefetchEnabled) {
        this.prefetchQueue.add(key);
      }
      
      return null;
    }
    
    // Check if expired
    if (entry.expiresAt <= Date.now()) {
      // Remove from cache
      this.cache.delete(key);
      
      // Cache miss
      this.statistics.misses++;
      
      // Add to prefetch queue
      if (this.options.prefetchEnabled) {
        this.prefetchQueue.add(key);
      }
      
      return null;
    }
    
    // Update access statistics
    entry.lastAccessedAt = Date.now();
    entry.accessCount++;
    
    // Cache hit
    this.statistics.hits++;
    
    return entry.data;
  }
  
  /**
   * Set entity in cache
   * @param collection - Collection name
   * @param id - Entity ID
   * @param entity - Entity
   * @param ttl - TTL (ms)
   */
  set<T extends BaseEntity>(collection: string, id: string, entity: T, ttl?: number): void {    this.ensureInitialized();
    
    // Set in cache
    this.setInCache(collection, id, entity, ttl);
  }
  
  /**
   * Set entity in cache
   * @param collection - Collection name
   * @param id - Entity ID
   * @param entity - Entity
   * @param ttl - TTL (ms)
   */
  private setInCache<T extends BaseEntity>(collection: string, id: string, entity: T, ttl?: number): void {
    // Get cache key
    const key = this.getCacheKey(collection, id);
    
    // Calculate expiration time
    const expiresAt = Date.now() + (ttl || this.options.defaultTTL!);
    
    // Create cache entry
    const entry: CacheEntry<T> = {
      data: entity,
      expiresAt,
      lastAccessedAt: Date.now(),
      accessCount: 0
    };
    
    // Add to cache
    this.cache.set(key, entry);
    
    // Check if cache is too large
    if (this.cache.size > this.options.maxSize!) {
      this.cleanup();
    }
  }
  
  /**
   * Remove entity from cache
   * @param collection - Collection name
   * @param id - Entity ID
   */
  remove(collection: string, id: string): void {
    this.ensureInitialized();
    
    // Get cache key
    const key = this.getCacheKey(collection, id);
    
    // Remove from cache
    this.cache.delete(key);
  }
  
  /**
   * Clear cache
   */
  clear(): void {
    this.ensureInitialized();
    
    // Clear cache
    this.cache.clear();
    
    this.log('Cache cleared');
  }  
  /**
   * Get cache key
   * @param collection - Collection name
   * @param id - Entity ID
   * @returns Cache key
   */
  private getCacheKey(collection: string, id: string): string {
    return `${collection}:${id}`;
  }
  
  /**
   * Get cache statistics
   * @returns Cache statistics
   */
  getStatistics(): any {
    this.ensureInitialized();
    
    return {
      ...this.statistics,
      size: this.cache.size,
      maxSize: this.options.maxSize,
      hitRate: this.statistics.hits / Math.max(1, this.statistics.hits + this.statistics.misses)
    };
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop cleanup timer
    this.stopCleanupTimer();
    
    // Clear cache
    this.cache.clear();
    
    // Clear prefetch queue
    this.prefetchQueue.clear();
    
    // Reset statistics
    this.statistics = {
      hits: 0,
      misses: 0,
      evictions: 0,
      prefetches: 0
    };
    
    this.isInitialized = false;
    
    this.log('Cache manager disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[CacheManager] ${message}`);
    }
  }  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[CacheManager] ${message}`, error);
  }
}

export default CacheManager;