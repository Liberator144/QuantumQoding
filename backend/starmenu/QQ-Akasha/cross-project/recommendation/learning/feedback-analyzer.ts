/**
 * Feedback Analyzer for Predictive Knowledge Recommendation
 * Analyzes user feedback to improve recommendation quality
 */

import { EventEmitter } from 'events';
import { KnowledgeRecommendation, RecommendationContext, RecommendationTrigger } from '../types';
import { Knowledge, KnowledgeType } from '../../types';

/**
 * Feedback analysis result
 */
export interface FeedbackAnalysisResult {
  /** Overall feedback score (0-1) */
  overallScore: number;

  /** Feedback scores by knowledge type */
  scoresByKnowledgeType: Record<KnowledgeType, number>;

  /** Feedback scores by context */
  scoresByContext: Record<RecommendationContext, number>;

  /** Feedback scores by trigger */
  scoresByTrigger: Record<RecommendationTrigger, number>;

  /** Feedback scores by relevance level */
  scoresByRelevanceLevel: Record<string, number>;

  /** Common keywords in positive feedback */
  positiveKeywords: string[];

  /** Common keywords in negative feedback */
  negativeKeywords: string[];

  /** Insights from feedback analysis */
  insights: string[];

  /** Recommendations for improvement */
  recommendations: string[];
}

/**
 * Feedback entry
 */
export interface FeedbackEntry {
  /** Recommendation that received feedback */
  recommendation: KnowledgeRecommendation;

  /** Rating (1-5) */
  rating: number;

  /** Comment */
  comment?: string;

  /** When the feedback was provided */
  timestamp: Date;
}

/**
 * Events emitted by the feedback analyzer
 */
export enum FeedbackEvent {
  FEEDBACK_ADDED = 'feedback-added',
  ANALYSIS_COMPLETED = 'analysis-completed',
  INSIGHTS_GENERATED = 'insights-generated',
}

/**
 * Analyzes user feedback to improve recommendation quality
 */
export class FeedbackAnalyzer {
  private feedbackEntries: FeedbackEntry[] = [];
  private eventEmitter: EventEmitter;
  private lastAnalysisResult: FeedbackAnalysisResult | null = null;

  constructor() {
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Add feedback entry
   */
  addFeedback(recommendation: KnowledgeRecommendation, rating: number, comment?: string): void {
    const entry: FeedbackEntry = {
      recommendation,
      rating,
      comment,
      timestamp: new Date(),
    };

    this.feedbackEntries.push(entry);

    // Emit feedback added event
    this.eventEmitter.emit(FeedbackEvent.FEEDBACK_ADDED, entry);
  }

  /**
   * Get all feedback entries
   */
  getAllFeedback(): FeedbackEntry[] {
    return [...this.feedbackEntries];
  }

  /**
   * Get feedback for a specific recommendation
   */
  getFeedbackForRecommendation(recommendationId: string): FeedbackEntry[] {
    return this.feedbackEntries.filter(entry => entry.recommendation.id === recommendationId);
  }

  /**
   * Get feedback for a specific knowledge entity
   */
  getFeedbackForKnowledge(knowledgeId: string): FeedbackEntry[] {
    return this.feedbackEntries.filter(entry => entry.recommendation.knowledge.id === knowledgeId);
  }

  /**
   * Analyze feedback
   */
  analyzeFeedback(): FeedbackAnalysisResult {
    // Skip if no feedback
    if (this.feedbackEntries.length === 0) {
      return this.createEmptyAnalysisResult();
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore();

    // Calculate scores by knowledge type
    const scoresByKnowledgeType = this.calculateScoresByKnowledgeType();

    // Calculate scores by context
    const scoresByContext = this.calculateScoresByContext();

    // Calculate scores by trigger
    const scoresByTrigger = this.calculateScoresByTrigger();

    // Calculate scores by relevance level
    const scoresByRelevanceLevel = this.calculateScoresByRelevanceLevel();

    // Extract keywords from feedback
    const { positiveKeywords, negativeKeywords } = this.extractKeywordsFromFeedback();

    // Generate insights
    const insights = this.generateInsights(
      overallScore,
      scoresByKnowledgeType,
      scoresByContext,
      scoresByTrigger,
      scoresByRelevanceLevel
    );

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      overallScore,
      scoresByKnowledgeType,
      scoresByContext,
      scoresByTrigger,
      scoresByRelevanceLevel,
      positiveKeywords,
      negativeKeywords
    );

    // Create analysis result
    const result: FeedbackAnalysisResult = {
      overallScore,
      scoresByKnowledgeType,
      scoresByContext,
      scoresByTrigger,
      scoresByRelevanceLevel,
      positiveKeywords,
      negativeKeywords,
      insights,
      recommendations,
    };

    // Store analysis result
    this.lastAnalysisResult = result;

    // Emit analysis completed event
    this.eventEmitter.emit(FeedbackEvent.ANALYSIS_COMPLETED, result);

    return result;
  }

  /**
   * Get last analysis result
   */
  getLastAnalysisResult(): FeedbackAnalysisResult | null {
    return this.lastAnalysisResult;
  }

  /**
   * Create empty analysis result
   */
  private createEmptyAnalysisResult(): FeedbackAnalysisResult {
    return {
      overallScore: 0,
      scoresByKnowledgeType: {} as Record<KnowledgeType, number>,
      scoresByContext: {} as Record<RecommendationContext, number>,
      scoresByTrigger: {} as Record<RecommendationTrigger, number>,
      scoresByRelevanceLevel: {},
      positiveKeywords: [],
      negativeKeywords: [],
      insights: ['No feedback data available for analysis.'],
      recommendations: ['Collect more feedback to generate recommendations.'],
    };
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(): number {
    const totalRating = this.feedbackEntries.reduce((sum, entry) => sum + entry.rating, 0);

    return totalRating / (this.feedbackEntries.length * 5); // Normalize to 0-1
  }

  /**
   * Calculate scores by knowledge type
   */
  private calculateScoresByKnowledgeType(): Record<KnowledgeType, number> {
    const scores: Record<KnowledgeType, { total: number; count: number }> = {} as any;

    // Calculate total rating and count for each knowledge type
    for (const entry of this.feedbackEntries) {
      const type = entry.recommendation.knowledge.type;

      if (!scores[type]) {
        scores[type] = { total: 0, count: 0 };
      }

      scores[type].total += entry.rating;
      scores[type].count++;
    }

    // Calculate average score for each knowledge type
    const result: Record<KnowledgeType, number> = {} as any;

    for (const [type, { total, count }] of Object.entries(scores)) {
      result[type as KnowledgeType] = total / (count * 5); // Normalize to 0-1
    }

    return result;
  }

  /**
   * Calculate scores by context
   */
  private calculateScoresByContext(): Record<RecommendationContext, number> {
    const scores: Record<RecommendationContext, { total: number; count: number }> = {} as any;

    // Calculate total rating and count for each context
    for (const entry of this.feedbackEntries) {
      const context = entry.recommendation.context;

      if (!scores[context]) {
        scores[context] = { total: 0, count: 0 };
      }

      scores[context].total += entry.rating;
      scores[context].count++;
    }

    // Calculate average score for each context
    const result: Record<RecommendationContext, number> = {} as any;

    for (const [context, { total, count }] of Object.entries(scores)) {
      result[context as RecommendationContext] = total / (count * 5); // Normalize to 0-1
    }

    return result;
  }

  /**
   * Calculate scores by trigger
   */
  private calculateScoresByTrigger(): Record<RecommendationTrigger, number> {
    const scores: Record<RecommendationTrigger, { total: number; count: number }> = {} as any;

    // Calculate total rating and count for each trigger
    for (const entry of this.feedbackEntries) {
      const trigger = entry.recommendation.trigger;

      if (!scores[trigger]) {
        scores[trigger] = { total: 0, count: 0 };
      }

      scores[trigger].total += entry.rating;
      scores[trigger].count++;
    }

    // Calculate average score for each trigger
    const result: Record<RecommendationTrigger, number> = {} as any;

    for (const [trigger, { total, count }] of Object.entries(scores)) {
      result[trigger as RecommendationTrigger] = total / (count * 5); // Normalize to 0-1
    }

    return result;
  }

  /**
   * Calculate scores by relevance level
   */
  private calculateScoresByRelevanceLevel(): Record<string, number> {
    const scores: Record<string, { total: number; count: number }> = {};

    // Calculate total rating and count for each relevance level
    for (const entry of this.feedbackEntries) {
      const level = entry.recommendation.relevanceLevel;

      if (!scores[level]) {
        scores[level] = { total: 0, count: 0 };
      }

      scores[level].total += entry.rating;
      scores[level].count++;
    }

    // Calculate average score for each relevance level
    const result: Record<string, number> = {};

    for (const [level, { total, count }] of Object.entries(scores)) {
      result[level] = total / (count * 5); // Normalize to 0-1
    }

    return result;
  }

  /**
   * Extract keywords from feedback
   */
  private extractKeywordsFromFeedback(): {
    positiveKeywords: string[];
    negativeKeywords: string[];
  } {
    const positiveComments = this.feedbackEntries
      .filter(entry => entry.rating >= 4 && entry.comment)
      .map(entry => entry.comment!);

    const negativeComments = this.feedbackEntries
      .filter(entry => entry.rating <= 2 && entry.comment)
      .map(entry => entry.comment!);

    // Extract keywords from positive comments
    const positiveKeywords = this.extractKeywords(positiveComments);

    // Extract keywords from negative comments
    const negativeKeywords = this.extractKeywords(negativeComments);

    return { positiveKeywords, negativeKeywords };
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(texts: string[]): string[] {
    if (texts.length === 0) {
      return [];
    }

    // Combine all texts
    const combinedText = texts.join(' ').toLowerCase();

    // Split into words
    const words = combinedText
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    for (const word of words) {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    }

    // Sort by frequency
    const sortedWords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([word]) => word);

    // Return top keywords
    return sortedWords.slice(0, 10);
  }

  /**
   * Generate insights from analysis
   */
  private generateInsights(
    overallScore: number,
    scoresByKnowledgeType: Record<KnowledgeType, number>,
    scoresByContext: Record<RecommendationContext, number>,
    scoresByTrigger: Record<RecommendationTrigger, number>,
    scoresByRelevanceLevel: Record<string, number>
  ): string[] {
    const insights: string[] = [];

    // Overall score insight
    if (overallScore >= 0.8) {
      insights.push(
        `Overall recommendation quality is excellent (${(overallScore * 100).toFixed(1)}%).`
      );
    } else if (overallScore >= 0.6) {
      insights.push(
        `Overall recommendation quality is good (${(overallScore * 100).toFixed(1)}%).`
      );
    } else if (overallScore >= 0.4) {
      insights.push(
        `Overall recommendation quality is average (${(overallScore * 100).toFixed(1)}%).`
      );
    } else {
      insights.push(
        `Overall recommendation quality is poor (${(overallScore * 100).toFixed(1)}%).`
      );
    }

    // Knowledge type insights
    const knowledgeTypeEntries = Object.entries(scoresByKnowledgeType);
    if (knowledgeTypeEntries.length > 0) {
      const bestType = knowledgeTypeEntries.reduce(
        (best, current) => (current[1] > best[1] ? current : best),
        knowledgeTypeEntries[0]
      );

      const worstType = knowledgeTypeEntries.reduce(
        (worst, current) => (current[1] < worst[1] ? current : worst),
        knowledgeTypeEntries[0]
      );

      insights.push(
        `${bestType[0]} recommendations are the most effective (${(bestType[1] * 100).toFixed(1)}%).`
      );

      if (worstType[1] < 0.6) {
        insights.push(
          `${worstType[0]} recommendations need improvement (${(worstType[1] * 100).toFixed(1)}%).`
        );
      }
    }

    // Context insights
    const contextEntries = Object.entries(scoresByContext);
    if (contextEntries.length > 0) {
      const bestContext = contextEntries.reduce(
        (best, current) => (current[1] > best[1] ? current : best),
        contextEntries[0]
      );

      const worstContext = contextEntries.reduce(
        (worst, current) => (current[1] < worst[1] ? current : worst),
        contextEntries[0]
      );

      insights.push(
        `Recommendations in ${bestContext[0]} context are the most effective (${(bestContext[1] * 100).toFixed(1)}%).`
      );

      if (worstContext[1] < 0.6) {
        insights.push(
          `Recommendations in ${worstContext[0]} context need improvement (${(worstContext[1] * 100).toFixed(1)}%).`
        );
      }
    }

    // Trigger insights
    const triggerEntries = Object.entries(scoresByTrigger);
    if (triggerEntries.length > 0) {
      const bestTrigger = triggerEntries.reduce(
        (best, current) => (current[1] > best[1] ? current : best),
        triggerEntries[0]
      );

      const worstTrigger = triggerEntries.reduce(
        (worst, current) => (current[1] < worst[1] ? current : worst),
        triggerEntries[0]
      );

      insights.push(
        `Recommendations triggered by ${bestTrigger[0]} are the most effective (${(bestTrigger[1] * 100).toFixed(1)}%).`
      );

      if (worstTrigger[1] < 0.6) {
        insights.push(
          `Recommendations triggered by ${worstTrigger[0]} need improvement (${(worstTrigger[1] * 100).toFixed(1)}%).`
        );
      }
    }

    // Relevance level insights
    const relevanceLevelEntries = Object.entries(scoresByRelevanceLevel);
    if (relevanceLevelEntries.length > 0) {
      const highLevelScore =
        scoresByRelevanceLevel['HIGH'] || scoresByRelevanceLevel['CRITICAL'] || 0;
      const lowLevelScore = scoresByRelevanceLevel['LOW'] || scoresByRelevanceLevel['MEDIUM'] || 0;

      if (highLevelScore > lowLevelScore) {
        insights.push(`High relevance recommendations are more effective than low relevance ones.`);
      } else if (lowLevelScore > highLevelScore) {
        insights.push(
          `Low relevance recommendations are surprisingly more effective than high relevance ones.`
        );
      }
    }

    // Emit insights generated event
    this.eventEmitter.emit(FeedbackEvent.INSIGHTS_GENERATED, insights);

    return insights;
  }

  /**
   * Generate recommendations for improvement
   */
  private generateRecommendations(
    overallScore: number,
    scoresByKnowledgeType: Record<KnowledgeType, number>,
    scoresByContext: Record<RecommendationContext, number>,
    scoresByTrigger: Record<RecommendationTrigger, number>,
    scoresByRelevanceLevel: Record<string, number>,
    positiveKeywords: string[],
    negativeKeywords: string[]
  ): string[] {
    const recommendations: string[] = [];

    // Overall recommendations
    if (overallScore < 0.6) {
      recommendations.push(
        `Improve overall recommendation quality through better relevance scoring.`
      );
    }

    // Knowledge type recommendations
    const knowledgeTypeEntries = Object.entries(scoresByKnowledgeType);
    for (const [type, score] of knowledgeTypeEntries) {
      if (score < 0.6) {
        recommendations.push(`Improve ${type} recommendations through better matching algorithms.`);
      }
    }

    // Context recommendations
    const contextEntries = Object.entries(scoresByContext);
    for (const [context, score] of contextEntries) {
      if (score < 0.6) {
        recommendations.push(
          `Improve recommendations in ${context} context through better context detection.`
        );
      }
    }

    // Trigger recommendations
    const triggerEntries = Object.entries(scoresByTrigger);
    for (const [trigger, score] of triggerEntries) {
      if (score < 0.6) {
        recommendations.push(
          `Improve recommendations triggered by ${trigger} through better trigger handling.`
        );
      }
    }

    // Keyword-based recommendations
    if (positiveKeywords.length > 0) {
      recommendations.push(
        `Focus on recommendations related to: ${positiveKeywords.slice(0, 5).join(', ')}.`
      );
    }

    if (negativeKeywords.length > 0) {
      recommendations.push(
        `Avoid or improve recommendations related to: ${negativeKeywords.slice(0, 5).join(', ')}.`
      );
    }

    return recommendations;
  }

  /**
   * Subscribe to feedback events
   */
  on(event: FeedbackEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from feedback events
   */
  off(event: FeedbackEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
