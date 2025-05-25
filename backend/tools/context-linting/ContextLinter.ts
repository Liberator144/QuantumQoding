/**
 * Context-Specific Linter
 *
 * Provides context-aware linting capabilities by applying different linting rules
 * based on the detected context of files and directories.
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { MLContextDetector } = require('../context-detection/ml/MLContextDetector');

/**
 * Context-Specific Linter
 */
class ContextLinter extends EventEmitter {
  /**
   * Create a new ContextLinter instance
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

      // Include directories
      includeDirs: options.includeDirs || ['src', 'tests', 'docs'],

      // Exclude directories
      excludeDirs: options.excludeDirs || ['node_modules', 'dist', 'build', 'coverage'],

      // Include extensions
      includeExtensions: options.includeExtensions || [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.md',
        '.json',
      ],

      // Exclude patterns
      excludePatterns: options.excludePatterns || [/\.min\.js$/, /\.bundle\.js$/],

      // Maximum depth for directory traversal
      maxDepth: options.maxDepth || 10,

      // Context detector options
      contextDetector: options.contextDetector || {},

      // ESLint configuration
      eslint: options.eslint || {
        useEslintrc: true,
        overrideConfigFile: null,
      },

      // Prettier configuration
      prettier: options.prettier || {
        usePrettierrc: true,
        overrideConfigFile: null,
      },

      // Markdown linting configuration
      markdownlint: options.markdownlint || {
        useMarkdownlintrc: true,
        overrideConfigFile: null,
      },

      // Context-specific linting rules
      contextRules: options.contextRules || {
        core: {
          eslint: {
            rules: {
              complexity: ['error', 10],
              'max-depth': ['error', 3],
              'max-lines': ['error', 300],
              'max-params': ['error', 4],
              'no-console': 'error',
              'no-alert': 'error',
              'no-debugger': 'error',
            },
          },
          prettier: {
            printWidth: 100,
            tabWidth: 2,
            singleQuote: true,
          },
        },
        flow: {
          eslint: {
            rules: {
              'no-await-in-loop': 'warn',
              'require-await': 'error',
              'no-return-await': 'error',
              'max-nested-callbacks': ['error', 3],
              'promise/always-return': 'error',
              'promise/no-nesting': 'warn',
            },
          },
        },
        verification: {
          eslint: {
            rules: {
              'jest/expect-expect': 'error',
              'jest/no-disabled-tests': 'warn',
              'jest/no-focused-tests': 'error',
              'jest/no-identical-title': 'error',
              'jest/valid-expect': 'error',
            },
          },
        },
        visualization: {
          eslint: {
            rules: {
              'no-magic-numbers': 'off',
              'max-lines': ['error', 500],
              complexity: ['error', 15],
            },
          },
        },
        security: {
          eslint: {
            rules: {
              'security/detect-possible-timing-attacks': 'error',
              'security/detect-eval-with-expression': 'error',
              'security/detect-non-literal-regexp': 'error',
              'security/detect-non-literal-require': 'error',
              'security/detect-buffer-noassert': 'error',
              'no-eval': 'error',
              'no-implied-eval': 'error',
            },
          },
        },
        caching: {
          eslint: {
            rules: {
              'no-param-reassign': 'error',
              'no-multi-assign': 'error',
              'max-depth': ['error', 2],
            },
          },
        },
        schemas: {
          eslint: {
            rules: {
              'no-unused-vars': 'error',
              'no-undef': 'error',
              'valid-typeof': 'error',
              'no-shadow': 'error',
            },
          },
        },
        optimization: {
          eslint: {
            rules: {
              'no-unused-expressions': 'error',
              'no-sequences': 'error',
              'no-loop-func': 'error',
              'no-extra-bind': 'error',
            },
          },
        },
        ai: {
          eslint: {
            rules: {
              complexity: ['error', 20],
              'max-depth': ['error', 4],
              'max-lines': ['error', 500],
              'max-params': ['error', 6],
            },
          },
        },
        testing: {
          eslint: {
            rules: {
              'jest/expect-expect': 'error',
              'jest/no-disabled-tests': 'warn',
              'jest/no-focused-tests': 'error',
              'jest/no-identical-title': 'error',
              'jest/valid-expect': 'error',
              'no-console': 'off',
            },
          },
        },
        documentation: {
          markdownlint: {
            MD013: { line_length: 120 },
            MD033: { allowed_elements: ['augment_code_snippet'] },
            MD041: false,
          },
          eslint: {
            rules: {
              'valid-jsdoc': 'error',
              'require-jsdoc': [
                'error',
                {
                  require: {
                    FunctionDeclaration: true,
                    MethodDefinition: true,
                    ClassDeclaration: true,
                  },
                },
              ],
              'no-console': 'off',
            },
          },
        },
        general: {
          eslint: {
            rules: {
              'no-console': 'warn',
              'no-unused-vars': 'warn',
              'no-undef': 'error',
            },
          },
          prettier: {
            printWidth: 100,
            tabWidth: 2,
            singleQuote: true,
          },
          markdownlint: {
            MD013: { line_length: 100 },
          },
        },
      },

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize the linter
   * @private
   */
  _init() {
    this.log('Initializing Context Linter');

    // Create context detector
    this.contextDetector = new MLContextDetector({
      debugMode: this.config.debugMode,
      baseDir: this.config.baseDir,
      includeDirs: this.config.includeDirs,
      excludeDirs: this.config.excludeDirs,
      includeExtensions: this.config.includeExtensions,
      excludePatterns: this.config.excludePatterns,
      maxDepth: this.config.maxDepth,
      ...this.config.contextDetector,
    });

    // Load linting engines
    this._loadLintingEngines();

    this.log('Context Linter initialized');
  }

  /**
   * Load linting engines
   * @private
   */
  _loadLintingEngines() {
    try {
      // Load ESLint
      const { ESLint } = require('eslint');
      this.eslint = new ESLint({
        useEslintrc: this.config.eslint.useEslintrc,
        overrideConfigFile: this.config.eslint.overrideConfigFile,
      });
      this.log('ESLint loaded');
    } catch (error) {
      this.log(`Error loading ESLint: ${error.message}`);
      this.eslint = null;
    }

    try {
      // Load Prettier
      this.prettier = require('prettier');
      this.log('Prettier loaded');
    } catch (error) {
      this.log(`Error loading Prettier: ${error.message}`);
      this.prettier = null;
    }

    try {
      // Load markdownlint
      this.markdownlint = require('markdownlint');
      this.log('markdownlint loaded');
    } catch (error) {
      this.log(`Error loading markdownlint: ${error.message}`);
      this.markdownlint = null;
    }
  }

  /**
   * Lint a file or directory with context-specific rules
   * @param {string} targetPath - Path to file or directory
   * @param {Object} options - Linting options
   * @returns {Promise<Object>} Linting result
   */
  async lint(targetPath, options = {}) {
    try {
      const fullPath = path.resolve(this.config.baseDir, targetPath);

      // Check if path exists
      if (!fs.existsSync(fullPath)) {
        throw new Error(`Path does not exist: ${fullPath}`);
      }

      // Detect context or use forced context
      let contextResult;

      if (options.forceContext) {
        this.log(`Using forced context: ${options.forceContext}`);
        contextResult = {
          path: fullPath,
          type: fs.statSync(fullPath).isDirectory() ? 'directory' : 'file',
          context: options.forceContext,
          confidence: 1.0,
          scores: { [options.forceContext]: 1.0 },
        };
      } else {
        contextResult = await this.contextDetector.detectContext(fullPath, options);
      }

      // Lint based on context
      let lintResult;

      if (fs.statSync(fullPath).isDirectory()) {
        lintResult = await this._lintDirectory(fullPath, contextResult, options);
      } else {
        lintResult = await this._lintFile(fullPath, contextResult, options);
      }

      return {
        path: fullPath,
        context: contextResult,
        result: lintResult,
      };
    } catch (error) {
      this.log(`Error linting: ${error.message}`);
      throw error;
    }
  }

  /**
   * Lint a file with context-specific rules
   * @param {string} filePath - Path to file
   * @param {Object} contextResult - Context detection result
   * @param {Object} options - Linting options
   * @returns {Promise<Object>} Linting result
   * @private
   */
  async _lintFile(filePath, contextResult, options = {}) {
    this.log(`Linting file: ${filePath} (Context: ${contextResult.context})`);

    const ext = path.extname(filePath);
    const result = {
      eslint: null,
      prettier: null,
      markdownlint: null,
    };

    // Get context-specific rules
    const contextRules =
      this.config.contextRules[contextResult.context] || this.config.contextRules.general;

    // Lint with ESLint
    if (this.eslint && ['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      result.eslint = await this._lintWithEslint(filePath, contextRules.eslint);
    }

    // Lint with Prettier
    if (this.prettier) {
      result.prettier = await this._lintWithPrettier(filePath, contextRules.prettier);
    }

    // Lint with markdownlint
    if (this.markdownlint && ext === '.md') {
      result.markdownlint = await this._lintWithMarkdownlint(filePath, contextRules.markdownlint);
    }

    return result;
  }

  /**
   * Lint a directory with context-specific rules
   * @param {string} dirPath - Path to directory
   * @param {Object} contextResult - Context detection result
   * @param {Object} options - Linting options
   * @returns {Promise<Object>} Linting result
   * @private
   */
  async _lintDirectory(dirPath, contextResult, options = {}) {
    this.log(`Linting directory: ${dirPath} (Context: ${contextResult.context})`);

    // Get files in directory
    const files = await this._getFilesInDirectory(dirPath, options);

    // Lint each file
    const fileResults = [];

    for (const file of files) {
      try {
        // Detect context for file
        const fileContextResult = await this.contextDetector.detectContext(file, options);

        // Lint file
        const fileLintResult = await this._lintFile(file, fileContextResult, options);

        fileResults.push({
          path: file,
          context: fileContextResult.context,
          result: fileLintResult,
        });
      } catch (error) {
        this.log(`Error linting file ${file}: ${error.message}`);

        fileResults.push({
          path: file,
          error: error.message,
        });
      }
    }

    return {
      fileCount: fileResults.length,
      fileResults,
    };
  }

  /**
   * Lint a file with ESLint
   * @param {string} filePath - Path to file
   * @param {Object} rules - ESLint rules
   * @returns {Promise<Object>} ESLint result
   * @private
   */
  async _lintWithEslint(filePath, rules) {
    try {
      // Create custom ESLint instance with context-specific rules
      const contextEslint = new (require('eslint').ESLint)({
        useEslintrc: this.config.eslint.useEslintrc,
        overrideConfigFile: this.config.eslint.overrideConfigFile,
        overrideConfig: {
          rules: rules.rules,
        },
      });

      // Lint file
      const results = await contextEslint.lintFiles([filePath]);

      return {
        errorCount: results[0].errorCount,
        warningCount: results[0].warningCount,
        messages: results[0].messages,
        output: results[0].output,
      };
    } catch (error) {
      this.log(`Error linting with ESLint: ${error.message}`);
      return {
        error: error.message,
      };
    }
  }

  /**
   * Lint a file with Prettier
   * @param {string} filePath - Path to file
   * @param {Object} options - Prettier options
   * @returns {Promise<Object>} Prettier result
   * @private
   */
  async _lintWithPrettier(filePath, options) {
    try {
      // Read file
      const content = fs.readFileSync(filePath, 'utf8');

      // Get Prettier config
      const prettierConfig = await this.prettier.resolveConfig(filePath);

      // Check if file is formatted
      const isFormatted = await this.prettier.check(content, {
        ...prettierConfig,
        ...options,
        filepath: filePath,
      });

      return {
        isFormatted,
        options: {
          ...prettierConfig,
          ...options,
        },
      };
    } catch (error) {
      this.log(`Error linting with Prettier: ${error.message}`);
      return {
        error: error.message,
      };
    }
  }

  /**
   * Lint a file with markdownlint
   * @param {string} filePath - Path to file
   * @param {Object} options - markdownlint options
   * @returns {Promise<Object>} markdownlint result
   * @private
   */
  async _lintWithMarkdownlint(filePath, options) {
    try {
      // Read file
      const content = fs.readFileSync(filePath, 'utf8');

      // Create markdownlint config
      const markdownlintConfig = {
        ...options,
      };

      // Lint file
      const result = this.markdownlint.sync({
        strings: {
          [filePath]: content,
        },
        config: markdownlintConfig,
      });

      return {
        errorCount: result[filePath].length,
        messages: result[filePath],
        options: markdownlintConfig,
      };
    } catch (error) {
      this.log(`Error linting with markdownlint: ${error.message}`);
      return {
        error: error.message,
      };
    }
  }

  /**
   * Get all files in a directory recursively
   * @param {string} dirPath - Directory path
   * @param {Object} options - Options
   * @param {number} depth - Current depth
   * @returns {Promise<Array>} Array of file paths
   * @private
   */
  async _getFilesInDirectory(dirPath, options = {}, depth = 0) {
    // Check max depth
    if (depth > this.config.maxDepth) {
      return [];
    }

    const files = [];
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);

      // Skip excluded directories
      if (entry.isDirectory() && this.config.excludeDirs.includes(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        // Recursively get files in subdirectory
        const subFiles = await this._getFilesInDirectory(entryPath, options, depth + 1);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        // Check file extension
        const ext = path.extname(entry.name);

        if (this.config.includeExtensions.includes(ext)) {
          // Check exclude patterns
          let excluded = false;

          for (const pattern of this.config.excludePatterns) {
            if (pattern.test(entry.name)) {
              excluded = true;
              break;
            }
          }

          if (!excluded) {
            files.push(entryPath);
          }
        }
      }
    }

    return files;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[ContextLinter] ${message}`);
    }
  }
}

module.exports = { ContextLinter };
