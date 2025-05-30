/**
 * QuantumQonnect Star System - Shared Logging Service
 * Centralized logging service for all star modules
 */

import { EventEmitter } from 'events';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  starName: string;
  context?: Record<string, any>;
  error?: Error;
  userId?: string;
  requestId?: string;
}

export interface LoggingConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  filePath?: string;
  remoteEndpoint?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

/**
 * Shared logging service for all star modules
 */
export class LoggingService extends EventEmitter {
  private static instance: LoggingService;
  private config: LoggingConfig;
  private logBuffer: LogEntry[] = [];
  private initialized: boolean = false;

  private constructor() {
    super();
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableRemote: false
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  /**
   * Initialize the logging service
   */
  async initialize(config?: Partial<LoggingConfig>): Promise<void> {
    if (this.initialized) return;

    this.config = { ...this.config, ...config };
    
    console.log('Initializing shared logging service...');

    // Set up log rotation if file logging is enabled
    if (this.config.enableFile) {
      this.setupFileLogging();
    }

    // Set up remote logging if enabled
    if (this.config.enableRemote) {
      this.setupRemoteLogging();
    }

    this.initialized = true;
    console.log('Shared logging service initialized');
  }

  /**
   * Log debug message
   */
  debug(message: string, starName: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, starName, context);
  }

  /**
   * Log info message
   */
  info(message: string, starName: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, starName, context);
  }

  /**
   * Log warning message
   */
  warn(message: string, starName: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, starName, context);
  }

  /**
   * Log error message
   */
  error(message: string, starName: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, starName, context, error);
  }

  /**
   * Log fatal message
   */
  fatal(message: string, starName: string, error?: Error, context?: Record<string, any>): void {
    this.log(LogLevel.FATAL, message, starName, context, error);
  }

  /**
   * Create a logger for a specific star
   */
  createStarLogger(starName: string) {
    return {
      debug: (message: string, context?: Record<string, any>) => this.debug(message, starName, context),
      info: (message: string, context?: Record<string, any>) => this.info(message, starName, context),
      warn: (message: string, context?: Record<string, any>) => this.warn(message, starName, context),
      error: (message: string, error?: Error, context?: Record<string, any>) => this.error(message, starName, error, context),
      fatal: (message: string, error?: Error, context?: Record<string, any>) => this.fatal(message, starName, error, context)
    };
  }

  /**
   * Get recent log entries
   */
  getRecentLogs(count: number = 100, starName?: string): LogEntry[] {
    let logs = this.logBuffer.slice(-count);
    
    if (starName) {
      logs = logs.filter(log => log.starName === starName);
    }
    
    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Set logging level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  // Private methods

  private log(level: LogLevel, message: string, starName: string, context?: Record<string, any>, error?: Error): void {
    if (level < this.config.level) return;

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      starName,
      context,
      error,
      userId: this.getCurrentUserId(),
      requestId: this.getCurrentRequestId()
    };

    // Add to buffer
    this.logBuffer.push(logEntry);

    // Keep buffer size manageable
    if (this.logBuffer.length > 10000) {
      this.logBuffer = this.logBuffer.slice(-5000);
    }

    // Output to console if enabled
    if (this.config.enableConsole) {
      this.outputToConsole(logEntry);
    }

    // Output to file if enabled
    if (this.config.enableFile) {
      this.outputToFile(logEntry);
    }

    // Send to remote if enabled
    if (this.config.enableRemote) {
      this.sendToRemote(logEntry);
    }

    // Emit log event
    this.emit('log', logEntry);
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}] [${entry.starName}]`;
    
    const message = entry.context 
      ? `${prefix} ${entry.message} ${JSON.stringify(entry.context)}`
      : `${prefix} ${entry.message}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message);
        break;
      case LogLevel.INFO:
        console.info(message);
        break;
      case LogLevel.WARN:
        console.warn(message);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
    }
  }

  private outputToFile(entry: LogEntry): void {
    // Placeholder for file logging implementation
    // This would write to the configured log file
  }

  private sendToRemote(entry: LogEntry): void {
    // Placeholder for remote logging implementation
    // This would send logs to a remote logging service
  }

  private setupFileLogging(): void {
    // Placeholder for file logging setup
    // This would set up log rotation and file management
  }

  private setupRemoteLogging(): void {
    // Placeholder for remote logging setup
    // This would set up connection to remote logging service
  }

  private getCurrentUserId(): string | undefined {
    // Get current user ID from authentication service
    // This is a placeholder - implement actual integration
    return undefined;
  }

  private getCurrentRequestId(): string | undefined {
    // Get current request ID from context
    // This is a placeholder - implement actual integration
    return undefined;
  }
}

// Export singleton instance
export const loggingService = LoggingService.getInstance();