/**
 * QuantumQonnect Star System - Shared Monitoring Service
 * Centralized monitoring and health check service for all star modules
 */

import { EventEmitter } from 'events';
import { StarMetrics, HealthMetrics, PerformanceMetrics, UsageMetrics } from '../types';

export interface MonitoringConfig {
  healthCheckInterval: number; // milliseconds
  metricsCollectionInterval: number; // milliseconds
  alertThresholds: {
    responseTime: number; // milliseconds
    memoryUsage: number; // MB
    cpuUsage: number; // percentage
    errorRate: number; // percentage
  };
  enableAlerts: boolean;
  enableMetricsCollection: boolean;
}

export interface Alert {
  id: string;
  starName: string;
  type: 'performance' | 'health' | 'error' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

/**
 * Shared monitoring service for all star modules
 */
export class MonitoringService extends EventEmitter {
  private static instance: MonitoringService;
  private config: MonitoringConfig;
  private starMetrics: Map<string, StarMetrics> = new Map();
  private alerts: Alert[] = [];
  private healthCheckInterval?: NodeJS.Timeout;
  private metricsInterval?: NodeJS.Timeout;
  private initialized: boolean = false;

  private constructor() {
    super();
    this.config = {
      healthCheckInterval: 30000, // 30 seconds
      metricsCollectionInterval: 60000, // 1 minute
      alertThresholds: {
        responseTime: 5000, // 5 seconds
        memoryUsage: 1024, // 1GB
        cpuUsage: 80, // 80%
        errorRate: 5 // 5%
      },
      enableAlerts: true,
      enableMetricsCollection: true
    };
  }

  /**
   * Get singleton instance
   */
  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize the monitoring service
   */
  async initialize(config?: Partial<MonitoringConfig>): Promise<void> {
    if (this.initialized) return;

    this.config = { ...this.config, ...config };
    
    console.log('Initializing shared monitoring service...');

    // Start health check monitoring
    if (this.config.enableMetricsCollection) {
      this.startHealthChecks();
      this.startMetricsCollection();
    }

    this.initialized = true;
    console.log('Shared monitoring service initialized');
  }

  /**
   * Shutdown the monitoring service
   */
  async shutdown(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    this.initialized = false;
    console.log('Monitoring service shutdown complete');
  }

  /**
   * Register a star for monitoring
   */
  registerStar(starName: string): void {
    console.log(`Registering star for monitoring: ${starName}`);
    
    // Initialize metrics for the star
    if (!this.starMetrics.has(starName)) {
      this.starMetrics.set(starName, this.createInitialMetrics());
    }
  }

  /**
   * Unregister a star from monitoring
   */
  unregisterStar(starName: string): void {
    console.log(`Unregistering star from monitoring: ${starName}`);
    this.starMetrics.delete(starName);
  }

  /**
   * Update metrics for a star
   */
  updateStarMetrics(starName: string, metrics: Partial<StarMetrics>): void {
    const currentMetrics = this.starMetrics.get(starName);
    if (currentMetrics) {
      const updatedMetrics = { ...currentMetrics, ...metrics, timestamp: new Date() };
      this.starMetrics.set(starName, updatedMetrics);
      
      // Check for alerts
      if (this.config.enableAlerts) {
        this.checkAlerts(starName, updatedMetrics);
      }
      
      // Emit metrics update event
      this.emit('metrics:updated', { starName, metrics: updatedMetrics });
    }
  }

  /**
   * Get metrics for a specific star
   */
  getStarMetrics(starName: string): StarMetrics | undefined {
    return this.starMetrics.get(starName);
  }

  /**
   * Get metrics for all stars
   */
  getAllMetrics(): Map<string, StarMetrics> {
    return new Map(this.starMetrics);
  }

  /**
   * Create an alert
   */
  createAlert(alert: Omit<Alert, 'id' | 'timestamp' | 'resolved'>): Alert {
    const newAlert: Alert = {
      ...alert,
      id: this.generateAlertId(),
      timestamp: new Date(),
      resolved: false
    };

    this.alerts.push(newAlert);
    
    // Emit alert event
    this.emit('alert:created', newAlert);
    
    console.warn(`Alert created: ${newAlert.message} (${newAlert.starName})`);
    
    return newAlert;
  }

  /**
   * Resolve an alert
   */
  resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert && !alert.resolved) {
      alert.resolved = true;
      alert.resolvedAt = new Date();
      
      // Emit alert resolved event
      this.emit('alert:resolved', alert);
      
      console.info(`Alert resolved: ${alert.message} (${alert.starName})`);
      return true;
    }
    return false;
  }

  /**
   * Get active alerts
   */
  getActiveAlerts(starName?: string): Alert[] {
    let alerts = this.alerts.filter(alert => !alert.resolved);
    
    if (starName) {
      alerts = alerts.filter(alert => alert.starName === starName);
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get all alerts
   */
  getAllAlerts(starName?: string): Alert[] {
    let alerts = this.alerts;
    
    if (starName) {
      alerts = alerts.filter(alert => alert.starName === starName);
    }
    
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get system health summary
   */
  getSystemHealth(): {
    overallStatus: 'healthy' | 'warning' | 'critical' | 'down';
    starCount: number;
    healthyStars: number;
    activeAlerts: number;
    criticalAlerts: number;
  } {
    const starCount = this.starMetrics.size;
    let healthyStars = 0;
    let overallStatus: 'healthy' | 'warning' | 'critical' | 'down' = 'healthy';

    // Check each star's health
    for (const [starName, metrics] of this.starMetrics) {
      if (metrics.health.status === 'healthy') {
        healthyStars++;
      } else if (metrics.health.status === 'critical' || metrics.health.status === 'down') {
        overallStatus = 'critical';
      } else if (metrics.health.status === 'warning' && overallStatus === 'healthy') {
        overallStatus = 'warning';
      }
    }

    const activeAlerts = this.getActiveAlerts();
    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical').length;

    if (criticalAlerts > 0) {
      overallStatus = 'critical';
    }

    return {
      overallStatus,
      starCount,
      healthyStars,
      activeAlerts: activeAlerts.length,
      criticalAlerts
    };
  }

  // Private methods

  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.healthCheckInterval);
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsCollectionInterval);
  }

  private async performHealthChecks(): Promise<void> {
    for (const starName of this.starMetrics.keys()) {
      try {
        // Emit health check request
        this.emit('health:check:request', { starName });
      } catch (error) {
        console.error(`Health check failed for ${starName}:`, error);
      }
    }
  }

  private async collectMetrics(): Promise<void> {
    for (const starName of this.starMetrics.keys()) {
      try {
        // Emit metrics collection request
        this.emit('metrics:collect:request', { starName });
      } catch (error) {
        console.error(`Metrics collection failed for ${starName}:`, error);
      }
    }
  }

  private checkAlerts(starName: string, metrics: StarMetrics): void {
    const { alertThresholds } = this.config;

    // Check response time
    if (metrics.performance.responseTime > alertThresholds.responseTime) {
      this.createAlert({
        starName,
        type: 'performance',
        severity: 'high',
        message: `High response time: ${metrics.performance.responseTime}ms`,
        metadata: { responseTime: metrics.performance.responseTime }
      });
    }

    // Check memory usage
    if (metrics.performance.memoryUsage > alertThresholds.memoryUsage) {
      this.createAlert({
        starName,
        type: 'performance',
        severity: 'medium',
        message: `High memory usage: ${metrics.performance.memoryUsage}MB`,
        metadata: { memoryUsage: metrics.performance.memoryUsage }
      });
    }

    // Check CPU usage
    if (metrics.performance.cpuUsage > alertThresholds.cpuUsage) {
      this.createAlert({
        starName,
        type: 'performance',
        severity: 'medium',
        message: `High CPU usage: ${metrics.performance.cpuUsage}%`,
        metadata: { cpuUsage: metrics.performance.cpuUsage }
      });
    }

    // Check error rate
    const errorRate = metrics.performance.requestCount > 0 
      ? (metrics.performance.errorCount / metrics.performance.requestCount) * 100 
      : 0;
    
    if (errorRate > alertThresholds.errorRate) {
      this.createAlert({
        starName,
        type: 'error',
        severity: 'high',
        message: `High error rate: ${errorRate.toFixed(2)}%`,
        metadata: { errorRate, errorCount: metrics.performance.errorCount, requestCount: metrics.performance.requestCount }
      });
    }

    // Check health status
    if (metrics.health.status === 'critical' || metrics.health.status === 'down') {
      this.createAlert({
        starName,
        type: 'health',
        severity: 'critical',
        message: `Star health critical: ${metrics.health.status}`,
        metadata: { healthStatus: metrics.health.status, healthScore: metrics.health.score }
      });
    }
  }

  private createInitialMetrics(): StarMetrics {
    return {
      performance: {
        responseTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        requestCount: 0,
        errorCount: 0,
        uptime: 0
      },
      usage: {
        activeUsers: 0,
        totalRequests: 0,
        featureUsage: {},
        dataVolume: 0
      },
      health: {
        status: 'down',
        score: 0,
        lastCheck: new Date(),
        details: {}
      },
      timestamp: new Date()
    };
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const monitoringService = MonitoringService.getInstance();