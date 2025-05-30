/**
 * Memory Archival Manager for QQ-Akasha
 * Implements intelligent, policy-driven memory archival with efficient storage and retrieval
 */

import { Memory, MemoryStorage, MemoryQuery } from './types';
import { EventEmitter } from 'events';

/**
 * Archival trigger types
 */
export enum ArchivalTrigger {
  AGE_BASED = 'age_based',
  USAGE_BASED = 'usage_based',
  MANUAL = 'manual',
  STORAGE_PRESSURE = 'storage_pressure',
  POLICY_BASED = 'policy_based',
}

/**
 * Archive storage tiers
 */
export enum ArchiveTier {
  HOT = 'hot',           // Frequently accessed archives
  WARM = 'warm',         // Occasionally accessed archives  
  COLD = 'cold',         // Rarely accessed archives
  FROZEN = 'frozen',     // Long-term storage archives
}

/**
 * Archival policy configuration
 */
export interface ArchivalPolicy {
  /** Policy name */
  name: string;
  
  /** Policy description */
  description: string;
  
  /** Trigger conditions */
  triggers: {
    /** Archive memories older than X days */
    maxAge?: number;
    
    /** Archive memories not accessed for X days */
    maxInactivity?: number;
    
    /** Archive memories with access count below threshold */
    minAccessCount?: number;
    
    /** Archive memories with importance below threshold */
    maxImportance?: number;
    
    /** Archive memories matching specific tags */
    archiveTags?: string[];
    
    /** Archive memories from specific projects */
    archiveProjects?: string[];
  };
  
  /** Archive tier to use */
  targetTier: ArchiveTier;
  
  /** Whether policy is active */
  enabled: boolean;
  
  /** Policy priority (higher = more important) */
  priority: number;
}

/**
 * Archive record
 */
export interface ArchiveRecord {
  /** Unique archive operation ID */
  operationId: string;
  
  /** Memory ID that was archived */
  memoryId: string;
  
  /** Archive tier */
  tier: ArchiveTier;
  
  /** Trigger that caused archival */
  trigger: ArchivalTrigger;
  
  /** Policy that triggered archival (if applicable) */
  policyName?: string;
  
  /** When the archival occurred */
  archivedAt: Date;
  
  /** Who performed the archival */
  archivedBy: string;
  
  /** Reason for archival */
  reason?: string;
  
  /** Original memory metadata */
  originalMetadata: {
    importance: number;
    accessCount: number;
    lastAccessedAt: Date;
    createdAt: Date;
    tags: string[];
    projectContext?: string;
  };
  
  /** Archive storage metadata */
  archiveMetadata: {
    compressedSize?: number;
    compressionRatio?: number;
    checksumHash?: string;
    storageLocation: string;
  };
  
  /** Whether archive can be restored */
  restorable: boolean;
  
  /** Archive expiration date (if any) */
  expiresAt?: Date;
}

/**
 * Archive search result
 */
export interface ArchiveSearchResult {
  /** Archive records matching search */
  archives: ArchiveRecord[];
  
  /** Total count for pagination */
  totalCount: number;
  
  /** Search metadata */
  searchMetadata: {
    searchTime: number;
    tiersSearched: ArchiveTier[];
    policiesMatched: string[];
  };
}

/**
 * Archival configuration
 */
export interface ArchivalConfig {
  /** Default archival policies */
  defaultPolicies: ArchivalPolicy[];
  
  /** Maximum number of archive records to keep */
  maxArchiveRecords: number;
  
  /** Default archive tier for manual archival */
  defaultTier: ArchiveTier;
  
  /** Whether to compress archived memories */
  enableCompression: boolean;
  
  /** Whether to create checksums for integrity verification */
  enableChecksums: boolean;
  
  /** Archive cleanup interval in hours */
  cleanupInterval: number;
  
  /** Storage pressure threshold (0-1) */
  storagePressureThreshold: number;
}

/**
 * Default archival policies
 */
export const DEFAULT_ARCHIVAL_POLICIES: ArchivalPolicy[] = [
  {
    name: 'old-low-importance',
    description: 'Archive old memories with low importance',
    triggers: {
      maxAge: 365,        // 1 year
      maxImportance: 0.3, // Low importance
    },
    targetTier: ArchiveTier.COLD,
    enabled: true,
    priority: 1,
  },
  {
    name: 'inactive-memories',
    description: 'Archive memories not accessed for 6 months',
    triggers: {
      maxInactivity: 180, // 6 months
    },
    targetTier: ArchiveTier.WARM,
    enabled: true,
    priority: 2,
  },
  {
    name: 'temporary-files',
    description: 'Archive temporary and debug files',
    triggers: {
      archiveTags: ['temporary', 'debug', 'test'],
      maxAge: 30, // 30 days
    },
    targetTier: ArchiveTier.HOT,
    enabled: true,
    priority: 3,
  },
  {
    name: 'completed-projects',
    description: 'Archive memories from completed projects',
    triggers: {
      archiveProjects: ['completed', 'archived', 'deprecated'],
    },
    targetTier: ArchiveTier.WARM,
    enabled: true,
    priority: 2,
  },
];

/**
 * Default archival configuration
 */
export const DEFAULT_ARCHIVAL_CONFIG: ArchivalConfig = {
  defaultPolicies: DEFAULT_ARCHIVAL_POLICIES,
  maxArchiveRecords: 10000,
  defaultTier: ArchiveTier.WARM,
  enableCompression: true,
  enableChecksums: true,
  cleanupInterval: 24, // 24 hours
  storagePressureThreshold: 0.8, // 80%
};

/**
 * Archival events
 */
export enum ArchivalEvent {
  ARCHIVAL_REQUESTED = 'archival-requested',
  ARCHIVAL_EXECUTED = 'archival-executed',
  ARCHIVE_RESTORED = 'archive-restored',
  POLICY_TRIGGERED = 'policy-triggered',
  STORAGE_PRESSURE = 'storage-pressure',
  ARCHIVE_EXPIRED = 'archive-expired',
}

/**
 * Memory Archival Manager
 */
export class ArchivalManager extends EventEmitter {
  private storage: MemoryStorage;
  private config: ArchivalConfig;
  private policies: Map<string, ArchivalPolicy> = new Map();
  private archiveRecords: Map<string, ArchiveRecord> = new Map();
  private archiveStorage: Map<ArchiveTier, Map<string, Memory>> = new Map();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(storage: MemoryStorage, config: ArchivalConfig = DEFAULT_ARCHIVAL_CONFIG) {
    super();
    this.storage = storage;
    this.config = config;
    
    // Initialize archive storage tiers
    Object.values(ArchiveTier).forEach(tier => {
      this.archiveStorage.set(tier, new Map());
    });
    
    // Load default policies
    config.defaultPolicies.forEach(policy => {
      this.policies.set(policy.name, policy);
    });
    
    // Start cleanup interval
    this.startCleanupInterval();
  }

  /**
   * Archive a memory manually
   */
  async archiveMemory(
    memoryId: string,
    tier: ArchiveTier = this.config.defaultTier,
    options: {
      reason?: string;
      archivedBy?: string;
      expiresAt?: Date;
    } = {}
  ): Promise<ArchiveRecord> {
    this.emit(ArchivalEvent.ARCHIVAL_REQUESTED, { memoryId, tier, trigger: ArchivalTrigger.MANUAL });

    const memory = await this.storage.getMemory(memoryId);
    if (!memory) {
      throw new Error('Memory not found');
    }

    // Create archive record
    const operationId = this.generateOperationId();
    const archiveRecord: ArchiveRecord = {
      operationId,
      memoryId,
      tier,
      trigger: ArchivalTrigger.MANUAL,
      archivedAt: new Date(),
      archivedBy: options.archivedBy || 'system',
      reason: options.reason,
      originalMetadata: {
        importance: memory.metadata?.importance || 0,
        accessCount: memory.accessCount,
        lastAccessedAt: memory.lastAccessedAt,
        createdAt: memory.createdAt,
        tags: memory.tags,
        projectContext: memory.projectContext,
      },
      archiveMetadata: {
        storageLocation: `${tier}/${operationId}`,
      },
      restorable: true,
      expiresAt: options.expiresAt,
    };

    // Process and store the memory in archive
    await this.storeInArchive(memory, archiveRecord);

    // Update memory to mark as archived
    await this.storage.updateMemory(memoryId, {
      metadata: {
        ...memory.metadata,
        archived: true,
        archivedAt: archiveRecord.archivedAt,
        archiveOperationId: operationId,
        archiveTier: tier,
      },
    });

    // Store archive record
    this.archiveRecords.set(operationId, archiveRecord);
    this.cleanupOldArchiveRecords();

    this.emit(ArchivalEvent.ARCHIVAL_EXECUTED, archiveRecord);
    return archiveRecord;
  }

  /**
   * Run archival policies to identify memories for archival
   */
  async runArchivalPolicies(): Promise<ArchiveRecord[]> {
    const archivedRecords: ArchiveRecord[] = [];
    
    // Sort policies by priority (highest first)
    const sortedPolicies = Array.from(this.policies.values())
      .filter(policy => policy.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const policy of sortedPolicies) {
      const candidateMemories = await this.findArchivalCandidates(policy);
      
      for (const memory of candidateMemories) {
        try {
          const archiveRecord = await this.archiveMemory(memory.id, policy.targetTier, {
            reason: `Policy: ${policy.name} - ${policy.description}`,
            archivedBy: 'archival-policy',
          });
          
          archiveRecord.policyName = policy.name;
          archiveRecord.trigger = ArchivalTrigger.POLICY_BASED;
          
          archivedRecords.push(archiveRecord);
          
          this.emit(ArchivalEvent.POLICY_TRIGGERED, {
            policy: policy.name,
            memoryId: memory.id,
            archiveRecord,
          });
        } catch (error) {
          console.warn(`Failed to archive memory ${memory.id} with policy ${policy.name}:`, error);
        }
      }
    }

    return archivedRecords;
  }

  /**
   * Restore a memory from archive
   */
  async restoreMemory(operationId: string): Promise<Memory> {
    const archiveRecord = this.archiveRecords.get(operationId);
    
    if (!archiveRecord) {
      throw new Error('Archive record not found');
    }

    if (!archiveRecord.restorable) {
      throw new Error('Archive is not restorable');
    }

    if (archiveRecord.expiresAt && new Date() > archiveRecord.expiresAt) {
      throw new Error('Archive has expired');
    }

    // Retrieve from archive storage
    const tierStorage = this.archiveStorage.get(archiveRecord.tier);
    const archivedMemory = tierStorage?.get(archiveRecord.memoryId);
    
    if (!archivedMemory) {
      throw new Error('Archived memory not found in storage');
    }

    // Restore the memory to active storage
    const restoredMemory = await this.storage.storeMemory({
      ...archivedMemory,
      metadata: {
        ...archivedMemory.metadata,
        archived: false,
        restoredAt: new Date(),
        restoredFrom: operationId,
      },
    });

    // Remove from archive storage
    tierStorage?.delete(archiveRecord.memoryId);
    
    // Mark archive record as restored
    archiveRecord.restorable = false;
    this.archiveRecords.set(operationId, archiveRecord);

    this.emit(ArchivalEvent.ARCHIVE_RESTORED, { operationId, memory: restoredMemory });
    return restoredMemory;
  }

  /**
   * Search archived memories
   */
  async searchArchives(
    query: {
      searchTerm?: string;
      tags?: string[];
      projectContext?: string;
      tier?: ArchiveTier;
      archivedBetween?: { start: Date; end: Date };
      limit?: number;
      offset?: number;
    }
  ): Promise<ArchiveSearchResult> {
    const startTime = Date.now();
    let matchingArchives: ArchiveRecord[] = [];
    const tiersSearched: ArchiveTier[] = [];
    const policiesMatched: string[] = [];

    // Determine which tiers to search
    const tiersToSearch = query.tier ? [query.tier] : Object.values(ArchiveTier);
    
    for (const tier of tiersToSearch) {
      tiersSearched.push(tier);
      const tierStorage = this.archiveStorage.get(tier);
      
      if (!tierStorage) continue;

      for (const [memoryId, memory] of tierStorage) {
        const archiveRecord = Array.from(this.archiveRecords.values())
          .find(record => record.memoryId === memoryId);
        
        if (!archiveRecord) continue;

        // Apply filters
        if (query.searchTerm && !this.matchesSearchTerm(memory, query.searchTerm)) {
          continue;
        }

        if (query.tags && !this.matchesTags(memory.tags, query.tags)) {
          continue;
        }

        if (query.projectContext && memory.projectContext !== query.projectContext) {
          continue;
        }

        if (query.archivedBetween) {
          const archivedAt = archiveRecord.archivedAt;
          if (archivedAt < query.archivedBetween.start || archivedAt > query.archivedBetween.end) {
            continue;
          }
        }

        matchingArchives.push(archiveRecord);
        
        if (archiveRecord.policyName && !policiesMatched.includes(archiveRecord.policyName)) {
          policiesMatched.push(archiveRecord.policyName);
        }
      }
    }

    // Sort by archived date (most recent first)
    matchingArchives.sort((a, b) => b.archivedAt.getTime() - a.archivedAt.getTime());

    // Apply pagination
    const totalCount = matchingArchives.length;
    if (query.offset !== undefined) {
      matchingArchives = matchingArchives.slice(query.offset);
    }
    if (query.limit !== undefined) {
      matchingArchives = matchingArchives.slice(0, query.limit);
    }

    return {
      archives: matchingArchives,
      totalCount,
      searchMetadata: {
        searchTime: Date.now() - startTime,
        tiersSearched,
        policiesMatched,
      },
    };
  }

  /**
   * Get archive statistics
   */
  getArchiveStatistics(): {
    totalArchives: number;
    archivesByTier: Record<ArchiveTier, number>;
    archivesByTrigger: Record<ArchivalTrigger, number>;
    totalStorageUsed: number;
    averageCompressionRatio: number;
  } {
    const stats = {
      totalArchives: this.archiveRecords.size,
      archivesByTier: {} as Record<ArchiveTier, number>,
      archivesByTrigger: {} as Record<ArchivalTrigger, number>,
      totalStorageUsed: 0,
      averageCompressionRatio: 0,
    };

    // Initialize counters
    Object.values(ArchiveTier).forEach(tier => {
      stats.archivesByTier[tier] = 0;
    });
    Object.values(ArchivalTrigger).forEach(trigger => {
      stats.archivesByTrigger[trigger] = 0;
    });

    let totalCompressionRatio = 0;
    let compressionCount = 0;

    for (const record of this.archiveRecords.values()) {
      stats.archivesByTier[record.tier]++;
      stats.archivesByTrigger[record.trigger]++;
      
      if (record.archiveMetadata.compressedSize) {
        stats.totalStorageUsed += record.archiveMetadata.compressedSize;
      }
      
      if (record.archiveMetadata.compressionRatio) {
        totalCompressionRatio += record.archiveMetadata.compressionRatio;
        compressionCount++;
      }
    }

    if (compressionCount > 0) {
      stats.averageCompressionRatio = totalCompressionRatio / compressionCount;
    }

    return stats;
  }

  /**
   * Add or update an archival policy
   */
  setArchivalPolicy(policy: ArchivalPolicy): void {
    this.policies.set(policy.name, policy);
  }

  /**
   * Remove an archival policy
   */
  removeArchivalPolicy(policyName: string): boolean {
    return this.policies.delete(policyName);
  }

  /**
   * Get all archival policies
   */
  getArchivalPolicies(): ArchivalPolicy[] {
    return Array.from(this.policies.values());
  }

  /**
   * Store memory in archive with compression and checksums
   */
  private async storeInArchive(memory: Memory, archiveRecord: ArchiveRecord): Promise<void> {
    const tierStorage = this.archiveStorage.get(archiveRecord.tier);
    if (!tierStorage) {
      throw new Error(`Invalid archive tier: ${archiveRecord.tier}`);
    }

    // Store the memory (compression and checksums would be implemented here)
    tierStorage.set(memory.id, memory);
    
    // Update archive metadata
    const memorySize = JSON.stringify(memory).length;
    archiveRecord.archiveMetadata.compressedSize = memorySize; // Would be actual compressed size
    archiveRecord.archiveMetadata.compressionRatio = 1.0; // Would be actual compression ratio
    archiveRecord.archiveMetadata.checksumHash = this.generateChecksum(memory);
  }

  /**
   * Find memories that match archival policy criteria
   */
  private async findArchivalCandidates(policy: ArchivalPolicy): Promise<Memory[]> {
    const query: MemoryQuery = {
      limit: 1000, // Process in batches
    };

    // Add tag filters
    if (policy.triggers.archiveTags && policy.triggers.archiveTags.length > 0) {
      query.tags = policy.triggers.archiveTags;
    }

    const result = await this.storage.queryMemories(query);
    const candidates: Memory[] = [];

    for (const memory of result.memories) {
      // Skip already archived memories
      if (memory.metadata?.archived) {
        continue;
      }

      // Check age criteria
      if (policy.triggers.maxAge) {
        const ageInDays = (Date.now() - memory.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (ageInDays < policy.triggers.maxAge) {
          continue;
        }
      }

      // Check inactivity criteria
      if (policy.triggers.maxInactivity) {
        const inactivityInDays = (Date.now() - memory.lastAccessedAt.getTime()) / (1000 * 60 * 60 * 24);
        if (inactivityInDays < policy.triggers.maxInactivity) {
          continue;
        }
      }

      // Check access count criteria
      if (policy.triggers.minAccessCount && memory.accessCount >= policy.triggers.minAccessCount) {
        continue;
      }

      // Check importance criteria
      if (policy.triggers.maxImportance) {
        const importance = memory.metadata?.importance || 0;
        if (importance > policy.triggers.maxImportance) {
          continue;
        }
      }

      // Check project criteria
      if (policy.triggers.archiveProjects && policy.triggers.archiveProjects.length > 0) {
        if (!memory.projectContext || !policy.triggers.archiveProjects.includes(memory.projectContext)) {
          continue;
        }
      }

      candidates.push(memory);
    }

    return candidates;
  }

  /**
   * Check if memory matches search term
   */
  private matchesSearchTerm(memory: Memory, searchTerm: string): boolean {
    const searchLower = searchTerm.toLowerCase();
    return (
      memory.content.toLowerCase().includes(searchLower) ||
      memory.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
      (memory.projectContext && memory.projectContext.toLowerCase().includes(searchLower))
    );
  }

  /**
   * Check if memory tags match query tags
   */
  private matchesTags(memoryTags: string[], queryTags: string[]): boolean {
    return queryTags.some(queryTag => 
      memoryTags.some(memoryTag => memoryTag.toLowerCase().includes(queryTag.toLowerCase()))
    );
  }

  /**
   * Generate operation ID
   */
  private generateOperationId(): string {
    return `arch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate checksum for integrity verification
   */
  private generateChecksum(memory: Memory): string {
    // Simple checksum implementation (would use proper hashing in production)
    return `checksum_${memory.id}_${memory.createdAt.getTime()}`;
  }

  /**
   * Start cleanup interval
   */
  private startCleanupInterval(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredArchives();
      this.cleanupOldArchiveRecords();
    }, this.config.cleanupInterval * 60 * 60 * 1000); // Convert hours to milliseconds
  }

  /**
   * Clean up expired archives
   */
  private cleanupExpiredArchives(): void {
    const now = new Date();
    const expiredRecords: string[] = [];

    for (const [operationId, record] of this.archiveRecords) {
      if (record.expiresAt && now > record.expiresAt) {
        // Remove from archive storage
        const tierStorage = this.archiveStorage.get(record.tier);
        tierStorage?.delete(record.memoryId);
        
        expiredRecords.push(operationId);
        
        this.emit(ArchivalEvent.ARCHIVE_EXPIRED, { operationId, record });
      }
    }

    // Remove expired records
    expiredRecords.forEach(operationId => {
      this.archiveRecords.delete(operationId);
    });
  }

  /**
   * Clean up old archive records
   */
  private cleanupOldArchiveRecords(): void {
    if (this.archiveRecords.size <= this.config.maxArchiveRecords) {
      return;
    }

    // Sort by archived date and keep only the most recent records
    const sortedRecords = Array.from(this.archiveRecords.entries())
      .sort(([, a], [, b]) => b.archivedAt.getTime() - a.archivedAt.getTime());

    const recordsToKeep = sortedRecords.slice(0, this.config.maxArchiveRecords);
    
    this.archiveRecords.clear();
    recordsToKeep.forEach(([id, record]) => {
      this.archiveRecords.set(id, record);
    });
  }

  /**
   * Shutdown the archival manager
   */
  shutdown(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = undefined;
    }
  }
}
