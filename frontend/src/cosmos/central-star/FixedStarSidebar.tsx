/**
 * Fixed Star Sidebar - Beautiful & Non-Intrusive Design
 * 
 * Single sidebar positioned in middle-right of screen that appears when hovering over any star.
 * Based on the previous beautiful SmartInfoPanel design that was working well.
 * 
 * @version 1.0.0
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FixedStarSidebarProps {
    node: {
        name: string;
        color: string;
        description: string;
        style: string;
        features: Array<{
            name: string;
            description: string;
            orbit: string;
        }>;
    } | null;
    isVisible: boolean;
}

export const FixedStarSidebar: React.FC<FixedStarSidebarProps> = ({
    node,
    isVisible
}) => {
    if (!node) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 pointer-events-auto"
                    style={{ width: '350px' }}
                    initial={{ x: 350, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 350, opacity: 0 }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 300,
                        duration: 0.6
                    }}
                >
                    {/* Beautiful Panel Design - Restored from SmartInfoPanel */}
                    <div
                        className="relative p-5 border rounded-l-xl backdrop-blur-xl"
                        style={{
                            background: `linear-gradient(135deg, ${node.color}20, ${node.color}35, ${node.color}15)`,
                            borderColor: `${node.color}50`,
                            boxShadow: `0 0 30px ${node.color}25, inset 0 0 20px ${node.color}10`,
                        }}
                    >
                        {/* Enhanced Background Particles */}
                        <div className="absolute inset-0 overflow-hidden rounded-l-xl">
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

                            {/* Style Badge */}
                            <div className="flex justify-center mb-4">
                                <div
                                    className="px-3 py-1.5 text-xs font-medium rounded-full"
                                    style={{
                                        backgroundColor: `${node.color}25`,
                                        borderWidth: '1px',
                                        borderColor: `${node.color}50`,
                                        color: node.color
                                    }}
                                >
                                    {node.style} Universe
                                </div>
                            </div>

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
                                >
                                    Enter {node.name} Universe
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};