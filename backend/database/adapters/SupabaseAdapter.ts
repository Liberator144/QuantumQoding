/**
 * Supabase Adapter
 * 
 * Provides a Supabase implementation of the DatabaseAdapter interface.
 * 
 * @version 1.0.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';

/**
 * Supabase adapter options
 */
export interface SupabaseAdapterOptions {
  /** Supabase URL */
  url: string;
  
  /** Supabase API key */
  apiKey: string;
  
  /** Supabase client options */
  options?: any;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Supabase adapter
 */
export class SupabaseAdapter implements DatabaseAdapter {
  /** Adapter name */
  readonly name: string = 'supabase';
  
  /** Options */
  private options: SupabaseAdapterOptions;
  
  /** Supabase client */
  private client: SupabaseClient | null = null;
  
  /** Is connected */
  private _isConnected: boolean = false;
  
  /**
   * Constructor
   * @param options - Supabase adapter options
   */
  constructor(options: SupabaseAdapterOptions) {
    this.options = options;
  }
  
  /**
   * Get is connected
   */
  get isConnected(): boolean {
    return this._isConnected;
  }  
  /**
   * Connect to Supabase
   * @returns Promise resolving to connection success
   */
  async connect(): Promise<boolean> {
    try {
      // Create client
      this.client = createClient(this.options.url, this.options.apiKey, this.options.options);
      
      // Test connection
      const { error } = await this.client.from('_dummy_test_').select('*').limit(1);
      
      if (error && error.code !== '42P01') { // Table doesn't exist error is expected
        throw error;
      }
      
      this._isConnected = true;
      this.log('Connected to Supabase');
      
      return true;
    } catch (error) {
      this.logError('Failed to connect to Supabase', error);
      return false;
    }
  }
  
  /**
   * Disconnect from Supabase
   * @returns Promise resolving to disconnection success
   */
  async disconnect(): Promise<boolean> {
    try {
      if (this.client) {
        // No explicit disconnect method in Supabase client
        this.client = null;
      }
      
      this._isConnected = false;
      this.log('Disconnected from Supabase');
      
      return true;
    } catch (error) {
      this.logError('Failed to disconnect from Supabase', error);
      return false;
    }
  }
  
  /**
   * Ensure connected
   * @throws Error if not connected
   */
  private ensureConnected(): void {
    if (!this.isConnected || !this.client) {
      throw new Error('Not connected to Supabase');
    }
  }  
  /**
   * Collection exists
   * @param name - Collection name
   * @returns Promise resolving to existence
   */
  async collectionExists(name: string): Promise<boolean> {
    try {
      this.ensureConnected();
      
      // Check if table exists
      const { data, error } = await this.client!.from(name).select('*').limit(1);
      
      if (error && error.code === '42P01') { // Table doesn't exist
        return false;
      }
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to check if collection exists: ${name}`, error);
      throw error;
    }
  }
  
  /**
   * Create collection
   * @param name - Collection name
   * @returns Promise resolving to creation success
   */
  async createCollection(name: string): Promise<boolean> {
    try {
      this.ensureConnected();
      
      // Create table
      const { error } = await this.client!.rpc('create_table', {
        table_name: name,
        primary_key: 'id'
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to create collection: ${name}`, error);
      throw error;
    }
  }
  
  /**
   * Drop collection
   * @param name - Collection name
   * @returns Promise resolving to drop success
   */
  async dropCollection(name: string): Promise<boolean> {    try {
      this.ensureConnected();
      
      // Check if table exists
      const exists = await this.collectionExists(name);
      
      if (!exists) {
        return false;
      }
      
      // Drop table
      const { error } = await this.client!.rpc('drop_table', {
        table_name: name
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      this.logError(`Failed to drop collection: ${name}`, error);
      throw error;
    }
  }
  
  /**
   * Find entities
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entities
   */
  async find<T extends BaseEntity>(
    collection: string,
    query: Record<string, any> = {},
    options: any = {}
  ): Promise<T[]> {
    try {
      this.ensureConnected();
      
      // Start query
      let queryBuilder = this.client!.from(collection).select('*');
      
      // Apply query
      for (const [key, value] of Object.entries(query)) {
        queryBuilder = queryBuilder.eq(key, value);
      }
      
      // Apply options
      if (options.sort) {
        for (const [key, value] of Object.entries(options.sort)) {
          queryBuilder = queryBuilder.order(key, { ascending: value === 1 });
        }
      }
      
      if (options.skip) {
        queryBuilder = queryBuilder.range(options.skip, options.skip + (options.limit || 1000) - 1);
      } else if (options.limit) {
        queryBuilder = queryBuilder.limit(options.limit);
      }      
      // Execute query
      const { data, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      return (data || []) as T[];
    } catch (error) {
      this.logError(`Failed to find entities in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Find one entity
   * @param collection - Collection name
   * @param query - Query object
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  async findOne<T extends BaseEntity>(
    collection: string,
    query: Record<string, any> = {},
    options: any = {}
  ): Promise<T | null> {
    try {
      this.ensureConnected();
      
      // Start query
      let queryBuilder = this.client!.from(collection).select('*');
      
      // Apply query
      for (const [key, value] of Object.entries(query)) {
        queryBuilder = queryBuilder.eq(key, value);
      }
      
      // Limit to one result
      queryBuilder = queryBuilder.limit(1).single();
      
      // Execute query
      const { data, error } = await queryBuilder;
      
      if (error && error.code === 'PGRST116') { // No rows returned
        return null;
      }
      
      if (error) {
        throw error;
      }
      
      return data as T || null;
    } catch (error) {
      this.logError(`Failed to find entity in collection: ${collection}`, error);
      throw error;
    }
  }  
  /**
   * Find entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param options - Query options
   * @returns Promise resolving to found entity or null
   */
  async findById<T extends BaseEntity>(
    collection: string,
    id: string,
    options: any = {}
  ): Promise<T | null> {
    try {
      this.ensureConnected();
      
      // Execute query
      const { data, error } = await this.client!
        .from(collection)
        .select('*')
        .eq('id', id)
        .limit(1)
        .single();
      
      if (error && error.code === 'PGRST116') { // No rows returned
        return null;
      }
      
      if (error) {
        throw error;
      }
      
      return data as T || null;
    } catch (error) {
      this.logError(`Failed to find entity by ID in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Insert entity
   * @param collection - Collection name
   * @param entity - Entity to insert
   * @returns Promise resolving to inserted entity
   */
  async insert<T extends BaseEntity>(
    collection: string,
    entity: T
  ): Promise<T> {
    try {
      this.ensureConnected();
      
      // Execute query
      const { data, error } = await this.client!
        .from(collection)
        .insert(entity)
        .select()
        .single();
      
      if (error) {
        throw error;
      }      
      return data as T;
    } catch (error) {
      this.logError(`Failed to insert entity in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Insert multiple entities
   * @param collection - Collection name
   * @param entities - Entities to insert
   * @returns Promise resolving to inserted entities
   */
  async insertMany<T extends BaseEntity>(
    collection: string,
    entities: T[]
  ): Promise<T[]> {
    try {
      if (entities.length === 0) {
        return [];
      }
      
      this.ensureConnected();
      
      // Execute query
      const { data, error } = await this.client!
        .from(collection)
        .insert(entities)
        .select();
      
      if (error) {
        throw error;
      }
      
      return data as T[] || entities;
    } catch (error) {
      this.logError(`Failed to insert entities in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Update entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @param update - Update object
   * @returns Promise resolving to update success
   */
  async updateById(
    collection: string,
    id: string,
    update: Record<string, any>
  ): Promise<boolean> {
    try {
      this.ensureConnected();
      
      // Remove id from update
      const { id: updateId, ...updateData } = update;      
      // Execute query
      const { data, error } = await this.client!
        .from(collection)
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).length > 0;
    } catch (error) {
      this.logError(`Failed to update entity by ID in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Update entities
   * @param collection - Collection name
   * @param query - Query object
   * @param update - Update object
   * @returns Promise resolving to number of updated entities
   */
  async update(
    collection: string,
    query: Record<string, any>,
    update: Record<string, any>
  ): Promise<number> {
    try {
      this.ensureConnected();
      
      // Remove id from update
      const { id: updateId, ...updateData } = update;
      
      // Start query
      let queryBuilder = this.client!.from(collection).update(updateData);
      
      // Apply query
      for (const [key, value] of Object.entries(query)) {
        queryBuilder = queryBuilder.eq(key, value);
      }
      
      // Execute query
      const { data, error } = await queryBuilder.select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).length;
    } catch (error) {
      this.logError(`Failed to update entities in collection: ${collection}`, error);
      throw error;
    }
  }  
  /**
   * Delete entity by ID
   * @param collection - Collection name
   * @param id - Entity ID
   * @returns Promise resolving to deletion success
   */
  async deleteById(
    collection: string,
    id: string
  ): Promise<boolean> {
    try {
      this.ensureConnected();
      
      // Execute query
      const { data, error } = await this.client!
        .from(collection)
        .delete()
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).length > 0;
    } catch (error) {
      this.logError(`Failed to delete entity by ID in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Delete entities
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to number of deleted entities
   */
  async delete(
    collection: string,
    query: Record<string, any>
  ): Promise<number> {
    try {
      this.ensureConnected();
      
      // Start query
      let queryBuilder = this.client!.from(collection).delete();
      
      // Apply query
      for (const [key, value] of Object.entries(query)) {
        queryBuilder = queryBuilder.eq(key, value);
      }
      
      // Execute query
      const { data, error } = await queryBuilder.select();
      
      if (error) {
        throw error;
      }
      
      return (data || []).length;
    } catch (error) {
      this.logError(`Failed to delete entities in collection: ${collection}`, error);
      throw error;
    }
  }  
  /**
   * Count entities
   * @param collection - Collection name
   * @param query - Query object
   * @returns Promise resolving to entity count
   */
  async count(
    collection: string,
    query: Record<string, any> = {}
  ): Promise<number> {
    try {
      this.ensureConnected();
      
      // Start query
      let queryBuilder = this.client!.from(collection).select('*', { count: 'exact', head: true });
      
      // Apply query
      for (const [key, value] of Object.entries(query)) {
        queryBuilder = queryBuilder.eq(key, value);
      }
      
      // Execute query
      const { count, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      return count || 0;
    } catch (error) {
      this.logError(`Failed to count entities in collection: ${collection}`, error);
      throw error;
    }
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[SupabaseAdapter] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[SupabaseAdapter] ${message}`, error);
  }
}

export default SupabaseAdapter;