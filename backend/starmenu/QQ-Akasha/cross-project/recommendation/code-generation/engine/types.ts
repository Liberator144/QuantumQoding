/**
 * Types for the code generation engine
 */

import {
  CodeTemplate,
  ProgrammingLanguage,
  TemplateCategory,
  VariableSubstitutionResult,
} from '../templates/types';
import { ContextExtractionResult, FileContext } from '../context/types';
import { MultiFileContextExtractionResult } from '../context/multi-file/types';

/**
 * Code generation result
 */
export interface CodeGenerationResult {
  /** Whether the generation was successful */
  success: boolean;

  /** Generated code */
  generatedCode: string;

  /** Template used for generation */
  template: CodeTemplate;

  /** Variable substitution result */
  substitutionResult: VariableSubstitutionResult;

  /** Context used for generation */
  context: ContextExtractionResult | MultiFileContextExtractionResult;

  /** Generation errors */
  errors: string[];

  /** Generation warnings */
  warnings: string[];
}

/**
 * Template selection criteria
 */
export interface TemplateSelectionCriteria {
  /** Programming language */
  language?: ProgrammingLanguage;

  /** Template category */
  category?: TemplateCategory;

  /** Template tags (must include all) */
  tags?: string[];

  /** Search term */
  searchTerm?: string;

  /** Minimum rating */
  minRating?: number;

  /** Maximum number of results */
  limit?: number;
}

/**
 * Template selection result
 */
export interface TemplateSelectionResult {
  /** Selected templates */
  templates: CodeTemplate[];

  /** Selection errors */
  errors: string[];

  /** Selection warnings */
  warnings: string[];
}

/**
 * Code generation options
 */
export interface CodeGenerationOptions {
  /** Whether to format the generated code */
  formatCode?: boolean;

  /** Whether to validate the generated code */
  validateCode?: boolean;

  /** Whether to add imports automatically */
  addImports?: boolean;

  /** Whether to add comments */
  addComments?: boolean;

  /** Whether to use default values for missing variables */
  useDefaultValues?: boolean;

  /** Whether to throw an error for missing variables */
  errorOnMissing?: boolean;

  /** Whether to use multi-file context */
  useMultiFileContext?: boolean;

  /** Whether to validate cross-file consistency */
  validateCrossFileConsistency?: boolean;

  /** Custom formatter function */
  formatter?: (code: string, language: string) => string;

  /** Custom validator function */
  validator?: (code: string, language: string) => { valid: boolean; errors: string[] };
}

/**
 * Default code generation options
 */
export const DEFAULT_CODE_GENERATION_OPTIONS: CodeGenerationOptions = {
  formatCode: true,
  validateCode: true,
  addImports: true,
  addComments: true,
  useDefaultValues: true,
  errorOnMissing: false,
  useMultiFileContext: false,
  validateCrossFileConsistency: false,
};
