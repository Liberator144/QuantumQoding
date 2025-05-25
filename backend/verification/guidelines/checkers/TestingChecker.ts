/**
 * TestingChecker
 *
 * Checks compliance with testing guidelines.
 *
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

/**
 * TestingChecker
 *
 * Checks compliance with testing guidelines.
 */
class TestingChecker extends EventEmitter {
  /**
   * Create a new TestingChecker instance
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
   * Check testing compliance
   * @param {string} targetPath - Path to the implementation to check
   * @param {boolean} isDirectory - Whether the target is a directory
   * @param {Object} options - Check options
   * @returns {Promise<Object>} Check result
   */
  async check(targetPath, isDirectory, options = {}) {
    try {
      this.log(`Checking testing compliance for: ${targetPath}`);

      // Get component name and path
      const componentPath = isDirectory ? targetPath : path.dirname(targetPath);
      const componentName = path.basename(componentPath);

      // Check unit tests
      const unitTestsResult = await this._checkUnitTests(componentPath, componentName);

      // Check integration tests
      const integrationTestsResult = await this._checkIntegrationTests(
        componentPath,
        componentName
      );

      // Check test organization
      const organizationResult = await this._checkTestOrganization(componentPath, componentName);

      // Check test automation
      const automationResult = await this._checkTestAutomation(componentPath, componentName);

      // Collect violations
      const violations = [
        ...unitTestsResult.violations,
        ...integrationTestsResult.violations,
        ...organizationResult.violations,
        ...automationResult.violations,
      ];

      this.log(`Testing compliance check completed for: ${targetPath}`);

      return {
        unitTests: unitTestsResult,
        integrationTests: integrationTestsResult,
        testOrganization: organizationResult,
        testAutomation: automationResult,
        violations,
      };
    } catch (error) {
      this.log(`Testing check error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check unit tests
   * @param {string} componentPath - Path to component
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkUnitTests(componentPath, componentName) {
    try {
      this.log(`Checking unit tests for: ${componentName}`);

      // Get component files
      const componentFiles = await this._getJSFiles(componentPath);

      // Get test files
      const testDir = path.resolve(this.config.baseDir, 'tests', 'unit');
      const testFiles = await this._getTestFiles(testDir, componentName);

      // If no component files, return compliant
      if (componentFiles.length === 0) {
        return {
          compliant: true,
          violations: [],
        };
      }

      // If no test files, return violation
      if (testFiles.length === 0) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.unitTests',
              path: componentPath,
              message: `No unit tests found for component: ${componentName}`,
              severity: 'critical',
            },
          ],
        };
      }

      // Check if each component file has a corresponding test file
      const violations = [];

      for (const componentFile of componentFiles) {
        const fileName = path.basename(componentFile, '.js');

        // Skip index.js files
        if (fileName === 'index') {
          continue;
        }

        // Check if there's a test file for this component file
        const hasTestFile = testFiles.some(testFile => {
          const testFileName = path.basename(testFile, '.test.js');
          return testFileName === fileName;
        });

        if (!hasTestFile) {
          violations.push({
            guideline: 'testing.unitTests',
            path: componentFile,
            message: `No unit test file found for: ${fileName}.js`,
            severity: 'warning',
          });
        }
      }

      // Check test coverage
      for (const testFile of testFiles) {
        // Read test file
        const testContent = await fs.readFile(testFile, 'utf8');

        // Check if test file has describe and it blocks
        const hasDescribe = testContent.includes('describe(');
        const hasIt = testContent.includes('it(') || testContent.includes('test(');

        if (!hasDescribe || !hasIt) {
          violations.push({
            guideline: 'testing.unitTests',
            path: testFile,
            message: `Test file missing describe or it/test blocks`,
            severity: 'warning',
          });
        }

        // Check if test file has assertions
        const hasAssertions =
          testContent.includes('expect(') ||
          testContent.includes('assert.') ||
          testContent.includes('should.');

        if (!hasAssertions) {
          violations.push({
            guideline: 'testing.unitTests',
            path: testFile,
            message: `Test file has no assertions`,
            severity: 'critical',
          });
        }
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check unit tests error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check integration tests
   * @param {string} componentPath - Path to component
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkIntegrationTests(componentPath, componentName) {
    try {
      this.log(`Checking integration tests for: ${componentName}`);

      // Get test files
      const testDir = path.resolve(this.config.baseDir, 'tests', 'integration');
      const testFiles = await this._getTestFiles(testDir, componentName);

      // If no integration test files, return violation
      if (testFiles.length === 0) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.integrationTests',
              path: componentPath,
              message: `No integration tests found for component: ${componentName}`,
              severity: 'warning',
            },
          ],
        };
      }

      // Check integration test quality
      const violations = [];

      for (const testFile of testFiles) {
        // Read test file
        const testContent = await fs.readFile(testFile, 'utf8');

        // Check if test file has describe and it blocks
        const hasDescribe = testContent.includes('describe(');
        const hasIt = testContent.includes('it(') || testContent.includes('test(');

        if (!hasDescribe || !hasIt) {
          violations.push({
            guideline: 'testing.integrationTests',
            path: testFile,
            message: `Integration test file missing describe or it/test blocks`,
            severity: 'warning',
          });
        }

        // Check if test file has assertions
        const hasAssertions =
          testContent.includes('expect(') ||
          testContent.includes('assert.') ||
          testContent.includes('should.');

        if (!hasAssertions) {
          violations.push({
            guideline: 'testing.integrationTests',
            path: testFile,
            message: `Integration test file has no assertions`,
            severity: 'critical',
          });
        }

        // Check if test file tests integration with other components
        const requireStatements = testContent.match(/require\(['"](.*)['"]\)/g) || [];
        const importStatements = testContent.match(/from\s+['"](.*)['"]/g) || [];

        const imports = [...requireStatements, ...importStatements];
        const hasMultipleImports = imports.length > 1;

        if (!hasMultipleImports) {
          violations.push({
            guideline: 'testing.integrationTests',
            path: testFile,
            message: `Integration test file may not be testing component interactions`,
            severity: 'warning',
          });
        }
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check integration tests error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check test organization
   * @param {string} componentPath - Path to component
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkTestOrganization(componentPath, componentName) {
    try {
      this.log(`Checking test organization for: ${componentName}`);

      // Check if tests directory exists
      const testsDir = path.resolve(this.config.baseDir, 'tests');
      const testsDirExists = await fs.stat(testsDir).catch(() => null);

      if (!testsDirExists) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.testOrganization',
              path: this.config.baseDir,
              message: `Tests directory not found`,
              severity: 'critical',
            },
          ],
        };
      }

      // Check if unit and integration test directories exist
      const unitTestsDir = path.join(testsDir, 'unit');
      const integrationTestsDir = path.join(testsDir, 'integration');

      const unitTestsDirExists = await fs.stat(unitTestsDir).catch(() => null);
      const integrationTestsDirExists = await fs.stat(integrationTestsDir).catch(() => null);

      const violations = [];

      if (!unitTestsDirExists) {
        violations.push({
          guideline: 'testing.testOrganization',
          path: testsDir,
          message: `Unit tests directory not found`,
          severity: 'warning',
        });
      }

      if (!integrationTestsDirExists) {
        violations.push({
          guideline: 'testing.testOrganization',
          path: testsDir,
          message: `Integration tests directory not found`,
          severity: 'warning',
        });
      }

      // Check if test files are organized to mirror src structure
      const srcRelativePath = path.relative(path.join(this.config.baseDir, 'src'), componentPath);

      if (unitTestsDirExists) {
        const unitTestPath = path.join(unitTestsDir, srcRelativePath);
        const unitTestPathExists = await fs.stat(unitTestPath).catch(() => null);

        if (!unitTestPathExists) {
          violations.push({
            guideline: 'testing.testOrganization',
            path: unitTestsDir,
            message: `Unit tests not organized to mirror src structure for: ${componentName}`,
            severity: 'warning',
          });
        }
      }

      return {
        compliant: violations.length === 0,
        violations,
      };
    } catch (error) {
      this.log(`Check test organization error: ${error.message}`);

      return {
        error: error.message,
        violations: [],
      };
    }
  }

  /**
   * Check test automation
   * @param {string} componentPath - Path to component
   * @param {string} componentName - Component name
   * @returns {Promise<Object>} Check result
   * @private
   */
  async _checkTestAutomation(componentPath, componentName) {
    try {
      this.log(`Checking test automation for: ${componentName}`);

      // Check if package.json exists
      const packageJsonPath = path.resolve(this.config.baseDir, 'package.json');
      const packageJsonExists = await fs.stat(packageJsonPath).catch(() => null);

      if (!packageJsonExists) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.testAutomation',
              path: this.config.baseDir,
              message: `package.json not found, cannot verify test automation`,
              severity: 'warning',
            },
          ],
        };
      }

      // Read package.json
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonContent);

      // Check if test scripts exist
      const hasTestScript =
        packageJson.scripts &&
        (packageJson.scripts.test ||
          packageJson.scripts['test:unit'] ||
          packageJson.scripts['test:integration']);

      if (!hasTestScript) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.testAutomation',
              path: packageJsonPath,
              message: `No test scripts found in package.json`,
              severity: 'warning',
            },
          ],
        };
      }

      // Check if CI configuration exists
      const ciConfigs = [
        path.resolve(this.config.baseDir, '.github', 'workflows'),
        path.resolve(this.config.baseDir, '.gitlab-ci.yml'),
        path.resolve(this.config.baseDir, '.travis.yml'),
        path.resolve(this.config.baseDir, 'azure-pipelines.yml'),
        path.resolve(this.config.baseDir, 'Jenkinsfile'),
      ];

      const ciConfigExists = await Promise.all(
        ciConfigs.map(config => fs.stat(config).catch(() => null))
      ).then(results => results.some(result => result !== null));

      if (!ciConfigExists) {
        return {
          compliant: false,
          violations: [
            {
              guideline: 'testing.testAutomation',
              path: this.config.baseDir,
              message: `No CI configuration found for automated testing`,
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
      this.log(`Check test automation error: ${error.message}`);

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

      // Check if directory exists
      const dirExists = await fs.stat(dirPath).catch(() => null);

      if (!dirExists) {
        return files;
      }

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
   * Get test files for component
   * @param {string} testDir - Path to test directory
   * @param {string} componentName - Component name
   * @returns {Promise<Array>} Test files
   * @private
   */
  async _getTestFiles(testDir, componentName) {
    try {
      // Check if test directory exists
      const testDirExists = await fs.stat(testDir).catch(() => null);

      if (!testDirExists) {
        return [];
      }

      // Get all test files
      const allTestFiles = await this._getJSFilesWithPattern(testDir, '.test.js');

      // Filter test files for component
      const componentTestFiles = allTestFiles.filter(file => {
        const fileName = path.basename(file);

        // Check if file name contains component name
        return (
          fileName.toLowerCase().includes(componentName.toLowerCase()) ||
          // Check if file is in a directory with component name
          path.dirname(file).toLowerCase().includes(componentName.toLowerCase())
        );
      });

      return componentTestFiles;
    } catch (error) {
      this.log(`Get test files error: ${error.message}`);
      return [];
    }
  }

  /**
   * Get JS files with pattern
   * @param {string} dirPath - Path to directory
   * @param {string} pattern - File name pattern
   * @returns {Promise<Array>} JS files
   * @private
   */
  async _getJSFilesWithPattern(dirPath, pattern) {
    try {
      const files = [];

      // Check if directory exists
      const dirExists = await fs.stat(dirPath).catch(() => null);

      if (!dirExists) {
        return files;
      }

      // Read directory
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      // Process each entry
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively get files from subdirectory
          const subFiles = await this._getJSFilesWithPattern(entryPath, pattern);
          files.push(...subFiles);
        } else if (entry.isFile() && entry.name.endsWith(pattern)) {
          // Add matching file
          files.push(entryPath);
        }
      }

      return files;
    } catch (error) {
      this.log(`Get JS files with pattern error: ${error.message}`);
      return [];
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[TestingChecker] ${message}`);
    }
  }
}

module.exports = TestingChecker;
