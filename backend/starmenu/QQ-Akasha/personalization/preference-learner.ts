/**
 * Preference Learner for Personalization System
 */

import {
  DEFAULT_PERSONALIZATION_CONFIG,
  InteractionType,
  PersonalizationConfig,
  PreferenceCategory,
  UserInteraction,
  UserPreference,
} from './types';
import { ProfileStorage } from './profile-storage';
import { InteractionEvent, InteractionTracker } from './interaction-tracker';

/**
 * Learns user preferences from interactions
 */
export class PreferenceLearner {
  private storage: ProfileStorage;
  private tracker: InteractionTracker;
  private config: PersonalizationConfig;

  constructor(
    storage: ProfileStorage,
    tracker: InteractionTracker,
    config: Partial<PersonalizationConfig> = {}
  ) {
    this.storage = storage;
    this.tracker = tracker;
    this.config = {
      ...DEFAULT_PERSONALIZATION_CONFIG,
      ...config,
    };

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Initialize a user with default preferences
   */
  async initializeUserPreferences(userId: string): Promise<UserPreference[]> {
    const preferences: UserPreference[] = [];

    // Apply default preferences
    for (const defaultPref of this.config.defaultPreferences) {
      const preference = await this.storage.setPreference(userId, {
        ...defaultPref,
        source: 'default',
      });

      preferences.push(preference);
    }

    return preferences;
  }

  /**
   * Set an explicit user preference
   */
  async setExplicitPreference(
    userId: string,
    category: PreferenceCategory,
    key: string,
    value: any
  ): Promise<UserPreference> {
    return this.storage.setPreference(userId, {
      category,
      key,
      value,
      confidence: 1.0, // Explicit preferences have full confidence
      source: 'explicit',
    });
  }

  /**
   * Get a user preference
   */
  async getPreference(
    userId: string,
    category: PreferenceCategory,
    key: string,
    defaultValue?: any
  ): Promise<any> {
    const preferences = await this.storage.getPreferences(userId, category, key);

    if (preferences.length > 0) {
      // Return the preference with the highest confidence
      const sorted = [...preferences].sort((a, b) => b.confidence - a.confidence);
      return sorted[0].value;
    }

    return defaultValue;
  }

  /**
   * Learn preferences from a batch of interactions
   */
  async learnFromInteractions(
    userId: string,
    interactions: UserInteraction[]
  ): Promise<UserPreference[]> {
    const learnedPreferences: UserPreference[] = [];

    // Process code style preferences
    const codePrefs = this.learnCodeStylePreferences(interactions);
    for (const [key, value] of Object.entries(codePrefs)) {
      const pref = await this.updateLearnedPreference(
        userId,
        PreferenceCategory.CODE_STYLE,
        key,
        value.value,
        value.confidence
      );

      learnedPreferences.push(pref);
    }

    // Process response style preferences
    const responsePrefs = this.learnResponseStylePreferences(interactions);
    for (const [key, value] of Object.entries(responsePrefs)) {
      const pref = await this.updateLearnedPreference(
        userId,
        PreferenceCategory.RESPONSE_STYLE,
        key,
        value.value,
        value.confidence
      );

      learnedPreferences.push(pref);
    }

    // Process workflow preferences
    const workflowPrefs = this.learnWorkflowPreferences(interactions);
    for (const [key, value] of Object.entries(workflowPrefs)) {
      const pref = await this.updateLearnedPreference(
        userId,
        PreferenceCategory.WORKFLOW,
        key,
        value.value,
        value.confidence
      );

      learnedPreferences.push(pref);
    }

    return learnedPreferences;
  }

  /**
   * Update a learned preference
   */
  private async updateLearnedPreference(
    userId: string,
    category: PreferenceCategory,
    key: string,
    value: any,
    confidence: number
  ): Promise<UserPreference> {
    // Get existing preference if any
    const existing = await this.storage.getPreferences(userId, category, key);

    // If there's an explicit preference, don't override it
    if (existing.length > 0 && existing[0].source === 'explicit') {
      return existing[0];
    }

    // If there's an existing learned preference, update it with weighted average
    if (existing.length > 0 && existing[0].source === 'learned') {
      const existingPref = existing[0];
      const learningRate = this.config.learningRate;

      // Only update if confidence is significant
      if (confidence >= this.config.minConfidence) {
        // Weighted average of values (if numeric)
        let newValue = value;
        if (typeof value === 'number' && typeof existingPref.value === 'number') {
          newValue = existingPref.value * (1 - learningRate) + value * learningRate;
        }

        // Weighted average of confidence
        const newConfidence = Math.min(
          1.0,
          existingPref.confidence * (1 - learningRate) + confidence * learningRate
        );

        return this.storage.setPreference(userId, {
          category,
          key,
          value: newValue,
          confidence: newConfidence,
          source: 'learned',
        });
      }

      return existingPref;
    }

    // Create new preference if confidence is high enough
    if (confidence >= this.config.minConfidence) {
      return this.storage.setPreference(userId, {
        category,
        key,
        value,
        confidence,
        source: 'learned',
      });
    }

    // Return a dummy preference if we didn't create one
    return {
      category,
      key,
      value,
      confidence,
      updatedAt: new Date(),
      source: 'learned',
    };
  }

  /**
   * Learn code style preferences from interactions
   */
  private learnCodeStylePreferences(
    interactions: UserInteraction[]
  ): Record<string, { value: any; confidence: number }> {
    const preferences: Record<string, { value: any; confidence: number }> = {};

    // Filter code-related interactions
    const codeInteractions = interactions.filter(
      i =>
        i.type === InteractionType.CODE_GENERATION ||
        (i.type === InteractionType.MEMORY_CREATION && i.context.type === 'code')
    );

    if (codeInteractions.length === 0) {
      return preferences;
    }

    // Analyze indentation style
    const indentationStyles = this.analyzeIndentationStyle(codeInteractions);
    if (indentationStyles.style) {
      preferences['indentation'] = {
        value: indentationStyles.style,
        confidence: indentationStyles.confidence,
      };
    }

    // Analyze naming conventions
    const namingConventions = this.analyzeNamingConventions(codeInteractions);
    if (namingConventions.style) {
      preferences['namingConvention'] = {
        value: namingConventions.style,
        confidence: namingConventions.confidence,
      };
    }

    return preferences;
  }

  /**
   * Learn response style preferences from interactions
   */
  private learnResponseStylePreferences(
    interactions: UserInteraction[]
  ): Record<string, { value: any; confidence: number }> {
    const preferences: Record<string, { value: any; confidence: number }> = {};

    // Filter query interactions
    const queryInteractions = interactions.filter(i => i.type === InteractionType.QUERY);

    if (queryInteractions.length === 0) {
      return preferences;
    }

    // Analyze verbosity preference
    const verbosity = this.analyzeVerbosityPreference(queryInteractions);
    if (verbosity.style) {
      preferences['verbosity'] = {
        value: verbosity.style,
        confidence: verbosity.confidence,
      };
    }

    return preferences;
  }

  /**
   * Learn workflow preferences from interactions
   */
  private learnWorkflowPreferences(
    interactions: UserInteraction[]
  ): Record<string, { value: any; confidence: number }> {
    const preferences: Record<string, { value: any; confidence: number }> = {};

    // Analyze time of day patterns
    const timePatterns = this.analyzeTimePatterns(interactions);
    if (timePatterns.pattern) {
      preferences['activeHours'] = {
        value: timePatterns.pattern,
        confidence: timePatterns.confidence,
      };
    }

    // Analyze project context switching
    const contextSwitching = this.analyzeContextSwitching(interactions);
    if (contextSwitching.pattern) {
      preferences['contextSwitchingFrequency'] = {
        value: contextSwitching.pattern,
        confidence: contextSwitching.confidence,
      };
    }

    return preferences;
  }

  /**
   * Analyze indentation style from code interactions
   */
  private analyzeIndentationStyle(interactions: UserInteraction[]): {
    style?: string;
    confidence: number;
  } {
    // Simple implementation - could be much more sophisticated
    let spacesCount = 0;
    let tabsCount = 0;

    for (const interaction of interactions) {
      const code = interaction.context.content || '';

      // Count lines that start with spaces vs tabs
      const lines = code.split('\n');
      for (const line of lines) {
        if (line.startsWith('  ') || line.startsWith('    ')) {
          spacesCount++;
        } else if (line.startsWith('\t')) {
          tabsCount++;
        }
      }
    }

    const total = spacesCount + tabsCount;
    if (total < 10) {
      return { confidence: 0 };
    }

    if (spacesCount > tabsCount) {
      return {
        style: 'spaces',
        confidence: Math.min(1, spacesCount / total),
      };
    } else if (tabsCount > spacesCount) {
      return {
        style: 'tabs',
        confidence: Math.min(1, tabsCount / total),
      };
    }

    return { confidence: 0 };
  }

  /**
   * Analyze naming conventions from code interactions
   */
  private analyzeNamingConventions(interactions: UserInteraction[]): {
    style?: string;
    confidence: number;
  } {
    // Simple implementation - could be much more sophisticated
    let camelCaseCount = 0;
    let snake_case_count = 0;
    let PascalCaseCount = 0;

    for (const interaction of interactions) {
      const code = interaction.context.content || '';

      // Count variable declarations with different naming styles
      if (
        code.match(
          /\blet [a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]* =|\bconst [a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]* =|\bvar [a-z][a-zA-Z0-9]*[A-Z][a-zA-Z0-9]* =/g
        )
      ) {
        camelCaseCount++;
      }

      if (
        code.match(
          /\blet [a-z][a-z0-9]*_[a-z0-9]+ =|\bconst [a-z][a-z0-9]*_[a-z0-9]+ =|\bvar [a-z][a-z0-9]*_[a-z0-9]+ =/g
        )
      ) {
        snake_case_count++;
      }

      if (
        code.match(
          /\blet [A-Z][a-zA-Z0-9]* =|\bconst [A-Z][a-zA-Z0-9]* =|\bvar [A-Z][a-zA-Z0-9]* =/g
        )
      ) {
        PascalCaseCount++;
      }
    }

    const total = camelCaseCount + snake_case_count + PascalCaseCount;
    if (total < 5) {
      return { confidence: 0 };
    }

    const max = Math.max(camelCaseCount, snake_case_count, PascalCaseCount);
    const confidence = Math.min(1, max / total);

    if (camelCaseCount === max) {
      return { style: 'camelCase', confidence };
    } else if (snake_case_count === max) {
      return { style: 'snake_case', confidence };
    } else if (PascalCaseCount === max) {
      return { style: 'PascalCase', confidence };
    }

    return { confidence: 0 };
  }

  /**
   * Analyze verbosity preference from query interactions
   */
  private analyzeVerbosityPreference(interactions: UserInteraction[]): {
    style?: string;
    confidence: number;
  } {
    // Simple implementation - could be much more sophisticated
    let shortQueryCount = 0;
    let longQueryCount = 0;

    for (const interaction of interactions) {
      const query = interaction.context.query || '';

      if (query.length < 50) {
        shortQueryCount++;
      } else {
        longQueryCount++;
      }
    }

    const total = shortQueryCount + longQueryCount;
    if (total < 5) {
      return { confidence: 0 };
    }

    if (shortQueryCount > longQueryCount * 2) {
      return { style: 'concise', confidence: Math.min(1, shortQueryCount / total) };
    } else if (longQueryCount > shortQueryCount * 2) {
      return { style: 'detailed', confidence: Math.min(1, longQueryCount / total) };
    } else {
      return { style: 'balanced', confidence: 0.6 };
    }
  }

  /**
   * Analyze time patterns from interactions
   */
  private analyzeTimePatterns(interactions: UserInteraction[]): {
    pattern?: number[];
    confidence: number;
  } {
    if (interactions.length < 10) {
      return { confidence: 0 };
    }

    // Count interactions by hour of day
    const hourCounts = new Array(24).fill(0);

    for (const interaction of interactions) {
      const hour = interaction.timestamp.getHours();
      hourCounts[hour]++;
    }

    // Find active hours (hours with more than average activity)
    const average = interactions.length / 24;
    const activeHours = hourCounts
      .map((count, hour) => ({ hour, count }))
      .filter(h => h.count > average)
      .map(h => h.hour);

    if (activeHours.length === 0) {
      return { confidence: 0 };
    }

    // Calculate confidence based on consistency
    const activeCount = activeHours.reduce((sum, hour) => sum + hourCounts[hour], 0);
    const confidence = Math.min(1, activeCount / interactions.length);

    return { pattern: activeHours, confidence };
  }

  /**
   * Analyze context switching patterns
   */
  private analyzeContextSwitching(interactions: UserInteraction[]): {
    pattern?: string;
    confidence: number;
  } {
    if (interactions.length < 10) {
      return { confidence: 0 };
    }

    // Track context switches
    let contextSwitches = 0;
    let currentContext = '';

    for (const interaction of interactions) {
      const context = interaction.context.projectContext || '';

      if (context && context !== currentContext) {
        if (currentContext) {
          contextSwitches++;
        }
        currentContext = context;
      }
    }

    // Calculate switching frequency
    const switchesPerInteraction = contextSwitches / interactions.length;

    let pattern: string;
    if (switchesPerInteraction < 0.05) {
      pattern = 'focused';
    } else if (switchesPerInteraction < 0.2) {
      pattern = 'moderate';
    } else {
      pattern = 'frequent';
    }

    // Confidence based on number of interactions
    const confidence = Math.min(1, interactions.length / 50);

    return { pattern, confidence };
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Learn from new interactions
    this.tracker.on(InteractionEvent.INTERACTION_RECORDED, async interaction => {
      // Get recent interactions
      const recentInteractions = await this.tracker.getRecentInteractions(interaction.userId, 20);

      // Learn from interactions
      await this.learnFromInteractions(interaction.userId, recentInteractions);
    });
  }
}
