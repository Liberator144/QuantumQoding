/**
 * Language processor registry
 */

import { LanguageProcessorRegistry } from './types';
import { TypeScriptProcessor } from './typescript-processor';
import { PythonProcessor } from './python-processor';
import { JavaProcessor } from './java-processor';
import { ProgrammingLanguage } from '../templates/types';

/**
 * Create and initialize a language processor registry
 */
export function createLanguageProcessorRegistry(): LanguageProcessorRegistry {
  const registry = new LanguageProcessorRegistry();

  // Register TypeScript processor
  registry.registerProcessor(new TypeScriptProcessor());

  // Register Python processor
  registry.registerProcessor(new PythonProcessor());

  // Register Java processor
  registry.registerProcessor(new JavaProcessor());

  return registry;
}

/**
 * Get a language processor for a specific language
 */
export function getLanguageProcessor(language: ProgrammingLanguage): any {
  const registry = createLanguageProcessorRegistry();
  return registry.getProcessor(language);
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(language: ProgrammingLanguage): boolean {
  const registry = createLanguageProcessorRegistry();
  return registry.isLanguageSupported(language);
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): ProgrammingLanguage[] {
  const registry = createLanguageProcessorRegistry();
  return registry.getSupportedLanguages();
}

/**
 * Process a template for a specific language
 */
export function processTemplate(
  template: string,
  language: ProgrammingLanguage,
  context: any
): string {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    throw new Error(`Language processor not found for language: ${language}`);
  }

  return processor.processTemplate(template, context);
}

/**
 * Validate syntax for a specific language
 */
export function validateSyntax(
  code: string,
  language: ProgrammingLanguage
): { valid: boolean; errors: string[] } {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    return {
      valid: false,
      errors: [`Language processor not found for language: ${language}`],
    };
  }

  return processor.validateSyntax(code);
}

/**
 * Format code for a specific language
 */
export function formatCode(code: string, language: ProgrammingLanguage, style?: any): string {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    return code; // Return unformatted code if processor not found
  }

  return processor.formatCode(code, style);
}

/**
 * Extract imports from code for a specific language
 */
export function extractImports(
  code: string,
  language: ProgrammingLanguage
): { imports: string[]; code: string } {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    return {
      imports: [],
      code,
    };
  }

  return processor.extractImports(code);
}

/**
 * Add imports to code for a specific language
 */
export function addImports(code: string, imports: string[], language: ProgrammingLanguage): string {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    return code; // Return original code if processor not found
  }

  return processor.addImports(code, imports);
}

/**
 * Get style guide for a specific language
 */
export function getStyleGuide(language: ProgrammingLanguage): any {
  const processor = getLanguageProcessor(language);

  if (!processor) {
    return null;
  }

  return processor.getStyleGuide();
}
