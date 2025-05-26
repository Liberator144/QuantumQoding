/**
 * Unified Authentication Interface - Revolutionary Implementation
 * 
 * Provider-agnostic authentication system with seamless switching,
 * enterprise-grade security, and quantum-coherent user experience.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Users, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../lib/supabase/AuthContext';

interface UnifiedAuthInterfaceProps {
    isOpen: boolean;
    onClose: () => void;
    onAuthSuccess: (provider: string, user: any) => void;
    preferredProvider?: 'google' | 'github' | 'supabase';
}

interface AuthProvider {
    id: 'google' | 'github' | 'supabase';
    name: string;
    icon: string;
    color: string;
    description: string;
    features: string[];
}

const authProviders: AuthProvider[] = [
    {
        id: 'google',
        name: 'Google',
        icon: '🔍',
        color: 'from-red-500 to-orange-500',
        description: 'Fast & Secure Google Authentication',
        features: ['Single Sign-On', 'Profile Sync', 'Instant Access']
    },
    {
        id: 'github',
        name: 'GitHub',
        icon: '⚡',
        color: 'from-gray-700 to-gray-900',
        description: 'Developer-Focused Authentication',
        features: ['Code Integration', 'Repository Access', 'Developer Tools']
    },
    {
        id: 'supabase',
        name: 'Supabase',
        icon: '🚀',
        color: 'from-green-500 to-emerald-600',
        description: 'Full-Featured Database Authentication',
        features: ['Email/Password', 'Profile Management', 'Advanced Security']
    }
];

export const UnifiedAuthInterface: React.FC<UnifiedAuthInterfaceProps> = ({
    isOpen,
    onClose,
    onAuthSuccess,
    preferredProvider = 'supabase'
}) => {
    const [selectedProvider, setSelectedProvider] = useState<'google' | 'github' | 'supabase'>(preferredProvider);
    const [authStep, setAuthStep] = useState<'select' | 'authenticate' | 'success'>('select');
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);
    const [sessionData, setSessionData] = useState<any>(null);
    
    // Supabase form data for email/password authentication
    const [emailForm, setEmailForm] = useState({ email: '', password: '', confirmPassword: '' });
    const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
    
    const { signInWithProvider, signInWithEmail, signUpWithEmail, user, isAuthenticated } = useAuth();

    // Handle provider selection
    const handleProviderSelect = (providerId: 'google' | 'github' | 'supabase') => {
        setSelectedProvider(providerId);
        setAuthError(null);
        
        if (providerId !== 'supabase') {
            // For OAuth providers, proceed directly to authentication
            handleAuthentication(providerId);
        } else {
            // For Supabase, show the email/password form
            setAuthStep('authenticate');
        }
    };

    // Handle authentication process
    const handleAuthentication = async (provider: 'google' | 'github' | 'supabase') => {
        setIsLoading(true);
        setAuthError(null);
        
        try {
            let result;
            
            if (provider === 'supabase') {
                // Handle Supabase email/password authentication
                if (authMode === 'signin') {
                    result = await signInWithEmail(emailForm.email, emailForm.password);
                } else if (authMode === 'signup') {
                    if (emailForm.password !== emailForm.confirmPassword) {
                        throw new Error('Passwords do not match');
                    }
                    result = await signUpWithEmail(emailForm.email, emailForm.password);
                } else {
                    // Password reset
                    throw new Error('Password reset not implemented yet');
                }
            } else {
                // Handle OAuth providers
                result = await signInWithProvider(provider);
            }
            
            if (result.error) {
                setAuthError(result.error.message);
                return;
            }
            
            // Authentication successful
            setAuthStep('success');
            setSessionData({ provider, user: result.user });
            
            // Notify parent component
            setTimeout(() => {
                onAuthSuccess(provider, result.user);
                onClose();
            }, 2000);
            
        } catch (error: any) {
            setAuthError(error.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Supabase form submission
    const handleSupabaseAuth = (e: React.FormEvent) => {
        e.preventDefault();
        handleAuthentication('supabase');
    };

    // Reset to provider selection
    const resetToSelection = () => {
        setAuthStep('select');
        setAuthError(null);
        setEmailForm({ email: '', password: '', confirmPassword: '' });
        setAuthMode('signin');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    {/* Main Modal */}
                    <motion.div
                        className="relative bg-gradient-to-br from-[#0a0e1f] to-[#1a1f3a] border border-purple-500/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl"
                        initial={{ scale: 0.8, y: 50, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.8, y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <motion.div
                                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full mb-4"
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            >
                                <Shield className="w-8 h-8 text-white" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mb-2">
                                Quantum Authentication Portal
                            </h2>
                            <p className="text-gray-400">
                                Choose your preferred authentication method
                            </p>
                        </div>

                        {/* Provider Selection Step */}
                        {authStep === 'select' && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                {authProviders.map((provider) => (
                                    <motion.button
                                        key={provider.id}
                                        onClick={() => handleProviderSelect(provider.id)}
                                        className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                                            selectedProvider === provider.id
                                                ? 'border-purple-500 bg-purple-500/10'
                                                : 'border-gray-600 hover:border-purple-400 bg-gray-800/30'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isLoading}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${provider.color} flex items-center justify-center text-2xl`}>
                                                {provider.icon}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white mb-1">
                                                    {provider.name}
                                                </h3>
                                                <p className="text-gray-400 text-sm mb-2">
                                                    {provider.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {provider.features.map((feature, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <CheckCircle className={`w-6 h-6 ${
                                                selectedProvider === provider.id ? 'text-purple-500' : 'text-gray-600'
                                            }`} />
                                        </div>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {/* Supabase Authentication Step */}
                        {authStep === 'authenticate' && selectedProvider === 'supabase' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                {/* Mode Selector */}
                                <div className="flex space-x-1 bg-gray-800/50 rounded-lg p-1">
                                    {[
                                        { mode: 'signin' as const, label: 'Sign In' },
                                        { mode: 'signup' as const, label: 'Sign Up' },
                                        { mode: 'reset' as const, label: 'Reset' }
                                    ].map(({ mode, label }) => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setAuthMode(mode)}
                                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                                                authMode === mode
                                                    ? 'bg-purple-600 text-white'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Authentication Form */}
                                <form onSubmit={handleSupabaseAuth} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={emailForm.email}
                                            onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                                                value={emailForm.password}
                                                onChange={(e) => setEmailForm(prev => ({ ...prev, password: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
                                                value={emailForm.confirmPassword}
                                                onChange={(e) => setEmailForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={resetToSelection}
                                            className="flex-1 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? 'Processing...' : 
                                             authMode === 'signin' ? 'Sign In' :
                                             authMode === 'signup' ? 'Create Account' : 'Reset Password'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Success Step */}
                        {authStep === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6"
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </motion.div>
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    Authentication Successful!
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    Welcome to the Quantum Universe
                                </p>
                                <div className="text-sm text-gray-500">
                                    Redirecting to your dashboard...
                                </div>
                            </motion.div>
                        )}

                        {/* Error Display */}
                        {authError && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-400" />
                                <span className="text-red-300 text-sm">{authError}</span>
                            </motion.div>
                        )}

                        {/* Loading Overlay */}
                        {isLoading && authStep !== 'success' && (
                            <motion.div
                                className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-center">
                                    <motion.div
                                        className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <p className="text-white">Establishing quantum connection...</p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};