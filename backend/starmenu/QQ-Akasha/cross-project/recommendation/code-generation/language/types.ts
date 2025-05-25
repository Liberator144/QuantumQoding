/**
 * Types for language-specific code generation
 */

import { ProgrammingLanguage } from '../templates/types';
import { FileContext } from '../context/types';

/**
 * Language-specific template processor
 */
export interface LanguageProcessor {
  /** Language supported by this processor */
  language: ProgrammingLanguage;

  /** Process a template for this language */
  processTemplate(template: string, context: FileContext): string;

  /** Validate syntax for this language */
  validateSyntax(code: string): { valid: boolean; errors: string[] };

  /** Format code according to language conventions */
  formatCode(code: string, style?: LanguageStyle): string;

  /** Extract imports from code */
  extractImports(code: string): { imports: string[]; code: string };

  /** Add imports to code */
  addImports(code: string, imports: string[]): string;

  /** Get language-specific style guide */
  getStyleGuide(): LanguageStyleGuide;
}

/**
 * Language style options
 */
export interface LanguageStyle {
  /** Indentation type */
  indentType: 'space' | 'tab';

  /** Indentation size */
  indentSize: number;

  /** Maximum line length */
  maxLineLength: number;

  /** Whether to use semicolons (for languages where they're optional) */
  useSemicolons?: boolean;

  /** Quote style */
  quoteStyle?: 'single' | 'double';

  /** Brace style */
  braceStyle?: 'same-line' | 'new-line';

  /** Array bracket spacing */
  arrayBracketSpacing?: boolean;

  /** Object curly spacing */
  objectCurlySpacing?: boolean;

  /** Trailing commas */
  trailingCommas?: 'none' | 'es5' | 'all';

  /** Additional language-specific options */
  [key: string]: any;
}

/**
 * Default language style
 */
export const DEFAULT_LANGUAGE_STYLE: LanguageStyle = {
  indentType: 'space',
  indentSize: 2,
  maxLineLength: 80,
  useSemicolons: true,
  quoteStyle: 'single',
  braceStyle: 'same-line',
  arrayBracketSpacing: true,
  objectCurlySpacing: true,
  trailingCommas: 'es5',
};

/**
 * Language style guide
 */
export interface LanguageStyleGuide {
  /** Naming conventions */
  namingConventions: {
    /** Class naming convention */
    classes: string;

    /** Interface naming convention */
    interfaces: string;

    /** Method naming convention */
    methods: string;

    /** Function naming convention */
    functions: string;

    /** Variable naming convention */
    variables: string;

    /** Constant naming convention */
    constants: string;

    /** Parameter naming convention */
    parameters: string;

    /** Property naming convention */
    properties: string;

    /** Enum naming convention */
    enums: string;

    /** Enum member naming convention */
    enumMembers: string;
  };

  /** Code organization */
  codeOrganization: {
    /** Import order */
    importOrder: string[];

    /** Class member order */
    classMemberOrder: string[];

    /** File structure */
    fileStructure: string[];
  };

  /** Documentation */
  documentation: {
    /** Comment style */
    commentStyle: 'block' | 'line' | 'jsdoc' | 'javadoc' | 'docstring';

    /** Required documentation elements */
    requiredElements: string[];

    /** Example documentation */
    examples: Record<string, string>;
  };

  /** Best practices */
  bestPractices: string[];

  /** Common patterns */
  commonPatterns: Record<string, string>;

  /** Anti-patterns to avoid */
  antiPatterns: string[];
}

/**
 * Language processor registry
 */
export class LanguageProcessorRegistry {
  private processors: Map<ProgrammingLanguage, LanguageProcessor> = new Map();

  /**
   * Register a language processor
   */
  registerProcessor(processor: LanguageProcessor): void {
    this.processors.set(processor.language, processor);
  }

  /**
   * Get a language processor
   */
  getProcessor(language: ProgrammingLanguage): LanguageProcessor | undefined {
    return this.processors.get(language);
  }

  /**
   * Check if a language is supported
   */
  isLanguageSupported(language: ProgrammingLanguage): boolean {
    return this.processors.has(language);
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): ProgrammingLanguage[] {
    return Array.from(this.processors.keys());
  }

  /**
   * Get all registered processors
   */
  getAllProcessors(): LanguageProcessor[] {
    return Array.from(this.processors.values());
  }
}
