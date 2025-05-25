/**
 * API Types
 * 
 * This module provides type definitions for API interactions.
 * 
 * @version 1.0.0
 */

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * API request options interface
 */
export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  signal?: AbortSignal;
}

/**
 * API pagination options interface
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * API filter options interface
 */
export interface FilterOptions {
  [key: string]: any;
}

/**
 * API search options interface
 */
export interface SearchOptions {
  query?: string;
  fields?: string[];
}

/**
 * API error interface
 */
export interface ApiError {
  code: string;
  message: string;
  status: number;
  details?: any;
}

/**
 * API client configuration interface
 */
export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  interceptors?: {
    request?: (config: any) => any;
    response?: (response: any) => any;
    error?: (error: any) => any;
  };
}

/**
 * API cache options interface
 */
export interface ApiCacheOptions {
  enabled: boolean;
  ttl: number;
  maxSize?: number;
  invalidateOn?: string[];
}

/**
 * API rate limit info interface
 */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * API consciousness context interface
 */
export interface ApiConsciousnessContext {
  streamId: string;
  packetId: string;
  sourceId: string;
  targetId: string;
  preserveQuantumState: boolean;
  preserveContext: boolean;
}