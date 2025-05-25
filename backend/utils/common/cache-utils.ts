/**
 * Cache Utilities
 * 
 * This module provides utility functions for cache management.
 * 
 * @version 1.0.0
 */

/**
 * Cache entry with expiration
 */
interface CacheEntry<T> {
  /** Cached value */
  value: T;
  /** Expiration timestamp */
  expiry: number;
}

/**
 * Simple in-memory cache with expiration
 */
export class SimpleCache<T = any> {
  /** Cache storage */
  private cache: Map<string, CacheEntry<T>> = new Map();
  
  /** Default TTL in milliseconds */
  private defaultTtl: number;
  
  /** Debug mode flag */
  private debugMode: boolean;
  
  /** Cache name for logging */
  private name: string;
  
  /**
   * Create a new SimpleCache
   * @param options - Cache options
   */
  constructor(options: {
    /** Default TTL in milliseconds */
    defaultTtl?: number;
    /** Debug mode flag */
    debugMode?: boolean;
    /** Cache name for logging */
    name?: string;
  } = {}) {
    this.defaultTtl = options.defaultTtl || 60000; // 1 minute default
    this.debugMode = options.debugMode || false;
    this.name = options.name || 'SimpleCache';
  }
  
  /**
   * Set a cache entry
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (optional, uses default if not provided)
   */
  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl || this.defaultTtl);
    this.cache.set(key, { value, expiry });
    
    this.log(`Set cache entry: ${key}`);
  }
  
  /**
   * Get a cache entry
   * @param key - Cache key
   * @returns Cached value or undefined if not found or expired
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    // Return undefined if entry doesn't exist
    if (!entry) {
      this.log(`Cache miss: ${key}`);
      return undefined;
    }
    
    // Check if entry has expired
    if (Date.now() > entry.expiry) {
      this.log(`Cache expired: ${key}`);
      this.cache.delete(key);
      return undefined;
    }
    
    this.log(`Cache hit: ${key}`);
    return entry.value;
  }
  
  /**
   * Check if a cache entry exists and is not expired
   * @param key - Cache key
   * @returns Whether the entry exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete a cache entry
   * @param key - Cache key
   */
  delete(key: string): void {
    this.cache.delete(key);
    this.log(`Deleted cache entry: ${key}`);
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.log('Cleared all cache entries');
  }
  
  /**
   * Clear cache entries by prefix
   * @param prefix - Key prefix
   * @returns Number of entries cleared
   */
  clearByPrefix(prefix: string): number {
    let count = 0;
    
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    
    this.log(`Cleared ${count} cache entries with prefix: ${prefix}`);
    return count;
  }
  
  /**
   * Get cache size
   * @returns Number of cache entries
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Get all cache keys
   * @returns Array of cache keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Clean expired entries
   * @returns Number of entries cleaned
   */
  cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
        count++;
      }
    }
    
    this.log(`Cleaned ${count} expired cache entries`);
    return count;
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   * @private
   */
  private log(message: string): void {
    if (this.debugMode) {
      console.log(`[${this.name}] ${message}`);
    }
  }
}
