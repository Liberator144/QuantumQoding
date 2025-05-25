/**
 * Types for the code template system
 */

/**
 * Supported programming languages
 */
export enum ProgrammingLanguage {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  PYTHON = 'python',
  JAVA = 'java',
  CSHARP = 'csharp',
  GO = 'go',
  RUST = 'rust',
  CPP = 'cpp',
  PHP = 'php',
  RUBY = 'ruby',
  SWIFT = 'swift',
  KOTLIN = 'kotlin',
  HTML = 'html',
  CSS = 'css',
  SQL = 'sql',
  SHELL = 'shell',
  MARKDOWN = 'markdown',
  JSON = 'json',
  YAML = 'yaml',
  XML = 'xml',
}

/**
 * Template variable types
 */
export enum VariableType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  IDENTIFIER = 'identifier',
  TYPE = 'type',
  EXPRESSION = 'expression',
  STATEMENT = 'statement',
  BLOCK = 'block',
  IMPORT = 'import',
  PARAMETER = 'parameter',
  ARGUMENT = 'argument',
  PROPERTY = 'property',
  METHOD = 'method',
  CLASS = 'class',
  INTERFACE = 'interface',
  ENUM = 'enum',
  FUNCTION = 'function',
  VARIABLE = 'variable',
  CUSTOM = 'custom',
}

/**
 * Template category
 */
export enum TemplateCategory {
  FUNCTION = 'function',
  CLASS = 'class',
  INTERFACE = 'interface',
  MODULE = 'module',
  COMPONENT = 'component',
  UTILITY = 'utility',
  DATA_STRUCTURE = 'data-structure',
  ALGORITHM = 'algorithm',
  PATTERN = 'pattern',
  TEST = 'test',
  DOCUMENTATION = 'documentation',
  CONFIGURATION = 'configuration',
  SNIPPET = 'snippet',
}

/**
 * Template variable definition
 */
export interface TemplateVariable {
  /** Variable name */
  name: string;

  /** Variable type */
  type: VariableType;

  /** Variable description */
  description: string;

  /** Default value */
  defaultValue?: string;

  /** Whether the variable is required */
  required?: boolean;

  /** Validation pattern (regex) */
  validationPattern?: string;

  /** Example values */
  examples?: string[];

  /** Possible values for enum-like variables */
  possibleValues?: string[];

  /** Custom properties for specific variable types */
  customProperties?: Record<string, any>;
}

/**
 * Template definition
 */
export interface CodeTemplate {
  /** Template ID */
  id: string;

  /** Template name */
  name: string;

  /** Template description */
  description: string;

  /** Programming language */
  language: ProgrammingLanguage;

  /** Template category */
  category: TemplateCategory;

  /** Template content with variable placeholders */
  content: string;

  /** Template variables */
  variables: TemplateVariable[];

  /** Template tags */
  tags: string[];

  /** Template version */
  version: string;

  /** Template author */
  author?: string;

  /** When the template was created */
  createdAt: Date;

  /** When the template was last updated */
  updatedAt: Date;

  /** Template usage count */
  usageCount?: number;

  /** Template rating (0-5) */
  rating?: number;

  /** Dependencies required by this template */
  dependencies?: string[];

  /** Related templates */
  relatedTemplates?: string[];

  /** Documentation URL */
  documentationUrl?: string;

  /** Example usage */
  exampleUsage?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Template repository settings
 */
export interface TemplateRepositorySettings {
  /** Repository name */
  name: string;

  /** Repository description */
  description: string;

  /** Repository location */
  location: string;

  /** Whether to enable template versioning */
  enableVersioning: boolean;

  /** Whether to enable template sharing */
  enableSharing: boolean;

  /** Whether to enable template rating */
  enableRating: boolean;

  /** Whether to enable template usage tracking */
  enableUsageTracking: boolean;

  /** Default template author */
  defaultAuthor?: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  /** Whether the template is valid */
  valid: boolean;

  /** Validation errors */
  errors: string[];

  /** Validation warnings */
  warnings: string[];
}

/**
 * Template variable substitution result
 */
export interface VariableSubstitutionResult {
  /** Whether the substitution was successful */
  success: boolean;

  /** Generated code */
  generatedCode: string;

  /** Substitution errors */
  errors: string[];

  /** Substitution warnings */
  warnings: string[];

  /** Variables that were substituted */
  substitutedVariables: Record<string, string>;

  /** Variables that were not substituted */
  missingVariables: string[];
}
