/**
 * QQ-Akasha - Main Entry Point
 * Quantum Qoding Akasha - Advanced knowledge system that integrates all components into a unified system
 */

import {
  InMemoryStorage,
  Memory,
  MemoryBank,
  MemoryQuery,
  MemoryQueryResult,
  MemoryStorage,
  MemoryType,
  DeletionType,
  DeletionValidation,
  DeletionRecord,
  ArchiveTier,
  ArchivalTrigger,
  ArchiveRecord,
  ArchiveSearchResult,
  ArchivalPolicy,
  BackupType,
  BackupRecord,
  RecoveryRecord,
  BackupConfig,
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
   * Delete a memory (legacy method - uses soft delete)
   */
  async deleteMemory(id: string): Promise<boolean> {
    return this.memoryBank.deleteMemory(id);
  }

  /**
   * Enhanced memory deletion with validation and options
   */
  async deleteMemoryEnhanced(
    id: string,
    deletionType: DeletionType = DeletionType.SOFT,
    options: {
      force?: boolean;
      reason?: string;
      deletedBy?: string;
      recoveryPeriod?: number;
    } = {}
  ): Promise<DeletionRecord> {
    return this.memoryBank.deleteMemoryEnhanced(id, deletionType, options);
  }

  /**
   * Validate a deletion request before executing
   */
  async validateDeletion(
    id: string,
    deletionType: DeletionType = DeletionType.SOFT,
    options: {
      force?: boolean;
      reason?: string;
      deletedBy?: string;
    } = {}
  ): Promise<DeletionValidation> {
    return this.memoryBank.validateDeletion(id, deletionType, options);
  }

  /**
   * Recover a soft-deleted memory
   */
  async recoverMemory(operationId: string): Promise<Memory> {
    return this.memoryBank.recoverMemory(operationId);
  }

  /**
   * Get deletion history for a memory
   */
  getDeletionHistory(memoryId: string): DeletionRecord[] {
    return this.memoryBank.getDeletionHistory(memoryId);
  }

  /**
   * Get all recoverable deletions
   */
  getRecoverableDeletions(): DeletionRecord[] {
    return this.memoryBank.getRecoverableDeletions();
  }

  /**
   * Get memories that are marked as deleted
   */
  async getDeletedMemories(): Promise<Memory[]> {
    return this.memoryBank.getDeletedMemories();
  }

  /**
   * Archive a memory manually
   */
  async archiveMemory(
    id: string,
    tier: ArchiveTier = ArchiveTier.WARM,
    options: {
      reason?: string;
      archivedBy?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<ArchiveRecord> {
    return this.memoryBank.archiveMemory(id, tier, options);
  }

  /**
   * Run archival policies to automatically archive eligible memories
   */
  async runArchivalPolicies(): Promise<ArchiveRecord[]> {
    return this.memoryBank.runArchivalPolicies();
  }

  /**
   * Restore a memory from archive
   */
  async restoreMemory(operationId: string): Promise<Memory> {
    return this.memoryBank.restoreMemory(operationId);
  }

  /**
   * Search archived memories
   */
  async searchArchives(query: {
    searchTerm?: string;
    tags?: string[];
    projectContext?: string;
    tier?: ArchiveTier;
    archivedBetween?: { start: Date; end: Date };
    limit?: number;
    offset?: number;
  }): Promise<ArchiveSearchResult> {
    return this.memoryBank.searchArchives(query);
  }

  /**
   * Get archive statistics
   */
  getArchiveStatistics() {
    return this.memoryBank.getArchiveStatistics();
  }

  /**
   * Set an archival policy
   */
  setArchivalPolicy(policy: ArchivalPolicy): void {
    this.memoryBank.setArchivalPolicy(policy);
  }

  /**
   * Remove an archival policy
   */
  removeArchivalPolicy(policyName: string): boolean {
    return this.memoryBank.removeArchivalPolicy(policyName);
  }

  /**
   * Get all archival policies
   */
  getArchivalPolicies(): ArchivalPolicy[] {
    return this.memoryBank.getArchivalPolicies();
  }

  /**
   * Get memories that are marked as archived
   */
  async getArchivedMemories(): Promise<Memory[]> {
    return this.memoryBank.getArchivedMemories();
  }

  /**
   * Get archived memories by tier
   */
  async getArchivedMemoriesByTier(tier: ArchiveTier): Promise<Memory[]> {
    return this.memoryBank.getArchivedMemoriesByTier(tier);
  }

  // ===== BACKUP AND RECOVERY METHODS =====

  /**
   * Initialize backup manager
   */
  async initializeBackupManager(): Promise<void> {
    return this.memoryBank.initializeBackupManager();
  }

  /**
   * Create a full backup
   */
  async createFullBackup(options: {
    description?: string;
    tags?: string[];
    createdBy?: string;
  } = {}): Promise<BackupRecord> {
    return this.memoryBank.createFullBackup(options);
  }

  /**
   * Create an incremental backup
   */
  async createIncrementalBackup(baseBackupId: string, options: {
    description?: string;
    tags?: string[];
    createdBy?: string;
  } = {}): Promise<BackupRecord> {
    return this.memoryBank.createIncrementalBackup(baseBackupId, options);
  }

  /**
   * Restore from backup
   */
  async restoreFromBackup(backupId: string, options: {
    overwriteExisting: boolean;
    validateAfterRecovery: boolean;
    createRecoveryPoint: boolean;
    recoveryMode: 'full' | 'selective' | 'point_in_time';
    memoryFilter?: {
      tags?: string[];
      types?: string[];
      projects?: string[];
      dateRange?: { start: Date; end: Date };
    };
  }): Promise<RecoveryRecord> {
    return this.memoryBank.restoreFromBackup(backupId, options);
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(backupId: string): Promise<boolean> {
    return this.memoryBank.validateBackup(backupId);
  }

  /**
   * Get all backup records
   */
  getBackupRecords(): BackupRecord[] {
    return this.memoryBank.getBackupRecords();
  }

  /**
   * Get all recovery records
   */
  getRecoveryRecords(): RecoveryRecord[] {
    return this.memoryBank.getRecoveryRecords();
  }

  /**
   * Get backup statistics
   */
  getBackupStatistics() {
    return this.memoryBank.getBackupStatistics();
  }

  /**
   * Cleanup old backups
   */
  async cleanupOldBackups(): Promise<number> {
    return this.memoryBank.cleanupOldBackups();
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
   * Query memories with enhanced context-based retrieval
   */
  async queryMemoriesEnhanced(query: MemoryQuery): Promise<MemoryQueryResult> {
    // Update priority context with query
    if (query.searchTerm) {
      this.priorityManager.setCurrentQuery(query.searchTerm);
    }

    // Enable contextual search by default for enhanced queries
    const enhancedQuery = {
      ...query,
      useContextualSearch: query.useContextualSearch !== false,
    };

    return await this.memoryBank.queryMemories(enhancedQuery);
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

// Export types for external use
export {
  Memory,
  MemoryType,
  MemoryQuery,
  MemoryStorage,
  DeletionType,
  DeletionValidation,
  DeletionRecord,
  ArchiveTier,
  ArchivalTrigger,
  ArchiveRecord,
  ArchiveSearchResult,
  ArchivalPolicy,
  BackupType,
  BackupRecord,
  RecoveryRecord,
  BackupConfig
};
