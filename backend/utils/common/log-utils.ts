/**
 * Logging Utilities
 * 
 * This module provides utility functions for logging.
 * 
 * @version 1.0.0
 */

/**
 * Log level enum
 */
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

/**
 * Log entry interface
 */
export interface LogEntry {
  /** Log level */
  level: LogLevel;
  /** Log message */
  message: string;
  /** Log timestamp */
  timestamp: Date;
  /** Log context */
  context?: string;
  /** Additional metadata */
  meta?: Record<string, any>;
}

/**
 * Logger options interface
 */
export interface LoggerOptions {
  /** Minimum log level */
  minLevel?: LogLevel;
  /** Whether to include timestamp */
  includeTimestamp?: boolean;
  /** Whether to include context */
  includeContext?: boolean;
  /** Whether to format output */
  formatOutput?: boolean;
  /** Custom formatter function */
  formatter?: (entry: LogEntry) => string;
  /** Log handler function */
  handler?: (entry: LogEntry) => void;
}

/**
 * Simple logger class
 */
export class Logger {
  /** Logger context */
  private context: string;
  
  /** Logger options */
  private options: LoggerOptions;
  
  /** Log entries (only stored if no handler is provided) */
  private entries: LogEntry[] = [];
  
  /**
   * Create a new Logger
   * @param context - Logger context
   * @param options - Logger options
   */
  constructor(context: string, options: LoggerOptions = {}) {
    this.context = context;
    this.options = {
      minLevel: LogLevel.INFO,
      includeTimestamp: true,
      includeContext: true,
      formatOutput: true,
      ...options,
    };
  }
  
  /**
   * Log a debug message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  debug(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, meta);
  }
  
  /**
   * Log an info message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  info(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, meta);
  }
  
  /**
   * Log a warning message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  warn(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, meta);
  }
  
  /**
   * Log an error message
   * @param message - Log message
   * @param meta - Additional metadata
   */
  error(message: string, meta?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, meta);
  }
  
  /**
   * Log a message
   * @param level - Log level
   * @param message - Log message
   * @param meta - Additional metadata
   */
  log(level: LogLevel, message: string, meta?: Record<string, any>): void {
    // Skip if level is below minimum
    if (!this.shouldLog(level)) {
      return;
    }
    
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      meta,
    };
    
    // Use custom handler if provided
    if (this.options.handler) {
      this.options.handler(entry);
      return;
    }
    
    // Store entry
    this.entries.push(entry);
    
    // Format and print entry
    if (this.options.formatOutput) {
      const formatted = this.formatEntry(entry);
      this.printEntry(entry.level, formatted);
    }
  }
  
  /**
   * Get all log entries
   * @returns Array of log entries
   */
  getEntries(): LogEntry[] {
    return [...this.entries];
  }
  
  /**
   * Clear log entries
   */
  clearEntries(): void {
    this.entries = [];
  }
  
  /**
   * Create a child logger with a sub-context
   * @param subContext - Sub-context
   * @returns Child logger
   */
  createChild(subContext: string): Logger {
    return new Logger(`${this.context}:${subContext}`, this.options);
  }
  
  /**
   * Check if a level should be logged
   * @param level - Log level
   * @returns Whether the level should be logged
   * @private
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minLevelIndex = levels.indexOf(this.options.minLevel || LogLevel.INFO);
    const levelIndex = levels.indexOf(level);
    
    return levelIndex >= minLevelIndex;
  }
  
  /**
   * Format a log entry
   * @param entry - Log entry
   * @returns Formatted entry
   * @private
   */
  private formatEntry(entry: LogEntry): string {
    // Use custom formatter if provided
    if (this.options.formatter) {
      return this.options.formatter(entry);
    }
    
    // Build formatted string
    const parts: string[] = [];
    
    // Add timestamp
    if (this.options.includeTimestamp) {
      parts.push(`[${entry.timestamp.toISOString()}]`);
    }
    
    // Add level
    parts.push(`[${entry.level.toUpperCase()}]`);
    
    // Add context
    if (this.options.includeContext && entry.context) {
      parts.push(`[${entry.context}]`);
    }
    
    // Add message
    parts.push(entry.message);
    
    // Add metadata
    if (entry.meta && Object.keys(entry.meta).length > 0) {
      parts.push(JSON.stringify(entry.meta));
    }
    
    return parts.join(' ');
  }
  
  /**
   * Print a formatted entry
   * @param level - Log level
   * @param formatted - Formatted entry
   * @private
   */
  private printEntry(level: LogLevel, formatted: string): void {
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formatted);
        break;
      case LogLevel.INFO:
        console.info(formatted);
        break;
      case LogLevel.WARN:
        console.warn(formatted);
        break;
      case LogLevel.ERROR:
        console.error(formatted);
        break;
      default:
        console.log(formatted);
    }
  }
}
