/**
 * Enhanced Login Screen - Quantum-Themed Authentication
 * Integrates with quantum design aesthetic and UnifiedAuthInterface
 * 
 * @version 2.0.0 - Enhanced Implementation
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../lib/supabase/AuthContext';
import { UnifiedAuthInterface } from '../../core/authentication/unified/UnifiedAuthInterface';

const EnhancedLoginScreen: React.FC = () => {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user, isAuthenticated, signInWithEmail, signUpWithEmail } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // Handle authentication success
    const handleAuthSuccess = (provider: string, userData: any) => {
        console.log(`Authentication successful with ${provider}:`, userData);
        setShowAuthModal(false);
        navigate('/');
    };

    // Handle quick access button
    const handleQuickAccess = () => {
        setShowAuthModal(true);
    };

    // Handle developer login (universal access for testing)
    const handleDeveloperLogin = async () => {
        setIsLoading(true);
        setAuthError(null);

        try {
            // For development testing, create a mock session in localStorage
            const mockSession = {
                access_token: 'mock-dev-token-quantum-2024',
                refresh_token: 'mock-refresh-token',
                expires_in: 3600,
                token_type: 'bearer',
                user: {
                    id: 'dev-user-quantum-2024',
                    email: 'developer@quantumqonnect.dev',
                    user_metadata: {
                        full_name: 'Quantum Developer',
                        avatar_url: null,
                        provider: 'developer'
                    },
                    app_metadata: {
                        provider: 'developer',
                        role: 'developer'
                    },
                    created_at: new Date().toISOString(),
                    last_sign_in_at: new Date().toISOString()
                }
            };

            // Store mock session for development
            localStorage.setItem('supabase.auth.token', JSON.stringify(mockSession));
            localStorage.setItem('quantum-dev-auth', 'true');

            console.log('Developer authentication successful (mock session)');

            // Redirect to hub
            navigate('/');

            // Reload to trigger auth state change
            window.location.reload();
        } catch (error) {
            console.error('Developer login error:', error);
            setAuthError('Developer login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
            {/* Quantum Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Animated stars */}
                {Array.from({ length: 100 }, (_, i) => (
                    <motion.div
                        key={`auth-star-${i}`}
                        className="absolute rounded-full bg-white"
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

                {/* Quantum energy rings */}
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-96 h-96 border border-purple-500/20 rounded-full"></div>
                </motion.div>
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-80 h-80 border border-cyan-500/20 rounded-full"></div>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex items-center justify-center w-full h-full min-h-screen">
                <motion.div
                    className="text-center max-w-2xl mx-auto p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Quantum Portal Icon */}
                    <motion.div
                        className="relative inline-flex items-center justify-center w-32 h-32 mb-8"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: 'reverse',
                        }}
                    >
                        {/* Outer ring */}
                        <motion.div
                            className="absolute inset-0 border-4 border-purple-500/30 rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Inner ring */}
                        <motion.div
                            className="absolute inset-4 border-2 border-cyan-500/50 rounded-full"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        {/* Core */}
                        <div className="relative w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-5xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text mb-4"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        Quantum Portal Access
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl text-gray-300 mb-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Enter the QuantumQonnect Universe
                    </motion.p>

                    {/* Description */}
                    <motion.div
                        className="text-sm text-gray-400 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        Secure Authentication • Multi-Provider Support • Quantum Security
                    </motion.div>

                    {/* Authentication Features */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        {[
                            { icon: Shield, title: 'Secure Access', desc: 'Enterprise-grade security' },
                            { icon: Zap, title: 'Instant Login', desc: 'Multiple auth providers' },
                            { icon: Star, title: 'Quantum Ready', desc: 'Future-proof technology' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-black/20 backdrop-blur-sm rounded-xl border border-gray-500/20 p-6">
                                <feature.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Main Access Button */}
                    <motion.button
                        onClick={handleQuickAccess}
                        className="group relative px-12 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 mb-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.0, duration: 0.6 }}
                        disabled={isLoading}
                    >
                        <div className="flex items-center gap-3">
                            <span>Enter The Quantum Core</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        
                        {/* Hover effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                    </motion.button>

                    {/* Developer Quick Access */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                    >
                        <button
                            onClick={() => handleDeveloperLogin()}
                            className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-sm"
                        >
                            🔧 Developer Access
                        </button>
                        <div className="text-xs text-gray-500">
                            Universal developer login for testing
                        </div>
                    </motion.div>

                    {/* Alternative Options */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.6 }}
                    >
                        <div className="text-sm text-gray-400">
                            New to QuantumQonnect?
                        </div>
                        <Link
                            to="/auth/register"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <span>Create Quantum Identity</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* Error Display */}
                    {authError && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg"
                        >
                            <span className="text-red-300 text-sm">{authError}</span>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Status Indicators */}
            <motion.div
                className="fixed bottom-6 left-6 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-purple-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-400">Quantum Portal Online</span>
                </div>
            </motion.div>

            <motion.div
                className="fixed bottom-6 right-6 z-20"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
            >
                <div className="flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full border border-cyan-500/30">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-cyan-400">Security: Maximum</span>
                </div>
            </motion.div>

            {/* Unified Authentication Interface Modal */}
            <UnifiedAuthInterface
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onAuthSuccess={handleAuthSuccess}
                preferredProvider="supabase"
            />
        </div>
    );
};

export default EnhancedLoginScreen;
