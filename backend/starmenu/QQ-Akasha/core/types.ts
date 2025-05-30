/**
 * Core types for the Memory Bank MCP system
 */

/**
 * Represents a single memory entry in the Memory Bank
 */
export interface Memory {
  /** Unique identifier for the memory */
  id: string;

  /** The actual content of the memory */
  content: string;

  /** Type of memory (code, documentation, conversation, etc.) */
  type: MemoryType;

  /** Tags associated with this memory for categorization */
  tags: string[];

  /** When the memory was created */
  createdAt: Date;

  /** When the memory was last accessed */
  lastAccessedAt: Date;

  /** How many times this memory has been accessed */
  accessCount: number;

  /** User who created this memory */
  createdBy: string;

  /** Project context this memory belongs to */
  projectContext?: string;

  /** File path associated with this memory (if applicable) */
  filePath?: string;

  /** Priority score for this memory (higher = more important) */
  priorityScore?: number;

  /** Related memory IDs */
  relatedMemories?: string[];

  /** Additional metadata as key-value pairs */
  metadata: Record<string, any>;
}

/**
 * Types of memories that can be stored
 */
export enum MemoryType {
  CODE = 'code',
  DOCUMENTATION = 'documentation',
  CONVERSATION = 'conversation',
  DECISION = 'decision',
  PATTERN = 'pattern',
  PREFERENCE = 'preference',
  CUSTOM = 'custom',
}

/**
 * Query parameters for retrieving memories
 */
export interface MemoryQuery {
  /** Full-text search term */
  searchTerm?: string;

  /** Filter by memory type */
  type?: MemoryType;

  /** Filter by tags (AND logic) */
  tags?: string[];

  /** Filter by project context */
  projectContext?: string;

  /** Filter by file path (can use glob patterns) */
  filePath?: string;

  /** Filter by creation date range */
  createdBetween?: {
    start: Date;
    end: Date;
  };

  /** Filter by last accessed date range */
  accessedBetween?: {
    start: Date;
    end: Date;
  };

  /** Minimum priority score */
  minPriority?: number;

  /** Sort results by field */
  sortBy?: 'priority' | 'createdAt' | 'lastAccessedAt' | 'accessCount' | 'relevance';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Pagination: maximum number of results */
  limit?: number;

  /** Pagination: offset for results */
  offset?: number;

  /** Enable context-based retrieval */
  useContextualSearch?: boolean;

  /** Include related memories in results */
  includeRelated?: boolean;

  /** Maximum depth for related memory discovery */
  maxRelatedDepth?: number;

  /** Semantic similarity threshold (0-1) */
  similarityThreshold?: number;

  /** Context for semantic search */
  context?: {
    currentFile?: string;
    currentProject?: string;
    recentMemories?: string[];
    userPreferences?: Record<string, any>;
  };
}

/**
 * Enhanced memory result with relevance scoring
 */
export interface MemoryResult extends Memory {
  /** Relevance score for this result (0-1) */
  relevanceScore?: number;

  /** Explanation of why this memory is relevant */
  relevanceReason?: string;

  /** Related memories discovered during search */
  relatedResults?: MemoryResult[];
}

/**
 * Result of a memory query
 */
export interface MemoryQueryResult {
  /** Memories matching the query */
  memories: Memory[];

  /** Total count of memories matching the query (for pagination) */
  totalCount: number;

  /** Enhanced results with relevance scoring (when using contextual search) */
  enhancedResults?: MemoryResult[];

  /** Search metadata */
  searchMetadata?: {
    searchTime: number;
    algorithmUsed: string;
    contextFactors: string[];
  };
}

/**
 * Interface for the Memory Storage provider
 */
export interface MemoryStorage {
  /** Store a new memory */
  storeMemory(memory: Omit<Memory, 'id' | 'createdAt'>): Promise<Memory>;

  /** Retrieve a memory by ID */
  getMemory(id: string): Promise<Memory | null>;

  /** Update an existing memory */
  updateMemory(id: string, updates: Partial<Memory>): Promise<Memory>;

  /** Delete a memory */
  deleteMemory(id: string): Promise<boolean>;

  /** Query memories */
  queryMemories(query: MemoryQuery): Promise<MemoryQueryResult>;

  /** Record an access to a memory */
  recordAccess(id: string): Promise<void>;

  /** Get memories that are marked as deleted (for soft delete recovery) */
  getDeletedMemories?(): Promise<Memory[]>;

  /** Permanently remove a soft-deleted memory */
  permanentlyDeleteMemory?(id: string): Promise<boolean>;

  /** Get memories that are marked as archived */
  getArchivedMemories?(): Promise<Memory[]>;

  /** Get archived memories by tier */
  getArchivedMemoriesByTier?(tier: string): Promise<Memory[]>;
}
