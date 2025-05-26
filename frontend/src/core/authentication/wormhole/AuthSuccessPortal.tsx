/**
 * Authentication Success Portal - Phase 6 Implementation
 * 
 * Provider-specific success animations and welcome sequences
 * after successful wormhole authentication transitions.
 * 
 * @version 1.0.0
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthSuccessPortalProps {
    isVisible: boolean;
    provider: 'google' | 'github' | 'supabase';
    userName?: string;
    onComplete?: () => void;
    duration?: number;
}

export const AuthSuccessPortal: React.FC<AuthSuccessPortalProps> = ({
    isVisible,
    provider,
    userName = 'Quantum Explorer',
    onComplete,
    duration = 2500
}) => {
    const [phase, setPhase] = useState<'celebration' | 'welcome' | 'integration'>('celebration');

    // Provider-specific configurations
    const providerConfig = {
        google: {
            icon: '🔍',
            color: '#4285f4',
            gradient: 'linear-gradient(135deg, #4285f4, #ea4335, #fbbc05, #34a853)',
            message: 'Google Quantum Link Established',
            particles: 20
        },
        github: {
            icon: '⚡',
            color: '#24292e',
            gradient: 'linear-gradient(135deg, #24292e, #586069, #0366d6, #28a745)',
            message: 'GitHub Neural Network Connected',
            particles: 25
        },
        supabase: {
            icon: '🚀',
            color: '#3ecf8e',
            gradient: 'linear-gradient(135deg, #3ecf8e, #1a1a1a, #f0f0f0, #3ecf8e)',
            message: 'Supabase Quantum Database Synchronized',
            particles: 30
        }
    };

    const config = providerConfig[provider];

    useEffect(() => {
        if (isVisible) {
            const phaseTimings = {
                celebration: 0,
                welcome: duration * 0.4,
                integration: duration * 0.8
            };

            Object.entries(phaseTimings).forEach(([phaseName, delay]) => {
                setTimeout(() => {
                    setPhase(phaseName as any);
                    if (phaseName === 'integration') {
                        setTimeout(() => onComplete?.(), duration * 0.2);
                    }
                }, delay);
            });
        }
    }, [isVisible, duration, onComplete]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Background Overlay */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at center, ${config.color}10 0%, rgba(0,0,0,0.8) 100%)`
                        }}
                        animate={{
                            background: [
                                `radial-gradient(circle at center, ${config.color}10 0%, rgba(0,0,0,0.8) 100%)`,
                                `radial-gradient(circle at center, ${config.color}20 0%, rgba(0,0,0,0.9) 100%)`,
                                `radial-gradient(circle at center, ${config.color}10 0%, rgba(0,0,0,0.8) 100%)`
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Celebration Phase */}
                    {phase === 'celebration' && (
                        <motion.div className="relative text-center">
                            {/* Success Burst */}
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 2, 1] }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            >
                                <div
                                    className="w-32 h-32 rounded-full"
                                    style={{
                                        background: config.gradient,
                                        boxShadow: `0 0 100px ${config.color}80`
                                    }}
                                />
                            </motion.div>

                            {/* Provider Icon */}
                            <motion.div
                                className="text-8xl mb-4"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ 
                                    type: "spring", 
                                    damping: 15, 
                                    stiffness: 300,
                                    delay: 0.5 
                                }}
                            >
                                {config.icon}
                            </motion.div>

                            {/* Success Message */}
                            <motion.h2
                                className="text-3xl font-bold text-white mb-2"
                                style={{ textShadow: `0 0 20px ${config.color}80` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                Authentication Successful!
                            </motion.h2>

                            <motion.p
                                className="text-lg"
                                style={{ color: config.color }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                            >
                                {config.message}
                            </motion.p>

                            {/* Celebration Particles */}
                            {[...Array(config.particles)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: config.color,
                                        left: '50%',
                                        top: '50%'
                                    }}
                                    animate={{
                                        x: [0, (Math.random() - 0.5) * 400],
                                        y: [0, (Math.random() - 0.5) * 400],
                                        scale: [1, 0.5, 0],
                                        opacity: [1, 0.8, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: Math.random() * 0.5,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Welcome Phase */}
                    {phase === 'welcome' && (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <motion.div
                                className="mb-6"
                                animate={{
                                    rotate: [0, 360],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <div
                                    className="w-24 h-24 rounded-full mx-auto flex items-center justify-center text-4xl"
                                    style={{
                                        background: config.gradient,
                                        boxShadow: `0 0 50px ${config.color}60`
                                    }}
                                >
                                    {config.icon}
                                </div>
                            </motion.div>

                            <motion.h2
                                className="text-4xl font-bold text-white mb-4"
                                style={{ textShadow: `0 0 20px ${config.color}80` }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Welcome, {userName}!
                            </motion.h2>

                            <motion.p
                                className="text-xl text-gray-300 mb-6"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                You have successfully entered the QuantumQoding universe
                            </motion.p>

                            {/* Quantum Field Visualization */}
                            <div className="relative">
                                {[...Array(8)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute w-1 h-16"
                                        style={{
                                            background: `linear-gradient(to top, ${config.color}, transparent)`,
                                            left: '50%',
                                            top: '50%',
                                            transformOrigin: 'bottom center',
                                            transform: `translateX(-50%) rotate(${i * 45}deg)`
                                        }}
                                        animate={{
                                            scaleY: [0, 1, 0.5, 1],
                                            opacity: [0.5, 1, 0.7, 1]
                                        }}
                                        transition={{
                                            duration: 2,
                                            delay: i * 0.1,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Integration Phase */}
                    {phase === 'integration' && (
                        <motion.div
                            className="text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="text-6xl mb-4"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, 180, 360]
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeInOut"
                                }}
                            >
                                🌌
                            </motion.div>

                            <motion.h3
                                className="text-2xl font-bold text-white mb-2"
                                style={{ textShadow: `0 0 15px ${config.color}60` }}
                            >
                                Quantum Integration Complete
                            </motion.h3>

                            <motion.p
                                className="text-lg"
                                style={{ color: config.color }}
                            >
                                Redirecting to QuantumQoding Hub...
                            </motion.p>

                            {/* Integration Progress */}
                            <motion.div
                                className="w-64 h-2 bg-gray-700 rounded-full mx-auto mt-6 overflow-hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: config.gradient }}
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthSuccessPortal;