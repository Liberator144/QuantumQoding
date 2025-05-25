/**
 * Types for multi-file context analysis
 */

import { CodeElement, FileContext, ImportDeclaration } from '../types';
import { ProgrammingLanguage } from '../../templates/types';

/**
 * Project file information
 */
export interface ProjectFile {
  /** File path */
  path: string;

  /** File content */
  content: string;

  /** Programming language */
  language: ProgrammingLanguage;

  /** Last modified timestamp */
  lastModified: Date;

  /** File size in bytes */
  size: number;
}

/**
 * Symbol information
 */
export interface Symbol {
  /** Symbol name */
  name: string;

  /** Symbol type */
  type: string;

  /** Symbol location */
  location: {
    /** File path */
    filePath: string;

    /** Start line */
    startLine: number;

    /** Start column */
    startColumn: number;

    /** End line */
    endLine: number;

    /** End column */
    endColumn: number;
  };

  /** Symbol scope */
  scope: string;

  /** Symbol visibility */
  visibility?: string;

  /** Symbol data type */
  dataType?: string;

  /** Symbol documentation */
  documentation?: string;

  /** Symbol references */
  references?: SymbolReference[];
}

/**
 * Symbol reference
 */
export interface SymbolReference {
  /** File path */
  filePath: string;

  /** Line number */
  line: number;

  /** Column number */
  column: number;

  /** Reference type (e.g., 'call', 'read', 'write', 'import') */
  type: string;
}

/**
 * Dependency information
 */
export interface Dependency {
  /** Source file path */
  source: string;

  /** Target file path */
  target: string;

  /** Dependency type */
  type: 'import' | 'reference' | 'inheritance' | 'implementation' | 'other';

  /** Imported symbols (if type is 'import') */
  importedSymbols?: string[];

  /** Referenced symbols (if type is 'reference') */
  referencedSymbols?: string[];

  /** Strength of dependency (0-1) */
  strength?: number;
}

/**
 * Dependency graph
 */
export interface DependencyGraph {
  /** Nodes (files) */
  nodes: ProjectFile[];

  /** Edges (dependencies) */
  edges: Dependency[];
}

/**
 * Symbol table
 */
export interface SymbolTable {
  /** Symbols by name */
  byName: Map<string, Symbol[]>;

  /** Symbols by file */
  byFile: Map<string, Symbol[]>;

  /** Symbols by type */
  byType: Map<string, Symbol[]>;
}

/**
 * Multi-file context
 */
export interface MultiFileContext {
  /** Project files */
  files: Map<string, ProjectFile>;

  /** File contexts */
  fileContexts: Map<string, FileContext>;

  /** Symbol table */
  symbolTable: SymbolTable;

  /** Dependency graph */
  dependencyGraph: DependencyGraph;

  /** Current file path */
  currentFilePath?: string;

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
}

/**
 * Multi-file context extraction options
 */
export interface MultiFileContextExtractionOptions {
  /** Maximum number of files to analyze */
  maxFiles?: number;

  /** Maximum depth of dependency analysis */
  maxDepth?: number;

  /** Whether to analyze imports */
  analyzeImports?: boolean;

  /** Whether to analyze references */
  analyzeReferences?: boolean;

  /** Whether to analyze inheritance */
  analyzeInheritance?: boolean;

  /** Whether to analyze implementations */
  analyzeImplementations?: boolean;

  /** File patterns to include */
  includePatterns?: string[];

  /** File patterns to exclude */
  excludePatterns?: string[];
}

/**
 * Multi-file context extraction result
 */
export interface MultiFileContextExtractionResult {
  /** Multi-file context */
  context: MultiFileContext;

  /** Extraction errors */
  errors: string[];

  /** Extraction warnings */
  warnings: string[];
}
