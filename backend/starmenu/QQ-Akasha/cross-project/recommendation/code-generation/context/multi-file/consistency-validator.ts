/**
 * Cross-file consistency validator for validating consistency across multiple files
 */

import { MultiFileContext, Symbol } from './types';
import { CodeElement, CodeElementType } from '../types';
import { findCycles } from './dependency-analyzer';

/**
 * Consistency validation options
 */
export interface ConsistencyValidationOptions {
  /** Whether to validate naming conventions */
  validateNamingConventions?: boolean;

  /** Whether to validate import consistency */
  validateImportConsistency?: boolean;

  /** Whether to validate dependency cycles */
  validateDependencyCycles?: boolean;

  /** Whether to validate symbol usage */
  validateSymbolUsage?: boolean;

  /** Whether to validate inheritance consistency */
  validateInheritanceConsistency?: boolean;
}

/**
 * Default consistency validation options
 */
const DEFAULT_VALIDATION_OPTIONS: ConsistencyValidationOptions = {
  validateNamingConventions: true,
  validateImportConsistency: true,
  validateDependencyCycles: true,
  validateSymbolUsage: true,
  validateInheritanceConsistency: true,
};

/**
 * Consistency validation result
 */
export interface ConsistencyValidationResult {
  /** Whether the validation passed */
  valid: boolean;

  /** Validation errors */
  errors: string[];

  /** Validation warnings */
  warnings: string[];

  /** Validation details */
  details: {
    /** Naming convention issues */
    namingConventionIssues?: {
      filePath: string;
      symbolName: string;
      expectedConvention: string;
      actualConvention: string;
    }[];

    /** Import consistency issues */
    importConsistencyIssues?: {
      filePath: string;
      importSource: string;
      issue: string;
    }[];

    /** Dependency cycle issues */
    dependencyCycleIssues?: {
      cycle: string[];
      issue: string;
    }[];

    /** Symbol usage issues */
    symbolUsageIssues?: {
      filePath: string;
      symbolName: string;
      issue: string;
    }[];

    /** Inheritance consistency issues */
    inheritanceConsistencyIssues?: {
      filePath: string;
      className: string;
      issue: string;
    }[];
  };
}

/**
 * Validate cross-file consistency
 */
export function validateConsistency(
  context: MultiFileContext,
  options: ConsistencyValidationOptions = DEFAULT_VALIDATION_OPTIONS
): ConsistencyValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details: ConsistencyValidationResult['details'] = {};

  try {
    // Merge options with defaults
    const mergedOptions: ConsistencyValidationOptions = {
      ...DEFAULT_VALIDATION_OPTIONS,
      ...options,
    };

    // Validate naming conventions
    if (mergedOptions.validateNamingConventions) {
      details.namingConventionIssues = validateNamingConventions(context);

      if (details.namingConventionIssues.length > 0) {
        warnings.push(`Found ${details.namingConventionIssues.length} naming convention issues`);
      }
    }

    // Validate import consistency
    if (mergedOptions.validateImportConsistency) {
      details.importConsistencyIssues = validateImportConsistency(context);

      if (details.importConsistencyIssues.length > 0) {
        warnings.push(`Found ${details.importConsistencyIssues.length} import consistency issues`);
      }
    }

    // Validate dependency cycles
    if (mergedOptions.validateDependencyCycles) {
      details.dependencyCycleIssues = validateDependencyCycles(context);

      if (details.dependencyCycleIssues.length > 0) {
        errors.push(`Found ${details.dependencyCycleIssues.length} dependency cycle issues`);
      }
    }

    // Validate symbol usage
    if (mergedOptions.validateSymbolUsage) {
      details.symbolUsageIssues = validateSymbolUsage(context);

      if (details.symbolUsageIssues.length > 0) {
        warnings.push(`Found ${details.symbolUsageIssues.length} symbol usage issues`);
      }
    }

    // Validate inheritance consistency
    if (mergedOptions.validateInheritanceConsistency) {
      details.inheritanceConsistencyIssues = validateInheritanceConsistency(context);

      if (details.inheritanceConsistencyIssues.length > 0) {
        errors.push(
          `Found ${details.inheritanceConsistencyIssues.length} inheritance consistency issues`
        );
      }
    }

    // Determine if validation passed
    const valid = errors.length === 0;

    return { valid, errors, warnings, details };
  } catch (error) {
    errors.push(`Failed to validate consistency: ${error}`);
    return { valid: false, errors, warnings, details };
  }
}

/**
 * Validate naming conventions
 */
function validateNamingConventions(context: MultiFileContext): {
  filePath: string;
  symbolName: string;
  expectedConvention: string;
  actualConvention: string;
}[] {
  const issues: {
    filePath: string;
    symbolName: string;
    expectedConvention: string;
    actualConvention: string;
  }[] = [];

  // Get all files
  for (const [filePath, fileContext] of context.fileContexts.entries()) {
    // Get naming conventions for the file
    const namingConventions = fileContext.namingConventions;

    // Check each symbol in the file
    for (const element of fileContext.elements) {
      let expectedConvention = '';

      // Determine expected naming convention based on element type
      switch (element.type) {
        case CodeElementType.CLASS:
          expectedConvention = namingConventions.classes;
          break;

        case CodeElementType.INTERFACE:
          expectedConvention = namingConventions.interfaces;
          break;

        case CodeElementType.ENUM:
          expectedConvention = namingConventions.enums;
          break;

        case CodeElementType.FUNCTION:
        case CodeElementType.METHOD:
          expectedConvention = namingConventions.functions;
          break;

        case CodeElementType.VARIABLE:
        case CodeElementType.PARAMETER:
        case CodeElementType.PROPERTY:
          expectedConvention = namingConventions.variables;
          break;

        default:
          continue; // Skip other element types
      }

      // Determine actual naming convention
      const actualConvention = detectNamingConvention(element.name);

      // Check if naming convention matches
      if (expectedConvention && actualConvention && expectedConvention !== actualConvention) {
        issues.push({
          filePath,
          symbolName: element.name,
          expectedConvention,
          actualConvention,
        });
      }
    }
  }

  return issues;
}

/**
 * Detect naming convention
 */
function detectNamingConvention(name: string): string {
  if (!name) {
    return '';
  }

  // Check for PascalCase
  if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return 'PascalCase';
  }

  // Check for camelCase
  if (/^[a-z][a-zA-Z0-9]*$/.test(name)) {
    return 'camelCase';
  }

  // Check for snake_case
  if (/^[a-z][a-z0-9_]*$/.test(name)) {
    return 'snake_case';
  }

  // Check for UPPER_CASE
  if (/^[A-Z][A-Z0-9_]*$/.test(name)) {
    return 'UPPER_CASE';
  }

  // Check for kebab-case
  if (/^[a-z][a-z0-9-]*$/.test(name)) {
    return 'kebab-case';
  }

  return 'unknown';
}

/**
 * Validate import consistency
 */
function validateImportConsistency(context: MultiFileContext): {
  filePath: string;
  importSource: string;
  issue: string;
}[] {
  const issues: {
    filePath: string;
    importSource: string;
    issue: string;
  }[] = [];

  // This is a placeholder implementation
  // In a real implementation, this would check for consistent import styles,
  // duplicate imports, unnecessary imports, etc.

  return issues;
}

/**
 * Validate dependency cycles
 */
function validateDependencyCycles(context: MultiFileContext): {
  cycle: string[];
  issue: string;
}[] {
  const issues: {
    cycle: string[];
    issue: string;
  }[] = [];

  // Find cycles in the dependency graph
  const cycles = findCycles(context.dependencyGraph);

  // Report each cycle as an issue
  for (const cycle of cycles) {
    issues.push({
      cycle,
      issue: `Dependency cycle detected: ${cycle.join(' -> ')} -> ${cycle[0]}`,
    });
  }

  return issues;
}

/**
 * Validate symbol usage
 */
function validateSymbolUsage(context: MultiFileContext): {
  filePath: string;
  symbolName: string;
  issue: string;
}[] {
  const issues: {
    filePath: string;
    symbolName: string;
    issue: string;
  }[] = [];

  // This is a placeholder implementation
  // In a real implementation, this would check for unused symbols,
  // symbols used incorrectly, etc.

  return issues;
}

/**
 * Validate inheritance consistency
 */
function validateInheritanceConsistency(context: MultiFileContext): {
  filePath: string;
  className: string;
  issue: string;
}[] {
  const issues: {
    filePath: string;
    className: string;
    issue: string;
  }[] = [];

  // This is a placeholder implementation
  // In a real implementation, this would check for inheritance issues,
  // such as missing method implementations, inconsistent method signatures, etc.

  return issues;
}
