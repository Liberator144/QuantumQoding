/**
 * Reporting Integration
 *
 * Integrates the detailed report generator with the verification system.
 *
 * @version 1.0.0
 */

const { EventEmitter } = require('events');
const DetailedReportGenerator = require('./DetailedReportGenerator');

/**
 * Reporting Integration
 */
class ReportingIntegration extends EventEmitter {
  /**
   * Create a new ReportingIntegration instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Auto-generate reports
      autoGenerateReports: true,

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
  _init() {
    this.log('Initializing ReportingIntegration');

    // Create report generator
    this.reportGenerator = new DetailedReportGenerator({
      debugMode: this.config.debugMode,
      formats: this.config.formats,
      includeRecommendations: this.config.includeRecommendations,
      includeDocLinks: this.config.includeDocLinks,
      includeCodeExamples: this.config.includeCodeExamples,
      includeSeverityLevels: this.config.includeSeverityLevels,
    });

    // Forward events from report generator
    this.reportGenerator.on('report-generated', data => {
      this.emit('report-generated', data);
    });

    this.reportGenerator.on('error', error => {
      this.emit('error', error);
    });
  }

  /**
   * Integrate with verification system
   * @param {Object} verificationSystem - Verification system
   * @returns {Object} Integration result
   */
  integrateWithVerificationSystem(verificationSystem) {
    try {
      this.log('Integrating with verification system');

      // Store reference to verification system
      this.verificationSystem = verificationSystem;

      // Listen for verification events
      if (this.config.autoGenerateReports) {
        this.verificationSystem.on('verification:complete', async data => {
          try {
            await this.generateReportForVerification(data.result);
          } catch (error) {
            this.log(`Error generating report: ${error.message}`);
            this.emit('error', error);
          }
        });
      }

      return {
        success: true,
        message: 'Successfully integrated with verification system',
      };
    } catch (error) {
      this.log(`Error integrating with verification system: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate report for verification result
   * @param {Object} verificationResult - Verification result
   * @param {Object} options - Report options
   * @returns {Promise<Object>} Report generation result
   */
  async generateReportForVerification(verificationResult, options = {}) {
    try {
      this.log(
        `Generating report for verification result: ${verificationResult.targetPath || 'unknown'}`
      );

      // Merge options with defaults
      const mergedOptions = {
        ...this.config,
        ...options,
      };

      // Generate report
      const reportResult = await this.reportGenerator.generateReport(
        verificationResult,
        mergedOptions
      );

      this.log('Report generation completed');
      this.emit('report-generated', reportResult);

      return reportResult;
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
   * Get report generator
   * @returns {DetailedReportGenerator} Report generator
   */
  getReportGenerator() {
    return this.reportGenerator;
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[ReportingIntegration] ${message}`);
    }
  }
}

module.exports = ReportingIntegration;
