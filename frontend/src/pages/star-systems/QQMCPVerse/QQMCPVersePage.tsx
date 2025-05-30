/**
 * QQ-MCPVerse Page - Model Context Protocol Management Universe
 * Inner Orbit Star Module - Preserves existing design with enhanced modularity
 * 
 * @version 1.0.0 - Modular Implementation
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// MCP-specific navigation component with quantum design
const MCPVerseNavigation: React.FC<{ activeFeature: string; onFeatureSelect: (feature: string) => void }> = ({ 
    activeFeature, 
    onFeatureSelect 
}) => {
    const features = [
        { id: 'protocol-setup', name: 'Protocol Setup', icon: '🔧', color: 'from-purple-500 to-indigo-500' },
        { id: 'context-management', name: 'Context Management', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
        { id: 'service-integration', name: 'Service Integration', icon: '🔗', color: 'from-green-500 to-teal-500' },
        { id: 'workflow-builder', name: 'Workflow Builder', icon: '⚙️', color: 'from-orange-500 to-red-500' },
        { id: 'monitoring', name: 'API Monitoring', icon: '📊', color: 'from-pink-500 to-purple-500' }
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

// MCP Feature Components (simplified for now)
const ProtocolSetupPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🔧</div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Protocol Setup</h3>
            <p className="text-gray-300 mb-6">Configure and manage MCP protocol connections</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Active Protocols</h4>
                    <div className="text-3xl font-bold text-green-400">12</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-2">Connection Status</h4>
                    <div className="text-lg text-green-400">✅ All Connected</div>
                </div>
            </div>
        </div>
    </div>
);

const ContextManagementPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Context Management</h3>
            <p className="text-gray-300 mb-6">Manage AI context and conversation flows</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Active Contexts</h4>
                    <div className="text-2xl font-bold text-cyan-400">8</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Memory Usage</h4>
                    <div className="text-2xl font-bold text-blue-400">2.4GB</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-400 mb-1">Processing Speed</h4>
                    <div className="text-2xl font-bold text-purple-400">1.2s</div>
                </div>
            </div>
        </div>
    </div>
);

const ServiceIntegrationPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-2xl font-bold text-green-400 mb-4">Service Integration</h3>
            <p className="text-gray-300 mb-6">Connect and manage external services</p>
            <div className="space-y-4">
                {['GitHub MCP', 'Supabase MCP', 'Playwright MCP', 'Context7 MCP'].map((service, index) => (
                    <div key={service} className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="text-white font-medium">{service}</span>
                        </div>
                        <span className="text-green-400 text-sm">Connected</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const WorkflowBuilderPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Workflow Builder</h3>
            <p className="text-gray-300 mb-6">Create and manage automated workflows</p>
            <div className="text-gray-400">
                Visual workflow builder interface coming soon...
            </div>
        </div>
    </div>
);

const MonitoringPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-purple-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-pink-400 mb-4">API Monitoring</h3>
            <p className="text-gray-300 mb-6">Monitor API performance and usage</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-400">99.9%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">1,234</div>
                    <div className="text-sm text-gray-400">Requests/hr</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">45ms</div>
                    <div className="text-sm text-gray-400">Avg Response</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">0</div>
                    <div className="text-sm text-gray-400">Errors</div>
                </div>
            </div>
        </div>
    </div>
);

// Main MCPVerse page component
const QQMCPVersePage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFeature, setActiveFeature] = useState('protocol-setup');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Extract current feature from URL
        const pathSegments = location.pathname.split('/');
        const currentFeature = pathSegments[pathSegments.length - 1];
        if (currentFeature && currentFeature !== 'mcpverse') {
            setActiveFeature(currentFeature);
        }

        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, [location.pathname]);

    const handleFeatureSelect = (featureId: string) => {
        setActiveFeature(featureId);
        navigate(`/mcpverse/${featureId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#050714]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-r-4 border-indigo-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <p className="mt-4 text-lg text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
                        Initializing MCPVerse...
                    </p>
                    <div className="mt-2 text-sm text-gray-400">
                        Loading Protocol Management Systems
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
                        key={`mcpverse-star-${i}`}
                        className="absolute rounded-full bg-purple-400"
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
                className="relative z-10 p-6 text-center border-b border-purple-500/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text">
                    QQ-MCPVerse
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    Model Context Protocol Management Universe
                </p>
                <div className="mt-1 text-sm text-purple-400">
                    Inner Orbit • Protocol Management • AI Integration
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="relative z-10 p-6">
                <MCPVerseNavigation 
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
                        <Routes>
                            <Route path="/" element={<ProtocolSetupPage />} />
                            <Route path="/protocol-setup" element={<ProtocolSetupPage />} />
                            <Route path="/context-management" element={<ContextManagementPage />} />
                            <Route path="/service-integration" element={<ServiceIntegrationPage />} />
                            <Route path="/workflow-builder" element={<WorkflowBuilderPage />} />
                            <Route path="/monitoring" element={<MonitoringPage />} />
                        </Routes>
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
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-purple-500/30">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-400">MCPVerse Active</span>
                </div>
            </motion.div>
        </div>
    );
};

export default QQMCPVersePage;
