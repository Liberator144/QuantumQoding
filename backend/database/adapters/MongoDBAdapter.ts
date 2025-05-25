/**
 * MongoDB Adapter
 * 
 * Provides a MongoDB implementation of the DatabaseAdapter interface.
 * 
 * @version 1.0.0
 */

import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { BaseEntity } from '../schemas/BaseSchema';

/**
 * MongoDB adapter options
 */
export interface MongoDBAdapterOptions {
  /** Connection URI */
  uri: string;
  
  /** Database name */
  database: string;
  
  /** Connection options */
  options?: any;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * MongoDB adapter
 */
export class MongoDBAdapter implements DatabaseAdapter {
  /** Adapter name */
  readonly name: string = 'mongodb';
  
  /** Options */
  private options: MongoDBAdapterOptions;
  
  /** MongoDB client */
  private client: MongoClient | null = null;
  
  /** MongoDB database */
  private db: Db | null = null;
  
  /** Collections cache */
  private collections: Map<string, Collection> = new Map();
  
  /** Is connected */
  private _isConnected: boolean = false;
  
  /**
   * Constructor
   * @param options - MongoDB adapter options
   */
  constructor(options: MongoDBAdapterOptions) {
    this.options = options;
  }
  
  /**
   * Get is connected
   */
  get isConnected(): boolean {
    return this._isConnected;
  }  
  /**
   * Connect to MongoDB
   * @returns Promise resolving to connection success
   */
  async connect(): Promise<boolean> {
    try {
      // Create client
      this.client = new MongoClient(this.options.uri, this.options.options);
      
      // Connect to MongoDB
      await this.client.connect();
      
      // Get database
      this.db = this.client.db(this.options.database);
      
      this._isConnected = true;
      this.log('Connected to MongoDB');
      
      return true;
    } catch (error) {
      this.logError('Failed to connect to MongoDB', error);
      return false;
    }
  }
  
  /**
   * Disconnect from MongoDB
   * @returns Promise resolving to disconnection success
   */
  async disconnect(): Promise<boolean> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
        this.db = null;
        this.collections.clear();
      }
      
      this._isConnected = false;
      this.log('Disconnected from MongoDB');
      
      return true;
    } catch (error) {
      this.logError('Failed to disconnect from MongoDB', error);
      return false;
    }
  }
  
  /**
   * Get collection
   * @param name - Collection name
   * @returns Collection
   */
  private getCollection(name: string): Collection {
    if (!this.isConnected || !this.db) {
      throw new Error('Not connected to MongoDB');
    }
    
    // Check cache
    if (this.collections.has(name)) {
      return this.collections.get(name)!;
    }
    
    // Get collection
    const collection = this.db.collection(name);
    
    // Cache collection
    this.collections.set(name, collection);
    
    return collection;
  }  
  /**
   * Collection exists
   * @param name - Collection name
   * @returns Promise resolving to existence
   */
  async collectionExists(name: string): Promise<boolean> {
    try {
      if (!this.isConnected || !this.db) {
        throw new Error('Not connected to MongoDB');
      }
      
      const collections = await this.db.listCollections({ name }).toArray();
      return collections.length > 0;
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
      if (!this.isConnected || !this.db) {
        throw new Error('Not connected to MongoDB');
      }
      
      await this.db.createCollection(name);
      
      // Clear collection cache
      this.collections.delete(name);
      
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
  async dropCollection(name: string): Promise<boolean> {
    try {
      if (!this.isConnected || !this.db) {
        throw new Error('Not connected to MongoDB');
      }
      
      const exists = await this.collectionExists(name);
      
      if (!exists) {
        return false;
      }
      
      await this.db.dropCollection(name);
      
      // Clear collection cache
      this.collections.delete(name);
      
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert ID to ObjectId if needed
      if (query.id) {
        query._id = query.id;
        delete query.id;
      }
      
      // Create cursor
      let cursor = coll.find(query);
      
      // Apply options
      if (options.sort) {
        cursor = cursor.sort(options.sort);
      }
      
      if (options.skip) {
        cursor = cursor.skip(options.skip);
      }
      
      if (options.limit) {
        cursor = cursor.limit(options.limit);
      }
      
      // Get results
      const results = await cursor.toArray();
      
      // Convert _id to id
      return results.map(result => {
        const { _id, ...rest } = result;
        return { id: _id.toString(), ...rest } as T;
      });
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert ID to ObjectId if needed
      if (query.id) {
        query._id = query.id;
        delete query.id;
      }
      
      // Find one
      const result = await coll.findOne(query, options);
      
      if (!result) {
        return null;
      }
      
      // Convert _id to id
      const { _id, ...rest } = result;
      return { id: _id.toString(), ...rest } as T;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Find by ID
      const result = await coll.findOne({ _id: id }, options);
      
      if (!result) {
        return null;
      }      
      // Convert _id to id
      const { _id, ...rest } = result;
      return { id: _id.toString(), ...rest } as T;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert id to _id
      const { id, ...rest } = entity;
      const document = { _id: id, ...rest };
      
      // Insert document
      await coll.insertOne(document);
      
      return entity;
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
      
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert id to _id
      const documents = entities.map(entity => {
        const { id, ...rest } = entity;
        return { _id: id, ...rest };
      });      
      // Insert documents
      await coll.insertMany(documents);
      
      return entities;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Remove id from update
      const { id: updateId, ...updateData } = update;
      
      // Update document
      const result = await coll.updateOne(
        { _id: id },
        { $set: updateData }
      );
      
      return result.modifiedCount > 0;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert ID to ObjectId if needed
      if (query.id) {
        query._id = query.id;
        delete query.id;
      }      
      // Remove id from update
      const { id: updateId, ...updateData } = update;
      
      // Update documents
      const result = await coll.updateMany(
        query,
        { $set: updateData }
      );
      
      return result.modifiedCount;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Delete document
      const result = await coll.deleteOne({ _id: id });
      
      return result.deletedCount > 0;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert ID to ObjectId if needed
      if (query.id) {
        query._id = query.id;
        delete query.id;
      }      
      // Delete documents
      const result = await coll.deleteMany(query);
      
      return result.deletedCount;
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
      // Get collection
      const coll = this.getCollection(collection);
      
      // Convert ID to ObjectId if needed
      if (query.id) {
        query._id = query.id;
        delete query.id;
      }
      
      // Count documents
      return await coll.countDocuments(query);
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
      console.log(`[MongoDBAdapter] ${message}`);
    }
  }
  
  /**
   * Log error
   * @param message - Error message
   * @param error - Error object
   */
  private logError(message: string, error: any): void {
    console.error(`[MongoDBAdapter] ${message}`, error);
  }
}

export default MongoDBAdapter;