/**
 * Code Pattern Extractor for Cross-Project Knowledge Transfer
 * Extracts reusable code patterns from source code
 */

import { Knowledge, KnowledgeType } from '../types';
import { ProjectInfo } from '../project-context';
import { BaseKnowledgeExtractor } from './knowledge-extractor';

/**
 * Pattern detection result
 */
interface PatternDetectionResult {
  /** Pattern name */
  name: string;

  /** Pattern description */
  description: string;

  /** Pattern code */
  code: string;

  /** Pattern tags */
  tags: string[];

  /** Start line in the source file */
  startLine: number;

  /** End line in the source file */
  endLine: number;

  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Extracts reusable code patterns from source code
 */
export class CodePatternExtractor extends BaseKnowledgeExtractor {
  constructor() {
    super(
      'code-pattern-extractor',
      'Code Pattern Extractor',
      [KnowledgeType.CODE_PATTERN, KnowledgeType.ALGORITHM],
      ['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cs', 'go', 'rb', 'php', 'swift', 'kt']
    );
  }

  /**
   * Extract knowledge from content
   */
  async extractKnowledge(
    content: string,
    filePath: string,
    project: ProjectInfo,
    options: {
      minConfidence?: number;
      maxPatterns?: number;
    } = {}
  ): Promise<Knowledge[]> {
    const { minConfidence = 0.7, maxPatterns = 5 } = options;

    // Detect patterns in the code
    const patterns = await this.detectPatterns(content, filePath);

    // Filter by confidence and limit the number of patterns
    const filteredPatterns = patterns
      .filter(pattern => pattern.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxPatterns);

    // Convert patterns to knowledge entities
    return filteredPatterns.map(pattern => {
      const knowledge = this.createBaseKnowledge(
        KnowledgeType.CODE_PATTERN,
        pattern.name,
        pattern.description,
        pattern.code,
        filePath,
        project,
        pattern.tags
      );

      // Add pattern-specific metadata
      knowledge.metadata = {
        ...knowledge.metadata,
        startLine: pattern.startLine,
        endLine: pattern.endLine,
        confidence: pattern.confidence,
      };

      // Add compatibility information
      knowledge.compatibility = {
        languages: [knowledge.language!],
        frameworks: project.frameworks,
        notes: `This pattern was extracted from ${filePath} in the ${project.name} project.`,
      };

      return knowledge;
    });
  }

  /**
   * Detect patterns in code
   */
  private async detectPatterns(
    content: string,
    filePath: string
  ): Promise<PatternDetectionResult[]> {
    const patterns: PatternDetectionResult[] = [];
    const language = this.getLanguageFromExtension(filePath);

    // Split content into lines for analysis
    const lines = content.split('\n');

    // Detect function patterns
    patterns.push(...this.detectFunctionPatterns(lines, language));

    // Detect class patterns
    patterns.push(...this.detectClassPatterns(lines, language));

    // Detect algorithm patterns
    patterns.push(...this.detectAlgorithmPatterns(lines, language));

    return patterns;
  }

  /**
   * Detect function patterns
   */
  private detectFunctionPatterns(lines: string[], language?: string): PatternDetectionResult[] {
    const patterns: PatternDetectionResult[] = [];

    // This is a simplified implementation
    // A real implementation would use language-specific parsing

    // Regular expressions for function detection
    const functionRegexes: Record<string, RegExp> = {
      javascript: /function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/,
      typescript: /function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/,
      python: /def\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*:/,
      java: /(public|private|protected)?\s*(static)?\s*[a-zA-Z0-9_<>]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/,
      csharp:
        /(public|private|protected)?\s*(static)?\s*[a-zA-Z0-9_<>]+\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*{/,
      default: /function|def|\s+[a-zA-Z0-9_]+\s*\([^)]*\)\s*[{:]/,
    };

    const regex =
      language && functionRegexes[language] ? functionRegexes[language] : functionRegexes.default;

    // Track function blocks
    let inFunction = false;
    let functionStartLine = -1;
    let functionName = '';
    let functionCode = '';
    let braceCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (!inFunction) {
        // Check for function start
        const match = line.match(regex);
        if (match) {
          inFunction = true;
          functionStartLine = i;
          functionName = match[1] || 'unnamed_function';
          functionCode = line;
          braceCount = line.split('{').length - line.split('}').length;

          // Check if function ends on the same line
          if (language === 'python' && !line.trim().endsWith('\\')) {
            // For Python, we need to track indentation
            continue;
          } else if (braceCount === 0 && line.includes('}')) {
            // Function ends on the same line
            inFunction = false;

            // Add pattern if function is significant
            if (functionCode.length > 30) {
              patterns.push(
                this.createFunctionPattern(
                  functionName,
                  functionCode,
                  functionStartLine,
                  i,
                  language
                )
              );
            }
          }
        }
      } else {
        // Already in a function
        functionCode += '\n' + line;

        if (language === 'python') {
          // For Python, check indentation
          if (
            i < lines.length - 1 &&
            !line.trim().endsWith('\\') &&
            (lines[i + 1].trim() === '' || !lines[i + 1].startsWith(' '))
          ) {
            inFunction = false;

            // Add pattern if function is significant
            if (functionCode.length > 30) {
              patterns.push(
                this.createFunctionPattern(
                  functionName,
                  functionCode,
                  functionStartLine,
                  i,
                  language
                )
              );
            }
          }
        } else {
          // For brace languages, track brace count
          braceCount += line.split('{').length - line.split('}').length;

          if (braceCount === 0) {
            inFunction = false;

            // Add pattern if function is significant
            if (functionCode.length > 30) {
              patterns.push(
                this.createFunctionPattern(
                  functionName,
                  functionCode,
                  functionStartLine,
                  i,
                  language
                )
              );
            }
          }
        }
      }
    }

    return patterns;
  }

  /**
   * Create a function pattern
   */
  private createFunctionPattern(
    name: string,
    code: string,
    startLine: number,
    endLine: number,
    language?: string
  ): PatternDetectionResult {
    // Calculate confidence based on function characteristics
    let confidence = 0.5; // Base confidence

    // Longer functions are more likely to be significant patterns
    const lineCount = code.split('\n').length;
    if (lineCount > 20) {
      confidence += 0.2;
    } else if (lineCount > 10) {
      confidence += 0.1;
    }

    // Functions with descriptive names are more likely to be significant
    if (name.length > 10) {
      confidence += 0.1;
    }

    // Functions with comments are more likely to be well-designed
    if (code.includes('/*') || code.includes('//') || code.includes('#')) {
      confidence += 0.1;
    }

    // Cap confidence at 1.0
    confidence = Math.min(1.0, confidence);

    // Generate tags
    const tags = ['function', 'code-pattern'];
    if (language) {
      tags.push(language);
    }

    // Check for common patterns in the function name or code
    if (name.includes('util') || name.includes('helper')) {
      tags.push('utility');
    }
    if (code.includes('fetch') || code.includes('http') || code.includes('request')) {
      tags.push('api');
      tags.push('network');
    }
    if (code.includes('parse') || code.includes('format')) {
      tags.push('data-processing');
    }

    return {
      name: `Function: ${name}`,
      description: `Reusable function pattern extracted from code. This function appears to ${this.guessFunctionPurpose(name, code)}.`,
      code,
      tags,
      startLine,
      endLine,
      confidence,
    };
  }

  /**
   * Guess the purpose of a function from its name and code
   */
  private guessFunctionPurpose(name: string, code: string): string {
    const nameLower = name.toLowerCase();

    if (
      nameLower.includes('get') ||
      nameLower.includes('fetch') ||
      nameLower.includes('retrieve')
    ) {
      return 'retrieve data';
    }
    if (nameLower.includes('set') || nameLower.includes('update') || nameLower.includes('modify')) {
      return 'update data';
    }
    if (nameLower.includes('create') || nameLower.includes('add') || nameLower.includes('insert')) {
      return 'create new data';
    }
    if (nameLower.includes('delete') || nameLower.includes('remove')) {
      return 'remove data';
    }
    if (nameLower.includes('validate') || nameLower.includes('check')) {
      return 'validate data';
    }
    if (nameLower.includes('format') || nameLower.includes('transform')) {
      return 'transform data';
    }
    if (nameLower.includes('calculate') || nameLower.includes('compute')) {
      return 'perform calculations';
    }
    if (nameLower.includes('render') || nameLower.includes('display')) {
      return 'render UI elements';
    }

    return 'perform a specific operation';
  }

  /**
   * Detect class patterns
   */
  private detectClassPatterns(lines: string[], language?: string): PatternDetectionResult[] {
    // Similar implementation to detectFunctionPatterns
    // but for classes

    // This is a simplified placeholder
    return [];
  }

  /**
   * Detect algorithm patterns
   */
  private detectAlgorithmPatterns(lines: string[], language?: string): PatternDetectionResult[] {
    // Similar implementation to detectFunctionPatterns
    // but looking for common algorithm patterns

    // This is a simplified placeholder
    return [];
  }
}
