/**
 * Context Preservation Manager
 * 
 * Manages context preservation and restoration during interdimensional transitions.
 * Ensures consciousness continuity across dimensional boundaries.
 * 
 * @version 1.0.0
 */

import { EventEmitter } from 'events';
import { ConsciousnessStreamPacket, ProtocolError, ProtocolErrorCode } from './ConsciousnessStreamProtocol';

/**
 * Context entry
 */
export interface ContextEntry {
  /** Context key */
  key: string;
  
  /** Context value */
  value: any;
  
  /** Source dimension */
  sourceDimension: string;
  
  /** Target dimension */
  targetDimension: string;
  
  /** Creation timestamp */
  createdAt: number;
  
  /** Expiration timestamp (0 = never expires) */
  expiresAt: number;
  
  /** Priority (higher values indicate higher priority) */
  priority: number;
  
  /** Context type */
  type: string;
  
  /** Context metadata */
  metadata?: Record<string, any>;
}

/**
 * Context store
 */
export interface ContextStore {
  /** Context entries */
  entries: Map<string, ContextEntry>;
  
  /** Last access timestamp */
  lastAccessedAt: number;
  
  /** Access count */
  accessCount: number;
}

/**
 * Context preservation options
 */
export interface ContextPreservationOptions {
  /** Default context expiration time in milliseconds (0 = never expires) */
  defaultExpirationTime?: number;
  
  /** Maximum context entries per dimension pair */
  maxEntriesPerDimensionPair?: number;
  
  /** Context cleanup interval in milliseconds */
  cleanupInterval?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}/**
 * Default context preservation options
 */
const DEFAULT_OPTIONS: ContextPreservationOptions = {
  defaultExpirationTime: 3600000, // 1 hour
  maxEntriesPerDimensionPair: 1000,
  cleanupInterval: 300000, // 5 minutes
  debugMode: false
};

/**
 * Context preservation manager
 */
export class ContextPreservationManager extends EventEmitter {
  /** Options */
  private options: ContextPreservationOptions;
  
  /** Context stores by dimension pair */
  private contextStores: Map<string, ContextStore> = new Map();
  
  /** Cleanup timer */
  private cleanupTimer: NodeJS.Timeout | null = null;
  
  /**
   * Constructor
   * @param options - Context preservation options
   */
  constructor(options: ContextPreservationOptions = {}) {
    super();
    
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Start cleanup timer
    this.startCleanupTimer();
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
   * Cleanup expired context entries
   */
  private cleanup(): void {
    const now = Date.now();
    let removedEntries = 0;
    
    // Iterate over all context stores
    for (const [dimensionPair, store] of this.contextStores.entries()) {
      // Check if store has been accessed recently
      const storeAge = now - store.lastAccessedAt;
      
      if (storeAge > this.options.defaultExpirationTime! * 2 && store.accessCount < 10) {
        // Remove entire store if it hasn't been accessed recently and has low access count
        this.contextStores.delete(dimensionPair);
        removedEntries += store.entries.size;
        continue;
      }
      
      // Remove expired entries
      for (const [key, entry] of store.entries.entries()) {
        if (entry.expiresAt > 0 && entry.expiresAt <= now) {
          store.entries.delete(key);
          removedEntries++;
        }
      }
      
      // Check if store has too many entries
      if (store.entries.size > this.options.maxEntriesPerDimensionPair!) {
        // Sort entries by priority and creation time
        const sortedEntries = Array.from(store.entries.entries())
          .sort((a, b) => {
            // Sort by priority (descending)
            if (b[1].priority !== a[1].priority) {
              return b[1].priority - a[1].priority;
            }
            
            // Then by creation time (ascending)
            return a[1].createdAt - b[1].createdAt;
          });
        
        // Remove excess entries
        const entriesToRemove = sortedEntries.slice(this.options.maxEntriesPerDimensionPair!);
        
        for (const [key] of entriesToRemove) {
          store.entries.delete(key);
          removedEntries++;
        }
      }
    }    
    if (removedEntries > 0 && this.options.debugMode) {
      console.log(`[ContextPreservationManager] Cleaned up ${removedEntries} context entries`);
    }
  }
  
  /**
   * Get dimension pair key
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Dimension pair key
   */
  private getDimensionPairKey(sourceDimension: string, targetDimension: string): string {
    return `${sourceDimension}:${targetDimension}`;
  }
  
  /**
   * Get or create context store
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Context store
   */
  private getOrCreateContextStore(sourceDimension: string, targetDimension: string): ContextStore {
    const key = this.getDimensionPairKey(sourceDimension, targetDimension);
    
    // Check if store exists
    if (this.contextStores.has(key)) {
      const store = this.contextStores.get(key)!;
      
      // Update access statistics
      store.lastAccessedAt = Date.now();
      store.accessCount++;
      
      return store;
    }
    
    // Create new store
    const store: ContextStore = {
      entries: new Map(),
      lastAccessedAt: Date.now(),
      accessCount: 1
    };
    
    // Add to stores
    this.contextStores.set(key, store);
    
    return store;
  }  
  /**
   * Preserve context from packet
   * @param packet - Consciousness stream packet
   * @returns Promise resolving to preservation success
   */
  async preserveContext<T>(packet: ConsciousnessStreamPacket<T>): Promise<boolean> {
    try {
      const { sourceDimension, targetDimension } = packet.header;
      
      // Get context store
      const store = this.getOrCreateContextStore(sourceDimension, targetDimension);
      
      // Extract context from packet
      const context = packet.payload.context || {};
      
      // Calculate expiration time
      const now = Date.now();
      const expiresAt = packet.header.ttl > 0 ? now + packet.header.ttl : 0;
      
      // Store each context entry
      for (const [key, value] of Object.entries(context)) {
        const entry: ContextEntry = {
          key,
          value,
          sourceDimension,
          targetDimension,
          createdAt: now,
          expiresAt,
          priority: packet.header.priority,
          type: 'packet',
          metadata: {
            streamId: packet.header.streamId,
            timestamp: packet.header.timestamp
          }
        };
        
        // Add to store
        store.entries.set(key, entry);
      }
      
      // Emit event
      this.emit('context-preserved', {
        sourceDimension,
        targetDimension,
        contextKeys: Object.keys(context),
        streamId: packet.header.streamId
      });
      
      return true;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to preserve context', error);
      return false;
    }
  }  
  /**
   * Restore context to packet
   * @param packet - Consciousness stream packet
   * @returns Promise resolving to restored packet
   */
  async restoreContext<T>(packet: ConsciousnessStreamPacket<T>): Promise<ConsciousnessStreamPacket<T>> {
    try {
      const { sourceDimension, targetDimension } = packet.header;
      
      // Get context store
      const store = this.getOrCreateContextStore(sourceDimension, targetDimension);
      
      // Clone packet to avoid modifying the original
      const clonedPacket = JSON.parse(JSON.stringify(packet)) as ConsciousnessStreamPacket<T>;
      
      // Initialize context if not present
      if (!clonedPacket.payload.context) {
        clonedPacket.payload.context = {};
      }
      
      // Get existing context
      const context = clonedPacket.payload.context;
      
      // Restore context entries
      for (const [key, entry] of store.entries.entries()) {
        // Skip if entry is expired
        if (entry.expiresAt > 0 && entry.expiresAt <= Date.now()) {
          continue;
        }
        
        // Skip if context already has this key
        if (context[key] !== undefined) {
          continue;
        }
        
        // Restore context value
        context[key] = entry.value;
      }
      
      // Emit event
      this.emit('context-restored', {
        sourceDimension,
        targetDimension,
        contextKeys: Object.keys(context),
        streamId: packet.header.streamId
      });
      
      return clonedPacket;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to restore context', error);
      return packet;
    }
  }  
  /**
   * Set context entry
   * @param key - Context key
   * @param value - Context value
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @param options - Context entry options
   * @returns Promise resolving to set success
   */
  async setContextEntry(
    key: string,
    value: any,
    sourceDimension: string,
    targetDimension: string,
    options: Partial<{
      expiresAt: number;
      priority: number;
      type: string;
      metadata: Record<string, any>;
    }> = {}
  ): Promise<boolean> {
    try {
      // Get context store
      const store = this.getOrCreateContextStore(sourceDimension, targetDimension);
      
      // Calculate expiration time
      const expiresAt = options.expiresAt || (this.options.defaultExpirationTime! > 0 ? Date.now() + this.options.defaultExpirationTime! : 0);
      
      // Create entry
      const entry: ContextEntry = {
        key,
        value,
        sourceDimension,
        targetDimension,
        createdAt: Date.now(),
        expiresAt,
        priority: options.priority || 0,
        type: options.type || 'manual',
        metadata: options.metadata
      };
      
      // Add to store
      store.entries.set(key, entry);
      
      // Emit event
      this.emit('context-entry-set', {
        key,
        sourceDimension,
        targetDimension,
        type: entry.type
      });
      
      return true;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to set context entry', error);
      return false;
    }
  }  
  /**
   * Get context entry
   * @param key - Context key
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Promise resolving to context entry or null
   */
  async getContextEntry(
    key: string,
    sourceDimension: string,
    targetDimension: string
  ): Promise<ContextEntry | null> {
    try {
      // Get context store
      const store = this.getOrCreateContextStore(sourceDimension, targetDimension);
      
      // Get entry
      const entry = store.entries.get(key);
      
      if (!entry) {
        return null;
      }
      
      // Check if expired
      if (entry.expiresAt > 0 && entry.expiresAt <= Date.now()) {
        // Remove expired entry
        store.entries.delete(key);
        return null;
      }
      
      return entry;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to get context entry', error);
      return null;
    }
  }
  
  /**
   * Delete context entry
   * @param key - Context key
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Promise resolving to deletion success
   */
  async deleteContextEntry(
    key: string,
    sourceDimension: string,
    targetDimension: string
  ): Promise<boolean> {
    try {
      // Get dimension pair key
      const dimensionPairKey = this.getDimensionPairKey(sourceDimension, targetDimension);
      
      // Check if store exists
      if (!this.contextStores.has(dimensionPairKey)) {
        return false;
      }      
      // Get store
      const store = this.contextStores.get(dimensionPairKey)!;
      
      // Update access statistics
      store.lastAccessedAt = Date.now();
      store.accessCount++;
      
      // Check if entry exists
      if (!store.entries.has(key)) {
        return false;
      }
      
      // Delete entry
      store.entries.delete(key);
      
      // Emit event
      this.emit('context-entry-deleted', {
        key,
        sourceDimension,
        targetDimension
      });
      
      return true;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to delete context entry', error);
      return false;
    }
  }
  
  /**
   * Get all context entries
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Promise resolving to context entries
   */
  async getAllContextEntries(
    sourceDimension: string,
    targetDimension: string
  ): Promise<ContextEntry[]> {
    try {
      // Get context store
      const store = this.getOrCreateContextStore(sourceDimension, targetDimension);
      
      // Get all entries
      const entries: ContextEntry[] = [];
      const now = Date.now();
      
      for (const entry of store.entries.values()) {
        // Skip expired entries
        if (entry.expiresAt > 0 && entry.expiresAt <= now) {
          continue;
        }
        
        entries.push(entry);
      }
      
      return entries;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to get all context entries', error);
      return [];
    }
  }  
  /**
   * Clear all context entries
   * @param sourceDimension - Source dimension
   * @param targetDimension - Target dimension
   * @returns Promise resolving to clear success
   */
  async clearAllContextEntries(
    sourceDimension: string,
    targetDimension: string
  ): Promise<boolean> {
    try {
      // Get dimension pair key
      const dimensionPairKey = this.getDimensionPairKey(sourceDimension, targetDimension);
      
      // Check if store exists
      if (!this.contextStores.has(dimensionPairKey)) {
        return false;
      }
      
      // Get store
      const store = this.contextStores.get(dimensionPairKey)!;
      
      // Clear entries
      const entryCount = store.entries.size;
      store.entries.clear();
      
      // Update access statistics
      store.lastAccessedAt = Date.now();
      store.accessCount++;
      
      // Emit event
      this.emit('context-entries-cleared', {
        sourceDimension,
        targetDimension,
        entryCount
      });
      
      return true;
    } catch (error) {
      console.error('[ContextPreservationManager] Failed to clear all context entries', error);
      return false;
    }
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop cleanup timer
    this.stopCleanupTimer();
    
    // Clear all stores
    this.contextStores.clear();
    
    // Remove all listeners
    this.removeAllListeners();
  }
}

export default ContextPreservationManager;