/**
 * Base Recommendation Strategy
 * Provides common functionality for all recommendation strategies
 */

import {
  DeveloperContext,
  KnowledgeRecommendation,
  RecommendationContext,
  RecommendationTrigger,
  RelevanceLevel,
} from '../types';
import { ContextAnalysisResult } from '../context-analyzer';
import { Knowledge, KnowledgeType } from '../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Recommendation strategy interface
 */
export interface RecommendationStrategy {
  /** Strategy ID */
  id: string;

  /** Strategy name */
  name: string;

  /** Knowledge types this strategy can recommend */
  supportedKnowledgeTypes: KnowledgeType[];

  /** Recommendation contexts this strategy can handle */
  supportedContexts: RecommendationContext[];

  /** Recommendation triggers this strategy can handle */
  supportedTriggers: RecommendationTrigger[];

  /** Calculate relevance score for a knowledge entity */
  calculateRelevanceScore(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): number;

  /** Generate recommendation reason */
  generateRecommendationReason(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): string;

  /** Generate application method */
  generateApplicationMethod(
    knowledge: Knowledge,
    context: DeveloperContext
  ): KnowledgeRecommendation['applicationMethod'] | undefined;

  /** Check if this strategy can handle a knowledge type */
  canHandleKnowledgeType(type: KnowledgeType): boolean;

  /** Check if this strategy can handle a context */
  canHandleContext(context: RecommendationContext): boolean;

  /** Check if this strategy can handle a trigger */
  canHandleTrigger(trigger: RecommendationTrigger): boolean;
}

/**
 * Abstract base class for recommendation strategies
 */
export abstract class BaseRecommendationStrategy implements RecommendationStrategy {
  id: string;
  name: string;
  supportedKnowledgeTypes: KnowledgeType[];
  supportedContexts: RecommendationContext[];
  supportedTriggers: RecommendationTrigger[];

  constructor(
    id: string,
    name: string,
    supportedKnowledgeTypes: KnowledgeType[],
    supportedContexts: RecommendationContext[],
    supportedTriggers: RecommendationTrigger[]
  ) {
    this.id = id;
    this.name = name;
    this.supportedKnowledgeTypes = supportedKnowledgeTypes;
    this.supportedContexts = supportedContexts;
    this.supportedTriggers = supportedTriggers;
  }

  /**
   * Calculate relevance score for a knowledge entity
   */
  abstract calculateRelevanceScore(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): number;

  /**
   * Generate recommendation reason
   */
  abstract generateRecommendationReason(
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): string;

  /**
   * Generate application method
   */
  abstract generateApplicationMethod(
    knowledge: Knowledge,
    context: DeveloperContext
  ): KnowledgeRecommendation['applicationMethod'] | undefined;

  /**
   * Check if this strategy can handle a knowledge type
   */
  canHandleKnowledgeType(type: KnowledgeType): boolean {
    return this.supportedKnowledgeTypes.includes(type);
  }

  /**
   * Check if this strategy can handle a context
   */
  canHandleContext(context: RecommendationContext): boolean {
    return this.supportedContexts.includes(context);
  }

  /**
   * Check if this strategy can handle a trigger
   */
  canHandleTrigger(trigger: RecommendationTrigger): boolean {
    return this.supportedTriggers.includes(trigger);
  }

  /**
   * Create a recommendation
   */
  createRecommendation(
    knowledge: Knowledge,
    relevanceScore: number,
    reason: string,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): KnowledgeRecommendation {
    // Determine relevance level
    const relevanceLevel = this.determineRelevanceLevel(relevanceScore);

    // Generate application method
    const applicationMethod = this.generateApplicationMethod(knowledge, context);

    // Create recommendation
    return {
      id: uuidv4(),
      knowledge,
      relevanceScore,
      relevanceLevel,
      reason,
      trigger: analysis.trigger,
      context: analysis.context,
      timestamp: new Date(),
      viewed: false,
      applied: false,
      dismissed: false,
      applicationMethod,
    };
  }

  /**
   * Determine relevance level based on score
   */
  protected determineRelevanceLevel(score: number): RelevanceLevel {
    if (score >= 0.9) {
      return RelevanceLevel.CRITICAL;
    } else if (score >= 0.75) {
      return RelevanceLevel.HIGH;
    } else if (score >= 0.5) {
      return RelevanceLevel.MEDIUM;
    } else {
      return RelevanceLevel.LOW;
    }
  }

  /**
   * Calculate text similarity between two strings
   */
  protected calculateTextSimilarity(text1: string, text2: string): number {
    // This is a simplified implementation using Jaccard similarity
    // A real implementation would use more sophisticated NLP techniques

    // Tokenize texts
    const tokens1 = new Set(
      text1
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 3)
    );

    const tokens2 = new Set(
      text2
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(token => token.length > 3)
    );

    // Calculate Jaccard similarity
    const intersection = new Set([...tokens1].filter(token => tokens2.has(token)));

    const union = new Set([...tokens1, ...tokens2]);

    return union.size > 0 ? intersection.size / union.size : 0;
  }
}
