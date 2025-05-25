/**
 * Types for the Cross-Project Knowledge Transfer System
 */

/**
 * Knowledge types that can be transferred between projects
 */
export enum KnowledgeType {
  CODE_PATTERN = 'code_pattern',
  ARCHITECTURE = 'architecture',
  BEST_PRACTICE = 'best_practice',
  SOLUTION = 'solution',
  ALGORITHM = 'algorithm',
  CONFIGURATION = 'configuration',
  DEPENDENCY = 'dependency',
  CUSTOM = 'custom',
}

/**
 * Represents a single knowledge entity
 */
export interface Knowledge {
  /** Unique identifier for the knowledge */
  id: string;

  /** Type of knowledge */
  type: KnowledgeType;

  /** Title of the knowledge */
  title: string;

  /** Description of the knowledge */
  description: string;

  /** The actual content of the knowledge */
  content: string;

  /** Source project context */
  sourceProject: string;

  /** Source file path (if applicable) */
  sourceFilePath?: string;

  /** Programming language (if applicable) */
  language?: string;

  /** Tags for categorization */
  tags: string[];

  /** When the knowledge was created */
  createdAt: Date;

  /** When the knowledge was last updated */
  updatedAt: Date;

  /** How many times this knowledge has been accessed */
  accessCount: number;

  /** How many times this knowledge has been applied */
  applicationCount: number;

  /** User who created this knowledge */
  createdBy: string;

  /** Projects where this knowledge has been applied */
  appliedProjects: string[];

  /** Compatibility constraints */
  compatibility?: {
    /** Compatible languages */
    languages?: string[];

    /** Compatible frameworks */
    frameworks?: string[];

    /** Compatible environments */
    environments?: string[];

    /** Other compatibility notes */
    notes?: string;
  };

  /** Additional metadata */
  metadata: Record<string, any>;
}

/**
 * Query parameters for retrieving knowledge
 */
export interface KnowledgeQuery {
  /** Full-text search term */
  searchTerm?: string;

  /** Filter by knowledge type */
  type?: KnowledgeType;

  /** Filter by tags (AND logic) */
  tags?: string[];

  /** Filter by source project */
  sourceProject?: string;

  /** Filter by applied project */
  appliedProject?: string;

  /** Filter by language */
  language?: string;

  /** Filter by creation date range */
  createdBetween?: {
    start: Date;
    end: Date;
  };

  /** Sort results by field */
  sortBy?: 'createdAt' | 'updatedAt' | 'accessCount' | 'applicationCount';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Pagination: maximum number of results */
  limit?: number;

  /** Pagination: offset for results */
  offset?: number;
}

/**
 * Result of a knowledge query
 */
export interface KnowledgeQueryResult {
  /** Knowledge entities matching the query */
  knowledge: Knowledge[];

  /** Total count of knowledge entities matching the query (for pagination) */
  totalCount: number;
}

/**
 * Knowledge application record
 */
export interface KnowledgeApplication {
  /** Unique identifier for the application */
  id: string;

  /** Knowledge that was applied */
  knowledgeId: string;

  /** Project where the knowledge was applied */
  projectContext: string;

  /** File path where the knowledge was applied */
  filePath?: string;

  /** When the knowledge was applied */
  appliedAt: Date;

  /** User who applied the knowledge */
  appliedBy: string;

  /** Whether the application was successful */
  successful: boolean;

  /** Any modifications made during application */
  modifications?: string;

  /** Additional notes */
  notes?: string;
}

/**
 * Configuration for the knowledge transfer system
 */
export interface KnowledgeTransferConfig {
  /** Minimum similarity score for knowledge matching (0-1) */
  minSimilarityScore: number;

  /** Whether to automatically extract knowledge */
  autoExtractKnowledge: boolean;

  /** Maximum number of knowledge entities to extract automatically */
  maxAutoExtractCount: number;

  /** Whether to track knowledge applications */
  trackApplications: boolean;

  /** Whether to suggest knowledge proactively */
  proactiveSuggestions: boolean;

  /** Maximum number of suggestions to provide */
  maxSuggestions: number;
}

/**
 * Default knowledge transfer configuration
 */
export const DEFAULT_KNOWLEDGE_TRANSFER_CONFIG: KnowledgeTransferConfig = {
  minSimilarityScore: 0.7,
  autoExtractKnowledge: true,
  maxAutoExtractCount: 10,
  trackApplications: true,
  proactiveSuggestions: true,
  maxSuggestions: 5,
};
