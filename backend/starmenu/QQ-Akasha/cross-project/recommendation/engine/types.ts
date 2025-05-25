/**
 * Types for recommendation engine
 */

import { ProgrammingLanguage } from '../code-generation/templates/types';
import { FileContext } from '../code-generation/context/types';
import { DesignPatternType } from '../code-generation/patterns/types';

/**
 * Recommendation type
 */
export enum RecommendationType {
  /** Code snippet recommendation */
  CODE_SNIPPET = 'code-snippet',

  /** Template recommendation */
  TEMPLATE = 'template',

  /** Pattern recommendation */
  PATTERN = 'pattern',

  /** Library recommendation */
  LIBRARY = 'library',

  /** Tool recommendation */
  TOOL = 'tool',

  /** Resource recommendation */
  RESOURCE = 'resource',

  /** Best practice recommendation */
  BEST_PRACTICE = 'best-practice',

  /** Refactoring recommendation */
  REFACTORING = 'refactoring',
}

/**
 * Recommendation category
 */
export enum RecommendationCategory {
  /** Code generation recommendations */
  CODE_GENERATION = 'code-generation',

  /** Code improvement recommendations */
  CODE_IMPROVEMENT = 'code-improvement',

  /** Learning recommendations */
  LEARNING = 'learning',

  /** Productivity recommendations */
  PRODUCTIVITY = 'productivity',

  /** Security recommendations */
  SECURITY = 'security',

  /** Performance recommendations */
  PERFORMANCE = 'performance',
}

/**
 * Recommendation priority
 */
export enum RecommendationPriority {
  /** Low priority */
  LOW = 'low',

  /** Medium priority */
  MEDIUM = 'medium',

  /** High priority */
  HIGH = 'high',

  /** Critical priority */
  CRITICAL = 'critical',
}

/**
 * Recommendation
 */
export interface Recommendation {
  /** Recommendation ID */
  id: string;

  /** Recommendation type */
  type: RecommendationType;

  /** Recommendation category */
  category: RecommendationCategory;

  /** Recommendation title */
  title: string;

  /** Recommendation description */
  description: string;

  /** Recommendation content */
  content: string;

  /** Recommendation priority */
  priority: RecommendationPriority;

  /** Recommendation relevance score (0-1) */
  relevanceScore: number;

  /** Recommendation tags */
  tags: string[];

  /** Recommendation language */
  language?: ProgrammingLanguage;

  /** Recommendation pattern */
  pattern?: DesignPatternType;

  /** Recommendation source */
  source?: string;

  /** Recommendation URL */
  url?: string;

  /** Recommendation created at */
  createdAt: Date;

  /** Recommendation metadata */
  metadata?: Record<string, any>;
}

/**
 * Recommendation filter
 */
export interface RecommendationFilter {
  /** Filter by recommendation type */
  type?: RecommendationType;

  /** Filter by recommendation category */
  category?: RecommendationCategory;

  /** Filter by recommendation priority */
  priority?: RecommendationPriority;

  /** Filter by recommendation tags */
  tags?: string[];

  /** Filter by recommendation language */
  language?: ProgrammingLanguage;

  /** Filter by recommendation pattern */
  pattern?: DesignPatternType;

  /** Filter by minimum relevance score */
  minRelevanceScore?: number;

  /** Filter by maximum relevance score */
  maxRelevanceScore?: number;

  /** Filter by recommendation source */
  source?: string;

  /** Filter by recommendation created after */
  createdAfter?: Date;

  /** Filter by recommendation created before */
  createdBefore?: Date;

  /** Custom filter function */
  customFilter?: (recommendation: Recommendation) => boolean;
}

/**
 * Recommendation sort options
 */
export interface RecommendationSortOptions {
  /** Sort by field */
  sortBy?: keyof Recommendation | 'relevanceScore';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
}

/**
 * Recommendation pagination options
 */
export interface RecommendationPaginationOptions {
  /** Page number */
  page?: number;

  /** Page size */
  pageSize?: number;
}

/**
 * Recommendation options
 */
export interface RecommendationOptions {
  /** Recommendation filter */
  filter?: RecommendationFilter;

  /** Recommendation sort options */
  sort?: RecommendationSortOptions;

  /** Recommendation pagination options */
  pagination?: RecommendationPaginationOptions;
}

/**
 * Default recommendation options
 */
export const DEFAULT_RECOMMENDATION_OPTIONS: RecommendationOptions = {
  filter: {
    minRelevanceScore: 0.5,
  },
  sort: {
    sortBy: 'relevanceScore',
    sortDirection: 'desc',
  },
  pagination: {
    page: 1,
    pageSize: 10,
  },
};

/**
 * Recommendation result
 */
export interface RecommendationResult {
  /** Recommendations */
  recommendations: Recommendation[];

  /** Total number of recommendations */
  total: number;

  /** Current page */
  page: number;

  /** Page size */
  pageSize: number;

  /** Total number of pages */
  totalPages: number;

  /** Errors */
  errors: string[];

  /** Warnings */
  warnings: string[];
}

/**
 * Recommendation context
 */
export interface RecommendationContext {
  /** Current file context */
  fileContext: FileContext;

  /** User preferences */
  userPreferences?: UserPreferences;

  /** Project context */
  projectContext?: ProjectContext;

  /** Usage history */
  usageHistory?: UsageHistory;
}

/**
 * User preferences
 */
export interface UserPreferences {
  /** Preferred languages */
  preferredLanguages?: ProgrammingLanguage[];

  /** Preferred patterns */
  preferredPatterns?: DesignPatternType[];

  /** Preferred recommendation types */
  preferredRecommendationTypes?: RecommendationType[];

  /** Preferred recommendation categories */
  preferredRecommendationCategories?: RecommendationCategory[];

  /** Preferred tags */
  preferredTags?: string[];

  /** Preferred sources */
  preferredSources?: string[];

  /** Excluded tags */
  excludedTags?: string[];

  /** Excluded sources */
  excludedSources?: string[];

  /** Custom preferences */
  customPreferences?: Record<string, any>;
}

/**
 * Project context
 */
export interface ProjectContext {
  /** Project name */
  name: string;

  /** Project description */
  description?: string;

  /** Project languages */
  languages: ProgrammingLanguage[];

  /** Project dependencies */
  dependencies?: Record<string, string>;

  /** Project dev dependencies */
  devDependencies?: Record<string, string>;

  /** Project repository URL */
  repositoryUrl?: string;

  /** Project license */
  license?: string;

  /** Project metadata */
  metadata?: Record<string, any>;
}

/**
 * Usage history
 */
export interface UsageHistory {
  /** Recently used recommendations */
  recentlyUsedRecommendations?: string[];

  /** Recently used patterns */
  recentlyUsedPatterns?: DesignPatternType[];

  /** Recently used templates */
  recentlyUsedTemplates?: string[];

  /** Recently used libraries */
  recentlyUsedLibraries?: string[];

  /** Recently used tools */
  recentlyUsedTools?: string[];

  /** Recently used resources */
  recentlyUsedResources?: string[];

  /** Usage counts */
  usageCounts?: Record<string, number>;

  /** Usage timestamps */
  usageTimestamps?: Record<string, Date>;
}
