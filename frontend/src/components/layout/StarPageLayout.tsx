/**
 * Star Page Layout Component - Phase 4 Implementation
 * 
 * Standardized layout for all star system pages ensuring
 * consistent spacing, typography, and design patterns.
 * 
 * @version 1.0.0
 */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { StarPageHeader } from './StarPageHeader';

interface StarPageLayoutProps {
    starName: string;
    starColor?: string;
    description?: string;
    children: ReactNode;
    showHeader?: boolean;
    customHeaderActions?: ReactNode;
    className?: string;
}

export const StarPageLayout: React.FC<StarPageLayoutProps> = ({
    starName,
    starColor = '#60a5fa',
    description,
    children,
    showHeader = true,
    customHeaderActions,
    className = ''
}) => {
    return (
        <div className={`min-h-screen bg-[#050714] ${className}`}>
            {/* Star Page Header */}
            {showHeader && (
                <StarPageHeader
                    starName={starName}
                    starColor={starColor}
                    description={description}
                    customActions={customHeaderActions}
                />
            )}

            {/* Main Content Area */}
            <motion.main
                className="relative px-6 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                {/* Background Quantum Grid */}
                <div className="absolute inset-0 opacity-10">
                    <div 
                        className="w-full h-full"
                        style={{
                            backgroundImage: `
                                linear-gradient(${starColor}20 1px, transparent 1px),
                                linear-gradient(90deg, ${starColor}20 1px, transparent 1px)
                            `,
                            backgroundSize: '50px 50px'
                        }}
                    />
                </div>

                {/* Content Container */}
                <div className="relative z-10 max-w-7xl mx-auto">
                    {children}
import React, { ReactNode, useMemo } from 'react';

// Inside the component:
const quantumPositions = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
        left: `${20 + i * 15}%`,
        top: `${30 + Math.random() * 40}%`
    })), []
);

// In the JSX:
{[...Array(5)].map((_, i) => (
    <motion.div
        key={`quantum-${i}`}
        className="absolute w-2 h-2 rounded-full opacity-30"
        style={{
            backgroundColor: starColor,
           left: quantumPositions[i].left,
           top: quantumPositions[i].top
        }}
                        animate={{
                            y: [-20, 20, -20],
                            x: [-10, 10, -10],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [0.5, 1.2, 0.5]
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

transition={{
   duration: prefersReducedMotion ? 0 : 6 + Math.random() * 4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: i * 1.2
}}
                    />
                ))}
            </motion.main>
        </div>
    );
};

export default StarPageLayout;