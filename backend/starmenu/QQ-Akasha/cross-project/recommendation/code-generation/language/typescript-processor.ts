/**
 * TypeScript language processor
 */

import {
  LanguageProcessor,
  LanguageStyle,
  LanguageStyleGuide,
  DEFAULT_LANGUAGE_STYLE,
} from './types';
import { ProgrammingLanguage } from '../templates/types';
import { FileContext } from '../context/types';

/**
 * TypeScript style guide
 */
const TYPESCRIPT_STYLE_GUIDE: LanguageStyleGuide = {
  namingConventions: {
    classes: 'PascalCase',
    interfaces: 'PascalCase',
    methods: 'camelCase',
    functions: 'camelCase',
    variables: 'camelCase',
    constants: 'UPPER_CASE',
    parameters: 'camelCase',
    properties: 'camelCase',
    enums: 'PascalCase',
    enumMembers: 'PascalCase',
  },
  codeOrganization: {
    importOrder: [
      'node built-ins',
      'external libraries',
      'internal modules',
      'parent directory imports',
      'sibling imports',
      'index imports',
    ],
    classMemberOrder: [
      'static properties',
      'instance properties',
      'constructor',
      'static methods',
      'instance methods',
    ],
    fileStructure: [
      'imports',
      'interfaces',
      'type definitions',
      'enums',
      'classes',
      'functions',
      'exports',
    ],
  },
  documentation: {
    commentStyle: 'jsdoc',
    requiredElements: ['description', 'parameters', 'returns', 'throws'],
    examples: {
      function: `/**
 * Calculates the sum of two numbers
 *
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
function sum(a: number, b: number): number {
  return a + b;
}`,
      class: `/**
 * Represents a user in the system
 */
class User {
  /** The user's unique identifier */
  id: string;
  
  /** The user's display name */
  name: string;
  
  /**
   * Creates a new user
   * 
   * @param id - User identifier
   * @param name - User display name
   */
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}`,
    },
  },
  bestPractices: [
    'Use interfaces for object shapes',
    'Prefer type annotations over comments',
    'Use readonly for immutable properties',
    'Use const assertions for literal values',
    'Use enums for related constants',
    'Use discriminated unions for type narrowing',
    'Avoid any when possible',
    'Use unknown instead of any for values of uncertain type',
    'Use type guards to narrow types',
  ],
  commonPatterns: {
    singleton: `/**
 * Singleton pattern implementation
 */
class Singleton {
  private static instance: Singleton;
  
  private constructor() {
    // Private constructor to prevent direct instantiation
  }
  
  static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}`,
    factory: `/**
 * Factory pattern implementation
 */
interface Product {
  operation(): string;
}

class ConcreteProductA implements Product {
  operation(): string {
    return 'Result of ConcreteProductA';
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return 'Result of ConcreteProductB';
  }
}

class Factory {
  createProduct(type: 'A' | 'B'): Product {
    switch (type) {
      case 'A':
        return new ConcreteProductA();
      case 'B':
        return new ConcreteProductB();
      default:
        throw new Error('Unknown product type');
    }
  }
}`,
  },
  antiPatterns: [
    'Using any excessively',
    'Type casting without validation',
    'Not using strict mode',
    'Using namespace instead of modules',
    'Using enums for non-related constants',
    'Using classes for pure functions',
    'Using inheritance over composition',
    'Not using readonly for immutable properties',
  ],
};

/**
 * TypeScript language processor
 */
export class TypeScriptProcessor implements LanguageProcessor {
  language = ProgrammingLanguage.TYPESCRIPT;

  /**
   * Process a template for TypeScript
   */
  processTemplate(template: string, context: FileContext): string {
    // Replace template variables with context-specific values
    let processedTemplate = template;

    // Add imports if needed
    if (context.imports && context.imports.length > 0) {
      const importStatements = this.generateImportStatements(context.imports);

      // Check if the template already has imports
      if (processedTemplate.includes('import ')) {
        // Find the last import statement
        const lastImportIndex = processedTemplate.lastIndexOf('import ');
        const endOfImports = processedTemplate.indexOf('\n', lastImportIndex);

        // Insert imports after the last import statement
        processedTemplate =
          processedTemplate.substring(0, endOfImports + 1) +
          importStatements.join('\n') +
          '\n' +
          processedTemplate.substring(endOfImports + 1);
      } else {
        // Add imports at the beginning of the file
        processedTemplate = importStatements.join('\n') + '\n\n' + processedTemplate;
      }
    }

    return processedTemplate;
  }

  /**
   * Validate TypeScript syntax
   */
  validateSyntax(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      // Check for basic syntax errors

      // Check for unbalanced braces
      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;

      if (openBraces !== closeBraces) {
        errors.push(
          `Unbalanced braces: ${openBraces} opening braces, ${closeBraces} closing braces`
        );
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

      // Check for missing semicolons (if required by style)
      // This is a simplified check and would need to be more sophisticated in a real implementation
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
   * Format TypeScript code
   */
  formatCode(code: string, style: LanguageStyle = DEFAULT_LANGUAGE_STYLE): string {
    // This is a simplified formatter
    // In a real implementation, this would use a proper formatter like Prettier

    let formattedCode = '';
    let indentLevel = 0;
    const lines = code.split('\n');

    const indent = style.indentType === 'space' ? ' '.repeat(style.indentSize) : '\t';

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
      formattedCode += indent.repeat(indentLevel) + line + '\n';

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
   * Extract imports from TypeScript code
   */
  extractImports(code: string): { imports: string[]; code: string } {
    const imports: string[] = [];
    const importLines: number[] = [];

    // Extract import statements
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith('import ')) {
        imports.push(line);
        importLines.push(i);
      }
    }

    // Remove import statements from code
    const codeWithoutImports = lines.filter((_, i) => !importLines.includes(i)).join('\n');

    return {
      imports,
      code: codeWithoutImports,
    };
  }

  /**
   * Add imports to TypeScript code
   */
  addImports(code: string, imports: string[]): string {
    if (imports.length === 0) {
      return code;
    }

    // Check if the code already has imports
    if (code.includes('import ')) {
      // Find the last import statement
      const lastImportIndex = code.lastIndexOf('import ');
      const endOfImports = code.indexOf('\n', lastImportIndex);

      // Insert imports after the last import statement
      return (
        code.substring(0, endOfImports + 1) +
        imports.join('\n') +
        '\n' +
        code.substring(endOfImports + 1)
      );
    }

    // Add imports at the beginning of the file
    return imports.join('\n') + '\n\n' + code;
  }

  /**
   * Get TypeScript style guide
   */
  getStyleGuide(): LanguageStyleGuide {
    return TYPESCRIPT_STYLE_GUIDE;
  }

  /**
   * Generate import statements from import declarations
   */
  private generateImportStatements(imports: any[]): string[] {
    const importStatements: string[] = [];

    for (const importDecl of imports) {
      let statement = 'import ';

      // Add default import
      if (importDecl.defaultImport) {
        statement += importDecl.defaultImport;

        if (importDecl.namespaceImport || (importDecl.elements && importDecl.elements.length > 0)) {
          statement += ', ';
        }
      }

      // Add namespace import
      if (importDecl.namespaceImport) {
        statement += `* as ${importDecl.namespaceImport}`;
      } else if (importDecl.elements && importDecl.elements.length > 0) {
        // Add named imports
        statement += `{ ${importDecl.elements.join(', ')} }`;
      }

      // Add source
      statement += ` from '${importDecl.source}';`;

      importStatements.push(statement);
    }

    return importStatements;
  }
}
