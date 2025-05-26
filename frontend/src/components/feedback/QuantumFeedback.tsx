/**
 * Quantum Feedback System
 * Standardized error messages, notifications, and feedback components
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUANTUM_COLORS } from '../../styles/theme/quantum-theme';

type FeedbackType = 'success' | 'warning' | 'error' | 'info' | 'quantum';
type FeedbackVariant = 'toast' | 'banner' | 'modal' | 'inline';

interface QuantumFeedbackProps {
  type: FeedbackType;
  variant?: FeedbackVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  showIcon?: boolean;
  className?: string;
}

export const QuantumFeedback: React.FC<QuantumFeedbackProps> = ({
  type,
  variant = 'toast',
  title,
  message,
  onClose,
  autoClose = true,
  duration = 5000,
  showIcon = true,
  className
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const getTypeStyles = () => {
    const styles = {
      success: {
        backgroundColor: `${QUANTUM_COLORS.semantic.success}20`,
        borderColor: QUANTUM_COLORS.semantic.success,
        iconColor: QUANTUM_COLORS.semantic.success,
        glowColor: `${QUANTUM_COLORS.semantic.success}40`
      },
      warning: {
        backgroundColor: `${QUANTUM_COLORS.semantic.warning}20`,
        borderColor: QUANTUM_COLORS.semantic.warning,
        iconColor: QUANTUM_COLORS.semantic.warning,
        glowColor: `${QUANTUM_COLORS.semantic.warning}40`
      },
      error: {
        backgroundColor: `${QUANTUM_COLORS.semantic.error}20`,
        borderColor: QUANTUM_COLORS.semantic.error,
        iconColor: QUANTUM_COLORS.semantic.error,
        glowColor: `${QUANTUM_COLORS.semantic.error}40`
      },
      info: {
        backgroundColor: `${QUANTUM_COLORS.semantic.info}20`,
        borderColor: QUANTUM_COLORS.semantic.info,
        iconColor: QUANTUM_COLORS.semantic.info,
        glowColor: `${QUANTUM_COLORS.semantic.info}40`
      },
      quantum: {
        backgroundColor: `${QUANTUM_COLORS.primary.quantum}20`,
        borderColor: QUANTUM_COLORS.primary.quantum,
        iconColor: QUANTUM_COLORS.primary.quantum,
        glowColor: `${QUANTUM_COLORS.primary.quantum}40`
      }
    };
    return styles[type];
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) return null;

  const typeStyles = getTypeStyles();

  return (
    <motion.div
      className={className}
      style={{
        position: variant === 'toast' ? 'fixed' : 'relative',
        top: variant === 'toast' ? '1rem' : 'auto',
        right: variant === 'toast' ? '1rem' : 'auto',
        maxWidth: '400px',
        zIndex: 1000,
        padding: '1rem',
        borderRadius: '0.75rem',
        border: `1px solid ${typeStyles.borderColor}`,
        backgroundColor: typeStyles.backgroundColor,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 8px 32px ${typeStyles.glowColor}`
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
        {/* Icon */}
        {showIcon && (
          <div style={{ color: typeStyles.iconColor, fontSize: '1.25rem' }}>
            {type === 'success' && '✓'}
            {type === 'warning' && '⚠'}
            {type === 'error' && '✕'}
            {type === 'info' && 'ℹ'}
            {type === 'quantum' && '⚛'}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {title && (
            <h4 style={{
              color: QUANTUM_COLORS.grayscale.white,
              margin: '0 0 0.25rem 0',
              fontSize: '1rem',
              fontWeight: 600
            }}>
              {title}
            </h4>
          )}
          
          <p style={{
            color: QUANTUM_COLORS.grayscale.gray200,
            margin: 0,
            fontSize: '0.875rem',
            lineHeight: 1.5
          }}>
            {message}
          </p>
        </div>

        {/* Close button */}
        {onClose && (
          <button
            style={{
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '0.25rem',
              color: QUANTUM_COLORS.grayscale.gray400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={handleClose}
          >
            ✕
          </button>
        )}
      </div>
    </motion.div>
  );
};