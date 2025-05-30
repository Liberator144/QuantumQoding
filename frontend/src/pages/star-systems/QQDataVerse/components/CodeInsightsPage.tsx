/**
 * Code Insights Page - AI-powered Code Analysis
 * Part of QQ-DataVerse - Quantum-themed code insights
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InsightCardProps {
    insight: {
        id: string;
        type: 'suggestion' | 'warning' | 'error' | 'security' | 'performance';
        severity: 'low' | 'medium' | 'high' | 'critical';
        title: string;
        description: string;
        file?: string;
        line?: number;
        suggestion?: string;
    };
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'suggestion': return 'from-blue-500 to-cyan-500';
            case 'warning': return 'from-yellow-500 to-orange-500';
            case 'error': return 'from-red-500 to-pink-500';
            case 'security': return 'from-purple-500 to-indigo-500';
            case 'performance': return 'from-green-500 to-teal-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'suggestion': return '💡';
            case 'warning': return '⚠️';
            case 'error': return '❌';
            case 'security': return '🔒';
            case 'performance': return '⚡';
            default: return 'ℹ️';
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            whileHover={{ scale: 1.01, y: -2 }}
            layout
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`text-2xl p-2 rounded-lg bg-gradient-to-r ${getTypeColor(insight.type)}`}>
                        {getTypeIcon(insight.type)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs border ${getSeverityColor(insight.severity)}`}>
                                {insight.severity.toUpperCase()}
                            </span>
                            <span className="text-sm text-cyan-400 capitalize">{insight.type}</span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-gray-300 mb-4">{insight.description}</p>

            {insight.file && (
                <div className="mb-4 p-3 bg-black/20 rounded-lg">
                    <div className="text-sm text-gray-400">File:</div>
                    <div className="text-cyan-400 font-mono text-sm">
                        {insight.file}{insight.line && `:${insight.line}`}
                    </div>
                </div>
            )}

            {insight.suggestion && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm text-green-400 font-semibold mb-1">💡 Suggestion:</div>
                    <div className="text-sm text-gray-300">{insight.suggestion}</div>
                </div>
            )}
        </motion.div>
    );
};

export const CodeInsightsPage: React.FC = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedSeverity, setSelectedSeverity] = useState('all');

    const insights = [
        {
            id: '1',
            type: 'performance' as const,
            severity: 'medium' as const,
            title: 'Optimize Database Query',
            description: 'The repository search query could be optimized by adding an index on the name column.',
            file: 'src/services/RepositoryService.ts',
            line: 45,
            suggestion: 'Consider adding a database index or using a more efficient query pattern.'
        },
        {
            id: '2',
            type: 'security' as const,
            severity: 'high' as const,
            title: 'Potential XSS Vulnerability',
            description: 'User input is being rendered without proper sanitization.',
            file: 'src/components/SearchResults.tsx',
            line: 23,
            suggestion: 'Use a sanitization library like DOMPurify before rendering user content.'
        },
        {
            id: '3',
            type: 'suggestion' as const,
            severity: 'low' as const,
            title: 'Code Duplication Detected',
            description: 'Similar code patterns found in multiple components that could be extracted into a shared utility.',
            file: 'src/components/DataVisualization.tsx',
            line: 78,
            suggestion: 'Extract common chart configuration logic into a shared hook or utility function.'
        },
        {
            id: '4',
            type: 'warning' as const,
            severity: 'medium' as const,
            title: 'Unused Dependencies',
            description: 'Several npm packages are installed but not being used in the codebase.',
            suggestion: 'Remove unused dependencies to reduce bundle size and security surface.'
        }
    ];

    const filterTypes = [
        { id: 'all', name: 'All Types', icon: '🔍' },
        { id: 'suggestion', name: 'Suggestions', icon: '💡' },
        { id: 'warning', name: 'Warnings', icon: '⚠️' },
        { id: 'error', name: 'Errors', icon: '❌' },
        { id: 'security', name: 'Security', icon: '🔒' },
        { id: 'performance', name: 'Performance', icon: '⚡' }
    ];

    const severityLevels = [
        { id: 'all', name: 'All Severities' },
        { id: 'critical', name: 'Critical' },
        { id: 'high', name: 'High' },
        { id: 'medium', name: 'Medium' },
        { id: 'low', name: 'Low' }
    ];

    const filteredInsights = insights.filter(insight => {
        const typeMatch = selectedFilter === 'all' || insight.type === selectedFilter;
        const severityMatch = selectedSeverity === 'all' || insight.severity === selectedSeverity;
        return typeMatch && severityMatch;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Code Insights</h2>
                <p className="text-gray-300">AI-powered code analysis and recommendations</p>
            </div>

            {/* Filters */}
            <div className="space-y-4">
                {/* Type Filter */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Filter by Type</h3>
                    <div className="flex flex-wrap gap-2">
                        {filterTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedFilter(type.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    selectedFilter === type.id
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                <span className="mr-1">{type.icon}</span>
                                {type.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Severity Filter */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Filter by Severity</h3>
                    <div className="flex flex-wrap gap-2">
                        {severityLevels.map((severity) => (
                            <button
                                key={severity.id}
                                onClick={() => setSelectedSeverity(severity.id)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                                    selectedSeverity === severity.id
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {severity.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-center text-gray-400">
                Showing {filteredInsights.length} of {insights.length} insights
            </div>

            {/* Insights Grid */}
            <div className="space-y-4">
                {filteredInsights.map((insight, index) => (
                    <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <InsightCard insight={insight} />
                    </motion.div>
                ))}
            </div>

            {filteredInsights.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-400 mb-2">No insights found</h3>
                    <p className="text-gray-500">Try adjusting your filters to see more results.</p>
                </div>
            )}
        </div>
    );
};
