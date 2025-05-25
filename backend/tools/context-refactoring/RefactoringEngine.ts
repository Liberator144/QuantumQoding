/**
 * Intelligent Refactoring Engine
 *
 * Provides context-aware refactoring suggestions for code.
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { MLContextDetector } = require('../context-detection/ml/MLContextDetector');

/**
 * Intelligent Refactoring Engine
 */
class RefactoringEngine extends EventEmitter {
  /**
   * Create a new RefactoringEngine instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: options.debugMode || false,

      // Base directory
      baseDir: options.baseDir || process.cwd(),

      // Context detector options
      contextDetector: options.contextDetector || {},

      // Refactoring rules
      refactoringRules: options.refactoringRules || {
        core: [
          {
            name: 'simplify-conditionals',
            description: 'Simplify complex conditional expressions',
            pattern: /if\s*\(\s*(.+?)\s*&&\s*(.+?)\s*&&\s*(.+?)\s*\)/g,
            suggestion:
              'Consider extracting complex conditions into named functions or variables for better readability',
            severity: 'medium',
          },
          {
            name: 'extract-method',
            description: 'Extract long methods into smaller ones',
            pattern: /function\s+\w+\s*\([^)]*\)\s*\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\}/g,
            lineThreshold: 30,
            suggestion: 'Consider breaking down long methods into smaller, focused methods',
            severity: 'medium',
          },
          {
            name: 'reduce-parameters',
            description: 'Reduce the number of parameters in functions',
            pattern: /function\s+\w+\s*\(([^)]+)\)/g,
            parameterThreshold: 5,
            suggestion: 'Consider using an options object for functions with many parameters',
            severity: 'medium',
          },
        ],
        flow: [
          {
            name: 'async-await',
            description: 'Use async/await instead of promises',
            pattern: /\.then\(\s*(?:function\s*\([^)]*\)|[^)]+?\))\s*=>\s*\{[^}]*\}\s*\)/g,
            suggestion: 'Consider using async/await for better readability of asynchronous code',
            severity: 'medium',
          },
          {
            name: 'error-handling',
            description: 'Improve error handling in async functions',
            pattern: /async\s+function\s+\w+\s*\([^)]*\)\s*\{(?![^}]*?try\s*\{)[^}]*?await[^}]*\}/g,
            suggestion:
              'Consider adding try/catch blocks around await expressions for better error handling',
            severity: 'high',
          },
          {
            name: 'promise-all',
            description: 'Use Promise.all for parallel operations',
            pattern: /for\s*\([^)]+\)\s*\{[^}]*?await[^}]*\}/g,
            suggestion:
              'Consider using Promise.all for parallel async operations instead of awaiting in a loop',
            severity: 'medium',
          },
        ],
        verification: [
          {
            name: 'test-description',
            description: 'Improve test descriptions',
            pattern: /it\s*\(\s*['"]should[^'"]*['"]/g,
            suggestion:
              'Consider using more descriptive test names that explain the expected behavior',
            severity: 'low',
          },
          {
            name: 'test-structure',
            description: 'Improve test structure',
            pattern:
              /describe\s*\(\s*['"][^'"]*['"]\s*,\s*(?:function\s*\(\)|[^)]+?\))\s*=>\s*\{(?![^}]*?beforeEach)[^}]*\}\s*\)/g,
            suggestion: 'Consider using beforeEach for common setup code in tests',
            severity: 'low',
          },
          {
            name: 'test-assertions',
            description: 'Improve test assertions',
            pattern: /expect\s*\([^)]*\)\.toBe\s*\([^)]*\)/g,
            suggestion:
              'Consider using more specific assertions like toEqual, toMatch, or toContain',
            severity: 'low',
          },
        ],
        visualization: [
          {
            name: 'responsive-design',
            description: 'Improve responsive design',
            pattern: /width:\s*\d+px/g,
            suggestion:
              'Consider using relative units (%, em, rem) instead of fixed pixel values for better responsiveness',
            severity: 'medium',
          },
          {
            name: 'accessibility',
            description: 'Improve accessibility',
            pattern: /<img\s+(?![^>]*alt=)[^>]*>/g,
            suggestion: 'Add alt attributes to images for better accessibility',
            severity: 'high',
          },
          {
            name: 'color-contrast',
            description: 'Improve color contrast',
            pattern: /color:\s*#[0-9a-f]{3,6}\s*;\s*background(?:-color)?:\s*#[0-9a-f]{3,6}/gi,
            suggestion: 'Ensure sufficient color contrast for better accessibility',
            severity: 'medium',
          },
        ],
        security: [
          {
            name: 'input-validation',
            description: 'Improve input validation',
            pattern: /req\.(?:params|query|body)\.(\w+)/g,
            suggestion: 'Validate user input before using it to prevent security vulnerabilities',
            severity: 'high',
          },
          {
            name: 'sql-injection',
            description: 'Prevent SQL injection',
            pattern: /db\.query\s*\(\s*['"`](?:[^'"`]*\$\{[^}]*\}[^'"`]*|[^'"`]*\+[^'"`]*)[^)]*\)/g,
            suggestion: 'Use parameterized queries or prepared statements to prevent SQL injection',
            severity: 'critical',
          },
          {
            name: 'xss-prevention',
            description: 'Prevent XSS attacks',
            pattern: /(?:innerHTML|outerHTML)\s*=\s*(?:[^;]*\$\{[^}]*\}[^;]*|[^;]*\+[^;]*)/g,
            suggestion: 'Use safe methods like textContent or sanitize HTML to prevent XSS attacks',
            severity: 'critical',
          },
        ],
        caching: [
          {
            name: 'cache-invalidation',
            description: 'Improve cache invalidation',
            pattern: /cache\.set\s*\(\s*(['"`][^'"`]*['"`])/g,
            suggestion: 'Consider adding cache invalidation strategies for data that can change',
            severity: 'medium',
          },
          {
            name: 'cache-expiration',
            description: 'Add cache expiration',
            pattern: /cache\.set\s*\(\s*[^,]+,\s*[^,)]+\s*\)/g,
            suggestion: 'Consider adding an expiration time to cached items',
            severity: 'medium',
          },
          {
            name: 'cache-strategy',
            description: 'Improve caching strategy',
            pattern:
              /(?:function|const)\s+\w+\s*=\s*(?:function\s*\([^)]*\)|[^)]+?\))\s*=>\s*\{(?![^}]*?cache)[^}]*?(?:fetch|request|axios|http)[^}]*\}/g,
            suggestion: 'Consider adding caching for expensive operations like API calls',
            severity: 'medium',
          },
        ],
        schemas: [
          {
            name: 'schema-validation',
            description: 'Improve schema validation',
            pattern: /new\s+Schema\s*\(\s*\{[^}]*\}\s*\)/g,
            suggestion: 'Consider adding validation rules to schema properties',
            severity: 'medium',
          },
          {
            name: 'schema-defaults',
            description: 'Add default values to schema',
            pattern: /(\w+):\s*\{\s*type:\s*\w+\s*\}/g,
            suggestion: 'Consider adding default values to schema properties',
            severity: 'low',
          },
          {
            name: 'schema-documentation',
            description: 'Improve schema documentation',
            pattern: /(\w+):\s*\{[^}]*\}/g,
            suggestion:
              'Consider adding descriptions to schema properties for better documentation',
            severity: 'low',
          },
        ],
        optimization: [
          {
            name: 'memoization',
            description: 'Use memoization for expensive calculations',
            pattern: /function\s+\w+\s*\([^)]*\)\s*\{(?:[^{}]*|\{(?:[^{}]*|\{[^{}]*\})*\})*\}/g,
            suggestion:
              'Consider using memoization for expensive calculations that are called frequently with the same inputs',
            severity: 'medium',
          },
          {
            name: 'loop-optimization',
            description: 'Optimize loops',
            pattern:
              /for\s*\(\s*let\s+\w+\s*=\s*0\s*;\s*\w+\s*<\s*(\w+)\.length\s*;\s*\w+\+\+\s*\)/g,
            suggestion:
              'Consider caching the length property outside the loop for better performance',
            severity: 'low',
          },
          {
            name: 'reduce-dom-operations',
            description: 'Reduce DOM operations',
            pattern:
              /for\s*\([^)]+\)\s*\{[^}]*?document\.(?:getElementById|querySelector|createElement)[^}]*\}/g,
            suggestion:
              'Consider batching DOM operations or using DocumentFragment for better performance',
            severity: 'medium',
          },
        ],
        ai: [
          {
            name: 'model-loading',
            description: 'Optimize model loading',
            pattern: /loadModel\s*\(\s*(['"`][^'"`]*['"`])\s*\)/g,
            suggestion:
              'Consider lazy-loading models or using a model registry for better resource management',
            severity: 'medium',
          },
          {
            name: 'batch-processing',
            description: 'Use batch processing for predictions',
            pattern: /for\s*\([^)]+\)\s*\{[^}]*?predict\s*\([^)]*\)[^}]*\}/g,
            suggestion:
              'Consider using batch processing for multiple predictions instead of individual calls',
            severity: 'medium',
          },
          {
            name: 'feature-normalization',
            description: 'Normalize features',
            pattern: /predict\s*\(\s*\{[^}]*\}\s*\)/g,
            suggestion:
              'Consider normalizing features before prediction for better model performance',
            severity: 'medium',
          },
        ],
        testing: [
          {
            name: 'test-isolation',
            description: 'Improve test isolation',
            pattern:
              /(?:let|var|const)\s+(\w+)\s*=\s*[^;]+;\s*(?:describe|it)\s*\(\s*['"][^'"]*['"]/g,
            suggestion:
              'Consider moving variable declarations inside test blocks for better isolation',
            severity: 'medium',
          },
          {
            name: 'mock-dependencies',
            description: 'Mock external dependencies',
            pattern:
              /(?:describe|it)\s*\(\s*['"][^'"]*['"]\s*,\s*(?:function\s*\(\)|[^)]+?\))\s*=>\s*\{(?![^}]*?mock)[^}]*?(?:fetch|request|axios|http)[^}]*\}/g,
            suggestion: 'Consider mocking external dependencies like API calls in tests',
            severity: 'high',
          },
          {
            name: 'test-coverage',
            description: 'Improve test coverage',
            pattern:
              /(?:describe|it)\s*\(\s*['"][^'"]*['"]\s*,\s*(?:function\s*\(\)|[^)]+?\))\s*=>\s*\{(?![^}]*?expect)[^}]*\}/g,
            suggestion: "Consider adding assertions to test blocks that don't have any",
            severity: 'medium',
          },
        ],
        documentation: [
          {
            name: 'function-documentation',
            description: 'Improve function documentation',
            pattern: /function\s+(\w+)\s*\([^)]*\)\s*\{(?![\s\S]*?\*\s*@param)/g,
            suggestion:
              'Consider adding JSDoc comments with @param and @returns tags for better documentation',
            severity: 'medium',
          },
          {
            name: 'class-documentation',
            description: 'Improve class documentation',
            pattern: /class\s+(\w+)(?![\s\S]*?\*\s*@class)/g,
            suggestion:
              'Consider adding JSDoc comments with @class and @description tags for better documentation',
            severity: 'medium',
          },
          {
            name: 'example-usage',
            description: 'Add example usage',
            pattern: /\/\*\*[\s\S]*?@param[\s\S]*?\*\/(?![\s\S]*?@example)/g,
            suggestion: 'Consider adding @example tags to show how to use the function or class',
            severity: 'low',
          },
        ],
        general: [
          {
            name: 'magic-numbers',
            description: 'Avoid magic numbers',
            pattern: /(?:=|return|>|<|>=|<=|===|!==|\+|-|\*|\/|%)\s*(\d+)(?!\s*[;,]?\s*\/\/)/g,
            suggestion:
              'Consider extracting magic numbers into named constants for better readability and maintainability',
            severity: 'low',
          },
          {
            name: 'error-messages',
            description: 'Improve error messages',
            pattern: /throw\s+(?:new\s+)?Error\s*\(\s*(['"`][^'"`]*['"`])\s*\)/g,
            suggestion: 'Consider adding more descriptive error messages with context information',
            severity: 'low',
          },
          {
            name: 'variable-naming',
            description: 'Improve variable naming',
            pattern: /(?:let|var|const)\s+([a-z]|[A-Z]\w*)\s*=/g,
            suggestion: 'Consider using more descriptive variable names for better readability',
            severity: 'low',
          },
        ],
      },

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize the engine
   * @private
   */
  _init() {
    this.log('Initializing Refactoring Engine');

    // Create context detector
    this.contextDetector = new MLContextDetector({
      debugMode: this.config.debugMode,
      baseDir: this.config.baseDir,
      ...this.config.contextDetector,
    });

    this.log('Refactoring Engine initialized');
  }

  /**
   * Analyze code for refactoring opportunities
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeCode(options = {}) {
    try {
      this.log('Analyzing code');

      // Get options
      const { targetPath, context: forceContext, rules: specificRules } = options;

      // Validate options
      if (!targetPath) {
        throw new Error('Target path is required');
      }

      // Check if path exists
      if (!fs.existsSync(targetPath)) {
        throw new Error(`Path does not exist: ${targetPath}`);
      }

      // Detect context or use forced context
      let contextResult;

      if (forceContext) {
        this.log(`Using forced context: ${forceContext}`);
        contextResult = {
          context: forceContext,
        };
      } else {
        // Detect context
        contextResult = await this.contextDetector.detectContext(targetPath);
      }

      this.log(`Detected context: ${contextResult.context}`);

      // Get refactoring rules for context
      const contextRules =
        this.config.refactoringRules[contextResult.context] || this.config.refactoringRules.general;

      // Filter rules if specific rules are requested
      const rules = specificRules
        ? contextRules.filter(rule => specificRules.includes(rule.name))
        : contextRules;

      // Analyze file or directory
      let analysisResult;

      if (fs.statSync(targetPath).isDirectory()) {
        analysisResult = await this._analyzeDirectory(targetPath, rules);
      } else {
        analysisResult = await this._analyzeFile(targetPath, rules);
      }

      return {
        path: targetPath,
        context: contextResult.context,
        result: analysisResult,
      };
    } catch (error) {
      this.log(`Error analyzing code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Analyze a file for refactoring opportunities
   * @param {string} filePath - Path to file
   * @param {Array} rules - Refactoring rules
   * @returns {Promise<Object>} Analysis result
   * @private
   */
  async _analyzeFile(filePath, rules) {
    this.log(`Analyzing file: ${filePath}`);

    // Read file
    const content = fs.readFileSync(filePath, 'utf8');

    // Apply rules
    const suggestions = [];

    for (const rule of rules) {
      const matches = this._findMatches(content, rule);

      if (matches.length > 0) {
        suggestions.push({
          rule: rule.name,
          description: rule.description,
          suggestion: rule.suggestion,
          severity: rule.severity,
          matches,
        });
      }
    }

    return {
      suggestions,
      suggestionCount: suggestions.length,
    };
  }

  /**
   * Analyze a directory for refactoring opportunities
   * @param {string} dirPath - Path to directory
   * @param {Array} rules - Refactoring rules
   * @returns {Promise<Object>} Analysis result
   * @private
   */
  async _analyzeDirectory(dirPath, rules) {
    this.log(`Analyzing directory: ${dirPath}`);

    // Get files in directory
    const files = this._getFilesInDirectory(dirPath);

    // Analyze each file
    const fileResults = [];

    for (const file of files) {
      try {
        const result = await this._analyzeFile(file, rules);

        if (result.suggestionCount > 0) {
          fileResults.push({
            path: file,
            result,
          });
        }
      } catch (error) {
        this.log(`Error analyzing file ${file}: ${error.message}`);
      }
    }

    return {
      fileResults,
      fileCount: fileResults.length,
      totalSuggestions: fileResults.reduce((total, file) => total + file.result.suggestionCount, 0),
    };
  }

  /**
   * Find matches for a rule in content
   * @param {string} content - File content
   * @param {Object} rule - Refactoring rule
   * @returns {Array} Matches
   * @private
   */
  _findMatches(content, rule) {
    const matches = [];
    const lines = content.split('\n');

    // Special case for line threshold rules
    if (rule.lineThreshold) {
      const regex = rule.pattern;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const matchText = match[0];
        const lineCount = matchText.split('\n').length;

        if (lineCount > rule.lineThreshold) {
          const startIndex = content.substring(0, match.index).split('\n').length;
          const endIndex = startIndex + lineCount - 1;

          matches.push({
            text: matchText,
            lineStart: startIndex,
            lineEnd: endIndex,
            reason: `Method has ${lineCount} lines, which exceeds the threshold of ${rule.lineThreshold} lines`,
          });
        }
      }

      return matches;
    }

    // Special case for parameter threshold rules
    if (rule.parameterThreshold) {
      const regex = rule.pattern;
      let match;

      while ((match = regex.exec(content)) !== null) {
        const parameters = match[1].split(',');

        if (parameters.length > rule.parameterThreshold) {
          const lineIndex = content.substring(0, match.index).split('\n').length;

          matches.push({
            text: match[0],
            lineStart: lineIndex,
            lineEnd: lineIndex,
            reason: `Function has ${parameters.length} parameters, which exceeds the threshold of ${rule.parameterThreshold} parameters`,
          });
        }
      }

      return matches;
    }

    // Regular pattern matching
    const regex = rule.pattern;
    let match;

    while ((match = regex.exec(content)) !== null) {
      const lineIndex = content.substring(0, match.index).split('\n').length;

      matches.push({
        text: match[0],
        lineStart: lineIndex,
        lineEnd: lineIndex,
        reason: rule.description,
      });
    }

    return matches;
  }

  /**
   * Get all files in a directory recursively
   * @param {string} dirPath - Directory path
   * @param {Array} result - Result array
   * @returns {Array} Array of file paths
   * @private
   */
  _getFilesInDirectory(dirPath, result = []) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules, .git, etc.
        if (['node_modules', '.git', 'dist', 'build', 'coverage'].includes(entry.name)) {
          continue;
        }

        this._getFilesInDirectory(fullPath, result);
      } else if (entry.isFile()) {
        // Only include certain file types
        const ext = path.extname(entry.name);

        if (['.js', '.jsx', '.ts', '.tsx', '.md', '.html', '.css'].includes(ext)) {
          result.push(fullPath);
        }
      }
    }

    return result;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[RefactoringEngine] ${message}`);
    }
  }
}

module.exports = { RefactoringEngine };
