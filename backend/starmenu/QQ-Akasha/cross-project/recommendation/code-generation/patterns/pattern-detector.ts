/**
 * Pattern detector for detecting design patterns in code
 */

import {
  DesignPattern,
  DesignPatternType,
  PatternDetectionResult,
  PatternDetectionRule,
  PatternDetectionRuleType,
} from './types';
import { FileContext } from '../context/types';
import { MultiFileContext } from '../context/multi-file/types';
import { CodeElement, CodeElementType } from '../context/types';
import { patternRegistry } from './pattern-registry';

/**
 * Detect patterns in a file
 */
export function detectPatterns(fileContext: FileContext): PatternDetectionResult[] {
  const results: PatternDetectionResult[] = [];

  // Get all patterns from the registry
  const patterns = patternRegistry.getAllPatterns();

  // Check each pattern
  for (const pattern of patterns) {
    const result = detectPattern(pattern, fileContext);

    if (result) {
      results.push(result);
    }
  }

  // Sort by confidence (highest first)
  results.sort((a, b) => b.confidence - a.confidence);

  return results;
}

/**
 * Detect patterns in multiple files
 */
export function detectPatternsInMultipleFiles(
  multiFileContext: MultiFileContext
): Map<string, PatternDetectionResult[]> {
  const results = new Map<string, PatternDetectionResult[]>();

  // Detect patterns in each file
  for (const [filePath, fileContext] of multiFileContext.fileContexts.entries()) {
    const fileResults = detectPatterns(fileContext);

    if (fileResults.length > 0) {
      results.set(filePath, fileResults);
    }
  }

  return results;
}

/**
 * Detect a specific pattern in a file
 */
export function detectPattern(
  pattern: DesignPattern,
  fileContext: FileContext
): PatternDetectionResult | undefined {
  const matchingElements: string[] = [];
  const details: Record<string, any> = {};

  // Check each detection rule
  let totalConfidence = 0;
  let matchedRules = 0;

  for (const rule of pattern.detectionRules) {
    const ruleResult = evaluateRule(rule, fileContext);

    if (ruleResult.matched) {
      matchedRules++;
      totalConfidence += ruleResult.confidence;

      // Add matching elements
      matchingElements.push(...ruleResult.matchingElements);

      // Add details
      Object.assign(details, ruleResult.details);
    }
  }

  // Calculate overall confidence
  const confidence =
    pattern.detectionRules.length > 0 ? totalConfidence / pattern.detectionRules.length : 0;

  // Return result if confidence is above threshold
  if (confidence > 0.5) {
    return {
      pattern: pattern.type,
      confidence,
      matchingElements: [...new Set(matchingElements)], // Remove duplicates
      details,
    };
  }

  return undefined;
}

/**
 * Evaluate a detection rule
 */
function evaluateRule(
  rule: PatternDetectionRule,
  fileContext: FileContext
): {
  matched: boolean;
  confidence: number;
  matchingElements: string[];
  details: Record<string, any>;
} {
  const result = {
    matched: false,
    confidence: 0,
    matchingElements: [] as string[],
    details: {} as Record<string, any>,
  };

  switch (rule.type) {
    case PatternDetectionRuleType.HAS_PRIVATE_CONSTRUCTOR:
      return evaluateHasPrivateConstructor(rule, fileContext);

    case PatternDetectionRuleType.HAS_STATIC_INSTANCE:
      return evaluateHasStaticInstance(rule, fileContext);

    case PatternDetectionRuleType.HAS_GET_INSTANCE_METHOD:
      return evaluateHasGetInstanceMethod(rule, fileContext);

    case PatternDetectionRuleType.IMPLEMENTS_INTERFACE:
      return evaluateImplementsInterface(rule, fileContext);

    case PatternDetectionRuleType.EXTENDS_CLASS:
      return evaluateExtendsClass(rule, fileContext);

    case PatternDetectionRuleType.HAS_FACTORY_METHOD:
      return evaluateHasFactoryMethod(rule, fileContext);

    case PatternDetectionRuleType.HAS_BUILDER_METHOD:
      return evaluateHasBuilderMethod(rule, fileContext);

    case PatternDetectionRuleType.HAS_METHOD:
      return evaluateHasMethod(rule, fileContext);

    case PatternDetectionRuleType.HAS_PROPERTY:
      return evaluateHasProperty(rule, fileContext);

    case PatternDetectionRuleType.HAS_IMPORT:
      return evaluateHasImport(rule, fileContext);

    case PatternDetectionRuleType.HAS_PATTERN:
      return evaluateHasPattern(rule, fileContext);

    case PatternDetectionRuleType.HAS_NAMING_PATTERN:
      return evaluateHasNamingPattern(rule, fileContext);

    case PatternDetectionRuleType.HAS_ANNOTATION:
      return evaluateHasAnnotation(rule, fileContext);

    case PatternDetectionRuleType.HAS_DECORATOR:
      return evaluateHasDecorator(rule, fileContext);

    case PatternDetectionRuleType.HAS_STRUCTURE:
      return evaluateHasStructure(rule, fileContext);

    case PatternDetectionRuleType.ALL_OF:
      return evaluateAllOf(rule, fileContext);

    case PatternDetectionRuleType.ANY_OF:
      return evaluateAnyOf(rule, fileContext);

    case PatternDetectionRuleType.NONE_OF:
      return evaluateNoneOf(rule, fileContext);

    default:
      return result;
  }
}

/**
 * Evaluate if a class has a private constructor
 */
function evaluateHasPrivateConstructor(
  rule: PatternDetectionRule,
  fileContext: FileContext
): {
  matched: boolean;
  confidence: number;
  matchingElements: string[];
  details: Record<string, any>;
} {
  const result = {
    matched: false,
    confidence: 0,
    matchingElements: [] as string[],
    details: {} as Record<string, any>,
  };

  // Get class name from rule parameters
  const className = rule.params.className as string;

  // Find the class
  const classElement = fileContext.elements.find(
    e => e.type === CodeElementType.CLASS && (className ? e.name === className : true)
  );

  if (!classElement) {
    return result;
  }

  // Check if the class has a private constructor
  const hasPrivateConstructor =
    fileContext.content.includes(`private constructor`) ||
    fileContext.content.includes(`constructor(private`) ||
    fileContext.content.includes(`#constructor`);

  if (hasPrivateConstructor) {
    result.matched = true;
    result.confidence = 0.8;
    result.matchingElements.push(classElement.name);
    result.details.className = classElement.name;
  }

  return result;
}

/**
 * Evaluate if a class has a static instance
 */
function evaluateHasStaticInstance(
  rule: PatternDetectionRule,
  fileContext: FileContext
): {
  matched: boolean;
  confidence: number;
  matchingElements: string[];
  details: Record<string, any>;
} {
  const result = {
    matched: false,
    confidence: 0,
    matchingElements: [] as string[],
    details: {} as Record<string, any>,
  };

  // Get class name from rule parameters
  const className = rule.params.className as string;

  // Find the class
  const classElement = fileContext.elements.find(
    e => e.type === CodeElementType.CLASS && (className ? e.name === className : true)
  );

  if (!classElement) {
    return result;
  }

  // Check if the class has a static instance
  const hasStaticInstance =
    fileContext.content.includes(`static instance`) ||
    fileContext.content.includes(`static readonly instance`) ||
    fileContext.content.includes(`static private instance`) ||
    fileContext.content.includes(`static #instance`);

  if (hasStaticInstance) {
    result.matched = true;
    result.confidence = 0.8;
    result.matchingElements.push(classElement.name);
    result.details.className = classElement.name;
  }

  return result;
}

/**
 * Evaluate if a class has a getInstance method
 */
function evaluateHasGetInstanceMethod(
  rule: PatternDetectionRule,
  fileContext: FileContext
): {
  matched: boolean;
  confidence: number;
  matchingElements: string[];
  details: Record<string, any>;
} {
  const result = {
    matched: false,
    confidence: 0,
    matchingElements: [] as string[],
    details: {} as Record<string, any>,
  };

  // Get class name from rule parameters
  const className = rule.params.className as string;

  // Find the class
  const classElement = fileContext.elements.find(
    e => e.type === CodeElementType.CLASS && (className ? e.name === className : true)
  );

  if (!classElement) {
    return result;
  }

  // Check if the class has a getInstance method
  const hasGetInstanceMethod =
    fileContext.content.includes(`static getInstance`) ||
    fileContext.content.includes(`static getInstace`) || // Common typo
    fileContext.content.includes(`static get instance`);

  if (hasGetInstanceMethod) {
    result.matched = true;
    result.confidence = 0.9;
    result.matchingElements.push(classElement.name);
    result.details.className = classElement.name;
  }

  return result;
}

// Placeholder implementations for other rule evaluators
function evaluateImplementsInterface(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateExtendsClass(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasFactoryMethod(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasBuilderMethod(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasMethod(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasProperty(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasImport(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasPattern(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasNamingPattern(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasAnnotation(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasDecorator(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateHasStructure(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateAllOf(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateAnyOf(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}

function evaluateNoneOf(rule: PatternDetectionRule, fileContext: FileContext) {
  return { matched: false, confidence: 0, matchingElements: [], details: {} };
}
