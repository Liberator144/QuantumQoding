/**
 * DataVerse Types - Type definitions for QQ-DataVerse
 * GitHub Integration and Analytics type system
 * 
 * @version 1.0.0
 */

export interface Repository {
    id: string;
    name: string;
    fullName: string;
    description?: string;
    url: string;
    htmlUrl: string;
    cloneUrl: string;
    sshUrl: string;
    language: string;
    languages: Record<string, number>;
    stargazersCount: number;
    forksCount: number;
    watchersCount: number;
    openIssuesCount: number;
    size: number;
    defaultBranch: string;
    isPrivate: boolean;
    isFork: boolean;
    isArchived: boolean;
    createdAt: string;
    updatedAt: string;
    pushedAt: string;
    owner: {
        id: string;
        login: string;
        avatarUrl: string;
        type: 'User' | 'Organization';
    };
    topics: string[];
    license?: {
        key: string;
        name: string;
        spdxId: string;
    };
}

export interface AnalyticsData {
    repository: Repository;
    metrics: {
        codeQuality: {
            score: number;
            issues: number;
            complexity: number;
            maintainability: number;
            testCoverage: number;
        };
        activity: {
            commits: number;
            contributors: number;
            pullRequests: number;
            issues: number;
            releases: number;
        };
        performance: {
            buildTime: number;
            testTime: number;
            deploymentFrequency: number;
            leadTime: number;
            mttr: number; // Mean Time To Recovery
        };
        community: {
            stars: number;
            forks: number;
            watchers: number;
            discussions: number;
            contributors: number;
        };
    };
    trends: {
        commits: TimeSeriesData[];
        issues: TimeSeriesData[];
        pullRequests: TimeSeriesData[];
        contributors: TimeSeriesData[];
    };
    insights: CodeInsight[];
    lastAnalyzed: string;
}

export interface TimeSeriesData {
    timestamp: string;
    value: number;
    label?: string;
}

export interface VisualizationConfig {
    id: string;
    name: string;
    type: 'chart' | 'graph' | 'heatmap' | 'timeline' | 'network' | 'treemap';
    chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'radar';
    dataSource: string;
    filters: Record<string, any>;
    options: {
        title: string;
        description?: string;
        width?: number;
        height?: number;
        responsive?: boolean;
        theme?: 'light' | 'dark' | 'quantum';
        colors?: string[];
        animation?: boolean;
        interactive?: boolean;
    };
    layout: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface CodeInsight {
    id: string;
    type: 'suggestion' | 'warning' | 'error' | 'info' | 'security' | 'performance';
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    file?: string;
    line?: number;
    column?: number;
    rule?: string;
    category: string;
    tags: string[];
    confidence: number; // 0-1
    impact: 'low' | 'medium' | 'high';
    effort: 'low' | 'medium' | 'high';
    suggestion?: string;
    examples?: {
        before?: string;
        after?: string;
    };
    references?: string[];
    createdAt: string;
}

export interface PerformanceMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    target?: number;
    threshold?: {
        warning: number;
        critical: number;
    };
    trend: 'up' | 'down' | 'stable';
    change: number; // percentage change
    category: 'build' | 'test' | 'deployment' | 'runtime' | 'quality';
    timestamp: string;
    metadata?: Record<string, any>;
}

export interface Contributor {
    id: string;
    login: string;
    name?: string;
    email?: string;
    avatarUrl: string;
    contributions: number;
    commits: number;
    additions: number;
    deletions: number;
    firstContribution: string;
    lastContribution: string;
    role: 'owner' | 'maintainer' | 'contributor' | 'collaborator';
}

export interface Commit {
    sha: string;
    message: string;
    author: {
        name: string;
        email: string;
        date: string;
    };
    committer: {
        name: string;
        email: string;
        date: string;
    };
    url: string;
    htmlUrl: string;
    stats?: {
        additions: number;
        deletions: number;
        total: number;
    };
    files?: {
        filename: string;
        status: 'added' | 'modified' | 'removed' | 'renamed';
        additions: number;
        deletions: number;
        changes: number;
    }[];
}

export interface Issue {
    id: number;
    number: number;
    title: string;
    body?: string;
    state: 'open' | 'closed';
    labels: {
        id: number;
        name: string;
        color: string;
        description?: string;
    }[];
    assignees: Contributor[];
    milestone?: {
        id: number;
        title: string;
        description?: string;
        state: 'open' | 'closed';
        dueOn?: string;
    };
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
    author: Contributor;
    comments: number;
    url: string;
    htmlUrl: string;
}

export interface PullRequest extends Issue {
    head: {
        ref: string;
        sha: string;
        repo: Repository;
    };
    base: {
        ref: string;
        sha: string;
        repo: Repository;
    };
    merged: boolean;
    mergedAt?: string;
    mergedBy?: Contributor;
    mergeable?: boolean;
    rebaseable?: boolean;
    draft: boolean;
    commits: number;
    additions: number;
    deletions: number;
    changedFiles: number;
}

export interface DataExportOptions {
    format: 'json' | 'csv' | 'xlsx';
    repositories?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
    metrics?: string[];
    includeRawData?: boolean;
    compression?: boolean;
}

export interface DashboardWidget {
    id: string;
    type: 'metric' | 'chart' | 'table' | 'text' | 'image';
    title: string;
    description?: string;
    config: VisualizationConfig;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    refreshInterval?: number; // seconds
    lastUpdated: string;
}

export interface Dashboard {
    id: string;
    name: string;
    description?: string;
    widgets: DashboardWidget[];
    layout: 'grid' | 'freeform';
    theme: 'light' | 'dark' | 'quantum';
    isPublic: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    sharedWith: string[];
}
