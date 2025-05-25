/**
 * Priority Manager for Memory Bank
 * Manages priority calculations and updates for memories
 */

import { Memory, MemoryBank, MemoryBankEvent, MemoryQuery } from '../core';
import { PriorityCalculator } from './priority-calculator';
import { PriorityConfig, PriorityContext } from './types';

export class PriorityManager {
  private memoryBank: MemoryBank;
  private calculator: PriorityCalculator;
  private updateInterval: NodeJS.Timeout | null = null;
  private currentContext: PriorityContext = {};

  constructor(
    memoryBank: MemoryBank,
    config: Partial<PriorityConfig> = {},
    updateIntervalMs: number = 3600000 // Default: update priorities every hour
  ) {
    this.memoryBank = memoryBank;
    this.calculator = new PriorityCalculator(config);

    // Set up event listeners
    this.setupEventListeners();

    // Start periodic updates if interval is positive
    if (updateIntervalMs > 0) {
      this.startPeriodicUpdates(updateIntervalMs);
    }
  }

  /**
   * Set the current context for priority calculations
   */
  setContext(context: PriorityContext): void {
    this.currentContext = context;
  }

  /**
   * Update context with current query
   */
  setCurrentQuery(query: string): void {
    this.currentContext.currentQuery = query;
  }

  /**
   * Calculate priority for a memory
   */
  calculatePriority(memory: Memory): number {
    return this.calculator.calculatePriority(memory, this.currentContext);
  }

  /**
   * Update priority for a specific memory
   */
  async updateMemoryPriority(memoryId: string): Promise<Memory | null> {
    const memory = await this.memoryBank.getMemory(memoryId);

    if (!memory) {
      return null;
    }

    const priorityScore = this.calculatePriority(memory);

    // Only update if priority has changed significantly
    if (Math.abs((memory.priorityScore || 0) - priorityScore) > 0.05) {
      return this.memoryBank.updateMemory(memoryId, { priorityScore });
    }

    return memory;
  }

  /**
   * Update priorities for all memories matching a query
   */
  async updatePriorities(query: MemoryQuery = {}): Promise<number> {
    const result = await this.memoryBank.queryMemories(query);
    let updatedCount = 0;

    for (const memory of result.memories) {
      const priorityScore = this.calculatePriority(memory);

      // Only update if priority has changed significantly
      if (Math.abs((memory.priorityScore || 0) - priorityScore) > 0.05) {
        await this.memoryBank.updateMemory(memory.id, { priorityScore });
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * Get memories sorted by priority
   */
  async getHighPriorityMemories(limit: number = 10, minPriority: number = 0.5): Promise<Memory[]> {
    const query: MemoryQuery = {
      minPriority,
      sortBy: 'priority',
      sortDirection: 'desc',
      limit,
    };

    const result = await this.memoryBank.queryMemories(query);
    return result.memories;
  }

  /**
   * Stop periodic updates
   */
  stopPeriodicUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Set up event listeners for memory events
   */
  private setupEventListeners(): void {
    // Update priority when a memory is accessed
    this.memoryBank.on(MemoryBankEvent.MEMORY_ACCESSED, async (memory: Memory) => {
      await this.updateMemoryPriority(memory.id);
    });

    // Calculate priority for new memories
    this.memoryBank.on(MemoryBankEvent.MEMORY_CREATED, async (memory: Memory) => {
      const priorityScore = this.calculatePriority(memory);
      await this.memoryBank.updateMemory(memory.id, { priorityScore });
    });

    // Recalculate priority for updated memories
    this.memoryBank.on(MemoryBankEvent.MEMORY_UPDATED, async (memory: Memory) => {
      await this.updateMemoryPriority(memory.id);
    });
  }

  /**
   * Start periodic priority updates
   */
  private startPeriodicUpdates(intervalMs: number): void {
    this.updateInterval = setInterval(async () => {
      await this.updatePriorities();
    }, intervalMs);
  }
}
