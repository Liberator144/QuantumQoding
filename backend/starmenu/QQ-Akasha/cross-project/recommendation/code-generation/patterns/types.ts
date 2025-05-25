/**
 * Types for pattern-based code generation
 */

import { ProgrammingLanguage } from '../templates/types';

/**
 * Design pattern type
 */
export enum DesignPatternType {
  // Creational patterns
  SINGLETON = 'singleton',
  FACTORY = 'factory',
  ABSTRACT_FACTORY = 'abstract-factory',
  BUILDER = 'builder',
  PROTOTYPE = 'prototype',

  // Structural patterns
  ADAPTER = 'adapter',
  BRIDGE = 'bridge',
  COMPOSITE = 'composite',
  DECORATOR = 'decorator',
  FACADE = 'facade',
  FLYWEIGHT = 'flyweight',
  PROXY = 'proxy',

  // Behavioral patterns
  CHAIN_OF_RESPONSIBILITY = 'chain-of-responsibility',
  COMMAND = 'command',
  INTERPRETER = 'interpreter',
  ITERATOR = 'iterator',
  MEDIATOR = 'mediator',
  MEMENTO = 'memento',
  OBSERVER = 'observer',
  STATE = 'state',
  STRATEGY = 'strategy',
  TEMPLATE_METHOD = 'template-method',
  VISITOR = 'visitor',

  // Architectural patterns
  MVC = 'mvc',
  MVP = 'mvp',
  MVVM = 'mvvm',
  CLEAN_ARCHITECTURE = 'clean-architecture',
  REPOSITORY = 'repository',

  // Concurrency patterns
  PRODUCER_CONSUMER = 'producer-consumer',
  READER_WRITER = 'reader-writer',
  THREAD_POOL = 'thread-pool',

  // Other patterns
  DEPENDENCY_INJECTION = 'dependency-injection',
  LAZY_LOADING = 'lazy-loading',
  MODULE = 'module',
  MIDDLEWARE = 'middleware',
  PIPELINE = 'pipeline',
}

/**
 * Design pattern category
 */
export enum DesignPatternCategory {
  CREATIONAL = 'creational',
  STRUCTURAL = 'structural',
  BEHAVIORAL = 'behavioral',
  ARCHITECTURAL = 'architectural',
  CONCURRENCY = 'concurrency',
  OTHER = 'other',
}

/**
 * Design pattern
 */
export interface DesignPattern {
  /** Pattern type */
  type: DesignPatternType;

  /** Pattern name */
  name: string;

  /** Pattern category */
  category: DesignPatternCategory;

  /** Pattern description */
  description: string;

  /** Pattern use cases */
  useCases: string[];

  /** Pattern benefits */
  benefits: string[];

  /** Pattern drawbacks */
  drawbacks: string[];

  /** Pattern implementation examples by language */
  examples: Partial<Record<ProgrammingLanguage, string>>;

  /** Pattern related patterns */
  relatedPatterns: DesignPatternType[];

  /** Pattern detection rules */
  detectionRules: PatternDetectionRule[];
}

/**
 * Pattern detection rule
 */
export interface PatternDetectionRule {
  /** Rule type */
  type: PatternDetectionRuleType;

  /** Rule parameters */
  params: Record<string, any>;
}

/**
 * Pattern detection rule type
 */
export enum PatternDetectionRuleType {
  /** Check if a class has a private constructor */
  HAS_PRIVATE_CONSTRUCTOR = 'has-private-constructor',

  /** Check if a class has a static instance */
  HAS_STATIC_INSTANCE = 'has-static-instance',

  /** Check if a class has a static getInstance method */
  HAS_GET_INSTANCE_METHOD = 'has-get-instance-method',

  /** Check if a class implements an interface */
  IMPLEMENTS_INTERFACE = 'implements-interface',

  /** Check if a class extends another class */
  EXTENDS_CLASS = 'extends-class',

  /** Check if a class has a factory method */
  HAS_FACTORY_METHOD = 'has-factory-method',

  /** Check if a class has a builder method */
  HAS_BUILDER_METHOD = 'has-builder-method',

  /** Check if a class has a specific method */
  HAS_METHOD = 'has-method',

  /** Check if a class has a specific property */
  HAS_PROPERTY = 'has-property',

  /** Check if a file has a specific import */
  HAS_IMPORT = 'has-import',

  /** Check if a file has a specific pattern in its content */
  HAS_PATTERN = 'has-pattern',

  /** Check if a file has a specific naming pattern */
  HAS_NAMING_PATTERN = 'has-naming-pattern',

  /** Check if a class has a specific annotation */
  HAS_ANNOTATION = 'has-annotation',

  /** Check if a class has a specific decorator */
  HAS_DECORATOR = 'has-decorator',

  /** Check if a file has a specific structure */
  HAS_STRUCTURE = 'has-structure',

  /** Composite rule that requires all sub-rules to match */
  ALL_OF = 'all-of',

  /** Composite rule that requires any sub-rule to match */
  ANY_OF = 'any-of',

  /** Composite rule that requires none of the sub-rules to match */
  NONE_OF = 'none-of',
}

/**
 * Pattern detection result
 */
export interface PatternDetectionResult {
  /** Detected pattern */
  pattern: DesignPatternType;

  /** Confidence level (0-1) */
  confidence: number;

  /** Matching elements */
  matchingElements: string[];

  /** Detection details */
  details: Record<string, any>;
}

/**
 * Pattern adaptation options
 */
export interface PatternAdaptationOptions {
  /** Target language */
  language: ProgrammingLanguage;

  /** Naming conventions */
  namingConventions: {
    /** Class naming convention */
    classes: string;

    /** Interface naming convention */
    interfaces: string;

    /** Method naming convention */
    methods: string;

    /** Variable naming convention */
    variables: string;
  };

  /** Whether to include comments */
  includeComments: boolean;

  /** Whether to include examples */
  includeExamples: boolean;

  /** Whether to include imports */
  includeImports: boolean;

  /** Custom parameters for the pattern */
  customParams?: Record<string, any>;
}

/**
 * Default pattern adaptation options
 */
export const DEFAULT_PATTERN_ADAPTATION_OPTIONS: PatternAdaptationOptions = {
  language: ProgrammingLanguage.TYPESCRIPT,
  namingConventions: {
    classes: 'PascalCase',
    interfaces: 'PascalCase',
    methods: 'camelCase',
    variables: 'camelCase',
  },
  includeComments: true,
  includeExamples: true,
  includeImports: true,
};

/**
 * Pattern adaptation result
 */
export interface PatternAdaptationResult {
  /** Adapted pattern code */
  code: string;

  /** Pattern type */
  pattern: DesignPatternType;

  /** Adaptation errors */
  errors: string[];

  /** Adaptation warnings */
  warnings: string[];
}
