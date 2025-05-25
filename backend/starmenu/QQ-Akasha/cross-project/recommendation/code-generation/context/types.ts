/**
 * Types for the context extraction module
 */

import { ProgrammingLanguage } from '../templates/types';

/**
 * Code element type
 */
export enum CodeElementType {
  VARIABLE = 'variable',
  FUNCTION = 'function',
  CLASS = 'class',
  INTERFACE = 'interface',
  ENUM = 'enum',
  TYPE = 'type',
  IMPORT = 'import',
  EXPORT = 'export',
  NAMESPACE = 'namespace',
  MODULE = 'module',
  PROPERTY = 'property',
  METHOD = 'method',
  PARAMETER = 'parameter',
  DECORATOR = 'decorator',
  COMMENT = 'comment',
  STATEMENT = 'statement',
  EXPRESSION = 'expression',
}

/**
 * Code element scope
 */
export enum CodeElementScope {
  GLOBAL = 'global',
  MODULE = 'module',
  NAMESPACE = 'namespace',
  CLASS = 'class',
  FUNCTION = 'function',
  BLOCK = 'block',
  LOCAL = 'local',
}

/**
 * Code element visibility
 */
export enum CodeElementVisibility {
  PUBLIC = 'public',
  PROTECTED = 'protected',
  PRIVATE = 'private',
  INTERNAL = 'internal',
  PACKAGE = 'package',
}

/**
 * Code element
 */
export interface CodeElement {
  /** Element type */
  type: CodeElementType;

  /** Element name */
  name: string;

  /** Element value or content */
  value?: string;

  /** Element data type */
  dataType?: string;

  /** Element scope */
  scope: CodeElementScope;

  /** Element visibility */
  visibility?: CodeElementVisibility;

  /** Start position in the file */
  startPosition: {
    line: number;
    column: number;
  };

  /** End position in the file */
  endPosition: {
    line: number;
    column: number;
  };

  /** Parent element ID */
  parentId?: string;

  /** Element ID */
  id: string;

  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Import declaration
 */
export interface ImportDeclaration {
  /** Import source */
  source: string;

  /** Imported elements */
  elements: string[];

  /** Default import name */
  defaultImport?: string;

  /** Namespace import name */
  namespaceImport?: string;

  /** Whether it's a type-only import */
  isTypeOnly?: boolean;

  /** Start position in the file */
  startPosition: {
    line: number;
    column: number;
  };

  /** End position in the file */
  endPosition: {
    line: number;
    column: number;
  };
}

/**
 * Code style
 */
export interface CodeStyle {
  /** Indentation type */
  indentationType: 'space' | 'tab';

  /** Indentation size */
  indentationSize: number;

  /** Line ending */
  lineEnding: 'lf' | 'crlf';

  /** Maximum line length */
  maxLineLength?: number;

  /** Whether to use semicolons */
  useSemicolons?: boolean;

  /** Whether to use trailing commas */
  useTrailingCommas?: boolean;

  /** Quote style */
  quoteStyle?: 'single' | 'double';

  /** Bracket style */
  bracketStyle?: 'same-line' | 'new-line';

  /** Additional style rules */
  additionalRules?: Record<string, any>;
}

/**
 * Naming convention
 */
export interface NamingConvention {
  /** Variable naming convention */
  variables: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Function naming convention */
  functions: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Class naming convention */
  classes: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Interface naming convention */
  interfaces: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Enum naming convention */
  enums: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Constant naming convention */
  constants: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other';

  /** Private member naming convention */
  privateMembers: 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | '_prefixed' | 'other';

  /** Additional naming conventions */
  additional?: Record<string, 'camelCase' | 'snake_case' | 'PascalCase' | 'UPPER_CASE' | 'other'>;
}

/**
 * File context
 */
export interface FileContext {
  /** File path */
  filePath: string;

  /** File content */
  content: string;

  /** Programming language */
  language: ProgrammingLanguage;

  /** Code elements in the file */
  elements: CodeElement[];

  /** Imports in the file */
  imports: ImportDeclaration[];

  /** Code style */
  style: CodeStyle;

  /** Naming conventions */
  namingConventions: NamingConvention;

  /** Current cursor position */
  cursorPosition?: {
    line: number;
    column: number;
  };

  /** Current selection */
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    text: string;
  };

  /** Current scope at cursor position */
  currentScope?: CodeElement;

  /** Variables in scope at cursor position */
  variablesInScope?: CodeElement[];

  /** Functions in scope at cursor position */
  functionsInScope?: CodeElement[];

  /** Classes in scope at cursor position */
  classesInScope?: CodeElement[];

  /** Interfaces in scope at cursor position */
  interfacesInScope?: CodeElement[];

  /** Types in scope at cursor position */
  typesInScope?: CodeElement[];

  /** Additional context */
  additionalContext?: Record<string, any>;
}

/**
 * Project context
 */
export interface ProjectContext {
  /** Project root path */
  rootPath: string;

  /** Project name */
  name: string;

  /** Project type */
  type: 'node' | 'web' | 'mobile' | 'desktop' | 'library' | 'other';

  /** Project dependencies */
  dependencies: Record<string, string>;

  /** Project dev dependencies */
  devDependencies: Record<string, string>;

  /** Project scripts */
  scripts: Record<string, string>;

  /** Project configuration files */
  configFiles: string[];

  /** Project source files */
  sourceFiles: string[];

  /** Project test files */
  testFiles: string[];

  /** Project documentation files */
  documentationFiles: string[];

  /** Project structure */
  structure: Record<string, any>;

  /** Additional project context */
  additionalContext?: Record<string, any>;
}

/**
 * Context extraction result
 */
export interface ContextExtractionResult {
  /** File context */
  fileContext: FileContext;

  /** Project context */
  projectContext?: ProjectContext;

  /** Extraction errors */
  errors: string[];

  /** Extraction warnings */
  warnings: string[];
}
