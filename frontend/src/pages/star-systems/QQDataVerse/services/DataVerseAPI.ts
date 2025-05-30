/**
 * DataVerse API Service - GitHub Integration and Analytics
 * Handles all API calls for the QQ-DataVerse star system
 * 
 * @version 1.0.0
 */

import { Repository, AnalyticsData, VisualizationConfig, CodeInsight, PerformanceMetric } from '../types/DataVerseTypes';

export class DataVerseAPI {
    private baseURL: string;
    private apiKey: string | null;
    private isDevelopmentMode: boolean;

    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        this.apiKey = localStorage.getItem('qq_api_key');
        this.isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_API_URL;
    }

    /**
     * Get authentication headers
     */
    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.apiKey) {
            headers['Authorization'] = `Bearer ${this.apiKey}`;
        }

        return headers;
    }

    /**
     * Make API request with error handling
     */
    private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        // Return mock data in development mode when backend is not available
        if (this.isDevelopmentMode) {
            return this.getMockData<T>(endpoint);
        }

        try {
            const response = await fetch(`${this.baseURL}/api/dataverse${endpoint}`, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers,
                },
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('DataVerse API Error:', error);
            // Fallback to mock data if API fails
            if (process.env.NODE_ENV === 'development') {
                console.log('Falling back to mock data for development');
                return this.getMockData<T>(endpoint);
            }
            throw error;
        }
    }

    /**
     * Get mock data for development mode
     */
    private getMockData<T>(endpoint: string): Promise<T> {
        const mockData: Record<string, any> = {
            '/metrics': {
                totalRepositories: 42,
                totalCommits: 1337,
                totalContributors: 24,
                codeQuality: 95,
                lastUpdated: new Date().toISOString(),
                trends: {
                    commits: [120, 135, 142, 158, 167, 175, 189],
                    quality: [92, 93, 94, 95, 95, 95, 95],
                    contributors: [20, 21, 22, 23, 24, 24, 24]
                }
            },
            '/repositories': [
                {
                    id: 'repo-1',
                    name: 'QuantumQoding',
                    description: 'Revolutionary quantum-coherent development platform',
                    stars: 1024,
                    forks: 256,
                    language: 'TypeScript',
                    lastCommit: new Date().toISOString()
                },
                {
                    id: 'repo-2',
                    name: 'QQ-DataVerse',
                    description: 'Advanced data analytics and visualization system',
                    stars: 512,
                    forks: 128,
                    language: 'React',
                    lastCommit: new Date().toISOString()
                }
            ],
            '/analytics': {
                codeMetrics: {
                    linesOfCode: 50000,
                    testCoverage: 95,
                    complexity: 'Low',
                    maintainability: 'High'
                },
                performance: {
                    buildTime: '2.3s',
                    bundleSize: '1.2MB',
                    loadTime: '0.8s'
                }
            }
        };

        // Simulate API delay
        return new Promise((resolve) => {
            setTimeout(() => {
                const data = mockData[endpoint] || { message: 'Mock data not available for this endpoint' };
                resolve(data as T);
            }, 500);
        });
    }

    /**
     * Get list of repositories
     */
    async getRepositories(): Promise<Repository[]> {
        return this.makeRequest<Repository[]>('/repositories');
    }

    /**
     * Get repository analysis
     */
    async analyzeRepository(repositoryId: string): Promise<AnalyticsData> {
        return this.makeRequest<AnalyticsData>(`/repositories/${repositoryId}/analysis`);
    }

    /**
     * Get available visualizations
     */
    async getVisualizations(): Promise<VisualizationConfig[]> {
        return this.makeRequest<VisualizationConfig[]>('/visualizations');
    }

    /**
     * Get star metrics
     */
    async getStarMetrics(): Promise<any> {
        return this.makeRequest<any>('/metrics');
    }

    /**
     * Get code insights for a repository
     */
    async getCodeInsights(repositoryId: string): Promise<CodeInsight[]> {
        return this.makeRequest<CodeInsight[]>(`/insights/${repositoryId}`);
    }

    /**
     * Get performance metrics
     */
    async getPerformanceMetrics(repositoryId?: string): Promise<PerformanceMetric[]> {
        const endpoint = repositoryId ? `/performance/${repositoryId}` : '/performance';
        return this.makeRequest<PerformanceMetric[]>(endpoint);
    }

    /**
     * Search repositories
     */
    async searchRepositories(query: string): Promise<Repository[]> {
        return this.makeRequest<Repository[]>(`/repositories/search?q=${encodeURIComponent(query)}`);
    }

    /**
     * Get repository commits
     */
    async getRepositoryCommits(repositoryId: string, limit: number = 50): Promise<any[]> {
        return this.makeRequest<any[]>(`/repositories/${repositoryId}/commits?limit=${limit}`);
    }

    /**
     * Get repository contributors
     */
    async getRepositoryContributors(repositoryId: string): Promise<any[]> {
        return this.makeRequest<any[]>(`/repositories/${repositoryId}/contributors`);
    }

    /**
     * Get repository languages
     */
    async getRepositoryLanguages(repositoryId: string): Promise<Record<string, number>> {
        return this.makeRequest<Record<string, number>>(`/repositories/${repositoryId}/languages`);
    }

    /**
     * Get repository issues
     */
    async getRepositoryIssues(repositoryId: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<any[]> {
        return this.makeRequest<any[]>(`/repositories/${repositoryId}/issues?state=${state}`);
    }

    /**
     * Get repository pull requests
     */
    async getRepositoryPullRequests(repositoryId: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<any[]> {
        return this.makeRequest<any[]>(`/repositories/${repositoryId}/pulls?state=${state}`);
    }

    /**
     * Get repository statistics
     */
    async getRepositoryStats(repositoryId: string): Promise<any> {
        return this.makeRequest<any>(`/repositories/${repositoryId}/stats`);
    }

    /**
     * Create visualization
     */
    async createVisualization(config: VisualizationConfig): Promise<any> {
        return this.makeRequest<any>('/visualizations', {
            method: 'POST',
            body: JSON.stringify(config),
        });
    }

    /**
     * Update visualization
     */
    async updateVisualization(id: string, config: Partial<VisualizationConfig>): Promise<any> {
        return this.makeRequest<any>(`/visualizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(config),
        });
    }

    /**
     * Delete visualization
     */
    async deleteVisualization(id: string): Promise<void> {
        return this.makeRequest<void>(`/visualizations/${id}`, {
            method: 'DELETE',
        });
    }

    /**
     * Export data
     */
    async exportData(format: 'json' | 'csv' | 'xlsx', filters?: any): Promise<Blob> {
        const response = await fetch(`${this.baseURL}/api/dataverse/export?format=${format}`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(filters || {}),
        });

        if (!response.ok) {
            throw new Error(`Export failed: ${response.status} ${response.statusText}`);
        }

        return response.blob();
    }

    /**
     * Get real-time metrics (WebSocket connection)
     */
    connectToRealTimeMetrics(onMessage: (data: any) => void, onError?: (error: Event) => void): WebSocket {
        const wsUrl = this.baseURL.replace('http', 'ws') + '/api/dataverse/metrics/realtime';
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                onMessage(data);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            if (onError) {
                onError(error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return ws;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        return this.makeRequest<{ status: string; timestamp: string }>('/health');
    }
}
