/**
 * Recommendation Strategy Manager
 * Manages and coordinates different recommendation strategies
 */

import {
  DeveloperContext,
  KnowledgeRecommendation,
  RecommendationContext,
  RecommendationTrigger,
} from '../types';
import { ContextAnalysisResult } from '../context-analyzer';
import { Knowledge, KnowledgeType } from '../../types';
import { RecommendationStrategy } from './base-strategy';
import { CodePatternStrategy } from './code-pattern-strategy';
import { BestPracticeStrategy } from './best-practice-strategy';
import { CodeGenerationStrategy } from './code-generation-strategy';
import { TemplateRepository } from '../code-generation/templates/types';

/**
 * Manages and coordinates different recommendation strategies
 */
export class StrategyManager {
  private strategies: Map<string, RecommendationStrategy>;

  constructor() {
    this.strategies = new Map();

    // Register default strategies
    this.registerDefaultStrategies();
  }

  /**
   * Register default strategies
   */
  private registerDefaultStrategies(): void {
    // Register code pattern strategy
    this.registerStrategy(new CodePatternStrategy());

    // Register best practice strategy
    this.registerStrategy(new BestPracticeStrategy());
  }

  /**
   * Register code generation strategy
   */
  registerCodeGenerationStrategy(templateRepository: TemplateRepository): void {
    // Register code generation strategy
    this.registerStrategy(new CodeGenerationStrategy(templateRepository));
  }

  /**
   * Register a strategy
   */
  registerStrategy(strategy: RecommendationStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  /**
   * Unregister a strategy
   */
  unregisterStrategy(strategyId: string): boolean {
    return this.strategies.delete(strategyId);
  }

  /**
   * Get a strategy by ID
   */
  getStrategy(strategyId: string): RecommendationStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  /**
   * Get all strategies
   */
  getAllStrategies(): RecommendationStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Find strategies for a knowledge type
   */
  findStrategiesForKnowledgeType(type: KnowledgeType): RecommendationStrategy[] {
    return Array.from(this.strategies.values()).filter(strategy =>
      strategy.canHandleKnowledgeType(type)
    );
  }

  /**
   * Find strategies for a context
   */
  findStrategiesForContext(context: RecommendationContext): RecommendationStrategy[] {
    return Array.from(this.strategies.values()).filter(strategy =>
      strategy.canHandleContext(context)
    );
  }

  /**
   * Find strategies for a trigger
   */
  findStrategiesForTrigger(trigger: RecommendationTrigger): RecommendationStrategy[] {
    return Array.from(this.strategies.values()).filter(strategy =>
      strategy.canHandleTrigger(trigger)
    );
  }

  /**
   * Find the best strategy for a knowledge entity
   */
  findBestStrategyForKnowledge(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult
  ): RecommendationStrategy | undefined {
    // Find strategies that can handle this knowledge type
    const typeStrategies = this.findStrategiesForKnowledgeType(knowledge.type);

    // If no strategies found, return undefined
    if (typeStrategies.length === 0) {
      return undefined;
    }

    // Find strategies that can handle this context
    const contextStrategies = typeStrategies.filter(strategy =>
      strategy.canHandleContext(analysis.context)
    );

    // If no context strategies found, use type strategies
    const candidateStrategies = contextStrategies.length > 0 ? contextStrategies : typeStrategies;

    // Find strategies that can handle this trigger
    const triggerStrategies = candidateStrategies.filter(strategy =>
      strategy.canHandleTrigger(analysis.trigger)
    );

    // If no trigger strategies found, use candidate strategies
    const finalCandidates = triggerStrategies.length > 0 ? triggerStrategies : candidateStrategies;

    // If only one strategy found, return it
    if (finalCandidates.length === 1) {
      return finalCandidates[0];
    }

    // If multiple strategies found, return the first one
    // In a real implementation, we would use a more sophisticated selection algorithm
    return finalCandidates[0];
  }

  /**
   * Calculate relevance score for a knowledge entity
   */
  calculateRelevanceScore(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): number {
    // Find the best strategy for this knowledge
    const strategy = this.findBestStrategyForKnowledge(knowledge, analysis);

    // If no strategy found, return 0
    if (!strategy) {
      return 0;
    }

    // Calculate relevance score using the strategy
    return strategy.calculateRelevanceScore(knowledge, analysis, context);
  }

  /**
   * Generate recommendation reason
   */
  generateRecommendationReason(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): string {
    // Find the best strategy for this knowledge
    const strategy = this.findBestStrategyForKnowledge(knowledge, analysis);

    // If no strategy found, return a generic reason
    if (!strategy) {
      return `This ${knowledge.type.toLowerCase().replace('_', ' ')} may be relevant to your current task.`;
    }

    // Generate reason using the strategy
    return strategy.generateRecommendationReason(knowledge, analysis, context);
  }

  /**
   * Generate application method
   */
  generateApplicationMethod(
    knowledge: Knowledge,
    context: DeveloperContext,
    analysis: ContextAnalysisResult
  ): KnowledgeRecommendation['applicationMethod'] | undefined {
    // Find the best strategy for this knowledge
    const strategy = this.findBestStrategyForKnowledge(knowledge, analysis);

    // If no strategy found, return undefined
    if (!strategy) {
      return undefined;
    }

    // Generate application method using the strategy
    return strategy.generateApplicationMethod(knowledge, context);
  }

  /**
   * Create a recommendation
   */
  createRecommendation(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): KnowledgeRecommendation | undefined {
    // Find the best strategy for this knowledge
    const strategy = this.findBestStrategyForKnowledge(knowledge, analysis);

    // If no strategy found, return undefined
    if (!strategy) {
      return undefined;
    }

    // Calculate relevance score
    const relevanceScore = strategy.calculateRelevanceScore(knowledge, analysis, context);

    // Generate reason
    const reason = strategy.generateRecommendationReason(knowledge, analysis, context);

    // Create recommendation
    return strategy.createRecommendation(knowledge, relevanceScore, reason, analysis, context);
  }
}
