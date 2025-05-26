/**
 * Quantum Card Component - Revolutionary Design System Implementation
 * 
 * Standardized card component with quantum-themed variants,
 * consistent styling, and interactive effects.
 * 
 * @version 1.0.0
 */
import React from 'react';
import { motion } from 'framer-motion';
import { QuantumDesignSystem } from '../QuantumDesignSystem';

interface QuantumCardProps {
    variant?: 'elevated' | 'flat' | 'quantum';
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hoverable?: boolean;
    padding?: 'sm' | 'md' | 'lg';
}

export const QuantumCard: React.FC<QuantumCardProps> = ({
    variant = 'elevated',
    children,
    className = '',
    onClick,
    hoverable = false,
    padding = 'md'
}) => {
    const { spacing, animations, variants, borderRadius } = QuantumDesignSystem;
    
    // Padding configurations
    const paddingConfig = {
        sm: spacing[4],
        md: spacing[6],
        lg: spacing[8]
    };

    const cardVariant = variants.card[variant];
    const cardPadding = paddingConfig[padding];

    return (
        <motion.div
            className={`
                relative overflow-hidden cursor-${onClick ? 'pointer' : 'default'}
                ${className}
            `}
            style={{
                ...cardVariant,
                padding: cardPadding,
                borderRadius: borderRadius.xl
            }}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: animations.duration.normal / 1000,
                ease: animations.easing.quantum
            }}
            whileHover={hoverable || onClick ? {
                y: -4,
                transition: { duration: animations.duration.fast / 1000 }
            } : {}}
        >
            {/* Quantum Particle Background */}
            {variant === 'quantum' && (
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                                background: QuantumDesignSystem.colors.primary.quantum,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`
                            }}
                            animate={{
                                opacity: [0.2, 0.8, 0.2],
                                scale: [1, 1.5, 1],
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
            )}
            
            {/* Card Content */}
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
};