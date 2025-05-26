/**
 * Enhanced Star Component - Phase 5 Implementation
 * 
 * Enhanced version with separated hover effects for stars vs information panels,
 * improved orbital spacing, and independent interaction zones.
 * 
 * @version 2.0.0
 */
import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../lib/useAudio';

interface StarNode {
    name: string;
    color: string;
    angle: number;
    distance: number;
    orbit: string;
    rotationSpeed: number;
    description: string;
    style: string;
    features: Array<{
        name: string;
        description: string;
        orbit: string;
    }>;
}

interface EnhancedStarProps {
    node: StarNode;
    isStarHovered: boolean;
    isInfoHovered: boolean;
    onStarHover: (name: string | null) => void;
    onInfoHover: (name: string | null) => void;
    onNavigate: (node: StarNode) => void;
}

export const EnhancedStar: React.FC<EnhancedStarProps> = ({
    node,
    isStarHovered,
    isInfoHovered,
    onStarHover,
    onInfoHover,
    onNavigate
}) => {
    const starRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const audio = useAudio();

    // Enhanced orbital distances for better spacing around black hole portal
    const getEnhancedDistance = (originalDistance: number, orbit: string) => {
        switch (orbit) {
            case 'inner':
                return originalDistance + 80; // Move inner orbit further from black hole
            case 'middle':
                return originalDistance + 40; // Slight adjustment for middle orbit
            case 'outer':
                return originalDistance + 20; // Minor adjustment for outer orbit
            default:
                return originalDistance;
        }
    };

    const enhancedDistance = getEnhancedDistance(node.distance, node.orbit);

    // Update position for effects
    useEffect(() => {
        if (starRef.current) {
            const rect = starRef.current.getBoundingClientRect();
            const centerPos = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            };
            setPosition(centerPos);
        }
    }, []);

    // Update position when window resizes
    useEffect(() => {
        const updatePosition = () => {
            if (starRef.current) {
                const rect = starRef.current.getBoundingClientRect();
                const centerPos = {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2,
                };
                setPosition(centerPos);
            }
        };

        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, []);

    // Handle star-specific interactions
    const handleStarClick = () => {
        audio.play('star-click', { volume: 0.5 });
    };

    const handleNavigate = () => {
        audio.play('star-select', { volume: 0.6 });
        audio.playSequence([
            { sound: 'quantum-pulse', delay: 100, options: { volume: 0.4 } },
            { sound: 'energy-burst', delay: 300, options: { volume: 0.5 } },
            { sound: 'data-flow', delay: 500, options: { volume: 0.3 } }
        ]);
        onNavigate(node);
    };

    // Center coordinates for data streams
    const centerPosition = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
    };

    // Show information panel when either star or info area is hovered
    const showInfoPanel = isStarHovered || isInfoHovered;

    return (
        <div
            ref={starRef}
            className="absolute"
            style={{
                left: `calc(50% + ${Math.cos((node.angle * Math.PI) / 180) * enhancedDistance}px)`,
                top: `calc(50% + ${Math.sin((node.angle * Math.PI) / 180) * enhancedDistance}px)`,
                transform: 'translate(-50%, -50%)',
                zIndex: showInfoPanel ? 20 : 10,
            }}
        >
            {/* Enhanced Star with Separated Hover Zone */}
            <motion.div
                className="relative cursor-pointer group"
                animate={{
                    scale: isStarHovered ? 1.3 : 1,
                    rotate: 360,
                }}
                transition={{
                    scale: {
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 400,
                        damping: 20,
                    },
                    rotate: {
                        duration: node.rotationSpeed,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                }}
                onMouseEnter={() => {
                    onStarHover(node.name);
                }}
                onMouseLeave={() => {
                    onStarHover(null);
                }}
                onClick={handleNavigate}
            >
                <div className="relative flex items-center justify-center w-28 h-28">
                    {/* Enhanced Star Core with Quantum Effects */}
                    <div
                        className="absolute inset-0 overflow-hidden rounded-full"
                        style={{
                            boxShadow: `0 0 40px ${node.color}80, inset 0 0 25px ${node.color}, 0 0 80px ${node.color}40`,
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle, ${node.color} 0%, ${node.color}95 30%, ${node.color}50 60%, transparent 100%)`,
                            }}
                        >
                            {/* Quantum Particle Effects */}
                            <div className="absolute inset-0 mix-blend-overlay">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute rounded-full"
                                        style={{
                                            width: `${Math.random() * 80 + 20}%`,
                                            height: `${Math.random() * 80 + 20}%`,
                                            left: `${Math.random() * 30}%`,
                                            top: `${Math.random() * 30}%`,
                                            background: `radial-gradient(circle, ${node.color}90 0%, transparent 70%)`,
                                        }}
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            opacity: [0.3, 0.8, 0.3],
                                            rotate: [0, 180, 360]
                                        }}
                                        transition={{
                                            duration: 3 + Math.random() * 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: i * 0.2
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Energy Flares */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{
                                width: '120%',
                                height: '6px',
                                top: '50%',
                                left: '50%',
                                background: `linear-gradient(90deg, transparent, ${node.color}, transparent)`,
                                transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg)`,
                                opacity: 0.8,
                                filter: 'blur(1px)',
                            }}
                            animate={{
                                scaleX: [0.5, 1.2, 0.5],
                                opacity: [0.4, 0.9, 0.4]
                            }}
                            transition={{
                                duration: 4 + i * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.2
                            }}
                        />
                    ))}

                    {/* Quantum Particles Emission */}
                    {[...Array(16)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: Math.random() * 4 + 2,
                                height: Math.random() * 4 + 2,
                                backgroundColor: node.color,
                                left: '50%',
                                top: '50%',
                                filter: 'blur(1px)',
                            }}
                            animate={{
                                x: [0, (Math.random() - 0.5) * 60],
                                y: [0, (Math.random() - 0.5) * 60],
                                opacity: [1, 0],
                                scale: [1, 0.2]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                ease: 'easeOut',
                                delay: Math.random() * 3,
                            }}
                        />
                    ))}

                    {/* Enhanced Quantum Aura */}
                    <motion.div
                        className="absolute inset-[-60%] rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${node.color}30 0%, ${node.color}15 40%, transparent 80%)`,
                            filter: 'blur(20px)',
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </div>
            </motion.div>

            {/* Enhanced Star Name with Independent Hover Zone */}
            <div 
                ref={nameRef}
                className="absolute mt-3 -translate-x-1/2 top-full left-1/2"
                onMouseEnter={() => {
                    onInfoHover(node.name);
                }}
                onMouseLeave={() => {
                    onInfoHover(null);
                }}
            >
                <motion.div
                    className="relative cursor-pointer"
                    animate={{
                        y: [0, -3, 0],
                        scale: isInfoHovered ? 1.15 : 1,
                    }}
                    transition={{
                        y: {
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        scale: {
                            duration: 0.3
                        }
                    }}
                    onClick={handleNavigate}
                >
                    <div
                        className={`px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300
                         ${showInfoPanel ? 'bg-black/60 border-opacity-100' : 'bg-black/30 border-opacity-60'}`}
                        style={{
                            borderWidth: '1px',
                            borderColor: node.color,
                            boxShadow: showInfoPanel ? `0 0 15px ${node.color}70` : `0 0 5px ${node.color}30`,
                        }}
                    >
                        <p
                            className="text-sm font-medium whitespace-nowrap"
                            style={{
                                color: node.color,
                                textShadow: `0 0 8px ${node.color}80`
                            }}
                        >
                            {node.name}
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Revolutionary Sun-like Energy Outbursts */}
            <AnimatePresence>
                {isStarHovered && (
                    <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Solar Flare Effects */}
                        {[...Array(8)].map((_, i) => {
                            const angle = (i * 45) * Math.PI / 180;
                            const length = 60 + Math.random() * 40;
                            
                            return (
                                <motion.div
                                    key={`flare-${i}`}
                                    className="absolute"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        width: '4px',
                                        height: `${length}px`,
                                        background: `linear-gradient(to top, ${node.color}, transparent)`,
                                        transformOrigin: 'bottom center',
                                        transform: `translate(-50%, -50%) rotate(${angle * 180 / Math.PI}deg)`,
                                        filter: `drop-shadow(0 0 8px ${node.color})`
                                    }}
                                    initial={{ scaleY: 0, opacity: 0 }}
                                    animate={{
                                        scaleY: [0, 1.5, 0.8, 0],
                                        opacity: [0, 1, 0.7, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        ease: "easeInOut"
                                    }}
                                />
                            );
                        })}
                        
                        {/* Energy Burst Particles */}
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30) * Math.PI / 180;
                            const distance = 40 + Math.random() * 30;
                            const x = Math.cos(angle) * distance;
                            const y = Math.sin(angle) * distance;
                            
                            return (
                                <motion.div
                                    key={`burst-${i}`}
                                    className="absolute w-2 h-2 rounded-full"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        backgroundColor: node.color,
                                        boxShadow: `0 0 10px ${node.color}`
                                    }}
                                    initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                                    animate={{
                                        x: [0, x * 0.5, x],
                                        y: [0, y * 0.5, y],
                                        scale: [0, 1.5, 0],
                                        opacity: [1, 0.8, 0]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.1,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                        ease: "easeOut"
                                    }}
                                />
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Panel logic now handled by QuantumSphere with FixedStarSidebar */}
        </div>
    );
};

export default EnhancedStar;