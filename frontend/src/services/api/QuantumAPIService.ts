/**
 * Quantum API Service
 * 
 * Comprehensive service for communicating with the QQ-Verse backend API.
 * Provides methods for all quantum, dimensional, neural, and consciousness operations.
 * 
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  ConsciousnessPacket,
  Dimension,
  DimensionalBoundary,
  NeuralFabric,
  QuantumState,
  BoundaryState,
  BoundaryType,
  NeuralNodeType,
  NeuralConnectionType
} from '../../types/backend-types';

// API Response Types
interface APIResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  timestamp: number;
}

interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Configuration
interface APIConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  retryDelay: number;
}

class QuantumAPIService {
  private api: AxiosInstance;
  private config: APIConfig;
  private authToken: string | null = null;

  constructor(config?: Partial<APIConfig>) {
    this.config = {
      baseURL: process.env.VITE_BACKEND_URL || `http://localhost:${process.env.VITE_BACKEND_PORT || '3001'}`,
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config
    };

    this.api = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for request/response handling
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Handle token refresh logic here if needed
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Generic API request method with retry logic
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    retries = this.config.retries
  ): Promise<T> {
    try {
      const response: AxiosResponse<APIResponse<T>> = await this.api.request({
        method,
        url: endpoint,
        data,
      });

      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'API request failed');
      }

      return response.data.data as T;
    } catch (error: any) {
      if (retries > 0 && this.shouldRetry(error)) {
        await this.delay(this.config.retryDelay);
        return this.request<T>(method, endpoint, data, retries - 1);
      }
      throw this.handleError(error);
    }
  }

  /**
   * Check if request should be retried
   */
  private shouldRetry(error: any): boolean {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.code === 'TIMEOUT' ||
      (error.response?.status >= 500 && error.response?.status < 600)
    );
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Handle and format API errors
   */
  private handleError(error: any): APIError {
    const apiError: APIError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      timestamp: Date.now(),
    };

    if (error.response?.data) {
      apiError.details = error.response.data;
      apiError.message = error.response.data.message || apiError.message;
    }

    return apiError;
  }

  // ============================================================================
  // HEALTH & STATUS ENDPOINTS
  // ============================================================================

  /**
   * Check API health status
   */
  async getHealth(): Promise<{ status: string; timestamp: number }> {
    return this.request('GET', '/api/health');
  }

  /**
   * Get API status and metrics
   */
  async getStatus(): Promise<any> {
    return this.request('GET', '/api/status');
  }

  // ============================================================================
  // QUANTUM STATE ENDPOINTS
  // ============================================================================

  /**
   * Get all quantum states
   */
  async getQuantumStates(): Promise<QuantumState[]> {
    return this.request('GET', '/api/v1/quantum/states');
  }

  /**
   * Get quantum state by ID
   */
  async getQuantumState(id: string): Promise<QuantumState> {
    return this.request('GET', `/api/v1/quantum/states/${id}`);
  }

  /**
   * Create new quantum state
   */
  async createQuantumState(state: Partial<QuantumState>): Promise<QuantumState> {
    return this.request('POST', '/api/v1/quantum/states', state);
  }

  /**
   * Update quantum state
   */
  async updateQuantumState(id: string, updates: Partial<QuantumState>): Promise<QuantumState> {
    return this.request('PUT', `/api/v1/quantum/states/${id}`, updates);
  }

  /**
   * Delete quantum state
   */
  async deleteQuantumState(id: string): Promise<void> {
    return this.request('DELETE', `/api/v1/quantum/states/${id}`);
  }

  // ============================================================================
  // DIMENSIONAL ENDPOINTS
  // ============================================================================

  /**
   * Get all dimensions
   */
  async getDimensions(): Promise<Dimension[]> {
    return this.request('GET', '/api/v1/dimensional/dimensions');
  }

  /**
   * Get dimension by ID
   */
  async getDimension(id: string): Promise<Dimension> {
    return this.request('GET', `/api/v1/dimensional/dimensions/${id}`);
  }

  /**
   * Create new dimension
   */
  async createDimension(dimension: Partial<Dimension>): Promise<Dimension> {
    return this.request('POST', '/api/v1/dimensional/dimensions', dimension);
  }

  /**
   * Update dimension
   */
  async updateDimension(id: string, updates: Partial<Dimension>): Promise<Dimension> {
    return this.request('PUT', `/api/v1/dimensional/dimensions/${id}`, updates);
  }

  /**
   * Delete dimension
   */
  async deleteDimension(id: string): Promise<void> {
    return this.request('DELETE', `/api/v1/dimensional/dimensions/${id}`);
  }

  /**
   * Get all dimensional boundaries
   */
  async getDimensionalBoundaries(): Promise<DimensionalBoundary[]> {
    return this.request('GET', '/api/v1/dimensional/boundaries');
  }

  /**
   * Get dimensional boundary by ID
   */
  async getDimensionalBoundary(id: string): Promise<DimensionalBoundary> {
    return this.request('GET', `/api/v1/dimensional/boundaries/${id}`);
  }

  /**
   * Create new dimensional boundary
   */
  async createDimensionalBoundary(boundary: Partial<DimensionalBoundary>): Promise<DimensionalBoundary> {
    return this.request('POST', '/api/v1/dimensional/boundaries', boundary);
  }

  /**
   * Cross dimensional boundary
   */
  async crossBoundary(boundaryId: string, data: any): Promise<any> {
    return this.request('POST', `/api/v1/dimensional/boundaries/${boundaryId}/cross`, data);
  }

  // ============================================================================
  // NEURAL FABRIC ENDPOINTS
  // ============================================================================

  /**
   * Get neural fabric
   */
  async getNeuralFabric(): Promise<NeuralFabric> {
    return this.request('GET', '/api/v1/neural-fabric');
  }

  /**
   * Create new neural fabric
   */
  async createNeuralFabric(fabric: Partial<NeuralFabric>): Promise<NeuralFabric> {
    return this.request('POST', '/api/v1/neural-fabric', fabric);
  }

  /**
   * Get all neural nodes
   */
  async getNeuralNodes(): Promise<any[]> {
    return this.request('GET', '/api/v1/neural-fabric/nodes');
  }

  /**
   * Get neural node by ID
   */
  async getNeuralNode(id: string): Promise<any> {
    return this.request('GET', `/api/v1/neural-fabric/nodes/${id}`);
  }

  /**
   * Create new neural node
   */
  async createNeuralNode(node: any): Promise<any> {
    return this.request('POST', '/api/v1/neural-fabric/nodes', node);
  }

  /**
   * Get all neural connections
   */
  async getNeuralConnections(): Promise<any[]> {
    return this.request('GET', '/api/v1/neural-fabric/connections');
  }

  /**
   * Create new neural connection
   */
  async createNeuralConnection(connection: any): Promise<any> {
    return this.request('POST', '/api/v1/neural-fabric/connections', connection);
  }

  /**
   * Synchronize quantum states through neural fabric
   */
  async synchronizeQuantumStates(data: any): Promise<any> {
    return this.request('POST', '/api/v1/neural-fabric/synchronize-quantum-states', data);
  }

  /**
   * Propagate consciousness through neural fabric
   */
  async propagateConsciousness(data: any): Promise<any> {
    return this.request('POST', '/api/v1/neural-fabric/propagate-consciousness', data);
  }

  // ============================================================================
  // CONSCIOUSNESS STREAM ENDPOINTS
  // ============================================================================

  /**
   * Get all consciousness streams
   */
  async getConsciousnessStreams(): Promise<any[]> {
    return this.request('GET', '/api/v1/consciousness/streams');
  }

  /**
   * Get consciousness stream by ID
   */
  async getConsciousnessStream(id: string): Promise<any> {
    return this.request('GET', `/api/v1/consciousness/streams/${id}`);
  }

  /**
   * Create new consciousness stream
   */
  async createConsciousnessStream(stream: any): Promise<any> {
    return this.request('POST', '/api/v1/consciousness/streams', stream);
  }

  /**
   * Get consciousness packets
   */
  async getConsciousnessPackets(streamId?: string): Promise<ConsciousnessPacket[]> {
    const endpoint = streamId 
      ? `/api/v1/consciousness/streams/${streamId}/packets`
      : '/api/v1/consciousness/packets';
    return this.request('GET', endpoint);
  }

  /**
   * Send consciousness packet
   */
  async sendConsciousnessPacket(packet: Partial<ConsciousnessPacket>): Promise<ConsciousnessPacket> {
    return this.request('POST', '/api/v1/consciousness/packets', packet);
  }

  /**
   * Process consciousness packet
   */
  async processConsciousnessPacket(packetId: string, data: any): Promise<any> {
    return this.request('POST', `/api/v1/consciousness/packets/${packetId}/process`, data);
  }

  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================

  /**
   * Register new user
   */
  async register(userData: { email: string; password: string; name: string }): Promise<any> {
    const response = await this.request('POST', '/api/v1/auth/register', userData);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  /**
   * Login user
   */
  async login(credentials: { email: string; password: string }): Promise<any> {
    const response = await this.request('POST', '/api/v1/auth/login', credentials);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.request('POST', '/api/v1/auth/logout');
    this.clearAuthToken();
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<any> {
    return this.request('GET', '/api/v1/auth/me');
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getHealth();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API configuration
   */
  getConfig(): APIConfig {
    return { ...this.config };
  }

  /**
   * Update API configuration
   */
  updateConfig(newConfig: Partial<APIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.api.defaults.baseURL = this.config.baseURL;
    this.api.defaults.timeout = this.config.timeout;
  }
}

// Create and export singleton instance
export const quantumAPI = new QuantumAPIService();

// Export class for custom instances
export default QuantumAPIService;