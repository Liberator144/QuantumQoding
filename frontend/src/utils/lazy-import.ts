/**
 * Lazy Import Utilities
 * 
 * This module provides utilities for lazy loading components and modules.
 * 
 * @version 1.0.0
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Lazy load a component with improved error handling and naming
 * @param importFn - Import function that returns a promise of a module with a default export
 * @param displayName - Display name for the component (useful for debugging)
 * @returns Lazy loaded component
 */
export function lazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  displayName: string
): LazyExoticComponent<T> {
  const LazyComponent = lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.error(`Error loading component ${displayName}:`, error);
      throw error;
    }
  });
  
  // Set display name for debugging
  LazyComponent.displayName = `Lazy(${displayName})`;
  
  return LazyComponent;
}

/**
 * Lazy load a module with improved error handling
 * @param importFn - Import function that returns a promise of a module
 * @param moduleName - Module name for error reporting
 * @returns Promise that resolves to the module
 */
export async function lazyModule<T>(
  importFn: () => Promise<T>,
  moduleName: string
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    console.error(`Error loading module ${moduleName}:`, error);
    throw error;
  }
}

/**
 * Preload a component to improve perceived performance
 * @param importFn - Import function that returns a promise of a module with a default export
 */
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): void {
  // Start loading the component in the background
  importFn().catch(error => {
    // Silently catch errors during preloading
    console.debug('Error preloading component:', error);
  });
}

/**
 * Preload multiple components in parallel
 * @param importFns - Array of import functions
 */
export function preloadComponents(
  importFns: Array<() => Promise<{ default: ComponentType<any> }>>
): void {
  // Start loading all components in parallel
  Promise.all(importFns.map(fn => fn())).catch(error => {
    // Silently catch errors during preloading
    console.debug('Error preloading components:', error);
  });
}
