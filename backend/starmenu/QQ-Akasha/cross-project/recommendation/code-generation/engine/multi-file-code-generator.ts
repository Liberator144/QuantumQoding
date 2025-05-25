/**
 * Multi-file code generator for generating code from templates and multi-file context
 */

import {
  CodeTemplate,
  SubstitutionOptions,
  substituteVariables,
} from '../templates/variable-substitution';
import {
  MultiFileContextExtractionResult,
  validateConsistency,
  ConsistencyValidationResult,
} from '../context/multi-file';
import {
  CodeGenerationOptions,
  CodeGenerationResult,
  DEFAULT_CODE_GENERATION_OPTIONS,
} from './types';
import { extractVariableValues } from './variable-extractor';
import { formatCode } from './code-formatter';
import { validateCode } from './code-validator';
import { addImports } from './import-manager';

/**
 * Generate code from a template and multi-file context
 */
export async function generateCodeWithMultiFileContext(
  template: CodeTemplate,
  context: MultiFileContextExtractionResult,
  options: CodeGenerationOptions = DEFAULT_CODE_GENERATION_OPTIONS
): Promise<CodeGenerationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Merge options with defaults
    const mergedOptions: CodeGenerationOptions = {
      ...DEFAULT_CODE_GENERATION_OPTIONS,
      ...options,
      useMultiFileContext: true, // Ensure this is set
    };

    // Validate cross-file consistency if requested
    if (mergedOptions.validateCrossFileConsistency) {
      const consistencyResult = validateConsistency(context.context);

      if (!consistencyResult.valid) {
        errors.push(...consistencyResult.errors);
        warnings.push(...consistencyResult.warnings);

        // Log detailed consistency issues
        logConsistencyIssues(consistencyResult);
      }
    }

    // Extract variable values from context
    const variableValues = extractVariableValuesFromMultiFileContext(template, context);

    // Create substitution options
    const substitutionOptions: SubstitutionOptions = {
      useDefaultValues: mergedOptions.useDefaultValues,
      errorOnMissing: mergedOptions.errorOnMissing,
      formatCode: false, // We'll format the code later
      formatter: mergedOptions.formatter,
    };

    // Substitute variables
    const substitutionResult = substituteVariables(template, variableValues, substitutionOptions);

    // Add warnings from substitution
    warnings.push(...substitutionResult.warnings);

    // Check for errors
    if (substitutionResult.errors.length > 0) {
      errors.push(...substitutionResult.errors);

      if (mergedOptions.errorOnMissing) {
        return {
          success: false,
          generatedCode: '',
          template,
          substitutionResult,
          context,
          errors,
          warnings,
        };
      }
    }

    // Get generated code
    let generatedCode = substitutionResult.generatedCode;

    // Add imports if requested
    if (mergedOptions.addImports) {
      generatedCode = addImportsWithMultiFileContext(
        generatedCode,
        template,
        context,
        substitutionResult
      );
    }

    // Format code if requested
    if (mergedOptions.formatCode) {
      generatedCode = formatCode(generatedCode, template.language, mergedOptions.formatter);
    }

    // Validate code if requested
    if (mergedOptions.validateCode) {
      const validationResult = validateCode(
        generatedCode,
        template.language,
        mergedOptions.validator
      );

      if (!validationResult.valid) {
        errors.push(...validationResult.errors);
      }
    }

    return {
      success: errors.length === 0,
      generatedCode,
      template,
      substitutionResult,
      context,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Failed to generate code with multi-file context: ${error}`);

    return {
      success: false,
      generatedCode: '',
      template,
      substitutionResult: {
        success: false,
        generatedCode: '',
        errors: [],
        warnings: [],
        substitutedVariables: {},
        missingVariables: [],
      },
      context,
      errors,
      warnings,
    };
  }
}

/**
 * Extract variable values from multi-file context
 */
function extractVariableValuesFromMultiFileContext(
  template: CodeTemplate,
  context: MultiFileContextExtractionResult
) {
  // If there's a current file path, use its context for variable extraction
  if (context.context.currentFilePath) {
    const fileContext = context.context.fileContexts.get(context.context.currentFilePath);

    if (fileContext) {
      // Create a single-file context extraction result
      const singleFileContext = {
        fileContext,
        errors: context.errors,
        warnings: context.warnings,
      };

      // Extract variables using the existing function
      return extractVariableValues(template, singleFileContext);
    }
  }

  // If no current file path or context, extract from the first file
  const firstFilePath = context.context.files.keys().next().value;

  if (firstFilePath) {
    const fileContext = context.context.fileContexts.get(firstFilePath);

    if (fileContext) {
      // Create a single-file context extraction result
      const singleFileContext = {
        fileContext,
        errors: context.errors,
        warnings: context.warnings,
      };

      // Extract variables using the existing function
      return extractVariableValues(template, singleFileContext);
    }
  }

  // If no file contexts available, return empty array
  return [];
}

/**
 * Add imports with multi-file context
 */
function addImportsWithMultiFileContext(
  code: string,
  template: CodeTemplate,
  context: MultiFileContextExtractionResult,
  substitutionResult: any
): string {
  // If there's a current file path, use its context for import management
  if (context.context.currentFilePath) {
    const fileContext = context.context.fileContexts.get(context.context.currentFilePath);

    if (fileContext) {
      // Create a single-file context extraction result
      const singleFileContext = {
        fileContext,
        errors: context.errors,
        warnings: context.warnings,
      };

      // Add imports using the existing function
      return addImports(code, template, singleFileContext, substitutionResult);
    }
  }

  // If no current file path or context, use the code as is
  return code;
}

/**
 * Log consistency issues
 */
function logConsistencyIssues(consistencyResult: ConsistencyValidationResult): void {
  // Log naming convention issues
  if (
    consistencyResult.details.namingConventionIssues &&
    consistencyResult.details.namingConventionIssues.length > 0
  ) {
    console.log('Naming convention issues:');
    for (const issue of consistencyResult.details.namingConventionIssues) {
      console.log(
        `  - ${issue.filePath}: Symbol '${issue.symbolName}' uses ${issue.actualConvention} but should use ${issue.expectedConvention}`
      );
    }
  }

  // Log import consistency issues
  if (
    consistencyResult.details.importConsistencyIssues &&
    consistencyResult.details.importConsistencyIssues.length > 0
  ) {
    console.log('Import consistency issues:');
    for (const issue of consistencyResult.details.importConsistencyIssues) {
      console.log(`  - ${issue.filePath}: Import '${issue.importSource}' - ${issue.issue}`);
    }
  }

  // Log dependency cycle issues
  if (
    consistencyResult.details.dependencyCycleIssues &&
    consistencyResult.details.dependencyCycleIssues.length > 0
  ) {
    console.log('Dependency cycle issues:');
    for (const issue of consistencyResult.details.dependencyCycleIssues) {
      console.log(`  - ${issue.issue}`);
    }
  }

  // Log symbol usage issues
  if (
    consistencyResult.details.symbolUsageIssues &&
    consistencyResult.details.symbolUsageIssues.length > 0
  ) {
    console.log('Symbol usage issues:');
    for (const issue of consistencyResult.details.symbolUsageIssues) {
      console.log(`  - ${issue.filePath}: Symbol '${issue.symbolName}' - ${issue.issue}`);
    }
  }

  // Log inheritance consistency issues
  if (
    consistencyResult.details.inheritanceConsistencyIssues &&
    consistencyResult.details.inheritanceConsistencyIssues.length > 0
  ) {
    console.log('Inheritance consistency issues:');
    for (const issue of consistencyResult.details.inheritanceConsistencyIssues) {
      console.log(`  - ${issue.filePath}: Class '${issue.className}' - ${issue.issue}`);
    }
  }
}
