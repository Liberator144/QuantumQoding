/**
 * Types for recommendation scorers
 */

import { Recommendation, RecommendationContext } from '../types';

/**
 * Recommendation scorer
 */
export interface RecommendationScorer {
  /** Scorer name */
  name: string;

  /** Scorer description */
  description: string;

  /** Score recommendations */
  score(recommendations: Recommendation[], context: RecommendationContext): Recommendation[];
}
