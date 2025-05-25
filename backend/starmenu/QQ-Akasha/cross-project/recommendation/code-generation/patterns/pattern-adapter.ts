/**
 * Pattern adapter for adapting design patterns to project context
 */

import {
  DesignPatternType,
  PatternAdaptationOptions,
  PatternAdaptationResult,
  DEFAULT_PATTERN_ADAPTATION_OPTIONS,
} from './types';
import { patternRegistry } from './pattern-registry';
import { FileContext } from '../context/types';
import { ProgrammingLanguage } from '../templates/types';
import { isLanguageSupported, getLanguageProcessor } from '../language/processor-registry';

/**
 * Adapt a pattern to project context
 */
export function adaptPattern(
  patternType: DesignPatternType,
  fileContext: FileContext,
  options: Partial<PatternAdaptationOptions> = {}
): PatternAdaptationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Merge options with defaults
    const mergedOptions: PatternAdaptationOptions = {
      ...DEFAULT_PATTERN_ADAPTATION_OPTIONS,
      ...options,
    };

    // Get pattern from registry
    const pattern = patternRegistry.getPattern(patternType);

    if (!pattern) {
      errors.push(`Pattern not found: ${patternType}`);
      return {
        code: '',
        pattern: patternType,
        errors,
        warnings,
      };
    }

    // Check if pattern has an example for the target language
    if (!pattern.examples[mergedOptions.language]) {
      warnings.push(`Pattern does not have an example for language: ${mergedOptions.language}`);

      // Try to find an example in a compatible language
      const compatibleLanguage = findCompatibleLanguage(mergedOptions.language, pattern.examples);

      if (compatibleLanguage) {
        warnings.push(`Using example from compatible language: ${compatibleLanguage}`);
        mergedOptions.language = compatibleLanguage;
      } else {
        errors.push(`No compatible language found for pattern: ${patternType}`);
        return {
          code: '',
          pattern: patternType,
          errors,
          warnings,
        };
      }
    }

    // Get pattern example
    let code = pattern.examples[mergedOptions.language] || '';

    // Apply naming conventions
    code = applyNamingConventions(code, mergedOptions);

    // Apply custom parameters
    if (mergedOptions.customParams) {
      code = applyCustomParams(code, mergedOptions.customParams);
    }

    // Format code using language processor if available
    if (isLanguageSupported(mergedOptions.language)) {
      const processor = getLanguageProcessor(mergedOptions.language);

      if (processor) {
        code = processor.formatCode(code);
      }
    }

    return {
      code,
      pattern: patternType,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Failed to adapt pattern: ${error}`);

    return {
      code: '',
      pattern: patternType,
      errors,
      warnings,
    };
  }
}

/**
 * Find a compatible language
 */
function findCompatibleLanguage(
  targetLanguage: ProgrammingLanguage,
  examples: Partial<Record<ProgrammingLanguage, string>>
): ProgrammingLanguage | undefined {
  // Define compatible language pairs
  const compatibleLanguages: Record<ProgrammingLanguage, ProgrammingLanguage[]> = {
    [ProgrammingLanguage.TYPESCRIPT]: [ProgrammingLanguage.JAVASCRIPT],
    [ProgrammingLanguage.JAVASCRIPT]: [ProgrammingLanguage.TYPESCRIPT],
    [ProgrammingLanguage.JAVA]: [ProgrammingLanguage.KOTLIN],
    [ProgrammingLanguage.KOTLIN]: [ProgrammingLanguage.JAVA],
    [ProgrammingLanguage.CSHARP]: [ProgrammingLanguage.JAVA],
    [ProgrammingLanguage.PYTHON]: [],
  };

  // Check if there's a compatible language with an example
  const compatibleOptions = compatibleLanguages[targetLanguage] || [];

  for (const language of compatibleOptions) {
    if (examples[language]) {
      return language;
    }
  }

  // If no compatible language found, return any available language
  const availableLanguages = Object.keys(examples) as ProgrammingLanguage[];

  if (availableLanguages.length > 0) {
    return availableLanguages[0];
  }

  return undefined;
}

/**
 * Apply naming conventions to code
 */
function applyNamingConventions(code: string, options: PatternAdaptationOptions): string {
  let result = code;

  // Apply class naming convention
  result = applyNamingConvention(
    result,
    /class\s+([A-Za-z0-9_]+)/g,
    options.namingConventions.classes
  );

  // Apply interface naming convention
  result = applyNamingConvention(
    result,
    /interface\s+([A-Za-z0-9_]+)/g,
    options.namingConventions.interfaces
  );

  // Apply method naming convention
  result = applyNamingConvention(
    result,
    /(?:public|private|protected)?\s+(?:static\s+)?(?:async\s+)?([A-Za-z0-9_]+)\s*\(/g,
    options.namingConventions.methods
  );

  // Apply variable naming convention
  result = applyNamingConvention(
    result,
    /(?:const|let|var)\s+([A-Za-z0-9_]+)/g,
    options.namingConventions.variables
  );

  return result;
}

/**
 * Apply naming convention to code
 */
function applyNamingConvention(code: string, pattern: RegExp, convention: string): string {
  return code.replace(pattern, (match, name) => {
    const newName = convertToNamingConvention(name, convention);
    return match.replace(name, newName);
  });
}

/**
 * Convert a name to a naming convention
 */
function convertToNamingConvention(name: string, convention: string): string {
  // Split name into words
  const words = splitIntoWords(name);

  switch (convention) {
    case 'camelCase':
      return words
        .map((word, index) =>
          index === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join('');

    case 'PascalCase':
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join('');

    case 'snake_case':
      return words.map(word => word.toLowerCase()).join('_');

    case 'UPPER_CASE':
      return words.map(word => word.toUpperCase()).join('_');

    case 'kebab-case':
      return words.map(word => word.toLowerCase()).join('-');

    default:
      return name;
  }
}

/**
 * Split a name into words
 */
function splitIntoWords(name: string): string[] {
  // Handle snake_case and kebab-case
  if (name.includes('_')) {
    return name.split('_');
  }

  if (name.includes('-')) {
    return name.split('-');
  }

  // Handle camelCase and PascalCase
  return name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ');
}

/**
 * Apply custom parameters to code
 */
function applyCustomParams(code: string, params: Record<string, any>): string {
  let result = code;

  // Replace placeholders with custom parameters
  for (const [key, value] of Object.entries(params)) {
    const placeholder = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(placeholder, String(value));
  }

  return result;
}
