#!/usr/bin/env node
/**
 * ESLint Report Generator
 * 
 * This script runs ESLint and generates a detailed HTML report.
 * 
 * @version 1.0.0
 */

import { ESLint } from 'eslint';
import fs from 'fs';
import path from 'path';

interface ESLintMessage {
  line: number;
  column: number;
  severity: number;
  message: string;
  ruleId?: string;
}

interface ESLintResult {
  filePath: string;
  messages: ESLintMessage[];
  errorCount: number;
  warningCount: number;
}

/**
 * Generate an HTML report from ESLint results
 * @param results - ESLint results
 * @returns HTML report
 */
function generateHTMLReport(results: ESLintResult[]): string {
  let totalErrors = 0;
  let totalWarnings = 0;
  let fileReports = '';

  // Process each file
  results.forEach(result => {
    const { filePath, messages, errorCount, warningCount } = result;
    
    if (errorCount === 0 && warningCount === 0) {
      return; // Skip files with no issues
    }
    
    totalErrors += errorCount;
    totalWarnings += warningCount;
    
    // Create file section
    const relativePath = path.relative(process.cwd(), filePath);
    fileReports += `
      <div class="file">
        <h3>
          ${relativePath}
          <span class="count">
            ${errorCount > 0 ? `<span class="error-count">${errorCount} errors</span>` : ''}
            ${warningCount > 0 ? `<span class="warning-count">${warningCount} warnings</span>` : ''}
          </span>
        </h3>
        <table>
          <thead>
            <tr>
              <th>Line</th>
              <th>Column</th>
              <th>Type</th>
              <th>Message</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
    `;    
    // Add each message
    messages.forEach(message => {
      const { line, column, severity, message: text, ruleId } = message;
      const type = severity === 2 ? 'error' : 'warning';
      
      fileReports += `
        <tr class="${type}">
          <td>${line}</td>
          <td>${column}</td>
          <td>${type}</td>
          <td>${text}</td>
          <td>${ruleId || ''}</td>
        </tr>
      `;
    });
    
    fileReports += `
          </tbody>
        </table>
      </div>
    `;
  });
  
  // Create HTML report
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ESLint Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .summary {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }        .error-count {
          color: #d73a49;
          font-weight: bold;
          margin-right: 10px;
        }
        .warning-count {
          color: #e36209;
          font-weight: bold;
        }
        .file {
          margin-bottom: 30px;
        }
        .file h3 {
          background-color: #f1f8ff;
          padding: 10px;
          border-radius: 4px 4px 0 0;
          margin: 0;
          display: flex;
          justify-content: space-between;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          border: 1px solid #ddd;
        }
        th, td {
          text-align: left;
          padding: 8px;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f6f8fa;
        }
        tr.error {
          background-color: #ffeef0;
        }
        tr.warning {
          background-color: #fff5e6;
        }
        .count {
          font-size: 0.9em;
        }
        .no-issues {
          background-color: #f6ffed;
          padding: 20px;
          border-radius: 4px;
          text-align: center;
          color: #52c41a;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <h1>ESLint Report</h1>
      
      <div class="summary">
        <h2>Summary</h2>
        <p>
          ${totalErrors > 0 ? `<span class="error-count">${totalErrors} errors</span>` : ''}
          ${totalWarnings > 0 ? `<span class="warning-count">${totalWarnings} warnings</span>` : ''}
          ${totalErrors === 0 && totalWarnings === 0 ? '<span class="no-issues">No issues found!</span>' : ''}
        </p>
      </div>
      
      ${fileReports || '<div class="no-issues">No issues found in any files!</div>'}
    </body>
    </html>
  `;
}/**
 * Main function
 */
async function main(): Promise<void> {
  try {
    // Create ESLint instance
    const eslint = new ESLint();
    
    // Get command line arguments
    const args = process.argv.slice(2);
    const patterns = args.length > 0 ? args : ['.'];
    
    // Run ESLint
    console.log(`Running ESLint on ${patterns.join(', ')}...`);
    const results = await eslint.lintFiles(patterns);
    
    // Generate report
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);
    console.log(resultText);
    
    // Generate HTML report
    const htmlReport = generateHTMLReport(results);
    
    // Create reports directory if it doesn't exist
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    // Write HTML report
    const reportPath = path.join(reportsDir, 'eslint-report.html');
    fs.writeFileSync(reportPath, htmlReport);
    
    console.log(`\nHTML report generated at ${reportPath}`);
    
    // Exit with error code if there are errors
    const errorCount = results.reduce((sum, result) => sum + result.errorCount, 0);
    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error running ESLint:', error);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});