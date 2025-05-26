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

    // Update position for data streams
    useEffect(() => {
        if (starRef.current) {
            const rect = starRef.current.getBoundingClientRect();
            setPosition({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
            });
        }
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
                onMouseEnter={() => onStarHover(node.name)}
                onMouseLeave={() => onStarHover(null)}
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
                className="absolute mt-3 -translate-x-1/2 top-full left-1/2"
                onMouseEnter={() => onInfoHover(node.name)}
                onMouseLeave={() => onInfoHover(null)}
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

            {/* Enhanced Data Stream Connections */}
            <AnimatePresence>
                {isStarHovered && (
                    <motion.div
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <svg className="absolute w-full h-full">
                            <motion.line
                                x1={centerPosition.x - position.x}
                                y1={centerPosition.y - position.y}
                                x2="0"
                                y2="0"
                                stroke={node.color}
                                strokeWidth="2"
                                strokeDasharray="8,4"
                                className="animate-pulse"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8 }}
                            />
                            
                            {/* Enhanced Data Particles */}
                            {[...Array(8)].map((_, i) => (
                                <motion.circle
                                    key={i}
                                    r="3"
                                    fill={node.color}
                                    filter="blur(1px)"
                                    animate={{
                                        offsetDistance: ['0%', '100%'],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        delay: i * 0.3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    style={{
                                        offsetPath: `path("M ${centerPosition.x - position.x} ${centerPosition.y - position.y} L 0 0")`,
                                    }}
                                />
                            ))}
                        </svg>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Enhanced Information Panel with Independent Trigger */}
            <AnimatePresence>
                {showInfoPanel && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.8,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.8,
                            y: 15,
                        }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }}
                        className="absolute z-30 transform -translate-x-1/2 left-1/2 pointer-events-auto"
                        style={{
                            top: 'calc(100% + 3rem)',
                            width: '320px',
                        }}
                        onMouseEnter={() => onInfoHover(node.name)}
                        onMouseLeave={() => onInfoHover(null)}
                    >
                        <div
                            className="relative p-5 border rounded-xl backdrop-blur-xl"
                            style={{
                                background: `linear-gradient(135deg, ${node.color}20, ${node.color}35, ${node.color}15)`,
                                borderColor: `${node.color}50`,
                                boxShadow: `0 0 30px ${node.color}25, inset 0 0 20px ${node.color}10`,
                            }}
                        >
                            {/* Enhanced Background Particles */}
                            <div className="absolute inset-0 overflow-hidden rounded-xl">
                                {[...Array(25)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        className="absolute rounded-full"
                                        style={{
                                            width: Math.random() * 6 + 2,
                                            height: Math.random() * 6 + 2,
                                            background: node.color,
                                            left: `${Math.random() * 100}%`,
                                            top: `${Math.random() * 100}%`,
                                        }}
                                        animate={{
                                            opacity: [0.2, 0.6, 0.2],
                                            scale: [1, 1.3, 1],
                                            x: [0, (Math.random() - 0.5) * 20],
                                            y: [0, (Math.random() - 0.5) * 20]
                                        }}
                                        transition={{
                                            duration: 3 + Math.random() * 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                            delay: Math.random() * 2
                                        }}
                                    />
                                ))}
                            </div>

                            <motion.div
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {/* Enhanced Title */}
                                <h3
                                    className="mb-3 text-xl font-bold"
                                    style={{
                                        color: node.color,
                                        textShadow: `0 0 12px ${node.color}70`,
                                    }}
                                >
                                    {node.name}
                                </h3>

                                {/* Enhanced Description */}
                                <p
                                    className="mb-4 text-sm leading-relaxed text-white/95"
                                    style={{
                                        textShadow: `0 0 8px ${node.color}20`,
                                    }}
                                >
                                    {node.description}
                                </p>

                                {/* Enhanced Features Section */}
                                <div className="pt-4 mt-4 border-t border-white/25">
                                    <p className="mb-3 text-xs font-medium text-white/80">
                                        Key Features:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {node.features.slice(0, 4).map(feature => (
                                            <motion.div
                                                key={feature.name}
                                                className="px-3 py-1.5 text-xs font-medium rounded-full"
                                                style={{
                                                    backgroundColor: `${node.color}25`,
                                                    borderWidth: '1px',
                                                    borderColor: `${node.color}50`,
                                                    color: node.color
                                                }}
                                                whileHover={{
                                                    scale: 1.05,
                                                    backgroundColor: `${node.color}35`
                                                }}
                                            >
                                                {feature.name}
                                            </motion.div>
                                        ))}
                                        {node.features.length > 4 && (
                                            <div className="px-3 py-1.5 text-xs font-medium rounded-full bg-white/15 text-white/70">
                                                +{node.features.length - 4} more
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Enhanced Enter Button */}
                                <div className="mt-5 text-center">
                                    <motion.div
                                        className="inline-block text-sm px-6 py-2.5 rounded-full cursor-pointer font-medium"
                                        style={{
                                            backgroundColor: `${node.color}40`,
                                            borderWidth: '2px',
                                            borderColor: `${node.color}70`,
                                            color: 'white',
                                            textShadow: `0 0 8px ${node.color}50`
                                        }}
                                        whileHover={{
                                            scale: 1.08,
                                            backgroundColor: `${node.color}60`,
                                            boxShadow: `0 0 20px ${node.color}60`
                                        }}
                                        whileTap={{
                                            scale: 0.95,
                                        }}
                                        onClick={handleNavigate}
                                    >
                                        Enter {node.name} Universe
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Enhanced Connection Line */}
                            <motion.div
                                className="absolute w-px origin-bottom left-1/2 -top-12"
                                initial={{
                                    scaleY: 0,
                                }}
                                animate={{
                                    scaleY: 1,
                                }}
                                style={{
                                    background: `linear-gradient(to bottom, ${node.color}00, ${node.color}80, ${node.color})`,
                                    height: '3rem',
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EnhancedStar;