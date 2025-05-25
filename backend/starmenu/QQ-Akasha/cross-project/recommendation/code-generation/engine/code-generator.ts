/**
 * Code generator for generating code from templates and context
 */

import {
  CodeTemplate,
  SubstitutionOptions,
  substituteVariables,
} from '../templates/variable-substitution';
import { ContextExtractionResult } from '../context/types';
import { MultiFileContextExtractionResult } from '../context/multi-file/types';
import {
  CodeGenerationOptions,
  CodeGenerationResult,
  DEFAULT_CODE_GENERATION_OPTIONS,
} from './types';
import { extractVariableValues } from './variable-extractor';
import { formatCode } from './code-formatter';
import { validateCode } from './code-validator';
import { addImports } from './import-manager';
import {
  processTemplate as processLanguageTemplate,
  validateSyntax as validateLanguageSyntax,
  formatCode as formatLanguageCode,
  isLanguageSupported,
} from '../language/processor-registry';

/**
 * Generate code from a template and context
 */
export async function generateCode(
  template: CodeTemplate,
  context: ContextExtractionResult | MultiFileContextExtractionResult,
  options: CodeGenerationOptions = DEFAULT_CODE_GENERATION_OPTIONS
): Promise<CodeGenerationResult> {
  // Check if we should use multi-file context
  if (options.useMultiFileContext && 'context' in context) {
    // Import the multi-file code generator dynamically to avoid circular dependencies
    const { generateCodeWithMultiFileContext } = await import('./multi-file-code-generator');
    return generateCodeWithMultiFileContext(template, context, options);
  }
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Merge options with defaults
    const mergedOptions: CodeGenerationOptions = {
      ...DEFAULT_CODE_GENERATION_OPTIONS,
      ...options,
    };

    // Extract variable values from context
    const variableValues = extractVariableValues(template, context);

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

    // Process template with language-specific processor if available
    if (isLanguageSupported(template.language)) {
      try {
        const fileContext =
          'fileContext' in context
            ? context.fileContext
            : 'context' in context && context.context.currentFilePath
              ? context.context.fileContexts.get(context.context.currentFilePath)
              : undefined;

        if (fileContext) {
          generatedCode = processLanguageTemplate(generatedCode, template.language, fileContext);
        }
      } catch (error) {
        warnings.push(`Language-specific processing failed: ${error}`);
      }
    }

    // Add imports if requested
    if (mergedOptions.addImports) {
      generatedCode = addImports(generatedCode, template, context, substitutionResult);
    }

    // Format code if requested
    if (mergedOptions.formatCode) {
      // Try to use language-specific formatter first
      if (isLanguageSupported(template.language)) {
        try {
          generatedCode = formatLanguageCode(generatedCode, template.language);
        } catch (error) {
          // Fall back to generic formatter
          generatedCode = formatCode(generatedCode, template.language, mergedOptions.formatter);
        }
      } else {
        // Use generic formatter
        generatedCode = formatCode(generatedCode, template.language, mergedOptions.formatter);
      }
    }

    // Validate code if requested
    if (mergedOptions.validateCode) {
      // Try to use language-specific validator first
      if (isLanguageSupported(template.language)) {
        try {
          const languageValidationResult = validateLanguageSyntax(generatedCode, template.language);

          if (!languageValidationResult.valid) {
            errors.push(...languageValidationResult.errors);
          }
        } catch (error) {
          // Fall back to generic validator
          const validationResult = validateCode(
            generatedCode,
            template.language,
            mergedOptions.validator
          );

          if (!validationResult.valid) {
            errors.push(...validationResult.errors);
          }
        }
      } else {
        // Use generic validator
        const validationResult = validateCode(
          generatedCode,
          template.language,
          mergedOptions.validator
        );

        if (!validationResult.valid) {
          errors.push(...validationResult.errors);
        }
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
    errors.push(`Failed to generate code: ${error}`);

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
