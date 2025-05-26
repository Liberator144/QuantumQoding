/**
 * Authentication Callback Screen - Phase 3 Implementation
 * 
 * Handles OAuth callback redirects from Google and GitHub.
 * Processes authentication tokens and redirects to appropriate pages.
 * 
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase/client';

export const AuthCallbackScreen: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Processing authentication...');

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                // Handle the OAuth callback
                const { data, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Auth callback error:', error);
                    setStatus('error');
                    setMessage('Authentication failed. Please try again.');
                    
                    // Redirect to login after delay
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                    return;
                }

                if (data.session) {
                    setStatus('success');
                    setMessage('Authentication successful! Redirecting...');
                    
                    // Redirect to hub after successful authentication
                    setTimeout(() => {
                        navigate('/');
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage('No session found. Please try logging in again.');
                    
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                }
            } catch (error) {
                console.error('Unexpected error during auth callback:', error);
                setStatus('error');
                setMessage('An unexpected error occurred. Please try again.');
                
                setTimeout(() => {
                    navigate('/auth/login');
                }, 3000);
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#050714] flex items-center justify-center">
            <motion.div
                className="text-center max-w-md mx-auto p-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Loading Animation */}
                {status === 'processing' && (
                    <div className="mb-6">
                        <div className="relative w-16 h-16 mx-auto">
                            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                )}

                {/* Success Animation */}
                {status === 'success' && (
                    <motion.div
                        className="mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                        <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </motion.div>
                )}

                {/* Error Animation */}
                {status === 'error' && (
                    <motion.div
                        className="mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    >
                        <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </motion.div>
                )}

                {/* Status Message */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    {status === 'processing' && 'Quantum Authentication'}
                    {status === 'success' && 'Welcome to QuantumQoding!'}
                    {status === 'error' && 'Authentication Error'}
                </h2>

                <p className="text-gray-400 mb-6">
                    {message}
                </p>

                {/* Progress Indicator */}
                {status === 'processing' && (
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "easeInOut" }}
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default AuthCallbackScreen;