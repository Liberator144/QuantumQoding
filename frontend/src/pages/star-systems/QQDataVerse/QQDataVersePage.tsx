/**
 * QQ-DataVerse Page - GitHub Integration and Data Analytics Universe
 * Inner Orbit Star Module - Preserves existing design with enhanced modularity
 * 
 * @version 1.0.0 - Modular Implementation
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RepositoryAnalysisPage } from './components/RepositoryAnalysisPage';
import { DataVisualizationPage } from './components/DataVisualizationPage';
import { MetricsDashboardPage } from './components/MetricsDashboardPage';
import { CodeInsightsPage } from './components/CodeInsightsPage';
import { PerformanceTrackingPage } from './components/PerformanceTrackingPage';
import { DataVerseAPI } from './services/DataVerseAPI';

// Star-specific navigation component with quantum design
const DataVerseNavigation: React.FC<{ activeFeature: string; onFeatureSelect: (feature: string) => void }> = ({ 
    activeFeature, 
    onFeatureSelect 
}) => {
    const features = [
        { id: 'repository-analysis', name: 'Repository Analysis', icon: '🔍', color: 'from-blue-500 to-cyan-500' },
        { id: 'data-visualization', name: 'Data Visualization', icon: '📊', color: 'from-purple-500 to-pink-500' },
        { id: 'metrics-dashboard', name: 'Metrics Dashboard', icon: '📈', color: 'from-green-500 to-teal-500' },
        { id: 'code-insights', name: 'Code Insights', icon: '🧠', color: 'from-orange-500 to-red-500' },
        { id: 'performance-tracking', name: 'Performance Tracking', icon: '⚡', color: 'from-yellow-500 to-orange-500' }
    ];

    return (
        <div className="flex flex-wrap gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-purple-500/20">
            {features.map((feature) => (
                <motion.button
                    key={feature.id}
                    onClick={() => onFeatureSelect(feature.id)}
                    className={`
                        relative px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${activeFeature === feature.id 
                            ? 'bg-gradient-to-r text-white shadow-lg shadow-purple-500/25' 
                            : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                        }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-lg opacity-0 transition-opacity duration-300 ${
                        activeFeature === feature.id ? 'opacity-100' : 'hover:opacity-20'
                    }`} />
                    <div className="relative flex items-center gap-2">
                        <span className="text-xl">{feature.icon}</span>
                        <span>{feature.name}</span>
                    </div>
                </motion.button>
            ))}
        </div>
    );
};

// Main DataVerse page component
const QQDataVersePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFeature, setActiveFeature] = useState('repository-analysis');
    const [starData, setStarData] = useState<any>({
        totalRepositories: 42,
        totalCommits: 1337,
        totalContributors: 24,
        codeQuality: 95,
        lastUpdated: new Date().toISOString()
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Extract current feature from URL
        const pathSegments = location.pathname.split('/');
        const currentFeature = pathSegments[pathSegments.length - 1];
        if (currentFeature && currentFeature !== 'dataverse') {
            setActiveFeature(currentFeature);
        }
    }, [location.pathname]);

    const handleFeatureSelect = (featureId: string) => {
        setActiveFeature(featureId);
        navigate(`/dataverse/${featureId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#050714]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-r-4 border-blue-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <p className="mt-4 text-lg text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                        Initializing DataVerse...
                    </p>
                    <div className="mt-2 text-sm text-gray-400">
                        Loading GitHub Integration & Analytics
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
            {/* Background effects - preserved quantum design */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 50 }, (_, i) => (
                    <motion.div
                        key={`dataverse-star-${i}`}
                        className="absolute rounded-full bg-cyan-400"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.7 + 0.3,
                        }}
                        animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                className="relative z-10 p-6 text-center border-b border-cyan-500/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                    QQ-DataVerse
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    GitHub Integration & Data Analytics Universe
                </p>
                <div className="mt-1 text-sm text-cyan-400">
                    Inner Orbit • Advanced Analytics • Real-time Insights
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="relative z-10 p-6">
                <DataVerseNavigation 
                    activeFeature={activeFeature} 
                    onFeatureSelect={handleFeatureSelect} 
                />
            </div>

            {/* Content Area */}
            <div className="relative z-10 flex-1 p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeFeature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <div className="p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-cyan-500/20">
                            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                                {activeFeature === 'repository-analysis' && '🔍 Repository Analysis'}
                                {activeFeature === 'data-visualization' && '📊 Data Visualization'}
                                {activeFeature === 'metrics-dashboard' && '📈 Metrics Dashboard'}
                                {activeFeature === 'code-insights' && '🧠 Code Insights'}
                                {activeFeature === 'performance-tracking' && '⚡ Performance Tracking'}
                            </h2>
                            <div className="text-gray-300">
                                <p className="mb-4">
                                    Welcome to the QQ-DataVerse {activeFeature.replace('-', ' ')} module.
                                </p>
                                {starData && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                                            <div className="text-2xl font-bold text-cyan-400">{starData.totalRepositories}</div>
                                            <div className="text-sm text-gray-400">Total Repositories</div>
                                        </div>
                                        <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                            <div className="text-2xl font-bold text-blue-400">{starData.totalCommits}</div>
                                            <div className="text-sm text-gray-400">Total Commits</div>
                                        </div>
                                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                            <div className="text-2xl font-bold text-purple-400">{starData.codeQuality}%</div>
                                            <div className="text-sm text-gray-400">Code Quality</div>
                                        </div>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500">
                                    This is a simplified view for testing. Full feature implementation coming soon.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Status indicator */}
            <motion.div
                className="fixed bottom-6 right-6 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-cyan-500/30">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-cyan-400">DataVerse Active</span>
                </div>
            </motion.div>
        </div>
    );
};

export default QQDataVersePage;
