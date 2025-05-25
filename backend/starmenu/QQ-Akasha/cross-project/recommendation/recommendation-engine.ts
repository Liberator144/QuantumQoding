/**
 * Recommendation Engine for Predictive Knowledge Recommendation
 * Generates relevant knowledge recommendations based on developer context
 */

import { EventEmitter } from 'events';
import {
  DeveloperContext,
  KnowledgeRecommendation,
  RecommendationFilter,
  RecommendationConfig,
  DEFAULT_RECOMMENDATION_CONFIG,
} from './types';
import { ContextAnalyzer, ContextAnalysisResult } from './context-analyzer';
import { StrategyManager } from './strategies/strategy-manager';
import {
  FeedbackAnalyzer,
  AdaptiveScoring,
  AdaptiveScoringConfig,
  DEFAULT_ADAPTIVE_SCORING_CONFIG,
} from './learning';
import { TemplateRepository } from './code-generation/templates/types';
import { Knowledge } from '../types';
import { KnowledgeStorage } from '../knowledge-storage';
import { ProjectContextManager } from '../project-context';

/**
 * Events emitted by the recommendation engine
 */
export enum RecommendationEvent {
  RECOMMENDATION_CREATED = 'recommendation-created',
  RECOMMENDATION_UPDATED = 'recommendation-updated',
  RECOMMENDATION_APPLIED = 'recommendation-applied',
  RECOMMENDATION_DISMISSED = 'recommendation-dismissed',
  RECOMMENDATION_FEEDBACK = 'recommendation-feedback',
  CONTEXT_ANALYZED = 'context-analyzed',
}

/**
 * Generates relevant knowledge recommendations based on developer context
 */
export class RecommendationEngine {
  private readonly storage: KnowledgeStorage;
  private readonly projectManager: ProjectContextManager;
  private readonly contextAnalyzer: ContextAnalyzer;
  private readonly strategyManager: StrategyManager;
  private readonly feedbackAnalyzer: FeedbackAnalyzer;
  private readonly adaptiveScoring: AdaptiveScoring;
  private readonly templateRepository: TemplateRepository;
  private config: RecommendationConfig;
  private adaptiveScoringConfig: AdaptiveScoringConfig;
  private readonly activeRecommendations: Map<string, KnowledgeRecommendation>;
  private readonly eventEmitter: EventEmitter;

  constructor(
    storage: KnowledgeStorage,
    projectManager: ProjectContextManager,
    config: Partial<RecommendationConfig> = {},
    adaptiveScoringConfig: Partial<AdaptiveScoringConfig> = {}
  ) {
    this.storage = storage;
    this.projectManager = projectManager;
    this.contextAnalyzer = new ContextAnalyzer(projectManager);
    this.strategyManager = new StrategyManager();
    this.feedbackAnalyzer = new FeedbackAnalyzer();
    this.config = {
      ...DEFAULT_RECOMMENDATION_CONFIG,
      ...config,
    };
    this.adaptiveScoringConfig = {
      ...DEFAULT_ADAPTIVE_SCORING_CONFIG,
      ...adaptiveScoringConfig,
    };
    this.adaptiveScoring = new AdaptiveScoring(this.feedbackAnalyzer, this.adaptiveScoringConfig);

    // Initialize template repository
    this.templateRepository = new TemplateRepository({
      name: 'Code Generation Templates',
      description: 'Repository for code generation templates',
      location: 'memory',
      enableVersioning: false,
      enableSharing: true,
      enableRating: true,
      enableUsageTracking: true,
    });

    // Register code generation strategy
    this.strategyManager.registerCodeGenerationStrategy(this.templateRepository);

    this.activeRecommendations = new Map();
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Generate recommendations based on developer context
   */
  async generateRecommendations(
    context: DeveloperContext,
    filter?: RecommendationFilter
  ): Promise<KnowledgeRecommendation[]> {
    // Check if recommendation engine is enabled
    if (!this.config.enabled) {
      return [];
    }

    // Analyze context
    const analysisResult = this.contextAnalyzer.analyze(context);

    // Emit context analyzed event
    this.eventEmitter.emit(RecommendationEvent.CONTEXT_ANALYZED, {
      context,
      analysis: analysisResult,
    });

    // Check if trigger is enabled
    if (!this.config.enabledTriggers.includes(analysisResult.trigger)) {
      return [];
    }

    // Check if context is enabled
    if (!this.config.enabledContexts.includes(analysisResult.context)) {
      return [];
    }

    // Find relevant knowledge
    const relevantKnowledge = await this.findRelevantKnowledge(analysisResult, context);

    // Generate recommendations
    const recommendations = this.createRecommendations(relevantKnowledge, analysisResult, context);

    // Apply filter if provided
    const filteredRecommendations = filter
      ? this.filterRecommendations(recommendations, filter)
      : recommendations;

    // Store active recommendations
    for (const recommendation of filteredRecommendations) {
      this.activeRecommendations.set(recommendation.id, recommendation);

      // Emit recommendation created event
      this.eventEmitter.emit(RecommendationEvent.RECOMMENDATION_CREATED, recommendation);
    }

    return filteredRecommendations;
  }

  /**
   * Get active recommendations
   */
  getActiveRecommendations(filter?: RecommendationFilter): KnowledgeRecommendation[] {
    const recommendations = Array.from(this.activeRecommendations.values());

    return filter ? this.filterRecommendations(recommendations, filter) : recommendations;
  }

  /**
   * Get a recommendation by ID
   */
  getRecommendation(id: string): KnowledgeRecommendation | undefined {
    return this.activeRecommendations.get(id);
  }

  /**
   * Mark a recommendation as viewed
   */
  markAsViewed(id: string): KnowledgeRecommendation | undefined {
    const recommendation = this.activeRecommendations.get(id);

    if (recommendation && !recommendation.viewed) {
      recommendation.viewed = true;

      // Emit recommendation updated event
      this.eventEmitter.emit(RecommendationEvent.RECOMMENDATION_UPDATED, recommendation);
    }

    return recommendation;
  }

  /**
   * Mark a recommendation as applied
   */
  markAsApplied(id: string): KnowledgeRecommendation | undefined {
    const recommendation = this.activeRecommendations.get(id);

    if (recommendation && !recommendation.applied) {
      recommendation.applied = true;

      // Emit recommendation applied event
      this.eventEmitter.emit(RecommendationEvent.RECOMMENDATION_APPLIED, recommendation);
    }

    return recommendation;
  }

  /**
   * Dismiss a recommendation
   */
  dismissRecommendation(id: string): boolean {
    const recommendation = this.activeRecommendations.get(id);

    if (recommendation && !recommendation.dismissed) {
      recommendation.dismissed = true;

      // Emit recommendation dismissed event
      this.eventEmitter.emit(RecommendationEvent.RECOMMENDATION_DISMISSED, recommendation);

      return true;
    }

    return false;
  }

  /**
   * Provide feedback for a recommendation
   */
  provideFeedback(
    id: string,
    rating: number,
    comment?: string
  ): KnowledgeRecommendation | undefined {
    const recommendation = this.activeRecommendations.get(id);

    if (recommendation) {
      recommendation.feedback = {
        rating,
        comment,
        timestamp: new Date(),
      };

      // Emit recommendation feedback event
      this.eventEmitter.emit(RecommendationEvent.RECOMMENDATION_FEEDBACK, {
        recommendation,
        rating,
        comment,
      });

      // Add feedback to analyzer if learning is enabled
      if (this.config.learnFromFeedback) {
        this.feedbackAnalyzer.addFeedback(recommendation, rating, comment);
      }
    }

    return recommendation;
  }

  /**
   * Clear all active recommendations
   */
  clearRecommendations(): void {
    this.activeRecommendations.clear();
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<RecommendationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * Update adaptive scoring configuration
   */
  updateAdaptiveScoringConfig(config: Partial<AdaptiveScoringConfig>): void {
    this.adaptiveScoringConfig = {
      ...this.adaptiveScoringConfig,
      ...config,
    };

    // Update adaptive scoring
    this.adaptiveScoring.updateConfig(config);
  }

  /**
   * Get feedback analyzer
   */
  getFeedbackAnalyzer(): FeedbackAnalyzer {
    return this.feedbackAnalyzer;
  }

  /**
   * Get adaptive scoring
   */
  getAdaptiveScoring(): AdaptiveScoring {
    return this.adaptiveScoring;
  }

  /**
   * Get template repository
   */
  getTemplateRepository(): TemplateRepository {
    return this.templateRepository;
  }

  /**
   * Analyze feedback
   */
  analyzeFeedback() {
    return this.feedbackAnalyzer.analyzeFeedback();
  }

  /**
   * Subscribe to recommendation events
   */
  on(event: RecommendationEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from recommendation events
   */
  off(event: RecommendationEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }

  /**
   * Find relevant knowledge based on context analysis
   */
  private async findRelevantKnowledge(
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): Promise<Knowledge[]> {
    // Build query based on analysis
    const query: any = {
      type: this.config.enabledKnowledgeTypes,
    };

    // Add language filter if detected
    if (analysis.language) {
      query.language = analysis.language;
    }

    // Add search term from keywords
    if (analysis.keywords.length > 0) {
      query.searchTerm = analysis.keywords.join(' ');
    }

    // Query knowledge storage
    const result = await this.storage.queryKnowledge(query);

    return result.knowledge;
  }

  /**
   * Create recommendations from relevant knowledge
   */
  private createRecommendations(
    knowledgeEntities: Knowledge[],
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): KnowledgeRecommendation[] {
    const recommendations: KnowledgeRecommendation[] = [];

    for (const knowledge of knowledgeEntities) {
      // Use strategy manager to create recommendation
      const recommendation = this.strategyManager.createRecommendation(
        knowledge,
        analysis,
        context
      );

      // Skip if no recommendation created
      if (!recommendation) {
        continue;
      }

      // Apply adaptive scoring if enabled
      if (this.adaptiveScoringConfig.enabled) {
        const baseScore = recommendation.relevanceScore;
        const adjustedScore = this.adaptiveScoring.applyAdjustmentFactors(
          baseScore,
          knowledge,
          analysis,
          context
        );

        // Update relevance score
        recommendation.relevanceScore = adjustedScore;

        // Update relevance level based on new score
        if (adjustedScore >= 0.9) {
          recommendation.relevanceLevel = 'CRITICAL';
        } else if (adjustedScore >= 0.75) {
          recommendation.relevanceLevel = 'HIGH';
        } else if (adjustedScore >= 0.5) {
          recommendation.relevanceLevel = 'MEDIUM';
        } else {
          recommendation.relevanceLevel = 'LOW';
        }
      }

      // Skip if below minimum relevance score
      if (recommendation.relevanceScore < this.config.minRelevanceScore) {
        continue;
      }

      recommendations.push(recommendation);
    }

    // Sort by relevance score (highest first)
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Limit to maximum number of recommendations
    return recommendations.slice(0, this.config.maxRecommendations);
  }

  /**
   * Filter recommendations based on filter criteria
   */
  private filterRecommendations(
    recommendations: KnowledgeRecommendation[],
    filter: RecommendationFilter
  ): KnowledgeRecommendation[] {
    let filtered = recommendations;

    // Filter by knowledge type
    if (filter.knowledgeTypes && filter.knowledgeTypes.length > 0) {
      filtered = filtered.filter(r => filter.knowledgeTypes!.includes(r.knowledge.type));
    }

    // Filter by relevance level
    if (filter.relevanceLevels && filter.relevanceLevels.length > 0) {
      filtered = filtered.filter(r => filter.relevanceLevels!.includes(r.relevanceLevel));
    }

    // Filter by minimum relevance score
    if (filter.minRelevanceScore !== undefined) {
      filtered = filtered.filter(r => r.relevanceScore >= filter.minRelevanceScore!);
    }

    // Filter by context
    if (filter.contexts && filter.contexts.length > 0) {
      filtered = filtered.filter(r => filter.contexts!.includes(r.context));
    }

    // Filter by trigger
    if (filter.triggers && filter.triggers.length > 0) {
      filtered = filtered.filter(r => filter.triggers!.includes(r.trigger));
    }

    // Filter by viewed status
    if (filter.viewed !== undefined) {
      filtered = filtered.filter(r => r.viewed === filter.viewed);
    }

    // Filter by applied status
    if (filter.applied !== undefined) {
      filtered = filtered.filter(r => r.applied === filter.applied);
    }

    // Filter by dismissed status
    if (filter.dismissed !== undefined) {
      filtered = filtered.filter(r => r.dismissed === filter.dismissed);
    }

    // Apply limit
    if (filter.limit !== undefined) {
      filtered = filtered.slice(0, filter.limit);
    }

    return filtered;
  }
}
