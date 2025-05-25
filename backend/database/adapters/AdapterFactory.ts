/**
 * Adapter Factory
 * 
 * Factory for creating database adapters.
 * 
 * @version 1.0.0
 */

import { DatabaseAdapter } from '../interfaces/DatabaseAdapter';
import { BaseAdapter } from './BaseAdapter';
import GitHubAdapter from './GitHubAdapter';
import SupabaseAdapter from './SupabaseAdapter';
import MongoDBAdapter from './MongoDBAdapter';

/**
 * Adapter types
 */
export enum AdapterType {
  GITHUB = 'github',
  SUPABASE = 'supabase',
  MONGODB = 'mongodb'
}

/**
 * Adapter factory
 */
export class AdapterFactory {
  /** Registered adapters */
  private static adapters: Map<string, new (...args: any[]) => BaseAdapter> = new Map();
  
  /**
   * Register adapter
   * @param type - Adapter type
   * @param adapterClass - Adapter class
   */
  static registerAdapter(type: string, adapterClass: new (...args: any[]) => BaseAdapter): void {
    AdapterFactory.adapters.set(type, adapterClass);
  }
  
  /**
   * Create adapter
   * @param type - Adapter type
   * @param options - Adapter options
   * @returns Database adapter
   */
  static createAdapter(type: string, options: any): DatabaseAdapter {
    // Get adapter class
    const AdapterClass = AdapterFactory.adapters.get(type);
    
    if (!AdapterClass) {
      throw new Error(`Adapter type not registered: ${type}`);
    }
    
    // Create adapter
    return new AdapterClass(options);
  }
  
  /**
   * Create GitHub adapter
   * @param options - GitHub adapter options
   * @returns GitHub adapter
   */
  static createGitHubAdapter(options: any): DatabaseAdapter {
    return AdapterFactory.createAdapter(AdapterType.GITHUB, options);
  }
  
  /**
   * Create Supabase adapter
   * @param options - Supabase adapter options
   * @returns Supabase adapter
   */
  static createSupabaseAdapter(options: any): DatabaseAdapter {
    return AdapterFactory.createAdapter(AdapterType.SUPABASE, options);
  }
  
  /**
   * Create MongoDB adapter
   * @param options - MongoDB adapter options
   * @returns MongoDB adapter
   */
  static createMongoDBAdapter(options: any): DatabaseAdapter {
    return AdapterFactory.createAdapter(AdapterType.MONGODB, options);
  }
}

// Register adapters
AdapterFactory.registerAdapter(AdapterType.GITHUB, GitHubAdapter);
AdapterFactory.registerAdapter(AdapterType.SUPABASE, SupabaseAdapter);
AdapterFactory.registerAdapter(AdapterType.MONGODB, MongoDBAdapter);

export default AdapterFactory;