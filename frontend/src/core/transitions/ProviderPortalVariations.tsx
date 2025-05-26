/**
 * Provider-Specific Portal Variations - Revolutionary Implementation
 * Customized portal effects for Google, GitHub, and Supabase authentication
 * @version 1.0.0
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProviderPortalProps {
    provider: 'google' | 'github' | 'supabase';
    isActive: boolean;
    onComplete: () => void;
}

export const ProviderPortalVariations: React.FC<ProviderPortalProps> = ({ provider, isActive, onComplete }) => {
    if (!isActive) return null;

    // Google Portal Customization
    const GooglePortal = () => (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Google-themed wormhole colors */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle, rgba(66, 133, 244, 0.4) 0%, rgba(234, 67, 53, 0.3) 25%, rgba(251, 188, 5, 0.3) 50%, rgba(52, 168, 83, 0.3) 75%, transparent 100%)'
                }}
                animate={{ rotate: [0, 360], scale: [0.8, 1.2, 1] }}
                transition={{ duration: 3, ease: "easeInOut" }}
            />
            
            {/* Google logo integration particles */}
            {[...Array(16)].map((_, i) => {
                const colors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
                const color = colors[i % 4];
                const angle = (i * 22.5) * Math.PI / 180;
                const radius = 100 + Math.sin(i) * 50;
                
                return (
                    <motion.div
                        key={`google-particle-${i}`}
                        className="absolute w-3 h-3 rounded-full"
                        style={{
                            left: '50%', top: '50%',
                            backgroundColor: color,
                            boxShadow: `0 0 15px ${color}`
                        }}
                        animate={{
                            x: [0, Math.cos(angle) * radius, 0],
                            y: [0, Math.sin(angle) * radius, 0],
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.7, 1]
                        }}
                        transition={{ duration: 2, delay: i * 0.1, repeat: Infinity, ease: "easeInOut" }}
                    />
                );
            })}
        </motion.div>
    );

    // GitHub Portal Customization
    const GitHubPortal = () => (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Developer-focused portal aesthetics */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle, rgba(33, 41, 60, 0.8) 0%, rgba(13, 17, 23, 0.6) 50%, transparent 100%)'
                }}
                animate={{ scale: [0.5, 1.5, 1] }}
                transition={{ duration: 2.5, ease: "easeOut" }}
            />
            
            {/* Code-like particle streams */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={`github-stream-${i}`}
                    className="absolute"
                    style={{
                        left: `${10 + i * 7}%`, top: '0%',
                        width: '2px', height: '100%',
                        background: 'linear-gradient(to bottom, transparent, #f0f6fc, #7c3aed, transparent)',
                        opacity: 0.6
                    }}
                    animate={{
                        scaleY: [0, 1, 0],
                        opacity: [0, 0.8, 0]
                    }}
                    transition={{
                        duration: 2,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
            
            {/* GitHub Octocat integration */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <motion.div
                    className="w-16 h-16 rounded-full border-4 border-white/30"
                    style={{ backgroundColor: '#24292f' }}
                    animate={{
                        boxShadow: [
                            '0 0 20px rgba(240, 246, 252, 0.5)',
                            '0 0 40px rgba(240, 246, 252, 0.8)',
                            '0 0 20px rgba(240, 246, 252, 0.5)'
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>
        </motion.div>
    );

    // Supabase Portal Customization
    const SupabasePortal = () => (
        <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Database-themed portal effects */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle, rgba(62, 207, 142, 0.4) 0%, rgba(46, 125, 50, 0.3) 50%, transparent 100%)'
                }}
                animate={{ rotate: [0, 180, 360], scale: [0.8, 1.3, 1] }}
                transition={{ duration: 3, ease: "easeInOut" }}
            />
            
            {/* Data flow visualizations */}
            {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * Math.PI / 180;
                const startRadius = 50;
                const endRadius = 200;
                
                return (
                    <motion.div
                        key={`supabase-flow-${i}`}
                        className="absolute"
                        style={{ left: '50%', top: '50%' }}
                    >
                        {[...Array(5)].map((_, j) => (
                            <motion.div
                                key={`flow-particle-${i}-${j}`}
                                className="absolute w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: '#3ecf8e',
                                    boxShadow: '0 0 10px #3ecf8e'
                                }}
                                animate={{
                                    x: [
                                        Math.cos(angle) * startRadius,
                                        Math.cos(angle) * endRadius,
                                        Math.cos(angle) * startRadius
                                    ],
                                    y: [
                                        Math.sin(angle) * startRadius,
                                        Math.sin(angle) * endRadius,
                                        Math.sin(angle) * startRadius
                                    ],
                                    scale: [0.5, 1, 0.5],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: j * 0.3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        ))}
                    </motion.div>
                );
            })}
            
            {/* Backend-focused visual metaphors */}
            <motion.div className="absolute inset-0 flex items-center justify-center">
                {[...Array(3)].map((_, ring) => (
                    <motion.div
                        key={`supabase-ring-${ring}`}
                        className="absolute border-2 rounded-full"
                        style={{
                            width: `${(ring + 1) * 120}px`,
                            height: `${(ring + 1) * 120}px`,
                            borderColor: '#3ecf8e',
                            borderStyle: ring % 2 === 0 ? 'solid' : 'dashed'
                        }}
                        animate={{
                            rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
                            scale: [0.9, 1.1, 0.9]
                        }}
                        transition={{
                            duration: 4 + ring,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-50 pointer-events-none"
                onAnimationComplete={() => {
                    setTimeout(onComplete, 2000);
                }}
            >
                {provider === 'google' && <GooglePortal />}
                {provider === 'github' && <GitHubPortal />}
                {provider === 'supabase' && <SupabasePortal />}
                
                {/* Provider-specific completion message */}
                <motion.div
                    className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <p className="text-white text-lg font-medium">
                        {provider === 'google' && 'Connecting to Google Services...'}
                        {provider === 'github' && 'Accessing Developer Portal...'}
                        {provider === 'supabase' && 'Establishing Database Connection...'}
                    </p>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};