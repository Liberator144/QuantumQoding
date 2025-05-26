/**
 * Quantum Loading System
 * Standardized loading components and transition animations
 * @version 1.0.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumLoading } from '../../hooks/useQuantumAnimations';
import { QUANTUM_COLORS, TEXT_STYLES } from '../../styles/theme/quantum-theme';
import { createQuantumAnimation } from '../../styles/animations/quantum-animations';

interface QuantumLoadingProps {
  variant?: 'spinner' | 'pulse' | 'orbital' | 'quantum' | 'skeleton';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  progress?: number;
  showProgress?: boolean;
  color?: string;
  className?: string;
}

export const QuantumLoading: React.FC<QuantumLoadingProps> = ({
  variant = 'quantum',
  size = 'md',
  message,
  progress,
  showProgress = false,
  color = QUANTUM_COLORS.primary.quantum,
  className
}) => {
  const loadingAnimation = useQuantumLoading('pulse');

  const getSizeStyles = () => {
    const sizes = {
      sm: { width: '24px', height: '24px', fontSize: TEXT_STYLES.bodySmall.fontSize },
      md: { width: '40px', height: '40px', fontSize: TEXT_STYLES.body.fontSize },
      lg: { width: '64px', height: '64px', fontSize: TEXT_STYLES.bodyLarge.fontSize },
      xl: { width: '96px', height: '96px', fontSize: TEXT_STYLES.h4.fontSize }
    };
    return sizes[size];
  };

  const renderSpinner = () => (
    <motion.div
      style={{
        ...getSizeStyles(),
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%',
        display: 'inline-block'
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  );

  const renderPulse = () => (
    <motion.div
      style={{
        ...getSizeStyles(),
        backgroundColor: color,
        borderRadius: '50%',
        display: 'inline-block'
      }}
      {...loadingAnimation}
    />
  );

  const renderOrbital = () => {
    const orbitalSize = getSizeStyles();
    return (
      <div
        style={{
          ...orbitalSize,
          position: 'relative',
          display: 'inline-block'
        }}
      >
        {/* Central core */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '30%',
            height: '30%',
            backgroundColor: color,
            borderRadius: '50%',
            boxShadow: `0 0 10px ${color}`
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Orbiting particles */}
        {[0, 120, 240].map((rotation, index) => (
          <motion.div
            key={index}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3 + index * 0.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '8px',
                height: '8px',
                backgroundColor: color,
                borderRadius: '50%',
                boxShadow: `0 0 6px ${color}`
              }}
            />
          </motion.div>
        ))}
      </div>
    );
  };  const renderQuantum = () => {
    const quantumSize = getSizeStyles();
    return (
      <div
        style={{
          ...quantumSize,
          position: 'relative',
          display: 'inline-block'
        }}
      >
        {/* Quantum field */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
            borderRadius: '50%'
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        
        {/* Quantum core */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40%',
            height: '40%',
            background: `linear-gradient(45deg, ${color}, ${QUANTUM_COLORS.primary.stellar})`,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${color}`
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          }}
        />
      </div>
    );
  };

  const renderSkeleton = () => (
    <div
      style={{
        width: '100%',
        height: getSizeStyles().height,
        background: `linear-gradient(90deg, ${QUANTUM_COLORS.grayscale.gray800} 25%, ${QUANTUM_COLORS.grayscale.gray700} 50%, ${QUANTUM_COLORS.grayscale.gray800} 75%)`,
        backgroundSize: '200% 100%',
        borderRadius: '0.5rem'
      }}
    />
  );

  const renderLoadingVariant = () => {
    switch (variant) {
      case 'spinner':
        return renderSpinner();
      case 'pulse':
        return renderPulse();
      case 'orbital':
        return renderOrbital();
      case 'quantum':
        return renderQuantum();
      case 'skeleton':
        return renderSkeleton();
      default:
        return renderQuantum();
    }
  };

  return (
    <motion.div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem'
      }}
      {...createQuantumAnimation.pageTransition}
    >
      {renderLoadingVariant()}
      
      {message && (
        <motion.p
          style={{
            ...TEXT_STYLES.body,
            color: QUANTUM_COLORS.grayscale.gray300,
            textAlign: 'center',
            margin: 0
          }}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
      )}
    </motion.div>
  );
};

// Page transition wrapper
interface QuantumPageTransitionProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingMessage?: string;
}

export const QuantumPageTransition: React.FC<QuantumPageTransitionProps> = ({
  children,
  isLoading = false,
  loadingMessage = 'Loading quantum dimensions...'
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: QUANTUM_COLORS.grayscale.black
          }}
          {...createQuantumAnimation.pageTransition}
        >
          <QuantumLoading
            variant="quantum"
            size="lg"
            message={loadingMessage}
          />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          {...createQuantumAnimation.pageTransition}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};