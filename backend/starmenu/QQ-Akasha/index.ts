/**
 * QQ-Akasha - Main Entry Point
 * Quantum Qoding Akasha - Advanced knowledge system that integrates all components into a unified system
 */

import {
  InMemoryStorage,
  Memory,
  MemoryBank,
  MemoryQuery,
  MemoryStorage,
  MemoryType,
} from './core';

import { PriorityCalculator, PriorityManager } from './prioritization';

import { GraphBuilder, MemoryGraph, RendererFactory } from './visualization';

import { IntegrationHub, IntegrationEvent } from './integration';

/**
 * Main QQ-Akasha class that integrates all components
 */
export class QQAkasha {
  private storage: MemoryStorage;
  private memoryBank: MemoryBank;
  private priorityManager: PriorityManager;
  private graphBuilder: GraphBuilder;
  private integrationHub: IntegrationHub;

  constructor(
    options: {
      storage?: MemoryStorage;
      priorityUpdateIntervalMs?: number;
    } = {}
  ) {
    // Initialize storage
    this.storage = options.storage || new InMemoryStorage();

    // Initialize memory bank
    this.memoryBank = new MemoryBank(this.storage);

    // Initialize integration hub
    this.integrationHub = new IntegrationHub();

    // Initialize priority manager
    this.priorityManager = new PriorityManager(
      this.memoryBank,
      {},
      options.priorityUpdateIntervalMs
    );

    // Initialize graph builder
    this.graphBuilder = new GraphBuilder(this.memoryBank);
  }

  /**
   * Initialize the memory bank system
   */
  async initialize(): Promise<void> {
    console.log('Initializing QQ-Akasha...');

    // Set up event listeners
    this.setupEventListeners();

    console.log('QQ-Akasha initialized successfully');
  }

  /**
   * Shutdown the memory bank system
   */
  async shutdown(): Promise<void> {
    console.log('Shutting down QQ-Akasha...');

    // Stop priority updates
    this.priorityManager.stopPeriodicUpdates();

    // Shutdown integration hub
    await this.integrationHub.shutdown();

    console.log('QQ-Akasha shutdown complete');
  }

  /**
   * Create a new memory
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
    const memory = await this.memoryBank.createMemory(content, type, tags, metadata, options);

    // Update priority
    await this.priorityManager.updateMemoryPriority(memory.id);

    return memory;
  }

  /**
   * Retrieve a memory by ID
   */
  async getMemory(id: string): Promise<Memory | null> {
    return this.memoryBank.getMemory(id);
  }

  /**
   * Update an existing memory
   */
  async updateMemory(id: string, updates: Partial<Memory>): Promise<Memory> {
    const memory = await this.memoryBank.updateMemory(id, updates);

    // Update priority
    await this.priorityManager.updateMemoryPriority(id);

    return memory;
  }

  /**
   * Delete a memory
   */
  async deleteMemory(id: string): Promise<boolean> {
    return this.memoryBank.deleteMemory(id);
  }

  /**
   * Query memories
   */
  async queryMemories(query: MemoryQuery): Promise<Memory[]> {
    // Update priority context with query
    if (query.searchTerm) {
      this.priorityManager.setCurrentQuery(query.searchTerm);
    }

    const result = await this.memoryBank.queryMemories(query);
    return result.memories;
  }

  /**
   * Get high priority memories
   */
  async getHighPriorityMemories(limit: number = 10): Promise<Memory[]> {
    return this.priorityManager.getHighPriorityMemories(limit);
  }

  /**
   * Find related memories
   */
  async findRelatedMemories(memoryId: string, limit: number = 5): Promise<Memory[]> {
    return this.memoryBank.findRelatedMemories(memoryId, limit);
  }

  /**
   * Create a memory visualization
   */
  async createVisualization(
    query: MemoryQuery = {},
    options: {
      format?: 'json' | 'd3' | 'dot';
      includeRelated?: boolean;
      maxRelatedDepth?: number;
      title?: string;
      description?: string;
    } = {}
  ): Promise<any> {
    // Build the graph
    const graph = await this.graphBuilder.buildGraph(query, {
      includeRelated: options.includeRelated,
      maxRelatedDepth: options.maxRelatedDepth,
      title: options.title,
      description: options.description,
    });

    // Render the graph
    const renderer = RendererFactory.createRenderer(options.format || 'json');
    return renderer.render(graph);
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Example event listener
    this.integrationHub.on(IntegrationEvent.MEMORY_CREATED, message => {
      console.log(`Memory created: ${message.payload.id}`);
    });
  }
}

// Export all modules
export * from './core';
export * from './prioritization';
export * from './visualization';
export * from './integration';
