/**
 * Types for recommendation filters
 */

import { Recommendation, RecommendationContext } from '../types';

/**
 * Recommendation filter
 */
export interface RecommendationFilter {
  /** Filter name */
  name: string;

  /** Filter description */
  description: string;

  /** Filter recommendations */
  filter(recommendations: Recommendation[], context: RecommendationContext): Recommendation[];
}
