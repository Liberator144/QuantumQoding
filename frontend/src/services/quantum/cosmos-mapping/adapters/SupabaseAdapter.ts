/**
 * Supabase Adapter for Data-to-Cosmos Mapping System
 * 
 * This module implements a Supabase adapter for the Data-to-Cosmos Mapping System,
 * which maps Supabase entities to cosmic objects in the visualization.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

import {
  Entity,
  EntityType,
  Relationship,
  RelationshipType,
  DataSourceType,
  EntityQuery,
  RelationshipQuery,
  DataAdapter,
} from '../types';

/**
 * Supabase API configuration
 */
export interface SupabaseConfig {
  /** Supabase URL */
  url: string;
  
  /** Supabase API key */
  apiKey: string;
  
  /** Cache timeout in milliseconds */
  cacheTimeout?: number;
}

/**
 * Default Supabase API configuration
 */
const defaultSupabaseConfig: Partial<SupabaseConfig> = {
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
};

/**
 * Supabase adapter for Data-to-Cosmos Mapping System
 */
export class SupabaseAdapter implements DataAdapter {
  /** Adapter name */
  name = 'SupabaseAdapter';
  
  /** Adapter data source type */
  dataSourceType = DataSourceType.SUPABASE;
  
  /** Supabase API configuration */
  private config: SupabaseConfig;
  
  /** Supabase client */
  private client: SupabaseClient;
  
  /** Entity cache */
  private entityCache = new Map<string, Entity>();
  
  /** Relationship cache */
  private relationshipCache = new Map<string, Relationship>();
  
  /** Last cache update timestamp */
  private lastCacheUpdate = 0;
  
  /**
   * Constructor
   * @param config - Supabase API configuration
   */
  constructor(config: SupabaseConfig) {
    this.config = {
      ...defaultSupabaseConfig,
      ...config,
    };
    
    this.client = createClient(this.config.url, this.config.apiKey);
  }
  
  /**
   * Initialize the adapter
   * @param options - Initialization options
   */
  async initialize(options?: Record<string, any>): Promise<void> {
    // Update configuration if provided
    if (options) {
      this.config = {
        ...this.config,
        ...options,
      };
      
      // Recreate client if URL or API key changed
      if (options.url || options.apiKey) {
        this.client = createClient(this.config.url, this.config.apiKey);
      }
    }
    
    // Clear caches
    this.entityCache.clear();
    this.relationshipCache.clear();
    this.lastCacheUpdate = 0;
  }
  
  /**
   * Get entities
   * @param query - Entity query
   * @returns Entities
   */
  async getEntities(query?: EntityQuery): Promise<Entity[]> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    // Filter entities based on query
    let entities = Array.from(this.entityCache.values());
    
    if (query) {
      if (query.type) {
        entities = entities.filter(entity => entity.type === query.type);
      }
      
      if (query.name) {
        const nameLower = query.name.toLowerCase();
        entities = entities.filter(entity => 
          entity.name.toLowerCase().includes(nameLower)
        );
      }
      
      if (query.owner) {
        const ownerLower = query.owner.toLowerCase();
        entities = entities.filter(entity => 
          entity.owner?.toLowerCase().includes(ownerLower)
        );
      }
      
      if (query.parentId) {
        entities = entities.filter(entity => 
          entity.parentId === query.parentId
        );
      }
      
      if (query.properties) {
        entities = entities.filter(entity => {
          for (const [key, value] of Object.entries(query.properties!)) {
            if (entity.properties?.[key] !== value) {
              return false;
            }
          }
          return true;
        });
      }
      
      // Apply sorting
      if (query.sort) {
        entities.sort((a, b) => {
          const aValue = this.getPropertyValue(a, query.sort!.field);
          const bValue = this.getPropertyValue(b, query.sort!.field);
          
          if (aValue < bValue) {
            return query.sort!.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return query.sort!.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      // Apply pagination
      if (query.offset !== undefined || query.limit !== undefined) {
        const offset = query.offset || 0;
        const limit = query.limit || entities.length;
        entities = entities.slice(offset, offset + limit);
      }
    }
    
    return entities;
  }  
  /**
   * Get entity by ID
   * @param id - Entity ID
   * @returns Entity
   */
  async getEntityById(id: string): Promise<Entity | null> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    return this.entityCache.get(id) || null;
  }
  
  /**
   * Get relationships
   * @param query - Relationship query
   * @returns Relationships
   */
  async getRelationships(query?: RelationshipQuery): Promise<Relationship[]> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    // Filter relationships based on query
    let relationships = Array.from(this.relationshipCache.values());
    
    if (query) {
      if (query.type) {
        relationships = relationships.filter(relationship => 
          relationship.type === query.type
        );
      }
      
      if (query.sourceId) {
        relationships = relationships.filter(relationship => 
          relationship.sourceId === query.sourceId
        );
      }
      
      if (query.targetId) {
        relationships = relationships.filter(relationship => 
          relationship.targetId === query.targetId
        );
      }
      
      // Apply pagination
      if (query.offset !== undefined || query.limit !== undefined) {
        const offset = query.offset || 0;
        const limit = query.limit || relationships.length;
        relationships = relationships.slice(offset, offset + limit);
      }
    }
    
    return relationships;
  }
  
  /**
   * Get relationship by ID
   * @param id - Relationship ID
   * @returns Relationship
   */
  async getRelationshipById(id: string): Promise<Relationship | null> {
    // Check if cache is valid
    if (this.shouldRefreshCache()) {
      await this.refreshCache();
    }
    
    return this.relationshipCache.get(id) || null;
  }
  
  /**
   * Check if cache should be refreshed
   * @returns Whether cache should be refreshed
   */
  private shouldRefreshCache(): boolean {
    const now = Date.now();
    return (
      this.lastCacheUpdate === 0 ||
      now - this.lastCacheUpdate > (this.config.cacheTimeout || 0)
    );
  }
  
  /**
   * Refresh cache
   */
  private async refreshCache(): Promise<void> {
    try {
      // Clear existing caches
      this.entityCache.clear();
      this.relationshipCache.clear();
      
      // Fetch database information
      await this.fetchDatabaseInfo();
      
      // Update cache timestamp
      this.lastCacheUpdate = Date.now();
    } catch (error) {
      console.error('Error refreshing Supabase cache:', error);
      throw error;
    }
  }
  
  /**
   * Fetch database information
   */
  private async fetchDatabaseInfo(): Promise<void> {
    try {
      // Create database entity
      const databaseEntity = this.createDatabaseEntity();
      this.entityCache.set(databaseEntity.id, databaseEntity);
      
      // Fetch tables
      const { data: tables, error: tablesError } = await this.client.rpc('get_tables');
      
      if (tablesError) {
        console.error('Error fetching tables:', tablesError);
        return;
      }
      
      if (!tables) {
        return;
      }
      
      // Process tables
      for (const table of tables) {
        const tableEntity = this.createTableEntity(table);
        this.entityCache.set(tableEntity.id, tableEntity);
        
        // Create relationship between database and table
        const dbTableRelationship = this.createRelationship(
          RelationshipType.PARENT_CHILD,
          databaseEntity.id,
          tableEntity.id,
          'has table',
          'Database has table'
        );
        this.relationshipCache.set(dbTableRelationship.id, dbTableRelationship);
        
        // Fetch columns
        const { data: columns, error: columnsError } = await this.client.rpc('get_columns', {
          table_name: table.table_name,
        });
        
        if (columnsError) {
          console.error(`Error fetching columns for table ${table.table_name}:`, columnsError);
          continue;
        }
        
        if (!columns) {
          continue;
        }        
        // Process columns
        for (const column of columns) {
          const fieldEntity = this.createFieldEntity(column, tableEntity.id);
          this.entityCache.set(fieldEntity.id, fieldEntity);
          
          // Create relationship between table and field
          const tableFieldRelationship = this.createRelationship(
            RelationshipType.PARENT_CHILD,
            tableEntity.id,
            fieldEntity.id,
            'has field',
            'Table has field'
          );
          this.relationshipCache.set(tableFieldRelationship.id, tableFieldRelationship);
        }
        
        // Fetch sample records
        const { data: records, error: recordsError } = await this.client
          .from(table.table_name)
          .select('*')
          .limit(10);
        
        if (recordsError) {
          console.error(`Error fetching records for table ${table.table_name}:`, recordsError);
          continue;
        }
        
        if (!records) {
          continue;
        }
        
        // Process records
        for (const record of records) {
          const recordEntity = this.createRecordEntity(record, table.table_name, tableEntity.id);
          this.entityCache.set(recordEntity.id, recordEntity);
          
          // Create relationship between table and record
          const tableRecordRelationship = this.createRelationship(
            RelationshipType.PARENT_CHILD,
            tableEntity.id,
            recordEntity.id,
            'has record',
            'Table has record'
          );
          this.relationshipCache.set(tableRecordRelationship.id, tableRecordRelationship);
        }
      }
      
      // Fetch foreign key relationships
      const { data: foreignKeys, error: foreignKeysError } = await this.client.rpc('get_foreign_keys');
      
      if (foreignKeysError) {
        console.error('Error fetching foreign keys:', foreignKeysError);
        return;
      }
      
      if (!foreignKeys) {
        return;
      }
      
      // Process foreign keys
      for (const foreignKey of foreignKeys) {
        const sourceTableId = `supabase-table-${foreignKey.source_table}`;
        const targetTableId = `supabase-table-${foreignKey.target_table}`;
        
        // Create relationship between tables
        const tableRelationship = this.createRelationship(
          RelationshipType.REFERENCE,
          sourceTableId,
          targetTableId,
          foreignKey.constraint_name,
          `${foreignKey.source_table}.${foreignKey.source_column} references ${foreignKey.target_table}.${foreignKey.target_column}`
        );
        this.relationshipCache.set(tableRelationship.id, tableRelationship);
      }
    } catch (error) {
      console.error('Error fetching database info:', error);
      throw error;
    }
  }
  
  /**
   * Create database entity
   * @returns Database entity
   */
  private createDatabaseEntity(): Entity {
    return {
      id: `supabase-database`,
      type: EntityType.DATABASE,
      name: 'Supabase Database',
      description: 'Supabase PostgreSQL database',
      properties: {
        url: this.config.url,
      },
      dataSource: DataSourceType.SUPABASE,
      dataSourceId: 'database',
    };
  }
  
  /**
   * Create table entity
   * @param data - Table data
   * @returns Table entity
   */
  private createTableEntity(data: any): Entity {
    return {
      id: `supabase-table-${data.table_name}`,
      type: EntityType.TABLE,
      name: data.table_name,
      description: data.comment,
      parentId: 'supabase-database',
      properties: {
        schema: data.table_schema,
        isView: data.is_view,
        rowCount: data.row_count,
      },
      dataSource: DataSourceType.SUPABASE,
      dataSourceId: data.table_name,
      rawData: data,
    };
  }
  
  /**
   * Create field entity
   * @param data - Field data
   * @param tableId - Table ID
   * @returns Field entity
   */
  private createFieldEntity(data: any, tableId: string): Entity {
    return {
      id: `supabase-field-${data.table_name}-${data.column_name}`,
      type: EntityType.FIELD,
      name: data.column_name,
      description: data.comment,
      parentId: tableId,
      properties: {
        dataType: data.data_type,
        isNullable: data.is_nullable,
        isPrimaryKey: data.is_primary_key,
        isForeignKey: data.is_foreign_key,
        defaultValue: data.column_default,
      },
      dataSource: DataSourceType.SUPABASE,
      dataSourceId: `${data.table_name}-${data.column_name}`,
      rawData: data,
    };
  }
  
  /**
   * Create record entity
   * @param data - Record data
   * @param tableName - Table name
   * @param tableId - Table ID
   * @returns Record entity
   */
  private createRecordEntity(data: any, tableName: string, tableId: string): Entity {
    // Try to find a good name for the record
    let name = '';
    if (data.name) {
      name = data.name;
    } else if (data.title) {
      name = data.title;
    } else if (data.id) {
      name = `Record ${data.id}`;
    } else {
      name = `Record ${uuidv4().slice(0, 8)}`;
    }
    
    return {
      id: `supabase-record-${tableName}-${data.id || uuidv4()}`,
      type: EntityType.RECORD,
      name,
      parentId: tableId,
      properties: data,
      dataSource: DataSourceType.SUPABASE,
      dataSourceId: `${tableName}-${data.id || uuidv4()}`,
      rawData: data,
    };
  }
  
  /**
   * Create relationship
   * @param type - Relationship type
   * @param sourceId - Source entity ID
   * @param targetId - Target entity ID
   * @param name - Relationship name
   * @param description - Relationship description
   * @returns Relationship
   */
  private createRelationship(
    type: RelationshipType,
    sourceId: string,
    targetId: string,
    name: string,
    description: string
  ): Relationship {
    return {
      id: uuidv4(),
      type,
      sourceId,
      targetId,
      name,
      description,
      strength: 1.0,
      direction: 'source_to_target',
      dataSource: DataSourceType.SUPABASE,
      dataSourceId: `${sourceId}-${targetId}`,
    };
  }
  
  /**
   * Get property value from entity
   * @param entity - Entity
   * @param field - Field name
   * @returns Property value
   */
  private getPropertyValue(entity: Entity, field: string): any {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'properties' && entity.properties) {
        return entity.properties[child];
      }
    }
    
    return (entity as any)[field];
  }
}