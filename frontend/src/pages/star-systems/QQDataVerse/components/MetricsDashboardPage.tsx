/**
 * Metrics Dashboard Page - Real-time KPI Tracking
 * Part of QQ-DataVerse - Quantum-themed metrics dashboard
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MetricCardProps {
    title: string;
    value: string | number;
    change: number;
    icon: string;
    color: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, color }) => {
    const isPositive = change >= 0;
    
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
                <div className={`text-sm px-2 py-1 rounded-full ${
                    isPositive 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                }`}>
                    {isPositive ? '+' : ''}{change}%
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

export const MetricsDashboardPage: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    const metrics = [
        {
            title: 'Total Repositories',
            value: 24,
            change: 12.5,
            icon: '📁',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            title: 'Active Contributors',
            value: 156,
            change: 8.3,
            icon: '👥',
            color: 'from-green-500 to-teal-500'
        },
        {
            title: 'Code Quality Score',
            value: '87%',
            change: 2.1,
            icon: '⭐',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            title: 'Issues Resolved',
            value: 342,
            change: 15.7,
            icon: '✅',
            color: 'from-purple-500 to-pink-500'
        },
        {
            title: 'Pull Requests',
            value: 89,
            change: -3.2,
            icon: '🔄',
            color: 'from-indigo-500 to-purple-500'
        },
        {
            title: 'Test Coverage',
            value: '94%',
            change: 5.4,
            icon: '🧪',
            color: 'from-emerald-500 to-green-500'
        }
    ];

    const handleRefresh = async () => {
        setRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLastUpdated(new Date());
        setRefreshing(false);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-cyan-400 mb-2">Metrics Dashboard</h2>
                    <p className="text-gray-300">Real-time KPI tracking and performance metrics</p>
                </div>
                
                <motion.button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <motion.div
                        animate={refreshing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, repeat: refreshing ? Infinity : 0 }}
                    >
                        🔄
                    </motion.div>
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </motion.button>
            </div>

            {/* Last Updated */}
            <div className="text-sm text-gray-400 text-center">
                Last updated: {lastUpdated.toLocaleTimeString()}
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((metric, index) => (
                    <motion.div
                        key={metric.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <MetricCard {...metric} />
                    </motion.div>
                ))}
            </div>

            {/* Performance Overview */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            >
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Performance Overview</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Build Performance */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Build Performance</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Average Build Time</span>
                                <span className="text-green-400 font-semibold">2m 34s</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Success Rate</span>
                                <span className="text-green-400 font-semibold">98.7%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Failed Builds</span>
                                <span className="text-red-400 font-semibold">3</span>
                            </div>
                        </div>
                    </div>

                    {/* Deployment Stats */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Deployment Stats</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Deployments This Week</span>
                                <span className="text-cyan-400 font-semibold">12</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Average Deploy Time</span>
                                <span className="text-cyan-400 font-semibold">45s</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-300">Rollbacks</span>
                                <span className="text-yellow-400 font-semibold">1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Real-time Activity Feed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-6"
            >
                <h3 className="text-xl font-bold text-cyan-400 mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                    {[
                        { action: 'New commit pushed', repo: 'QuantumQoding', time: '2 minutes ago', icon: '📝' },
                        { action: 'Pull request merged', repo: 'DataVerse-API', time: '15 minutes ago', icon: '✅' },
                        { action: 'Issue closed', repo: 'Frontend-Core', time: '1 hour ago', icon: '🐛' },
                        { action: 'Release deployed', repo: 'Backend-Services', time: '2 hours ago', icon: '🚀' }
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg">
                            <div className="text-xl">{activity.icon}</div>
                            <div className="flex-1">
                                <div className="text-white font-medium">{activity.action}</div>
                                <div className="text-sm text-gray-400">{activity.repo}</div>
                            </div>
                            <div className="text-sm text-gray-500">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};
