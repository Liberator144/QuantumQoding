/**
 * QuantumQonnect Star System - Shared Utilities
 * Common utility functions for all star modules
 */

import { StarConfig, StarFeature, IntegrationMessage, ConsciousnessStreamData } from './types';

/**
 * Generate a unique ID for various purposes
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Validate star configuration
 */
export function validateStarConfig(config: StarConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.name || config.name.trim() === '') {
    errors.push('Star name is required');
  }

  if (!config.version || config.version.trim() === '') {
    errors.push('Star version is required');
  }

  if (!['inner', 'middle', 'outer'].includes(config.orbit)) {
    errors.push('Star orbit must be inner, middle, or outer');
  }

  if (!config.color || config.color.trim() === '') {
    errors.push('Star color is required');
  }

  if (!config.description || config.description.trim() === '') {
    errors.push('Star description is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate star features
 */
export function validateStarFeatures(features: StarFeature[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ids = new Set<string>();
  const paths = new Set<string>();

  for (const feature of features) {
    if (!feature.id || feature.id.trim() === '') {
      errors.push('Feature ID is required');
    } else if (ids.has(feature.id)) {
      errors.push(`Duplicate feature ID: ${feature.id}`);
    } else {
      ids.add(feature.id);
    }

    if (!feature.name || feature.name.trim() === '') {
      errors.push(`Feature name is required for ${feature.id}`);
    }

    if (!feature.path || feature.path.trim() === '') {
      errors.push(`Feature path is required for ${feature.id}`);
    } else if (paths.has(feature.path)) {
      errors.push(`Duplicate feature path: ${feature.path}`);
    } else {
      paths.add(feature.path);
    }

    if (!feature.component || feature.component.trim() === '') {
      errors.push(`Feature component is required for ${feature.id}`);
    }

    if (!Array.isArray(feature.permissions)) {
      errors.push(`Feature permissions must be an array for ${feature.id}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(message: string, code?: string, details?: any) {
  return {
    error: true,
    message,
    code: code || 'UNKNOWN_ERROR',
    details: details || null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse(data: any, message?: string) {
  return {
    success: true,
    data,
    message: message || 'Operation completed successfully',
    timestamp: new Date().toISOString()
  };
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry utility for async operations
 */
export async function retry<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms...`, error);
      await sleep(delay);
      delay *= 2; // Exponential backoff
    }
  }

  throw lastError!;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Merge objects deeply
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = deepClone(target);

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key];
      const targetValue = result[key];

      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) &&
          targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } else {
        result[key] = sourceValue as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format duration in milliseconds to human readable string
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Sanitize string for use in URLs or IDs
 */
export function sanitizeString(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Create integration message
 */
export function createIntegrationMessage(
  type: string,
  source: string,
  payload: any,
  target?: string,
  metadata?: Record<string, any>
): IntegrationMessage {
  return {
    id: generateId('msg'),
    type: type as any,
    source,
    target,
    payload,
    timestamp: new Date(),
    metadata
  };
}

/**
 * Create consciousness stream data
 */
export function createConsciousnessStreamData(
  streamId: string,
  source: string,
  data: any,
  metadata?: Record<string, any>
): ConsciousnessStreamData {
  return {
    streamId,
    data,
    timestamp: new Date(),
    source,
    metadata
  };
}

/**
 * Check if a value is a valid URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a value is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Get environment variable with default value
 */
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${name} is required`);
    }
    return defaultValue;
  }
  return value;
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}