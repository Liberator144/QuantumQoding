/**
 * Recommendation engine for generating context-aware recommendations
 */

import {
  Recommendation,
  RecommendationContext,
  RecommendationOptions,
  RecommendationResult,
  DEFAULT_RECOMMENDATION_OPTIONS,
  RecommendationType,
  RecommendationCategory,
  RecommendationPriority,
} from './types';
import { RecommendationProvider, RecommendationProviderRegistry } from './providers/types';
import { RecommendationFilter } from './filters/types';
import { RecommendationScorer } from './scorers/types';
import { RecommendationPersonalizer } from './personalizers/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Recommendation engine
 */
export class RecommendationEngine {
  private providerRegistry: RecommendationProviderRegistry;
  private filters: RecommendationFilter[] = [];
  private scorers: RecommendationScorer[] = [];
  private personalizers: RecommendationPersonalizer[] = [];

  /**
   * Create a new recommendation engine
   */
  constructor(providerRegistry: RecommendationProviderRegistry) {
    this.providerRegistry = providerRegistry;
  }

  /**
   * Add a recommendation filter
   */
  addFilter(filter: RecommendationFilter): void {
    this.filters.push(filter);
  }

  /**
   * Add a recommendation scorer
   */
  addScorer(scorer: RecommendationScorer): void {
    this.scorers.push(scorer);
  }

  /**
   * Add a recommendation personalizer
   */
  addPersonalizer(personalizer: RecommendationPersonalizer): void {
    this.personalizers.push(personalizer);
  }

  /**
   * Get recommendations
   */
  async getRecommendations(
    context: RecommendationContext,
    options: Partial<RecommendationOptions> = {}
  ): Promise<RecommendationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Merge options with defaults
      const mergedOptions = {
        ...DEFAULT_RECOMMENDATION_OPTIONS,
        ...options,
      };

      // Get recommendations from all providers
      const allRecommendations: Recommendation[] = [];

      for (const provider of this.providerRegistry.getAllProviders()) {
        try {
          const providerRecommendations = await provider.getRecommendations(context);
          allRecommendations.push(...providerRecommendations);
        } catch (error) {
          warnings.push(`Error getting recommendations from provider ${provider.name}: ${error}`);
        }
      }

      // Apply filters
      let filteredRecommendations = allRecommendations;

      for (const filter of this.filters) {
        filteredRecommendations = filter.filter(filteredRecommendations, context);
      }

      // Apply option filters
      if (mergedOptions.filter) {
        filteredRecommendations = this.applyOptionFilters(
          filteredRecommendations,
          mergedOptions.filter
        );
      }

      // Calculate relevance scores
      for (const scorer of this.scorers) {
        filteredRecommendations = scorer.score(filteredRecommendations, context);
      }

      // Apply personalization
      for (const personalizer of this.personalizers) {
        filteredRecommendations = personalizer.personalize(filteredRecommendations, context);
      }

      // Sort recommendations
      if (mergedOptions.sort) {
        filteredRecommendations = this.sortRecommendations(
          filteredRecommendations,
          mergedOptions.sort
        );
      }

      // Apply pagination
      const paginatedRecommendations = this.paginateRecommendations(
        filteredRecommendations,
        mergedOptions.pagination
      );

      return {
        recommendations: paginatedRecommendations.recommendations,
        total: filteredRecommendations.length,
        page: paginatedRecommendations.page,
        pageSize: paginatedRecommendations.pageSize,
        totalPages: paginatedRecommendations.totalPages,
        errors,
        warnings,
      };
    } catch (error) {
      errors.push(`Failed to get recommendations: ${error}`);

      return {
        recommendations: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
        errors,
        warnings,
      };
    }
  }

  /**
   * Create a recommendation
   */
  createRecommendation(
    type: RecommendationType,
    category: RecommendationCategory,
    title: string,
    description: string,
    content: string,
    priority: RecommendationPriority = RecommendationPriority.MEDIUM,
    tags: string[] = [],
    metadata: Record<string, any> = {}
  ): Recommendation {
    return {
      id: uuidv4(),
      type,
      category,
      title,
      description,
      content,
      priority,
      relevanceScore: 0,
      tags,
      createdAt: new Date(),
      metadata,
    };
  }

  /**
   * Apply option filters
   */
  private applyOptionFilters(recommendations: Recommendation[], filter: any): Recommendation[] {
    return recommendations.filter(recommendation => {
      // Filter by type
      if (filter.type && recommendation.type !== filter.type) {
        return false;
      }

      // Filter by category
      if (filter.category && recommendation.category !== filter.category) {
        return false;
      }

      // Filter by priority
      if (filter.priority && recommendation.priority !== filter.priority) {
        return false;
      }

      // Filter by tags
      if (filter.tags && filter.tags.length > 0) {
        if (!filter.tags.some(tag => recommendation.tags.includes(tag))) {
          return false;
        }
      }

      // Filter by language
      if (filter.language && recommendation.language !== filter.language) {
        return false;
      }

      // Filter by pattern
      if (filter.pattern && recommendation.pattern !== filter.pattern) {
        return false;
      }

      // Filter by minimum relevance score
      if (
        filter.minRelevanceScore !== undefined &&
        recommendation.relevanceScore < filter.minRelevanceScore
      ) {
        return false;
      }

      // Filter by maximum relevance score
      if (
        filter.maxRelevanceScore !== undefined &&
        recommendation.relevanceScore > filter.maxRelevanceScore
      ) {
        return false;
      }

      // Filter by source
      if (filter.source && recommendation.source !== filter.source) {
        return false;
      }

      // Filter by created after
      if (filter.createdAfter && recommendation.createdAt < filter.createdAfter) {
        return false;
      }

      // Filter by created before
      if (filter.createdBefore && recommendation.createdAt > filter.createdBefore) {
        return false;
      }

      // Apply custom filter
      if (filter.customFilter && !filter.customFilter(recommendation)) {
        return false;
      }

      return true;
    });
  }

  /**
   * Sort recommendations
   */
  private sortRecommendations(
    recommendations: Recommendation[],
    sortOptions: any
  ): Recommendation[] {
    const { sortBy = 'relevanceScore', sortDirection = 'desc' } = sortOptions;

    return [...recommendations].sort((a, b) => {
      const aValue = a[sortBy as keyof Recommendation];
      const bValue = b[sortBy as keyof Recommendation];

      if (aValue === bValue) {
        return 0;
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : 1;
      } else {
        return aValue > bValue ? -1 : 1;
      }
    });
  }

  /**
   * Paginate recommendations
   */
  private paginateRecommendations(
    recommendations: Recommendation[],
    paginationOptions: any
  ): {
    recommendations: Recommendation[];
    page: number;
    pageSize: number;
    totalPages: number;
  } {
    const { page = 1, pageSize = 10 } = paginationOptions;

    const totalPages = Math.ceil(recommendations.length / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      recommendations: recommendations.slice(startIndex, endIndex),
      page,
      pageSize,
      totalPages,
    };
  }
}
