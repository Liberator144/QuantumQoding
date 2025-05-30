/**
 * Core Memory Bank service implementation
 */

import { v4 as uuidv4 } from 'uuid';
import { Memory, MemoryQuery, MemoryQueryResult, MemoryStorage, MemoryType } from './types';
import { DeletionManager, DeletionType, DeletionValidation, DeletionRecord } from './deletion-manager';
import { ArchivalManager, ArchiveTier, ArchivalTrigger, ArchiveRecord, ArchiveSearchResult, ArchivalPolicy } from './archival-manager';
import { BackupManager, BackupType, BackupRecord, RecoveryRecord, BackupConfig } from './backup-manager';
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
  private deletionManager: DeletionManager;
  private archivalManager: ArchivalManager;
  private backupManager: BackupManager;

  constructor(storage: MemoryStorage, backupConfig?: BackupConfig) {
    this.storage = storage;
    this.eventEmitter = new EventEmitter();
    this.deletionManager = new DeletionManager(storage);
    this.archivalManager = new ArchivalManager(storage);
    this.backupManager = new BackupManager(storage, backupConfig);

    // Forward deletion events
    this.deletionManager.on('deletion-executed', (record) => {
      this.eventEmitter.emit(MemoryBankEvent.MEMORY_DELETED, record);
    });

    // Forward archival events
    this.archivalManager.on('archival-executed', (record) => {
      this.eventEmitter.emit('memory-archived', record);
    });

    // Forward backup events
    this.backupManager.on('backup-completed', (record) => {
      this.eventEmitter.emit('backup-completed', record);
    });

    this.backupManager.on('recovery-completed', (record) => {
      this.eventEmitter.emit('recovery-completed', record);
    });
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
   * Delete a memory (legacy method - uses soft delete by default)
   */
  async deleteMemory(id: string): Promise<boolean> {
    try {
      const deletionRecord = await this.deletionManager.deleteMemory(id, DeletionType.SOFT);
      return true;
    } catch (error) {
      return false;
    }
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
    return this.deletionManager.deleteMemory(id, deletionType, options);
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
    return this.deletionManager.validateDeletion(id, deletionType, options);
  }

  /**
   * Recover a soft-deleted memory
   */
  async recoverMemory(operationId: string): Promise<Memory> {
    return this.deletionManager.recoverMemory(operationId);
  }

  /**
   * Get deletion history for a memory
   */
  getDeletionHistory(memoryId: string): DeletionRecord[] {
    return this.deletionManager.getDeletionHistory(memoryId);
  }

  /**
   * Get all recoverable deletions
   */
  getRecoverableDeletions(): DeletionRecord[] {
    return this.deletionManager.getRecoverableDeletions();
  }

  /**
   * Get memories that are marked as deleted
   */
  async getDeletedMemories(): Promise<Memory[]> {
    if (this.storage.getDeletedMemories) {
      return this.storage.getDeletedMemories();
    }
    return [];
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
    return this.archivalManager.archiveMemory(id, tier, options);
  }

  /**
   * Run archival policies to automatically archive eligible memories
   */
  async runArchivalPolicies(): Promise<ArchiveRecord[]> {
    return this.archivalManager.runArchivalPolicies();
  }

  /**
   * Restore a memory from archive
   */
  async restoreMemory(operationId: string): Promise<Memory> {
    return this.archivalManager.restoreMemory(operationId);
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
    return this.archivalManager.searchArchives(query);
  }

  /**
   * Get archive statistics
   */
  getArchiveStatistics() {
    return this.archivalManager.getArchiveStatistics();
  }

  /**
   * Set an archival policy
   */
  setArchivalPolicy(policy: ArchivalPolicy): void {
    this.archivalManager.setArchivalPolicy(policy);
  }

  /**
   * Remove an archival policy
   */
  removeArchivalPolicy(policyName: string): boolean {
    return this.archivalManager.removeArchivalPolicy(policyName);
  }

  /**
   * Get all archival policies
   */
  getArchivalPolicies(): ArchivalPolicy[] {
    return this.archivalManager.getArchivalPolicies();
  }

  /**
   * Get memories that are marked as archived
   */
  async getArchivedMemories(): Promise<Memory[]> {
    if (this.storage.getArchivedMemories) {
      return this.storage.getArchivedMemories();
    }
    return [];
  }

  /**
   * Get archived memories by tier
   */
  async getArchivedMemoriesByTier(tier: ArchiveTier): Promise<Memory[]> {
    if (this.storage.getArchivedMemoriesByTier) {
      return this.storage.getArchivedMemoriesByTier(tier);
    }
    return [];
  }

  // ===== BACKUP AND RECOVERY METHODS =====

  /**
   * Initialize backup manager
   */
  async initializeBackupManager(): Promise<void> {
    await this.backupManager.initialize();
  }

  /**
   * Create a full backup
   */
  async createFullBackup(options: {
    description?: string;
    tags?: string[];
    createdBy?: string;
  } = {}): Promise<BackupRecord> {
    return this.backupManager.createFullBackup(options);
  }

  /**
   * Create an incremental backup
   */
  async createIncrementalBackup(baseBackupId: string, options: {
    description?: string;
    tags?: string[];
    createdBy?: string;
  } = {}): Promise<BackupRecord> {
    return this.backupManager.createIncrementalBackup(baseBackupId, options);
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
    return this.backupManager.restoreFromBackup(backupId, options);
  }

  /**
   * Validate backup integrity
   */
  async validateBackup(backupId: string): Promise<boolean> {
    return this.backupManager.validateBackup(backupId);
  }

  /**
   * Get all backup records
   */
  getBackupRecords(): BackupRecord[] {
    return this.backupManager.getBackupRecords();
  }

  /**
   * Get all recovery records
   */
  getRecoveryRecords(): RecoveryRecord[] {
    return this.backupManager.getRecoveryRecords();
  }

  /**
   * Get backup statistics
   */
  getBackupStatistics() {
    return this.backupManager.getBackupStatistics();
  }

  /**
   * Cleanup old backups
   */
  async cleanupOldBackups(): Promise<number> {
    return this.backupManager.cleanupOldBackups();
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
