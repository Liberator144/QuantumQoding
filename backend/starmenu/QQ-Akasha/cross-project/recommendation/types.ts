/**
 * Types for Predictive Knowledge Recommendation
 * Enables proactive recommendation of knowledge entities based on developer context
 */

import { Knowledge, KnowledgeType } from '../types';

/**
 * Types of recommendation triggers
 */
export enum RecommendationTrigger {
  /** Triggered when editing a file */
  FILE_EDIT = 'file_edit',

  /** Triggered when creating a new file */
  FILE_CREATE = 'file_create',

  /** Triggered when viewing a file */
  FILE_VIEW = 'file_view',

  /** Triggered when running a command */
  COMMAND_RUN = 'command_run',

  /** Triggered when encountering an error */
  ERROR_ENCOUNTER = 'error_encounter',

  /** Triggered when searching for something */
  SEARCH = 'search',

  /** Triggered periodically based on recent activity */
  PERIODIC = 'periodic',

  /** Triggered manually by the user */
  MANUAL = 'manual',

  /** Custom trigger */
  CUSTOM = 'custom',
}

/**
 * Types of recommendation contexts
 */
export enum RecommendationContext {
  /** Code editing context */
  CODE_EDITING = 'code_editing',

  /** Debugging context */
  DEBUGGING = 'debugging',

  /** Architecture design context */
  ARCHITECTURE = 'architecture',

  /** Testing context */
  TESTING = 'testing',

  /** Documentation context */
  DOCUMENTATION = 'documentation',

  /** Performance optimization context */
  PERFORMANCE = 'performance',

  /** Security context */
  SECURITY = 'security',

  /** General development context */
  GENERAL = 'general',
}

/**
 * Recommendation relevance level
 */
export enum RelevanceLevel {
  /** Critical relevance - immediate attention recommended */
  CRITICAL = 'critical',

  /** High relevance - strongly recommended */
  HIGH = 'high',

  /** Medium relevance - recommended */
  MEDIUM = 'medium',

  /** Low relevance - might be useful */
  LOW = 'low',
}

/**
 * Developer context information
 */
export interface DeveloperContext {
  /** Current project ID */
  projectId: string;

  /** Current file path */
  filePath?: string;

  /** Current file content */
  fileContent?: string;

  /** Current cursor position */
  cursorPosition?: {
    line: number;
    column: number;
  };

  /** Selected text (if any) */
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    text: string;
  };

  /** Recent files viewed/edited */
  recentFiles?: Array<{
    path: string;
    lastAccessed: Date;
    accessType: 'view' | 'edit';
  }>;

  /** Recent commands executed */
  recentCommands?: Array<{
    command: string;
    timestamp: Date;
  }>;

  /** Recent errors encountered */
  recentErrors?: Array<{
    message: string;
    location?: string;
    timestamp: Date;
  }>;

  /** Recent searches performed */
  recentSearches?: Array<{
    query: string;
    timestamp: Date;
  }>;

  /** Project files for multi-file context */
  projectFiles?: Array<{
    path: string;
    content: string;
  }>;

  /** Current recommendation context */
  context?: RecommendationContext;

  /** Additional context information */
  additionalContext?: Record<string, any>;
}

/**
 * Knowledge recommendation
 */
export interface KnowledgeRecommendation {
  /** Unique identifier for the recommendation */
  id: string;

  /** Recommended knowledge entity */
  knowledge: Knowledge;

  /** Relevance score (0-1) */
  relevanceScore: number;

  /** Relevance level */
  relevanceLevel: RelevanceLevel;

  /** Reason for recommendation */
  reason: string;

  /** Trigger that caused this recommendation */
  trigger: RecommendationTrigger;

  /** Context in which this recommendation was made */
  context: RecommendationContext;

  /** When the recommendation was created */
  timestamp: Date;

  /** Whether the recommendation has been viewed */
  viewed: boolean;

  /** Whether the recommendation has been applied */
  applied: boolean;

  /** Whether the recommendation has been dismissed */
  dismissed: boolean;

  /** User feedback on the recommendation */
  feedback?: {
    /** Rating (1-5) */
    rating?: number;

    /** Comment */
    comment?: string;

    /** When the feedback was provided */
    timestamp?: Date;
  };

  /** Suggested application method */
  applicationMethod?: {
    /** Description of how to apply */
    description: string;

    /** Code snippet to insert (if applicable) */
    codeSnippet?: string;

    /** File path to modify (if applicable) */
    targetFilePath?: string;

    /** Position to insert at (if applicable) */
    insertPosition?: {
      line: number;
      column: number;
    };
  };
}

/**
 * Recommendation filter
 */
export interface RecommendationFilter {
  /** Filter by knowledge type */
  knowledgeTypes?: KnowledgeType[];

  /** Filter by relevance level */
  relevanceLevels?: RelevanceLevel[];

  /** Filter by minimum relevance score */
  minRelevanceScore?: number;

  /** Filter by recommendation context */
  contexts?: RecommendationContext[];

  /** Filter by trigger */
  triggers?: RecommendationTrigger[];

  /** Filter by viewed status */
  viewed?: boolean;

  /** Filter by applied status */
  applied?: boolean;

  /** Filter by dismissed status */
  dismissed?: boolean;

  /** Maximum number of recommendations */
  limit?: number;
}

/**
 * Recommendation engine configuration
 */
export interface RecommendationConfig {
  /** Whether the recommendation engine is enabled */
  enabled: boolean;

  /** Minimum relevance score for recommendations (0-1) */
  minRelevanceScore: number;

  /** Maximum number of recommendations to show at once */
  maxRecommendations: number;

  /** Whether to show recommendations automatically */
  autoShow: boolean;

  /** Whether to track user feedback */
  trackFeedback: boolean;

  /** Whether to learn from user feedback */
  learnFromFeedback: boolean;

  /** Recommendation triggers to enable */
  enabledTriggers: RecommendationTrigger[];

  /** Recommendation contexts to enable */
  enabledContexts: RecommendationContext[];

  /** Knowledge types to recommend */
  enabledKnowledgeTypes: KnowledgeType[];

  /** Periodic recommendation interval (in minutes) */
  periodicInterval: number;

  /** Whether to use AI for relevance scoring */
  useAI: boolean;

  /** Additional configuration */
  additionalConfig?: Record<string, any>;
}

/**
 * Default recommendation configuration
 */
export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
  enabled: true,
  minRelevanceScore: 0.7,
  maxRecommendations: 5,
  autoShow: true,
  trackFeedback: true,
  learnFromFeedback: true,
  enabledTriggers: [
    RecommendationTrigger.FILE_EDIT,
    RecommendationTrigger.ERROR_ENCOUNTER,
    RecommendationTrigger.SEARCH,
    RecommendationTrigger.MANUAL,
  ],
  enabledContexts: [
    RecommendationContext.CODE_EDITING,
    RecommendationContext.DEBUGGING,
    RecommendationContext.PERFORMANCE,
    RecommendationContext.SECURITY,
  ],
  enabledKnowledgeTypes: [
    KnowledgeType.CODE_PATTERN,
    KnowledgeType.BEST_PRACTICE,
    KnowledgeType.SOLUTION,
  ],
  periodicInterval: 30,
  useAI: true,
};
