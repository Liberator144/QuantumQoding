/**
 * AI Service Interface for Knowledge Synthesis
 * Provides AI capabilities for synthesizing knowledge
 */

import { Knowledge } from '../../types';

/**
 * AI model configuration
 */
export interface AIModelConfig {
  /** Model name/identifier */
  model: string;

  /** Temperature setting (0-1) */
  temperature: number;

  /** Maximum tokens to generate */
  maxTokens: number;

  /** Additional model parameters */
  parameters?: Record<string, any>;
}

/**
 * Default AI model configuration
 */
export const DEFAULT_AI_MODEL_CONFIG: AIModelConfig = {
  model: 'gpt-4',
  temperature: 0.7,
  maxTokens: 4000,
};

/**
 * AI synthesis request
 */
export interface AISynthesisRequest {
  /** Primary knowledge to synthesize from */
  primaryKnowledge: Knowledge;

  /** Additional knowledge to incorporate */
  additionalKnowledge: Knowledge[];

  /** Target project ID */
  targetProjectId: string;

  /** Synthesis operation type */
  operationType: string;

  /** Specific instructions for the synthesis */
  instructions?: string;

  /** AI model configuration */
  modelConfig?: Partial<AIModelConfig>;
}

/**
 * AI synthesis response
 */
export interface AISynthesisResponse {
  /** Synthesized content */
  content: string;

  /** Title for the synthesized knowledge */
  title: string;

  /** Description for the synthesized knowledge */
  description: string;

  /** Explanation of the synthesis process */
  explanation: string;

  /** Notes about the synthesis */
  notes: string[];

  /** Suggestions for further improvements */
  suggestions: string[];

  /** Confidence score (0-1) */
  confidence: number;

  /** Model usage information */
  usage?: {
    /** Prompt tokens used */
    promptTokens: number;

    /** Completion tokens used */
    completionTokens: number;

    /** Total tokens used */
    totalTokens: number;
  };
}

/**
 * Interface for AI services
 */
export interface AIService {
  /** Service name */
  name: string;

  /** Synthesize knowledge using AI */
  synthesize(request: AISynthesisRequest): Promise<AISynthesisResponse>;

  /** Generate a title for synthesized knowledge */
  generateTitle(primaryKnowledge: Knowledge, additionalKnowledge: Knowledge[]): Promise<string>;

  /** Generate a description for synthesized knowledge */
  generateDescription(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[],
    synthesizedContent: string
  ): Promise<string>;

  /** Generate an explanation of the synthesis process */
  generateExplanation(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[],
    synthesizedContent: string,
    operationType: string
  ): Promise<string>;

  /** Evaluate the quality of synthesized knowledge */
  evaluateQuality(
    synthesizedContent: string,
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[]
  ): Promise<{
    confidence: number;
    notes: string[];
    suggestions: string[];
  }>;
}
