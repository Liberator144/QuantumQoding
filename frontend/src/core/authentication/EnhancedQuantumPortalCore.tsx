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
    onLogin: (email: string, password: string) => void;
 }

export const EnhancedQuantumPortalCore: React.FC<EnhancedQuantumPortalCoreProps> = ({ 
    isLoggedIn: propIsLoggedIn, 
    userName: propUserName, 
    onLogin 
}) => {
    const { user, isAuthenticated, signInWithProvider, signInWithEmail, signUpWithEmail } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [authSuccess, setAuthSuccess] = useState<string | null>(null);
    const [showWormhole, setShowWormhole] = useState(false);
    const [wormholeProvider, setWormholeProvider] = useState<'google' | 'github' | 'supabase'>('supabase');
    const [showSupernova, setShowSupernova] = useState(false);
    
    // Use auth context values or fallback to props
    const isLoggedIn = isAuthenticated || propIsLoggedIn;
    const userName = user?.email || user?.user_metadata?.name || propUserName;

    // Handle provider-based authentication with wormhole transition
    const handleProviderLogin = async (provider: 'google' | 'github' | 'supabase') => {
        if (provider === 'supabase') {
            setShowLoginModal(true);
            return;
        }
        setWormholeProvider(provider);
        setShowWormhole(true);
        setIsLoading(true);
        setAuthError(null);
        setAuthSuccess(null);
        try {
            setTimeout(async () => {
                const { error } = await signInWithProvider(provider);
                if (error) {
                    setShowWormhole(false);
                    setIsLoading(false);
                    setAuthError(error.message || 'Authentication failed. Please try again.');
                } else {
                    setShowSupernova(true);
                    setTimeout(() => setShowSupernova(false), 3000);
                    setShowLoginModal(false);
                }
                setIsLoading(false);
            }, 1000);
        } catch (error: any) {
            setShowWormhole(false);
            setIsLoading(false);
            setAuthError(error?.message || 'Authentication failed. Please try again.');
        }
    };

    // Handle traditional authentication with wormhole transition
    const handleTraditionalLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loginForm.email || (!loginForm.password && authMode !== 'reset')) {
            setAuthError('Please fill in all required fields');
            return;
        }
        if (authMode === 'signup' && loginForm.password !== confirmPassword) {
            setAuthError('Passwords do not match');
            return;
        }
        setWormholeProvider('supabase');
        setShowWormhole(true);
        setIsLoading(true);
        setAuthError(null);
        setAuthSuccess(null);
        try {
            setTimeout(async () => {
                let error = null;
                if (authMode === 'signin') {
                    const result = await signInWithEmail(loginForm.email, loginForm.password);
                    error = result.error;
                    if (!error) {
                        setAuthSuccess('Successfully signed in!');
                    }
                } else if (authMode === 'signup') {
                    const result = await signUpWithEmail(loginForm.email, loginForm.password);
                    error = result.error;
                    if (!error) {
                        setAuthSuccess('Account created! Please check your email for verification.');
                    }
                } else if (authMode === 'reset') {
                    setAuthSuccess('Password reset email sent! Check your inbox.');
                }
                if (error) {
                    setAuthError(error.message || 'Authentication failed. Please try again.');
                    setShowWormhole(false);
                } else {
                    if (authMode === 'signin') {
                        setShowSupernova(true);
                        setTimeout(() => setShowSupernova(false), 3000);
                    }
                    setTimeout(() => {
                        setShowLoginModal(false);
                        setLoginForm({ email: '', password: '' });
                        setConfirmPassword('');
                        setAuthMode('signin');
                        setShowWormhole(false);
                    }, 2000);
                }
                setIsLoading(false);
            }, 1000);
        } catch (error: any) {
            setAuthError(error?.message || 'Authentication failed. Please try again.');
            setShowWormhole(false);
            setIsLoading(false);
        }
    };

    const handleShowAuthModal = () => {
        // Show the Supabase login modal when triggered
        console.log('Opening Supabase authentication modal');
        setShowLoginModal(true);
    };

    const handleSupabaseAuth = () => {
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
                        className="fixed inset-0 flex items-center justify-center"
                        style={{ zIndex: 9999 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Transparent backdrop that allows wormhole effects to show through */}
                        <div 
                            className={`absolute inset-0 transition-all duration-500 ${
                                showWormhole 
                                    ? 'bg-black/20 backdrop-blur-none' 
                                    : 'bg-black/70 backdrop-blur-sm'
                            }`}
                            style={{ zIndex: 9998 }}
                            onClick={() => setShowLoginModal(false)}
                        />
                        <motion.div
                            className={`relative border border-purple-500/30 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transition-all duration-500 ${
                                showWormhole 
                                    ? 'bg-[#0a0e1f]/30 backdrop-blur-sm' 
                                    : 'bg-[#0a0e1f]/95 backdrop-blur-xl'
                            }`}
                            style={{ zIndex: 9999 }}
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
                                    {authMode === 'signin' && 'Quantum Portal Access'}
                                    {authMode === 'signup' && 'Create Quantum Account'}
                                    {authMode === 'reset' && 'Reset Quantum Key'}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {authMode === 'signin' && 'Enter your credentials to access the quantum realm'}
                                    {authMode === 'signup' && 'Join the quantum universe with your new account'}
                                    {authMode === 'reset' && 'Reset your quantum access credentials'}
                                </p>
                            </div>

                            {/* Auth Mode Selector */}
                            <div className="flex space-x-1 mb-6 bg-[#1a1f3a]/30 rounded-lg p-1">
                                {[
                                    { mode: 'signin' as const, label: 'Sign In' },
                                    { mode: 'signup' as const, label: 'Sign Up' },
                                    { mode: 'reset' as const, label: 'Reset' }
                                ].map(({ mode, label }) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => {
                                            setAuthMode(mode);
                                            setAuthError(null);
                                            setAuthSuccess(null);
                                        }}
                                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                                            authMode === mode
                                                ? 'bg-purple-600 text-white shadow-lg'
                                                : 'text-gray-400 hover:text-white hover:bg-[#1a1f3a]/50'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>

                            {/* Error/Success Messages */}
                            {authError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm"
                                >
                                    {authError}
                                </motion.div>
                            )}
                            
                            {authSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm"
                                >
                                    {authSuccess}
                                </motion.div>
                            )}

                            {/* Loading State */}
                            {isLoading && (
                                <div className="text-center py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-white mt-4">Establishing quantum connection...</p>
                                </div>
                            )}

                            {/* Authentication Form */}
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
                                            className="w-full px-4 py-3 bg-[#1a1f3a]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    {authMode !== 'reset' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-4 py-3 bg-[#1a1f3a]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                                placeholder="Enter your password"
                                                required
                                            />
                                        </div>
                                    )}

                                    {authMode === 'signup' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                                Confirm Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-[#1a1f3a]/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    )}

                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 font-medium rounded-lg transition-all ${
                                            isLoading 
                                                ? 'bg-gray-600 cursor-not-allowed' 
                                                : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600'
                                        } text-white`}
                                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                                    >
                                        {authMode === 'signin' && 'Access Quantum Portal'}
                                        {authMode === 'signup' && 'Create Quantum Account'}
                                        {authMode === 'reset' && 'Send Reset Link'}
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

            {/* Supernova Login Success Effect */}
            <AnimatePresence>
                {showSupernova && (
                    <motion.div
                        className="fixed inset-0 pointer-events-none"
                        style={{ zIndex: 10000 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Central Supernova Burst */}
                        <motion.div
                            className="absolute"
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)'
                            }}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{
                                scale: [0, 1, 3, 8],
                                opacity: [1, 0.8, 0.4, 0]
                            }}
                            transition={{
                                duration: 3,
                                ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                        >
                            <div className="w-4 h-4 rounded-full bg-white shadow-2xl shadow-white/50"></div>
                        </motion.div>

                        {/* Energy Rings */}
                        {[...Array(5)].map((_, ringIndex) => (
                            <motion.div
                                key={`energy-ring-${ringIndex}`}
                                className="absolute rounded-full border-2 pointer-events-none"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    borderColor: `hsl(${45 + ringIndex * 30}, 90%, 70%)`,
                                    width: `${20 + ringIndex * 40}px`,
                                    height: `${20 + ringIndex * 40}px`
                                }}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                    scale: [0, 15, 25],
                                    opacity: [0, 0.8, 0],
                                    borderColor: [
                                        `hsl(${45 + ringIndex * 30}, 90%, 70%)`,
                                        `hsl(${200 + ringIndex * 20}, 80%, 60%)`,
                                        `hsl(${300 + ringIndex * 15}, 70%, 50%)`
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: ringIndex * 0.1,
                                    ease: "easeOut"
                                }}
                            />
                        ))}

                        {/* Radial Energy Beams */}
                        {[...Array(12)].map((_, beamIndex) => {
                            const angle = (beamIndex * 30) * Math.PI / 180;
                            return (
                                <motion.div
                                    key={`energy-beam-${beamIndex}`}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        width: '4px',
                                        height: '100vh',
                                        background: `linear-gradient(to bottom, 
                                            hsl(${beamIndex * 30}, 90%, 70%), 
                                            transparent 50%)`,
                                        transformOrigin: 'center top',
                                        transform: `translate(-50%, -50%) rotate(${beamIndex * 30}deg)`
                                    }}
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{
                                        scaleY: [0, 1, 0.5, 0],
                                        opacity: [0, 0.8, 0.4, 0]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        delay: 0.2 + beamIndex * 0.05,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                />
                            );
                        })}

                        {/* Particle Explosion */}
                        {[...Array(50)].map((_, particleIndex) => {
                            const angle = Math.random() * 360 * Math.PI / 180;
                            const distance = 200 + Math.random() * 400;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;
                            
                            return (
                                <motion.div
                                    key={`particle-${particleIndex}`}
                                    className="absolute w-2 h-2 rounded-full pointer-events-none"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        background: `hsl(${Math.random() * 360}, 90%, 70%)`,
                                        boxShadow: `0 0 10px hsl(${Math.random() * 360}, 90%, 70%)`
                                    }}
                                    initial={{
                                        x: 0,
                                        y: 0,
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    animate={{
                                        x: [0, x * 0.5, x],
                                        y: [0, y * 0.5, y],
                                        opacity: [1, 0.6, 0],
                                        scale: [1, 1.5, 0]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        delay: 0.3 + particleIndex * 0.02,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                />
                            );
                        })}

                        {/* Success Message */}
                        <motion.div
                            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            <div className="text-2xl font-bold text-white mb-2">
                                🌟 QUANTUM ACCESS GRANTED 🌟
                            </div>
                            <div className="text-lg text-cyan-400">
                                Welcome to the QQ-Verse!
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnhancedQuantumPortalCore;