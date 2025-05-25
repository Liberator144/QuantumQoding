/**
 * Variable substitution engine for code templates
 */

import { CodeTemplate, TemplateVariable, VariableSubstitutionResult, VariableType } from './types';
import { extractVariablesFromContent } from './template-validator';

/**
 * Variable value with metadata
 */
export interface VariableValue {
  /** Variable name */
  name: string;

  /** Variable value */
  value: string;

  /** Source of the value (e.g., 'user', 'context', 'default') */
  source: 'user' | 'context' | 'default' | 'derived';
}

/**
 * Options for variable substitution
 */
export interface SubstitutionOptions {
  /** Whether to use default values for missing variables */
  useDefaultValues?: boolean;

  /** Whether to validate values against variable definitions */
  validateValues?: boolean;

  /** Whether to throw an error for missing variables */
  errorOnMissing?: boolean;

  /** Whether to format the generated code */
  formatCode?: boolean;

  /** Custom formatter function */
  formatter?: (code: string, language: string) => string;
}

/**
 * Default substitution options
 */
export const DEFAULT_SUBSTITUTION_OPTIONS: SubstitutionOptions = {
  useDefaultValues: true,
  validateValues: true,
  errorOnMissing: true,
  formatCode: true,
};

/**
 * Substitute variables in a template
 */
export function substituteVariables(
  template: CodeTemplate,
  variableValues: VariableValue[],
  options: SubstitutionOptions = DEFAULT_SUBSTITUTION_OPTIONS
): VariableSubstitutionResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const substitutedVariables: Record<string, string> = {};
  const missingVariables: string[] = [];

  // Merge options with defaults
  const mergedOptions: SubstitutionOptions = {
    ...DEFAULT_SUBSTITUTION_OPTIONS,
    ...options,
  };

  // Extract variables from content
  const variablesInContent = extractVariablesFromContent(template.content);

  // Create a map of variable values
  const valueMap = new Map<string, VariableValue>();
  for (const value of variableValues) {
    valueMap.set(value.name, value);
  }

  // Check for missing variables
  for (const variableName of variablesInContent) {
    if (!valueMap.has(variableName)) {
      // Check if variable has a default value
      const variableDef = template.variables.find(v => v.name === variableName);

      if (variableDef && variableDef.defaultValue !== undefined && mergedOptions.useDefaultValues) {
        // Use default value
        valueMap.set(variableName, {
          name: variableName,
          value: variableDef.defaultValue,
          source: 'default',
        });

        warnings.push(`Using default value for variable ${variableName}`);
      } else {
        // Variable is missing
        missingVariables.push(variableName);

        if (mergedOptions.errorOnMissing) {
          errors.push(`Missing value for variable ${variableName}`);
        } else {
          warnings.push(`Missing value for variable ${variableName}`);
        }
      }
    }
  }

  // Validate variable values
  if (mergedOptions.validateValues) {
    for (const [name, value] of valueMap.entries()) {
      const variableDef = template.variables.find(v => v.name === name);

      if (variableDef) {
        const validationErrors = validateVariableValue(variableDef, value.value);
        errors.push(...validationErrors);
      } else {
        warnings.push(`Variable ${name} is not defined in the template`);
      }
    }
  }

  // Return early if there are errors and errorOnMissing is true
  if (errors.length > 0 && mergedOptions.errorOnMissing) {
    return {
      success: false,
      generatedCode: '',
      errors,
      warnings,
      substitutedVariables: {},
      missingVariables,
    };
  }

  // Substitute variables in content
  let generatedCode = template.content;

  for (const variableName of variablesInContent) {
    const value = valueMap.get(variableName);

    if (value) {
      // Substitute variable
      generatedCode = generatedCode.replace(
        new RegExp(`\\$\\{${variableName}\\}`, 'g'),
        value.value
      );

      // Record substitution
      substitutedVariables[variableName] = value.value;
    } else {
      // Leave variable placeholder
      warnings.push(`Variable ${variableName} was not substituted`);
    }
  }

  // Format code if requested
  if (mergedOptions.formatCode) {
    if (mergedOptions.formatter) {
      // Use custom formatter
      generatedCode = mergedOptions.formatter(generatedCode, template.language);
    } else {
      // Use default formatter (no-op for now)
      // In a real implementation, this would use a language-specific formatter
    }
  }

  return {
    success: errors.length === 0,
    generatedCode,
    errors,
    warnings,
    substitutedVariables,
    missingVariables,
  };
}

/**
 * Validate a variable value against its definition
 */
function validateVariableValue(variable: TemplateVariable, value: string): string[] {
  const errors: string[] = [];

  // Skip validation for empty values if variable is not required
  if (!value && !variable.required) {
    return errors;
  }

  // Validate against validation pattern
  if (variable.validationPattern) {
    try {
      const regex = new RegExp(variable.validationPattern);
      if (!regex.test(value)) {
        errors.push(`Value for ${variable.name} does not match validation pattern`);
      }
    } catch (error) {
      errors.push(`Invalid validation pattern for ${variable.name}: ${error}`);
    }
  }

  // Validate against possible values
  if (variable.possibleValues && variable.possibleValues.length > 0) {
    if (!variable.possibleValues.includes(value)) {
      errors.push(`Value for ${variable.name} is not in the list of possible values`);
    }
  }

  // Validate based on variable type
  switch (variable.type) {
    case VariableType.NUMBER:
      if (isNaN(Number(value))) {
        errors.push(`Value for ${variable.name} is not a valid number`);
      }
      break;

    case VariableType.BOOLEAN:
      if (value !== 'true' && value !== 'false') {
        errors.push(`Value for ${variable.name} is not a valid boolean`);
      }
      break;

    case VariableType.IDENTIFIER:
      if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        errors.push(`Value for ${variable.name} is not a valid identifier`);
      }
      break;

    // Add more type-specific validations as needed
  }

  return errors;
}
