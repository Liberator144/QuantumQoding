/**
 * Responsive Design Utilities - Phase 7 Implementation
 * 
 * Comprehensive responsive design utilities for breakpoint detection,
 * media queries, and adaptive layouts in the QuantumQoding universe.
 * 
 * @version 1.0.0
 */
import { useState, useEffect } from 'react';
import { quantumTheme } from '../theme/quantumTheme';

// Breakpoint Types
export type BreakpointKey = keyof typeof quantumTheme.breakpoints;
export type BreakpointValue = typeof quantumTheme.breakpoints[BreakpointKey];

// Device Types
export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'wide';

// Responsive Hook for Breakpoint Detection
export const useBreakpoint = (): {
  current: BreakpointKey | null;
  isAbove: (breakpoint: BreakpointKey) => boolean;
  isBelow: (breakpoint: BreakpointKey) => boolean;
  isBetween: (min: BreakpointKey, max: BreakpointKey) => boolean;
  device: DeviceType;
  width: number;
  height: number;
} => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Convert breakpoint to number
  const getBreakpointValue = (breakpoint: BreakpointKey): number => {
    return parseInt(quantumTheme.breakpoints[breakpoint].replace('px', ''));
  };

  // Get current breakpoint
  const getCurrentBreakpoint = (): BreakpointKey | null => {
    const width = windowSize.width;
    const breakpoints = Object.entries(quantumTheme.breakpoints)
      .map(([key, value]) => ({ key: key as BreakpointKey, value: parseInt(value.replace('px', '')) }))
      .sort((a, b) => b.value - a.value);

    for (const { key, value } of breakpoints) {
      if (width >= value) {
        return key;
      }
    }
    return null;
  };

  // Check if above breakpoint
  const isAbove = (breakpoint: BreakpointKey): boolean => {
    return windowSize.width >= getBreakpointValue(breakpoint);
  };

  // Check if below breakpoint
  const isBelow = (breakpoint: BreakpointKey): boolean => {
    return windowSize.width < getBreakpointValue(breakpoint);
  };

  // Check if between breakpoints
  const isBetween = (min: BreakpointKey, max: BreakpointKey): boolean => {
    const width = windowSize.width;
    return width >= getBreakpointValue(min) && width < getBreakpointValue(max);
  };

  // Determine device type
  const getDeviceType = (): DeviceType => {
    const width = windowSize.width;
    if (width < getBreakpointValue('sm')) return 'mobile';
    if (width < getBreakpointValue('lg')) return 'tablet';
    if (width < getBreakpointValue('2xl')) return 'desktop';
    return 'wide';
  };

  return {
    current: getCurrentBreakpoint(),
    isAbove,
    isBelow,
    isBetween,
    device: getDeviceType(),
    width: windowSize.width,
    height: windowSize.height
  };
};

// Media Query Generator
export const createMediaQuery = (breakpoint: BreakpointKey, type: 'min' | 'max' = 'min'): string => {
  const value = quantumTheme.breakpoints[breakpoint];
  return `@media (${type}-width: ${value})`;
};

// Responsive Value Hook
export const useResponsiveValue = <T>(values: {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}): T | undefined => {
  const { current } = useBreakpoint();
  
  if (!current) return values.xs;
  
  // Find the appropriate value based on current breakpoint
  const breakpointOrder: BreakpointKey[] = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = breakpointOrder.indexOf(current);
  
  // Look for the value at current breakpoint or the closest smaller one
  for (let i = currentIndex; i >= 0; i--) {
    const breakpoint = breakpointOrder[i];
    if (values[breakpoint] !== undefined) {
      return values[breakpoint];
    }
  }
  
  return values.xs;
};

// Responsive Grid System
export interface GridProps {
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
  gap?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}

export const useResponsiveGrid = (props: GridProps) => {
  const columns = useResponsiveValue(props.columns || { xs: 1, sm: 2, md: 3, lg: 4 });
  const gap = useResponsiveValue(props.gap || { xs: '1rem', sm: '1.5rem', md: '2rem' });
  
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap
  };
};

// Responsive Typography
export const useResponsiveTypography = (config: {
  fontSize?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  lineHeight?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}) => {
  const fontSize = useResponsiveValue(config.fontSize || { xs: '1rem', md: '1.125rem', lg: '1.25rem' });
  const lineHeight = useResponsiveValue(config.lineHeight || { xs: '1.5', md: '1.6', lg: '1.7' });
  
  return {
    fontSize,
    lineHeight
  };
};

// Responsive Spacing
export const useResponsiveSpacing = (config: {
  padding?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
  margin?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
  };
}) => {
  const padding = useResponsiveValue(config.padding);
  const margin = useResponsiveValue(config.margin);
  
  return {
    padding,
    margin
  };
};

// Orientation Detection
export const useOrientation = (): 'portrait' | 'landscape' => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    
    updateOrientation();
    window.addEventListener('resize', updateOrientation);
    
    return () => window.removeEventListener('resize', updateOrientation);
  }, []);
  
  return orientation;
};

// Touch Device Detection
export const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    checkTouchDevice();
  }, []);
  
  return isTouchDevice;
};

// Responsive Container Queries (for modern browsers)
export const useContainerQuery = (containerRef: React.RefObject<HTMLElement>) => {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    
    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [containerRef]);
  
  return containerSize;
};

// Responsive Image Hook
export const useResponsiveImage = (sources: {
  xs?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}) => {
  const imageSrc = useResponsiveValue(sources);
  const { device } = useBreakpoint();
  
  return {
    src: imageSrc,
    device,
    // Generate srcSet for better performance
    srcSet: Object.entries(sources)
      .map(([breakpoint, src]) => `${src} ${quantumTheme.breakpoints[breakpoint as BreakpointKey]}`)
      .join(', ')
  };
};

export default {
  useBreakpoint,
  createMediaQuery,
  useResponsiveValue,
  useResponsiveGrid,
  useResponsiveTypography,
  useResponsiveSpacing,
  useOrientation,
  useTouchDevice,
  useContainerQuery,
  useResponsiveImage
};