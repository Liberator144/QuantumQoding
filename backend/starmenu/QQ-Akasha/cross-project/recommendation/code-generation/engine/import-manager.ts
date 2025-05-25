/**
 * Import manager for managing imports in generated code
 */

import { CodeTemplate, ProgrammingLanguage, VariableSubstitutionResult } from '../templates/types';
import { ContextExtractionResult, ImportDeclaration } from '../context/types';

/**
 * Add imports to generated code
 */
export function addImports(
  code: string,
  template: CodeTemplate,
  context: ContextExtractionResult,
  substitutionResult: VariableSubstitutionResult
): string {
  // Use language-specific import manager
  switch (template.language) {
    case ProgrammingLanguage.JAVASCRIPT:
    case ProgrammingLanguage.TYPESCRIPT:
      return addJavaScriptImports(code, template, context, substitutionResult);

    case ProgrammingLanguage.PYTHON:
      return addPythonImports(code, template, context, substitutionResult);

    case ProgrammingLanguage.JAVA:
      return addJavaImports(code, template, context, substitutionResult);

    case ProgrammingLanguage.CSHARP:
      return addCSharpImports(code, template, context, substitutionResult);

    default:
      // For unsupported languages, return the code as is
      return code;
  }
}

/**
 * Add JavaScript/TypeScript imports
 */
function addJavaScriptImports(
  code: string,
  template: CodeTemplate,
  context: ContextExtractionResult,
  substitutionResult: VariableSubstitutionResult
): string {
  const { fileContext } = context;

  // Get existing imports from the file
  const existingImports = fileContext.imports || [];

  // Get imports from the template
  const templateImports = template.dependencies || [];

  // Get imports from the generated code
  const codeImports = extractImportsFromJavaScript(code);

  // Merge imports
  const mergedImports = mergeJavaScriptImports(existingImports, templateImports, codeImports);

  // Generate import statements
  const importStatements = generateJavaScriptImportStatements(mergedImports);

  // Add imports to the code
  if (importStatements.length > 0) {
    // Check if the code already has imports
    const hasImports = code.includes('import ') || code.includes('require(');

    if (hasImports) {
      // Find the last import statement
      const lines = code.split('\n');
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('import ') || line.includes('require(')) {
          lastImportIndex = i;
        }
      }

      if (lastImportIndex >= 0) {
        // Insert imports after the last import statement
        lines.splice(lastImportIndex + 1, 0, ...importStatements);
        return lines.join('\n');
      }
    }

    // No existing imports, add imports at the beginning of the file
    return importStatements.join('\n') + '\n\n' + code;
  }

  return code;
}

/**
 * Extract imports from JavaScript/TypeScript code
 */
function extractImportsFromJavaScript(code: string): ImportDeclaration[] {
  const imports: ImportDeclaration[] = [];

  // Extract ES6 imports
  const es6ImportRegex =
    /import\s+(?:(type)\s+)?(?:([^{*,\s]+)\s*,?\s*)?(?:(?:\*\s+as\s+([^{},\s]+))|(?:{([^{}]+)}))?(?:\s+from)?\s+['"]([^'"]+)['"]/g;

  let match;
  while ((match = es6ImportRegex.exec(code)) !== null) {
    const isTypeOnly = !!match[1];
    const defaultImport = match[2];
    const namespaceImport = match[3];
    const namedImports = match[4];
    const source = match[5];

    const elements: string[] = [];

    // Add named imports
    if (namedImports) {
      const namedImportRegex = /([^{},\s]+)(?:\s+as\s+([^{},\s]+))?/g;
      let namedMatch;

      while ((namedMatch = namedImportRegex.exec(namedImports)) !== null) {
        elements.push(namedMatch[2] || namedMatch[1]);
      }
    }

    imports.push({
      source,
      elements,
      defaultImport,
      namespaceImport,
      isTypeOnly,
      startPosition: {
        line: 0,
        column: 0,
      },
      endPosition: {
        line: 0,
        column: 0,
      },
    });
  }

  // Extract CommonJS requires
  const requireRegex =
    /(?:const|let|var)\s+(?:([^{},\s]+)|{([^{}]+)})\s*=\s*require\(['"]([^'"]+)['"]\)/g;

  while ((match = requireRegex.exec(code)) !== null) {
    const defaultImport = match[1];
    const namedImports = match[2];
    const source = match[3];

    const elements: string[] = [];

    // Add named imports
    if (namedImports) {
      const namedImportRegex = /([^{},\s]+)(?:\s*:\s*([^{},\s]+))?/g;
      let namedMatch;

      while ((namedMatch = namedImportRegex.exec(namedImports)) !== null) {
        elements.push(namedMatch[2] || namedMatch[1]);
      }
    }

    imports.push({
      source,
      elements,
      defaultImport,
      startPosition: {
        line: 0,
        column: 0,
      },
      endPosition: {
        line: 0,
        column: 0,
      },
    });
  }

  return imports;
}

/**
 * Merge JavaScript/TypeScript imports
 */
function mergeJavaScriptImports(
  existingImports: ImportDeclaration[],
  templateImports: string[],
  codeImports: ImportDeclaration[]
): ImportDeclaration[] {
  const mergedImports: ImportDeclaration[] = [];

  // Add existing imports
  for (const importDecl of existingImports) {
    mergedImports.push(importDecl);
  }

  // Add template imports
  for (const importSource of templateImports) {
    // Check if the import already exists
    const existingImport = mergedImports.find(imp => imp.source === importSource);

    if (!existingImport) {
      // Add new import
      mergedImports.push({
        source: importSource,
        elements: [],
        startPosition: {
          line: 0,
          column: 0,
        },
        endPosition: {
          line: 0,
          column: 0,
        },
      });
    }
  }

  // Add code imports
  for (const importDecl of codeImports) {
    // Check if the import already exists
    const existingImport = mergedImports.find(imp => imp.source === importDecl.source);

    if (!existingImport) {
      // Add new import
      mergedImports.push(importDecl);
    } else {
      // Merge with existing import
      if (importDecl.defaultImport && !existingImport.defaultImport) {
        existingImport.defaultImport = importDecl.defaultImport;
      }

      if (importDecl.namespaceImport && !existingImport.namespaceImport) {
        existingImport.namespaceImport = importDecl.namespaceImport;
      }

      // Merge elements
      for (const element of importDecl.elements) {
        if (!existingImport.elements.includes(element)) {
          existingImport.elements.push(element);
        }
      }
    }
  }

  return mergedImports;
}

/**
 * Generate JavaScript/TypeScript import statements
 */
function generateJavaScriptImportStatements(imports: ImportDeclaration[]): string[] {
  const statements: string[] = [];

  for (const importDecl of imports) {
    let statement = 'import ';

    if (importDecl.isTypeOnly) {
      statement += 'type ';
    }

    if (importDecl.defaultImport) {
      statement += importDecl.defaultImport;

      if (importDecl.namespaceImport || importDecl.elements.length > 0) {
        statement += ', ';
      }
    }

    if (importDecl.namespaceImport) {
      statement += `* as ${importDecl.namespaceImport}`;
    } else if (importDecl.elements.length > 0) {
      statement += `{ ${importDecl.elements.join(', ')} }`;
    }

    statement += ` from '${importDecl.source}';`;

    statements.push(statement);
  }

  return statements;
}

/**
 * Add Python imports
 */
function addPythonImports(
  code: string,
  template: CodeTemplate,
  context: ContextExtractionResult,
  substitutionResult: VariableSubstitutionResult
): string {
  // Placeholder implementation
  return code;
}

/**
 * Add Java imports
 */
function addJavaImports(
  code: string,
  template: CodeTemplate,
  context: ContextExtractionResult,
  substitutionResult: VariableSubstitutionResult
): string {
  // Placeholder implementation
  return code;
}

/**
 * Add C# imports
 */
function addCSharpImports(
  code: string,
  template: CodeTemplate,
  context: ContextExtractionResult,
  substitutionResult: VariableSubstitutionResult
): string {
  // Placeholder implementation
  return code;
}
