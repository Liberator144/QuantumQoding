/**
 * Performance Tracking Page - Repository Performance Monitoring
 * Part of QQ-DataVerse - Quantum-themed performance analytics
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PerformanceMetricProps {
    title: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
    change: string;
    icon: string;
    color: string;
}

const PerformanceMetric: React.FC<PerformanceMetricProps> = ({ 
    title, value, trend, change, icon, color 
}) => {
    const getTrendIcon = () => {
        switch (trend) {
            case 'up': return '📈';
            case 'down': return '📉';
            case 'stable': return '➡️';
            default: return '➡️';
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'up': return 'text-green-400';
            case 'down': return 'text-red-400';
            case 'stable': return 'text-gray-400';
            default: return 'text-gray-400';
        }
    };

    return (
        <motion.div
            className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            whileHover={{ scale: 1.02, y: -2 }}
            layout
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`text-3xl p-3 rounded-lg bg-gradient-to-r ${color}`}>
                    {icon}
                </div>
                <div className="text-right">
                    <div className={`text-sm flex items-center gap-1 ${getTrendColor()}`}>
                        <span>{getTrendIcon()}</span>
                        <span>{change}</span>
                    </div>
                </div>
            </div>
            
            <div className="text-2xl font-bold text-white mb-1">
                {value}
            </div>
            
            <div className="text-sm text-gray-400">
                {title}
            </div>
        </motion.div>
    );
};

export const PerformanceTrackingPage: React.FC = () => {
    const [selectedRepository, setSelectedRepository] = useState('all');
    const [timeRange, setTimeRange] = useState('7d');

    const repositories = [
        { id: 'all', name: 'All Repositories' },
        { id: 'quantumqoding', name: 'QuantumQoding' },
        { id: 'dataverse-api', name: 'DataVerse API' },
        { id: 'frontend-core', name: 'Frontend Core' }
    ];

    const performanceMetrics = [
        {
            title: 'Build Time',
            value: '2m 34s',
            trend: 'down' as const,
            change: '-12%',
            icon: '⚡',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Test Coverage',
            value: '94.2%',
            trend: 'up' as const,
            change: '+2.1%',
            icon: '🧪',
            color: 'from-green-500 to-teal-500'
        },
        {
            title: 'Code Quality',
            value: '8.7/10',
            trend: 'stable' as const,
            change: '0%',
            icon: '⭐',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Deploy Frequency',
            value: '3.2/day',
            trend: 'up' as const,
            change: '+18%',
            icon: '🚀',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Lead Time',
            value: '1.2 days',
            trend: 'down' as const,
            change: '-8%',
            icon: '⏱️',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'MTTR',
            value: '45 min',
            trend: 'down' as const,
            change: '-23%',
            icon: '🔧',
            color: 'from-red-500 to-pink-500'
        }
    ];

    const performanceAlerts = [
        {
            type: 'warning',
            message: 'Build time increased by 15% in the last 24 hours',
            repository: 'Frontend Core',
            time: '2 hours ago'
        },
        {
            type: 'success',
            message: 'Test coverage improved to 94.2%',
            repository: 'DataVerse API',
            time: '6 hours ago'
        },
        {
            type: 'info',
            message: 'New performance baseline established',
            repository: 'QuantumQoding',
            time: '1 day ago'
        }
    ];

    const getAlertColor = (type: string) => {
        switch (type) {
            case 'warning': return 'border-yellow-500/30 bg-yellow-500/10';
            case 'success': return 'border-green-500/30 bg-green-500/10';
            case 'info': return 'border-blue-500/30 bg-blue-500/10';
            default: return 'border-gray-500/30 bg-gray-500/10';
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'success': return '✅';
            case 'info': return 'ℹ️';
            default: return '📋';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2">Performance Tracking</h2>
                <p className="text-gray-300">Monitor repository performance and development metrics</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Repository Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Repository</label>
                    <select
                        value={selectedRepository}
                        onChange={(e) => setSelectedRepository(e.target.value)}
                        className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                        {repositories.map((repo) => (
                            <option key={repo.id} value={repo.id}>
                                {repo.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Time Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Time Range</label>
                    <div className="flex gap-1">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                                    timeRange === range 
                                        ? 'bg-cyan-500 text-white' 
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {performanceMetrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <PerformanceMetric {...metric} />
                    </motion.div>
                ))}
            </div>

            {/* Performance Trends Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            >
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Performance Trends</h3>
                <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p className="text-gray-400">Performance trend chart</p>
                        <p className="text-sm text-gray-500 mt-1">Chart implementation coming soon...</p>
                    </div>
                </div>
            </motion.div>

            {/* Performance Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            >
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Performance Alerts</h3>
                
                <div className="space-y-3">
                    {performanceAlerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg border ${getAlertColor(alert.type)}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="text-xl">{getAlertIcon(alert.type)}</div>
                                <div className="flex-1">
                                    <div className="text-white font-medium">{alert.message}</div>
                                    <div className="text-sm text-gray-400 mt-1">
                                        {alert.repository} • {alert.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
