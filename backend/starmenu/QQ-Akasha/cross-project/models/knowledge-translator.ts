/**
 * Knowledge Translator for Cross-Project Knowledge Transfer
 * Translates knowledge between different project contexts
 */

import { Knowledge, KnowledgeType } from '../types';
import { ProjectInfo } from '../project-context';

/**
 * Translation result
 */
export interface TranslationResult {
  /** Original knowledge */
  originalKnowledge: Knowledge;

  /** Translated knowledge */
  translatedKnowledge: Knowledge;

  /** Translation notes */
  notes: string[];

  /** Whether the translation was successful */
  success: boolean;

  /** Confidence score (0-1) */
  confidence: number;
}

/**
 * Translates knowledge between different project contexts
 */
export class KnowledgeTranslator {
  /**
   * Translate knowledge to a target project context
   */
  async translateKnowledge(
    knowledge: Knowledge,
    targetProject: ProjectInfo,
    options: {
      adaptLanguage?: boolean;
      adaptFrameworks?: boolean;
      adaptDependencies?: boolean;
      preserveComments?: boolean;
    } = {}
  ): Promise<TranslationResult> {
    const {
      adaptLanguage = true,
      adaptFrameworks = true,
      adaptDependencies = true,
      preserveComments = true,
    } = options;

    // Start with a copy of the original knowledge
    const translatedKnowledge: Knowledge = {
      ...knowledge,
      id: knowledge.id, // Keep the same ID
      appliedProjects: [...knowledge.appliedProjects], // Clone array
    };

    const notes: string[] = [];
    let success = true;
    let confidence = 1.0;

    // Adapt based on knowledge type
    switch (knowledge.type) {
      case KnowledgeType.CODE_PATTERN:
        const codeResult = await this.translateCodePattern(knowledge, targetProject, {
          adaptLanguage,
          adaptFrameworks,
          preserveComments,
        });

        translatedKnowledge.content = codeResult.translatedCode;
        notes.push(...codeResult.notes);
        success = codeResult.success;
        confidence = codeResult.confidence;
        break;

      case KnowledgeType.ARCHITECTURE:
        const architectureResult = this.translateArchitecture(knowledge, targetProject);

        translatedKnowledge.content = architectureResult.translatedContent;
        notes.push(...architectureResult.notes);
        success = architectureResult.success;
        confidence = architectureResult.confidence;
        break;

      case KnowledgeType.BEST_PRACTICE:
        // Best practices usually don't need translation
        notes.push('Best practices typically apply across projects with minimal adaptation.');
        break;

      case KnowledgeType.SOLUTION:
        const solutionResult = await this.translateSolution(knowledge, targetProject, {
          adaptLanguage,
          adaptFrameworks,
          adaptDependencies,
        });

        translatedKnowledge.content = solutionResult.translatedContent;
        notes.push(...solutionResult.notes);
        success = solutionResult.success;
        confidence = solutionResult.confidence;
        break;

      default:
        notes.push(`No specific translation strategy for knowledge type: ${knowledge.type}`);
        confidence = 0.5;
    }

    // Update metadata
    translatedKnowledge.metadata = {
      ...translatedKnowledge.metadata,
      translatedFrom: knowledge.sourceProject,
      translatedTo: targetProject.id,
      translationNotes: notes,
      translationConfidence: confidence,
    };

    return {
      originalKnowledge: knowledge,
      translatedKnowledge,
      notes,
      success,
      confidence,
    };
  }

  /**
   * Translate a code pattern
   */
  private async translateCodePattern(
    knowledge: Knowledge,
    targetProject: ProjectInfo,
    options: {
      adaptLanguage?: boolean;
      adaptFrameworks?: boolean;
      preserveComments?: boolean;
    }
  ): Promise<{
    translatedCode: string;
    notes: string[];
    success: boolean;
    confidence: number;
  }> {
    const { adaptLanguage, adaptFrameworks, preserveComments } = options;

    const sourceLanguage = knowledge.language;
    const targetLanguage = targetProject.primaryLanguage;

    let translatedCode = knowledge.content;
    const notes: string[] = [];
    let success = true;
    let confidence = 1.0;

    // Adapt language if needed
    if (adaptLanguage && sourceLanguage && targetLanguage && sourceLanguage !== targetLanguage) {
      try {
        const languageResult = this.translateBetweenLanguages(
          knowledge.content,
          sourceLanguage,
          targetLanguage,
          preserveComments
        );

        translatedCode = languageResult.translatedCode;
        notes.push(...languageResult.notes);
        confidence *= languageResult.confidence;

        if (!languageResult.success) {
          success = false;
          notes.push(`Failed to fully translate from ${sourceLanguage} to ${targetLanguage}.`);
        }
      } catch (error) {
        success = false;
        notes.push(`Error translating between languages: ${error}`);
        confidence *= 0.5;
      }
    }

    // Adapt frameworks if needed
    if (adaptFrameworks && knowledge.compatibility?.frameworks) {
      const sourceFrameworks = knowledge.compatibility.frameworks;
      const targetFrameworks = targetProject.frameworks;

      // Check for framework compatibility
      const commonFrameworks = sourceFrameworks.filter(framework =>
        targetFrameworks.includes(framework)
      );

      if (commonFrameworks.length === 0 && sourceFrameworks.length > 0) {
        notes.push('No common frameworks between source and target projects.');
        notes.push('Framework-specific code may need manual adaptation.');
        confidence *= 0.7;
      } else if (commonFrameworks.length < sourceFrameworks.length) {
        notes.push(
          `Some frameworks used in the original code (${sourceFrameworks.join(', ')}) are not available in the target project (${targetFrameworks.join(', ')}).`
        );
        confidence *= 0.9;
      }
    }

    return {
      translatedCode,
      notes,
      success,
      confidence,
    };
  }

  /**
   * Translate between programming languages
   */
  private translateBetweenLanguages(
    code: string,
    sourceLanguage: string,
    targetLanguage: string,
    preserveComments: boolean
  ): {
    translatedCode: string;
    notes: string[];
    success: boolean;
    confidence: number;
  } {
    // This is a simplified implementation
    // A real implementation would use more sophisticated translation

    const notes: string[] = [];
    let translatedCode = code;
    let success = false;
    let confidence = 0.5;

    // Check for supported language pairs
    const supportedPairs = [
      'javascript-typescript',
      'typescript-javascript',
      'java-csharp',
      'csharp-java',
    ];

    const pair = `${sourceLanguage}-${targetLanguage}`;

    if (!supportedPairs.includes(pair)) {
      notes.push(
        `Translation from ${sourceLanguage} to ${targetLanguage} is not directly supported.`
      );
      notes.push('Consider manual translation for best results.');
      return {
        translatedCode: code,
        notes,
        success: false,
        confidence: 0.3,
      };
    }

    // Perform language-specific translations
    switch (pair) {
      case 'javascript-typescript':
        // Add type annotations
        translatedCode = this.javascriptToTypescript(code);
        notes.push('Added basic type annotations to JavaScript code.');
        notes.push('Review and refine type definitions as needed.');
        success = true;
        confidence = 0.8;
        break;

      case 'typescript-javascript':
        // Remove type annotations
        translatedCode = this.typescriptToJavascript(code);
        notes.push('Removed type annotations from TypeScript code.');
        notes.push('Some TypeScript-specific features may have been simplified.');
        success = true;
        confidence = 0.9;
        break;

      case 'java-csharp':
        // Convert Java to C#
        translatedCode = this.javaToCsharp(code);
        notes.push('Converted Java code to C#.');
        notes.push('Review language-specific APIs and patterns.');
        success = true;
        confidence = 0.7;
        break;

      case 'csharp-java':
        // Convert C# to Java
        translatedCode = this.csharpToJava(code);
        notes.push('Converted C# code to Java.');
        notes.push('Review language-specific APIs and patterns.');
        success = true;
        confidence = 0.7;
        break;
    }

    // Add source code reference as comment
    if (preserveComments) {
      translatedCode = `// Translated from ${sourceLanguage} to ${targetLanguage}\n// Original code:\n/*\n${code}\n*/\n\n${translatedCode}`;
    }

    return {
      translatedCode,
      notes,
      success,
      confidence,
    };
  }

  /**
   * Convert JavaScript to TypeScript
   */
  private javascriptToTypescript(code: string): string {
    // This is a simplified implementation
    let tsCode = code;

    // Add basic type annotations to function parameters
    tsCode = tsCode.replace(/function\s+(\w+)\s*\(([^)]*)\)/g, (match, name, params) => {
      const typedParams = params
        .split(',')
        .map(param => param.trim())
        .filter(param => param)
        .map(param => `${param}: any`)
        .join(', ');

      return `function ${name}(${typedParams}): any`;
    });

    // Add basic type annotations to variables
    tsCode = tsCode.replace(/(const|let|var)\s+(\w+)\s*=/g, '$1 $2: any =');

    return tsCode;
  }

  /**
   * Convert TypeScript to JavaScript
   */
  private typescriptToJavascript(code: string): string {
    // This is a simplified implementation
    let jsCode = code;

    // Remove type annotations from function parameters
    jsCode = jsCode.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*:\s*\w+/g, (match, name, params) => {
      const jsParams = params
        .split(',')
        .map(param => param.trim())
        .filter(param => param)
        .map(param => param.split(':')[0].trim())
        .join(', ');

      return `function ${name}(${jsParams})`;
    });

    // Remove type annotations from variables
    jsCode = jsCode.replace(/(const|let|var)\s+(\w+)\s*:\s*\w+\s*=/g, '$1 $2 =');

    // Remove interface and type declarations
    jsCode = jsCode.replace(/(interface|type)\s+\w+(\s*\{[^}]*\}|\s*=\s*[^;]*);?/g, '');

    return jsCode;
  }

  /**
   * Convert Java to C#
   */
  private javaToCsharp(code: string): string {
    // This is a simplified implementation
    let csharpCode = code;

    // Replace Java package with C# namespace
    csharpCode = csharpCode.replace(/package\s+([^;]+);/g, 'namespace $1');

    // Replace Java imports with C# using statements
    csharpCode = csharpCode.replace(/import\s+([^;]+);/g, 'using $1;');

    // Replace System.out.println with Console.WriteLine
    csharpCode = csharpCode.replace(/System\.out\.println\(/g, 'Console.WriteLine(');

    return csharpCode;
  }

  /**
   * Convert C# to Java
   */
  private csharpToJava(code: string): string {
    // This is a simplified implementation
    let javaCode = code;

    // Replace C# namespace with Java package
    javaCode = javaCode.replace(/namespace\s+([^{]+)/g, 'package $1;');

    // Replace C# using statements with Java imports
    javaCode = javaCode.replace(/using\s+([^;]+);/g, 'import $1;');

    // Replace Console.WriteLine with System.out.println
    javaCode = javaCode.replace(/Console\.WriteLine\(/g, 'System.out.println(');

    return javaCode;
  }

  /**
   * Translate architecture knowledge
   */
  private translateArchitecture(
    knowledge: Knowledge,
    targetProject: ProjectInfo
  ): {
    translatedContent: string;
    notes: string[];
    success: boolean;
    confidence: number;
  } {
    // This is a simplified implementation
    const notes: string[] = [
      'Architecture patterns typically require careful adaptation to the target project.',
      'Consider the specific requirements and constraints of your project.',
    ];

    return {
      translatedContent: knowledge.content,
      notes,
      success: true,
      confidence: 0.7,
    };
  }

  /**
   * Translate solution knowledge
   */
  private async translateSolution(
    knowledge: Knowledge,
    targetProject: ProjectInfo,
    options: {
      adaptLanguage?: boolean;
      adaptFrameworks?: boolean;
      adaptDependencies?: boolean;
    }
  ): Promise<{
    translatedContent: string;
    notes: string[];
    success: boolean;
    confidence: number;
  }> {
    // This is a simplified implementation
    const notes: string[] = [
      'Solution patterns may require adaptation to your specific project context.',
      'Review and test the solution thoroughly before implementing in production.',
    ];

    // For solutions, we might need to translate code snippets within the content
    let translatedContent = knowledge.content;

    // Check if the solution contains code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let match;
    let success = true;
    let confidence = 0.8;

    while ((match = codeBlockRegex.exec(knowledge.content)) !== null) {
      const language = match[1] || knowledge.language || 'unknown';
      const code = match[2];

      // Only translate if language adaptation is requested and languages differ
      if (
        options.adaptLanguage &&
        knowledge.language &&
        targetProject.primaryLanguage &&
        knowledge.language !== targetProject.primaryLanguage
      ) {
        try {
          const translationResult = this.translateBetweenLanguages(
            code,
            knowledge.language,
            targetProject.primaryLanguage,
            true
          );

          if (translationResult.success) {
            translatedContent = translatedContent.replace(
              match[0],
              `\`\`\`${targetProject.primaryLanguage}\n${translationResult.translatedCode}\n\`\`\``
            );

            notes.push(...translationResult.notes);
            confidence *= translationResult.confidence;
          } else {
            success = false;
            notes.push(
              `Failed to translate code block from ${knowledge.language} to ${targetProject.primaryLanguage}.`
            );
            confidence *= 0.7;
          }
        } catch (error) {
          success = false;
          notes.push(`Error translating code block: ${error}`);
          confidence *= 0.6;
        }
      }
    }

    return {
      translatedContent,
      notes,
      success,
      confidence,
    };
  }
}
