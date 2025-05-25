/**
 * Context-Aware Code Generator
 *
 * Generates code templates based on the detected context.
 *
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { MLContextDetector } = require('../context-detection/ml/MLContextDetector');

/**
 * Context-Aware Code Generator
 */
class ContextCodeGenerator extends EventEmitter {
  /**
   * Create a new ContextCodeGenerator instance
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

      // Template directory
      templateDir: options.templateDir || path.join(process.cwd(), 'templates'),

      // Context detector options
      contextDetector: options.contextDetector || {},

      // Template variables
      variables: options.variables || {},

      // Context-specific templates
      contextTemplates: options.contextTemplates || {
        core: {
          class: 'core/class.js.template',
          interface: 'core/interface.js.template',
          function: 'core/function.js.template',
        },
        flow: {
          class: 'flow/class.js.template',
          function: 'flow/function.js.template',
          pipeline: 'flow/pipeline.js.template',
        },
        verification: {
          test: 'verification/test.js.template',
          mock: 'verification/mock.js.template',
          fixture: 'verification/fixture.js.template',
        },
        visualization: {
          component: 'visualization/component.js.template',
          chart: 'visualization/chart.js.template',
          graph: 'visualization/graph.js.template',
        },
        security: {
          auth: 'security/auth.js.template',
          encryption: 'security/encryption.js.template',
          validation: 'security/validation.js.template',
        },
        caching: {
          cache: 'caching/cache.js.template',
          strategy: 'caching/strategy.js.template',
        },
        schemas: {
          schema: 'schemas/schema.js.template',
          model: 'schemas/model.js.template',
          validator: 'schemas/validator.js.template',
        },
        optimization: {
          optimizer: 'optimization/optimizer.js.template',
          profiler: 'optimization/profiler.js.template',
        },
        ai: {
          model: 'ai/model.js.template',
          trainer: 'ai/trainer.js.template',
          predictor: 'ai/predictor.js.template',
        },
        testing: {
          test: 'testing/test.js.template',
          mock: 'testing/mock.js.template',
          fixture: 'testing/fixture.js.template',
        },
        documentation: {
          readme: 'documentation/readme.md.template',
          api: 'documentation/api.md.template',
          guide: 'documentation/guide.md.template',
        },
        general: {
          class: 'general/class.js.template',
          function: 'general/function.js.template',
          readme: 'general/readme.md.template',
        },
      },

      // Merge with provided options
      ...options,
    };

    // Initialize
    this._init();
  }

  /**
   * Initialize the generator
   * @private
   */
  _init() {
    this.log('Initializing Context Code Generator');

    // Create context detector
    this.contextDetector = new MLContextDetector({
      debugMode: this.config.debugMode,
      baseDir: this.config.baseDir,
      ...this.config.contextDetector,
    });

    this.log('Context Code Generator initialized');
  }

  /**
   * Generate code based on context
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generation result
   */
  async generateCode(options = {}) {
    try {
      this.log('Generating code');

      // Get options
      const { targetPath, templateType, context: forceContext, variables = {} } = options;

      // Validate options
      if (!targetPath) {
        throw new Error('Target path is required');
      }

      if (!templateType) {
        throw new Error('Template type is required');
      }

      // Detect context or use forced context
      let contextResult;

      if (forceContext) {
        this.log(`Using forced context: ${forceContext}`);
        contextResult = {
          context: forceContext,
        };
      } else {
        // Get parent directory for context detection
        const parentDir = path.dirname(targetPath);

        // Detect context
        contextResult = await this.contextDetector.detectContext(parentDir);
      }

      this.log(`Detected context: ${contextResult.context}`);

      // Get template path
      const templatePath = this._getTemplatePath(contextResult.context, templateType);

      if (!templatePath) {
        throw new Error(
          `No template found for context '${contextResult.context}' and type '${templateType}'`
        );
      }

      // Load template
      const template = await this._loadTemplate(templatePath);

      // Process template
      const processedTemplate = this._processTemplate(template, {
        ...this.config.variables,
        ...variables,
        context: contextResult.context,
        filename: path.basename(targetPath),
        filepath: targetPath,
        date: new Date().toISOString(),
        year: new Date().getFullYear(),
      });

      // Write file
      await this._writeFile(targetPath, processedTemplate);

      this.log(`Generated code at ${targetPath}`);

      return {
        path: targetPath,
        context: contextResult.context,
        template: templatePath,
      };
    } catch (error) {
      this.log(`Error generating code: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get template path for context and type
   * @param {string} context - Context
   * @param {string} templateType - Template type
   * @returns {string} Template path
   * @private
   */
  _getTemplatePath(context, templateType) {
    // Check if template exists for context
    if (
      this.config.contextTemplates[context] &&
      this.config.contextTemplates[context][templateType]
    ) {
      return path.join(
        this.config.templateDir,
        this.config.contextTemplates[context][templateType]
      );
    }

    // Fall back to general template
    if (
      this.config.contextTemplates.general &&
      this.config.contextTemplates.general[templateType]
    ) {
      this.log(
        `No template found for context '${context}' and type '${templateType}', falling back to general template`
      );
      return path.join(this.config.templateDir, this.config.contextTemplates.general[templateType]);
    }

    return null;
  }

  /**
   * Load template from file
   * @param {string} templatePath - Template path
   * @returns {Promise<string>} Template content
   * @private
   */
  async _loadTemplate(templatePath) {
    this.log(`Loading template: ${templatePath}`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    return fs.readFileSync(templatePath, 'utf8');
  }

  /**
   * Process template with variables
   * @param {string} template - Template content
   * @param {Object} variables - Template variables
   * @returns {string} Processed template
   * @private
   */
  _processTemplate(template, variables) {
    this.log('Processing template');

    // Replace variables
    let processedTemplate = template;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
      processedTemplate = processedTemplate.replace(regex, value);
    }

    return processedTemplate;
  }

  /**
   * Write file
   * @param {string} filePath - File path
   * @param {string} content - File content
   * @returns {Promise<void>}
   * @private
   */
  async _writeFile(filePath, content) {
    this.log(`Writing file: ${filePath}`);

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(filePath, content);
  }

  /**
   * Get available templates for context
   * @param {string} context - Context
   * @returns {Object} Available templates
   */
  getAvailableTemplates(context) {
    if (!context) {
      return this.config.contextTemplates;
    }

    return this.config.contextTemplates[context] || {};
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[ContextCodeGenerator] ${message}`);
    }
  }
}

module.exports = { ContextCodeGenerator };
