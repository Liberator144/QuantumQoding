/**
 * Recommendation service for integrating the recommendation engine with the rest of the system
 */

import {
  RecommendationEngine,
  RecommendationProviderRegistry,
  RecommendationContext,
  RecommendationOptions,
  RecommendationResult,
  UserPreferences,
  ProjectContext,
  UsageHistory,
} from './engine';
import { CodeSnippetProvider } from './engine/providers/code-snippet-provider';
import { ContextFilter } from './engine/filters/context-filter';
import { RelevanceScorer } from './engine/scorers/relevance-scorer';
import { UserPreferencePersonalizer } from './engine/personalizers/user-preference-personalizer';
import { ContextAnalyzer } from './context-analyzer';
import { FileContext } from './code-generation/context/types';
import { ProjectContextManager } from '../cross-project/project-context';

/**
 * Recommendation service
 */
export class RecommendationService {
  private engine: RecommendationEngine;
  private contextAnalyzer: ContextAnalyzer;
  private projectContextManager: ProjectContextManager;
  private userPreferences: UserPreferences = {};
  private usageHistory: UsageHistory = {};

  /**
   * Create a new recommendation service
   */
  constructor(contextAnalyzer: ContextAnalyzer, projectContextManager: ProjectContextManager) {
    // Create provider registry
    const providerRegistry = new RecommendationProviderRegistry();

    // Register providers
    providerRegistry.registerProvider(new CodeSnippetProvider());

    // Create recommendation engine
    this.engine = new RecommendationEngine(providerRegistry);

    // Add filters
    this.engine.addFilter(new ContextFilter());

    // Add scorers
    this.engine.addScorer(new RelevanceScorer());

    // Add personalizers
    this.engine.addPersonalizer(new UserPreferencePersonalizer());

    // Set context analyzer and project context manager
    this.contextAnalyzer = contextAnalyzer;
    this.projectContextManager = projectContextManager;
  }

  /**
   * Get recommendations for a file
   */
  async getRecommendationsForFile(
    filePath: string,
    content: string,
    options: Partial<RecommendationOptions> = {}
  ): Promise<RecommendationResult> {
    try {
      // Analyze file context
      const fileContext = await this.contextAnalyzer.analyzeFile(filePath, content);

      // Get project context
      const projectId = this.projectContextManager.getProjectIdForFile(filePath);
      let projectContext: ProjectContext | undefined;

      if (projectId) {
        const project = this.projectContextManager.getProject(projectId);

        if (project) {
          projectContext = {
            name: project.name,
            description: project.description,
            languages: project.languages,
            dependencies: project.dependencies,
            repositoryUrl: project.repositoryUrl,
          };
        }
      }

      // Create recommendation context
      const context: RecommendationContext = {
        fileContext,
        userPreferences: this.userPreferences,
        projectContext,
        usageHistory: this.usageHistory,
      };

      // Get recommendations
      return await this.engine.getRecommendations(context, options);
    } catch (error) {
      console.error('Error getting recommendations for file:', error);

      return {
        recommendations: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        errors: [`Failed to get recommendations: ${error}`],
        warnings: [],
      };
    }
  }

  /**
   * Get recommendations for a file context
   */
  async getRecommendationsForFileContext(
    fileContext: FileContext,
    options: Partial<RecommendationOptions> = {}
  ): Promise<RecommendationResult> {
    try {
      // Get project context
      const projectId = this.projectContextManager.getProjectIdForFile(fileContext.filePath);
      let projectContext: ProjectContext | undefined;

      if (projectId) {
        const project = this.projectContextManager.getProject(projectId);

        if (project) {
          projectContext = {
            name: project.name,
            description: project.description,
            languages: project.languages,
            dependencies: project.dependencies,
            repositoryUrl: project.repositoryUrl,
          };
        }
      }

      // Create recommendation context
      const context: RecommendationContext = {
        fileContext,
        userPreferences: this.userPreferences,
        projectContext,
        usageHistory: this.usageHistory,
      };

      // Get recommendations
      return await this.engine.getRecommendations(context, options);
    } catch (error) {
      console.error('Error getting recommendations for file context:', error);

      return {
        recommendations: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        errors: [`Failed to get recommendations: ${error}`],
        warnings: [],
      };
    }
  }

  /**
   * Set user preferences
   */
  setUserPreferences(preferences: UserPreferences): void {
    this.userPreferences = preferences;
  }

  /**
   * Update user preferences
   */
  updateUserPreferences(preferences: Partial<UserPreferences>): void {
    this.userPreferences = {
      ...this.userPreferences,
      ...preferences,
    };
  }

  /**
   * Get user preferences
   */
  getUserPreferences(): UserPreferences {
    return this.userPreferences;
  }

  /**
   * Set usage history
   */
  setUsageHistory(history: UsageHistory): void {
    this.usageHistory = history;
  }

  /**
   * Update usage history
   */
  updateUsageHistory(history: Partial<UsageHistory>): void {
    this.usageHistory = {
      ...this.usageHistory,
      ...history,
    };
  }

  /**
   * Get usage history
   */
  getUsageHistory(): UsageHistory {
    return this.usageHistory;
  }

  /**
   * Record recommendation usage
   */
  recordRecommendationUsage(recommendationId: string): void {
    // Update recently used recommendations
    if (!this.usageHistory.recentlyUsedRecommendations) {
      this.usageHistory.recentlyUsedRecommendations = [];
    }

    // Add to the beginning of the list
    this.usageHistory.recentlyUsedRecommendations.unshift(recommendationId);

    // Limit to 10 recent recommendations
    if (this.usageHistory.recentlyUsedRecommendations.length > 10) {
      this.usageHistory.recentlyUsedRecommendations =
        this.usageHistory.recentlyUsedRecommendations.slice(0, 10);
    }

    // Update usage counts
    if (!this.usageHistory.usageCounts) {
      this.usageHistory.usageCounts = {};
    }

    this.usageHistory.usageCounts[recommendationId] =
      (this.usageHistory.usageCounts[recommendationId] || 0) + 1;

    // Update usage timestamps
    if (!this.usageHistory.usageTimestamps) {
      this.usageHistory.usageTimestamps = {};
    }

    this.usageHistory.usageTimestamps[recommendationId] = new Date();
  }
}
