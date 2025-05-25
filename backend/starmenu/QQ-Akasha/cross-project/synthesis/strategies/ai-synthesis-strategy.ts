/**
 * AI Synthesis Strategy
 * Uses AI to synthesize knowledge from multiple sources
 */

import { Knowledge, KnowledgeType } from '../../types';
import { SynthesisInput, SynthesisResult, SynthesisOperationType } from '../types';
import { BaseSynthesisStrategy } from '../base-synthesis-strategy';
import { ProjectContextManager } from '../../project-context';
import { AIService, AISynthesisRequest } from '../ai/ai-service';

/**
 * Strategy that uses AI for knowledge synthesis
 */
export class AISynthesisStrategy extends BaseSynthesisStrategy {
  private aiService: AIService;

  constructor(projectManager: ProjectContextManager, aiService: AIService) {
    super(
      'ai-synthesis',
      'AI-Powered Synthesis Strategy',
      [
        SynthesisOperationType.PATTERN_COMBINATION,
        SynthesisOperationType.PATTERN_EXTRACTION,
        SynthesisOperationType.PATTERN_GENERALIZATION,
        SynthesisOperationType.PATTERN_SPECIALIZATION,
        SynthesisOperationType.PATTERN_OPTIMIZATION,
        SynthesisOperationType.PRACTICE_CONSOLIDATION,
        SynthesisOperationType.SOLUTION_COMPOSITION,
        SynthesisOperationType.CUSTOM,
      ],
      projectManager
    );

    this.aiService = aiService;
  }

  /**
   * Synthesize knowledge using AI
   */
  async synthesize(input: SynthesisInput): Promise<SynthesisResult> {
    // Validate input
    this.validateInput(input);

    // Detect conflicts
    const conflicts = this.detectConflicts(input.primaryKnowledge, input.additionalKnowledge);

    // Create AI synthesis request
    const aiRequest: AISynthesisRequest = {
      primaryKnowledge: input.primaryKnowledge,
      additionalKnowledge: input.additionalKnowledge,
      targetProjectId: input.targetProjectId,
      operationType: input.operationType,
      instructions: this.generateInstructions(input, conflicts),
      modelConfig: input.parameters?.aiModelConfig,
    };

    // Call AI service
    const aiResponse = await this.aiService.synthesize(aiRequest);

    // Create synthesis result
    return this.createBaseSynthesisResult(
      input,
      aiResponse.content,
      aiResponse.title,
      aiResponse.description,
      this.determineKnowledgeType(input),
      aiResponse.confidence,
      aiResponse.explanation,
      aiResponse.notes,
      aiResponse.suggestions
    );
  }

  /**
   * Validate synthesis input
   */
  private validateInput(input: SynthesisInput): void {
    if (!input.primaryKnowledge) {
      throw new Error('Primary knowledge is required');
    }

    if (!input.additionalKnowledge || input.additionalKnowledge.length === 0) {
      throw new Error('At least one additional knowledge entity is required');
    }

    if (!input.targetProjectId) {
      throw new Error('Target project ID is required');
    }

    const project = this.projectManager.getProject(input.targetProjectId);
    if (!project) {
      throw new Error(`Target project with ID ${input.targetProjectId} not found`);
    }
  }

  /**
   * Generate instructions for AI synthesis
   */
  private generateInstructions(input: SynthesisInput, conflicts: any[]): string {
    let instructions = `Synthesize a new ${input.operationType.toLowerCase().replace('_', ' ')} `;

    // Add operation-specific instructions
    switch (input.operationType) {
      case SynthesisOperationType.PATTERN_COMBINATION:
        instructions +=
          'by combining the functionality of all input patterns into a cohesive whole. ';
        break;

      case SynthesisOperationType.PATTERN_EXTRACTION:
        instructions +=
          'by extracting common elements from the input patterns into a reusable abstraction. ';
        break;

      case SynthesisOperationType.PATTERN_GENERALIZATION:
        instructions +=
          'by creating a more abstract pattern that can handle all the use cases of the input patterns. ';
        break;

      case SynthesisOperationType.PATTERN_SPECIALIZATION:
        instructions +=
          'by adapting the primary pattern for the specific use case described in the additional patterns. ';
        break;

      case SynthesisOperationType.PATTERN_OPTIMIZATION:
        instructions +=
          'by optimizing the primary pattern using techniques from the additional patterns. ';
        break;

      case SynthesisOperationType.PRACTICE_CONSOLIDATION:
        instructions +=
          'by consolidating the best practices from all inputs into a comprehensive set. ';
        break;

      case SynthesisOperationType.SOLUTION_COMPOSITION:
        instructions += 'by composing a new solution that incorporates all the input solutions. ';
        break;
    }

    // Add target project information
    const project = this.projectManager.getProject(input.targetProjectId);
    if (project) {
      instructions += `The target project uses ${project.languages.join(', ')} `;

      if (project.frameworks && project.frameworks.length > 0) {
        instructions += `with ${project.frameworks.join(', ')} frameworks. `;
      }
    }

    // Add conflict information
    if (conflicts.length > 0) {
      instructions += 'Address the following conflicts: ';

      for (const conflict of conflicts) {
        instructions += `${conflict.description} (recommended resolution: ${conflict.recommendedResolution}). `;
      }
    }

    // Add custom parameters
    if (input.parameters) {
      for (const [key, value] of Object.entries(input.parameters)) {
        if (key !== 'aiModelConfig') {
          instructions += `${key}: ${value}. `;
        }
      }
    }

    return instructions;
  }

  /**
   * Determine the knowledge type for the synthesis result
   */
  private determineKnowledgeType(input: SynthesisInput): KnowledgeType {
    // By default, use the same type as the primary knowledge
    let type = input.primaryKnowledge.type;

    // Override based on operation type
    switch (input.operationType) {
      case SynthesisOperationType.PATTERN_COMBINATION:
      case SynthesisOperationType.PATTERN_EXTRACTION:
      case SynthesisOperationType.PATTERN_GENERALIZATION:
      case SynthesisOperationType.PATTERN_SPECIALIZATION:
      case SynthesisOperationType.PATTERN_OPTIMIZATION:
        type = KnowledgeType.CODE_PATTERN;
        break;

      case SynthesisOperationType.PRACTICE_CONSOLIDATION:
        type = KnowledgeType.BEST_PRACTICE;
        break;

      case SynthesisOperationType.SOLUTION_COMPOSITION:
        type = KnowledgeType.SOLUTION;
        break;
    }

    return type;
  }
}
