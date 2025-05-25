/**
 * Detailed Report Generator
 *
 * Generates comprehensive reports for verification results with detailed
 * recommendations and documentation links.
 *
 * @version 1.1.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');
const MemoryBankReportStorage = require('./MemoryBankReportStorage');

/**
 * Detailed Report Generator
 */
class DetailedReportGenerator extends EventEmitter {
  /**
   * Create a new DetailedReportGenerator instance
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

      // Guidelines path
      guidelinesPath: '.augment-guidelines',

      // Implementation guide path
      implementationGuidePath: 'docs/guides/implementation-guide.md',

      // Output directory for reports
      outputDir: 'verification-reports',

      // Report formats
      formats: ['html', 'markdown', 'json'],

      // Include recommendations
      includeRecommendations: true,

      // Include documentation links
      includeDocLinks: true,

      // Include code examples
      includeCodeExamples: true,

      // Include severity levels
      includeSeverityLevels: true,

      // Use Memory Bank for storage
      useMemoryBank: true,

      // Memory Bank project name
      memoryBankProject: 'verification-reports',

      // Maximum number of historical reports to keep
      maxHistory: 5,

      // Merge with provided options
      ...options,
    };

    // Initialize Memory Bank Report Storage if enabled
    if (this.config.useMemoryBank) {
      this.reportStorage = new MemoryBankReportStorage({
        debugMode: this.config.debugMode,
        projectName: this.config.memoryBankProject,
        maxHistory: this.config.maxHistory,
      });
    }

    // Initialize
    this._init();
  }

  /**
   * Initialize
   * @private
   */
  _init() {
    this.log('Initializing DetailedReportGenerator');

    // Create output directory if it doesn't exist
    fs.mkdir(path.join(this.config.baseDir, this.config.outputDir), { recursive: true }).catch(
      error => {
        this.log(`Error creating output directory: ${error.message}`);
      }
    );

    // Load guidelines
    this._loadGuidelines()
      .then(guidelines => {
        this.guidelines = guidelines;
        this.log('Guidelines loaded successfully');
      })
      .catch(error => {
        this.log(`Error loading guidelines: ${error.message}`);
        this.guidelines = {};
      });

    // Load implementation guide
    this._loadImplementationGuide()
      .then(guide => {
        this.implementationGuide = guide;
        this.log('Implementation guide loaded successfully');
      })
      .catch(error => {
        this.log(`Error loading implementation guide: ${error.message}`);
        this.implementationGuide = {};
      });
  }

  /**
   * Generate a detailed report for verification results
   * @param {Object} verificationResult - Verification result
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Report generation result
   */
  async generateReport(verificationResult, options = {}) {
    try {
      this.log(`Generating detailed report for: ${verificationResult.targetPath || 'unknown'}`);

      // Merge options with defaults
      const mergedOptions = {
        ...this.config,
        ...options,
      };

      // Enhance verification result with recommendations and documentation links
      const enhancedResult = await this._enhanceVerificationResult(
        verificationResult,
        mergedOptions
      );

      // Generate reports in requested formats
      const reports = {};
      for (const format of mergedOptions.formats) {
        reports[format] = await this._generateReportInFormat(enhancedResult, format, mergedOptions);
      }

      // Save reports
      const outputPaths = {};
      for (const [format, report] of Object.entries(reports)) {
        const outputPath = await this._saveReport(enhancedResult, report, format, mergedOptions);
        outputPaths[format] = outputPath;
      }

      this.log('Report generation completed');
      this.emit('report-generated', { verificationResult, outputPaths });

      return {
        success: true,
        verificationResult,
        enhancedResult,
        reports,
        outputPaths,
      };
    } catch (error) {
      this.log(`Error generating report: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Enhance verification result with recommendations and documentation links
   * @param {Object} verificationResult - Verification result
   * @param {Object} options - Enhancement options
   * @returns {Promise<Object>} Enhanced verification result
   * @private
   */
  async _enhanceVerificationResult(verificationResult, options) {
    // Clone the verification result to avoid modifying the original
    const enhancedResult = JSON.parse(JSON.stringify(verificationResult));

    // Add recommendations and documentation links to each violation
    if (enhancedResult.results) {
      for (const category in enhancedResult.results) {
        const categoryResults = enhancedResult.results[category];

        if (categoryResults.violations) {
          for (const violation of categoryResults.violations) {
            // Add recommendations
            if (options.includeRecommendations) {
              violation.recommendations = await this._generateRecommendations(violation, category);
            }

            // Add documentation links
            if (options.includeDocLinks) {
              violation.documentationLinks = await this._findDocumentationLinks(
                violation,
                category
              );
            }

            // Add code examples
            if (options.includeCodeExamples) {
              violation.codeExamples = await this._findCodeExamples(violation, category);
            }

            // Add severity level if not present
            if (options.includeSeverityLevels && !violation.severity) {
              violation.severity = this._determineSeverity(violation, category);
            }
          }
        }
      }
    }

    return enhancedResult;
  }

  /**
   * Generate recommendations for a violation
   * @param {Object} violation - Violation
   * @param {string} category - Violation category
   * @returns {Promise<Array<string>>} Recommendations
   * @private
   */
  async _generateRecommendations(violation, category) {
    // This is a placeholder implementation
    // In a real implementation, this would generate specific recommendations
    // based on the violation and category
    return [
      `Follow the ${category} guidelines for ${violation.guideline || 'this issue'}`,
      `Refer to the implementation guide for examples and best practices`,
    ];
  }

  /**
   * Find documentation links for a violation
   * @param {Object} violation - Violation
   * @param {string} category - Violation category
   * @returns {Promise<Array<Object>>} Documentation links
   * @private
   */
  async _findDocumentationLinks(violation, category) {
    // This is a placeholder implementation
    // In a real implementation, this would find specific documentation links
    // based on the violation and category
    return [
      {
        title: 'Implementation Guide',
        url: `docs/guides/implementation-guide.md#${category.toLowerCase()}`,
      },
      {
        title: 'Guidelines',
        url: `.augment-guidelines#${category.toLowerCase()}`,
      },
    ];
  }

  /**
   * Find code examples for a violation
   * @param {Object} violation - Violation
   * @param {string} category - Violation category
   * @returns {Promise<Array<Object>>} Code examples
   * @private
   */
  async _findCodeExamples(violation, category) {
    // This is a placeholder implementation
    // In a real implementation, this would find specific code examples
    // based on the violation and category
    return [
      {
        title: 'Example Implementation',
        code: '// Example code\nfunction exampleImplementation() {\n  // ...\n}',
      },
    ];
  }

  /**
   * Determine severity level for a violation
   * @param {Object} violation - Violation
   * @param {string} category - Violation category
   * @returns {string} Severity level
   * @private
   */
  _determineSeverity(violation, category) {
    // This is a placeholder implementation
    // In a real implementation, this would determine the severity level
    // based on the violation and category
    return violation.critical ? 'critical' : 'warning';
  }

  /**
   * Generate report in a specific format
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {string} format - Report format
   * @param {Object} options - Report options
   * @returns {Promise<string>} Report content
   * @private
   */
  async _generateReportInFormat(enhancedResult, format, options) {
    switch (format) {
      case 'html':
        return this._generateHtmlReport(enhancedResult, options);
      case 'markdown':
        return this._generateMarkdownReport(enhancedResult, options);
      case 'json':
        return this._generateJsonReport(enhancedResult, options);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Generate HTML report
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {Object} options - Report options
   * @returns {Promise<string>} HTML report
   * @private
   */
  async _generateHtmlReport(enhancedResult, options) {
    // This is a simplified implementation
    // In a real implementation, this would generate a comprehensive HTML report
    return `<!DOCTYPE html>
<html>
<head>
  <title>Verification Report</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    .summary { margin-bottom: 20px; }
    .violations { margin-bottom: 20px; }
    .violation { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
    .violation.critical { border-left: 5px solid #d9534f; }
    .violation.warning { border-left: 5px solid #f0ad4e; }
    .recommendations { margin-top: 10px; }
    .documentation-links { margin-top: 10px; }
    .code-examples { margin-top: 10px; background-color: #f5f5f5; padding: 10px; border-radius: 4px; }
    pre { margin: 0; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Verification Report</h1>
    <div class="summary">
      <h2>Summary</h2>
      <p>Target: ${enhancedResult.targetPath || 'Unknown'}</p>
      <p>Status: ${enhancedResult.compliant ? 'Compliant' : 'Non-compliant'}</p>
      <p>Total Violations: ${enhancedResult.violations?.total || 0}</p>
      <p>Critical Violations: ${enhancedResult.violations?.critical || 0}</p>
    </div>
    <div class="violations">
      <h2>Violations</h2>
      ${this._generateHtmlViolations(enhancedResult, options)}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generate HTML violations
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {Object} options - Report options
   * @returns {string} HTML violations
   * @private
   */
  _generateHtmlViolations(enhancedResult, options) {
    let html = '';

    if (enhancedResult.results) {
      for (const category in enhancedResult.results) {
        const categoryResults = enhancedResult.results[category];

        if (categoryResults.violations && categoryResults.violations.length > 0) {
          html += `<h3>${category}</h3>`;

          for (const violation of categoryResults.violations) {
            const severityClass = violation.severity === 'critical' ? 'critical' : 'warning';

            html += `<div class="violation ${severityClass}">
              <h4>${violation.message}</h4>
              <p>Guideline: ${violation.guideline || 'N/A'}</p>
              <p>Severity: ${violation.severity || 'N/A'}</p>

              ${
                violation.recommendations
                  ? `
                <div class="recommendations">
                  <h5>Recommendations</h5>
                  <ul>
                    ${violation.recommendations.map(recommendation => `<li>${recommendation}</li>`).join('')}
                  </ul>
                </div>
              `
                  : ''
              }

              ${
                violation.documentationLinks
                  ? `
                <div class="documentation-links">
                  <h5>Documentation Links</h5>
                  <ul>
                    ${violation.documentationLinks.map(link => `<li><a href="${link.url}">${link.title}</a></li>`).join('')}
                  </ul>
                </div>
              `
                  : ''
              }

              ${
                violation.codeExamples
                  ? `
                <div class="code-examples">
                  <h5>Code Examples</h5>
                  ${violation.codeExamples
                    .map(
                      example => `
                    <h6>${example.title}</h6>
                    <pre><code>${example.code}</code></pre>
                  `
                    )
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>`;
          }
        }
      }
    }

    return html;
  }

  /**
   * Generate Markdown report
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {Object} options - Report options
   * @returns {Promise<string>} Markdown report
   * @private
   */
  async _generateMarkdownReport(enhancedResult, options) {
    // This is a simplified implementation
    // In a real implementation, this would generate a comprehensive Markdown report
    let markdown = `# Verification Report\n\n`;

    // Add summary
    markdown += `## Summary\n\n`;
    markdown += `- **Target:** ${enhancedResult.targetPath || 'Unknown'}\n`;
    markdown += `- **Status:** ${enhancedResult.compliant ? 'Compliant' : 'Non-compliant'}\n`;
    markdown += `- **Total Violations:** ${enhancedResult.violations?.total || 0}\n`;
    markdown += `- **Critical Violations:** ${enhancedResult.violations?.critical || 0}\n\n`;

    // Add violations
    markdown += `## Violations\n\n`;

    if (enhancedResult.results) {
      for (const category in enhancedResult.results) {
        const categoryResults = enhancedResult.results[category];

        if (categoryResults.violations && categoryResults.violations.length > 0) {
          markdown += `### ${category}\n\n`;

          for (const violation of categoryResults.violations) {
            markdown += `#### ${violation.message}\n\n`;
            markdown += `- **Guideline:** ${violation.guideline || 'N/A'}\n`;
            markdown += `- **Severity:** ${violation.severity || 'N/A'}\n\n`;

            if (violation.recommendations) {
              markdown += `##### Recommendations\n\n`;
              for (const recommendation of violation.recommendations) {
                markdown += `- ${recommendation}\n`;
              }
              markdown += `\n`;
            }

            if (violation.documentationLinks) {
              markdown += `##### Documentation Links\n\n`;
              for (const link of violation.documentationLinks) {
                markdown += `- [${link.title}](${link.url})\n`;
              }
              markdown += `\n`;
            }

            if (violation.codeExamples) {
              markdown += `##### Code Examples\n\n`;
              for (const example of violation.codeExamples) {
                markdown += `###### ${example.title}\n\n`;
                markdown += `\`\`\`javascript\n${example.code}\n\`\`\`\n\n`;
              }
            }
          }
        }
      }
    }

    return markdown;
  }

  /**
   * Generate JSON report
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {Object} options - Report options
   * @returns {Promise<string>} JSON report
   * @private
   */
  async _generateJsonReport(enhancedResult, options) {
    // Add metadata
    const jsonReport = {
      ...enhancedResult,
      metadata: {
        timestamp: new Date().toISOString(),
        generator: 'DetailedReportGenerator',
        version: '1.0.0',
      },
    };

    return JSON.stringify(jsonReport, null, 2);
  }

  /**
   * Save report
   * @param {Object} enhancedResult - Enhanced verification result
   * @param {string} report - Report content
   * @param {string} format - Report format
   * @param {Object} options - Report options
   * @returns {Promise<string>} Output path
   * @private
   */
  async _saveReport(enhancedResult, report, format, options) {
    // Get target path
    const targetPath = enhancedResult.targetPath || 'unknown';

    // If Memory Bank is enabled and available, use it
    if (this.config.useMemoryBank && this.reportStorage && this.reportStorage.memoryBankAvailable) {
      try {
        this.log(`Saving report to Memory Bank: ${targetPath}`);

        // Save report to Memory Bank
        const result = await this.reportStorage.saveReport(targetPath, format, report, {
          maxHistory: this.config.maxHistory,
        });

        if (result.success) {
          this.log(`Report saved to Memory Bank successfully: ${result.filename}`);
          return `memory-bank://${this.config.memoryBankProject}/${result.filename}`;
        } else {
          this.log(`Error saving report to Memory Bank: ${result.error}`);
          // Fall back to file-based storage
        }
      } catch (error) {
        this.log(`Error saving report to Memory Bank: ${error.message}`);
        // Fall back to file-based storage
      }
    }

    // Fall back to file-based storage
    this.log(`Saving report to file system: ${targetPath}`);

    // Generate filename
    const targetName = path.basename(targetPath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${targetName}-verification-report-${timestamp}.${format}`;

    // Output path
    const outputPath = path.join(this.config.baseDir, this.config.outputDir, filename);

    // Create output directory if it doesn't exist
    await fs.mkdir(path.join(this.config.baseDir, this.config.outputDir), { recursive: true });

    // Save report
    await fs.writeFile(outputPath, report);

    return outputPath;
  }

  /**
   * Load guidelines
   * @returns {Promise<Object>} Guidelines
   * @private
   */
  async _loadGuidelines() {
    try {
      const guidelinesPath = path.join(this.config.baseDir, this.config.guidelinesPath);
      const guidelinesContent = await fs.readFile(guidelinesPath, 'utf8');

      // Parse guidelines
      return this._parseGuidelines(guidelinesContent);
    } catch (error) {
      this.log(`Error loading guidelines: ${error.message}`);
      return {};
    }
  }

  /**
   * Parse guidelines
   * @param {string} content - Guidelines content
   * @returns {Object} Parsed guidelines
   * @private
   */
  _parseGuidelines(content) {
    // This is a simplified implementation
    // In a real implementation, this would parse the guidelines into a structured format
    const guidelines = {};

    // Split content into sections
    const sections = content.split(/^## /m);

    for (const section of sections) {
      if (!section.trim()) continue;

      // Extract section name and content
      const lines = section.split('\n');
      const sectionName = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();

      guidelines[sectionName] = sectionContent;
    }

    return guidelines;
  }

  /**
   * Load implementation guide
   * @returns {Promise<Object>} Implementation guide
   * @private
   */
  async _loadImplementationGuide() {
    try {
      const guidePath = path.join(this.config.baseDir, this.config.implementationGuidePath);
      const guideContent = await fs.readFile(guidePath, 'utf8');

      // Parse implementation guide
      return this._parseImplementationGuide(guideContent);
    } catch (error) {
      this.log(`Error loading implementation guide: ${error.message}`);
      return {};
    }
  }

  /**
   * Parse implementation guide
   * @param {string} content - Implementation guide content
   * @returns {Object} Parsed implementation guide
   * @private
   */
  _parseImplementationGuide(content) {
    // This is a simplified implementation
    // In a real implementation, this would parse the implementation guide into a structured format
    const guide = {};

    // Split content into sections
    const sections = content.split(/^## /m);

    for (const section of sections) {
      if (!section.trim()) continue;

      // Extract section name and content
      const lines = section.split('\n');
      const sectionName = lines[0].trim();
      const sectionContent = lines.slice(1).join('\n').trim();

      guide[sectionName] = sectionContent;
    }

    return guide;
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

      // If Memory Bank is enabled and available, use it
      if (
        this.config.useMemoryBank &&
        this.reportStorage &&
        this.reportStorage.memoryBankAvailable
      ) {
        try {
          this.log(`Getting report from Memory Bank: ${filePath}`);

          // Get report from Memory Bank
          const result = await this.reportStorage.getReport(filePath, format, options);

          if (result.success) {
            this.log(`Report retrieved from Memory Bank successfully: ${result.filePath}`);
            return {
              success: true,
              filePath: result.filePath,
              format: result.format,
              content: result.content,
              metadata: result.metadata,
              source: 'memory-bank',
            };
          } else {
            this.log(`Error getting report from Memory Bank: ${result.error}`);
            // Fall back to file-based storage
          }
        } catch (error) {
          this.log(`Error getting report from Memory Bank: ${error.message}`);
          // Fall back to file-based storage
        }
      }

      // Fall back to file-based storage
      this.log(`Getting report from file system: ${filePath}`);

      // Generate filename pattern
      const targetName = path.basename(filePath);
      const pattern = new RegExp(`^${targetName}-verification-report-.*\\.${format}$`);

      // Get output directory
      const outputDir = path.join(this.config.baseDir, this.config.outputDir);

      // List files in output directory
      const files = await fs.readdir(outputDir);

      // Filter files matching pattern
      const matchingFiles = files.filter(file => pattern.test(file));

      if (matchingFiles.length === 0) {
        this.log(`No matching report found for ${filePath} in ${format} format`);
        return {
          success: false,
          error: `No matching report found for ${filePath} in ${format} format`,
        };
      }

      // Sort files by timestamp (newest first)
      matchingFiles.sort((a, b) => {
        const timestampA = a.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
        const timestampB = b.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
        return timestampB.localeCompare(timestampA);
      });

      // Get newest file
      const newestFile = matchingFiles[0];
      const newestFilePath = path.join(outputDir, newestFile);

      // Read file
      const content = await fs.readFile(newestFilePath, 'utf8');

      // Extract timestamp
      const timestamp = newestFile.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];

      return {
        success: true,
        filePath,
        format,
        content,
        metadata: {
          timestamp,
          source: 'file-system',
        },
        source: 'file-system',
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

      // If Memory Bank is enabled and available, use it
      if (
        this.config.useMemoryBank &&
        this.reportStorage &&
        this.reportStorage.memoryBankAvailable
      ) {
        try {
          this.log(`Getting historical reports from Memory Bank: ${filePath}`);

          // Get historical reports from Memory Bank
          const result = await this.reportStorage.getHistoricalReports(filePath, format, options);

          if (result.success) {
            this.log(
              `Historical reports retrieved from Memory Bank successfully: ${result.historicalReports.length} reports`
            );
            return {
              success: true,
              filePath: result.filePath,
              format: result.format,
              historicalReports: result.historicalReports,
              source: 'memory-bank',
            };
          } else {
            this.log(`Error getting historical reports from Memory Bank: ${result.error}`);
            // Fall back to file-based storage
          }
        } catch (error) {
          this.log(`Error getting historical reports from Memory Bank: ${error.message}`);
          // Fall back to file-based storage
        }
      }

      // Fall back to file-based storage
      this.log(`Getting historical reports from file system: ${filePath}`);

      // Generate filename pattern
      const targetName = path.basename(filePath);
      const pattern = new RegExp(`^${targetName}-verification-report-.*\\.${format}$`);

      // Get output directory
      const outputDir = path.join(this.config.baseDir, this.config.outputDir);

      // List files in output directory
      const files = await fs.readdir(outputDir);

      // Filter files matching pattern
      const matchingFiles = files.filter(file => pattern.test(file));

      if (matchingFiles.length === 0) {
        this.log(`No matching historical reports found for ${filePath} in ${format} format`);
        return {
          success: false,
          error: `No matching historical reports found for ${filePath} in ${format} format`,
        };
      }

      // Sort files by timestamp (newest first)
      matchingFiles.sort((a, b) => {
        const timestampA = a.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
        const timestampB = b.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];
        return timestampB.localeCompare(timestampA);
      });

      // Get historical reports
      const historicalReports = [];
      for (const file of matchingFiles) {
        const filePath = path.join(outputDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const timestamp = file.match(/-(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d{3}Z)\./)[1];

        historicalReports.push({
          filename: file,
          timestamp,
          content,
        });
      }

      return {
        success: true,
        filePath,
        format,
        historicalReports,
        source: 'file-system',
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
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[DetailedReportGenerator] ${message}`);
    }
  }
}

module.exports = DetailedReportGenerator;
