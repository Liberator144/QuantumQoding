/**
 * Memory Bank Report Storage
 *
 * This class provides a storage adapter for the DetailedReportGenerator that uses
 * the Memory Bank MCP to store and retrieve reports.
 *
 * @module verification/reporting/MemoryBankReportStorage
 * @category verification
 */

const { EventEmitter } = require('events');

/**
 * Memory Bank Report Storage
 */
class MemoryBankReportStorage extends EventEmitter {
  /**
   * Create a new Memory Bank Report Storage
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Project name in Memory Bank
      projectName: 'verification-reports',

      // Maximum number of historical reports to keep
      maxHistory: 5,

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize
   * @private
   */
  async _init() {
    this.log('Initializing MemoryBankReportStorage');

    try {
      // Check if the Memory Bank MCP is available
      const memoryBankAvailable = await this._checkMemoryBankAvailability();

      if (!memoryBankAvailable) {
        this.log('Memory Bank MCP is not available. Falling back to file-based storage.');
        this.memoryBankAvailable = false;
        return;
      }

      this.memoryBankAvailable = true;
      this.log('Memory Bank MCP is available.');

      // Create project if it doesn't exist
      await this._createProjectIfNeeded();
    } catch (error) {
      this.log(`Error initializing MemoryBankReportStorage: ${error.message}`);
      this.memoryBankAvailable = false;
    }
  }

  /**
   * Check if the Memory Bank MCP is available
   * @returns {Promise<boolean>} Whether the Memory Bank MCP is available
   * @private
   */
  async _checkMemoryBankAvailability() {
    try {
      // Try to list projects directly
      await this._callMemoryBankMCP('list_projects_Memory_Bank_Server', {});
      return true;
    } catch (error) {
      this.log(`Error checking Memory Bank availability: ${error.message}`);
      return false;
    }
  }

  /**
   * Create project if it doesn't exist
   * @private
   */
  async _createProjectIfNeeded() {
    try {
      // List projects
      const projects = await this._listProjects();

      // Check if project exists
      if (!projects.includes(this.config.projectName)) {
        this.log(`Creating project: ${this.config.projectName}`);
        // Create project (not directly supported by Memory Bank MCP, but we can create a file)
        await this._writeFile(
          'index.json',
          JSON.stringify({
            name: this.config.projectName,
            description: 'Verification reports',
            created: new Date().toISOString(),
          })
        );
      }
    } catch (error) {
      this.log(`Error creating project: ${error.message}`);
      throw error;
    }
  }

  /**
   * Save a report
   * @param {string} filePath - Path to the file that was verified
   * @param {string} format - Report format (html, markdown, json)
   * @param {string} content - Report content
   * @param {Object} options - Save options
   * @returns {Promise<Object>} Save result
   */
  async saveReport(filePath, format, content, options = {}) {
    try {
      this.log(`Saving report for ${filePath} in ${format} format`);

      // Normalize file path to use as a key
      const normalizedPath = this._normalizePath(filePath);

      // Generate filename
      const filename = `${normalizedPath}.${format}`;

      // If history is enabled, save the current report as a historical version
      if (this.config.maxHistory > 0) {
        await this._saveHistoricalVersion(normalizedPath, format);
      }

      // Save report
      await this._writeFile(filename, content);

      // Save metadata
      await this._saveMetadata(normalizedPath, format);

      this.log(`Report saved successfully: ${filename}`);
      return {
        success: true,
        filePath,
        format,
        filename,
      };
    } catch (error) {
      this.log(`Error saving report: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get a report
   * @param {string} filePath - Path to the file that was verified
   * @param {string} format - Report format (html, markdown, json)
   * @param {Object} options - Get options
   * @returns {Promise<Object>} Get result
   */
  async getReport(filePath, format, options = {}) {
    try {
      this.log(`Getting report for ${filePath} in ${format} format`);

      // Normalize file path to use as a key
      const normalizedPath = this._normalizePath(filePath);

      // Generate filename
      const filename = `${normalizedPath}.${format}`;

      // Get report
      const content = await this._readFile(filename);

      // Get metadata
      const metadata = await this._getMetadata(normalizedPath, format);

      this.log(`Report retrieved successfully: ${filename}`);
      return {
        success: true,
        filePath,
        format,
        content,
        metadata,
      };
    } catch (error) {
      this.log(`Error getting report: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get historical reports
   * @param {string} filePath - Path to the file that was verified
   * @param {string} format - Report format (html, markdown, json)
   * @param {Object} options - Get options
   * @returns {Promise<Object>} Get result
   */
  async getHistoricalReports(filePath, format, options = {}) {
    try {
      this.log(`Getting historical reports for ${filePath} in ${format} format`);

      // Normalize file path to use as a key
      const normalizedPath = this._normalizePath(filePath);

      // List files
      const files = await this._listFiles();

      // Filter historical files
      const pattern = new RegExp(
        `^${normalizedPath}-history-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-\\d{3}Z\\.${format}$`
      );
      const historicalFiles = files
        .filter(file => pattern.test(file))
        .sort((a, b) => {
          // Extract timestamps and sort by timestamp (newest first)
          const timestampA = a.match(/-history-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
          const timestampB = b.match(/-history-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
          return timestampB.localeCompare(timestampA);
        });

      // Get historical reports
      const historicalReports = [];
      for (const file of historicalFiles) {
        const content = await this._readFile(file);
        const timestamp = file.match(/-history-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];

        historicalReports.push({
          filename: file,
          timestamp,
          content,
        });
      }

      this.log(`Retrieved ${historicalReports.length} historical reports`);
      return {
        success: true,
        filePath,
        format,
        historicalReports,
      };
    } catch (error) {
      this.log(`Error getting historical reports: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Delete old historical reports
   * @param {string} filePath - Path to the file that was verified
   * @param {string} format - Report format (html, markdown, json)
   * @returns {Promise<Object>} Delete result
   * @private
   */
  async _cleanupHistoricalReports(filePath, format) {
    try {
      this.log(`Cleaning up historical reports for ${filePath} in ${format} format`);

      // Normalize file path to use as a key
      const normalizedPath = this._normalizePath(filePath);

      // List files
      const files = await this._listFiles();

      // Filter historical files
      const pattern = new RegExp(
        `^${normalizedPath}-history-\\d{4}-\\d{2}-\\d{2}T\\d{2}-\\d{2}-\\d{2}-\\d{3}Z\\.${format}$`
      );
      const historicalFiles = files
        .filter(file => pattern.test(file))
        .sort((a, b) => {
          // Extract timestamps and sort by timestamp (newest first)
          const timestampA = a.match(/-history-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
          const timestampB = b.match(/-history-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
          return timestampB.localeCompare(timestampA);
        });

      // If we have more files than the maximum, delete the oldest ones
      if (historicalFiles.length > this.config.maxHistory) {
        const filesToDelete = historicalFiles.slice(this.config.maxHistory);

        for (const file of filesToDelete) {
          await this._deleteFile(file);
          this.log(`Deleted old historical report: ${file}`);
        }
      }

      return {
        success: true,
        deletedCount: Math.max(0, historicalFiles.length - this.config.maxHistory),
      };
    } catch (error) {
      this.log(`Error cleaning up historical reports: ${error.message}`);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Save a historical version of a report
   * @param {string} normalizedPath - Normalized file path
   * @param {string} format - Report format
   * @returns {Promise<void>}
   * @private
   */
  async _saveHistoricalVersion(normalizedPath, format) {
    try {
      // Generate current filename
      const currentFilename = `${normalizedPath}.${format}`;

      // Check if the file exists
      try {
        const content = await this._readFile(currentFilename);

        // If it exists, create a historical version
        const timestamp = new Date().toISOString();
        const historyFilename = `${normalizedPath}-history-${timestamp}.${format}`;

        // Save historical version
        await this._writeFile(historyFilename, content);
        this.log(`Saved historical version: ${historyFilename}`);

        // Clean up old historical versions
        await this._cleanupHistoricalReports(normalizedPath, format);
      } catch (error) {
        // File doesn't exist, no need to create a historical version
        this.log(`No existing report to create historical version for: ${currentFilename}`);
      }
    } catch (error) {
      this.log(`Error saving historical version: ${error.message}`);
    }
  }

  /**
   * Save metadata for a report
   * @param {string} normalizedPath - Normalized file path
   * @param {string} format - Report format
   * @returns {Promise<void>}
   * @private
   */
  async _saveMetadata(normalizedPath, format) {
    try {
      // Generate metadata filename
      const metadataFilename = `${normalizedPath}.metadata.json`;

      // Get existing metadata or create new
      let metadata;
      try {
        const existingMetadata = await this._readFile(metadataFilename);
        metadata = JSON.parse(existingMetadata);
      } catch (error) {
        // Metadata doesn't exist, create new
        metadata = {
          filePath: normalizedPath,
          formats: {},
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        };
      }

      // Update metadata
      metadata.formats[format] = {
        updated: new Date().toISOString(),
      };
      metadata.updated = new Date().toISOString();

      // Save metadata
      await this._writeFile(metadataFilename, JSON.stringify(metadata, null, 2));
      this.log(`Saved metadata: ${metadataFilename}`);
    } catch (error) {
      this.log(`Error saving metadata: ${error.message}`);
    }
  }

  /**
   * Get metadata for a report
   * @param {string} normalizedPath - Normalized file path
   * @param {string} format - Report format
   * @returns {Promise<Object>} Metadata
   * @private
   */
  async _getMetadata(normalizedPath, format) {
    try {
      // Generate metadata filename
      const metadataFilename = `${normalizedPath}.metadata.json`;

      // Get metadata
      const metadataContent = await this._readFile(metadataFilename);
      const metadata = JSON.parse(metadataContent);

      return metadata;
    } catch (error) {
      this.log(`Error getting metadata: ${error.message}`);
      return null;
    }
  }

  /**
   * Normalize a file path to use as a key
   * @param {string} filePath - File path
   * @returns {string} Normalized path
   * @private
   */
  _normalizePath(filePath) {
    // Replace special characters with underscores
    return filePath.replace(/[\/\\:*?"<>|]/g, '_');
  }

  /**
   * List projects in Memory Bank
   * @returns {Promise<Array<string>>} Projects
   * @private
   */
  async _listProjects() {
    try {
      // Use the Memory Bank MCP API directly
      const projects = await this._callMemoryBankMCP('list_projects_Memory_Bank_Server', {});
      return projects;
    } catch (error) {
      this.log(`Error listing projects: ${error.message}`);
      throw error;
    }
  }

  /**
   * List files in a project
   * @returns {Promise<Array<string>>} Files
   * @private
   */
  async _listFiles() {
    try {
      // Use the Memory Bank MCP API directly
      const files = await this._callMemoryBankMCP('list_project_files_Memory_Bank_Server', {
        projectName: this.config.projectName,
      });
      return files;
    } catch (error) {
      this.log(`Error listing files: ${error.message}`);
      throw error;
    }
  }

  /**
   * Read a file from Memory Bank
   * @param {string} filename - Filename
   * @returns {Promise<string>} File content
   * @private
   */
  async _readFile(filename) {
    try {
      // Use the Memory Bank MCP API directly
      const content = await this._callMemoryBankMCP('memory_bank_read_Memory_Bank_Server', {
        projectName: this.config.projectName,
        fileName: filename,
      });
      return content;
    } catch (error) {
      this.log(`Error reading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Write a file to Memory Bank
   * @param {string} filename - Filename
   * @param {string} content - File content
   * @returns {Promise<void>}
   * @private
   */
  async _writeFile(filename, content) {
    try {
      // Use the Memory Bank MCP API directly
      await this._callMemoryBankMCP('memory_bank_write_Memory_Bank_Server', {
        projectName: this.config.projectName,
        fileName: filename,
        content,
      });
    } catch (error) {
      this.log(`Error writing file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a file from Memory Bank
   * @param {string} filename - Filename
   * @returns {Promise<void>}
   * @private
   */
  async _deleteFile(filename) {
    try {
      // Use the Memory Bank MCP API directly
      await this._callMemoryBankMCP('memory_bank_delete_Memory_Bank_Server', {
        projectName: this.config.projectName,
        fileName: filename,
      });
    } catch (error) {
      this.log(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Call Memory Bank MCP
   * @param {string} functionName - Function name
   * @param {Object} params - Function parameters
   * @returns {Promise<any>} Function result
   * @private
   */
  async _callMemoryBankMCP(functionName, params) {
    try {
      // In the Augment environment, we can directly use the Memory Bank MCP functions
      // But in a Node.js environment, we need to use a different approach

      // Check if we're in the Augment environment
      const isAugmentEnvironment = typeof memory_bank_write_Memory_Bank_Server === 'function';

      if (isAugmentEnvironment) {
        this.log('Using Augment Memory Bank MCP functions');

        // Use the appropriate function based on the functionName
        switch (functionName) {
          case 'list_projects_Memory_Bank_Server':
            return list_projects_Memory_Bank_Server();
          case 'list_project_files_Memory_Bank_Server':
            return list_project_files_Memory_Bank_Server(params);
          case 'memory_bank_read_Memory_Bank_Server':
            return memory_bank_read_Memory_Bank_Server(params);
          case 'memory_bank_write_Memory_Bank_Server':
            return memory_bank_write_Memory_Bank_Server(params);
          case 'memory_bank_update_Memory_Bank_Server':
            return memory_bank_update_Memory_Bank_Server(params);
          default:
            throw new Error(`Unknown Memory Bank MCP function: ${functionName}`);
        }
      } else {
        // In a Node.js environment, we need to use a different approach
        this.log('Using Node.js Memory Bank MCP approach');

        // Try to use HTTP API
        try {
          const axios = require('axios');
          const response = await axios.post(`http://localhost:3003/${functionName}`, params);
          return response.data;
        } catch (axiosError) {
          this.log(`Error calling Memory Bank MCP via HTTP: ${axiosError.message}`);

          // Try to use the global Memory Bank MCP object
          if (global.memoryBankMCP && typeof global.memoryBankMCP[functionName] === 'function') {
            return new Promise((resolve, reject) => {
              global.memoryBankMCP[functionName](params, (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            });
          }

          throw new Error('Memory Bank MCP not available');
        }
      }
    } catch (error) {
      this.log(`Error calling Memory Bank MCP: ${error.message}`);
      throw error;
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[MemoryBankReportStorage] ${message}`);
    }
  }
}

module.exports = MemoryBankReportStorage;
