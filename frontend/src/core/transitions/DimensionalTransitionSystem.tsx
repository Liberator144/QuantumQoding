/**
 * Dimensional Transition Effects System - Revolutionary Implementation
 * Advanced transition system for seamless authentication to application flow
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DimensionalTransitionProps {
    isActive: boolean;
    transitionType: 'login' | 'register' | 'logout';
    userName?: string;
    onTransitionComplete: () => void;
}

interface TransitionPhase {
    name: string;
    duration: number;
    effects: string[];
}

export const DimensionalTransitionSystem: React.FC<DimensionalTransitionProps> = ({
    isActive, transitionType, userName = 'Quantum Explorer', onTransitionComplete
}) => {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Transition phases for seamless authentication flow
    const transitionPhases: TransitionPhase[] = [
        { name: 'Wormhole Exit', duration: 1500, effects: ['dimensional-fabric', 'spacetime-weaving'] },
        { name: 'Reality Reconstruction', duration: 2000, effects: ['matter-materialization', 'field-stabilization'] },
        { name: 'Quantum Coherence Restoration', duration: 1800, effects: ['state-synchronization', 'wave-propagation'] },
        { name: 'Personalized Welcome', duration: 2200, effects: ['user-signature', 'preference-adaptation'] },
        { name: 'Hub Integration', duration: 1000, effects: ['orbital-activation', 'particle-synchronization'] }
    ];

    // Start transition sequence
    useEffect(() => {
        if (isActive) {
            setIsTransitioning(true);
            setCurrentPhase(0);
            
            let phaseIndex = 0;
            const executePhase = () => {
                if (phaseIndex < transitionPhases.length) {
                    setCurrentPhase(phaseIndex);
                    setTimeout(() => {
                        phaseIndex++;
                        executePhase();
                    }, transitionPhases[phaseIndex].duration);
                } else {
                    setIsTransitioning(false);
                    onTransitionComplete();
                }
            };
            
            executePhase();
        }
    }, [isActive]);

    if (!isActive || !isTransitioning) return null;

    const currentPhaseData = transitionPhases[currentPhase];

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Phase 1: Wormhole Exit to Hub */}
                {currentPhase === 0 && (
                    <motion.div className="absolute inset-0">
                        {/* Dimensional Fabric Reconstruction */}
                        <motion.div
                            className="absolute inset-0"
                            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)' }}
                            animate={{ scale: [0, 2, 1], opacity: [1, 0.5, 0] }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        
                        {/* Spacetime Fabric Weaving */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={`fabric-${i}`}
                                className="absolute"
                                style={{
                                    left: '50%', top: '50%', width: '2px', height: '100vh',
                                    background: 'linear-gradient(to bottom, transparent, #8b5cf6, transparent)',
                                    transformOrigin: 'center center', transform: `rotate(${i * 30}deg)`
                                }}
                                initial={{ scaleY: 0, opacity: 0 }}
                                animate={{ scaleY: [0, 1, 0], opacity: [0, 0.8, 0] }}
                                transition={{ duration: 1.5, delay: i * 0.1, ease: "easeInOut" }}
                            />
                        ))}
                    </motion.div>
                )}

                {/* Phase 2: Reality Reconstruction */}
                {currentPhase === 1 && (
                    <motion.div className="absolute inset-0">
                        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={`matter-${i}`}
                                    className="absolute w-4 h-4 rounded-full"
                                    style={{
                                        background: `hsl(${240 + i * 6}, 80%, 70%)`,
                                        boxShadow: `0 0 20px hsl(${240 + i * 6}, 80%, 70%)`
                                    }}
                                    initial={{
                                        x: (Math.random() - 0.5) * window.innerWidth,
                                        y: (Math.random() - 0.5) * window.innerHeight,
                                        scale: 0
                                    }}
                                    animate={{ x: 0, y: 0, scale: [0, 1.5, 0] }}
                                    transition={{ duration: 2, delay: i * 0.1, ease: "easeInOut" }}
                                />
                            ))}
                        </motion.div>
                        
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: 'conic-gradient(from 0deg, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ef4444, #8b5cf6)',
                                filter: 'blur(50px)', opacity: 0.3
                            }}
                            animate={{ rotate: [0, 360], scale: [0.5, 1.2, 0.8] }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}

                {/* Phase 3: Quantum Coherence Restoration */}
                {currentPhase === 2 && (
                    <motion.div className="absolute inset-0">
                        <motion.div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(3)].map((_, ring) => (
                                <motion.div
                                    key={`sync-ring-${ring}`}
                                    className="absolute border-2 rounded-full"
                                    style={{
                                        width: `${(ring + 1) * 200}px`, height: `${(ring + 1) * 200}px`,
                                        borderColor: `hsl(${240 + ring * 60}, 80%, 70%)`, borderStyle: 'dashed'
                                    }}
                                    animate={{ rotate: [0, 360], scale: [0.8, 1.1, 0.9] }}
                                    transition={{ duration: 1.8, delay: ring * 0.2, ease: "easeInOut" }}
                                />
                            ))}
                        </motion.div>
                        
                        <motion.div
                            className="absolute inset-0"
                            style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4) 0%, transparent 50%)' }}
                            animate={{ scale: [0, 3, 0], opacity: [0, 0.8, 0] }}
                            transition={{ duration: 1.8, repeat: 2, ease: "easeOut" }}
                        />
                    </motion.div>
                )}

                {/* Phase 4: Personalized Welcome */}
                {currentPhase === 3 && (
                    <motion.div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className="text-center space-y-6"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.h1
                                className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            >
                                Welcome, {userName}
                            </motion.h1>
                            
                            <motion.div
                                className="flex justify-center space-x-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.8 }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <motion.div
                                        key={`signature-${i}`}
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            background: `hsl(${i * 72}, 80%, 70%)`,
                                            boxShadow: `0 0 15px hsl(${i * 72}, 80%, 70%)`
                                        }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                ))}
                            </motion.div>
                            
                            <motion.p
                                className="text-gray-300 text-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5, duration: 0.8 }}
                            >
                                Quantum coherence established
                            </motion.p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Phase 5: Hub Integration */}
                {currentPhase === 4 && (
                    <motion.div className="absolute inset-0">
                        <motion.div className="absolute inset-0 flex items-center justify-center">
                            {[...Array(9)].map((_, i) => {
                                const angle = (i * 40) * Math.PI / 180;
                                const radius = 150 + (i % 3) * 80;
                                const x = Math.cos(angle) * radius;
                                const y = Math.sin(angle) * radius;
                                
                                return (
                                    <motion.div
                                        key={`orbital-${i}`}
                                        className="absolute w-6 h-6 rounded-full"
                                        style={{
                                            background: `hsl(${i * 40}, 80%, 70%)`,
                                            boxShadow: `0 0 20px hsl(${i * 40}, 80%, 70%)`
                                        }}
                                        initial={{ x: 0, y: 0, scale: 0 }}
                                        animate={{ x: x, y: y, scale: [0, 1.2, 1] }}
                                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                    />
                                );
                            })}
                        </motion.div>
                        
                        <motion.div
                            className="absolute inset-0"
                            style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)' }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0] }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </motion.div>
                )}

                {/* Phase Progress Indicator */}
                <motion.div
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center space-y-2">
                        <p className="text-white text-sm font-medium">{currentPhaseData.name}</p>
                        <div className="flex space-x-2">
                            {transitionPhases.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        i <= currentPhase ? 'bg-purple-400' : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};