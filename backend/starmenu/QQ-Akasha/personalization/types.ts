/**
 * Types for the Personalization System
 */

/**
 * User interaction types that can be tracked
 */
export enum InteractionType {
  MEMORY_ACCESS = 'memory_access',
  MEMORY_CREATION = 'memory_creation',
  MEMORY_UPDATE = 'memory_update',
  MEMORY_DELETION = 'memory_deletion',
  QUERY = 'query',
  CODE_GENERATION = 'code_generation',
  DOCUMENTATION_GENERATION = 'documentation_generation',
  VISUALIZATION = 'visualization',
  FEEDBACK = 'feedback',
  CUSTOM = 'custom',
}

/**
 * Represents a single user interaction
 */
export interface UserInteraction {
  /** Unique identifier for the interaction */
  id: string;

  /** User identifier */
  userId: string;

  /** Type of interaction */
  type: InteractionType;

  /** When the interaction occurred */
  timestamp: Date;

  /** Context of the interaction (e.g., memory ID, query text) */
  context: Record<string, any>;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * User preference categories
 */
export enum PreferenceCategory {
  CONTENT_FORMAT = 'content_format',
  RESPONSE_STYLE = 'response_style',
  CODE_STYLE = 'code_style',
  DOCUMENTATION_STYLE = 'documentation_style',
  VISUALIZATION_STYLE = 'visualization_style',
  WORKFLOW = 'workflow',
  CUSTOM = 'custom',
}

/**
 * Represents a user preference
 */
export interface UserPreference {
  /** Category of the preference */
  category: PreferenceCategory;

  /** Specific preference key */
  key: string;

  /** Preference value */
  value: any;

  /** Confidence level (0-1) */
  confidence: number;

  /** When the preference was last updated */
  updatedAt: Date;

  /** How the preference was determined */
  source: 'explicit' | 'learned' | 'default';

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Complete user profile
 */
export interface UserProfile {
  /** Unique identifier for the user */
  id: string;

  /** User's name or identifier */
  name: string;

  /** When the profile was created */
  createdAt: Date;

  /** When the profile was last updated */
  updatedAt: Date;

  /** User's preferences */
  preferences: UserPreference[];

  /** User's recent interactions */
  recentInteractions: UserInteraction[];

  /** User's project contexts */
  projectContexts: string[];

  /** Additional metadata */
  metadata: Record<string, any>;
}

/**
 * Configuration for the personalization system
 */
export interface PersonalizationConfig {
  /** Maximum number of recent interactions to store */
  maxRecentInteractions: number;

  /** How quickly to adapt to new preferences (0-1) */
  learningRate: number;

  /** Minimum confidence required to apply a learned preference */
  minConfidence: number;

  /** Whether to track interactions automatically */
  autoTrackInteractions: boolean;

  /** Default preferences to apply to new users */
  defaultPreferences: UserPreference[];
}

/**
 * Default personalization configuration
 */
export const DEFAULT_PERSONALIZATION_CONFIG: PersonalizationConfig = {
  maxRecentInteractions: 100,
  learningRate: 0.2,
  minConfidence: 0.6,
  autoTrackInteractions: true,
  defaultPreferences: [
    {
      category: PreferenceCategory.RESPONSE_STYLE,
      key: 'verbosity',
      value: 'balanced',
      confidence: 1.0,
      updatedAt: new Date(),
      source: 'default',
    },
    {
      category: PreferenceCategory.CODE_STYLE,
      key: 'format',
      value: 'standard',
      confidence: 1.0,
      updatedAt: new Date(),
      source: 'default',
    },
  ],
};
