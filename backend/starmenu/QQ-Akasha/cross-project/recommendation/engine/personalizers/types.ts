/**
 * Types for recommendation personalizers
 */

import { Recommendation, RecommendationContext } from '../types';

/**
 * Recommendation personalizer
 */
export interface RecommendationPersonalizer {
  /** Personalizer name */
  name: string;

  /** Personalizer description */
  description: string;

  /** Personalize recommendations */
  personalize(recommendations: Recommendation[], context: RecommendationContext): Recommendation[];
}
