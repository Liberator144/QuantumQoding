/**
 * Java language processor
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
 * Java style guide
 */
const JAVA_STYLE_GUIDE: LanguageStyleGuide = {
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
    enumMembers: 'UPPER_CASE',
  },
  codeOrganization: {
    importOrder: ['java imports', 'javax imports', 'other imports', 'static imports'],
    classMemberOrder: [
      'static fields',
      'instance fields',
      'constructors',
      'static methods',
      'instance methods',
    ],
    fileStructure: [
      'package declaration',
      'imports',
      'class/interface declaration',
      'fields',
      'constructors',
      'methods',
    ],
  },
  documentation: {
    commentStyle: 'javadoc',
    requiredElements: ['description', 'parameters', 'returns', 'throws'],
    examples: {
      method: `/**
 * Calculates the sum of two numbers.
 *
 * @param a the first number
 * @param b the second number
 * @return the sum of a and b
 */
public int sum(int a, int b) {
    return a + b;
}`,
      class: `/**
 * Represents a user in the system.
 */
public class User {
    /** The user's unique identifier */
    private String id;
    
    /** The user's display name */
    private String name;
    
    /**
     * Creates a new user.
     *
     * @param id the user identifier
     * @param name the user display name
     */
    public User(String id, String name) {
        this.id = id;
        this.name = name;
    }
}`,
    },
  },
  bestPractices: [
    'Follow standard Java naming conventions',
    'Use interfaces for abstraction',
    'Prefer composition over inheritance',
    'Use immutable objects when possible',
    'Handle exceptions properly',
    'Use try-with-resources for resource management',
    'Use generics for type safety',
    'Use streams for collection processing',
    'Use Optional for nullable return values',
  ],
  commonPatterns: {
    singleton: `/**
 * Singleton pattern implementation.
 */
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {
        // Private constructor to prevent direct instantiation
    }
    
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`,
    factory: `/**
 * Product interface.
 */
public interface Product {
    String operation();
}

/**
 * Concrete product implementation A.
 */
public class ConcreteProductA implements Product {
    @Override
    public String operation() {
        return "Result of ConcreteProductA";
    }
}

/**
 * Concrete product implementation B.
 */
public class ConcreteProductB implements Product {
    @Override
    public String operation() {
        return "Result of ConcreteProductB";
    }
}

/**
 * Factory for creating products.
 */
public class Factory {
    /**
     * Creates a product based on type.
     *
     * @param type the product type
     * @return a Product instance
     * @throws IllegalArgumentException if type is unknown
     */
    public Product createProduct(String type) {
        switch (type) {
            case "A":
                return new ConcreteProductA();
            case "B":
                return new ConcreteProductB();
            default:
                throw new IllegalArgumentException("Unknown product type: " + type);
        }
    }
}`,
  },
  antiPatterns: [
    'Using raw types instead of generics',
    'Catching Exception instead of specific exceptions',
    'Using null instead of Optional',
    'Not closing resources properly',
    'Using public fields instead of getters/setters',
    'Using inheritance when composition is more appropriate',
    'Using synchronized methods instead of locks',
    'Using String concatenation in loops',
  ],
};

/**
 * Java language processor
 */
export class JavaProcessor implements LanguageProcessor {
  language = ProgrammingLanguage.JAVA;

  /**
   * Process a template for Java
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
        // Check if there's a package declaration
        if (processedTemplate.includes('package ')) {
          const packageEnd = processedTemplate.indexOf(';', processedTemplate.indexOf('package '));

          // Insert imports after the package declaration
          processedTemplate =
            processedTemplate.substring(0, packageEnd + 1) +
            '\n\n' +
            importStatements.join('\n') +
            '\n\n' +
            processedTemplate.substring(packageEnd + 1);
        } else {
          // Add imports at the beginning of the file
          processedTemplate = importStatements.join('\n') + '\n\n' + processedTemplate;
        }
      }
    }

    return processedTemplate;
  }

  /**
   * Validate Java syntax
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
   * Format Java code
   */
  formatCode(code: string, style: LanguageStyle = DEFAULT_LANGUAGE_STYLE): string {
    // This is a simplified formatter
    // In a real implementation, this would use a proper formatter

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
      if (line.startsWith('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add indentation
      formattedCode += indent.repeat(indentLevel) + line + '\n';

      // Increase indent level for opening braces
      if (line.endsWith('{')) {
        indentLevel++;
      }
    }

    return formattedCode.trim();
  }

  /**
   * Extract imports from Java code
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
   * Add imports to Java code
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

    // Check if there's a package declaration
    if (code.includes('package ')) {
      const packageEnd = code.indexOf(';', code.indexOf('package '));

      // Insert imports after the package declaration
      return (
        code.substring(0, packageEnd + 1) +
        '\n\n' +
        imports.join('\n') +
        '\n\n' +
        code.substring(packageEnd + 1)
      );
    }

    // Add imports at the beginning of the file
    return imports.join('\n') + '\n\n' + code;
  }

  /**
   * Get Java style guide
   */
  getStyleGuide(): LanguageStyleGuide {
    return JAVA_STYLE_GUIDE;
  }

  /**
   * Generate import statements from import declarations
   */
  private generateImportStatements(imports: any[]): string[] {
    const importStatements: string[] = [];

    for (const importDecl of imports) {
      if (importDecl.elements && importDecl.elements.length > 0) {
        // Add specific imports
        for (const element of importDecl.elements) {
          importStatements.push(`import ${importDecl.source}.${element};`);
        }
      } else {
        // Add wildcard import
        importStatements.push(`import ${importDecl.source}.*;`);
      }
    }

    return importStatements;
  }
}
