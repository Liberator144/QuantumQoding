/**
 * In-memory implementation of MemoryStorage
 * Useful for development and testing
 */

import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryQuery, MemoryQueryResult, MemoryStorage } from './types';

export class InMemoryStorage implements MemoryStorage {
  private memories: Map<string, Memory> = new Map();

  /**
   * Store a new memory
   */
  async storeMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory> {
    const id = uuidv4();
    const now = new Date();

    const newMemory: Memory = {
      ...memory,
      id,
      createdAt: now,
      lastAccessedAt: now,
      accessCount: 0,
      metadata: memory.metadata || {},
    };

    this.memories.set(id, newMemory);
    return newMemory;
  }

  /**
   * Retrieve a memory by ID
   */
  async getMemory(id: string): Promise<Memory | null> {
    return this.memories.get(id) || null;
  }

  /**
   * Update an existing memory
   */
  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const memory = this.memories.get(id);

    if (!memory) {
      throw new Error(`Memory with ID ${id} not found`);
    }

    const updatedMemory = {
      ...memory,
      ...updates,
      id, // Ensure ID doesn't change
      createdAt: memory.createdAt, // Ensure creation date doesn't change
    };

    this.memories.set(id, updatedMemory);
    return updatedMemory;
  }

  /**
   * Delete a memory
   */
  async deleteMemory(id: string): Promise<boolean> {
    return this.memories.delete(id);
  }

  /**
   * Record an access to a memory
   */
  async recordAccess(id: string): Promise<void> {
    const memory = this.memories.get(id);

    if (memory) {
      memory.lastAccessedAt = new Date();
      memory.accessCount += 1;
      this.memories.set(id, memory);
    }
  }

  /**
   * Query memories based on criteria
   */
  async queryMemories(query: MemoryQuery): Promise<MemoryQueryResult> {
    let memories = Array.from(this.memories.values());

    // Apply filters
    if (query.searchTerm) {
      const searchTermLower = query.searchTerm.toLowerCase();
      memories = memories.filter(
        memory =>
          memory.content.toLowerCase().includes(searchTermLower) ||
          memory.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (query.type) {
      memories = memories.filter(memory => memory.type === query.type);
    }

    if (query.tags && query.tags.length > 0) {
      memories = memories.filter(memory => query.tags!.every(tag => memory.tags.includes(tag)));
    }

    if (query.projectContext) {
      memories = memories.filter(memory => memory.projectContext === query.projectContext);
    }

    if (query.filePath) {
      // Simple glob-like pattern matching
      const pattern = query.filePath.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      memories = memories.filter(memory => memory.filePath && regex.test(memory.filePath));
    }

    if (query.createdBetween) {
      memories = memories.filter(
        memory =>
          memory.createdAt >= query.createdBetween!.start &&
          memory.createdAt <= query.createdBetween!.end
      );
    }

    if (query.accessedBetween) {
      memories = memories.filter(
        memory =>
          memory.lastAccessedAt >= query.accessedBetween!.start &&
          memory.lastAccessedAt <= query.accessedBetween!.end
      );
    }

    if (query.minPriority !== undefined) {
      memories = memories.filter(memory => (memory.priorityScore || 0) >= (query.minPriority || 0));
    }

    // Sort results
    if (query.sortBy) {
      memories.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        switch (query.sortBy) {
          case 'priority':
            valueA = a.priorityScore || 0;
            valueB = b.priorityScore || 0;
            break;
          case 'createdAt':
            valueA = a.createdAt;
            valueB = b.createdAt;
            break;
          case 'lastAccessedAt':
            valueA = a.lastAccessedAt;
            valueB = b.lastAccessedAt;
            break;
          case 'accessCount':
            valueA = a.accessCount;
            valueB = b.accessCount;
            break;
          default:
            return 0;
        }

        const direction = query.sortDirection === 'desc' ? -1 : 1;

        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      });
    }

    // Apply pagination
    const totalCount = memories.length;

    if (query.offset !== undefined) {
      memories = memories.slice(query.offset);
    }

    if (query.limit !== undefined) {
      memories = memories.slice(0, query.limit);
    }

    return {
      memories,
      totalCount,
    };
  }
}
