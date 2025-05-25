/**
 * Code validator for validating generated code
 */

import { ProgrammingLanguage } from '../templates/types';

/**
 * Validation result
 */
export interface ValidationResult {
  /** Whether the code is valid */
  valid: boolean;

  /** Validation errors */
  errors: string[];
}

/**
 * Validate code
 */
export function validateCode(
  code: string,
  language: ProgrammingLanguage,
  customValidator?: (code: string, language: string) => ValidationResult
): ValidationResult {
  // Use custom validator if provided
  if (customValidator) {
    return customValidator(code, language);
  }

  // Use language-specific validator
  switch (language) {
    case ProgrammingLanguage.JAVASCRIPT:
    case ProgrammingLanguage.TYPESCRIPT:
      return validateJavaScript(code);

    case ProgrammingLanguage.PYTHON:
      return validatePython(code);

    case ProgrammingLanguage.JAVA:
      return validateJava(code);

    case ProgrammingLanguage.CSHARP:
      return validateCSharp(code);

    case ProgrammingLanguage.HTML:
      return validateHTML(code);

    case ProgrammingLanguage.CSS:
      return validateCSS(code);

    case ProgrammingLanguage.JSON:
      return validateJSON(code);

    default:
      // For unsupported languages, assume the code is valid
      return {
        valid: true,
        errors: [],
      };
  }
}

/**
 * Validate JavaScript/TypeScript code
 */
function validateJavaScript(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator like ESLint

    // Check for unbalanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening braces, ${closeBraces} closing braces`);
    }

    // Check for unbalanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      errors.push(
        `Unbalanced parentheses: ${openParens} opening parentheses, ${closeParens} closing parentheses`
      );
    }

    // Check for unbalanced brackets
    const openBrackets = (code.match(/\[/g) || []).length;
    const closeBrackets = (code.match(/\]/g) || []).length;

    if (openBrackets !== closeBrackets) {
      errors.push(
        `Unbalanced brackets: ${openBrackets} opening brackets, ${closeBrackets} closing brackets`
      );
    }

    // Check for missing semicolons
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines, comments, and lines that don't need semicolons
      if (
        !line ||
        line.startsWith('//') ||
        line.startsWith('/*') ||
        line.startsWith('*') ||
        line.endsWith('{') ||
        line.endsWith('}') ||
        line.endsWith(';') ||
        line.endsWith(',') ||
        line.endsWith(':')
      ) {
        continue;
      }

      // Check if the next line starts with a dot (method chaining)
      if (i < lines.length - 1 && lines[i + 1].trim().startsWith('.')) {
        continue;
      }

      // Check if the line needs a semicolon
      if (line.match(/^(let|const|var|return|throw|break|continue|do|for|if|switch|try|while)/)) {
        if (!line.endsWith(';')) {
          errors.push(`Missing semicolon at line ${i + 1}: ${line}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Python code
 */
function validatePython(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator like Pylint

    // Check for indentation errors
    const lines = code.split('\n');
    let expectedIndent = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines and comments
      if (!line.trim() || line.trim().startsWith('#')) {
        continue;
      }

      // Count leading spaces
      const leadingSpaces = line.match(/^(\s*)/)[0].length;

      // Check if indentation is a multiple of 4
      if (leadingSpaces % 4 !== 0) {
        errors.push(
          `Indentation error at line ${i + 1}: Indentation should be a multiple of 4 spaces`
        );
      }

      // Check if indentation matches expected level
      const currentIndent = leadingSpaces / 4;

      if (currentIndent > expectedIndent + 1) {
        errors.push(`Indentation error at line ${i + 1}: Unexpected indentation level`);
      }

      // Update expected indentation for the next line
      if (line.trim().endsWith(':')) {
        expectedIndent = currentIndent + 1;
      } else if (currentIndent < expectedIndent) {
        expectedIndent = currentIndent;
      }
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate Java code
 */
function validateJava(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator

    // Check for unbalanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening braces, ${closeBraces} closing braces`);
    }

    // Check for unbalanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      errors.push(
        `Unbalanced parentheses: ${openParens} opening parentheses, ${closeParens} closing parentheses`
      );
    }

    // Check for missing semicolons
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines, comments, and lines that don't need semicolons
      if (
        !line ||
        line.startsWith('//') ||
        line.startsWith('/*') ||
        line.startsWith('*') ||
        line.endsWith('{') ||
        line.endsWith('}') ||
        line.endsWith(';')
      ) {
        continue;
      }

      // Check if the line needs a semicolon
      if (
        !line.match(
          /^(package|import|class|interface|enum|@|if|else|for|while|do|switch|case|default|try|catch|finally)/
        )
      ) {
        if (!line.endsWith(';')) {
          errors.push(`Missing semicolon at line ${i + 1}: ${line}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate C# code
 */
function validateCSharp(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator

    // Check for unbalanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening braces, ${closeBraces} closing braces`);
    }

    // Check for unbalanced parentheses
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;

    if (openParens !== closeParens) {
      errors.push(
        `Unbalanced parentheses: ${openParens} opening parentheses, ${closeParens} closing parentheses`
      );
    }

    // Check for missing semicolons
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines, comments, and lines that don't need semicolons
      if (
        !line ||
        line.startsWith('//') ||
        line.startsWith('/*') ||
        line.startsWith('*') ||
        line.endsWith('{') ||
        line.endsWith('}') ||
        line.endsWith(';')
      ) {
        continue;
      }

      // Check if the line needs a semicolon
      if (
        !line.match(
          /^(using|namespace|class|interface|enum|struct|if|else|for|foreach|while|do|switch|case|default|try|catch|finally)/
        )
      ) {
        if (!line.endsWith(';')) {
          errors.push(`Missing semicolon at line ${i + 1}: ${line}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate HTML code
 */
function validateHTML(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator

    // Check for unbalanced tags
    const openTags: string[] = [];
    const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
    let match;

    while ((match = tagRegex.exec(code)) !== null) {
      const tag = match[0];
      const tagName = match[1];

      // Skip self-closing tags
      if (tag.endsWith('/>')) {
        continue;
      }

      // Check if it's an opening or closing tag
      if (tag.startsWith('</')) {
        // Closing tag
        if (openTags.length === 0) {
          errors.push(`Unexpected closing tag: ${tag}`);
        } else {
          const lastOpenTag = openTags.pop();
          if (lastOpenTag !== tagName) {
            errors.push(`Mismatched tags: Expected </${lastOpenTag}>, found </${tagName}>`);
          }
        }
      } else {
        // Opening tag
        openTags.push(tagName);
      }
    }

    // Check if all tags are closed
    if (openTags.length > 0) {
      errors.push(`Unclosed tags: ${openTags.join(', ')}`);
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate CSS code
 */
function validateCSS(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    // This is a simple validator that just checks for basic syntax errors
    // In a real implementation, this would use a proper validator

    // Check for unbalanced braces
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} opening braces, ${closeBraces} closing braces`);
    }

    // Check for missing semicolons
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Skip empty lines, comments, and lines that don't need semicolons
      if (
        !line ||
        line.startsWith('/*') ||
        line.startsWith('*') ||
        line.endsWith('{') ||
        line.endsWith('}') ||
        line.endsWith(';')
      ) {
        continue;
      }

      // Check if the line contains a property declaration
      if (line.includes(':')) {
        if (!line.endsWith(';')) {
          errors.push(`Missing semicolon at line ${i + 1}: ${line}`);
        }
      }
    }
  } catch (error) {
    errors.push(`Syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate JSON code
 */
function validateJSON(code: string): ValidationResult {
  const errors: string[] = [];

  // Check for syntax errors
  try {
    JSON.parse(code);
  } catch (error) {
    errors.push(`JSON syntax error: ${error}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
