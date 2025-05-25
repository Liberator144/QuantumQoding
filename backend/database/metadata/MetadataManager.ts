/**
 * Metadata Manager
 * 
 * Manages metadata for database entities.
 * 
 * @version 1.0.0
 */

import { BaseEntity } from '../schemas/BaseSchema';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';

/**
 * Metadata type
 */
export enum MetadataType {
  SCHEMA = 'schema',
  RELATIONSHIP = 'relationship',
  MAPPING = 'mapping',
  QUANTUM = 'quantum',
  CUSTOM = 'custom'
}

/**
 * Metadata entry
 */
export interface MetadataEntry {
  /** Metadata ID */
  id: string;
  
  /** Metadata type */
  type: MetadataType | string;
  
  /** Metadata key */
  key: string;
  
  /** Metadata value */
  value: any;
  
  /** Entity ID */
  entityId?: string;
  
  /** Entity type */
  entityType?: string;
  
  /** Collection name */
  collection?: string;
  
  /** Source type */
  sourceType?: string;
  
  /** Created at */
  createdAt: Date;
  
  /** Updated at */
  updatedAt: Date;
  
  /** Version */
  version?: number;
}

/**
 * Metadata manager options
 */
export interface MetadataManagerOptions {
  /** Metadata collection name */
  metadataCollection?: string;
  
  /** Cache enabled */
  cacheEnabled?: boolean;
  
  /** Cache TTL (ms) */
  cacheTTL?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}/**
 * Default metadata manager options
 */
const DEFAULT_OPTIONS: MetadataManagerOptions = {
  metadataCollection: '_metadata',
  cacheEnabled: true,
  cacheTTL: 60000,
  debugMode: false
};

/**
 * Metadata manager
 */
export class MetadataManager {
  /** Options */
  private options: MetadataManagerOptions;
  
  /** Database adapter */
  private adapter: DatabaseAdapter;
  
  /** Cache */
  private cache: Map<string, { data: any; expires: number }> = new Map();
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param adapter - Database adapter
   * @param options - Metadata manager options
   */
  constructor(adapter: DatabaseAdapter, options: MetadataManagerOptions = {}) {
    this.adapter = adapter;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Initialize metadata manager
   * @returns Promise resolving to initialization success
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if metadata collection exists
      const exists = await this.adapter.collectionExists(this.options.metadataCollection!);
      
      if (!exists) {
        // Create metadata collection
        await this.adapter.createCollection(this.options.metadataCollection!);
      }
      
      this.isInitialized = true;
      this.log('Metadata manager initialized');
      
      return true;
    } catch (error) {
      this.logError('Failed to initialize metadata manager', error);
      return false;
    }
  }  
  /**
   * Ensure initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Metadata manager not initialized');
    }
  }
  
  /**
   * Get metadata
   * @param key - Metadata key
   * @param type - Metadata type
   * @param entityId - Entity ID
   * @returns Promise resolving to metadata entry or null
   */
  async getMetadata(key: string, type: MetadataType | string, entityId?: string): Promise<MetadataEntry | null> {
    this.ensureInitialized();
    
    // Check cache
    const cacheKey = this.getCacheKey(key, type, entityId);
    const cached = this.getFromCache<MetadataEntry | null>(cacheKey);
    
    if (cached !== undefined) {
      return cached;
    }
    
    try {
      // Build query
      const query: Record<string, any> = {
        key,
        type
      };
      
      if (entityId) {
        query.entityId = entityId;
      }
      
      // Find metadata entry
      const entry = await this.adapter.findOne<MetadataEntry>(this.options.metadataCollection!, query);
      
      // Cache result
      this.setInCache(cacheKey, entry);
      
      return entry;
    } catch (error) {
      this.logError(`Failed to get metadata: ${key}`, error);
      throw error;
    }
  }
  
  /**
   * Set metadata
   * @param key - Metadata key
   * @param value - Metadata value
   * @param type - Metadata type
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @param collection - Collection name
   * @param sourceType - Source type
   * @returns Promise resolving to metadata entry
   */
  async setMetadata(
    key: string,
    value: any,
    type: MetadataType | string,
    entityId?: string,
    entityType?: string,
    collection?: string,
    sourceType?: string
  ): Promise<MetadataEntry> {    this.ensureInitialized();
    
    try {
      // Build query
      const query: Record<string, any> = {
        key,
        type
      };
      
      if (entityId) {
        query.entityId = entityId;
      }
      
      // Check if metadata entry exists
      const existingEntry = await this.adapter.findOne<MetadataEntry>(this.options.metadataCollection!, query);
      
      if (existingEntry) {
        // Update existing entry
        const updatedEntry: MetadataEntry = {
          ...existingEntry,
          value,
          updatedAt: new Date(),
          version: (existingEntry.version || 0) + 1
        };
        
        // Update entry
        await this.adapter.updateById(this.options.metadataCollection!, existingEntry.id, updatedEntry);
        
        // Clear cache
        this.clearFromCache(key, type, entityId);
        
        return updatedEntry;
      } else {
        // Create new entry
        const newEntry: MetadataEntry = {
          id: this.generateId(),
          key,
          type,
          value,
          entityId,
          entityType,
          collection,
          sourceType,
          createdAt: new Date(),
          updatedAt: new Date(),
          version: 1
        };
        
        // Insert entry
        const insertedEntry = await this.adapter.insert<MetadataEntry>(this.options.metadataCollection!, newEntry);
        
        // Clear cache
        this.clearFromCache(key, type, entityId);
        
        return insertedEntry;
      }
    } catch (error) {
      this.logError(`Failed to set metadata: ${key}`, error);
      throw error;
    }
  }  
  /**
   * Delete metadata
   * @param key - Metadata key
   * @param type - Metadata type
   * @param entityId - Entity ID
   * @returns Promise resolving to deletion success
   */
  async deleteMetadata(key: string, type: MetadataType | string, entityId?: string): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      // Build query
      const query: Record<string, any> = {
        key,
        type
      };
      
      if (entityId) {
        query.entityId = entityId;
      }
      
      // Delete metadata entry
      const deleted = await this.adapter.delete(this.options.metadataCollection!, query);
      
      // Clear cache
      this.clearFromCache(key, type, entityId);
      
      return deleted > 0;
    } catch (error) {
      this.logError(`Failed to delete metadata: ${key}`, error);
      throw error;
    }
  }
  
  /**
   * Get metadata by entity
   * @param entityId - Entity ID
   * @param type - Metadata type (optional)
   * @returns Promise resolving to metadata entries
   */
  async getMetadataByEntity(entityId: string, type?: MetadataType | string): Promise<MetadataEntry[]> {
    this.ensureInitialized();
    
    try {
      // Build query
      const query: Record<string, any> = {
        entityId
      };
      
      if (type) {
        query.type = type;
      }
      
      // Find metadata entries
      return await this.adapter.find<MetadataEntry>(this.options.metadataCollection!, query);
    } catch (error) {
      this.logError(`Failed to get metadata by entity: ${entityId}`, error);
      throw error;
    }
  }  
  /**
   * Get metadata by collection
   * @param collection - Collection name
   * @param type - Metadata type (optional)
   * @returns Promise resolving to metadata entries
   */
  async getMetadataByCollection(collection: string, type?: MetadataType | string): Promise<MetadataEntry[]> {
    this.ensureInitialized();
    
    try {
      // Build query
      const query: Record<string, any> = {
        collection
      };
      
      if (type) {
        query.type = type;
      }
      
      // Find metadata entries
      return await this.adapter.find<MetadataEntry>(this.options.metadataCollection!, query);
    } catch (error) {
      this.logError(`Failed to get metadata by collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Get metadata by type
   * @param type - Metadata type
   * @returns Promise resolving to metadata entries
   */
  async getMetadataByType(type: MetadataType | string): Promise<MetadataEntry[]> {
    this.ensureInitialized();
    
    try {
      // Find metadata entries
      return await this.adapter.find<MetadataEntry>(this.options.metadataCollection!, { type });
    } catch (error) {
      this.logError(`Failed to get metadata by type: ${type}`, error);
      throw error;
    }
  }
  
  /**
   * Get schema metadata
   * @param entityType - Entity type
   * @returns Promise resolving to schema metadata
   */
  async getSchemaMetadata(entityType: string): Promise<any | null> {
    const entry = await this.getMetadata(`schema:${entityType}`, MetadataType.SCHEMA);
    return entry ? entry.value : null;
  }  
  /**
   * Set schema metadata
   * @param entityType - Entity type
   * @param schema - Schema metadata
   * @returns Promise resolving to metadata entry
   */
  async setSchemaMetadata(entityType: string, schema: any): Promise<MetadataEntry> {
    return this.setMetadata(`schema:${entityType}`, schema, MetadataType.SCHEMA);
  }
  
  /**
   * Get mapping metadata
   * @param sourceType - Source type
   * @param entityType - Entity type
   * @returns Promise resolving to mapping metadata
   */
  async getMappingMetadata(sourceType: string, entityType: string): Promise<any | null> {
    const entry = await this.getMetadata(`mapping:${sourceType}:${entityType}`, MetadataType.MAPPING);
    return entry ? entry.value : null;
  }
  
  /**
   * Set mapping metadata
   * @param sourceType - Source type
   * @param entityType - Entity type
   * @param mapping - Mapping metadata
   * @returns Promise resolving to metadata entry
   */
  async setMappingMetadata(sourceType: string, entityType: string, mapping: any): Promise<MetadataEntry> {
    return this.setMetadata(
      `mapping:${sourceType}:${entityType}`,
      mapping,
      MetadataType.MAPPING,
      undefined,
      entityType,
      undefined,
      sourceType
    );
  }
  
  /**
   * Get relationship metadata
   * @param entityId - Entity ID
   * @returns Promise resolving to relationship metadata
   */
  async getRelationshipMetadata(entityId: string): Promise<any | null> {
    const entry = await this.getMetadata(`relationship:${entityId}`, MetadataType.RELATIONSHIP, entityId);
    return entry ? entry.value : null;
  }  
  /**
   * Set relationship metadata
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @param relationships - Relationship metadata
   * @returns Promise resolving to metadata entry
   */
  async setRelationshipMetadata(entityId: string, entityType: string, relationships: any): Promise<MetadataEntry> {
    return this.setMetadata(
      `relationship:${entityId}`,
      relationships,
      MetadataType.RELATIONSHIP,
      entityId,
      entityType
    );
  }
  
  /**
   * Get quantum metadata
   * @param entityId - Entity ID
   * @returns Promise resolving to quantum metadata
   */
  async getQuantumMetadata(entityId: string): Promise<any | null> {
    const entry = await this.getMetadata(`quantum:${entityId}`, MetadataType.QUANTUM, entityId);
    return entry ? entry.value : null;
  }
  
  /**
   * Set quantum metadata
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @param quantum - Quantum metadata
   * @returns Promise resolving to metadata entry
   */
  async setQuantumMetadata(entityId: string, entityType: string, quantum: any): Promise<MetadataEntry> {
    return this.setMetadata(
      `quantum:${entityId}`,
      quantum,
      MetadataType.QUANTUM,
      entityId,
      entityType
    );
  }
  
  /**
   * Get cache key
   * @param key - Metadata key
   * @param type - Metadata type
   * @param entityId - Entity ID
   * @returns Cache key
   */
  private getCacheKey(key: string, type: MetadataType | string, entityId?: string): string {
    return `${type}:${key}:${entityId || ''}`;
  }  
  /**
   * Get from cache
   * @param key - Cache key
   * @returns Cached data or undefined
   */
  private getFromCache<T>(key: string): T | undefined {
    if (!this.options.cacheEnabled) {
      return undefined;
    }
    
    const cached = this.cache.get(key);
    
    if (!cached) {
      return undefined;
    }
    
    // Check if expired
    if (cached.expires < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }
    
    return cached.data;
  }
  
  /**
   * Set in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private setInCache<T>(key: string, data: T): void {
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
   * Clear from cache
   * @param key - Metadata key
   * @param type - Metadata type
   * @param entityId - Entity ID
   */
  private clearFromCache(key: string, type: MetadataType | string, entityId?: string): void {
    if (!this.options.cacheEnabled) {
      return;
    }
    
    const cacheKey = this.getCacheKey(key, type, entityId);
    this.cache.delete(cacheKey);
  }  
  /**
   * Clear cache
   */
  clearCache(): void {
    if (!this.options.cacheEnabled) {
      return;
    }
    
    this.cache.clear();
    this.log('Cache cleared');
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
      console.log(`[MetadataManager] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[MetadataManager] ${message}`, error);
  }
}

export default MetadataManager;