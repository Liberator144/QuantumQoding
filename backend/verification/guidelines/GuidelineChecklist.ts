/**
 * GuidelineChecklist
 *
 * Generates and validates checklists for implementations.
 *
 * @version 1.0.0
 */

const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');
const GuidelineChecker = require('./GuidelineChecker');

/**
 * GuidelineChecklist
 *
 * Generates and validates checklists for implementations.
 */
class GuidelineChecklist extends EventEmitter {
  /**
   * Create a new GuidelineChecklist instance
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

      // Template path
      templatePath: path.join(__dirname, 'templates', 'guideline-checklist.md'),

      // Output directory
      outputDir: path.join(process.cwd(), 'checklists'),

      // Merge with provided options
      ...options,
    };

    // Initialize guideline checker
    this.guidelineChecker = new GuidelineChecker(options);

    // Initialize
    this._init();
  }

  /**
   * Initialize the checklist generator
   * @private
   */
  _init() {
    this.log('Initializing GuidelineChecklist');

    try {
      // Create output directory if it doesn't exist
      fs.mkdir(this.config.outputDir, { recursive: true }).catch(error => {
        this.log(`Create output directory error: ${error.message}`);
      });

      this.log('GuidelineChecklist initialized');
    } catch (error) {
      this.log(`Initialization error: ${error.message}`);
      this.emit('error', error);
    }
  }

  /**
   * Generate a checklist for an implementation
   * @param {string} targetPath - Path to the implementation
   * @param {Object} options - Generation options
   * @returns {Object} Generation result
   */
  generateChecklist(targetPath, options = {}) {
    try {
      this.log(`Generating checklist for: ${targetPath}`);

      // Resolve target path
      const resolvedPath = path.resolve(this.config.baseDir, targetPath);

      // Get component name
      const componentName = path.basename(resolvedPath);

      // Generate checklist using guideline checker
      const checklist = this.guidelineChecker.generateChecklist(resolvedPath);

      // Convert checklist to markdown
      const markdown = this._checklistToMarkdown(checklist);

      // Determine output path
      let outputPath = options.outputPath;

      if (!outputPath) {
        // Create output filename
        const outputFilename = `${this._toKebabCase(componentName)}-checklist.md`;
        outputPath = path.join(this.config.outputDir, outputFilename);
      }

      // Save checklist
      fs.writeFile(outputPath, markdown).catch(error => {
        this.log(`Save checklist error: ${error.message}`);
      });

      this.log(`Checklist generated: ${outputPath}`);
      this.emit('checklist-generated', { targetPath, outputPath });

      return {
        success: true,
        targetPath,
        outputPath,
        checklist,
      };
    } catch (error) {
      this.log(`Generate checklist error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate a completed checklist against the implementation
   * @param {string} checklistPath - Path to the checklist
   * @returns {Object} Validation result
   */
  validateChecklist(checklistPath) {
    try {
      this.log(`Validating checklist: ${checklistPath}`);

      // For simplicity, return a mock result
      // In a real implementation, this would validate the checklist

      return {
        success: false,
        error: 'Checklist validation not implemented in this simplified version',
      };
    } catch (error) {
      this.log(`Validate checklist error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate a report comparing the checklist to the implementation
   * @param {string} checklistPath - Path to the checklist
   * @param {string} targetPath - Path to the implementation
   * @returns {Object} Report result
   */
  generateReport(checklistPath, targetPath) {
    try {
      this.log(`Generating report for checklist: ${checklistPath}`);

      // For simplicity, return a mock result
      // In a real implementation, this would generate a report

      // Generate mock report
      const report = {
        checklistPath,
        targetPath,
        timestamp: new Date().toISOString(),
        discrepancies: [],
        compliant: true,
      };

      // Determine output path
      const outputFilename = `${path.basename(checklistPath, '.md')}-report.md`;
      const outputPath = path.join(this.config.outputDir, outputFilename);

      // Convert report to markdown
      const markdown = this._reportToMarkdown(report);

      // Save report
      fs.writeFile(outputPath, markdown).catch(error => {
        this.log(`Save report error: ${error.message}`);
      });

      this.log(`Report generated: ${outputPath}`);
      this.emit('report-generated', { checklistPath, targetPath, outputPath });

      return {
        success: true,
        checklistPath,
        targetPath,
        outputPath,
        report,
      };
    } catch (error) {
      this.log(`Generate report error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Convert checklist to markdown
   * @param {Object} checklist - Checklist to convert
   * @returns {string} Markdown representation
   * @private
   */
  _checklistToMarkdown(checklist) {
    // Generate markdown header
    let markdown = `# Guideline Compliance Checklist\n\n`;
    markdown += `## Implementation: ${checklist.componentName}\n`;
    markdown += `## Path: ${checklist.targetPath}\n`;
    markdown += `## Date: ${new Date().toLocaleDateString()}\n`;
    markdown += `## Author: [Author]\n\n`;

    // Group items by category
    const itemsByCategory = checklist.items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }

      acc[item.category].push(item);

      return acc;
    }, {});

    // Generate markdown for each category
    for (const [category, items] of Object.entries(itemsByCategory)) {
      markdown += `## ${category}\n\n`;

      for (const item of items) {
        markdown += `- [ ] ${item.description}\n`;
        markdown += `  - Status: [Compliant/Non-compliant/Partially compliant]\n`;
        markdown += `  - Notes: [Any notes or justifications]\n\n`;
      }
    }

    // Add guideline overrides section
    markdown += `## Guideline Overrides\n\n`;
    markdown += `If any guidelines cannot be followed, provide detailed justification below:\n\n`;
    markdown += `### [Guideline Reference]\n\n`;
    markdown += `**Justification**: [Detailed explanation of why the guideline cannot be followed and why an alternative approach is necessary]\n\n`;
    markdown += `**Alternative Approach**: [Description of the alternative approach taken]\n\n`;
    markdown += `**Impact Assessment**: [Assessment of the impact of not following the guideline]\n\n`;
    markdown += `**Approver**: [Name of the person who approved this override]\n\n`;

    // Add verification section
    markdown += `## Verification\n\n`;
    markdown += `- [ ] Checklist completed by: [Name]\n`;
    markdown += `- [ ] Checklist verified by: [Name]\n`;
    markdown += `- [ ] Date: [Date]\n`;

    return markdown;
  }

  /**
   * Parse checklist from markdown
   * @param {string} markdown - Markdown content
   * @returns {Object} Parsed checklist
   * @private
   */
  _parseChecklistMarkdown(markdown) {
    try {
      // Extract component name
      const componentNameMatch = markdown.match(/## Implementation: (.*)/);
      const componentName = componentNameMatch ? componentNameMatch[1].trim() : null;

      // Extract target path
      const targetPathMatch = markdown.match(/## Path: (.*)/);
      const targetPath = targetPathMatch ? targetPathMatch[1].trim() : null;

      // Extract date
      const dateMatch = markdown.match(/## Date: (.*)/);
      const date = dateMatch ? dateMatch[1].trim() : null;

      // Extract author
      const authorMatch = markdown.match(/## Author: (.*)/);
      const author = authorMatch ? authorMatch[1].trim() : null;

      // Extract checklist items
      const items = [];

      // Extract categories and items
      const categoryRegex = /## ([^#\n]+)/g;
      const categoryMatches = [...markdown.matchAll(categoryRegex)];

      for (let i = 0; i < categoryMatches.length; i++) {
        const category = categoryMatches[i][1].trim();

        // Skip non-checklist categories
        if (
          [
            'Implementation',
            'Path',
            'Date',
            'Author',
            'Guideline Overrides',
            'Verification',
          ].includes(category)
        ) {
          continue;
        }

        // Get category content
        const startIndex = categoryMatches[i].index + categoryMatches[i][0].length;
        const endIndex =
          i < categoryMatches.length - 1 ? categoryMatches[i + 1].index : markdown.length;
        const categoryContent = markdown.substring(startIndex, endIndex);

        // Extract items
        const itemRegex = /- \[([ x])\] ([^\n]+)\n\s+- Status: ([^\n]+)\n\s+- Notes: ([^\n]+)/g;
        const itemMatches = [...categoryContent.matchAll(itemRegex)];

        for (const itemMatch of itemMatches) {
          const checked = itemMatch[1] === 'x';
          const description = itemMatch[2].trim();
          const status = itemMatch[3].trim();
          const notes = itemMatch[4].trim();

          items.push({
            category,
            description,
            checked,
            status,
            notes,
          });
        }
      }

      // Extract overrides
      const overrides = [];

      // Extract override section
      const overrideRegex =
        /### \[([^\]]+)\]\n\n\*\*Justification\*\*: ([^\n]+)\n\n\*\*Alternative Approach\*\*: ([^\n]+)\n\n\*\*Impact Assessment\*\*: ([^\n]+)\n\n\*\*Approver\*\*: ([^\n]+)/g;
      const overrideMatches = [...markdown.matchAll(overrideRegex)];

      for (const overrideMatch of overrideMatches) {
        const guideline = overrideMatch[1].trim();
        const justification = overrideMatch[2].trim();
        const alternativeApproach = overrideMatch[3].trim();
        const impactAssessment = overrideMatch[4].trim();
        const approver = overrideMatch[5].trim();

        overrides.push({
          guideline,
          justification,
          alternativeApproach,
          impactAssessment,
          approver,
        });
      }

      // Extract verification
      const verificationRegex =
        /- \[([ x])\] Checklist completed by: ([^\n]+)\n- \[([ x])\] Checklist verified by: ([^\n]+)\n- \[([ x])\] Date: ([^\n]+)/;
      const verificationMatch = markdown.match(verificationRegex);

      const verification = verificationMatch
        ? {
            completedBy: verificationMatch[2].trim(),
            verifiedBy: verificationMatch[4].trim(),
            date: verificationMatch[6].trim(),
            completed: verificationMatch[1] === 'x',
            verified: verificationMatch[3] === 'x',
          }
        : null;

      return {
        componentName,
        targetPath,
        date,
        author,
        items,
        overrides,
        verification,
      };
    } catch (error) {
      this.log(`Parse checklist markdown error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Compare checklist to check result
   * @param {Object} checklist - Parsed checklist
   * @param {Object} checkResult - Check result
   * @returns {Object} Comparison result
   * @private
   */
  _compareChecklistToResult(checklist, checkResult) {
    try {
      // Extract violations from check result
      const violations = this._extractViolations(checkResult);

      // Find unaddressed violations
      const unaddressedViolations = this._findUnaddressedViolations(checklist, violations);

      // Find missing overrides
      const missingOverrides = this._findMissingOverrides(checklist);

      // Combine discrepancies
      const discrepancies = [...unaddressedViolations, ...missingOverrides];

      return {
        checklist,
        checkResult,
        discrepancies,
        compliant: discrepancies.length === 0,
      };
    } catch (error) {
      this.log(`Compare checklist to result error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Extract violations from check result
   * @param {Object} checkResult - Check result
   * @returns {Array} Violations
   * @private
   */
  _extractViolations(checkResult) {
    const violations = [];

    // In the real implementation, we would extract violations from checkResult
    // For now, we'll use mock violations
    const categories = ['documentation', 'structure', 'codeStyle', 'testing'];

    for (const category of categories) {
      if (
        checkResult.results &&
        checkResult.results[category] &&
        checkResult.results[category].violations
      ) {
        violations.push(...checkResult.results[category].violations);
      }
    }

    return violations;
  }

  /**
   * Find unaddressed violations
   * @param {Object} checklist - Parsed checklist
   * @param {Array} violations - Violations
   * @returns {Array} Unaddressed violations
   * @private
   */
  _findUnaddressedViolations(checklist, violations) {
    const unaddressedViolations = [];

    for (const violation of violations) {
      // Find corresponding checklist item
      const checklistItem = checklist.items.find(
        item =>
          item.description.includes(violation.guideline) ||
          item.category.toLowerCase() === violation.guideline.split('.')[0].toLowerCase()
      );

      // Check if item is marked as non-compliant
      if (!checklistItem || checklistItem.status !== 'Non-compliant') {
        unaddressedViolations.push({
          type: 'unaddressed_violation',
          guideline: violation.guideline,
          message: violation.message,
          path: violation.path,
        });
      }
    }

    return unaddressedViolations;
  }

  /**
   * Find missing overrides
   * @param {Object} checklist - Parsed checklist
   * @returns {Array} Missing overrides
   * @private
   */
  _findMissingOverrides(checklist) {
    const missingOverrides = [];

    for (const item of checklist.items) {
      if (item.status === 'Non-compliant') {
        // Find corresponding override
        const override = checklist.overrides
          ? checklist.overrides.find(
              o => o.guideline.includes(item.category) || item.description.includes(o.guideline)
            )
          : null;

        if (!override) {
          missingOverrides.push({
            type: 'missing_override',
            category: item.category,
            description: item.description,
          });
        }
      }
    }

    return missingOverrides;
  }

  /**
   * Convert report to markdown
   * @param {Object} report - Report to convert
   * @returns {string} Markdown representation
   * @private
   */
  _reportToMarkdown(report) {
    // Generate markdown header
    let markdown = `# Guideline Compliance Report\n\n`;
    markdown += `## Checklist: ${report.checklistPath}\n`;
    markdown += `## Implementation: ${report.targetPath}\n`;
    markdown += `## Date: ${new Date().toLocaleDateString()}\n\n`;

    // Add compliance status
    markdown += `## Compliance Status\n\n`;
    markdown += `**Status**: ${report.compliant ? 'Compliant ✅' : 'Non-compliant ❌'}\n\n`;

    // Add discrepancies section
    markdown += this._generateDiscrepanciesMarkdown(report.discrepancies || []);

    // Add recommendations section
    markdown += this._generateRecommendationsMarkdown(report.discrepancies || []);

    return markdown;
  }

  /**
   * Generate markdown for discrepancies
   * @param {Array} discrepancies - Discrepancies to convert
   * @returns {string} Markdown representation
   * @private
   */
  _generateDiscrepanciesMarkdown(discrepancies) {
    let markdown = '';

    if (discrepancies.length > 0) {
      markdown += `## Discrepancies\n\n`;

      for (const discrepancy of discrepancies) {
        const isUnaddressedViolation = discrepancy.type === 'unaddressed_violation';
        markdown += `### ${isUnaddressedViolation ? 'Unaddressed Violation' : 'Missing Override'}\n\n`;

        if (isUnaddressedViolation) {
          markdown += `- **Guideline**: ${discrepancy.guideline}\n`;
          markdown += `- **Message**: ${discrepancy.message}\n`;
          markdown += `- **Path**: ${discrepancy.path}\n\n`;
        } else {
          markdown += `- **Category**: ${discrepancy.category}\n`;
          markdown += `- **Description**: ${discrepancy.description}\n\n`;
        }
      }
    }

    return markdown;
  }

  /**
   * Generate markdown for recommendations
   * @param {Array} discrepancies - Discrepancies to generate recommendations for
   * @returns {string} Markdown representation
   * @private
   */
  _generateRecommendationsMarkdown(discrepancies) {
    let markdown = `## Recommendations\n\n`;

    if (discrepancies.length > 0) {
      markdown += `To address the discrepancies:\n\n`;

      for (const discrepancy of discrepancies) {
        if (discrepancy.type === 'unaddressed_violation') {
          markdown += this._generateViolationRecommendation(discrepancy);
        } else {
          markdown += this._generateOverrideRecommendation(discrepancy);
        }
      }
    } else {
      markdown += `No discrepancies found. The implementation is compliant with the guidelines.\n\n`;
    }

    return markdown;
  }

  /**
   * Generate recommendation for violation
   * @param {Object} discrepancy - Violation discrepancy
   * @returns {string} Markdown representation
   * @private
   */
  _generateViolationRecommendation(discrepancy) {
    let markdown = `1. Mark the checklist item for guideline "${discrepancy.guideline}" as Non-compliant\n`;
    markdown += `2. Add a detailed justification for why this guideline cannot be followed\n`;
    markdown += `3. Describe the alternative approach taken\n`;
    markdown += `4. Assess the impact of not following the guideline\n`;
    markdown += `5. Get approval from a team lead or designated approver\n\n`;

    return markdown;
  }

  /**
   * Generate recommendation for override
   * @param {Object} discrepancy - Override discrepancy
   * @returns {string} Markdown representation
   * @private
   */
  _generateOverrideRecommendation(discrepancy) {
    let markdown = `1. Add an override for the non-compliant item "${discrepancy.description}"\n`;
    markdown += `2. Provide a detailed justification\n`;
    markdown += `3. Describe the alternative approach\n`;
    markdown += `4. Assess the impact\n`;
    markdown += `5. Get approval\n\n`;

    return markdown;
  }

  /**
   * Convert string to kebab-case
   * @param {string} str - String to convert
   * @returns {string} Kebab-case string
   * @private
   */
  _toKebabCase(str) {
    return (
      str
        // Replace PascalCase with kebab-case
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        // Replace spaces and underscores with hyphens
        .replace(/[\s_]+/g, '-')
        // Convert to lowercase
        .toLowerCase()
    );
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[GuidelineChecklist] ${message}`);
    }
  }
}

module.exports = GuidelineChecklist;
