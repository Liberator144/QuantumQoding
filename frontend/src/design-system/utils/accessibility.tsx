/**
 * Accessibility Utilities - Phase 7 Implementation
 * 
 * Comprehensive accessibility utilities for ARIA support, focus management,
 * keyboard navigation, and screen reader compatibility.
 * 
 * @version 1.0.0
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';

// ARIA Utilities
export const createAriaProps = (config: {
  label?: string;
  labelledBy?: string;
  describedBy?: string;
  expanded?: boolean;
  selected?: boolean;
  checked?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  busy?: boolean;
  controls?: string;
  owns?: string;
  role?: string;
}) => {
  const ariaProps: Record<string, any> = {};
  
  if (config.label) ariaProps['aria-label'] = config.label;
  if (config.labelledBy) ariaProps['aria-labelledby'] = config.labelledBy;
  if (config.describedBy) ariaProps['aria-describedby'] = config.describedBy;
  if (config.expanded !== undefined) ariaProps['aria-expanded'] = config.expanded;
  if (config.selected !== undefined) ariaProps['aria-selected'] = config.selected;
  if (config.checked !== undefined) ariaProps['aria-checked'] = config.checked;
  if (config.disabled !== undefined) ariaProps['aria-disabled'] = config.disabled;
  if (config.hidden !== undefined) ariaProps['aria-hidden'] = config.hidden;
  if (config.live) ariaProps['aria-live'] = config.live;
  if (config.atomic !== undefined) ariaProps['aria-atomic'] = config.atomic;
  if (config.busy !== undefined) ariaProps['aria-busy'] = config.busy;
  if (config.controls) ariaProps['aria-controls'] = config.controls;
  if (config.owns) ariaProps['aria-owns'] = config.owns;
  if (config.role) ariaProps['role'] = config.role;
  
  return ariaProps;
};

// Focus Management Hook
export const useFocusManagement = () => {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(focusableElementsSelector));
  };

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((previousElement: HTMLElement | null) => {
    if (previousElement && document.contains(previousElement)) {
      previousElement.focus();
    }
  }, []);

  return {
    getFocusableElements,
    trapFocus,
    restoreFocus
  };
};

// Focus Trap Hook for Modals/Dialogs
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const { trapFocus, restoreFocus } = useFocusManagement();

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Trap focus within the container
    const cleanup = trapFocus(containerRef.current);

    return () => {
      cleanup();
      // Restore focus when trap is deactivated
      restoreFocus(previousActiveElement.current);
    };
  }, [isActive, trapFocus, restoreFocus]);

  return containerRef;
};

// Keyboard Navigation Hook
export const useKeyboardNavigation = (config: {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onHome?: () => void;
  onEnd?: () => void;
}) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        config.onEscape?.();
        break;
      case 'Enter':
        config.onEnter?.();
        break;
      case ' ':
        e.preventDefault();
        config.onSpace?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        config.onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        config.onArrowDown?.();
        break;
      case 'ArrowLeft':
        config.onArrowLeft?.();
        break;
      case 'ArrowRight':
        config.onArrowRight?.();
        break;
      case 'Home':
        e.preventDefault();
        config.onHome?.();
        break;
      case 'End':
        e.preventDefault();
        config.onEnd?.();
        break;
    }
  }, [config]);

  return { onKeyDown: handleKeyDown };
};

// Screen Reader Announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};

// Reduced Motion Detection
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High Contrast Detection
export const useHighContrast = (): boolean => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Skip Link Component Props
export const createSkipLinkProps = (targetId: string) => ({
  href: `#${targetId}`,
  className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded',
  children: 'Skip to main content'
});

// Accessible Button Props
export const createAccessibleButtonProps = (config: {
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  ariaControls?: string;
  type?: 'button' | 'submit' | 'reset';
}) => ({
  type: config.type || 'button',
  onClick: config.onClick,
  disabled: config.disabled,
  'aria-label': config.ariaLabel,
  'aria-expanded': config.ariaExpanded,
  'aria-controls': config.ariaControls,
  'aria-disabled': config.disabled
});

// Accessible Form Field Props
export const createAccessibleFieldProps = (config: {
  id: string;
  label: string;
  error?: string;
  description?: string;
  required?: boolean;
}) => {
  const fieldId = config.id;
  const labelId = `${fieldId}-label`;
  const errorId = config.error ? `${fieldId}-error` : undefined;
  const descriptionId = config.description ? `${fieldId}-description` : undefined;
  
  const describedBy = [errorId, descriptionId].filter(Boolean).join(' ');

  return {
    field: {
      id: fieldId,
      'aria-labelledby': labelId,
      'aria-describedby': describedBy || undefined,
      'aria-invalid': !!config.error,
      'aria-required': config.required
    },
    label: {
      id: labelId,
      htmlFor: fieldId
    },
    error: errorId ? {
      id: errorId,
      role: 'alert',
      'aria-live': 'polite'
    } : undefined,
    description: descriptionId ? {
      id: descriptionId
    } : undefined
  };
};

// Color Contrast Utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

export const meetsWCAGContrast = (color1: string, color2: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
  const ratio = getContrastRatio(color1, color2);
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
};

// Live Region Hook for Dynamic Content
export const useLiveRegion = () => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live', priority);
      liveRegionRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  const LiveRegion = React.memo(() => (
    <div
      ref={liveRegionRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  ));

  return { announce, LiveRegion };
};

export default {
  createAriaProps,
  useFocusManagement,
  useFocusTrap,
  useKeyboardNavigation,
  useScreenReader,
  useReducedMotion,
  useHighContrast,
  createSkipLinkProps,
  createAccessibleButtonProps,
  createAccessibleFieldProps,
  getContrastRatio,
  meetsWCAGContrast,
  useLiveRegion
};