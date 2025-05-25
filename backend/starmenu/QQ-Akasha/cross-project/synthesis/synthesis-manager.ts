/**
 * Synthesis Manager
 * Coordinates the knowledge synthesis process
 */

import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import { Knowledge, KnowledgeType } from '../types';
import { KnowledgeStorage } from '../knowledge-storage';
import { ProjectContextManager } from '../project-context';
import {
  SynthesisStrategy,
  SynthesisInput,
  SynthesisResult,
  SynthesisOperationType,
  SynthesisOpportunity,
  SynthesisConfig,
  DEFAULT_SYNTHESIS_CONFIG,
} from './types';
import { PatternCombinationStrategy } from './strategies/pattern-combination-strategy';

/**
 * Events emitted by the synthesis manager
 */
export enum SynthesisEvent {
  SYNTHESIS_STARTED = 'synthesis-started',
  SYNTHESIS_COMPLETED = 'synthesis-completed',
  SYNTHESIS_FAILED = 'synthesis-failed',
  OPPORTUNITY_DETECTED = 'opportunity-detected',
}

/**
 * Manages the knowledge synthesis process
 */
export class SynthesisManager {
  private storage: KnowledgeStorage;
  private projectManager: ProjectContextManager;
  private strategies: Map<string, SynthesisStrategy>;
  private config: SynthesisConfig;
  private eventEmitter: EventEmitter;

  constructor(
    storage: KnowledgeStorage,
    projectManager: ProjectContextManager,
    config: Partial<SynthesisConfig> = {}
  ) {
    this.storage = storage;
    this.projectManager = projectManager;
    this.strategies = new Map();
    this.config = {
      ...DEFAULT_SYNTHESIS_CONFIG,
      ...config,
    };
    this.eventEmitter = new EventEmitter();

    // Register default strategies
    this.registerStrategy(new PatternCombinationStrategy(projectManager));
  }

  /**
   * Register a synthesis strategy
   */
  registerStrategy(strategy: SynthesisStrategy): void {
    this.strategies.set(strategy.id, strategy);
  }

  /**
   * Unregister a synthesis strategy
   */
  unregisterStrategy(strategyId: string): boolean {
    return this.strategies.delete(strategyId);
  }

  /**
   * Get a synthesis strategy
   */
  getStrategy(strategyId: string): SynthesisStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  /**
   * Get all synthesis strategies
   */
  getAllStrategies(): SynthesisStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Synthesize knowledge
   */
  async synthesize(input: SynthesisInput): Promise<SynthesisResult> {
    // Find a strategy that can handle this operation
    const strategy = this.findStrategyForOperation(input.operationType);

    if (!strategy) {
      throw new Error(`No strategy found for operation type: ${input.operationType}`);
    }

    // Emit started event
    this.eventEmitter.emit(SynthesisEvent.SYNTHESIS_STARTED, {
      input,
      strategy: strategy.id,
    });

    try {
      // Perform synthesis
      const result = await strategy.synthesize(input);

      // Check confidence threshold
      if (result.confidence < this.config.minConfidence) {
        throw new Error(
          `Synthesis confidence (${result.confidence}) below threshold (${this.config.minConfidence})`
        );
      }

      // Store synthesized knowledge
      await this.storage.storeKnowledge({
        type: result.synthesizedKnowledge.type,
        title: result.synthesizedKnowledge.title,
        description: result.synthesizedKnowledge.description,
        content: result.synthesizedKnowledge.content,
        sourceProject: result.synthesizedKnowledge.sourceProject,
        sourceFilePath: result.synthesizedKnowledge.sourceFilePath,
        language: result.synthesizedKnowledge.language,
        tags: result.synthesizedKnowledge.tags,
        createdBy: result.synthesizedKnowledge.createdBy,
        compatibility: result.synthesizedKnowledge.compatibility,
        metadata: result.synthesizedKnowledge.metadata,
      });

      // Emit completed event
      this.eventEmitter.emit(SynthesisEvent.SYNTHESIS_COMPLETED, result);

      return result;
    } catch (error) {
      // Emit failed event
      this.eventEmitter.emit(SynthesisEvent.SYNTHESIS_FAILED, {
        input,
        strategy: strategy.id,
        error,
      });

      throw error;
    }
  }

  /**
   * Find synthesis opportunities
   */
  async findOpportunities(
    projectId: string,
    options: {
      maxOpportunities?: number;
      minEstimatedValue?: number;
      knowledgeTypes?: KnowledgeType[];
    } = {}
  ): Promise<SynthesisOpportunity[]> {
    const { maxOpportunities = 10, minEstimatedValue = 0.7, knowledgeTypes } = options;

    // Get project
    const project = this.projectManager.getProject(projectId);
    if (!project) {
      throw new Error(`Project with ID ${projectId} not found`);
    }

    // Get knowledge for this project
    const projectKnowledge = await this.storage.queryKnowledge({
      sourceProject: projectId,
      type: knowledgeTypes ? knowledgeTypes[0] : undefined,
    });

    // Get knowledge from other projects
    const otherKnowledge = await this.storage.queryKnowledge({
      // Exclude this project
    });

    // Filter other knowledge to exclude this project
    const filteredOtherKnowledge = otherKnowledge.knowledge.filter(
      k => k.sourceProject !== projectId
    );

    // Find opportunities
    const opportunities: SynthesisOpportunity[] = [];

    // Look for pattern combination opportunities
    if (!knowledgeTypes || knowledgeTypes.includes(KnowledgeType.CODE_PATTERN)) {
      const patternOpportunities = this.findPatternCombinationOpportunities(
        projectKnowledge.knowledge,
        filteredOtherKnowledge,
        project
      );

      opportunities.push(...patternOpportunities);
    }

    // Filter by estimated value and limit
    return opportunities
      .filter(o => o.estimatedValue >= minEstimatedValue)
      .sort((a, b) => b.estimatedValue - a.estimatedValue)
      .slice(0, maxOpportunities);
  }

  /**
   * Find pattern combination opportunities
   */
  private findPatternCombinationOpportunities(
    projectKnowledge: Knowledge[],
    otherKnowledge: Knowledge[],
    project: any
  ): SynthesisOpportunity[] {
    const opportunities: SynthesisOpportunity[] = [];

    // Filter to only include code patterns
    const projectPatterns = projectKnowledge.filter(k => k.type === KnowledgeType.CODE_PATTERN);

    const otherPatterns = otherKnowledge.filter(k => k.type === KnowledgeType.CODE_PATTERN);

    // For each project pattern, look for complementary patterns
    for (const projectPattern of projectPatterns) {
      // Find similar patterns from other projects
      const similarPatterns = this.findSimilarPatterns(projectPattern, otherPatterns);

      if (similarPatterns.length > 0) {
        opportunities.push({
          id: uuidv4(),
          description: `Combine "${projectPattern.title}" with similar patterns from other projects`,
          relatedKnowledge: [projectPattern, ...similarPatterns],
          suggestedOperation: SynthesisOperationType.PATTERN_COMBINATION,
          potentialBenefit:
            'Create a more comprehensive pattern that incorporates best practices from multiple projects',
          estimatedValue: 0.8,
          estimatedComplexity: 0.5,
        });
      }
    }

    return opportunities;
  }

  /**
   * Find similar patterns to a given pattern
   */
  private findSimilarPatterns(
    pattern: Knowledge,
    otherPatterns: Knowledge[],
    maxPatterns: number = 3
  ): Knowledge[] {
    // Calculate similarity scores
    const patternScores = otherPatterns.map(otherPattern => ({
      pattern: otherPattern,
      score: this.calculatePatternSimilarity(pattern, otherPattern),
    }));

    // Sort by similarity score (highest first)
    patternScores.sort((a, b) => b.score - a.score);

    // Return top patterns
    return patternScores
      .filter(p => p.score > 0.6) // Only include reasonably similar patterns
      .slice(0, maxPatterns)
      .map(p => p.pattern);
  }

  /**
   * Calculate similarity between two patterns
   */
  private calculatePatternSimilarity(pattern1: Knowledge, pattern2: Knowledge): number {
    // This is a simplified implementation
    // A real implementation would use more sophisticated similarity metrics

    let similarityScore = 0;
    let factorsConsidered = 0;

    // Compare tags
    if (pattern1.tags.length > 0 && pattern2.tags.length > 0) {
      factorsConsidered++;

      const commonTags = pattern1.tags.filter(tag => pattern2.tags.includes(tag));

      const tagSimilarity =
        commonTags.length / Math.max(pattern1.tags.length, pattern2.tags.length);

      similarityScore += tagSimilarity;
    }

    // Compare language
    if (pattern1.language && pattern2.language) {
      factorsConsidered++;

      if (pattern1.language === pattern2.language) {
        similarityScore += 1.0;
      } else {
        similarityScore += 0.2; // Small similarity for different languages
      }
    }

    // Compare content (simple text similarity)
    factorsConsidered++;
    const contentSimilarity = this.calculateTextSimilarity(pattern1.content, pattern2.content);

    similarityScore += contentSimilarity;

    // Calculate final similarity score
    return factorsConsidered > 0 ? similarityScore / factorsConsidered : 0;
  }

  /**
   * Calculate text similarity between two strings
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
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

  /**
   * Find a strategy that can handle an operation type
   */
  private findStrategyForOperation(
    operationType: SynthesisOperationType
  ): SynthesisStrategy | undefined {
    for (const strategy of this.strategies.values()) {
      if (strategy.supportedOperations.includes(operationType)) {
        return strategy;
      }
    }

    return undefined;
  }

  /**
   * Subscribe to synthesis events
   */
  on(event: SynthesisEvent, listener: (data: any) => void): void {
    this.eventEmitter.on(event, listener);
  }

  /**
   * Unsubscribe from synthesis events
   */
  off(event: SynthesisEvent, listener: (data: any) => void): void {
    this.eventEmitter.off(event, listener);
  }
}
