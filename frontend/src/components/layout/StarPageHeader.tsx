/**
 * Star Page Header Component - Phase 4 Implementation
 * 
 * Universal header template for all star system pages ensuring
 * consistent design and navigation across the quantum universe.
 * 
 * @version 1.0.0
 */
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, Star } from 'lucide-react';

interface StarPageHeaderProps {
    starName: string;
    starColor?: string;
    description?: string;
    showBackButton?: boolean;
    customActions?: React.ReactNode;
}

export const StarPageHeader: React.FC<StarPageHeaderProps> = ({
    starName,
    starColor = '#60a5fa',
    description,
    showBackButton = true,
    customActions
}) => {
    const navigate = useNavigate();

    const handleBackToHub = () => {
        navigate('/');
    };

    return (
        <header className="relative px-6 py-8 border-b border-purple-500/20 bg-gradient-to-r from-[#0a0e1f]/80 to-[#1a1f3a]/80 backdrop-blur-xl">
            {/* Background Quantum Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Quantum Field Lines */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                        style={{
                            top: `${30 + i * 20}%`,
                            left: 0,
                            right: 0
                        }}
                        animate={{
                            opacity: [0.2, 0.6, 0.2],
                            scaleX: [0.8, 1.2, 0.8]
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                    />
                ))}
                
                {/* Floating Particles */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                            backgroundColor: starColor,
                            left: `${10 + i * 10}%`,
                            top: `${20 + Math.random() * 60}%`
                        }}
                        animate={{
                            y: [-10, 10, -10],
                            opacity: [0.3, 0.8, 0.3],
                            scale: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.3
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-between">
                {/* Left Section - Navigation */}
                <div className="flex items-center gap-6">
                    {/* Back Button */}
                    {showBackButton && (
                        <motion.button
                            onClick={handleBackToHub}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-white hover:from-purple-500/30 hover:to-cyan-500/30 transition-all duration-300 group"
                            whileHover={{ scale: 1.05, x: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:animate-pulse" />
                            <span className="text-sm font-medium">Back to Hub</span>
                        </motion.button>
                    )}

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Home className="w-4 h-4" />
                        <span>/</span>
                        <Star className="w-4 h-4" style={{ color: starColor }} />
                        <span className="text-white font-medium">{starName}</span>
                    </div>
                </div>

                {/* Center Section - Star Title */}
                <div className="text-center">
                    <motion.h1
                        className="text-4xl font-bold text-white mb-2 relative"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Star Name with Glow Effect */}
                        <span 
                            className="relative z-10"
                            style={{
                                textShadow: `0 0 20px ${starColor}40, 0 0 40px ${starColor}20`
                            }}
                        >
                            {starName}
                        </span>
                        
                        {/* Quantum Aura */}
                        <motion.div
                            className="absolute inset-0 blur-lg opacity-30"
                            style={{
                                background: `linear-gradient(45deg, ${starColor}40, transparent, ${starColor}40)`
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.2, 0.4, 0.2]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </motion.h1>

                    {/* Description */}
                    {description && (
                        <motion.p
                            className="text-gray-300 text-lg max-w-md mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {description}
                        </motion.p>
                    )}
                </div>

                {/* Right Section - Custom Actions */}
                <div className="flex items-center gap-4">
                    {customActions}
                    
                    {/* Star System Indicator */}
                    <motion.div
                        className="flex items-center gap-2 px-3 py-2 rounded-full border border-purple-500/30 bg-purple-500/10"
                        animate={{
                            borderColor: [
                                "rgba(147, 51, 234, 0.3)",
                                `${starColor}60`,
                                "rgba(147, 51, 234, 0.3)"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: starColor }}
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.7, 1, 0.7]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <span className="text-xs text-gray-300 font-medium">Active System</span>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Quantum Line */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
                animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scaleX: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
        </header>
    );
};

export default StarPageHeader;