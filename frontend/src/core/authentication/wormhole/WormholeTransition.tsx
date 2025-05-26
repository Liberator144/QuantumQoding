/**
 * Wormhole Transition Component - Phase 6 Implementation
 * 
 * Creates immersive wormhole transition effects for authentication flows.
 * Features spacetime distortion, gravitational lensing, and dimensional gateway effects.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WormholeTransitionProps {
    isActive: boolean;
    provider?: 'google' | 'github' | 'supabase';
    onTransitionComplete?: () => void;
    onTransitionStart?: () => void;
    duration?: number;
}

export const WormholeTransition: React.FC<WormholeTransitionProps> = ({
    isActive,
    provider = 'supabase',
    onTransitionComplete,
    onTransitionStart,
    duration = 3000
}) => {
    const [phase, setPhase] = useState<'entry' | 'tunnel' | 'emergence' | 'complete'>('entry');

    // Provider-specific color schemes
    const providerColors = {
        google: {
            primary: '#4285f4',
            secondary: '#ea4335',
            accent: '#fbbc05',
            tunnel: 'linear-gradient(45deg, #4285f4, #ea4335, #fbbc05, #34a853)'
        },
        github: {
            primary: '#24292e',
            secondary: '#586069',
            accent: '#0366d6',
            tunnel: 'linear-gradient(45deg, #24292e, #586069, #0366d6, #28a745)'
        },
        supabase: {
            primary: '#3ecf8e',
            secondary: '#1a1a1a',
            accent: '#f0f0f0',
            tunnel: 'linear-gradient(45deg, #3ecf8e, #1a1a1a, #f0f0f0, #3ecf8e)'
        }
    };

    const colors = providerColors[provider];

    useEffect(() => {
        if (isActive) {
            onTransitionStart?.();
            
            // Phase progression
            const phaseTimings = {
                entry: 0,
                tunnel: duration * 0.2,
                emergence: duration * 0.7,
                complete: duration * 0.9
            };

            Object.entries(phaseTimings).forEach(([phaseName, delay]) => {
                setTimeout(() => {
                    setPhase(phaseName as any);
                    if (phaseName === 'complete') {
                        onTransitionComplete?.();
                    }
                }, delay);
            });
        }
    }, [isActive, duration, onTransitionComplete, onTransitionStart]);

    return (
        <AnimatePresence>
            {isActive && (
                <motion.div
                    className="fixed inset-0 z-[9999] pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Spacetime Distortion Background */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%)`
                        }}
                        animate={{
                            background: [
                                `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%)`,
                                `radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.95) 100%)`,
                                `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.9) 100%)`
                            ]
                        }}
                        transition={{
                            duration: duration / 1000,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Wormhole Entry Sequence */}
                    {phase === 'entry' && (
                        <motion.div className="absolute inset-0 flex items-center justify-center">
                            {/* Gravitational Lensing Effect */}
                            {[...Array(5)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute rounded-full border-2"
                                    style={{
                                        borderColor: colors.primary,
                                        width: `${(i + 1) * 100}px`,
                                        height: `${(i + 1) * 100}px`,
                                    }}
                                    initial={{
                                        scale: 0,
                                        opacity: 0,
                                        rotate: 0
                                    }}
                                    animate={{
                                        scale: [0, 1.2, 0.8, 1],
                                        opacity: [0, 0.8, 0.4, 0],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}

                            {/* Spacetime Ripples */}
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={`ripple-${i}`}
                                    className="absolute rounded-full"
                                    style={{
                                        border: `1px solid ${colors.accent}40`,
                                        width: `${50 + i * 80}px`,
                                        height: `${50 + i * 80}px`,
                                    }}
                                    animate={{
                                        scale: [1, 3, 5],
                                        opacity: [0.8, 0.3, 0],
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </motion.div>
                    )}

                    {/* Wormhole Tunnel Sequence */}
                    {phase === 'tunnel' && (
                        <motion.div className="absolute inset-0 flex items-center justify-center">
                            {/* Tunnel Structure */}
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={`tunnel-${i}`}
                                    className="absolute rounded-full"
                                    style={{
                                        border: `2px solid ${colors.primary}`,
                                        width: `${(20 - i) * 50}px`,
                                        height: `${(20 - i) * 50}px`,
                                        background: i % 3 === 0 ? `${colors.secondary}20` : 'transparent'
                                    }}
                                    initial={{
                                        scale: 0,
                                        z: -i * 100
                                    }}
                                    animate={{
                                        scale: [0, 1, 2],
                                        z: [-i * 100, 0, i * 100],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.05,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}

                            {/* Quantum Field Fluctuations */}
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={`quantum-${i}`}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: colors.accent,
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`
                                    }}
                                    animate={{
                                        x: [0, (Math.random() - 0.5) * 200],
                                        y: [0, (Math.random() - 0.5) * 200],
                                        scale: [1, 0.5, 1.5, 0],
                                        opacity: [1, 0.5, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: Math.random() * 1,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}

                            {/* Dimensional Gateway */}
                            <motion.div
                                className="absolute w-32 h-32 rounded-full"
                                style={{
                                    background: colors.tunnel,
                                    boxShadow: `0 0 100px ${colors.primary}80`
                                }}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 360],
                                    opacity: [0.8, 1, 0.8]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Wormhole Emergence Sequence */}
                    {phase === 'emergence' && (
                        <motion.div className="absolute inset-0 flex items-center justify-center">
                            {/* Reality Reconstruction */}
                            <motion.div
                                className="absolute inset-0"
                                style={{
                                    background: `radial-gradient(circle at center, ${colors.primary}20 0%, transparent 70%)`
                                }}
                                animate={{
                                    scale: [0, 2, 1],
                                    opacity: [0, 0.8, 0]
                                }}
                                transition={{
                                    duration: 1,
                                    ease: "easeOut"
                                }}
                            />

                            {/* Quantum Coherence Restoration */}
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={`coherence-${i}`}
                                    className="absolute w-1 h-20"
                                    style={{
                                        background: `linear-gradient(to bottom, ${colors.primary}, transparent)`,
                                        transformOrigin: 'bottom center',
                                        transform: `rotate(${i * 30}deg)`
                                    }}
                                    animate={{
                                        scaleY: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        delay: i * 0.05,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}

                            {/* Welcome Burst */}
                            <motion.div
                                className="absolute w-64 h-64 rounded-full"
                                style={{
                                    background: `radial-gradient(circle, ${colors.accent}40, transparent)`,
                                    border: `2px solid ${colors.primary}`
                                }}
                                initial={{
                                    scale: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    scale: [0, 1.5, 1],
                                    opacity: [0, 1, 0]
                                }}
                                transition={{
                                    duration: 1.2,
                                    ease: "easeOut"
                                }}
                            />
                        </motion.div>
                    )}

                    {/* Provider-Specific Branding Elements */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: phase === 'tunnel' ? 1 : 0,
                            scale: phase === 'tunnel' ? 1 : 0
                        }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center">
                            <div
                                className="text-2xl font-bold mb-2"
                                style={{ color: colors.primary }}
                            >
                                {provider === 'google' && '🔍 Google Portal'}
                                {provider === 'github' && '⚡ GitHub Portal'}
                                {provider === 'supabase' && '🚀 Supabase Portal'}
                            </div>
                            <div
                                className="text-sm"
                                style={{ color: colors.accent }}
                            >
                                Establishing quantum connection...
                            </div>
                        </div>
                    </motion.div>

                    {/* Transition Progress Indicator */}
                    <motion.div
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="w-64 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full rounded-full"
                                style={{
                                    background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`
                                }}
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{
                                    duration: duration / 1000,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        <div
                            className="text-center mt-2 text-sm"
                            style={{ color: colors.primary }}
                        >
                            {phase === 'entry' && 'Opening dimensional gateway...'}
                            {phase === 'tunnel' && 'Traversing quantum tunnel...'}
                            {phase === 'emergence' && 'Reconstructing reality...'}
                            {phase === 'complete' && 'Welcome to QuantumQoding!'}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default WormholeTransition;