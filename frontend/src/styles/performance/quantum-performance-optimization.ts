/**
 * Quantum Performance Optimization System
 * Advanced performance monitoring, optimization, and device-specific enhancements
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Performance monitoring types
export type PerformanceMetric = 'fps' | 'memory' | 'interaction' | 'render' | 'network' | 'bundle';
export type DeviceCapability = 'lowEnd' | 'midRange' | 'highEnd' | 'premium';
export type OptimizationLevel = 'minimal' | 'balanced' | 'aggressive' | 'maximum';

// Animation performance optimization standards
export const ANIMATION_PERFORMANCE_STANDARDS = {
  // GPU-accelerated properties (preferred)
  gpuAccelerated: {
    properties: ['transform', 'opacity', 'filter'],
    willChange: {
      transform: 'will-change: transform',
      opacity: 'will-change: opacity',
      filter: 'will-change: filter',
      auto: 'will-change: auto'
    },
    compositorLayers: {
      force3d: 'transform: translateZ(0)',
      backfaceVisibility: 'backface-visibility: hidden',
      perspective: 'perspective: 1000px'
    }
  },

  // Properties to avoid animating (CPU-intensive)
  avoidAnimating: {
    layout: ['width', 'height', 'top', 'left', 'right', 'bottom'],
    paint: ['background-color', 'color', 'box-shadow', 'border-radius'],
    composite: ['z-index', 'position']
  },

  // Frame rate targets
  frameRateTargets: {
    premium: 120, // High-end devices
    highEnd: 60,  // Standard target
    midRange: 30, // Mid-range devices
    lowEnd: 15    // Low-end devices
  },

  // Performance budgets
  budgets: {
    maxAnimations: {
      premium: 20,
      highEnd: 12,
      midRange: 6,
      lowEnd: 3
    },
    maxParticles: {
      premium: 500,
      highEnd: 200,
      midRange: 50,
      lowEnd: 10
    },
    maxComplexity: {
      premium: 1.0,
      highEnd: 0.8,
      midRange: 0.5,
      lowEnd: 0.2
    }
  }
} as const;

// Performance monitoring system
export const PERFORMANCE_MONITORING_STANDARDS = {
  // Metrics collection
  metrics: {
    fps: {
      enabled: true,
      sampleRate: 60, // samples per second
      alertThreshold: 30,
      criticalThreshold: 15
    },
    memory: {
      enabled: true,
      sampleRate: 1, // samples per second
      alertThreshold: 50 * 1024 * 1024, // 50MB
      criticalThreshold: 100 * 1024 * 1024 // 100MB
    },
    interaction: {
      enabled: true,
      measureFirstInput: true,
      measureLargestContentfulPaint: true,
      measureCumulativeLayoutShift: true
    },
    render: {
      enabled: true,
      measurePaintTiming: true,
      measureLayoutThrashing: true,
      measureReflows: true
    }
  },

  // Performance alerts
  alerts: {
    enabled: true,
    console: true,
    visual: false, // Don't show visual alerts in production
    reporting: true,
    thresholds: {
      fps: 30,
      memory: 50 * 1024 * 1024,
      interactionDelay: 100,
      renderTime: 16.67 // 60fps budget
    }
  },

  // Data collection
  collection: {
    enabled: true,
    batchSize: 100,
    flushInterval: 30000, // 30 seconds
    maxStorageSize: 1024 * 1024, // 1MB
    compression: true
  }
} as const;

// Device capability detection
export const DEVICE_CAPABILITY_DETECTION = {
  // Hardware detection
  hardware: {
    // CPU cores estimation
    cpuCores: () => navigator.hardwareConcurrency || 4,

    // Memory estimation
    memory: () => (navigator as any).deviceMemory || 4,

    // GPU detection
    gpu: () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return 'none';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    },

    // Network connection
    connection: () => (navigator as any).connection || { effectiveType: '4g' }
  },

  // Performance benchmarks
  benchmarks: {
    // Simple animation benchmark
    animationBenchmark: () => {
      return new Promise<number>((resolve) => {
        const element = document.createElement('div');
        element.style.position = 'absolute';
        element.style.left = '-1000px';
        element.style.width = '100px';
        element.style.height = '100px';
        element.style.backgroundColor = 'red';
        document.body.appendChild(element);

        let frames = 0;
        const startTime = performance.now();

        const animate = () => {
          frames++;
          element.style.transform = `translateX(${Math.sin(frames * 0.1) * 100}px)`;

          if (frames < 60) {
            requestAnimationFrame(animate);
          } else {
            const endTime = performance.now();
            const fps = 60000 / (endTime - startTime);
            document.body.removeChild(element);
            resolve(fps);
          }
        };

        requestAnimationFrame(animate);
      });
    },

    // Memory allocation benchmark
    memoryBenchmark: () => {
      const startMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const arrays = [];

      // Allocate memory
      for (let i = 0; i < 1000; i++) {
        arrays.push(new Array(1000).fill(Math.random()));
      }

      const peakMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // Clean up
      arrays.length = 0;

      return peakMemory - startMemory;
    }
  },

  // Device classification
  classification: {
    classify: async (): Promise<DeviceCapability> => {
      const cores = DEVICE_CAPABILITY_DETECTION.hardware.cpuCores();
      const memory = DEVICE_CAPABILITY_DETECTION.hardware.memory();
      const gpu = DEVICE_CAPABILITY_DETECTION.hardware.gpu();
      const animationFps = await DEVICE_CAPABILITY_DETECTION.benchmarks.animationBenchmark();

      // Scoring system
      let score = 0;

      // CPU score
      if (cores >= 8) score += 3;
      else if (cores >= 4) score += 2;
      else if (cores >= 2) score += 1;

      // Memory score
      if (memory >= 8) score += 3;
      else if (memory >= 4) score += 2;
      else if (memory >= 2) score += 1;

      // GPU score
      if (gpu.includes('RTX') || gpu.includes('GTX') || gpu.includes('Radeon')) score += 3;
      else if (gpu.includes('Intel') && !gpu.includes('HD')) score += 2;
      else if (gpu !== 'none') score += 1;

      // Animation performance score
      if (animationFps >= 55) score += 3;
      else if (animationFps >= 30) score += 2;
      else if (animationFps >= 15) score += 1;

      // Classification
      if (score >= 10) return 'premium';
      if (score >= 7) return 'highEnd';
      if (score >= 4) return 'midRange';
      return 'lowEnd';
    }
  }
} as const;

// Optimization strategies
export const OPTIMIZATION_STRATEGIES = {
  // Animation optimizations
  animations: {
    // Reduce animation complexity based on device
    reduceComplexity: (capability: DeviceCapability) => {
      const budget = ANIMATION_PERFORMANCE_STANDARDS.budgets;
      return {
        maxAnimations: budget.maxAnimations[capability],
        maxParticles: budget.maxParticles[capability],
        complexityScale: budget.maxComplexity[capability],
        useGPU: capability !== 'lowEnd',
        enableBlur: capability === 'premium' || capability === 'highEnd',
        enableShadows: capability !== 'lowEnd'
      };
    },

    // Create optimized animation configs
    createOptimizedAnimation: (baseAnimation: any, capability: DeviceCapability) => {
      const optimizations = OPTIMIZATION_STRATEGIES.animations.reduceComplexity(capability);

      return {
        ...baseAnimation,
        transition: {
          ...baseAnimation.transition,
          duration: baseAnimation.transition?.duration * optimizations.complexityScale,
          ease: capability === 'lowEnd' ? 'linear' : baseAnimation.transition?.ease
        },
        style: {
          ...baseAnimation.style,
          willChange: optimizations.useGPU ? 'transform, opacity' : 'auto',
          filter: optimizations.enableBlur ? baseAnimation.style?.filter : 'none',
          boxShadow: optimizations.enableShadows ? baseAnimation.style?.boxShadow : 'none'
        }
      };
    }
  },

  // Rendering optimizations
  rendering: {
    // Virtual scrolling configuration
    virtualScrolling: {
      enabled: true,
      itemHeight: 50,
      overscan: 5,
      threshold: 100 // Enable for lists > 100 items
    },

    // Component memoization
    memoization: {
      enabled: true,
      maxCacheSize: 100,
      ttl: 300000, // 5 minutes
      keyStrategy: 'shallow' // 'shallow' | 'deep'
    },

    // Re-rendering optimization
    rerendering: {
      batchUpdates: true,
      debounceMs: 16, // ~60fps
      useTransition: true,
      prioritizeVisible: true
    }
  },

  // Memory optimizations
  memory: {
    // Garbage collection hints
    garbageCollection: {
      forceGC: () => {
        if ((window as any).gc) {
          (window as any).gc();
        }
      },

      // Memory pressure detection
      detectMemoryPressure: () => {
        const memory = (performance as any).memory;
        if (!memory) return false;

        const used = memory.usedJSHeapSize;
        const limit = memory.jsHeapSizeLimit;

        return used / limit > 0.8; // 80% threshold
      }
    },

    // Object pooling
    objectPooling: {
      enabled: true,
      maxPoolSize: 1000,
      cleanupInterval: 60000 // 1 minute
    }
  }
} as const;

// Performance utility functions
export const performanceUtils = {
  // Create performance monitor
  createPerformanceMonitor() {
    const metrics = new Map<string, number[]>();
    const alerts = new Set<string>();
    let isMonitoring = false;

    return {
      // Start monitoring
      start() {
        if (isMonitoring) return;
        isMonitoring = true;

        // FPS monitoring
        this.startFPSMonitoring();

        // Memory monitoring
        this.startMemoryMonitoring();

        // Interaction monitoring
        this.startInteractionMonitoring();
      },

      // Stop monitoring
      stop() {
        isMonitoring = false;
        metrics.clear();
        alerts.clear();
      },

      // FPS monitoring
      startFPSMonitoring() {
        let lastTime = performance.now();
        let frameCount = 0;

        const measureFPS = () => {
          if (!isMonitoring) return;

          frameCount++;
          const currentTime = performance.now();

          if (currentTime - lastTime >= 1000) {
            const fps = frameCount;
            this.recordMetric('fps', fps);

            if (fps < PERFORMANCE_MONITORING_STANDARDS.alerts.thresholds.fps) {
              this.triggerAlert('fps', `Low FPS detected: ${fps}`);
            }

            frameCount = 0;
            lastTime = currentTime;
          }

          requestAnimationFrame(measureFPS);
        };

        requestAnimationFrame(measureFPS);
      },

      // Memory monitoring
      startMemoryMonitoring() {
        const measureMemory = () => {
          if (!isMonitoring) return;

          const memory = (performance as any).memory;
          if (memory) {
            const used = memory.usedJSHeapSize;
            this.recordMetric('memory', used);

            if (used > PERFORMANCE_MONITORING_STANDARDS.alerts.thresholds.memory) {
              this.triggerAlert('memory', `High memory usage: ${(used / 1024 / 1024).toFixed(2)}MB`);
            }
          }

          setTimeout(measureMemory, 1000);
        };

        measureMemory();
      },

      // Interaction monitoring
      startInteractionMonitoring() {
        const measureInteraction = (event: Event) => {
          const startTime = performance.now();

          requestAnimationFrame(() => {
            const endTime = performance.now();
            const delay = endTime - startTime;

            this.recordMetric('interaction', delay);

            if (delay > PERFORMANCE_MONITORING_STANDARDS.alerts.thresholds.interactionDelay) {
              this.triggerAlert('interaction', `Slow interaction: ${delay.toFixed(2)}ms`);
            }
          });
        };

        ['click', 'keydown', 'scroll'].forEach(eventType => {
          document.addEventListener(eventType, measureInteraction, { passive: true });
        });
      },

      // Record metric
      recordMetric(type: string, value: number) {
        if (!metrics.has(type)) {
          metrics.set(type, []);
        }

        const values = metrics.get(type)!;
        values.push(value);

        // Keep only last 100 values
        if (values.length > 100) {
          values.shift();
        }
      },

      // Trigger alert
      triggerAlert(type: string, message: string) {
        const alertKey = `${type}-${Date.now()}`;

        if (!alerts.has(alertKey)) {
          alerts.add(alertKey);

          if (PERFORMANCE_MONITORING_STANDARDS.alerts.console) {
            console.warn(`🌌 Quantum Performance Alert [${type}]:`, message);
          }

          // Clean up old alerts
          setTimeout(() => alerts.delete(alertKey), 5000);
        }
      },

      // Get metrics
      getMetrics(type?: string) {
        if (type) {
          return metrics.get(type) || [];
        }

        return Object.fromEntries(metrics.entries());
      },

      // Get performance summary
      getSummary() {
        const summary: Record<string, any> = {};

        for (const [type, values] of metrics.entries()) {
          if (values.length > 0) {
            summary[type] = {
              current: values[values.length - 1],
              average: values.reduce((a, b) => a + b, 0) / values.length,
              min: Math.min(...values),
              max: Math.max(...values),
              samples: values.length
            };
          }
        }

        return summary;
      }
    };
  },

  // Device capability manager
  createDeviceCapabilityManager() {
    let cachedCapability: DeviceCapability | null = null;

    return {
      // Get device capability
      async getCapability(): Promise<DeviceCapability> {
        if (cachedCapability) {
          return cachedCapability;
        }

        cachedCapability = await DEVICE_CAPABILITY_DETECTION.classification.classify();

        // Store in localStorage for future sessions
        localStorage.setItem('quantum-device-capability', cachedCapability);

        return cachedCapability;
      },

      // Get cached capability
      getCachedCapability(): DeviceCapability | null {
        if (cachedCapability) {
          return cachedCapability;
        }

        const stored = localStorage.getItem('quantum-device-capability');
        if (stored && ['lowEnd', 'midRange', 'highEnd', 'premium'].includes(stored)) {
          cachedCapability = stored as DeviceCapability;
          return cachedCapability;
        }

        return null;
      },

      // Force re-detection
      async redetect(): Promise<DeviceCapability> {
        cachedCapability = null;
        localStorage.removeItem('quantum-device-capability');
        return this.getCapability();
      },

      // Get optimization settings
      async getOptimizationSettings() {
        const capability = await this.getCapability();
        return OPTIMIZATION_STRATEGIES.animations.reduceComplexity(capability);
      }
    };
  },

  // Animation optimizer
  createAnimationOptimizer() {
    const deviceManager = this.createDeviceCapabilityManager();

    return {
      // Optimize animation config
      async optimizeAnimation(animation: any) {
        const capability = await deviceManager.getCapability();
        return OPTIMIZATION_STRATEGIES.animations.createOptimizedAnimation(animation, capability);
      },

      // Check if animation should be enabled
      async shouldEnableAnimation(complexity: 'low' | 'medium' | 'high' = 'medium') {
        const capability = await deviceManager.getCapability();
        const settings = OPTIMIZATION_STRATEGIES.animations.reduceComplexity(capability);

        const complexityMap = {
          low: 0.3,
          medium: 0.6,
          high: 1.0
        };

        return complexityMap[complexity] <= settings.complexityScale;
      },

      // Get particle count limit
      async getParticleLimit() {
        const capability = await deviceManager.getCapability();
        return ANIMATION_PERFORMANCE_STANDARDS.budgets.maxParticles[capability];
      }
    };
  }
};

// Global performance manager
export const globalPerformanceManager = {
  monitor: performanceUtils.createPerformanceMonitor(),
  deviceManager: performanceUtils.createDeviceCapabilityManager(),
  animationOptimizer: performanceUtils.createAnimationOptimizer(),

  // Initialize performance monitoring
  async initialize() {
    // Start monitoring
    this.monitor.start();

    // Detect device capability
    const capability = await this.deviceManager.getCapability();
    console.log('🌌 Quantum Device Capability:', capability);

    // Apply optimizations based on capability
    const settings = await this.animationOptimizer.optimizeAnimation({});
    console.log('🌌 Quantum Optimization Settings:', settings);

    return { capability, settings };
  },

  // Get current performance status
  getStatus() {
    return {
      metrics: this.monitor.getSummary(),
      capability: this.deviceManager.getCachedCapability(),
      isMonitoring: true
    };
  }
};

// Export types
export type AnimationPerformanceStandards = typeof ANIMATION_PERFORMANCE_STANDARDS;
export type PerformanceMonitoringStandards = typeof PERFORMANCE_MONITORING_STANDARDS;
export type DeviceCapabilityDetection = typeof DEVICE_CAPABILITY_DETECTION;
