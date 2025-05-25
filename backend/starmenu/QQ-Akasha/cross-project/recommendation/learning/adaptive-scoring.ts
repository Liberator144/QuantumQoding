/**
 * Adaptive Scoring for Predictive Knowledge Recommendation
 * Adjusts recommendation scoring based on user feedback
 */

import {
  DeveloperContext,
  KnowledgeRecommendation,
  RecommendationContext,
  RecommendationTrigger,
} from '../types';
import { ContextAnalysisResult } from '../context-analyzer';
import { Knowledge, KnowledgeType } from '../../types';
import { FeedbackAnalyzer, FeedbackAnalysisResult, FeedbackEvent } from './feedback-analyzer';

/**
 * Scoring adjustment factors
 */
export interface ScoringAdjustmentFactors {
  /** Adjustment for knowledge type */
  knowledgeTypeFactors: Record<KnowledgeType, number>;

  /** Adjustment for context */
  contextFactors: Record<RecommendationContext, number>;

  /** Adjustment for trigger */
  triggerFactors: Record<RecommendationTrigger, number>;

  /** Adjustment for language match */
  languageMatchFactor: number;

  /** Adjustment for framework match */
  frameworkMatchFactor: number;

  /** Adjustment for pattern match */
  patternMatchFactor: number;

  /** Adjustment for keyword match */
  keywordMatchFactor: number;

  /** Adjustment for error match */
  errorMatchFactor: number;

  /** Adjustment for code similarity */
  codeSimilarityFactor: number;
}

/**
 * Default scoring adjustment factors
 */
export const DEFAULT_SCORING_ADJUSTMENT_FACTORS: ScoringAdjustmentFactors = {
  knowledgeTypeFactors: {
    CODE_PATTERN: 1.0,
    BEST_PRACTICE: 1.0,
    SOLUTION: 1.0,
    ARCHITECTURE: 1.0,
    ALGORITHM: 1.0,
  } as Record<KnowledgeType, number>,

  contextFactors: {
    CODE_EDITING: 1.0,
    DEBUGGING: 1.0,
    ARCHITECTURE: 1.0,
    TESTING: 1.0,
    DOCUMENTATION: 1.0,
    PERFORMANCE: 1.0,
    SECURITY: 1.0,
    GENERAL: 1.0,
  } as Record<RecommendationContext, number>,

  triggerFactors: {
    FILE_EDIT: 1.0,
    FILE_CREATE: 1.0,
    FILE_VIEW: 1.0,
    COMMAND_RUN: 1.0,
    ERROR_ENCOUNTER: 1.0,
    SEARCH: 1.0,
    PERIODIC: 1.0,
    MANUAL: 1.0,
    CUSTOM: 1.0,
  } as Record<RecommendationTrigger, number>,

  languageMatchFactor: 1.0,
  frameworkMatchFactor: 1.0,
  patternMatchFactor: 1.0,
  keywordMatchFactor: 1.0,
  errorMatchFactor: 1.0,
  codeSimilarityFactor: 1.0,
};

/**
 * Adaptive scoring configuration
 */
export interface AdaptiveScoringConfig {
  /** Whether adaptive scoring is enabled */
  enabled: boolean;

  /** Learning rate (0-1) */
  learningRate: number;

  /** Minimum adjustment factor */
  minAdjustmentFactor: number;

  /** Maximum adjustment factor */
  maxAdjustmentFactor: number;

  /** Minimum feedback entries required for adaptation */
  minFeedbackEntries: number;

  /** Whether to adapt based on knowledge type */
  adaptKnowledgeType: boolean;

  /** Whether to adapt based on context */
  adaptContext: boolean;

  /** Whether to adapt based on trigger */
  adaptTrigger: boolean;

  /** Whether to adapt based on matching factors */
  adaptMatchingFactors: boolean;
}

/**
 * Default adaptive scoring configuration
 */
export const DEFAULT_ADAPTIVE_SCORING_CONFIG: AdaptiveScoringConfig = {
  enabled: true,
  learningRate: 0.1,
  minAdjustmentFactor: 0.5,
  maxAdjustmentFactor: 2.0,
  minFeedbackEntries: 10,
  adaptKnowledgeType: true,
  adaptContext: true,
  adaptTrigger: true,
  adaptMatchingFactors: true,
};

/**
 * Adjusts recommendation scoring based on user feedback
 */
export class AdaptiveScoring {
  private feedbackAnalyzer: FeedbackAnalyzer;
  private adjustmentFactors: ScoringAdjustmentFactors;
  private config: AdaptiveScoringConfig;

  constructor(feedbackAnalyzer: FeedbackAnalyzer, config: Partial<AdaptiveScoringConfig> = {}) {
    this.feedbackAnalyzer = feedbackAnalyzer;
    this.adjustmentFactors = { ...DEFAULT_SCORING_ADJUSTMENT_FACTORS };
    this.config = {
      ...DEFAULT_ADAPTIVE_SCORING_CONFIG,
      ...config,
    };

    // Set up event listeners
    this.setupEventListeners();
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Listen for analysis completed event
    this.feedbackAnalyzer.on(
      FeedbackEvent.ANALYSIS_COMPLETED,
      this.handleAnalysisCompleted.bind(this)
    );
  }

  /**
   * Handle analysis completed event
   */
  private handleAnalysisCompleted(analysisResult: FeedbackAnalysisResult): void {
    // Skip if adaptive scoring is disabled
    if (!this.config.enabled) {
      return;
    }

    // Skip if not enough feedback entries
    if (this.feedbackAnalyzer.getAllFeedback().length < this.config.minFeedbackEntries) {
      return;
    }

    // Update adjustment factors
    this.updateAdjustmentFactors(analysisResult);
  }

  /**
   * Update adjustment factors based on analysis result
   */
  private updateAdjustmentFactors(analysisResult: FeedbackAnalysisResult): void {
    // Update knowledge type factors
    if (this.config.adaptKnowledgeType) {
      for (const [type, score] of Object.entries(analysisResult.scoresByKnowledgeType)) {
        this.updateFactor('knowledgeTypeFactors', type as KnowledgeType, score);
      }
    }

    // Update context factors
    if (this.config.adaptContext) {
      for (const [context, score] of Object.entries(analysisResult.scoresByContext)) {
        this.updateFactor('contextFactors', context as RecommendationContext, score);
      }
    }

    // Update trigger factors
    if (this.config.adaptTrigger) {
      for (const [trigger, score] of Object.entries(analysisResult.scoresByTrigger)) {
        this.updateFactor('triggerFactors', trigger as RecommendationTrigger, score);
      }
    }

    // Update matching factors based on keywords
    if (this.config.adaptMatchingFactors) {
      // Positive keywords indicate good matching
      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('language') || keyword.includes('code') || keyword.includes('syntax')
        )
      ) {
        this.adjustmentFactors.languageMatchFactor = this.adjustFactor(
          this.adjustmentFactors.languageMatchFactor,
          0.1
        );
      }

      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('framework') ||
            keyword.includes('library') ||
            keyword.includes('react') ||
            keyword.includes('angular') ||
            keyword.includes('vue')
        )
      ) {
        this.adjustmentFactors.frameworkMatchFactor = this.adjustFactor(
          this.adjustmentFactors.frameworkMatchFactor,
          0.1
        );
      }

      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('pattern') ||
            keyword.includes('design') ||
            keyword.includes('architecture')
        )
      ) {
        this.adjustmentFactors.patternMatchFactor = this.adjustFactor(
          this.adjustmentFactors.patternMatchFactor,
          0.1
        );
      }

      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('keyword') || keyword.includes('search') || keyword.includes('find')
        )
      ) {
        this.adjustmentFactors.keywordMatchFactor = this.adjustFactor(
          this.adjustmentFactors.keywordMatchFactor,
          0.1
        );
      }

      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('error') ||
            keyword.includes('exception') ||
            keyword.includes('bug') ||
            keyword.includes('fix')
        )
      ) {
        this.adjustmentFactors.errorMatchFactor = this.adjustFactor(
          this.adjustmentFactors.errorMatchFactor,
          0.1
        );
      }

      if (
        analysisResult.positiveKeywords.some(
          keyword =>
            keyword.includes('similar') || keyword.includes('like') || keyword.includes('same')
        )
      ) {
        this.adjustmentFactors.codeSimilarityFactor = this.adjustFactor(
          this.adjustmentFactors.codeSimilarityFactor,
          0.1
        );
      }

      // Negative keywords indicate poor matching
      if (
        analysisResult.negativeKeywords.some(
          keyword =>
            keyword.includes('language') || keyword.includes('code') || keyword.includes('syntax')
        )
      ) {
        this.adjustmentFactors.languageMatchFactor = this.adjustFactor(
          this.adjustmentFactors.languageMatchFactor,
          -0.1
        );
      }

      if (
        analysisResult.negativeKeywords.some(
          keyword =>
            keyword.includes('framework') ||
            keyword.includes('library') ||
            keyword.includes('react') ||
            keyword.includes('angular') ||
            keyword.includes('vue')
        )
      ) {
        this.adjustmentFactors.frameworkMatchFactor = this.adjustFactor(
          this.adjustmentFactors.frameworkMatchFactor,
          -0.1
        );
      }
    }
  }

  /**
   * Update a specific factor
   */
  private updateFactor<T extends keyof ScoringAdjustmentFactors>(
    factorType: T,
    key: keyof ScoringAdjustmentFactors[T],
    score: number
  ): void {
    // Skip if factor doesn't exist
    if (!(key in this.adjustmentFactors[factorType])) {
      return;
    }

    // Calculate adjustment
    const currentFactor = (this.adjustmentFactors[factorType] as any)[key];
    const targetFactor = score * 2; // Convert 0-1 score to 0-2 factor
    const adjustment = (targetFactor - currentFactor) * this.config.learningRate;

    // Apply adjustment
    (this.adjustmentFactors[factorType] as any)[key] = this.adjustFactor(currentFactor, adjustment);
  }

  /**
   * Adjust a factor value
   */
  private adjustFactor(currentFactor: number, adjustment: number): number {
    const newFactor = currentFactor + adjustment;

    // Clamp to min/max range
    return Math.max(
      this.config.minAdjustmentFactor,
      Math.min(this.config.maxAdjustmentFactor, newFactor)
    );
  }

  /**
   * Apply adjustment factors to a relevance score
   */
  applyAdjustmentFactors(
    baseScore: number,
    knowledge: Knowledge,
    analysis: ContextAnalysisResult,
    context: DeveloperContext
  ): number {
    // Skip if adaptive scoring is disabled
    if (!this.config.enabled) {
      return baseScore;
    }

    let adjustedScore = baseScore;

    // Apply knowledge type factor
    if (this.adjustmentFactors.knowledgeTypeFactors[knowledge.type]) {
      adjustedScore *= this.adjustmentFactors.knowledgeTypeFactors[knowledge.type];
    }

    // Apply context factor
    if (this.adjustmentFactors.contextFactors[analysis.context]) {
      adjustedScore *= this.adjustmentFactors.contextFactors[analysis.context];
    }

    // Apply trigger factor
    if (this.adjustmentFactors.triggerFactors[analysis.trigger]) {
      adjustedScore *= this.adjustmentFactors.triggerFactors[analysis.trigger];
    }

    // Clamp to 0-1 range
    return Math.max(0, Math.min(1, adjustedScore));
  }

  /**
   * Get current adjustment factors
   */
  getAdjustmentFactors(): ScoringAdjustmentFactors {
    return { ...this.adjustmentFactors };
  }

  /**
   * Set adjustment factors
   */
  setAdjustmentFactors(factors: Partial<ScoringAdjustmentFactors>): void {
    this.adjustmentFactors = {
      ...this.adjustmentFactors,
      ...factors,
    };
  }

  /**
   * Reset adjustment factors to defaults
   */
  resetAdjustmentFactors(): void {
    this.adjustmentFactors = { ...DEFAULT_SCORING_ADJUSTMENT_FACTORS };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AdaptiveScoringConfig>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}
