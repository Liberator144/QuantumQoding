/**
 * Quantum Button Component - Revolutionary Design System Implementation
 * 
 * Standardized button component with quantum-themed variants,
 * consistent animations, and accessibility features.
 * 
 * @version 1.0.0
 */
import React from 'react';
import { motion } from 'framer-motion';
import { QuantumDesignSystem } from '../QuantumDesignSystem';

interface QuantumButtonProps {
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

export const QuantumButton: React.FC<QuantumButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    onClick,
    disabled = false,
    loading = false,
    className = '',
    type = 'button'
}) => {
    const { colors, spacing, typography, animations, variants } = QuantumDesignSystem;
    
    // Size configurations
    const sizeConfig = {
        sm: {
            padding: `${spacing[2]} ${spacing[4]}`,
            fontSize: typography.sizes.sm,
            height: '2rem'
        },
        md: {
            padding: `${spacing[3]} ${spacing[6]}`,
            fontSize: typography.sizes.base,
            height: '2.5rem'
        },
        lg: {
            padding: `${spacing[4]} ${spacing[8]}`,
            fontSize: typography.sizes.lg,
            height: '3rem'
        }
    };

    const buttonVariant = variants.button[variant];
    const sizeStyle = sizeConfig[size];

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                relative inline-flex items-center justify-center
                font-medium rounded-lg transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
            style={{
                ...buttonVariant,
                ...sizeStyle,
                fontFamily: typography.fonts.primary,
                fontWeight: typography.weights.medium
            }}
            whileHover={!disabled && !loading ? {
                ...buttonVariant.hover,
                transition: { duration: animations.duration.fast / 1000 }
            } : {}}
            whileTap={!disabled && !loading ? {
                scale: 0.95,
                transition: { duration: animations.duration.fast / 1000 }
            } : {}}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: animations.duration.normal / 1000,
                ease: animations.easing.quantum
            }}
        >
            {/* Loading Spinner */}
            {loading && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            )}
            
            {/* Button Content */}
            <motion.span
                className={loading ? 'opacity-0' : 'opacity-100'}
                transition={{ duration: animations.duration.fast / 1000 }}
            >
                {children}
            </motion.span>

            {/* Quantum Glow Effect */}
            {variant === 'primary' && (
                <motion.div
                    className="absolute inset-0 rounded-lg opacity-0"
                    style={{
                        background: `radial-gradient(circle, ${colors.primary.quantum}40 0%, transparent 70%)`,
                        filter: 'blur(8px)'
                    }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: animations.duration.normal / 1000 }}
                />
            )}
        </motion.button>
    );
};