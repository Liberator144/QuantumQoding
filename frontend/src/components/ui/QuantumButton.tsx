/**
 * Quantum Button Component
 * Standardized button with consistent styling and animations
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useQuantumHover, useQuantumClick } from '../../hooks/useQuantumAnimations';
import { usePerformanceToggles } from '../../hooks/usePerformance';
import { QUANTUM_COLORS, TEXT_STYLES } from '../../styles/theme/quantum-theme';
import { MOBILE_INTERACTIONS } from '../../styles/responsive/quantum-responsive';

interface QuantumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'quantum' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

export const QuantumButton: React.FC<QuantumButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  type = 'button',
  className,
  'aria-label': ariaLabel
}) => {
  const hoverAnimation = useQuantumHover('button');
  const clickAnimation = useQuantumClick('button');
  const performanceToggles = usePerformanceToggles();

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: '0.5rem 1rem',
        fontSize: TEXT_STYLES.bodySmall.fontSize,
        minHeight: MOBILE_INTERACTIONS.touchTargets.minimum
      },
      md: {
        padding: '0.75rem 1.5rem',
        fontSize: TEXT_STYLES.body.fontSize,
        minHeight: MOBILE_INTERACTIONS.touchTargets.comfortable
      },
      lg: {
        padding: '1rem 2rem',
        fontSize: TEXT_STYLES.bodyLarge.fontSize,
        minHeight: MOBILE_INTERACTIONS.touchTargets.large
      },
      xl: {
        padding: '1.25rem 2.5rem',
        fontSize: TEXT_STYLES.h6.fontSize,
        minHeight: MOBILE_INTERACTIONS.touchTargets.large
      }
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: QUANTUM_COLORS.primary.quantum,
        color: QUANTUM_COLORS.grayscale.black,
        border: `2px solid ${QUANTUM_COLORS.primary.quantum}`,
        boxShadow: performanceToggles.disableShadows ? 'none' : `0 0 20px ${QUANTUM_COLORS.primary.quantum}40`
      },
      secondary: {
        backgroundColor: 'transparent',
        color: QUANTUM_COLORS.primary.quantum,
        border: `2px solid ${QUANTUM_COLORS.primary.quantum}`,
        boxShadow: 'none'
      },
      quantum: {
        background: performanceToggles.disableGradients 
          ? QUANTUM_COLORS.primary.quantum
          : `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}, ${QUANTUM_COLORS.primary.stellar})`,
        color: QUANTUM_COLORS.grayscale.black,
        border: 'none',
        boxShadow: performanceToggles.disableShadows ? 'none' : `0 0 30px ${QUANTUM_COLORS.primary.quantum}60`
      },
      ghost: {
        backgroundColor: 'transparent',
        color: QUANTUM_COLORS.grayscale.white,
        border: '2px solid transparent',
        boxShadow: 'none'
      },
      danger: {
        backgroundColor: QUANTUM_COLORS.semantic.error,
        color: QUANTUM_COLORS.grayscale.white,
        border: `2px solid ${QUANTUM_COLORS.semantic.error}`,
        boxShadow: performanceToggles.disableShadows ? 'none' : `0 0 20px ${QUANTUM_COLORS.semantic.error}40`
      }
    };
    return variants[variant];
  };

  const buttonStyles = {
    ...getSizeStyles(),
    ...getVariantStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: '0.5rem',
    fontFamily: TEXT_STYLES.body.fontFamily,
    fontWeight: TEXT_STYLES.h6.fontWeight,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
    userSelect: 'none' as const,
    touchAction: 'manipulation'
  };

  const LoadingSpinner = () => (
    <motion.div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid currentColor',
        borderTop: '2px solid transparent',
        borderRadius: '50%'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  return (
    <motion.button
      className={className}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={buttonStyles}
      whileHover={disabled || loading ? {} : hoverAnimation}
      whileTap={disabled || loading ? {} : clickAnimation}
      aria-label={ariaLabel}
      aria-disabled={disabled || loading}
    >
      {loading && <LoadingSpinner />}
      
      {icon && iconPosition === 'left' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
      
      <span>{children}</span>
      
      {icon && iconPosition === 'right' && !loading && (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          {icon}
        </span>
      )}
    </motion.button>
  );
};