/**
 * Consciousness Stream Monitor
 *
 * Monitors and analyzes consciousness stream for continuity.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';
import { 
  ConsciousnessStreamTester, 
  ConsciousnessEventType,
  ConsciousnessEvent,
  ConsciousnessCheckpoint,
  ConsciousnessStreamTestResult,
} from './ConsciousnessStreamTester';

/**
 * Consciousness Stream Monitor Options
 */
export interface ConsciousnessStreamMonitorOptions {
  /** Enable automatic monitoring */
  enableAutomaticMonitoring?: boolean;
  
  /** Automatic monitoring interval (ms) */
  automaticMonitoringInterval?: number;
  
  /** Maximum test results to store */
  maxTestResults?: number;
  
  /** Enable alerts */
  enableAlerts?: boolean;
  
  /** Alert threshold (0-1) */
  alertThreshold?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}

/**
 * Default options
 */
const defaultOptions: ConsciousnessStreamMonitorOptions = {
  enableAutomaticMonitoring: true,
  automaticMonitoringInterval: 60000,
  maxTestResults: 10,
  enableAlerts: true,
  alertThreshold: 0.7,
  debugMode: false,
};/**
 * Consciousness Stream Monitor
 */
export class ConsciousnessStreamMonitor {
  /** Options */
  private options: ConsciousnessStreamMonitorOptions;
  
  /** Consciousness stream tester */
  private tester: ConsciousnessStreamTester;
  
  /** Test results */
  private testResults: ConsciousnessStreamTestResult[] = [];
  
  /** Automatic monitoring timer */
  private automaticMonitoringTimer: number | null = null;
  
  /** Alert handlers */
  private alertHandlers: ((alert: string, severity: number) => void)[] = [];
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param tester - Consciousness stream tester
   * @param options - Options
   */
  constructor(
    tester: ConsciousnessStreamTester,
    options: ConsciousnessStreamMonitorOptions = {}
  ) {
    this.tester = tester;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.log('Consciousness Stream Monitor initialized');
  }
  
  /**
   * Initialize the consciousness stream monitor
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Start automatic monitoring
    if (this.options.enableAutomaticMonitoring) {
      this.startAutomaticMonitoring();
    }
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Consciousness Stream Monitor started');
  }  
  /**
   * Start automatic monitoring
   */
  private startAutomaticMonitoring(): void {
    // Clear existing timer
    this.stopAutomaticMonitoring();
    
    // Start new timer
    this.automaticMonitoringTimer = window.setInterval(() => {
      this.runTest('Automatic monitoring');
    }, this.options.automaticMonitoringInterval);
  }
  
  /**
   * Stop automatic monitoring
   */
  private stopAutomaticMonitoring(): void {
    if (this.automaticMonitoringTimer !== null) {
      window.clearInterval(this.automaticMonitoringTimer);
      this.automaticMonitoringTimer = null;
    }
  }
  
  /**
   * Run test
   * @param name - Test name
   * @returns Test result
   */
  runTest(name: string): ConsciousnessStreamTestResult | null {
    // Start test
    this.tester.startTest(name);
    
    // Check for discontinuities
    const discontinuities = this.tester.testForDiscontinuities();
    
    // End test
    const testResult = this.tester.endTest(
      !discontinuities.found,
      discontinuities.found ? `Found discontinuities: ${discontinuities.details.join(', ')}` : 'No discontinuities found'
    );
    
    // Store test result
    if (testResult) {
      this.testResults.push(testResult);
      
      // Limit test results
      if (this.testResults.length > this.options.maxTestResults!) {
        this.testResults.shift();
      }
      
      // Check for alerts
      if (this.options.enableAlerts && 
          testResult.score < this.options.alertThreshold!) {
        this.triggerAlert(
          `Consciousness stream continuity alert: Score ${testResult.score.toFixed(2)} is below threshold ${this.options.alertThreshold}`,
          1 - testResult.score
        );
      }
    }
    
    return testResult;
  }  
  /**
   * Add alert handler
   * @param handler - Alert handler
   */
  addAlertHandler(handler: (alert: string, severity: number) => void): void {
    this.alertHandlers.push(handler);
  }
  
  /**
   * Remove alert handler
   * @param handler - Alert handler
   */
  removeAlertHandler(handler: (alert: string, severity: number) => void): void {
    this.alertHandlers = this.alertHandlers.filter((h) => h !== handler);
  }
  
  /**
   * Trigger alert
   * @param alert - Alert message
   * @param severity - Alert severity (0-1)
   */
  private triggerAlert(alert: string, severity: number): void {
    // Call alert handlers
    this.alertHandlers.forEach((handler) => {
      handler(alert, severity);
    });
    
    this.log(`Alert triggered: ${alert} (Severity: ${severity})`);
  }
  
  /**
   * Analyze consciousness stream
   * @returns Analysis
   */
  analyzeConsciousnessStream(): any {
    // Get events and checkpoints
    const events = this.tester.getEvents();
    const checkpoints = this.tester.getCheckpoints();
    
    // Calculate event statistics
    const eventCounts: Record<ConsciousnessEventType, number> = {
      [ConsciousnessEventType.SCENE_CHANGE]: 0,
      [ConsciousnessEventType.CAMERA_CHANGE]: 0,
      [ConsciousnessEventType.OBJECT_CHANGE]: 0,
      [ConsciousnessEventType.TRANSITION]: 0,
      [ConsciousnessEventType.INTERACTION]: 0,
      [ConsciousnessEventType.ERROR]: 0,
      [ConsciousnessEventType.WARNING]: 0,
      [ConsciousnessEventType.INFO]: 0,
    };
    
    events.forEach((event) => {
      eventCounts[event.type]++;
    });
    
    // Calculate average event severity
    const averageSeverity = events.length > 0
      ? events.reduce((sum, event) => sum + event.severity, 0) / events.length
      : 0;    
    // Calculate checkpoint statistics
    const checkpointIntervals = [];
    
    for (let i = 1; i < checkpoints.length; i++) {
      checkpointIntervals.push(checkpoints[i].timestamp - checkpoints[i - 1].timestamp);
    }
    
    const averageCheckpointInterval = checkpointIntervals.length > 0
      ? checkpointIntervals.reduce((sum, interval) => sum + interval, 0) / checkpointIntervals.length
      : 0;
    
    // Calculate test result statistics
    const averageTestScore = this.testResults.length > 0
      ? this.testResults.reduce((sum, result) => sum + result.score, 0) / this.testResults.length
      : 0;
    
    // Return analysis
    return {
      events: {
        total: events.length,
        counts: eventCounts,
        averageSeverity,
      },
      checkpoints: {
        total: checkpoints.length,
        averageInterval: averageCheckpointInterval,
      },
      tests: {
        total: this.testResults.length,
        averageScore: averageTestScore,
      },
    };
  }
  
  /**
   * Get test results
   * @returns Test results
   */
  getTestResults(): ConsciousnessStreamTestResult[] {
    return [...this.testResults];
  }
  
  /**
   * Set options
   * @param options - Options
   */
  setOptions(options: ConsciousnessStreamMonitorOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Update automatic monitoring
    if (options.enableAutomaticMonitoring !== undefined || 
        options.automaticMonitoringInterval !== undefined) {
      if (this.options.enableAutomaticMonitoring) {
        this.startAutomaticMonitoring();
      } else {
        this.stopAutomaticMonitoring();
      }
    }
  }  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop automatic monitoring
    this.stopAutomaticMonitoring();
    
    // Clear test results
    this.testResults = [];
    
    // Clear alert handlers
    this.alertHandlers = [];
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('Consciousness Stream Monitor disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[ConsciousnessStreamMonitor] ${message}`);
    }
  }
}

export { ConsciousnessStreamMonitor };