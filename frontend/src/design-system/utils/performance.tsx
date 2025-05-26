/**
 * Performance Optimization Utilities - Phase 7 Implementation
 * 
 * Comprehensive performance utilities for lazy loading, code splitting,
 * animation optimization, and resource management.
 * 
 * @version 1.0.0
 */
import React, { lazy, Suspense, ComponentType, ReactNode, useEffect, useRef, useState, useCallback } from 'react';

// Lazy Loading with Error Boundary
export const createLazyComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.ComponentType<React.ComponentProps<T>> => {
  const LazyComponent = lazy(importFunc);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Intersection Observer Hook
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
): [React.RefObject<HTMLDivElement>, boolean] => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [options]);

  return [ref, isIntersecting];
};

// Lazy Image Component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}> = ({ src, alt, className = '', placeholder = '/placeholder.jpg' }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setImageSrc(src);
      setIsLoaded(true);
    }
  }, [isIntersecting, isLoaded, src]);

  return (
    <div ref={ref} className={className}>
      <img
        src={imageSrc}
        alt={alt}
        className="transition-opacity duration-300"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

// Debounce Hook
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle Hook
export const useThrottle = <T,>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + delay) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
};

// Animation Frame Hook
export const useAnimationFrame = (callback: () => void, deps: React.DependencyList) => {
  const requestRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      callback();
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
};

// Idle Callback Hook
export const useIdleCallback = (callback: () => void, deps: React.DependencyList) => {
  useEffect(() => {
    const handle = requestIdleCallback(callback);
    return () => cancelIdleCallback(handle);
  }, deps);
};

// Memory Monitor Hook
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo((performance as any).memory);
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 1000);
    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Performance Observer Hook
export const usePerformanceObserver = (entryTypes: string[]) => {
  const [entries, setEntries] = useState<PerformanceEntry[]>([]);

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        setEntries(prev => [...prev, ...list.getEntries()]);
      });

      observer.observe({ entryTypes });
      return () => observer.disconnect();
    }
  }, [entryTypes]);

  return entries;
};

// Resource Preloader
export const preloadResource = (href: string, as: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Bundle Size Analyzer
export const analyzeBundleSize = () => {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  return {
    scripts: scripts.length,
    styles: styles.length,
    totalResources: scripts.length + styles.length
  };
};

// Critical Resource Loader Hook
export const useCriticalResourceLoader = (resources: string[]) => {
  const [loadedResources, setLoadedResources] = useState<Set<string>>(new Set());

  useEffect(() => {
    resources.forEach(resource => {
      preloadResource(resource, 'script');
      setLoadedResources(prev => new Set([...prev, resource]));
    });
  }, [resources]);

  return loadedResources;
};

// Virtual Scrolling Hook
export const useVirtualScrolling = <T,>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [visibleItems, setVisibleItems] = useState<T[]>([]);

  useEffect(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );

    setVisibleItems(items.slice(startIndex, endIndex));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return { visibleItems, handleScroll };
};

// Async Component Creator
export const createAsyncComponent = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.ComponentType<React.ComponentProps<T>> => {
  return createLazyComponent(importFunc);
};