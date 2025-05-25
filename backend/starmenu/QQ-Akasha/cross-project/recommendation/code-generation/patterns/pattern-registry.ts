/**
 * Pattern registry for managing design patterns
 */

import {
  DesignPattern,
  DesignPatternType,
  DesignPatternCategory,
  PatternDetectionRuleType,
} from './types';
import { ProgrammingLanguage } from '../templates/types';

/**
 * Pattern registry
 */
export class PatternRegistry {
  private patterns: Map<DesignPatternType, DesignPattern> = new Map();

  /**
   * Register a pattern
   */
  registerPattern(pattern: DesignPattern): void {
    this.patterns.set(pattern.type, pattern);
  }

  /**
   * Get a pattern by type
   */
  getPattern(type: DesignPatternType): DesignPattern | undefined {
    return this.patterns.get(type);
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): DesignPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get patterns by category
   */
  getPatternsByCategory(category: DesignPatternCategory): DesignPattern[] {
    return this.getAllPatterns().filter(pattern => pattern.category === category);
  }

  /**
   * Get patterns by language
   */
  getPatternsByLanguage(language: ProgrammingLanguage): DesignPattern[] {
    return this.getAllPatterns().filter(pattern => pattern.examples && pattern.examples[language]);
  }
}

/**
 * Create and initialize a pattern registry
 */
export function createPatternRegistry(): PatternRegistry {
  const registry = new PatternRegistry();

  // Register singleton pattern
  registry.registerPattern({
    type: DesignPatternType.SINGLETON,
    name: 'Singleton',
    category: DesignPatternCategory.CREATIONAL,
    description:
      'Ensures a class has only one instance and provides a global point of access to it.',
    useCases: [
      'When exactly one instance of a class is needed',
      'When the instance must be accessible from a well-known access point',
      'When the sole instance should be extensible by subclassing',
    ],
    benefits: [
      'Controlled access to sole instance',
      'Reduced namespace pollution',
      'Permits refinement of operations and representation',
      'Permits a variable number of instances',
      'More flexible than class operations',
    ],
    drawbacks: [
      'Makes unit testing difficult',
      'Introduces global state into the application',
      'May be difficult to subclass',
    ],
    examples: {
      [ProgrammingLanguage.TYPESCRIPT]: `class Singleton {
  private static instance: Singleton;
  
  private constructor() {
    // Private constructor to prevent direct instantiation
  }
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
  
  public someMethod(): void {
    console.log('Singleton method called');
  }
}

// Usage
const instance1 = Singleton.getInstance();
const instance2 = Singleton.getInstance();

console.log(instance1 === instance2); // true`,
      [ProgrammingLanguage.PYTHON]: `class Singleton:
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def some_method(self):
        print("Singleton method called")
        
# Usage
instance1 = Singleton()
instance2 = Singleton()

print(instance1 is instance2)  # True`,
      [ProgrammingLanguage.JAVA]: `public class Singleton {
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
    
    public void someMethod() {
        System.out.println("Singleton method called");
    }
}

// Usage
Singleton instance1 = Singleton.getInstance();
Singleton instance2 = Singleton.getInstance();

System.out.println(instance1 == instance2); // true`,
    },
    relatedPatterns: [DesignPatternType.FACTORY, DesignPatternType.BUILDER],
    detectionRules: [
      {
        type: PatternDetectionRuleType.HAS_PRIVATE_CONSTRUCTOR,
        params: {},
      },
      {
        type: PatternDetectionRuleType.HAS_STATIC_INSTANCE,
        params: {},
      },
      {
        type: PatternDetectionRuleType.HAS_GET_INSTANCE_METHOD,
        params: {},
      },
    ],
  });

  // Register factory pattern
  registry.registerPattern({
    type: DesignPatternType.FACTORY,
    name: 'Factory Method',
    category: DesignPatternCategory.CREATIONAL,
    description:
      'Defines an interface for creating an object, but lets subclasses decide which class to instantiate.',
    useCases: [
      'When a class cannot anticipate the class of objects it must create',
      'When a class wants its subclasses to specify the objects it creates',
      'When classes delegate responsibility to one of several helper subclasses, and you want to localize the knowledge of which helper subclass is the delegate',
    ],
    benefits: [
      'Eliminates the need to bind application-specific classes into your code',
      'Provides hooks for subclasses to extend the factory method',
      'Connects parallel class hierarchies',
    ],
    drawbacks: ['May involve creating a lot of subclasses', 'Can lead to complex hierarchies'],
    examples: {
      [ProgrammingLanguage.TYPESCRIPT]: `interface Product {
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

abstract class Creator {
  abstract factoryMethod(): Product;
  
  someOperation(): string {
    const product = this.factoryMethod();
    return \`Creator: \${product.operation()}\`;
  }
}

class ConcreteCreatorA extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductA();
  }
}

class ConcreteCreatorB extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductB();
  }
}

// Usage
function clientCode(creator: Creator) {
  console.log(creator.someOperation());
}

clientCode(new ConcreteCreatorA());
clientCode(new ConcreteCreatorB());`,
    },
    relatedPatterns: [
      DesignPatternType.ABSTRACT_FACTORY,
      DesignPatternType.TEMPLATE_METHOD,
      DesignPatternType.PROTOTYPE,
    ],
    detectionRules: [
      {
        type: PatternDetectionRuleType.HAS_FACTORY_METHOD,
        params: {},
      },
    ],
  });

  // Register more patterns here...

  return registry;
}

/**
 * Global pattern registry instance
 */
export const patternRegistry = createPatternRegistry();
