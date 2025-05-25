/**
 * Base Synthesis Strategy
 * Provides common functionality for all synthesis strategies
 */

import { v4 as uuidv4 } from 'uuid';
import { Knowledge, KnowledgeType } from '../types';
import {
  SynthesisStrategy,
  SynthesisInput,
  SynthesisResult,
  SynthesisOperationType,
  SynthesisConflict,
} from './types';
import { ProjectContextManager } from '../project-context';

/**
 * Abstract base class for synthesis strategies
 */
export abstract class BaseSynthesisStrategy implements SynthesisStrategy {
  id: string;
  name: string;
  supportedOperations: SynthesisOperationType[];
  protected projectManager: ProjectContextManager;

  constructor(
    id: string,
    name: string,
    supportedOperations: SynthesisOperationType[],
    projectManager: ProjectContextManager
  ) {
    this.id = id;
    this.name = name;
    this.supportedOperations = supportedOperations;
    this.projectManager = projectManager;
  }

  /**
   * Synthesize knowledge
   */
  abstract synthesize(input: SynthesisInput): Promise<SynthesisResult>;

  /**
   * Check if this strategy can handle a synthesis operation
   */
  canHandle(input: SynthesisInput): boolean {
    return this.supportedOperations.includes(input.operationType);
  }

  /**
   * Create a base synthesis result
   */
  protected createBaseSynthesisResult(
    input: SynthesisInput,
    synthesizedContent: string,
    title: string,
    description: string,
    type: KnowledgeType,
    confidence: number,
    explanation: string,
    notes: string[] = [],
    suggestions: string[] = []
  ): SynthesisResult {
    // Get target project
    const targetProject = this.projectManager.getProject(input.targetProjectId);

    // Calculate compatibility score
    const compatibilityScore = targetProject
      ? this.calculateCompatibilityScore(
          input.primaryKnowledge,
          input.additionalKnowledge,
          targetProject
        )
      : 0.5;

    // Create synthesized knowledge
    const synthesizedKnowledge: Knowledge = {
      id: uuidv4(),
      type,
      title,
      description,
      content: synthesizedContent,
      sourceProject: input.targetProjectId,
      language: input.primaryKnowledge.language,
      tags: this.mergeTags(input.primaryKnowledge, input.additionalKnowledge),
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 0,
      applicationCount: 0,
      appliedProjects: [],
      createdBy: 'synthesis-engine',
      compatibility: {
        languages: input.primaryKnowledge.language ? [input.primaryKnowledge.language] : undefined,
        frameworks: targetProject?.frameworks,
        environments: targetProject?.tags.filter(tag =>
          ['web', 'mobile', 'desktop', 'server', 'cloud'].includes(tag)
        ),
        notes: `This knowledge was synthesized from multiple sources for project ${targetProject?.name || input.targetProjectId}.`,
      },
      metadata: {
        synthesisOperation: input.operationType,
        synthesisStrategy: this.id,
        sourceKnowledgeIds: [
          input.primaryKnowledge.id,
          ...input.additionalKnowledge.map(k => k.id),
        ],
        confidence,
        compatibilityScore,
        synthesisDate: new Date(),
      },
    };

    return {
      synthesizedKnowledge,
      sourceKnowledge: [input.primaryKnowledge, ...input.additionalKnowledge],
      operationType: input.operationType,
      explanation,
      confidence,
      compatibilityScore,
      notes,
      suggestions,
    };
  }

  /**
   * Merge tags from multiple knowledge entities
   */
  protected mergeTags(primaryKnowledge: Knowledge, additionalKnowledge: Knowledge[]): string[] {
    // Start with primary knowledge tags
    const allTags = new Set(primaryKnowledge.tags);

    // Add tags from additional knowledge
    for (const knowledge of additionalKnowledge) {
      for (const tag of knowledge.tags) {
        allTags.add(tag);
      }
    }

    return Array.from(allTags);
  }

  /**
   * Calculate compatibility score with target project
   */
  protected calculateCompatibilityScore(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[],
    targetProject: any
  ): number {
    // This is a simplified implementation
    // A real implementation would use more sophisticated compatibility metrics

    let compatibilityScore = 0;
    let factorsConsidered = 0;

    // Check language compatibility
    if (primaryKnowledge.language && targetProject.languages) {
      factorsConsidered++;

      if (targetProject.languages.includes(primaryKnowledge.language)) {
        compatibilityScore += 1.0;
      } else {
        compatibilityScore += 0.2; // Small compatibility for different languages
      }
    }

    // Check framework compatibility
    if (
      primaryKnowledge.compatibility?.frameworks &&
      primaryKnowledge.compatibility.frameworks.length > 0 &&
      targetProject.frameworks
    ) {
      factorsConsidered++;

      const commonFrameworks = primaryKnowledge.compatibility.frameworks.filter(framework =>
        targetProject.frameworks.includes(framework)
      );

      compatibilityScore +=
        commonFrameworks.length / primaryKnowledge.compatibility.frameworks.length;
    }

    // Check tag compatibility
    if (primaryKnowledge.tags.length > 0 && targetProject.tags) {
      factorsConsidered++;

      const commonTags = primaryKnowledge.tags.filter(tag => targetProject.tags.includes(tag));

      compatibilityScore += commonTags.length / primaryKnowledge.tags.length;
    }

    // Calculate final compatibility score
    return factorsConsidered > 0 ? compatibilityScore / factorsConsidered : 0.5;
  }

  /**
   * Detect conflicts between knowledge entities
   */
  protected detectConflicts(
    primaryKnowledge: Knowledge,
    additionalKnowledge: Knowledge[]
  ): SynthesisConflict[] {
    const conflicts: SynthesisConflict[] = [];

    // This is a simplified implementation
    // A real implementation would use more sophisticated conflict detection

    // Check for language conflicts
    if (primaryKnowledge.language) {
      for (const knowledge of additionalKnowledge) {
        if (knowledge.language && knowledge.language !== primaryKnowledge.language) {
          conflicts.push({
            id: uuidv4(),
            description: `Language conflict: ${primaryKnowledge.language} vs ${knowledge.language}`,
            conflictingKnowledge: [primaryKnowledge, knowledge],
            possibleResolutions: [
              `Convert all code to ${primaryKnowledge.language}`,
              `Convert all code to ${knowledge.language}`,
              'Keep language-specific sections separate',
            ],
            recommendedResolution: `Convert all code to ${primaryKnowledge.language}`,
            severity: 0.7,
          });
        }
      }
    }

    // Check for framework conflicts
    if (primaryKnowledge.compatibility?.frameworks) {
      for (const knowledge of additionalKnowledge) {
        if (knowledge.compatibility?.frameworks) {
          const primaryFrameworks = new Set(primaryKnowledge.compatibility.frameworks);
          const additionalFrameworks = new Set(knowledge.compatibility.frameworks);

          // Check if there's no overlap in frameworks
          const intersection = new Set(
            [...primaryFrameworks].filter(f => additionalFrameworks.has(f))
          );

          if (
            intersection.size === 0 &&
            primaryFrameworks.size > 0 &&
            additionalFrameworks.size > 0
          ) {
            conflicts.push({
              id: uuidv4(),
              description: `Framework conflict: ${[...primaryFrameworks].join(', ')} vs ${[...additionalFrameworks].join(', ')}`,
              conflictingKnowledge: [primaryKnowledge, knowledge],
              possibleResolutions: [
                'Create framework-agnostic solution',
                `Adapt to primary framework (${[...primaryFrameworks].join(', ')})`,
                'Create separate implementations for each framework',
              ],
              recommendedResolution: 'Create framework-agnostic solution',
              severity: 0.6,
            });
          }
        }
      }
    }

    return conflicts;
  }
}
