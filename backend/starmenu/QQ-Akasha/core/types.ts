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
  sortBy?: 'priority' | 'createdAt' | 'lastAccessedAt' | 'accessCount';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Pagination: maximum number of results */
  limit?: number;

  /** Pagination: offset for results */
  offset?: number;
}

/**
 * Result of a memory query
 */
export interface MemoryQueryResult {
  /** Memories matching the query */
  memories: Memory[];

  /** Total count of memories matching the query (for pagination) */
  totalCount: number;
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
}
