/**
 * Types for AI-Powered Knowledge Synthesis
 * Enables creating new knowledge by combining insights from multiple sources
 */

import { Knowledge, KnowledgeType } from '../types';
import { KnowledgeNode, KnowledgeRelationship } from '../models/knowledge-graph';

/**
 * Types of knowledge synthesis operations
 */
export enum SynthesisOperationType {
  /** Combine multiple patterns into a new unified pattern */
  PATTERN_COMBINATION = 'pattern_combination',

  /** Extract common elements from multiple patterns */
  PATTERN_EXTRACTION = 'pattern_extraction',

  /** Generalize multiple specific patterns into a more abstract pattern */
  PATTERN_GENERALIZATION = 'pattern_generalization',

  /** Specialize a general pattern for a specific use case */
  PATTERN_SPECIALIZATION = 'pattern_specialization',

  /** Optimize a pattern for better performance, readability, etc. */
  PATTERN_OPTIMIZATION = 'pattern_optimization',

  /** Merge multiple best practices into a unified set */
  PRACTICE_CONSOLIDATION = 'practice_consolidation',

  /** Create a new solution by combining multiple existing solutions */
  SOLUTION_COMPOSITION = 'solution_composition',

  /** Custom synthesis operation */
  CUSTOM = 'custom',
}

/**
 * Synthesis operation input
 */
export interface SynthesisInput {
  /** Primary knowledge entity to synthesize from */
  primaryKnowledge: Knowledge;

  /** Additional knowledge entities to incorporate */
  additionalKnowledge: Knowledge[];

  /** Target project ID */
  targetProjectId: string;

  /** Type of synthesis operation to perform */
  operationType: SynthesisOperationType;

  /** Additional parameters for the synthesis operation */
  parameters?: Record<string, any>;
}

/**
 * Synthesis operation result
 */
export interface SynthesisResult {
  /** Newly synthesized knowledge */
  synthesizedKnowledge: Knowledge;

  /** Source knowledge entities used in synthesis */
  sourceKnowledge: Knowledge[];

  /** Type of synthesis operation performed */
  operationType: SynthesisOperationType;

  /** Explanation of the synthesis process */
  explanation: string;

  /** Confidence score for the synthesis (0-1) */
  confidence: number;

  /** Compatibility score with target project (0-1) */
  compatibilityScore: number;

  /** Notes about the synthesis */
  notes: string[];

  /** Suggested improvements or alternatives */
  suggestions: string[];
}

/**
 * Synthesis strategy interface
 */
export interface SynthesisStrategy {
  /** Strategy ID */
  id: string;

  /** Strategy name */
  name: string;

  /** Synthesis operation types this strategy can handle */
  supportedOperations: SynthesisOperationType[];

  /** Synthesize knowledge */
  synthesize(input: SynthesisInput): Promise<SynthesisResult>;

  /** Check if this strategy can handle a synthesis operation */
  canHandle(input: SynthesisInput): boolean;
}

/**
 * Synthesis conflict
 */
export interface SynthesisConflict {
  /** Conflict ID */
  id: string;

  /** Description of the conflict */
  description: string;

  /** Knowledge entities involved in the conflict */
  conflictingKnowledge: Knowledge[];

  /** Possible resolutions for the conflict */
  possibleResolutions: string[];

  /** Recommended resolution */
  recommendedResolution: string;

  /** Severity of the conflict (0-1) */
  severity: number;
}

/**
 * Synthesis opportunity
 */
export interface SynthesisOpportunity {
  /** Opportunity ID */
  id: string;

  /** Description of the opportunity */
  description: string;

  /** Knowledge entities involved in the opportunity */
  relatedKnowledge: Knowledge[];

  /** Suggested synthesis operation */
  suggestedOperation: SynthesisOperationType;

  /** Potential benefit description */
  potentialBenefit: string;

  /** Estimated value of the opportunity (0-1) */
  estimatedValue: number;

  /** Estimated complexity of implementation (0-1) */
  estimatedComplexity: number;
}

/**
 * Synthesis configuration
 */
export interface SynthesisConfig {
  /** Minimum confidence threshold for synthesis results (0-1) */
  minConfidence: number;

  /** Maximum number of knowledge entities to combine */
  maxKnowledgeToCombine: number;

  /** Whether to automatically resolve conflicts */
  autoResolveConflicts: boolean;

  /** Whether to use AI for synthesis */
  useAI: boolean;

  /** AI model to use for synthesis */
  aiModel?: string;

  /** AI temperature setting (0-1) */
  aiTemperature?: number;

  /** Maximum tokens for AI generation */
  aiMaxTokens?: number;
}

/**
 * Default synthesis configuration
 */
export const DEFAULT_SYNTHESIS_CONFIG: SynthesisConfig = {
  minConfidence: 0.7,
  maxKnowledgeToCombine: 5,
  autoResolveConflicts: false,
  useAI: true,
  aiModel: 'gpt-4',
  aiTemperature: 0.7,
  aiMaxTokens: 4000,
};
