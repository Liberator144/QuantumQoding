/**
 * Pattern Combination Strategy
 * Combines multiple code patterns into a new unified pattern
 */

import { Knowledge, KnowledgeType } from '../../types';
import { SynthesisInput, SynthesisResult, SynthesisOperationType } from '../types';
import { BaseSynthesisStrategy } from '../base-synthesis-strategy';
import { ProjectContextManager } from '../../project-context';

/**
 * Strategy for combining multiple code patterns
 */
export class PatternCombinationStrategy extends BaseSynthesisStrategy {
  constructor(projectManager: ProjectContextManager) {
    super(
      'pattern-combination',
      'Pattern Combination Strategy',
      [SynthesisOperationType.PATTERN_COMBINATION],
      projectManager
    );
  }

  /**
   * Synthesize a new pattern by combining multiple patterns
   */
  async synthesize(input: SynthesisInput): Promise<SynthesisResult> {
    // Validate input
    if (input.primaryKnowledge.type !== KnowledgeType.CODE_PATTERN) {
      throw new Error('Primary knowledge must be a code pattern');
    }

    // Filter additional knowledge to only include code patterns
    const patternKnowledge = input.additionalKnowledge.filter(
      k => k.type === KnowledgeType.CODE_PATTERN
    );

    if (patternKnowledge.length === 0) {
      throw new Error('No additional code patterns provided');
    }

    // Detect conflicts
    const conflicts = this.detectConflicts(input.primaryKnowledge, patternKnowledge);

    // Generate combined pattern
    const combinedPattern = await this.combinePatterns(
      input.primaryKnowledge,
      patternKnowledge,
      conflicts
    );

    // Generate title and description
    const title = this.generateTitle(input.primaryKnowledge, patternKnowledge);
    const description = this.generateDescription(input.primaryKnowledge, patternKnowledge);

    // Generate explanation
    const explanation = this.generateExplanation(
      input.primaryKnowledge,
      patternKnowledge,
      conflicts
    );

    // Generate notes and suggestions
    const notes = this.generateNotes(conflicts);
    const suggestions = this.generateSuggestions(input.primaryKnowledge, patternKnowledge);

    // Calculate confidence
    const confidence = this.calculateConfidence(
      input.primaryKnowledge,
      patternKnowledge,
      conflicts
    );

    // Create synthesis result
    return this.createBaseSynthesisResult(
      input,
      combinedPattern,
      title,
      description,
      KnowledgeType.CODE_PATTERN,
      confidence,
      explanation,
      notes,
      suggestions
    );
  }

  /**
   * Combine multiple patterns into a single pattern
   */
  private async combinePatterns(
    primaryPattern: Knowledge,
    additionalPatterns: Knowledge[],
    conflicts: any[]
  ): Promise<string> {
    // This is a simplified implementation
    // A real implementation would use more sophisticated pattern combination techniques

    // Start with the primary pattern
    let combinedPattern = primaryPattern.content;

    // Add a separator
    combinedPattern += '\n\n// Combined with additional patterns:\n\n';

    // Add each additional pattern
    for (const pattern of additionalPatterns) {
      combinedPattern += `// From pattern: ${pattern.title}\n`;
      combinedPattern += pattern.content;
      combinedPattern += '\n\n';
    }

    // Add usage example
    combinedPattern += '// Example usage of combined pattern:\n';
    combinedPattern += this.generateUsageExample(primaryPattern, additionalPatterns);

    return combinedPattern;
  }

  /**
   * Generate a title for the combined pattern
   */
  private generateTitle(primaryPattern: Knowledge, additionalPatterns: Knowledge[]): string {
    // Extract key terms from pattern titles
    const primaryTerms = this.extractKeyTerms(primaryPattern.title);
    const additionalTerms = additionalPatterns
      .flatMap(p => this.extractKeyTerms(p.title))
      .filter(term => !primaryTerms.includes(term));

    // Combine terms
    const allTerms = [...primaryTerms, ...additionalTerms.slice(0, 2)];

    return `Combined ${allTerms.join('-')} Pattern`;
  }

  /**
   * Generate a description for the combined pattern
   */
  private generateDescription(primaryPattern: Knowledge, additionalPatterns: Knowledge[]): string {
    return `A combined pattern that integrates ${primaryPattern.title} with ${additionalPatterns.map(p => p.title).join(', ')}. This pattern provides a unified approach that leverages the strengths of each component pattern.`;
  }

  /**
   * Generate an explanation of the synthesis process
   */
  private generateExplanation(
    primaryPattern: Knowledge,
    additionalPatterns: Knowledge[],
    conflicts: any[]
  ): string {
    let explanation = `This pattern was synthesized by combining ${primaryPattern.title} with ${additionalPatterns.length} additional patterns. `;

    explanation += `The primary pattern provides the core structure, while the additional patterns contribute complementary functionality. `;

    if (conflicts.length > 0) {
      explanation += `During synthesis, ${conflicts.length} conflicts were identified and addressed. `;
    }

    explanation += `The combined pattern maintains the essential characteristics of each source pattern while creating a more comprehensive solution.`;

    return explanation;
  }

  /**
   * Generate notes based on conflicts
   */
  private generateNotes(conflicts: any[]): string[] {
    const notes: string[] = [];

    if (conflicts.length > 0) {
      notes.push(`${conflicts.length} conflicts were detected during synthesis.`);

      for (const conflict of conflicts) {
        notes.push(
          `Conflict: ${conflict.description}. Resolution: ${conflict.recommendedResolution}`
        );
      }
    }

    return notes;
  }

  /**
   * Generate suggestions for further improvements
   */
  private generateSuggestions(
    primaryPattern: Knowledge,
    additionalPatterns: Knowledge[]
  ): string[] {
    return [
      'Consider refactoring the combined pattern to improve cohesion',
      'Add comprehensive error handling to address edge cases',
      'Create unit tests to verify the combined functionality',
      'Document the pattern with examples for different use cases',
    ];
  }

  /**
   * Calculate confidence in the synthesis result
   */
  private calculateConfidence(
    primaryPattern: Knowledge,
    additionalPatterns: Knowledge[],
    conflicts: any[]
  ): number {
    // Base confidence
    let confidence = 0.8;

    // Reduce confidence based on number of patterns combined
    confidence -= Math.min(0.3, additionalPatterns.length * 0.05);

    // Reduce confidence based on conflicts
    confidence -= Math.min(0.4, conflicts.length * 0.1);

    // Ensure confidence is between 0 and 1
    return Math.max(0, Math.min(1, confidence));
  }

  /**
   * Extract key terms from a string
   */
  private extractKeyTerms(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .slice(0, 3);
  }

  /**
   * Generate a usage example for the combined pattern
   */
  private generateUsageExample(primaryPattern: Knowledge, additionalPatterns: Knowledge[]): string {
    // This is a simplified implementation
    // A real implementation would generate a more meaningful example

    return `
// Example usage of combined pattern
function useCombinedPattern() {
  // Use primary pattern functionality
  const primaryResult = primaryPatternFunction();
  
  // Use additional pattern functionality
  const additionalResults = additionalPatternFunctions();
  
  // Combine results
  return {
    ...primaryResult,
    ...additionalResults
  };
}
    `;
  }
}
