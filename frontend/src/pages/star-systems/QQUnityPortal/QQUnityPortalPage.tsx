/**
 * QQ-UnityPortal Page - Authentication and User Management Universe
 * Outer Orbit Star Module - Enhanced modular version of existing Unity Portal system
 * 
 * @version 2.0.0 - Modular Implementation
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../lib/supabase/AuthContext';

// UnityPortal-specific navigation component with quantum design
const UnityPortalNavigation: React.FC<{ activeFeature: string; onFeatureSelect: (feature: string) => void }> = ({ 
    activeFeature, 
    onFeatureSelect 
}) => {
    const features = [
        { id: 'user-management', name: 'User Management', icon: '👥', color: 'from-emerald-500 to-teal-500' },
        { id: 'authentication', name: 'Authentication', icon: '🔐', color: 'from-blue-500 to-indigo-500' },
        { id: 'permissions', name: 'Permissions', icon: '🛡️', color: 'from-purple-500 to-pink-500' },
        { id: 'session-management', name: 'Session Management', icon: '⏱️', color: 'from-orange-500 to-red-500' },
        { id: 'security-analytics', name: 'Security Analytics', icon: '📊', color: 'from-cyan-500 to-blue-500' }
    ];

    return (
        <div className="flex flex-wrap gap-4 p-6 bg-black/20 backdrop-blur-sm rounded-xl border border-emerald-500/20">
            {features.map((feature) => (
                <motion.button
                    key={feature.id}
                    onClick={() => onFeatureSelect(feature.id)}
                    className={`
                        relative px-6 py-3 rounded-lg font-medium transition-all duration-300
                        ${activeFeature === feature.id 
                            ? 'bg-gradient-to-r text-white shadow-lg shadow-emerald-500/25' 
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

// UnityPortal Feature Components
const UserManagementPage: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-8">
            <div className="text-center">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">User Management</h3>
                <p className="text-gray-300 mb-6">Manage users, roles, and access controls</p>
                
                {user && (
                    <div className="bg-black/20 p-6 rounded-lg mb-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Current User</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="text-left">
                                <div className="text-sm text-gray-400">Email</div>
                                <div className="text-emerald-400 font-medium">{user.email}</div>
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-400">User ID</div>
                                <div className="text-emerald-400 font-mono text-sm">{user.id}</div>
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-400">Last Sign In</div>
                                <div className="text-emerald-400 font-medium">
                                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'N/A'}
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="text-sm text-gray-400">Created</div>
                                <div className="text-emerald-400 font-medium">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-400">1,247</div>
                        <div className="text-sm text-gray-400">Total Users</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">89</div>
                        <div className="text-sm text-gray-400">Active Sessions</div>
                    </div>
                    <div className="bg-black/20 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-purple-400">12</div>
                        <div className="text-sm text-gray-400">Admin Users</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AuthenticationPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Authentication</h3>
            <p className="text-gray-300 mb-6">Secure authentication and authorization systems</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Authentication Methods</h4>
                    <div className="space-y-2">
                        {['Email/Password', 'Google OAuth', 'GitHub OAuth', 'Magic Links'].map((method) => (
                            <div key={method} className="flex items-center justify-between">
                                <span className="text-gray-300">{method}</span>
                                <span className="text-green-400 text-sm">✅ Active</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-white mb-3">Security Status</h4>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">2FA Enabled</span>
                            <span className="text-green-400 text-sm">✅ Yes</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Session Timeout</span>
                            <span className="text-blue-400 text-sm">24 hours</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300">Password Policy</span>
                            <span className="text-green-400 text-sm">✅ Strong</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PermissionsPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h3 className="text-2xl font-bold text-purple-400 mb-4">Permissions</h3>
            <p className="text-gray-300 mb-6">Role-based access control and permissions management</p>
            <div className="space-y-4">
                {[
                    { role: 'Super Admin', users: 2, permissions: 'All Systems', color: 'text-red-400' },
                    { role: 'Admin', users: 8, permissions: 'Most Systems', color: 'text-orange-400' },
                    { role: 'Developer', users: 24, permissions: 'Development Tools', color: 'text-blue-400' },
                    { role: 'User', users: 1213, permissions: 'Basic Access', color: 'text-green-400' }
                ].map((role) => (
                    <div key={role.role} className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${role.color.replace('text-', 'bg-')}`}></div>
                            <div>
                                <div className="text-white font-medium">{role.role}</div>
                                <div className="text-sm text-gray-400">{role.permissions}</div>
                            </div>
                        </div>
                        <div className={`font-bold ${role.color}`}>{role.users} users</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const SessionManagementPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">⏱️</div>
            <h3 className="text-2xl font-bold text-orange-400 mb-4">Session Management</h3>
            <p className="text-gray-300 mb-6">Monitor and manage user sessions</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-400">89</div>
                    <div className="text-sm text-gray-400">Active Sessions</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">24h</div>
                    <div className="text-sm text-gray-400">Avg Duration</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">156</div>
                    <div className="text-sm text-gray-400">Today's Logins</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-yellow-400">3</div>
                    <div className="text-sm text-gray-400">Expired Today</div>
                </div>
            </div>
        </div>
    </div>
);

const SecurityAnalyticsPage: React.FC = () => (
    <div className="bg-black/30 backdrop-blur-sm rounded-xl border border-emerald-500/20 p-8">
        <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-cyan-400 mb-4">Security Analytics</h3>
            <p className="text-gray-300 mb-6">Security metrics and threat analysis</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-400">99.9%</div>
                    <div className="text-sm text-gray-400">Security Score</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-red-400">0</div>
                    <div className="text-sm text-gray-400">Threats Detected</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">12</div>
                    <div className="text-sm text-gray-400">Failed Logins</div>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">100%</div>
                    <div className="text-sm text-gray-400">Uptime</div>
                </div>
            </div>
        </div>
    </div>
);

// Main UnityPortal page component
const QQUnityPortalPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeFeature, setActiveFeature] = useState('user-management');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Extract current feature from URL
        const pathSegments = location.pathname.split('/');
        const currentFeature = pathSegments[pathSegments.length - 1];
        if (currentFeature && currentFeature !== 'unity-portal') {
            setActiveFeature(currentFeature);
        }

        // Simulate loading
        setTimeout(() => setLoading(false), 1000);
    }, [location.pathname]);

    const handleFeatureSelect = (featureId: string) => {
        setActiveFeature(featureId);
        navigate(`/unity-portal/${featureId}`);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#050714]">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-r-4 border-teal-500 rounded-full animate-spin animate-reverse"></div>
                    </div>
                    <p className="mt-4 text-lg text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                        Initializing Unity Portal...
                    </p>
                    <div className="mt-2 text-sm text-gray-400">
                        Loading Authentication Systems
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
                        key={`unity-star-${i}`}
                        className="absolute rounded-full bg-emerald-400"
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
                className="relative z-10 p-6 text-center border-b border-emerald-500/20"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
                    QQ-UnityPortal
                </h1>
                <p className="mt-2 text-lg text-gray-300">
                    Authentication & User Management Universe
                </p>
                <div className="mt-1 text-sm text-emerald-400">
                    Outer Orbit • Security Systems • Access Control
                </div>
            </motion.div>

            {/* Navigation */}
            <div className="relative z-10 p-6">
                <UnityPortalNavigation 
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
                            <Route path="/" element={<UserManagementPage />} />
                            <Route path="/user-management" element={<UserManagementPage />} />
                            <Route path="/authentication" element={<AuthenticationPage />} />
                            <Route path="/permissions" element={<PermissionsPage />} />
                            <Route path="/session-management" element={<SessionManagementPage />} />
                            <Route path="/security-analytics" element={<SecurityAnalyticsPage />} />
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
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-emerald-500/30">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-400">Unity Portal Active</span>
                </div>
            </motion.div>
        </div>
    );
};

export default QQUnityPortalPage;
