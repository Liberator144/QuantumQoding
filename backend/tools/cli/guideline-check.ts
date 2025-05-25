#!/usr/bin/env node

/**
 * Guideline Check CLI
 *
 * Command-line interface for checking guideline compliance.
 *
 * @version 1.0.0
 */

const { program } = require('commander');
const fs = require('fs').promises;
const path = require('path');
const {
  GuidelineChecker,
  GuidelineChecklist,
  GuidelineOverrideManager,
} = require('../../verification/guidelines');

// Configure the program
program
  .name('guideline-check')
  .description('Check implementation against guidelines')
  .version('1.0.0');

// Check command
program
  .command('check <path>')
  .description('Check implementation against guidelines')
  .option('-d, --debug', 'Enable debug mode')
  .option('-o, --output <file>', 'Output file for results')
  .option('-f, --format <format>', 'Output format (json, yaml, text)', 'json')
  .option('-s, --strict', 'Enforce all guidelines strictly')
  .action(async (targetPath, options) => {
    try {
      console.log(`Checking guideline compliance for: ${targetPath}`);

      // Create guideline checker
      const checker = new GuidelineChecker({
        debugMode: options.debug,
        strictMode: options.strict,
      });

      // Check guidelines
      const result = await checker.check(targetPath);

      // Format result
      let formattedResult;

      switch (options.format) {
        case 'json':
          formattedResult = JSON.stringify(result, null, 2);
          break;
        case 'yaml':
          formattedResult = require('yaml').stringify(result);
          break;
        case 'text':
          formattedResult = formatResultAsText(result);
          break;
        default:
          formattedResult = JSON.stringify(result, null, 2);
      }

      // Output result
      if (options.output) {
        await fs.writeFile(options.output, formattedResult);
        console.log(`Results written to: ${options.output}`);
      } else {
        console.log(formattedResult);
      }

      // Exit with appropriate code
      process.exit(result.analysis.compliant ? 0 : 1);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Checklist command
program
  .command('checklist <path>')
  .description('Generate a checklist for implementation')
  .option('-d, --debug', 'Enable debug mode')
  .option('-o, --output <file>', 'Output file for checklist')
  .action(async (targetPath, options) => {
    try {
      console.log(`Generating checklist for: ${targetPath}`);

      // Create guideline checklist
      const checklist = new GuidelineChecklist({
        debugMode: options.debug,
      });

      // Generate checklist
      const result = await checklist.generateChecklist(targetPath, {
        outputPath: options.output,
      });

      if (result.success) {
        console.log(`Checklist generated at: ${result.outputPath}`);
      } else {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate <checklist>')
  .description('Validate a completed checklist against the implementation')
  .option('-d, --debug', 'Enable debug mode')
  .option('-o, --output <file>', 'Output file for validation report')
  .action(async (checklistPath, options) => {
    try {
      console.log(`Validating checklist: ${checklistPath}`);

      // Create guideline checklist
      const checklist = new GuidelineChecklist({
        debugMode: options.debug,
      });

      // Validate checklist
      const result = await checklist.validateChecklist(checklistPath);

      if (result.success) {
        // Generate report
        const reportResult = await checklist.generateReport(checklistPath, result.targetPath);

        if (reportResult.success) {
          console.log(`Validation report generated at: ${reportResult.outputPath}`);

          // Output summary
          console.log(`\nValidation Summary:`);
          console.log(`- Target: ${result.targetPath}`);
          console.log(`- Compliant: ${result.comparisonResult.compliant ? 'Yes' : 'No'}`);
          console.log(`- Discrepancies: ${result.comparisonResult.discrepancies.length}`);

          // Exit with appropriate code
          process.exit(result.comparisonResult.compliant ? 0 : 1);
        } else {
          console.error(`Error generating report: ${reportResult.error}`);
          process.exit(1);
        }
      } else {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Override command
program
  .command('override <guideline> <path>')
  .description('Create a guideline override')
  .option('-d, --debug', 'Enable debug mode')
  .option('-j, --justification <text>', 'Justification for the override')
  .option('-a, --alternative <text>', 'Alternative approach')
  .option('-i, --impact <text>', 'Impact assessment')
  .option('-p, --approver <name>', 'Name of the approver')
  .action(async (guideline, targetPath, options) => {
    try {
      console.log(`Creating override for guideline: ${guideline}`);

      // Check required options
      if (!options.justification) {
        console.error('Error: Justification is required');
        process.exit(1);
      }

      if (!options.alternative) {
        console.error('Error: Alternative approach is required');
        process.exit(1);
      }

      if (!options.impact) {
        console.error('Error: Impact assessment is required');
        process.exit(1);
      }

      // Create override manager
      const overrideManager = new GuidelineOverrideManager({
        debugMode: options.debug,
      });

      // Create override
      const result = await overrideManager.createOverride(
        guideline,
        targetPath,
        options.justification,
        options.alternative,
        options.impact,
        options.approver
      );

      if (result.success) {
        console.log(`Override created for guideline: ${guideline}`);
        console.log(`Override ID: ${result.override.id}`);
      } else {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// List overrides command
program
  .command('list-overrides')
  .description('List guideline overrides')
  .option('-d, --debug', 'Enable debug mode')
  .option('-g, --guideline <guideline>', 'Filter by guideline')
  .option('-p, --path <path>', 'Filter by path')
  .option('-a, --approved <boolean>', 'Filter by approval status')
  .option('-r, --approver <name>', 'Filter by approver')
  .action(async options => {
    try {
      console.log('Listing guideline overrides');

      // Create override manager
      const overrideManager = new GuidelineOverrideManager({
        debugMode: options.debug,
      });

      // Create filter
      const filter = {};

      if (options.guideline) {
        filter.guideline = options.guideline;
      }

      if (options.path) {
        filter.path = options.path;
      }

      if (options.approved !== undefined) {
        filter.approved = options.approved === 'true';
      }

      if (options.approver) {
        filter.approver = options.approver;
      }

      // List overrides
      const result = await overrideManager.listOverrides(filter);

      if (result.success) {
        console.log(`Found ${result.overrides.length} overrides:`);

        for (const override of result.overrides) {
          console.log(`\nOverride ID: ${override.id}`);
          console.log(`Guideline: ${override.guideline}`);
          console.log(`Path: ${override.path}`);
          console.log(`Approved: ${override.approved ? 'Yes' : 'No'}`);

          if (override.approver) {
            console.log(`Approver: ${override.approver}`);
          }

          console.log(`Created: ${new Date(override.createdAt).toLocaleString()}`);
        }
      } else {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Approve override command
program
  .command('approve-override <id>')
  .description('Approve a guideline override')
  .option('-d, --debug', 'Enable debug mode')
  .option('-a, --approver <name>', 'Name of the approver')
  .action(async (overrideId, options) => {
    try {
      console.log(`Approving override: ${overrideId}`);

      // Check required options
      if (!options.approver) {
        console.error('Error: Approver is required');
        process.exit(1);
      }

      // Create override manager
      const overrideManager = new GuidelineOverrideManager({
        debugMode: options.debug,
      });

      // Approve override
      const result = await overrideManager.approveOverride(overrideId, options.approver);

      if (result.success) {
        console.log(`Override approved: ${overrideId}`);
        console.log(`Approver: ${result.override.approver}`);
        console.log(`Approved at: ${new Date(result.override.approvedAt).toLocaleString()}`);
      } else {
        console.error(`Error: ${result.error}`);
        process.exit(1);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  });

// Format result as text
function formatResultAsText(result) {
  let text = `Guideline Compliance Report\n`;
  text += `=========================\n\n`;
  text += `Target: ${result.targetPath}\n`;
  text += `Date: ${new Date(result.timestamp).toLocaleString()}\n`;
  text += `Compliant: ${result.compliant ? 'Yes' : 'No'}\n\n`;

  text += `Summary:\n`;
  text += `- Total violations: ${result.summary.totalViolations}\n`;
  text += `- Critical violations: ${result.summary.criticalViolations}\n`;
  text += `- Overridden violations: ${result.summary.overriddenViolations}\n\n`;

  text += `Violations by category:\n`;
  text += `- Documentation: ${result.summary.violationsByCategory.documentation}\n`;
  text += `- Structure: ${result.summary.violationsByCategory.structure}\n`;
  text += `- Code Style: ${result.summary.violationsByCategory.codeStyle}\n`;
  text += `- Testing: ${result.summary.violationsByCategory.testing}\n\n`;

  if (result.summary.totalViolations > 0) {
    text += `Violations:\n`;

    // Documentation violations
    if (result.results.documentation.violations.length > 0) {
      text += `\nDocumentation:\n`;

      for (const violation of result.results.documentation.violations) {
        text += `- [${violation.severity.toUpperCase()}] ${violation.message}\n`;
        text += `  Guideline: ${violation.guideline}\n`;
        text += `  Path: ${violation.path}\n\n`;
      }
    }

    // Structure violations
    if (result.results.structure.violations.length > 0) {
      text += `\nStructure:\n`;

      for (const violation of result.results.structure.violations) {
        text += `- [${violation.severity.toUpperCase()}] ${violation.message}\n`;
        text += `  Guideline: ${violation.guideline}\n`;
        text += `  Path: ${violation.path}\n\n`;
      }
    }

    // Code style violations
    if (result.results.codeStyle.violations.length > 0) {
      text += `\nCode Style:\n`;

      for (const violation of result.results.codeStyle.violations) {
        text += `- [${violation.severity.toUpperCase()}] ${violation.message}\n`;
        text += `  Guideline: ${violation.guideline}\n`;
        text += `  Path: ${violation.path}\n\n`;
      }
    }

    // Testing violations
    if (result.results.testing.violations.length > 0) {
      text += `\nTesting:\n`;

      for (const violation of result.results.testing.violations) {
        text += `- [${violation.severity.toUpperCase()}] ${violation.message}\n`;
        text += `  Guideline: ${violation.guideline}\n`;
        text += `  Path: ${violation.path}\n\n`;
      }
    }
  }

  return text;
}

// Parse command line arguments
program.parse(process.argv);
