/**
 * Quantum Form System
 * Standardized form components with consistent styling and behavior
 * @version 1.0.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumHover } from '../../hooks/useQuantumAnimations';
import { QUANTUM_COLORS, TEXT_STYLES } from '../../styles/theme/quantum-theme';
import { createQuantumAnimation } from '../../styles/animations/quantum-animations';

interface QuantumInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  variant?: 'default' | 'quantum' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantumInput: React.FC<QuantumInputProps> = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  icon,
  variant = 'default',
  size = 'md',
  className
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const getSizeStyles = () => {
    const sizes = {
      sm: { padding: '0.5rem 0.75rem', fontSize: TEXT_STYLES.bodySmall.fontSize },
      md: { padding: '0.75rem 1rem', fontSize: TEXT_STYLES.body.fontSize },
      lg: { padding: '1rem 1.25rem', fontSize: TEXT_STYLES.bodyLarge.fontSize }
    };
    return sizes[size];
  };

  const getVariantStyles = () => {
    const baseStyles = {
      width: '100%',
      border: '1px solid',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      color: QUANTUM_COLORS.grayscale.white,
      fontFamily: TEXT_STYLES.body.fontFamily,
      transition: 'all 0.3s ease',
      outline: 'none',
      ...getSizeStyles()
    };

    const variants = {
      default: {
        ...baseStyles,
        borderColor: isFocused 
          ? QUANTUM_COLORS.primary.quantum 
          : error 
            ? QUANTUM_COLORS.semantic.error 
            : QUANTUM_COLORS.grayscale.gray600,
        boxShadow: isFocused 
          ? `0 0 0 3px ${QUANTUM_COLORS.primary.quantum}20` 
          : error 
            ? `0 0 0 3px ${QUANTUM_COLORS.semantic.error}20` 
            : 'none'
      },
      quantum: {
        ...baseStyles,
        background: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}10, ${QUANTUM_COLORS.primary.stellar}10)`,
        borderColor: isFocused 
          ? QUANTUM_COLORS.primary.quantum 
          : QUANTUM_COLORS.primary.quantum + '40',
        boxShadow: isFocused 
          ? `0 0 20px ${QUANTUM_COLORS.primary.quantum}40` 
          : `0 0 10px ${QUANTUM_COLORS.primary.quantum}20`
      },
      minimal: {
        ...baseStyles,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderBottomColor: isFocused 
          ? QUANTUM_COLORS.primary.quantum 
          : QUANTUM_COLORS.grayscale.gray600,
        borderRadius: '0',
        boxShadow: 'none'
      }
    };

    return variants[variant];
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputProps = {
    ref: inputRef,
    value,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    placeholder,
    disabled,
    required,
    style: getVariantStyles()
  };

  return (
    <motion.div
      className={className}
      style={{ width: '100%' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...createQuantumAnimation.slideIn('up')}
    >
      {/* Label */}
      {label && (
        <motion.label
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            ...TEXT_STYLES.bodySmall,
            color: isFocused 
              ? QUANTUM_COLORS.primary.quantum 
              : QUANTUM_COLORS.grayscale.gray300,
            fontWeight: TEXT_STYLES.h6.fontWeight
          }}
          animate={{
            color: isFocused 
              ? QUANTUM_COLORS.primary.quantum 
              : QUANTUM_COLORS.grayscale.gray300
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && (
            <span style={{ color: QUANTUM_COLORS.semantic.error, marginLeft: '0.25rem' }}>
              *
            </span>
          )}
        </motion.label>
      )}

      {/* Input container */}
      <div style={{ position: 'relative' }}>
        {/* Icon */}
        {icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: isFocused 
                ? QUANTUM_COLORS.primary.quantum 
                : QUANTUM_COLORS.grayscale.gray400,
              zIndex: 1,
              pointerEvents: 'none'
            }}
          >
            {icon}
          </div>
        )}

        {/* Input field */}
        {type === 'textarea' ? (
          <motion.textarea
            {...inputProps}
            rows={4}
            style={{
              ...inputProps.style,
              paddingLeft: icon ? '2.5rem' : inputProps.style.paddingLeft,
              resize: 'vertical' as const,
              minHeight: '100px'
            }}
            whileFocus={{ scale: 1.01 }}
          />
        ) : (
          <motion.input
            {...inputProps}
            type={type}
            style={{
              ...inputProps.style,
              paddingLeft: icon ? '2.5rem' : inputProps.style.paddingLeft
            }}
            whileFocus={{ scale: 1.01 }}
          />
        )}
      </div>
    </motion.div>
  );
};