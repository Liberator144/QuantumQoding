/**
 * Enhanced Header Component - Phase 1 Implementation
 * 
 * Enhanced version of the Header component with navigation to test screen
 * and improved quantum-coherent design.
 * 
 * @version 2.0.0
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, TestTube, Home, Settings, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/supabase/AuthContext';
import { UserProfile } from './UserProfile';

/**
 * Enhanced Header Component with Test Screen Navigation
 */
export function EnhancedHeader() {
    const { isAuthenticated, user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const [showNavMenu, setShowNavMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleProfileToggle = () => {
        setShowProfile(!showProfile);
    };

    const handleProfileClose = () => {
        setShowProfile(false);
    };

    const handleTestScreenNavigation = () => {
        navigate('/test/quantum-visualization');
        setShowNavMenu(false);
    };

    const handleHomeNavigation = () => {
        navigate('/');
        setShowNavMenu(false);
    };

    const navigationItems = [
        {
            icon: Home,
            label: 'Quantum Hub',
            path: '/',
            onClick: handleHomeNavigation
        },
        {
            icon: TestTube,
            label: 'Revolutionary Components Test',
            path: '/test/quantum-visualization',
            onClick: handleTestScreenNavigation,
            highlight: true
        },
        {
            icon: Settings,
            label: 'Settings',
            path: '/settings',
            onClick: () => {
                navigate('/settings');
                setShowNavMenu(false);
            }
        },
        {
            icon: HelpCircle,
            label: 'Help',
            path: '/help',
            onClick: () => {
                navigate('/help');
                setShowNavMenu(false);
            }
        }
    ];

    return (
        <header className="px-6 py-5 flex items-center justify-between relative z-50">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-6">
                {/* Enhanced Logo with Quantum Effects */}
                <Link to="/" className="flex items-center gap-3 group relative">
                    {/* Quantum Glow Background */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg blur-lg"
                        animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    
                    {/* QQ Logo with Particle Effect */}
                    <motion.div className="relative">
                        <motion.span 
                            className="text-white text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent relative z-10"
                            whileHover={{ 
                                scale: 1.1,
                                textShadow: "0 0 20px rgba(59, 130, 246, 0.8)"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            QQ
                        </motion.span>
                        
                        {/* Quantum Particles around QQ */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                }}
                                animate={{
                                    x: [0, Math.cos(i * 60 * Math.PI / 180) * 25],
                                    y: [0, Math.sin(i * 60 * Math.PI / 180) * 25],
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                    
                    {/* QuantumQoding Text with Enhanced Effects */}
                    <motion.div className="relative">
                        <motion.span 
                            className="text-white text-2xl font-light tracking-wider relative z-10"
                            whileHover={{ 
                                scale: 1.05,
                                color: "#60a5fa"
                            }}
                            transition={{ duration: 0.3 }}
                        >
                            QuantumQoding
                        </motion.span>
                        
                        {/* Quantum Field Lines */}
                        <motion.div
                            className="absolute inset-0 border border-cyan-500/30 rounded"
                            animate={{
                                borderColor: ["rgba(6, 182, 212, 0.3)", "rgba(147, 51, 234, 0.3)", "rgba(6, 182, 212, 0.3)"]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.div>
                    
                    {/* Back to Hub Indicator */}
                    {location.pathname !== '/' && (
                        <motion.div
                            className="absolute -bottom-6 left-0 text-xs text-cyan-400 opacity-70"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 0.7, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            ← Back to Hub
                        </motion.div>
                    )}
                </Link>

                {/* Navigation Menu Button */}
                <motion.button
                    onClick={() => setShowNavMenu(!showNavMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <span className="text-sm font-medium">Navigation</span>
                    <motion.div
                        animate={{ rotate: showNavMenu ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        ▼
                    </motion.div>
                </motion.button>

                {/* Navigation Dropdown */}
                <AnimatePresence>
                    {showNavMenu && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-[#0a0e1f]/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-4">
                                <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                                    Quantum Navigation
                                </h3>
                                <div className="space-y-2">
                                    {navigationItems.map((item, index) => {
                                        const Icon = item.icon;
                                        const isActive = location.pathname === item.path;
                                        
                                        return (
                                            <motion.button
                                                key={item.path}
                                                onClick={item.onClick}
                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-300 ${
                                                    isActive 
                                                        ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 text-white border border-purple-500/50' 
                                                        : item.highlight
                                                            ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30'
                                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                                }`}
                                                whileHover={{ scale: 1.02, x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span className="text-sm font-medium">{item.label}</span>
                                                {item.highlight && (
                                                    <motion.span
                                                        className="ml-auto text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/30"
                                                        animate={{ scale: [1, 1.1, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        NEW
                                                    </motion.span>
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Bar */}
            <div className="flex items-center px-4 py-2 bg-[#0a0e1f]/80 backdrop-blur-sm rounded-full border border-[#1a2040] w-64 hover:border-purple-500/50 transition-all duration-300">
                <Search className="w-5 h-5 text-[#4a5482]" />
                <input
                    type="text"
                    placeholder="Search quantum realms..."
                    className="bg-transparent border-none outline-none text-[#4a5482] ml-2 w-full placeholder-[#4a5482]/70"
                />
            </div>

            {/* User Section */}
            <div className="flex items-center gap-6">
                <Link 
                    to="/pricing" 
                    className="text-[#8a94c2] hover:text-white transition-colors duration-300 font-medium"
                >
                    Pricing
                </Link>
                
                {isAuthenticated ? (
                    <div className="relative">
                        <motion.div
                            className="cursor-pointer flex items-center gap-2"
                            onClick={handleProfileToggle}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div className="text-[#8a94c2] font-medium">
                                {user?.username}
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
                                {user?.username?.substring(0, 1).toUpperCase()}
                            </div>
                        </motion.div>
                        <UserProfile isOpen={showProfile} onClose={handleProfileClose} />
                    </div>
                ) : (
                    <Link to="/auth/login">
                        <motion.div
                            className="w-10 h-10 rounded-full bg-[#0a0e1f] border border-[#1a2040] flex items-center justify-center hover:border-purple-500/50 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <User className="w-5 h-5 text-[#4a5482]" />
                        </motion.div>
                    </Link>
                )}
            </div>

            {/* Click outside to close menu */}
            {showNavMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNavMenu(false)}
                />
            )}
        </header>
    );
}

export default EnhancedHeader;