/**
 * Simple Black Hole Portal Component - Phase 2 Implementation
 * 
 * Simplified version using CSS and Framer Motion for immediate testing
 * while Three.js dependencies are being installed.
 * 
 * @version 1.0.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// Types
interface SimpleBlackHolePortalProps {
    isLoggedIn: boolean;
    userName: string;
    onLogin: (provider: 'google' | 'github' | 'supabase') => void;
    onShowAuthModal?: () => void;
    size?: number;
}

export const SimpleBlackHolePortal: React.FC<SimpleBlackHolePortalProps> = ({
    isLoggedIn,
    userName,
    onLogin,
    onShowAuthModal,
    size = 400
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showAuthOptions, setShowAuthOptions] = useState(false);
    const controls = useAnimation();
    
    // Handle portal interaction
    const handlePortalClick = () => {
        if (!isLoggedIn) {
            setShowAuthOptions(true);
            onShowAuthModal?.();
        }
    };
    
    // Authentication provider selection
    const handleProviderSelect = (provider: 'google' | 'github' | 'supabase') => {
        onLogin(provider);
        setShowAuthOptions(false);
    };
    
    // Portal hover effects
    useEffect(() => {
        if (isHovered) {
            controls.start({
                scale: 1.1,
                transition: { duration: 0.3, ease: "easeOut" }
            });
        } else {
            controls.start({
                scale: 1,
                transition: { duration: 0.3, ease: "easeOut" }
            });
        }
    }, [isHovered, controls]);
    
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Black Hole Portal Container */}
            <motion.div
                className="relative cursor-pointer"
                style={{ width: size, height: size }}
                animate={controls}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                onClick={handlePortalClick}
            >
                {/* Event Horizon - Dark Center */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="relative w-full h-full">
                        {/* Event Horizon Core */}
                        <motion.div
                            className="absolute inset-[20%] rounded-full bg-black border-2 border-purple-500/30"
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(147, 51, 234, 0.5)',
                                    '0 0 40px rgba(147, 51, 234, 0.8)',
                                    '0 0 20px rgba(147, 51, 234, 0.5)'
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        
                        {/* Accretion Disk */}
                        <motion.div
                            className="absolute inset-[10%] rounded-full"
                            style={{
                                background: `conic-gradient(
                                    from 0deg,
                                    transparent 0deg,
                                    rgba(255, 107, 53, 0.8) 45deg,
                                    rgba(255, 165, 0, 0.6) 90deg,
                                    rgba(255, 107, 53, 0.4) 135deg,
                                    transparent 180deg,
                                    rgba(255, 107, 53, 0.2) 225deg,
                                    rgba(255, 165, 0, 0.4) 270deg,
                                    rgba(255, 107, 53, 0.6) 315deg,
                                    transparent 360deg
                                )`
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        
                        {/* Gravitational Lensing Effect */}
                        <div 
                            className="absolute inset-0 rounded-full"
                            style={{
                                background: `radial-gradient(circle at center, 
                                    transparent 15%, 
                                    rgba(147, 51, 234, 0.1) 30%, 
                                    rgba(255, 107, 53, 0.2) 50%, 
                                    rgba(147, 51, 234, 0.3) 70%, 
                                    transparent 85%
                                )`,
                                filter: 'blur(3px)'
                            }}
                        />
                        
                        {/* Hawking Radiation Particles */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transformOrigin: '0 0'
                                }}
                                animate={{
                                    x: [0, Math.cos(i * 30 * Math.PI / 180) * 200],
                                    y: [0, Math.sin(i * 30 * Math.PI / 180) * 200],
                                    opacity: [1, 0],
                                    scale: [1, 0.2]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeOut",
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                        
                        {/* Orbital Particles */}
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={`orbital-${i}`}
                                className="absolute w-1 h-1 bg-white rounded-full"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transformOrigin: '0 0'
                                }}
                                animate={{
                                    rotate: 360,
                                    x: [
                                        Math.cos(i * 45 * Math.PI / 180) * (80 + i * 10),
                                        Math.cos((i * 45 + 180) * Math.PI / 180) * (80 + i * 10)
                                    ],
                                    y: [
                                        Math.sin(i * 45 * Math.PI / 180) * (80 + i * 10),
                                        Math.sin((i * 45 + 180) * Math.PI / 180) * (80 + i * 10)
                                    ]
                                }}
                                transition={{
                                    duration: 4 + i,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        ))}
                        
                        {/* Data Stream Absorption Effect */}
                        {isHovered && [...Array(6)].map((_, i) => (
                            <motion.div
                                key={`data-${i}`}
                                className="absolute text-xs text-cyan-300 font-mono"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`
                                }}
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{
                                    x: [0, -50, -100],
                                    y: [0, -25, -50],
                                    opacity: [1, 0.5, 0],
                                    scale: [1, 0.5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: i * 0.3
                                }}
                            >
                                {['<code/>', '{data}', '[auth]', '(user)', '<portal>', '{quantum}'][i]}
                            </motion.div>
                        ))}
                    </div>
                </div>
                
                {/* Authentication Status Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {isLoggedIn ? (
                        <motion.div
                            className="text-center text-white z-10"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-lg font-semibold">Welcome</div>
                            <div className="text-sm text-cyan-300">{userName}</div>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="text-center text-white z-10"
                            animate={{ opacity: [0.7, 1, 0.7] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <div className="text-sm font-medium">Enter the Portal</div>
                            <div className="text-xs text-gray-400 mt-1">Click to authenticate</div>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            
            {/* Authentication Provider Selection Modal */}
            <AnimatePresence>
                {showAuthOptions && !isLoggedIn && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div 
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
                            onClick={() => setShowAuthOptions(false)}
                        />
                        <motion.div
                            className="relative bg-[#0a0e1f]/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
                            initial={{ scale: 0.8, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.8, y: 50, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <h3 className="text-white text-lg font-semibold mb-6 text-center">
                                Choose Authentication Portal
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { 
                                        provider: 'google' as const, 
                                        label: 'Google', 
                                        color: 'from-red-500 to-yellow-500',
                                        icon: '🔍'
                                    },
                                    { 
                                        provider: 'github' as const, 
                                        label: 'GitHub', 
                                        color: 'from-gray-600 to-gray-800',
                                        icon: '⚡'
                                    },
                                    { 
                                        provider: 'supabase' as const, 
                                        label: 'Supabase', 
                                        color: 'from-green-500 to-emerald-500',
                                        icon: '🚀'
                                    }
                                ].map(({ provider, label, color, icon }) => (
                                    <motion.button
                                        key={provider}
                                        onClick={() => handleProviderSelect(provider)}
                                        className={`w-full py-3 px-4 rounded-lg bg-gradient-to-r ${color} text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all`}
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span>{icon}</span>
                                        Sign in with {label}
                                    </motion.button>
                                ))}
                            </div>
                            <motion.button
                                onClick={() => setShowAuthOptions(false)}
                                className="mt-6 w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Cancel
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SimpleBlackHolePortal;