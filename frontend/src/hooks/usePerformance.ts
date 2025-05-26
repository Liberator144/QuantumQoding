/**
 * Quantum Performance Optimization Hooks
 * Performance monitoring and optimization utilities
 * @version 1.0.0
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

// Hook for animation performance optimization
export const useAnimationPerformance = () => {
  const [frameRate, setFrameRate] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    let animationId: number;
    
    const measureFrameRate = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      if (now - lastTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current));
        setFrameRate(fps);
        setIsLowPerformance(fps < 30);
        
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      
      animationId = requestAnimationFrame(measureFrameRate);
    };

    animationId = requestAnimationFrame(measureFrameRate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const getOptimizedAnimationProps = useCallback((baseProps: any) => {
    if (shouldReduceMotion || isLowPerformance) {
      return {
        ...baseProps,
        transition: { duration: 0.1 },
        animate: { opacity: 1 }
      };
    }
    return baseProps;
  }, [shouldReduceMotion, isLowPerformance]);

  const shouldDisableComplexAnimations = isLowPerformance || shouldReduceMotion;

  return {
    frameRate,
    isLowPerformance,
    shouldDisableComplexAnimations,
    getOptimizedAnimationProps
  };
};

// Hook for efficient rendering with virtual scrolling
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    return {
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1).map((item, index) => ({
      item,
      index: visibleRange.start + index
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    scrollElementRef
  };
};

// Hook for performance metrics collection
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    interactionTime: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  const startRenderMeasurement = useCallback(() => {
    return performance.now();
  }, []);

  const endRenderMeasurement = useCallback((startTime: number, componentName: string) => {
    const renderTime = performance.now() - startTime;
    
    setMetrics(prev => ({
      ...prev,
      renderTime: Math.max(prev.renderTime, renderTime)
    }));

    // Log slow renders
    if (renderTime > 16) {
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, []);

  const measureInteraction = useCallback((callback: () => void, actionName: string) => {
    const startTime = performance.now();
    callback();
    const interactionTime = performance.now() - startTime;
    
    setMetrics(prev => ({
      ...prev,
      interactionTime: Math.max(prev.interactionTime, interactionTime)
    }));

    if (interactionTime > 100) {
      console.warn(`Slow interaction detected in ${actionName}: ${interactionTime.toFixed(2)}ms`);
    }
  }, []);

  const getMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576),
        total: Math.round(memory.totalJSHeapSize / 1048576),
        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }, []);

  useEffect(() => {
    const updateMemoryUsage = () => {
      const memory = getMemoryUsage();
      if (memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.used
        }));
      }
    };

    const interval = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [getMemoryUsage]);

  return {
    metrics,
    startRenderMeasurement,
    endRenderMeasurement,
    measureInteraction,
    getMemoryUsage
  };
};

// Hook for device capability detection
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    deviceMemory: 4,
    hardwareConcurrency: 4,
    connectionType: 'unknown',
    isLowEndDevice: false,
    supportedFeatures: {
      webGL: false,
      webGL2: false,
      canvas: false,
      css3d: false
    }
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // Device memory
      const deviceMemory = (navigator as any).deviceMemory || 4;
      
      // Hardware concurrency
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      
      // Connection type
      const connection = (navigator as any).connection;
      const connectionType = connection?.effectiveType || 'unknown';
      
      // Low-end device detection
      const isLowEndDevice = deviceMemory <= 2 || hardwareConcurrency <= 2;
      
      // Feature detection
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const gl2 = canvas.getContext('webgl2');
      
      const supportedFeatures = {
        webGL: !!gl,
        webGL2: !!gl2,
        canvas: !!canvas.getContext('2d'),
        css3d: CSS.supports('transform-style', 'preserve-3d')
      };

      setCapabilities({
        deviceMemory,
        hardwareConcurrency,
        connectionType,
        isLowEndDevice,
        supportedFeatures
      });
    };

    detectCapabilities();
  }, []);

  const getOptimalSettings = useCallback(() => {
    const { isLowEndDevice, supportedFeatures } = capabilities;
    
    return {
      maxParticles: isLowEndDevice ? 50 : supportedFeatures.webGL ? 200 : 100,
      enableBlur: !isLowEndDevice && supportedFeatures.css3d,
      enableShadows: !isLowEndDevice,
      animationQuality: isLowEndDevice ? 'low' : 'high',
      enableComplexGradients: !isLowEndDevice && supportedFeatures.canvas
    };
  }, [capabilities]);

  return {
    capabilities,
    getOptimalSettings
  };
};

// Hook for lazy loading heavy components
export const useLazyLoading = () => {
  const [loadedComponents, setLoadedComponents] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const componentId = entry.target.getAttribute('data-component-id');
            if (componentId) {
              setLoadedComponents(prev => new Set([...prev, componentId]));
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const registerComponent = useCallback((element: HTMLElement, componentId: string) => {
    if (observerRef.current && element) {
      element.setAttribute('data-component-id', componentId);
      observerRef.current.observe(element);
    }
  }, []);

  const isComponentLoaded = useCallback((componentId: string) => {
    return loadedComponents.has(componentId);
  }, [loadedComponents]);

  const preloadComponent = useCallback((componentId: string) => {
    setLoadedComponents(prev => new Set([...prev, componentId]));
  }, []);

  return {
    registerComponent,
    isComponentLoaded,
    preloadComponent,
    loadedComponents
  };
};

// Hook for performance-based effect toggles
export const usePerformanceToggles = () => {
  const { capabilities } = useDeviceCapabilities();
  const { isLowPerformance } = useAnimationPerformance();
  const shouldReduceMotion = useReducedMotion();

  const toggles = useMemo(() => {
    const isLowEnd = capabilities.isLowEndDevice || isLowPerformance;
    
    return {
      disableParticles: isLowEnd || shouldReduceMotion,
      disableBlur: isLowEnd || !capabilities.supportedFeatures.css3d,
      disableGradients: false, // Keep gradients as they're generally well-supported
      disableAnimations: shouldReduceMotion,
      disableShadows: isLowEnd,
      disableComplexEffects: isLowEnd || shouldReduceMotion,
      maxAnimationDuration: isLowEnd ? 200 : 1000,
      particleCount: isLowEnd ? 25 : capabilities.supportedFeatures.webGL ? 150 : 75
    };
  }, [capabilities, isLowPerformance, shouldReduceMotion]);

  return toggles;
};

// Hook for requestAnimationFrame optimization
export const useOptimizedAnimation = (callback: () => void, deps: any[] = []) => {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number>();

  useEffect(() => {
    callbackRef.current = callback;
  });

  const animate = useCallback(() => {
    callbackRef.current();
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  const start = useCallback(() => {
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const stop = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return stop;
  }, deps);

  return { start, stop };
};