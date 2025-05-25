/**
 * CodeStyleChecker
 *
 * Checks compliance with code style guidelines.
 *
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

/**
 * CodeStyleChecker
 *
 * Checks compliance with code style guidelines.
 */
class CodeStyleChecker extends EventEmitter {
  /**
   * Create a new CodeStyleChecker instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Base directory
      baseDir: process.cwd(),

      // Whether to enforce all guidelines strictly
      strictMode: true,

      // Merge with provided options
      ...options,
    };
  }

  /**
   * Check code style compliance
   * @param {string} targetPath - Path to the implementation to check
   * @param {boolean} isDirectory - Whether the target is a directory
   * @param {Object} options - Check options
   * @returns {Promise<Object>} Check result
   */
  async check(targetPath, isDirectory, options = {}) {
    try {
      this.log(`Checking code style compliance for: ${targetPath}`);

      // If target is a directory, check all JS files in directory
      if (isDirectory) {
        const files = await this._getJSFiles(targetPath);

        // Check each file
        const results = await Promise.all(files.map(file => this._checkFile(file)));

        // Combine violations
        const violations = results.flatMap(result => result.violations);

        // Group results by category
        const namingConventions = {
          compliant: !violations.some(v => v.guideline === 'codeStyle.namingConventions'),
          violations: violations.filter(v => v.guideline === 'codeStyle.namingConventions'),
        };

        const fileStructure = {
          compliant: !violations.some(v => v.guideline === 'codeStyle.fileStructure'),
          violations: violations.filter(v => v.guideline === 'codeStyle.fileStructure'),
        };

        const errorHandling = {
          compliant: !violations.some(v => v.guideline === 'codeStyle.errorHandling'),
          violations: violations.filter(v => v.guideline === 'codeStyle.errorHandling'),
        };

        return {
          namingConventions,
          fileStructure,
          errorHandling,
          violations,
        };
      }

      // If target is a file, check that file
      return await this._checkFile(targetPath);
    } catch (error) {
      this.log(`Code style check error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check code style in file
   * @param {string} filePath - Path to file
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkFile(filePath) {
    try {
      // Only check JS files
      if (!filePath.endsWith('.js')) {
        return {
          compliant: true,
          violations: [],
        };
      }

      // Read file content
      const content = await fs.readFile(filePath, 'utf8');

      // Check naming conventions
      const namingResult = this._checkNamingConventions(filePath, content);

      // Check file structure
      const structureResult = this._checkFileStructure(filePath, content);

      // Check error handling
      const errorHandlingResult = this._checkErrorHandling(filePath, content);

      // Combine violations
      const violations = [
        ...namingResult.violations,
        ...structureResult.violations,
        ...errorHandlingResult.violations,
      ];

      return {
        namingConventions: namingResult,
        fileStructure: structureResult,
        errorHandling: errorHandlingResult,
        violations,
      };
    } catch (error) {
      this.log(`Check file error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check naming conventions
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Object} Check result
   * @private
   */
  _checkNamingConventions(filePath, content) {
    try {
      this.log(`Checking naming conventions for: ${filePath}`);

      const violations = [];

      // Check class names (PascalCase)
      const classRegex = /class\s+(\w+)/g;
      const classes = [...content.matchAll(classRegex)].map(match => match[1]);

      for (const className of classes) {
        if (!this._isPascalCase(className)) {
          violations.push({
            guideline: 'codeStyle.namingConventions',
            path: filePath,
            message: `Class name "${className}" is not in PascalCase`,
            severity: 'warning',
          });
        }
      }

      // Check variable and function names (camelCase)
      const varRegex = /(?:const|let|var)\s+(\w+)\s*=/g;
      const funcRegex = /function\s+(\w+)\s*\(/g;

      const variables = [...content.matchAll(varRegex)].map(match => match[1]);
      const functions = [...content.matchAll(funcRegex)].map(match => match[1]);

      // Check variables
      for (const varName of variables) {
        // Skip constants (all caps with underscores)
        if (this._isConstant(varName)) {
          continue;
        }

        if (!this._isCamelCase(varName)) {
          violations.push({
            guideline: 'codeStyle.namingConventions',
            path: filePath,
            message: `Variable name "${varName}" is not in camelCase`,
            severity: 'warning',
          });
        }
      }

      // Check functions
      for (const funcName of functions) {
        if (!this._isCamelCase(funcName)) {
          violations.push({
            guideline: 'codeStyle.namingConventions',
            path: filePath,
            message: `Function name "${funcName}" is not in camelCase`,
            severity: 'warning',
          });
        }
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check naming conventions error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check file structure
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Object} Check result
   * @private
   */
  _checkFileStructure(filePath, content) {
    try {
      this.log(`Checking file structure for: ${filePath}`);

      const violations = [];

      // Check for JSDoc file header
      const hasFileHeader =
        content.startsWith('/**') && content.includes('* @version') && content.includes('*/');

      if (!hasFileHeader) {
        violations.push({
          guideline: 'codeStyle.fileStructure',
          path: filePath,
          message: `File missing JSDoc header comment with version information`,
          severity: 'warning',
        });
      }

      // Check for consistent indentation
      const indentationRegex = /^( {2}|\t)/gm;
      const indentationMatches = [...content.matchAll(indentationRegex)];

      // Check if there's a mix of tabs and spaces
      const hasTabs = indentationMatches.some(match => match[1] === '\t');
      const hasSpaces = indentationMatches.some(match => match[1] === '  ');

      if (hasTabs && hasSpaces) {
        violations.push({
          guideline: 'codeStyle.fileStructure',
          path: filePath,
          message: `File has inconsistent indentation (mix of tabs and spaces)`,
          severity: 'warning',
        });
      }

      // Check for consistent line endings
      const hasCRLF = content.includes('\r\n');
      const hasLF = content.includes('\n') && !content.includes('\r\n');

      if (hasCRLF && hasLF) {
        violations.push({
          guideline: 'codeStyle.fileStructure',
          path: filePath,
          message: `File has inconsistent line endings (mix of CRLF and LF)`,
          severity: 'warning',
        });
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check file structure error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check error handling
   * @param {string} filePath - Path to file
   * @param {string} content - File content
   * @returns {Object} Check result
   * @private
   */
  _checkErrorHandling(filePath, content) {
    try {
      this.log(`Checking error handling for: ${filePath}`);

      const violations = [];

      // Check for try/catch blocks
      const asyncFuncRegex = /async\s+\w+\s*\([^)]*\)\s*{/g;
      const asyncFuncs = [...content.matchAll(asyncFuncRegex)];

      const tryCatchRegex = /try\s*{[^}]*}\s*catch\s*\(\w+\)\s*{/gs;
      const tryCatchBlocks = [...content.matchAll(tryCatchRegex)];

      // If there are async functions but no try/catch blocks, that's a potential issue
      if (asyncFuncs.length > 0 && tryCatchBlocks.length === 0) {
        violations.push({
          guideline: 'codeStyle.errorHandling',
          path: filePath,
          message: `File has async functions but no try/catch blocks for error handling`,
          severity: 'warning',
        });
      }

      // Check for error messages in catch blocks
      const catchBlockRegex = /catch\s*\((\w+)\)\s*{([^}]*)}/gs;
      const catchBlocks = [...content.matchAll(catchBlockRegex)];

      for (const [, errorVar, catchBody] of catchBlocks) {
        // Check if error message is used
        const usesErrorMessage = catchBody.includes(`${errorVar}.message`);

        // Check if error is logged or emitted
        const logsError =
          catchBody.includes('console.log') ||
          catchBody.includes('console.error') ||
          catchBody.includes('this.log') ||
          catchBody.includes('this.emit');

        if (!usesErrorMessage || !logsError) {
          violations.push({
            guideline: 'codeStyle.errorHandling',
            path: filePath,
            message: `Catch block does not properly handle or log error message`,
            severity: 'warning',
          });
        }
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check error handling error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Get all JS files in directory
   * @param {string} dirPath - Path to directory
   * @returns {Promise<Array>} JS files
   * @private
   */
  async _getJSFiles(dirPath) {
    try {
      const files = [];

      // Read directory
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      // Process each entry
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively get files from subdirectory
          const subFiles = await this._getJSFiles(entryPath);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith('.js')) {
          // Add JS file
          files.push(entryPath);
        }
      }

      return files;
    } catch (error) {
      this.log(`Get JS files error: ${error.message}`);
      return [];
    }
  }

  /**
   * Check if string is PascalCase
   * @param {string} str - String to check
   * @returns {boolean} Whether string is PascalCase
   * @private
   */
  _isPascalCase(str) {
    return /^[A-Z][a-zA-Z0-9]*$/.test(str);
  }

  /**
   * Check if string is camelCase
   * @param {string} str - String to check
   * @returns {boolean} Whether string is camelCase
   * @private
   */
  _isCamelCase(str) {
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
  }

  /**
   * Check if string is a constant (all caps with underscores)
   * @param {string} str - String to check
   * @returns {boolean} Whether string is a constant
   * @private
   */
  _isConstant(str) {
    return /^[A-Z][A-Z0-9_]*$/.test(str);
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[CodeStyleChecker] ${message}`);
    }
  }
}

module.exports = CodeStyleChecker;
