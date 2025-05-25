/**
 * Code generation engine for generating code from templates and context
 */

// Types
export * from './types';

// Template selector
export * from './template-selector';

// Pattern-based template selector
export * from './pattern-template-selector';

// Variable extractor
export * from './variable-extractor';

// Code generator
export * from './code-generator';

// Pattern-based code generator
export * from './pattern-code-generator';

// Code formatter
export * from './code-formatter';

// Code validator
export * from './code-validator';

// Import manager
export * from './import-manager';

// Multi-file code generator
export * from './multi-file-code-generator';

// Re-export language-specific functionality
export { detectLanguage, LanguageDetectionResult } from '../language/language-detector';

export {
  LanguageProcessor,
  LanguageStyle,
  LanguageStyleGuide,
  LanguageProcessorRegistry,
} from '../language/types';

export {
  createLanguageProcessorRegistry,
  getLanguageProcessor,
  isLanguageSupported,
  getSupportedLanguages,
  processTemplate as processLanguageTemplate,
  validateSyntax as validateLanguageSyntax,
  formatCode as formatLanguageCode,
} from '../language/processor-registry';
