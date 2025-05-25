/**
 * Types for the Memory Prioritization System
 */

/**
 * Configuration for the priority calculator
 */
export interface PriorityConfig {
  /** Weight for recency factor (0-1) */
  recencyWeight: number;

  /** Weight for frequency factor (0-1) */
  frequencyWeight: number;

  /** Weight for relevance factor (0-1) */
  relevanceWeight: number;

  /** Weight for importance factor (0-1) */
  importanceWeight: number;

  /** Half-life for recency decay in milliseconds */
  recencyHalfLife: number;

  /** Maximum age to consider for recency in milliseconds */
  maxRecencyAge: number;

  /** Threshold for considering a memory as frequently accessed */
  frequencyThreshold: number;

  /** Boost factor for explicitly marked important memories */
  importanceBoostFactor: number;
}

/**
 * Default priority configuration
 */
export const DEFAULT_PRIORITY_CONFIG: PriorityConfig = {
  recencyWeight: 0.3,
  frequencyWeight: 0.25,
  relevanceWeight: 0.25,
  importanceWeight: 0.2,
  recencyHalfLife: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  maxRecencyAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  frequencyThreshold: 10,
  importanceBoostFactor: 1.5,
};

/**
 * Priority factors used in calculation
 */
export interface PriorityFactors {
  /** Recency score (0-1) */
  recency: number;

  /** Frequency score (0-1) */
  frequency: number;

  /** Relevance score (0-1) */
  relevance: number;

  /** Importance score (0-1) */
  importance: number;

  /** Final calculated priority score (0-1) */
  finalScore: number;
}

/**
 * Context for priority calculation
 */
export interface PriorityContext {
  /** Current query or context for relevance calculation */
  currentQuery?: string;

  /** Current project context */
  projectContext?: string;

  /** Current file path */
  filePath?: string;

  /** Current user */
  user?: string;

  /** Additional context as key-value pairs */
  additionalContext?: Record<string, any>;
}
