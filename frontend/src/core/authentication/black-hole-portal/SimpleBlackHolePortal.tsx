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
    const [showWormhole, setShowWormhole] = useState(false);
    const [wormholePhase, setWormholePhase] = useState<'entrance' | 'tunnel' | 'exit' | 'complete'>('entrance');
    const controls = useAnimation();
    
    // Handle portal interaction
    const handlePortalClick = () => {
        if (!isLoggedIn) {
            setShowAuthOptions(true);
            onShowAuthModal?.();
        }
    };
    
    // Wormhole transition sequence
    const triggerWormholeTransition = (provider: 'google' | 'github' | 'supabase') => {
        setShowWormhole(true);
        setWormholePhase('entrance');
        
        // Sequence the wormhole phases
        setTimeout(() => setWormholePhase('tunnel'), 500);
        setTimeout(() => setWormholePhase('exit'), 2000);
        setTimeout(() => {
            setWormholePhase('complete');
            onLogin(provider);
            setShowAuthOptions(false);
            setShowWormhole(false);
        }, 3500);
    };

    // Authentication provider selection with wormhole effects
    const handleProviderSelect = (provider: 'google' | 'github' | 'supabase') => {
        if (provider === 'supabase') {
            // For Supabase, show the traditional login modal instead of OAuth redirect
            setShowAuthOptions(false);
            onShowAuthModal?.();
        } else {
            // For OAuth providers, trigger wormhole transition
            triggerWormholeTransition(provider);
        }
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
                        
                        {/* Enhanced Data Stream Absorption Effect with Color Transitions */}
                        {isHovered && [...Array(12)].map((_, i) => {
                            const codeSnippets = [
                                '<code/>', '{data}', '[auth]', '(user)', '<portal>', '{quantum}',
                                'async()', 'await', 'const', 'function', 'return', 'export'
                            ];
                            const colors = [
                                '#00ffff', '#ff6b35', '#9333ea', '#06b6d4', '#f59e0b', '#ef4444',
                                '#10b981', '#8b5cf6', '#f97316', '#3b82f6', '#ec4899', '#84cc16'
                            ];
                            const angle = (i * 30) * Math.PI / 180;
                            const startRadius = 150 + Math.random() * 50;
                            const startX = Math.cos(angle) * startRadius;
                            const startY = Math.sin(angle) * startRadius;
                            
                            return (
                                <motion.div
                                    key={`data-${i}`}
                                    className="absolute text-xs font-mono pointer-events-none font-bold"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate(${startX}px, ${startY}px)`,
                                        color: colors[i],
                                        textShadow: `0 0 10px ${colors[i]}40`
                                    }}
                                    initial={{ 
                                        opacity: 1, 
                                        scale: 1,
                                        x: 0,
                                        y: 0,
                                        rotate: 0
                                    }}
                                    animate={{
                                        x: [-startX * 0.8, -startX * 0.4, 0],
                                        y: [-startY * 0.8, -startY * 0.4, 0],
                                        opacity: [1, 0.8, 0.5, 0],
                                        scale: [1, 0.8, 0.4, 0.1],
                                        rotate: [0, 180, 360, 540],
                                        color: [colors[i], '#ffffff', colors[(i + 6) % 12], '#00000000']
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        delay: i * 0.25,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                    exit={{
                                        scale: 0,
                                        opacity: 0,
                                        transition: { duration: 0.5 }
                                    }}
                                >
                                    {codeSnippets[i]}
                                    
                                    {/* Stardust Crumbling Effect */}
                                    {[...Array(3)].map((_, dustIndex) => (
                                        <motion.div
                                            key={`dust-${i}-${dustIndex}`}
                                            className="absolute w-1 h-1 rounded-full pointer-events-none"
                                            style={{
                                                background: colors[i],
                                                left: `${Math.random() * 20 - 10}px`,
                                                top: `${Math.random() * 20 - 10}px`
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0],
                                                x: [0, (Math.random() - 0.5) * 40],
                                                y: [0, (Math.random() - 0.5) * 40]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.25 + 2 + dustIndex * 0.1,
                                                ease: "easeOut"
                                            }}
                                        />
                                    ))}
                                </motion.div>
                            );
                        })}
                        
                        {/* Optimized Cosmic Dust and Debris Absorption */}
                        {isHovered && [...Array(15)].map((_, i) => {
                            const angle = Math.random() * 360 * Math.PI / 180;
                            const startRadius = 180 + Math.random() * 80;
                            const startX = Math.cos(angle) * startRadius;
                            const startY = Math.sin(angle) * startRadius;
                            const particleSize = 1 + Math.random() * 2;
                            const hue = 180 + Math.random() * 80;
                            
                            return (
                                <motion.div
                                    key={`cosmic-${i}`}
                                    className="absolute rounded-full pointer-events-none"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        width: `${particleSize}px`,
                                        height: `${particleSize}px`,
                                        background: `hsl(${hue}, 70%, 60%)`,
                                        transform: `translate3d(${startX}px, ${startY}px, 0)`,
                                        boxShadow: `0 0 ${particleSize * 2}px hsl(${hue}, 70%, 60%)`
                                    }}
                                    initial={{ 
                                        opacity: 0.9, 
                                        scale: 1,
                                        x: 0,
                                        y: 0
                                    }}
                                    animate={{
                                        x: [-startX * 0.9, -startX * 0.6, -startX * 0.2, 0],
                                        y: [-startY * 0.9, -startY * 0.6, -startY * 0.2, 0],
                                        opacity: [0.9, 0.7, 0.4, 0],
                                        scale: [1, 0.8, 0.5, 0.1]
                                    }}
                                    transition={{
                                        duration: 2.5 + Math.random() * 1.5,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                />
                            );
                        })}
                        
                        {/* Optimized Data Stream Convergence */}
                        {isHovered && [...Array(6)].map((_, i) => {
                            const streamAngle = (i * 60) * Math.PI / 180;
                            const streamLength = 160;
                            
                            return (
                                <motion.div
                                    key={`stream-${i}`}
                                    className="absolute pointer-events-none"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        width: '3px',
                                        height: `${streamLength}px`,
                                        background: `linear-gradient(to bottom, 
                                            rgba(56, 189, 248, 0.9), 
                                            rgba(147, 51, 234, 0.7), 
                                            rgba(255, 107, 53, 0.5),
                                            transparent)`,
                                        transformOrigin: 'bottom center',
                                        transform: `rotate(${i * 60}deg) translateY(-${streamLength/2}px)`,
                                        filter: 'blur(0.5px)'
                                    }}
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{
                                        scaleY: [0, 1.2, 0.9, 0],
                                        opacity: [0, 0.9, 0.7, 0],
                                        filter: ['blur(2px)', 'blur(0.5px)', 'blur(1px)', 'blur(3px)']
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                />
                            );
                        })}
                        
                        {/* Advanced Information Compression Visualization */}
                        {isHovered && (
                            <>
                                {/* Data Density Compression Rings */}
                                {[...Array(5)].map((_, ringIndex) => (
                                    <motion.div
                                        key={`compression-ring-${ringIndex}`}
                                        className="absolute rounded-full border pointer-events-none"
                                        style={{
                                            inset: `${15 + ringIndex * 8}%`,
                                            borderWidth: `${3 - ringIndex * 0.4}px`,
                                            borderColor: `hsl(${200 + ringIndex * 30}, 70%, ${60 + ringIndex * 8}%)`
                                        }}
                                        initial={{ scale: 3, opacity: 0 }}
                                        animate={{
                                            scale: [3, 2, 1.2, 0.6],
                                            opacity: [0, 0.4, 0.8, 0],
                                            borderColor: [
                                                `hsl(${200 + ringIndex * 30}, 70%, ${60 + ringIndex * 8}%)`,
                                                `hsl(${250 + ringIndex * 20}, 80%, ${70 + ringIndex * 5}%)`,
                                                `hsl(${300 + ringIndex * 15}, 90%, ${80 + ringIndex * 3}%)`,
                                                `hsl(${200 + ringIndex * 30}, 70%, 0%)`
                                            ]
                                        }}
                                        transition={{
                                            duration: 4 + ringIndex * 0.5,
                                            repeat: Infinity,
                                            delay: ringIndex * 0.3,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                    />
                                ))}
                                
                                {/* Advanced Compression Ratio Indicators with Data Density */}
                                {[...Array(8)].map((_, indicatorIndex) => {
                                    const angle = (indicatorIndex * 45) * Math.PI / 180;
                                    const radius = 80;
                                    const x = Math.cos(angle) * radius;
                                    const y = Math.sin(angle) * radius;
                                    const compressionRatio = ['2:1', '4:1', '8:1', '16:1', '32:1', '64:1', '128:1', '∞:1'][indicatorIndex];
                                    const dataDensity = ['2KB', '8KB', '32KB', '128KB', '512KB', '2MB', '8MB', '∞MB'][indicatorIndex];
                                    const efficiency = [25, 50, 75, 85, 92, 96, 98, 100][indicatorIndex];
                                    
                                    return (
                                        <motion.div
                                            key={`compression-indicator-${indicatorIndex}`}
                                            className="absolute text-xs font-mono font-bold pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(${x}px, ${y}px)`,
                                                color: `hsl(${120 + indicatorIndex * 30}, 80%, 70%)`,
                                                textShadow: `0 0 8px hsl(${120 + indicatorIndex * 30}, 80%, 70%)`
                                            }}
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={{
                                                opacity: [0, 1, 0.8, 0],
                                                scale: [0, 1.2, 1, 0.8],
                                                color: [
                                                    `hsl(${120 + indicatorIndex * 30}, 80%, 70%)`,
                                                    `hsl(${180 + indicatorIndex * 20}, 90%, 80%)`,
                                                    `hsl(${240 + indicatorIndex * 15}, 95%, 85%)`,
                                                    `hsl(${120 + indicatorIndex * 30}, 80%, 0%)`
                                                ]
                                            }}
                                            transition={{
                                                duration: 3.5,
                                                repeat: Infinity,
                                                delay: indicatorIndex * 0.2,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <div className="text-center">
                                                <div className="text-xs">{compressionRatio}</div>
                                                <div className="text-[10px] opacity-70">{dataDensity}</div>
                                                <div className="text-[8px] opacity-50">{efficiency}%</div>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                {/* Real-time Data Density Visualization */}
                                {[...Array(12)].map((_, densityIndex) => {
                                    const densityAngle = (densityIndex * 30) * Math.PI / 180;
                                    const densityRadius = 60 + Math.sin(Date.now() * 0.001 + densityIndex) * 10;
                                    const densityX = Math.cos(densityAngle) * densityRadius;
                                    const densityY = Math.sin(densityAngle) * densityRadius;
                                    
                                    return (
                                        <motion.div
                                            key={`density-${densityIndex}`}
                                            className="absolute w-1 h-1 rounded-full pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                background: `hsl(${densityIndex * 30}, 90%, 70%)`,
                                                boxShadow: `0 0 6px hsl(${densityIndex * 30}, 90%, 70%)`
                                            }}
                                            animate={{
                                                x: [densityX, densityX * 0.5, 0],
                                                y: [densityY, densityY * 0.5, 0],
                                                opacity: [1, 0.7, 0],
                                                scale: [1, 1.5, 0.1]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: densityIndex * 0.1,
                                                ease: [0.4, 0, 0.2, 1]
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Information State Change Effects */}
                                {[...Array(12)].map((_, stateIndex) => {
                                    const stateAngle = (stateIndex * 30) * Math.PI / 180;
                                    const stateRadius = 60 + Math.sin(stateIndex * 0.5) * 20;
                                    const stateX = Math.cos(stateAngle) * stateRadius;
                                    const stateY = Math.sin(stateAngle) * stateRadius;
                                    
                                    return (
                                        <motion.div
                                            key={`state-change-${stateIndex}`}
                                            className="absolute w-2 h-2 rounded-full pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                background: `hsl(${stateIndex * 30}, 90%, 70%)`,
                                                boxShadow: `0 0 12px hsl(${stateIndex * 30}, 90%, 70%)`
                                            }}
                                            initial={{ 
                                                x: stateX, 
                                                y: stateY, 
                                                opacity: 1, 
                                                scale: 1 
                                            }}
                                            animate={{
                                                x: [stateX, stateX * 0.5, 0],
                                                y: [stateY, stateY * 0.5, 0],
                                                opacity: [1, 0.7, 0],
                                                scale: [1, 1.5, 0.1],
                                                background: [
                                                    `hsl(${stateIndex * 30}, 90%, 70%)`,
                                                    `hsl(${(stateIndex * 30 + 120) % 360}, 95%, 80%)`,
                                                    `hsl(${(stateIndex * 30 + 240) % 360}, 100%, 90%)`
                                                ]
                                            }}
                                            transition={{
                                                duration: 2.8,
                                                repeat: Infinity,
                                                delay: stateIndex * 0.15,
                                                ease: [0.4, 0, 0.2, 1]
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Advanced Compression Efficiency Feedback System */}
                                <motion.div
                                    className="absolute inset-[35%] rounded-full pointer-events-none"
                                    style={{
                                        background: 'conic-gradient(from 0deg, #ff6b35, #9333ea, #06b6d4, #10b981, #f59e0b, #ff6b35)',
                                        filter: 'blur(8px)'
                                    }}
                                    animate={{
                                        rotate: [0, 360],
                                        opacity: [0.3, 0.7, 0.3],
                                        scale: [0.8, 1.2, 0.8]
                                    }}
                                    transition={{
                                        duration: 6,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />

                                {/* Compression Efficiency Meters */}
                                {[...Array(4)].map((_, meterIndex) => {
                                    const meterAngle = (meterIndex * 90) * Math.PI / 180;
                                    const meterRadius = 45;
                                    const meterX = Math.cos(meterAngle) * meterRadius;
                                    const meterY = Math.sin(meterAngle) * meterRadius;
                                    const efficiency = [85, 92, 96, 99][meterIndex];
                                    
                                    return (
                                        <motion.div
                                            key={`efficiency-meter-${meterIndex}`}
                                            className="absolute w-8 h-1 pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                transform: `translate(${meterX}px, ${meterY}px) rotate(${meterIndex * 90}deg)`,
                                                background: `linear-gradient(to right, 
                                                    hsl(${efficiency * 1.2}, 80%, 60%) 0%, 
                                                    hsl(${efficiency * 1.2}, 80%, 60%) ${efficiency}%, 
                                                    rgba(255,255,255,0.2) ${efficiency}%)`
                                            }}
                                            animate={{
                                                opacity: [0.5, 1, 0.5],
                                                scale: [1, 1.1, 1]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                delay: meterIndex * 0.3,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    );
                                })}

                                {/* Data Flow Efficiency Indicators */}
                                {[...Array(6)].map((_, flowIndex) => {
                                    const flowAngle = (flowIndex * 60) * Math.PI / 180;
                                    const flowRadius = 70;
                                    const flowX = Math.cos(flowAngle) * flowRadius;
                                    const flowY = Math.sin(flowAngle) * flowRadius;
                                    
                                    return (
                                        <motion.div
                                            key={`flow-indicator-${flowIndex}`}
                                            className="absolute w-2 h-6 pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                background: `linear-gradient(to bottom, 
                                                    hsl(${120 + flowIndex * 40}, 80%, 70%), 
                                                    transparent)`,
                                                transformOrigin: 'center bottom',
                                                transform: `translate(${flowX}px, ${flowY}px) rotate(${flowAngle * 180 / Math.PI}deg)`
                                            }}
                                            animate={{
                                                scaleY: [0, 1, 0.7, 0],
                                                opacity: [0, 0.8, 0.6, 0]
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: flowIndex * 0.2,
                                                ease: "easeOut"
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Decompression Visualization for Data Retrieval */}
                                {[...Array(6)].map((_, decompIndex) => (
                                    <motion.div
                                        key={`decomp-${decompIndex}`}
                                        className="absolute w-1 h-8 pointer-events-none"
                                        style={{
                                            left: '50%',
                                            top: '50%',
                                            background: `linear-gradient(to top, 
                                                hsl(${decompIndex * 60}, 80%, 60%), 
                                                transparent)`,
                                            transformOrigin: 'bottom center',
                                            transform: `rotate(${decompIndex * 60}deg) translateY(-20px)`
                                        }}
                                        animate={{
                                            scaleY: [0, 1, 0.7, 0],
                                            opacity: [0, 0.8, 0.6, 0],
                                            scaleX: [1, 1.5, 1, 0.5]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            delay: decompIndex * 0.4 + 1,
                                            ease: "easeOut"
                                        }}
                                    />
                                ))}
                            </>
                        )}
                        
                        {/* Advanced Quantum Information Preservation Display */}
                        {isHovered && (
                            <>
                                {/* Quantum State Preservation Indicators */}
                                {[...Array(8)].map((_, quantumIndex) => {
                                    const quantumAngle = (quantumIndex * 45) * Math.PI / 180;
                                    const quantumRadius = 70;
                                    const quantumX = Math.cos(quantumAngle) * quantumRadius;
                                    const quantumY = Math.sin(quantumAngle) * quantumRadius;
                                    
                                    return (
                                        <motion.div
                                            key={`quantum-state-${quantumIndex}`}
                                            className="absolute w-3 h-3 rounded-full pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                background: `radial-gradient(circle, 
                                                    hsl(${270 + quantumIndex * 15}, 90%, 70%), 
                                                    hsl(${270 + quantumIndex * 15}, 70%, 40%))`,
                                                boxShadow: `0 0 15px hsl(${270 + quantumIndex * 15}, 90%, 70%)`
                                            }}
                                            animate={{
                                                x: [quantumX, -quantumX, quantumX],
                                                y: [quantumY, -quantumY, quantumY],
                                                opacity: [1, 0.6, 1],
                                                scale: [1, 1.8, 1],
                                                rotate: [0, 180, 360]
                                            }}
                                            transition={{
                                                duration: 5 + quantumIndex * 0.3,
                                                repeat: Infinity,
                                                delay: quantumIndex * 0.4,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Information Entanglement Visualization */}
                                {[...Array(4)].map((_, entangleIndex) => {
                                    const entangleAngle1 = (entangleIndex * 90) * Math.PI / 180;
                                    const entangleAngle2 = ((entangleIndex * 90) + 180) * Math.PI / 180;
                                    const entangleRadius = 85;
                                    
                                    return (
                                        <motion.div
                                            key={`entanglement-${entangleIndex}`}
                                            className="absolute pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                width: '2px',
                                                height: `${entangleRadius * 2}px`,
                                                background: `linear-gradient(to bottom,
                                                    hsl(${300 + entangleIndex * 20}, 80%, 60%),
                                                    transparent,
                                                    hsl(${300 + entangleIndex * 20}, 80%, 60%))`,
                                                transformOrigin: 'center center',
                                                transform: `rotate(${entangleIndex * 90}deg) translateY(-${entangleRadius}px)`
                                            }}
                                            animate={{
                                                opacity: [0.3, 0.9, 0.3],
                                                scaleY: [0.5, 1.2, 0.5],
                                                rotate: [entangleIndex * 90, entangleIndex * 90 + 360]
                                            }}
                                            transition={{
                                                duration: 4,
                                                repeat: Infinity,
                                                delay: entangleIndex * 0.5,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Hawking Radiation Information Recovery Effects */}
                                {[...Array(16)].map((_, hawkingIndex) => {
                                    const hawkingAngle = (hawkingIndex * 22.5) * Math.PI / 180;
                                    const hawkingRadius = 95 + Math.random() * 20;
                                    const hawkingX = Math.cos(hawkingAngle) * hawkingRadius;
                                    const hawkingY = Math.sin(hawkingAngle) * hawkingRadius;
                                    
                                    return (
                                        <motion.div
                                            key={`hawking-${hawkingIndex}`}
                                            className="absolute w-1 h-1 rounded-full pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                background: `hsl(${60 + hawkingIndex * 10}, 90%, 80%)`,
                                                boxShadow: `0 0 8px hsl(${60 + hawkingIndex * 10}, 90%, 80%)`
                                            }}
                                            initial={{
                                                x: 0,
                                                y: 0,
                                                opacity: 0,
                                                scale: 0
                                            }}
                                            animate={{
                                                x: [0, hawkingX * 0.3, hawkingX],
                                                y: [0, hawkingY * 0.3, hawkingY],
                                                opacity: [0, 0.8, 0],
                                                scale: [0, 1.5, 0.5]
                                            }}
                                            transition={{
                                                duration: 3.5,
                                                repeat: Infinity,
                                                delay: hawkingIndex * 0.1,
                                                ease: [0.4, 0, 0.2, 1]
                                            }}
                                        />
                                    );
                                })}
                                
                                {/* Quantum Coherence Preservation Animations */}
                                {[...Array(3)].map((_, coherenceIndex) => (
                                    <motion.div
                                        key={`coherence-${coherenceIndex}`}
                                        className="absolute rounded-full border-2 pointer-events-none"
                                        style={{
                                            inset: `${20 + coherenceIndex * 15}%`,
                                            borderColor: `hsl(${240 + coherenceIndex * 40}, 80%, 60%)`,
                                            borderStyle: 'dashed'
                                        }}
                                        animate={{
                                            rotate: [0, 360],
                                            borderColor: [
                                                `hsl(${240 + coherenceIndex * 40}, 80%, 60%)`,
                                                `hsl(${280 + coherenceIndex * 40}, 90%, 70%)`,
                                                `hsl(${320 + coherenceIndex * 40}, 95%, 80%)`,
                                                `hsl(${240 + coherenceIndex * 40}, 80%, 60%)`
                                            ],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 8 - coherenceIndex * 1.5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                    />
                                ))}
                                
                                {/* Subtle Information Integrity Indicator */}
                                <motion.div
                                    className="absolute inset-[47%] flex items-center justify-center pointer-events-none"
                                    animate={{
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [0.95, 1.05, 0.95]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-green-400/60 shadow-lg shadow-green-400/30"></div>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>
                
                {/* Wormhole Transition Effects */}
                <AnimatePresence>
                    {showWormhole && (
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Wormhole Tunnel Entrance Animation */}
                            {wormholePhase === 'entrance' && (
                                <>
                                    {[...Array(12)].map((_, ringIndex) => (
                                        <motion.div
                                            key={`wormhole-entrance-${ringIndex}`}
                                            className="absolute rounded-full border-4 pointer-events-none"
                                            style={{
                                                inset: `${ringIndex * 5}%`,
                                                borderColor: `hsl(${280 + ringIndex * 10}, 90%, ${70 - ringIndex * 3}%)`,
                                                borderStyle: 'solid'
                                            }}
                                            initial={{ scale: 0, opacity: 0, rotate: 0 }}
                                            animate={{
                                                scale: [0, 1.2, 1],
                                                opacity: [0, 0.8, 0.6],
                                                rotate: [0, 180, 360]
                                            }}
                                            transition={{
                                                duration: 0.5,
                                                delay: ringIndex * 0.03,
                                                ease: [0.25, 0.46, 0.45, 0.94]
                                            }}
                                        />
                                    ))}
                                </>
                            )}
                            
                            {/* Spacetime Curvature Visual Effects */}
                            {wormholePhase === 'tunnel' && (
                                <>
                                    {[...Array(20)].map((_, curvatureIndex) => (
                                        <motion.div
                                            key={`spacetime-${curvatureIndex}`}
                                            className="absolute pointer-events-none"
                                            style={{
                                                left: '50%',
                                                top: '50%',
                                                width: '4px',
                                                height: `${100 + curvatureIndex * 10}px`,
                                                background: `linear-gradient(to bottom,
                                                    hsl(${240 + curvatureIndex * 8}, 80%, 60%),
                                                    transparent,
                                                    hsl(${240 + curvatureIndex * 8}, 80%, 60%))`,
                                                transformOrigin: 'center center',
                                                transform: `rotate(${curvatureIndex * 18}deg)`
                                            }}
                                            initial={{ scaleY: 0, opacity: 0 }}
                                            animate={{
                                                scaleY: [0, 1.5, 1, 0],
                                                opacity: [0, 0.8, 0.6, 0],
                                                rotate: [curvatureIndex * 18, curvatureIndex * 18 + 720]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                delay: curvatureIndex * 0.05,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    ))}
                                    
                                    {/* Dimensional Gateway Opening Sequence */}
                                    <motion.div
                                        className="absolute inset-[10%] rounded-full pointer-events-none"
                                        style={{
                                            background: 'conic-gradient(from 0deg, #ff6b35, #9333ea, #06b6d4, #10b981, #f59e0b, #ef4444, #8b5cf6, #ff6b35)',
                                            filter: 'blur(20px)'
                                        }}
                                        animate={{
                                            rotate: [0, 1080],
                                            scale: [0.5, 1.5, 0.8],
                                            opacity: [0.3, 0.9, 0.5]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                    />
                                </>
                            )}
                            
                            {/* Emergence from Wormhole Exit Sequence */}
                            {wormholePhase === 'exit' && (
                                <motion.div
                                    className="absolute inset-0 rounded-full pointer-events-none"
                                    style={{
                                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(56, 189, 248, 0.7) 30%, rgba(147, 51, 234, 0.5) 60%, transparent 100%)'
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{
                                        scale: [0, 2, 1],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        ease: [0.25, 0.46, 0.45, 0.94]
                                    }}
                                />
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
                
                {/* Authentication Status Display */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isLoggedIn ? (
                        <motion.div
                            className="text-center text-white z-10 pointer-events-none"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="text-lg font-semibold">Welcome</div>
                            <div className="text-sm text-cyan-300">{userName}</div>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {!isHovered && (
                                <motion.div
                                    className="text-center text-white z-10 pointer-events-none"
                                    initial={{ opacity: 0.7 }}
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.8,
                                        filter: 'blur(10px)',
                                        rotateX: 90,
                                        y: -20
                                    }}
                                    transition={{
                                        opacity: {
                                            duration: 2,
                                            repeat: Infinity
                                        },
                                        exit: {
                                            duration: 0.8,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }
                                    }}
                                >
                                    <motion.div 
                                        className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                                        exit={{
                                            y: -15,
                                            opacity: 0,
                                            scale: 0.5,
                                            filter: 'blur(8px)'
                                        }}
                                    >
                                        Enter The Quantum Core
                                    </motion.div>
                                    <motion.div 
                                        className="text-xs text-gray-300 mt-2 font-medium"
                                        exit={{
                                            y: 15,
                                            opacity: 0,
                                            scale: 0.5,
                                            filter: 'blur(8px)'
                                        }}
                                    >
                                        Click to authenticate
                                    </motion.div>
                                </motion.div>
                            )}
                            
                            {/* Quantum Dissolution Particles */}
                            {isHovered && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    {[...Array(25)].map((_, i) => {
                                        const angle = (i * 14.4) * Math.PI / 180;
                                        const radius = 40 + Math.random() * 60;
                                        const x = Math.cos(angle) * radius;
                                        const y = Math.sin(angle) * radius;
                                        
                                        return (
                                            <motion.div
                                                key={`text-dissolution-${i}`}
                                                className="absolute w-1.5 h-1.5 rounded-full"
                                                style={{
                                                    left: '50%',
                                                    top: '50%',
                                                    background: `hsl(${250 + i * 6}, 80%, 70%)`,
                                                    boxShadow: `0 0 8px hsl(${250 + i * 6}, 80%, 70%)`
                                                }}
                                                initial={{
                                                    x: 0,
                                                    y: 0,
                                                    opacity: 1,
                                                    scale: 1
                                                }}
                                                animate={{
                                                    x: [0, x * 0.3, x * 1.5],
                                                    y: [0, y * 0.3, y * 1.5],
                                                    opacity: [1, 0.8, 0],
                                                    scale: [1, 1.8, 0.1]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    delay: i * 0.03,
                                                    ease: [0.25, 0.46, 0.45, 0.94]
                                                }}
                                            />
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </motion.div>
            
            {/* Authentication Provider Selection Modal */}
            <AnimatePresence>
                {showAuthOptions && !isLoggedIn && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center"
                        style={{ zIndex: 1400 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div 
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
                            style={{ zIndex: 1300 }}
                            onClick={() => setShowAuthOptions(false)}
                        />
                        <motion.div
                            className="relative bg-[#0a0e1f]/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
                            style={{ zIndex: 1400 }}
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