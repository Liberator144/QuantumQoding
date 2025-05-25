/**
 * Core Memory Bank service implementation
 */

import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryQuery, MemoryQueryResult, MemoryStorage, MemoryType } from './types';
import { EventEmitter } from 'events';

/**
 * Events emitted by the MemoryBank
 */
export enum MemoryBankEvent {
  MEMORY_CREATED = 'memory-created',
  MEMORY_UPDATED = 'memory-updated',
  MEMORY_DELETED = 'memory-deleted',
  MEMORY_ACCESSED = 'memory-accessed',
}

/**
 * Core Memory Bank service
 * Provides the main interface for interacting with memories
 */
export class MemoryBank {
  private storage: MemoryStorage;
  private eventEmitter: EventEmitter;

  constructor(storage: MemoryStorage) {
    this.storage = storage;
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Store a new memory
   */
  async createMemory(
    content: string,
    type: MemoryType,
    tags: string[] = [],
    metadata: Record<string, any> = {},
    options: {
      projectContext?: string;
      filePath?: string;
      createdBy?: string;
    } = {}
  ): Promise<Memory> {
    const memory = await this.storage.storeMemory({
      content,
      type,
      tags,
      metadata,
      accessCount: 0,
      lastAccessedAt: new Date(),
      createdBy: options.createdBy || 'system',
      projectContext: options.projectContext,
      filePath: options.filePath,
    });

    this.eventEmitter.emit(MemoryBankEvent.MEMORY_CREATED, memory);
    return memory;
  }

  /**
   * Retrieve a memory by ID
   */
  async getMemory(id: string): Promise<Memory | null> {
    const memory = await this.storage.getMemory(id);

    if (memory) {
      await this.storage.recordAccess(id);
      this.eventEmitter.emit(MemoryBankEvent.MEMORY_ACCESSED, memory);
    }

    return memory;
  }

  /**
   * Update an existing memory
   */
  async updateMemory(
    id: string,
    updates: Partial<Omit<Memory, 'id' | 'createdAt'>>
  ): Promise<Memory> {
    const memory = await this.storage.updateMemory(id, updates);
    this.eventEmitter.emit(MemoryBankEvent.MEMORY_UPDATED, memory);
    return memory;
  }

  /**
   * Delete a memory
   */
  async deleteMemory(id: string): Promise<boolean> {
    const success = await this.storage.deleteMemory(id);

    if (success) {
      this.eventEmitter.emit(MemoryBankEvent.MEMORY_DELETED, { id });
    }

    return success;
  }

  /**
   * Query memories based on various criteria
   */
  async queryMemories(query: MemoryQuery): Promise<MemoryQueryResult> {
    return this.storage.queryMemories(query);
  }

  /**
   * Subscribe to memory events
   */
  on(event: MemoryBankEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from memory events
   */
  off(event: MemoryBankEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Find related memories based on content similarity
   */
  async findRelatedMemories(memoryId: string, limit: number = 5): Promise<Memory[]> {
    const memory = await this.getMemory(memoryId);

    if (!memory) {
      return [];
    }

    // If the memory has predefined related memories, retrieve those
    if (memory.relatedMemories && memory.relatedMemories.length > 0) {
      const relatedMemories = await Promise.all(
        memory.relatedMemories.map(id => this.storage.getMemory(id))
      );

      return relatedMemories.filter(m => m !== null) as Memory[];
    }

    // Otherwise, find related memories based on tags and content
    const query: MemoryQuery = {
      tags: memory.tags,
      type: memory.type,
      limit,
      sortBy: 'priority',
      sortDirection: 'desc',
    };

    const result = await this.storage.queryMemories(query);
    return result.memories.filter(m => m.id !== memory.id);
  }
}
