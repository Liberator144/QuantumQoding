/**
 * Types for recommendation providers
 */

import { Recommendation, RecommendationContext } from '../types';

/**
 * Recommendation provider
 */
export interface RecommendationProvider {
  /** Provider name */
  name: string;

  /** Provider description */
  description: string;

  /** Get recommendations from this provider */
  getRecommendations(context: RecommendationContext): Promise<Recommendation[]>;
}

/**
 * Recommendation provider registry
 */
export class RecommendationProviderRegistry {
  private providers: Map<string, RecommendationProvider> = new Map();

  /**
   * Register a provider
   */
  registerProvider(provider: RecommendationProvider): void {
    this.providers.set(provider.name, provider);
  }

  /**
   * Get a provider by name
   */
  getProvider(name: string): RecommendationProvider | undefined {
    return this.providers.get(name);
  }

  /**
   * Get all providers
   */
  getAllProviders(): RecommendationProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Remove a provider
   */
  removeProvider(name: string): boolean {
    return this.providers.delete(name);
  }
}
