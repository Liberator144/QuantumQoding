/**
 * Code formatter for formatting generated code
 */

import { ProgrammingLanguage } from '../templates/types';

/**
 * Format code
 */
export function formatCode(
  code: string,
  language: ProgrammingLanguage,
  customFormatter?: (code: string, language: string) => string
): string {
  // Use custom formatter if provided
  if (customFormatter) {
    return customFormatter(code, language);
  }

  // Use language-specific formatter
  switch (language) {
    case ProgrammingLanguage.JAVASCRIPT:
    case ProgrammingLanguage.TYPESCRIPT:
      return formatJavaScript(code);

    case ProgrammingLanguage.PYTHON:
      return formatPython(code);

    case ProgrammingLanguage.JAVA:
      return formatJava(code);

    case ProgrammingLanguage.CSHARP:
      return formatCSharp(code);

    case ProgrammingLanguage.HTML:
      return formatHTML(code);

    case ProgrammingLanguage.CSS:
      return formatCSS(code);

    case ProgrammingLanguage.JSON:
      return formatJSON(code);

    default:
      // For unsupported languages, return the code as is
      return code;
  }
}

/**
 * Format JavaScript/TypeScript code
 */
function formatJavaScript(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter like Prettier

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for closing braces
    if (line.startsWith('}') || line.startsWith(']') || line.startsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '  '.repeat(indentLevel) + line + '\n';

    // Increase indent level for opening braces
    if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(')) {
      indentLevel++;
    }

    // Decrease indent level for closing braces at the end of the line
    if (line.endsWith('}') || line.endsWith(']') || line.endsWith(')')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  return formattedCode.trim();
}

/**
 * Format Python code
 */
function formatPython(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter like Black

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for dedent keywords
    if (
      line.startsWith('else:') ||
      line.startsWith('elif ') ||
      line.startsWith('except') ||
      line.startsWith('finally:')
    ) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '    '.repeat(indentLevel) + line + '\n';

    // Increase indent level for indent keywords
    if (line.endsWith(':')) {
      indentLevel++;
    }
  }

  return formattedCode.trim();
}

/**
 * Format Java code
 */
function formatJava(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for closing braces
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '    '.repeat(indentLevel) + line + '\n';

    // Increase indent level for opening braces
    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  return formattedCode.trim();
}

/**
 * Format C# code
 */
function formatCSharp(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for closing braces
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '    '.repeat(indentLevel) + line + '\n';

    // Increase indent level for opening braces
    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  return formattedCode.trim();
}

/**
 * Format HTML code
 */
function formatHTML(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for closing tags
    if (line.startsWith('</')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '  '.repeat(indentLevel) + line + '\n';

    // Increase indent level for opening tags (except self-closing tags)
    if (line.match(/<[^/][^>]*>/) && !line.match(/<[^/][^>]*\/>/)) {
      indentLevel++;
    }

    // Decrease indent level for self-closing tags
    if (line.match(/<[^/][^>]*\/>/) || line.match(/<\/[^>]*>/)) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
  }

  return formattedCode.trim();
}

/**
 * Format CSS code
 */
function formatCSS(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter

  let formattedCode = '';
  let indentLevel = 0;
  const lines = code.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      formattedCode += '\n';
      continue;
    }

    // Decrease indent level for closing braces
    if (line.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add indentation
    formattedCode += '  '.repeat(indentLevel) + line + '\n';

    // Increase indent level for opening braces
    if (line.endsWith('{')) {
      indentLevel++;
    }
  }

  return formattedCode.trim();
}

/**
 * Format JSON code
 */
function formatJSON(code: string): string {
  // This is a simple formatter that just fixes indentation
  // In a real implementation, this would use a proper formatter

  try {
    // Parse and stringify with indentation
    const parsed = JSON.parse(code);
    return JSON.stringify(parsed, null, 2);
  } catch (error) {
    // If parsing fails, return the original code
    return code;
  }
}
