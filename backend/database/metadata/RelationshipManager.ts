/**
 * Relationship Manager
 * 
 * Manages relationships between entities.
 * 
 * @version 1.0.0
 */

import { BaseEntity, EntityRelationship } from '../schemas/BaseSchema';
import { MetadataManager, MetadataType } from './MetadataManager';

/**
 * Relationship type
 */
export enum RelationshipType {
  PARENT_CHILD = 'parent_child',
  REFERENCE = 'reference',
  ASSOCIATION = 'association',
  DEPENDENCY = 'dependency',
  OWNERSHIP = 'ownership',
  CUSTOM = 'custom'
}

/**
 * Relationship direction
 */
export enum RelationshipDirection {
  INBOUND = 'inbound',
  OUTBOUND = 'outbound',
  BIDIRECTIONAL = 'bidirectional'
}

/**
 * Relationship definition
 */
export interface RelationshipDefinition {
  /** Source entity ID */
  sourceId: string;
  
  /** Source entity type */
  sourceType: string;
  
  /** Target entity ID */
  targetId: string;
  
  /** Target entity type */
  targetType: string;
  
  /** Relationship type */
  type: RelationshipType | string;
  
  /** Relationship direction */
  direction: RelationshipDirection;
  
  /** Relationship strength (0-1) */
  strength?: number;
  
  /** Relationship metadata */
  metadata?: Record<string, any>;
  
  /** Created at */
  createdAt: Date;
  
  /** Updated at */
  updatedAt: Date;
}

/**
 * Relationship query
 */
export interface RelationshipQuery {
  /** Source entity ID */
  sourceId?: string;
  
  /** Source entity type */
  sourceType?: string;
  
  /** Target entity ID */
  targetId?: string;
  
  /** Target entity type */
  targetType?: string;
  
  /** Relationship type */
  type?: RelationshipType | string;
  
  /** Relationship direction */
  direction?: RelationshipDirection;
}/**
 * Relationship manager options
 */
export interface RelationshipManagerOptions {
  /** Relationship collection name */
  relationshipCollection?: string;
  
  /** Cache enabled */
  cacheEnabled?: boolean;
  
  /** Cache TTL (ms) */
  cacheTTL?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default relationship manager options
 */
const DEFAULT_OPTIONS: RelationshipManagerOptions = {
  relationshipCollection: '_relationships',
  cacheEnabled: true,
  cacheTTL: 60000,
  debugMode: false
};

/**
 * Relationship manager
 */
export class RelationshipManager {
  /** Options */
  private options: RelationshipManagerOptions;
  
  /** Metadata manager */
  private metadataManager: MetadataManager;
  
  /** Cache */
  private cache: Map<string, { data: any; expires: number }> = new Map();
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param metadataManager - Metadata manager
   * @param options - Relationship manager options
   */
  constructor(metadataManager: MetadataManager, options: RelationshipManagerOptions = {}) {
    this.metadataManager = metadataManager;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  
  /**
   * Initialize relationship manager
   * @returns Promise resolving to initialization success
   */
  async initialize(): Promise<boolean> {
    try {
      // Initialize metadata manager
      if (!this.metadataManager) {
        throw new Error('Metadata manager is required');
      }
      
      this.isInitialized = true;
      this.log('Relationship manager initialized');
      
      return true;
    } catch (error) {
      this.logError('Failed to initialize relationship manager', error);
      return false;
    }
  }  
  /**
   * Ensure initialized
   * @throws Error if not initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Relationship manager not initialized');
    }
  }
  
  /**
   * Create relationship
   * @param relationship - Relationship definition
   * @returns Promise resolving to creation success
   */
  async createRelationship(relationship: RelationshipDefinition): Promise<boolean> {
    this.ensureInitialized();
    
    try {
      // Set timestamps
      const now = new Date();
      relationship.createdAt = now;
      relationship.updatedAt = now;
      
      // Store relationship in source entity metadata
      await this.storeRelationshipInEntity(
        relationship.sourceId,
        relationship.sourceType,
        {
          type: relationship.type,
          targetId: relationship.targetId,
          targetType: relationship.targetType,
          direction: relationship.direction,
          strength: relationship.strength,
          metadata: relationship.metadata
        }
      );
      
      // If bidirectional, store relationship in target entity metadata
      if (relationship.direction === RelationshipDirection.BIDIRECTIONAL) {
        await this.storeRelationshipInEntity(
          relationship.targetId,
          relationship.targetType,
          {
            type: relationship.type,
            targetId: relationship.sourceId,
            targetType: relationship.sourceType,
            direction: RelationshipDirection.BIDIRECTIONAL,
            strength: relationship.strength,
            metadata: relationship.metadata
          }
        );
      }
      
      // Clear cache
      this.clearFromCache(relationship.sourceId);
      this.clearFromCache(relationship.targetId);
      
      return true;
    } catch (error) {
      this.logError('Failed to create relationship', error);
      throw error;
    }
  }  
  /**
   * Store relationship in entity metadata
   * @param entityId - Entity ID
   * @param entityType - Entity type
   * @param relationship - Entity relationship
   */
  private async storeRelationshipInEntity(
    entityId: string,
    entityType: string,
    relationship: EntityRelationship
  ): Promise<void> {
    // Get existing relationships
    const relationships = await this.getEntityRelationships(entityId);
    
    // Add new relationship
    relationships.push(relationship);
    
    // Store relationships
    await this.metadataManager.setRelationshipMetadata(entityId, entityType, relationships);
  }
  
  /**
   * Get entity relationships
   * @param entityId - Entity ID
   * @returns Promise resolving to entity relationships
   */
  async getEntityRelationships(entityId: string): Promise<EntityRelationship[]> {
    this.ensureInitialized();
    
    // Check cache
    const cacheKey = this.getCacheKey(entityId);
    const cached = this.getFromCache<EntityRelationship[]>(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    try {
      // Get relationships from metadata
      const relationships = await this.metadataManager.getRelationshipMetadata(entityId) || [];
      
      // Cache relationships
      this.setInCache(cacheKey, relationships);
      
      return relationships;
    } catch (error) {
      this.logError(`Failed to get relationships for entity: ${entityId}`, error);
      throw error;
    }
  }
  
  /**
   * Delete relationship
   * @param sourceId - Source entity ID
   * @param targetId - Target entity ID
   * @param type - Relationship type
   * @returns Promise resolving to deletion success
   */
  async deleteRelationship(
    sourceId: string,
    targetId: string,
    type: RelationshipType | string
  ): Promise<boolean> {    this.ensureInitialized();
    
    try {
      // Get source entity relationships
      const sourceRelationships = await this.getEntityRelationships(sourceId);
      
      // Find relationship index
      const sourceIndex = sourceRelationships.findIndex(rel => 
        rel.targetId === targetId && rel.type === type
      );
      
      if (sourceIndex === -1) {
        return false;
      }
      
      // Get relationship direction
      const direction = sourceRelationships[sourceIndex].direction;
      
      // Remove relationship from source
      sourceRelationships.splice(sourceIndex, 1);
      
      // Update source entity relationships
      await this.metadataManager.setRelationshipMetadata(
        sourceId,
        sourceRelationships[sourceIndex]?.targetType || 'unknown',
        sourceRelationships
      );
      
      // If bidirectional, remove relationship from target
      if (direction === RelationshipDirection.BIDIRECTIONAL) {
        // Get target entity relationships
        const targetRelationships = await this.getEntityRelationships(targetId);
        
        // Find relationship index
        const targetIndex = targetRelationships.findIndex(rel => 
          rel.targetId === sourceId && rel.type === type
        );
        
        if (targetIndex !== -1) {
          // Remove relationship from target
          targetRelationships.splice(targetIndex, 1);
          
          // Update target entity relationships
          await this.metadataManager.setRelationshipMetadata(
            targetId,
            targetRelationships[targetIndex]?.targetType || 'unknown',
            targetRelationships
          );
        }
      }
      
      // Clear cache
      this.clearFromCache(sourceId);
      this.clearFromCache(targetId);
      
      return true;
    } catch (error) {
      this.logError('Failed to delete relationship', error);
      throw error;
    }
  }  
  /**
   * Find relationships
   * @param query - Relationship query
   * @returns Promise resolving to relationships
   */
  async findRelationships(query: RelationshipQuery): Promise<RelationshipDefinition[]> {
    this.ensureInitialized();
    
    try {
      const results: RelationshipDefinition[] = [];
      
      // If source ID is provided, search source entity relationships
      if (query.sourceId) {
        const sourceRelationships = await this.getEntityRelationships(query.sourceId);
        
        // Filter relationships
        for (const relationship of sourceRelationships) {
          // Check if relationship matches query
          if (
            (!query.targetId || relationship.targetId === query.targetId) &&
            (!query.targetType || relationship.targetType === query.targetType) &&
            (!query.type || relationship.type === query.type) &&
            (!query.direction || relationship.direction === query.direction)
          ) {
            // Add relationship to results
            results.push({
              sourceId: query.sourceId,
              sourceType: query.sourceType || 'unknown',
              targetId: relationship.targetId,
              targetType: relationship.targetType,
              type: relationship.type,
              direction: relationship.direction,
              strength: relationship.strength,
              metadata: relationship.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      }
      // If target ID is provided but source ID is not, search target entity relationships
      else if (query.targetId) {
        const targetRelationships = await this.getEntityRelationships(query.targetId);
        
        // Filter relationships
        for (const relationship of targetRelationships) {
          // Check if relationship matches query
          if (
            (!query.sourceType || relationship.targetType === query.sourceType) &&
            (!query.type || relationship.type === query.type) &&
            (!query.direction || relationship.direction === query.direction)
          ) {            // Add relationship to results
            results.push({
              sourceId: relationship.targetId,
              sourceType: relationship.targetType,
              targetId: query.targetId,
              targetType: query.targetType || 'unknown',
              type: relationship.type,
              direction: relationship.direction,
              strength: relationship.strength,
              metadata: relationship.metadata,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        }
      }
      
      return results;
    } catch (error) {
      this.logError('Failed to find relationships', error);
      throw error;
    }
  }
  
  /**
   * Get cache key
   * @param entityId - Entity ID
   * @returns Cache key
   */
  private getCacheKey(entityId: string): string {
    return `relationships:${entityId}`;
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
   * @param entityId - Entity ID
   */
  private clearFromCache(entityId: string): void {
    if (!this.options.cacheEnabled) {
      return;
    }
    
    const cacheKey = this.getCacheKey(entityId);
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
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[RelationshipManager] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[RelationshipManager] ${message}`, error);
  }
}

export default RelationshipManager;