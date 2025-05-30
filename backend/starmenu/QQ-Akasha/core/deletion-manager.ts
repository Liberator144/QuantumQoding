/**
 * Memory Deletion Manager for QQ-Akasha
 * Implements safe, recoverable, and auditable memory deletion workflows
 */

import { Memory, MemoryStorage } from './types';
import { EventEmitter } from 'events';

/**
 * Deletion operation types
 */
export enum DeletionType {
  SOFT = 'soft',
  HARD = 'hard',
  CASCADE = 'cascade',
  ARCHIVE_THEN_DELETE = 'archive_then_delete',
}

/**
 * Deletion validation result
 */
export interface DeletionValidation {
  /** Whether deletion is allowed */
  allowed: boolean;
  
  /** Reason if deletion is not allowed */
  reason?: string;
  
  /** Warnings about the deletion */
  warnings: string[];
  
  /** Related memories that will be affected */
  affectedMemories: string[];
  
  /** Suggested alternative actions */
  suggestions: string[];
}

/**
 * Deletion operation record
 */
export interface DeletionRecord {
  /** Unique deletion operation ID */
  operationId: string;
  
  /** Memory ID that was deleted */
  memoryId: string;
  
  /** Type of deletion performed */
  deletionType: DeletionType;
  
  /** When the deletion occurred */
  deletedAt: Date;
  
  /** Who performed the deletion */
  deletedBy: string;
  
  /** Reason for deletion */
  reason?: string;
  
  /** Backup of the deleted memory (for soft delete) */
  memoryBackup?: Memory;
  
  /** Related memories that were affected */
  affectedMemories: string[];
  
  /** Recovery deadline (for soft delete) */
  recoveryDeadline?: Date;
  
  /** Whether this deletion can be recovered */
  recoverable: boolean;
}

/**
 * Deletion configuration
 */
export interface DeletionConfig {
  /** Default soft delete recovery period in days */
  defaultRecoveryPeriod: number;
  
  /** Whether to require confirmation for critical memories */
  requireConfirmationForCritical: boolean;
  
  /** Minimum importance threshold for requiring confirmation */
  criticalImportanceThreshold: number;
  
  /** Whether to automatically clean up orphaned references */
  autoCleanupOrphans: boolean;
  
  /** Maximum number of deletion records to keep */
  maxDeletionRecords: number;
  
  /** Whether to create backups before hard deletion */
  createBackupsBeforeHardDelete: boolean;
}

/**
 * Default deletion configuration
 */
export const DEFAULT_DELETION_CONFIG: DeletionConfig = {
  defaultRecoveryPeriod: 30, // 30 days
  requireConfirmationForCritical: true,
  criticalImportanceThreshold: 0.8,
  autoCleanupOrphans: true,
  maxDeletionRecords: 1000,
  createBackupsBeforeHardDelete: true,
};

/**
 * Deletion events
 */
export enum DeletionEvent {
  DELETION_REQUESTED = 'deletion-requested',
  DELETION_VALIDATED = 'deletion-validated',
  DELETION_EXECUTED = 'deletion-executed',
  DELETION_RECOVERED = 'deletion-recovered',
  ORPHAN_CLEANED = 'orphan-cleaned',
}

/**
 * Memory Deletion Manager
 */
export class DeletionManager extends EventEmitter {
  private storage: MemoryStorage;
  private config: DeletionConfig;
  private deletionRecords: Map<string, DeletionRecord> = new Map();

  constructor(storage: MemoryStorage, config: DeletionConfig = DEFAULT_DELETION_CONFIG) {
    super();
    this.storage = storage;
    this.config = config;
  }

  /**
   * Validate a deletion request
   */
  async validateDeletion(
    memoryId: string,
    deletionType: DeletionType = DeletionType.SOFT,
    options: {
      force?: boolean;
      reason?: string;
      deletedBy?: string;
    } = {}
  ): Promise<DeletionValidation> {
    const memory = await this.storage.getMemory(memoryId);
    
    if (!memory) {
      return {
        allowed: false,
        reason: 'Memory not found',
        warnings: [],
        affectedMemories: [],
        suggestions: ['Verify the memory ID is correct'],
      };
    }

    const warnings: string[] = [];
    const affectedMemories: string[] = [];
    const suggestions: string[] = [];
    let allowed = true;
    let reason: string | undefined;

    // Check if memory is critical
    const importance = memory.metadata?.importance || 0;
    if (importance >= this.config.criticalImportanceThreshold) {
      if (this.config.requireConfirmationForCritical && !options.force) {
        allowed = false;
        reason = 'Memory is marked as critical and requires explicit confirmation';
        suggestions.push('Use force option to confirm deletion of critical memory');
      } else {
        warnings.push('Deleting a critical memory with high importance');
      }
    }

    // Find related memories that will be affected
    if (memory.relatedMemories && memory.relatedMemories.length > 0) {
      affectedMemories.push(...memory.relatedMemories);
      warnings.push(`${memory.relatedMemories.length} related memories will lose their connection`);
      
      if (deletionType === DeletionType.CASCADE) {
        suggestions.push('Consider archiving instead of cascade deletion');
      }
    }

    // Find memories that reference this one
    const referencingMemories = await this.findReferencingMemories(memoryId);
    if (referencingMemories.length > 0) {
      affectedMemories.push(...referencingMemories.map(m => m.id));
      warnings.push(`${referencingMemories.length} memories reference this memory`);
      
      if (this.config.autoCleanupOrphans) {
        suggestions.push('Orphaned references will be automatically cleaned up');
      } else {
        suggestions.push('Consider cleaning up references manually after deletion');
      }
    }

    // Check access frequency
    if (memory.accessCount > 10) {
      warnings.push('Memory has been accessed frequently and may be important');
      suggestions.push('Consider archiving instead of deletion');
    }

    // Check recent access
    const daysSinceAccess = (Date.now() - memory.lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceAccess < 7) {
      warnings.push('Memory was accessed recently');
    }

    const validation: DeletionValidation = {
      allowed,
      reason,
      warnings,
      affectedMemories: [...new Set(affectedMemories)], // Remove duplicates
      suggestions,
    };

    this.emit(DeletionEvent.DELETION_VALIDATED, { memoryId, validation, deletionType });
    return validation;
  }

  /**
   * Execute a memory deletion
   */
  async deleteMemory(
    memoryId: string,
    deletionType: DeletionType = DeletionType.SOFT,
    options: {
      force?: boolean;
      reason?: string;
      deletedBy?: string;
      recoveryPeriod?: number;
    } = {}
  ): Promise<DeletionRecord> {
    this.emit(DeletionEvent.DELETION_REQUESTED, { memoryId, deletionType, options });

    // Validate deletion
    const validation = await this.validateDeletion(memoryId, deletionType, options);
    if (!validation.allowed && !options.force) {
      throw new Error(`Deletion not allowed: ${validation.reason}`);
    }

    const memory = await this.storage.getMemory(memoryId);
    if (!memory) {
      throw new Error('Memory not found');
    }

    // Create deletion record
    const operationId = this.generateOperationId();
    const deletedBy = options.deletedBy || 'system';
    const recoveryPeriod = options.recoveryPeriod || this.config.defaultRecoveryPeriod;
    
    const deletionRecord: DeletionRecord = {
      operationId,
      memoryId,
      deletionType,
      deletedAt: new Date(),
      deletedBy,
      reason: options.reason,
      affectedMemories: validation.affectedMemories,
      recoverable: deletionType === DeletionType.SOFT || deletionType === DeletionType.ARCHIVE_THEN_DELETE,
    };

    // Handle different deletion types
    switch (deletionType) {
      case DeletionType.SOFT:
        await this.executeSoftDeletion(memory, deletionRecord, recoveryPeriod);
        break;
        
      case DeletionType.HARD:
        await this.executeHardDeletion(memory, deletionRecord);
        break;
        
      case DeletionType.CASCADE:
        await this.executeCascadeDeletion(memory, deletionRecord);
        break;
        
      case DeletionType.ARCHIVE_THEN_DELETE:
        await this.executeArchiveThenDelete(memory, deletionRecord, recoveryPeriod);
        break;
        
      default:
        throw new Error(`Unknown deletion type: ${deletionType}`);
    }

    // Store deletion record
    this.deletionRecords.set(operationId, deletionRecord);
    this.cleanupOldDeletionRecords();

    // Clean up orphaned references if enabled
    if (this.config.autoCleanupOrphans) {
      await this.cleanupOrphanedReferences(memoryId);
    }

    this.emit(DeletionEvent.DELETION_EXECUTED, deletionRecord);
    return deletionRecord;
  }

  /**
   * Recover a soft-deleted memory
   */
  async recoverMemory(operationId: string): Promise<Memory> {
    const deletionRecord = this.deletionRecords.get(operationId);
    
    if (!deletionRecord) {
      throw new Error('Deletion record not found');
    }

    if (!deletionRecord.recoverable) {
      throw new Error('Memory is not recoverable');
    }

    if (deletionRecord.recoveryDeadline && new Date() > deletionRecord.recoveryDeadline) {
      throw new Error('Recovery deadline has passed');
    }

    if (!deletionRecord.memoryBackup) {
      throw new Error('Memory backup not found');
    }

    // Restore the memory
    const restoredMemory = await this.storage.storeMemory(deletionRecord.memoryBackup);

    // Mark deletion record as recovered
    deletionRecord.recoverable = false;
    this.deletionRecords.set(operationId, deletionRecord);

    this.emit(DeletionEvent.DELETION_RECOVERED, { operationId, memory: restoredMemory });
    return restoredMemory;
  }

  /**
   * Get deletion history for a memory
   */
  getDeletionHistory(memoryId: string): DeletionRecord[] {
    return Array.from(this.deletionRecords.values())
      .filter(record => record.memoryId === memoryId)
      .sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());
  }

  /**
   * Get all recoverable deletions
   */
  getRecoverableDeletions(): DeletionRecord[] {
    return Array.from(this.deletionRecords.values())
      .filter(record => record.recoverable && 
        (!record.recoveryDeadline || new Date() <= record.recoveryDeadline))
      .sort((a, b) => b.deletedAt.getTime() - a.deletedAt.getTime());
  }

  /**
   * Execute soft deletion
   */
  private async executeSoftDeletion(
    memory: Memory,
    deletionRecord: DeletionRecord,
    recoveryPeriod: number
  ): Promise<void> {
    // Create backup
    deletionRecord.memoryBackup = { ...memory };
    
    // Set recovery deadline
    const recoveryDeadline = new Date();
    recoveryDeadline.setDate(recoveryDeadline.getDate() + recoveryPeriod);
    deletionRecord.recoveryDeadline = recoveryDeadline;

    // Mark memory as deleted (add deletion metadata)
    await this.storage.updateMemory(memory.id, {
      metadata: {
        ...memory.metadata,
        deleted: true,
        deletedAt: deletionRecord.deletedAt,
        deletionOperationId: deletionRecord.operationId,
      },
    });
  }

  /**
   * Execute hard deletion
   */
  private async executeHardDeletion(
    memory: Memory,
    deletionRecord: DeletionRecord
  ): Promise<void> {
    // Create backup if configured
    if (this.config.createBackupsBeforeHardDelete) {
      deletionRecord.memoryBackup = { ...memory };
    }

    // Permanently delete from storage
    await this.storage.deleteMemory(memory.id);
    deletionRecord.recoverable = false;
  }

  /**
   * Execute cascade deletion
   */
  private async executeCascadeDeletion(
    memory: Memory,
    deletionRecord: DeletionRecord
  ): Promise<void> {
    // Delete related memories first
    if (memory.relatedMemories && memory.relatedMemories.length > 0) {
      for (const relatedId of memory.relatedMemories) {
        try {
          await this.deleteMemory(relatedId, DeletionType.SOFT, {
            reason: `Cascade deletion from ${memory.id}`,
            deletedBy: deletionRecord.deletedBy,
          });
        } catch (error) {
          // Continue with other deletions even if one fails
          console.warn(`Failed to cascade delete memory ${relatedId}:`, error);
        }
      }
    }

    // Then delete the main memory
    await this.executeHardDeletion(memory, deletionRecord);
  }

  /**
   * Execute archive then delete
   */
  private async executeArchiveThenDelete(
    memory: Memory,
    deletionRecord: DeletionRecord,
    recoveryPeriod: number
  ): Promise<void> {
    // First archive the memory (implementation would depend on archival system)
    // For now, we'll treat it like soft delete with extended recovery period
    await this.executeSoftDeletion(memory, deletionRecord, recoveryPeriod * 2);
  }

  /**
   * Find memories that reference the given memory ID
   */
  private async findReferencingMemories(memoryId: string): Promise<Memory[]> {
    // Query all memories and check their relatedMemories arrays
    const allMemories = await this.storage.queryMemories({ limit: 10000 });
    
    return allMemories.memories.filter(memory => 
      memory.relatedMemories && memory.relatedMemories.includes(memoryId)
    );
  }

  /**
   * Clean up orphaned references to a deleted memory
   */
  private async cleanupOrphanedReferences(deletedMemoryId: string): Promise<void> {
    const referencingMemories = await this.findReferencingMemories(deletedMemoryId);
    
    for (const memory of referencingMemories) {
      if (memory.relatedMemories) {
        const updatedRelatedMemories = memory.relatedMemories.filter(id => id !== deletedMemoryId);
        
        await this.storage.updateMemory(memory.id, {
          relatedMemories: updatedRelatedMemories,
        });
      }
    }

    if (referencingMemories.length > 0) {
      this.emit(DeletionEvent.ORPHAN_CLEANED, {
        deletedMemoryId,
        cleanedReferences: referencingMemories.length,
      });
    }
  }

  /**
   * Generate a unique operation ID
   */
  private generateOperationId(): string {
    return `del_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old deletion records
   */
  private cleanupOldDeletionRecords(): void {
    if (this.deletionRecords.size <= this.config.maxDeletionRecords) {
      return;
    }

    // Sort by deletion date and keep only the most recent records
    const sortedRecords = Array.from(this.deletionRecords.entries())
      .sort(([, a], [, b]) => b.deletedAt.getTime() - a.deletedAt.getTime());

    // Keep only the most recent records
    const recordsToKeep = sortedRecords.slice(0, this.config.maxDeletionRecords);
    
    this.deletionRecords.clear();
    recordsToKeep.forEach(([id, record]) => {
      this.deletionRecords.set(id, record);
    });
  }
}
