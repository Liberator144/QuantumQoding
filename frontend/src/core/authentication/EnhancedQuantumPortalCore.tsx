/**
 * Enhanced Quantum Portal Core - Phase 2 Implementation
 * 
 * Enhanced version integrating the black hole portal design
 * with the existing quantum portal functionality.
 * 
 * @version 2.0.0
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SimpleBlackHolePortal } from './black-hole-portal/SimpleBlackHolePortal';
import { WormholeTransition } from './wormhole/WormholeTransition';
import { useAuth } from '../../lib/supabase/AuthContext';

interface EnhancedQuantumPortalCoreProps {
    isLoggedIn: boolean;
    userName: string;
    onLogin: (username: string, password: string) => void;
}

export const EnhancedQuantumPortalCore: React.FC<EnhancedQuantumPortalCoreProps> = ({ 
    isLoggedIn: propIsLoggedIn, 
    userName: propUserName, 
    onLogin 
}) => {
    const { user, isAuthenticated, signInWithProvider, signInWithEmail, isLoading: authLoading } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showWormhole, setShowWormhole] = useState(false);
    const [wormholeProvider, setWormholeProvider] = useState<'google' | 'github' | 'supabase'>('supabase');
    
    // Use auth context values or fallback to props
    const isLoggedIn = isAuthenticated || propIsLoggedIn;
    const userName = user?.email || user?.user_metadata?.name || propUserName;

    // Handle provider-based authentication with wormhole transition
    const handleProviderLogin = async (provider: 'google' | 'github' | 'supabase') => {
        if (provider === 'supabase') {
            setShowLoginModal(true);
            return;
        }
        
        // Start wormhole transition
        setWormholeProvider(provider);
        setShowWormhole(true);
        setIsLoading(true);
        
        try {
            console.log(`Authenticating with ${provider}...`);
            
            // Delay authentication to allow wormhole animation
            setTimeout(async () => {
                const { error } = await signInWithProvider(provider);
                
                if (error) {
                    console.error('Authentication failed:', error);
                    setShowWormhole(false);
                    // Handle error (show toast, etc.)
                } else {
                    setShowLoginModal(false);
                    // Wormhole will complete and hide automatically
                }
                setIsLoading(false);
            }, 1000);
            
        } catch (error) {
            console.error('Authentication failed:', error);
            setShowWormhole(false);
            setIsLoading(false);
        }
    };

    // Handle traditional login with wormhole transition
    const handleTraditionalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loginForm.email && loginForm.password) {
            // Start wormhole transition for Supabase
            setWormholeProvider('supabase');
            setShowWormhole(true);
            setIsLoading(true);
            
            try {
                // Delay authentication to allow wormhole animation
                setTimeout(async () => {
                    const { error } = await signInWithEmail(loginForm.email, loginForm.password);
                    
                    if (error) {
                        console.error('Email login failed:', error);
                        setShowWormhole(false);
                        // Handle error (show toast, etc.)
                    } else {
                        setShowLoginModal(false);
                        setLoginForm({ email: '', password: '' });
                        // Wormhole will complete and hide automatically
                    }
                    setIsLoading(false);
                }, 1000);
                
            } catch (error) {
                console.error('Email login failed:', error);
                setShowWormhole(false);
                setIsLoading(false);
            }
        }
    };

    const handleShowAuthModal = () => {
        setShowLoginModal(true);
    };

    return (
        <div className="relative w-[400px] h-[400px]">
            {/* Black Hole Portal */}
            <SimpleBlackHolePortal
                isLoggedIn={isLoggedIn}
                userName={userName}
                onLogin={handleProviderLogin}
                onShowAuthModal={handleShowAuthModal}
                size={400}
            />

            {/* Traditional Login Modal */}
            <AnimatePresence>
                {showLoginModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                        <motion.div
                            className="relative bg-[#0a0e1f]/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Modal Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Quantum Portal Access
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    Enter your credentials to access the quantum realm
                                </p>
                            </div>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-white mt-4">Establishing quantum connection...</p>
                                </div>
                            )}

                            {/* Login Form */}
                            {!isLoading && (
                                <form onSubmit={handleTraditionalLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={loginForm.email}
                                            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#1a1f3a]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={loginForm.password}
                                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                            className="w-full px-4 py-3 bg-[#1a1f3a]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                            placeholder="Enter your password"
                                            required
                                        />
                                    </div>

                                    <motion.button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Access Quantum Portal
                                    </motion.button>
                                </form>
                            )}

                            {/* Divider */}
                            {!isLoading && (
                                <div className="my-6 flex items-center">
                                    <div className="flex-1 border-t border-gray-600"></div>
                                    <span className="px-4 text-gray-400 text-sm">or use portal authentication</span>
                                    <div className="flex-1 border-t border-gray-600"></div>
                                </div>
                            )}

                            {/* Portal Authentication Info */}
                            {!isLoading && (
                                <div className="text-center">
                                    <p className="text-gray-400 text-sm mb-4">
                                        Click the black hole portal above to authenticate with:
                                    </p>
                                    <div className="flex justify-center gap-4 text-xs">
                                        <span className="text-red-400">🔍 Google</span>
                                        <span className="text-gray-400">⚡ GitHub</span>
                                        <span className="text-green-400">🚀 Supabase</span>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Wormhole Transition Effect */}
            <WormholeTransition
                isActive={showWormhole}
                provider={wormholeProvider}
                onTransitionComplete={() => setShowWormhole(false)}
                onTransitionStart={() => console.log(`Starting ${wormholeProvider} wormhole transition`)}
                duration={3000}
            />
        </div>
    );
};

export default EnhancedQuantumPortalCore;