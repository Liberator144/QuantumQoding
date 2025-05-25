/**
 * Symbol resolver for resolving symbols across multiple files
 */

import { MultiFileContext, Symbol, SymbolReference } from './types';
import { CodeElement, CodeElementType } from '../types';

/**
 * Symbol resolution options
 */
export interface SymbolResolutionOptions {
  /** Whether to include local symbols */
  includeLocal?: boolean;

  /** Whether to include imported symbols */
  includeImported?: boolean;

  /** Whether to include global symbols */
  includeGlobal?: boolean;

  /** Symbol types to include */
  includeTypes?: string[];

  /** Symbol types to exclude */
  excludeTypes?: string[];
}

/**
 * Default symbol resolution options
 */
const DEFAULT_RESOLUTION_OPTIONS: SymbolResolutionOptions = {
  includeLocal: true,
  includeImported: true,
  includeGlobal: true,
  includeTypes: [],
  excludeTypes: [],
};

/**
 * Symbol resolution result
 */
export interface SymbolResolutionResult {
  /** Resolved symbols */
  symbols: Symbol[];

  /** Resolution errors */
  errors: string[];

  /** Resolution warnings */
  warnings: string[];
}

/**
 * Resolve symbol by name
 */
export function resolveSymbolByName(
  name: string,
  context: MultiFileContext,
  options: SymbolResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): SymbolResolutionResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const symbols: Symbol[] = [];

  try {
    // Merge options with defaults
    const mergedOptions: SymbolResolutionOptions = {
      ...DEFAULT_RESOLUTION_OPTIONS,
      ...options,
    };

    // Get current file path
    const currentFilePath = context.currentFilePath;

    if (!currentFilePath) {
      errors.push('No current file path specified');
      return { symbols, errors, warnings };
    }

    // Get current file context
    const currentFileContext = context.fileContexts.get(currentFilePath);

    if (!currentFileContext) {
      errors.push(`No context found for current file: ${currentFilePath}`);
      return { symbols, errors, warnings };
    }

    // Check if symbol exists in current file
    if (mergedOptions.includeLocal) {
      const localSymbols = context.symbolTable.byFile.get(currentFilePath) || [];
      const matchingLocalSymbols = localSymbols.filter(s => s.name === name);

      if (matchingLocalSymbols.length > 0) {
        // Filter by type if specified
        const filteredSymbols = filterSymbolsByType(matchingLocalSymbols, mergedOptions);
        symbols.push(...filteredSymbols);
      }
    }

    // Check if symbol is imported
    if (mergedOptions.includeImported && symbols.length === 0) {
      const importedSymbols = getImportedSymbols(context, currentFilePath);
      const matchingImportedSymbols = importedSymbols.filter(s => s.name === name);

      if (matchingImportedSymbols.length > 0) {
        // Filter by type if specified
        const filteredSymbols = filterSymbolsByType(matchingImportedSymbols, mergedOptions);
        symbols.push(...filteredSymbols);
      }
    }

    // Check if symbol exists in global scope
    if (mergedOptions.includeGlobal && symbols.length === 0) {
      const globalSymbols = getGlobalSymbols(context);
      const matchingGlobalSymbols = globalSymbols.filter(s => s.name === name);

      if (matchingGlobalSymbols.length > 0) {
        // Filter by type if specified
        const filteredSymbols = filterSymbolsByType(matchingGlobalSymbols, mergedOptions);
        symbols.push(...filteredSymbols);
      }
    }

    // If no symbols found, check all files
    if (symbols.length === 0) {
      const allSymbols = context.symbolTable.byName.get(name) || [];

      if (allSymbols.length > 0) {
        // Filter by type if specified
        const filteredSymbols = filterSymbolsByType(allSymbols, mergedOptions);
        symbols.push(...filteredSymbols);

        if (filteredSymbols.length > 0) {
          warnings.push(`Symbol '${name}' found in other files but not in current file or imports`);
        }
      }
    }

    return { symbols, errors, warnings };
  } catch (error) {
    errors.push(`Failed to resolve symbol '${name}': ${error}`);
    return { symbols, errors, warnings };
  }
}

/**
 * Resolve symbol by type
 */
export function resolveSymbolsByType(
  type: string,
  context: MultiFileContext,
  options: SymbolResolutionOptions = DEFAULT_RESOLUTION_OPTIONS
): SymbolResolutionResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const symbols: Symbol[] = [];

  try {
    // Merge options with defaults
    const mergedOptions: SymbolResolutionOptions = {
      ...DEFAULT_RESOLUTION_OPTIONS,
      ...options,
    };

    // Get current file path
    const currentFilePath = context.currentFilePath;

    if (!currentFilePath) {
      errors.push('No current file path specified');
      return { symbols, errors, warnings };
    }

    // Get current file context
    const currentFileContext = context.fileContexts.get(currentFilePath);

    if (!currentFileContext) {
      errors.push(`No context found for current file: ${currentFilePath}`);
      return { symbols, errors, warnings };
    }

    // Check if symbols of the specified type exist in current file
    if (mergedOptions.includeLocal) {
      const localSymbols = context.symbolTable.byFile.get(currentFilePath) || [];
      const matchingLocalSymbols = localSymbols.filter(s => s.type === type);
      symbols.push(...matchingLocalSymbols);
    }

    // Check if symbols of the specified type are imported
    if (mergedOptions.includeImported) {
      const importedSymbols = getImportedSymbols(context, currentFilePath);
      const matchingImportedSymbols = importedSymbols.filter(s => s.type === type);

      // Add imported symbols that are not already in the list
      for (const symbol of matchingImportedSymbols) {
        if (
          !symbols.some(
            s => s.name === symbol.name && s.location.filePath === symbol.location.filePath
          )
        ) {
          symbols.push(symbol);
        }
      }
    }

    // Check if symbols of the specified type exist in global scope
    if (mergedOptions.includeGlobal) {
      const globalSymbols = getGlobalSymbols(context);
      const matchingGlobalSymbols = globalSymbols.filter(s => s.type === type);

      // Add global symbols that are not already in the list
      for (const symbol of matchingGlobalSymbols) {
        if (
          !symbols.some(
            s => s.name === symbol.name && s.location.filePath === symbol.location.filePath
          )
        ) {
          symbols.push(symbol);
        }
      }
    }

    return { symbols, errors, warnings };
  } catch (error) {
    errors.push(`Failed to resolve symbols of type '${type}': ${error}`);
    return { symbols, errors, warnings };
  }
}

/**
 * Find references to a symbol
 */
export function findReferences(symbol: Symbol, context: MultiFileContext): SymbolReference[] {
  const references: SymbolReference[] = [];

  // This is a placeholder implementation
  // In a real implementation, this would search for references to the symbol
  // across all files in the context

  return references;
}

/**
 * Get imported symbols for a file
 */
function getImportedSymbols(context: MultiFileContext, filePath: string): Symbol[] {
  const importedSymbols: Symbol[] = [];
  const fileContext = context.fileContexts.get(filePath);

  if (!fileContext) {
    return importedSymbols;
  }

  // Get dependencies where this file is the source
  const dependencies = context.dependencyGraph.edges.filter(
    edge => edge.source === filePath && edge.type === 'import'
  );

  for (const dependency of dependencies) {
    const targetFile = dependency.target;
    const importedSymbolNames = dependency.importedSymbols || [];

    // Get symbols from target file
    const targetFileSymbols = context.symbolTable.byFile.get(targetFile) || [];

    // If no specific symbols are imported, assume all are imported
    if (importedSymbolNames.length === 0) {
      importedSymbols.push(...targetFileSymbols);
    } else {
      // Add only the imported symbols
      for (const symbolName of importedSymbolNames) {
        const matchingSymbols = targetFileSymbols.filter(s => s.name === symbolName);
        importedSymbols.push(...matchingSymbols);
      }
    }
  }

  return importedSymbols;
}

/**
 * Get global symbols
 */
function getGlobalSymbols(context: MultiFileContext): Symbol[] {
  const globalSymbols: Symbol[] = [];

  // This is a simplified implementation
  // In a real implementation, this would return symbols from global scope
  // such as built-in types, global variables, etc.

  return globalSymbols;
}

/**
 * Filter symbols by type
 */
function filterSymbolsByType(symbols: Symbol[], options: SymbolResolutionOptions): Symbol[] {
  if (!options.includeTypes || options.includeTypes.length === 0) {
    // If no types specified, include all types except excluded ones
    if (!options.excludeTypes || options.excludeTypes.length === 0) {
      return symbols;
    }

    return symbols.filter(s => !options.excludeTypes!.includes(s.type));
  }

  // Include only specified types, but exclude excluded types
  return symbols.filter(
    s =>
      options.includeTypes!.includes(s.type) &&
      (!options.excludeTypes || !options.excludeTypes.includes(s.type))
  );
}
