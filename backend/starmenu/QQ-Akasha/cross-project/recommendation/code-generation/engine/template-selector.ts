/**
 * Template selector for selecting templates based on context
 */

import { CodeTemplate, TemplateQueryOptions, TemplateRepository } from '../templates/types';
import { ContextExtractionResult, FileContext } from '../context/types';
import { detectLanguage } from '../language/language-detector';
import { TemplateSelectionCriteria, TemplateSelectionResult } from './types';

/**
 * Select templates based on context and criteria
 */
export function selectTemplates(
  repository: TemplateRepository,
  context: ContextExtractionResult,
  criteria: TemplateSelectionCriteria = {}
): TemplateSelectionResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Build query options from criteria and context
    const queryOptions = buildQueryOptions(criteria, context);

    // Query templates
    const templates = repository.queryTemplates(queryOptions);

    // Rank templates by relevance to context
    const rankedTemplates = rankTemplatesByRelevance(templates, context);

    return {
      templates: rankedTemplates,
      errors,
      warnings,
    };
  } catch (error) {
    errors.push(`Failed to select templates: ${error}`);

    return {
      templates: [],
      errors,
      warnings,
    };
  }
}

/**
 * Build query options from criteria and context
 */
function buildQueryOptions(
  criteria: TemplateSelectionCriteria,
  context: ContextExtractionResult
): TemplateQueryOptions {
  const { fileContext } = context;

  // Start with criteria
  const queryOptions: TemplateQueryOptions = {
    language: criteria.language,
    category: criteria.category,
    tags: criteria.tags,
    searchTerm: criteria.searchTerm,
    minRating: criteria.minRating,
    limit: criteria.limit,
    sortBy: 'rating',
    sortDirection: 'desc',
  };

  // Use context to fill in missing criteria
  if (!queryOptions.language) {
    if (fileContext.language) {
      queryOptions.language = fileContext.language;
    } else if (fileContext.filePath && fileContext.content) {
      // Detect language from file path and content
      const detectionResult = detectLanguage(fileContext.filePath, fileContext.content);
      if (detectionResult.confidence > 0.5) {
        queryOptions.language = detectionResult.language;
      }
    }
  }

  // Infer category from context
  if (!queryOptions.category) {
    const inferredCategory = inferCategoryFromContext(fileContext);
    if (inferredCategory) {
      queryOptions.category = inferredCategory;
    }
  }

  // Infer tags from context
  if (!queryOptions.tags || queryOptions.tags.length === 0) {
    const inferredTags = inferTagsFromContext(fileContext);
    if (inferredTags.length > 0) {
      queryOptions.tags = inferredTags;
    }
  }

  // Infer search term from context
  if (!queryOptions.searchTerm) {
    const inferredSearchTerm = inferSearchTermFromContext(fileContext);
    if (inferredSearchTerm) {
      queryOptions.searchTerm = inferredSearchTerm;
    }
  }

  return queryOptions;
}

/**
 * Infer template category from context
 */
function inferCategoryFromContext(fileContext: FileContext): string | undefined {
  // This is a placeholder implementation
  // In a real implementation, this would analyze the file context to infer the category

  // Check if the file contains a class
  const hasClass = fileContext.elements.some(e => e.type === 'class');
  if (hasClass) {
    return 'class';
  }

  // Check if the file contains a function
  const hasFunction = fileContext.elements.some(e => e.type === 'function');
  if (hasFunction) {
    return 'function';
  }

  // Check if the file contains an interface
  const hasInterface = fileContext.elements.some(e => e.type === 'interface');
  if (hasInterface) {
    return 'interface';
  }

  // Check if the file contains a test
  if (fileContext.filePath.includes('test') || fileContext.filePath.includes('spec')) {
    return 'test';
  }

  return undefined;
}

/**
 * Infer tags from context
 */
function inferTagsFromContext(fileContext: FileContext): string[] {
  const tags: string[] = [];

  // Infer tags from file path
  const filePath = fileContext.filePath.toLowerCase();

  if (filePath.includes('component')) {
    tags.push('component');
  }

  if (filePath.includes('util') || filePath.includes('helper')) {
    tags.push('utility');
  }

  if (filePath.includes('model') || filePath.includes('entity')) {
    tags.push('model');
  }

  if (filePath.includes('service') || filePath.includes('provider')) {
    tags.push('service');
  }

  if (filePath.includes('controller') || filePath.includes('handler')) {
    tags.push('controller');
  }

  if (filePath.includes('test') || filePath.includes('spec')) {
    tags.push('test');
  }

  // Infer tags from imports
  for (const importDecl of fileContext.imports) {
    const source = importDecl.source.toLowerCase();

    if (source.includes('react')) {
      tags.push('react');
    }

    if (source.includes('angular')) {
      tags.push('angular');
    }

    if (source.includes('vue')) {
      tags.push('vue');
    }

    if (source.includes('express')) {
      tags.push('express');
    }

    if (source.includes('redux')) {
      tags.push('redux');
    }

    if (source.includes('test') || source.includes('jest') || source.includes('mocha')) {
      tags.push('testing');
    }
  }

  // Remove duplicates
  return [...new Set(tags)];
}

/**
 * Infer search term from context
 */
function inferSearchTermFromContext(fileContext: FileContext): string | undefined {
  // This is a placeholder implementation
  // In a real implementation, this would analyze the file context to infer the search term

  // Use the file name as the search term
  const fileName = fileContext.filePath.split('/').pop() || '';
  const baseName = fileName.split('.')[0];

  // Convert camelCase or PascalCase to space-separated words
  const searchTerm = baseName
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
    .toLowerCase();

  return searchTerm;
}

/**
 * Rank templates by relevance to context
 */
function rankTemplatesByRelevance(
  templates: CodeTemplate[],
  context: ContextExtractionResult
): CodeTemplate[] {
  // This is a placeholder implementation
  // In a real implementation, this would use more sophisticated ranking algorithms

  // Calculate relevance score for each template
  const scoredTemplates = templates.map(template => {
    const score = calculateTemplateRelevance(template, context);
    return { template, score };
  });

  // Sort by score (highest first)
  scoredTemplates.sort((a, b) => b.score - a.score);

  // Return sorted templates
  return scoredTemplates.map(item => item.template);
}

/**
 * Calculate template relevance to context
 */
function calculateTemplateRelevance(
  template: CodeTemplate,
  context: ContextExtractionResult
): number {
  const { fileContext } = context;
  let score = 0;

  // Language match
  if (template.language === fileContext.language) {
    score += 1.0;
  } else if (fileContext.filePath && fileContext.content) {
    // Detect language from file path and content
    const detectionResult = detectLanguage(fileContext.filePath, fileContext.content);

    // If detected language matches template language
    if (detectionResult.language === template.language) {
      // Score based on confidence
      score += detectionResult.confidence;
    } else if (areLanguagesCompatible(template.language, detectionResult.language)) {
      // If languages are compatible (e.g., JavaScript and TypeScript)
      score += 0.5;
    }
  }

  // Tag matches
  const contextTags = inferTagsFromContext(fileContext);
  const matchingTags = template.tags.filter(tag => contextTags.includes(tag));
  if (matchingTags.length > 0) {
    score += matchingTags.length / template.tags.length;
  }

  // Usage count (if available)
  if (template.usageCount !== undefined) {
    // Normalize usage count (0-1)
    const normalizedUsage = Math.min(template.usageCount / 100, 1);
    score += normalizedUsage * 0.5; // Weight usage less than direct matches
  }

  // Rating (if available)
  if (template.rating !== undefined) {
    // Normalize rating (0-1)
    const normalizedRating = template.rating / 5;
    score += normalizedRating * 0.5; // Weight rating less than direct matches
  }

  return score;
}

/**
 * Check if two languages are compatible
 */
function areLanguagesCompatible(language1: string, language2: string): boolean {
  // Same language is always compatible
  if (language1 === language2) {
    return true;
  }

  // Define compatible language pairs
  const compatiblePairs: [string, string][] = [
    ['javascript', 'typescript'],
    ['typescript', 'javascript'],
    ['java', 'kotlin'],
    ['kotlin', 'java'],
    ['csharp', 'fsharp'],
    ['fsharp', 'csharp'],
    ['python', 'python2'],
    ['python', 'python3'],
    ['python2', 'python'],
    ['python3', 'python'],
  ];

  // Check if the languages are in the compatible pairs
  return compatiblePairs.some(
    ([lang1, lang2]) => language1.toLowerCase() === lang1 && language2.toLowerCase() === lang2
  );
}
