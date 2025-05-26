/**
 * API Types
 *
 * This module provides type definitions for API interactions.
 *
 * @version 1.0.0
 */

// Base API Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: Date;
  requestId: string;
  quantumSignature?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  requestId: string;
  quantumTrace?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Request Types
export interface ApiRequest {
  method: HttpMethod;
  url: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
  retries?: number;
  quantumCoherence?: boolean;
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export interface RequestConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
  quantumMode: boolean;
}

// Authentication Types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: 'Bearer' | 'Quantum';
}

export interface AuthRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  quantumEntanglement?: boolean;
}

// Quantum API Types
export interface QuantumApiRequest extends ApiRequest {
  coherenceLevel: number;
  dimensionalState: DimensionalState;
  entanglementId?: string;
}

export interface QuantumApiResponse<T = unknown> extends ApiResponse<T> {
  quantumMetadata: QuantumMetadata;
}

export interface QuantumMetadata {
  coherenceLevel: number;
  entanglementStatus: boolean;
  dimensionalPhase: number;
  quantumSignature: string;
  timestamp: Date;
}

export enum DimensionalState {
  STABLE = 'stable',
  TRANSITIONING = 'transitioning',
  SUPERPOSITION = 'superposition',
  ENTANGLED = 'entangled'
}

// WebSocket Types
export interface WebSocketMessage {
  type: MessageType;
  payload: unknown;
  timestamp: Date;
  id: string;
  quantumChannel?: string;
}

export enum MessageType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  MESSAGE = 'message',
  ERROR = 'error',
  PING = 'ping',
  PONG = 'pong',
  QUANTUM_SYNC = 'quantum_sync'
}

// Type Guards
export const isApiResponse = <T>(obj: unknown): obj is ApiResponse<T> => {
  return typeof obj === 'object' && obj !== null && 
         'data' in obj && 'success' in obj && 'timestamp' in obj;
};

export const isApiError = (obj: unknown): obj is ApiError => {
  return typeof obj === 'object' && obj !== null && 
         'code' in obj && 'message' in obj && 'timestamp' in obj;
};

export const isQuantumApiResponse = <T>(obj: unknown): obj is QuantumApiResponse<T> => {
  return isApiResponse(obj) && 'quantumMetadata' in obj;
};