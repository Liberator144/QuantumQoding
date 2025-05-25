/**
 * StructureChecker
 *
 * Checks compliance with structure guidelines.
 *
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

/**
 * StructureChecker
 *
 * Checks compliance with structure guidelines.
 */
class StructureChecker extends EventEmitter {
  /**
   * Create a new StructureChecker instance
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
   * Check structure compliance
   * @param {string} targetPath - Path to the implementation to check
   * @param {boolean} isDirectory - Whether the target is a directory
   * @param {Object} options - Check options
   * @returns {Promise<Object>} Check result
   */
  async check(targetPath, isDirectory, options = {}) {
    try {
      this.log(`Checking structure compliance for: ${targetPath}`);

      // If target is not a directory, get its directory
      const dirPath = isDirectory ? targetPath : path.dirname(targetPath);

      // Get component name
      const componentName = path.basename(isDirectory ? targetPath : path.dirname(targetPath));

      // Check directory structure
      const directoryResult = await this._checkDirectoryStructure(dirPath, componentName);

      // Check file organization
      const organizationResult = await this._checkFileOrganization(dirPath, componentName);

      // Check integration
      const integrationResult = await this._checkIntegration(dirPath, componentName);

      // Collect violations
      const violations = [
        ...directoryResult.violations,
        ...organizationResult.violations,
        ...integrationResult.violations,
      ];

      this.log(`Structure compliance check completed for: ${targetPath}`);

      return {
        directoryStructure: directoryResult,
        fileOrganization: organizationResult,
        integration: integrationResult,
        violations,
      };
    } catch (error) {
      this.log(`Structure check error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check directory structure
   * @param {string} dirPath - Path to directory
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkDirectoryStructure(dirPath, componentName) {
    try {
      this.log(`Checking directory structure for: ${dirPath}`);

      // Check if directory name follows guidelines (lowercase, hyphenated)
      const dirName = path.basename(dirPath);
      const isValidDirName = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(dirName);

      if (!isValidDirName) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'structure.directoryStructure',
              path: dirPath,
              message: `Directory name "${dirName}" does not follow guidelines (lowercase, hyphenated)`,
              severity: 'warning',
            },
          ],
        };
      }

      // Check if directory is in the appropriate module
      const moduleDir = path.dirname(dirPath);
      const moduleName = path.basename(moduleDir);

      // This is a simplified check - in a real implementation, this would be more sophisticated
      // based on the component type and project structure
      const isInAppropriateModule =
        moduleName === 'src' || moduleName === 'components' || moduleName === 'modules';

      if (!isInAppropriateModule) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'structure.directoryStructure',
              path: dirPath,
              message: `Component not placed in appropriate module directory`,
              severity: 'warning',
            },
          ],
        };
      }

      return {
        compliant: true,
        violations: [],
      };
    } catch (error) {
      this.log(`Check directory structure error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check file organization
   * @param {string} dirPath - Path to directory
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkFileOrganization(dirPath, componentName) {
    try {
      this.log(`Checking file organization for: ${dirPath}`);

      // Read directory
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      // Check if main component file exists (PascalCase)
      const mainComponentFile = entries.find(
        entry =>
          entry.isFile() &&
          entry.name.endsWith('.js') &&
          this._isPascalCase(entry.name.replace('.js', ''))
      );

      if (!mainComponentFile) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'structure.fileOrganization',
              path: dirPath,
              message: `Main component file (PascalCase) not found in directory`,
              severity: 'critical',
            },
          ],
        };
      }

      // Check if there are helper files or subcomponents
      const helperFiles = entries.filter(
        entry =>
          entry.isFile() && entry.name.endsWith('.js') && entry.name !== mainComponentFile.name
      );

      // If there are multiple components, check if they're organized properly
      if (helperFiles.length > 3) {
        // Check if there's a subdirectory for helpers
        const hasHelpersDir = entries.some(
          entry =>
            entry.isDirectory() &&
            (entry.name === 'helpers' || entry.name === 'utils' || entry.name === 'components')
        );

        if (!hasHelpersDir) {
          return {
            compliant: false,
            violations: [
              {
                guideline: 'structure.fileOrganization',
                path: dirPath,
                message: `Many helper files found but no subdirectory for organization`,
                severity: 'warning',
              },
            ],
          };
        }
      }

      return {
        compliant: true,
        violations: [],
      };
    } catch (error) {
      this.log(`Check file organization error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check integration
   * @param {string} dirPath - Path to directory
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkIntegration(dirPath, componentName) {
    try {
      this.log(`Checking integration for: ${dirPath}`);

      // Check if there's an index.js file
      const indexPath = path.join(dirPath, 'index.js');
      const indexExists = await fs.stat(indexPath).catch(() => null);

      if (!indexExists) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'structure.integration',
              path: dirPath,
              message: `No index.js file found for component integration`,
              severity: 'warning',
            },
          ],
        };
      }

      // Check if index.js exports the component
      const indexContent = await fs.readFile(indexPath, 'utf8');

      // Find all JS files in the directory
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      const jsFiles = entries
        .filter(entry => entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'index.js')
        .map(entry => entry.name.replace('.js', ''));

      // Check if each JS file is exported
      const missingExports = [];

      for (const jsFile of jsFiles) {
        // Check for various export patterns
        const exportPatterns = [
          `require('./${jsFile}')`,
          `from './${jsFile}'`,
          `export * from './${jsFile}'`,
          `export { ${jsFile} }`,
          `module.exports = { ${jsFile} }`,
        ];

        const isExported = exportPatterns.some(pattern => indexContent.includes(pattern));

        if (!isExported) {
          missingExports.push(jsFile);
        }
      }

      if (missingExports.length > 0) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'structure.integration',
              path: indexPath,
              message: `Component files not exported in index.js: ${missingExports.join(', ')}`,
              severity: 'warning',
            },
          ],
        };
      }

      // Check parent module integration
      const moduleDir = path.dirname(dirPath);
      const moduleIndexPath = path.join(moduleDir, 'index.js');
      const moduleIndexExists = await fs.stat(moduleIndexPath).catch(() => null);

      if (moduleIndexExists) {
        const moduleIndexContent = await fs.readFile(moduleIndexPath, 'utf8');
        const dirName = path.basename(dirPath);

        // Check for various export patterns
        const exportPatterns = [
          `require('./${dirName}')`,
          `from './${dirName}'`,
          `export * from './${dirName}'`,
          `export { ${componentName} }`,
          `module.exports = { ${componentName} }`,
        ];

        const isExported = exportPatterns.some(pattern => moduleIndexContent.includes(pattern));

        if (!isExported) {
          return {
            compliant: false,
            violations: [
              {
                guideline: 'structure.integration',
                path: moduleIndexPath,
                message: `Component not exported in parent module's index.js`,
                severity: 'warning',
              },
            ],
          };
        }
      }

      return {
        compliant: true,
        violations: [],
      };
    } catch (error) {
      this.log(`Check integration error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
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
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[StructureChecker] ${message}`);
    }
  }
}

module.exports = StructureChecker;
