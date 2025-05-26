/**
 * Quantum Navigation System
 * Standardized navigation patterns across all pages
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuantumHover, useQuantumClick, useQuantumTransition } from '../../hooks/useQuantumAnimations';
import { QUANTUM_COLORS, TEXT_STYLES } from '../../styles/theme/quantum-theme';
import { mediaQueries } from '../../styles/responsive/quantum-responsive';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  description?: string;
  isActive?: boolean;
}

interface QuantumNavigationProps {
  items: NavigationItem[];
  variant?: 'header' | 'sidebar' | 'breadcrumb' | 'quantum';
  showLabels?: boolean;
  showIcons?: boolean;
  onNavigate?: (path: string) => void;
}

export const QuantumNavigation: React.FC<QuantumNavigationProps> = ({
  items,
  variant = 'header',
  showLabels = true,
  showIcons = true,
  onNavigate
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const hoverAnimation = useQuantumHover('button');
  const clickAnimation = useQuantumClick('button');
  const transitionAnimation = useQuantumTransition('up');

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    onNavigate?.(path);
  };

  const getVariantStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative' as const,
      overflow: 'hidden'
    };

    switch (variant) {
      case 'header':
        return {
          ...baseStyles,
          flexDirection: 'row' as const,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        };
      
      case 'sidebar':
        return {
          ...baseStyles,
          flexDirection: 'column' as const,
          width: '100%',
          padding: '1rem',
          backgroundColor: 'rgba(0, 255, 255, 0.05)',
          border: '1px solid rgba(0, 255, 255, 0.2)'
        };
      
      case 'breadcrumb':
        return {
          ...baseStyles,
          padding: '0.25rem 0.5rem',
          fontSize: TEXT_STYLES.bodySmall.fontSize,
          backgroundColor: 'transparent',
          border: 'none'
        };
      
      case 'quantum':
        return {
          ...baseStyles,
          background: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}20, ${QUANTUM_COLORS.primary.stellar}20)`,
          border: `1px solid ${QUANTUM_COLORS.primary.quantum}40`,
          boxShadow: `0 0 20px ${QUANTUM_COLORS.primary.quantum}20`
        };
      
      default:
        return baseStyles;
    }
  };  const getActiveStyles = (isActive: boolean) => {
    if (!isActive) return {};
    
    switch (variant) {
      case 'header':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
        };
      
      case 'sidebar':
        return {
          backgroundColor: 'rgba(0, 255, 255, 0.15)',
          border: '1px solid rgba(0, 255, 255, 0.4)',
          boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)'
        };
      
      case 'quantum':
        return {
          background: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}40, ${QUANTUM_COLORS.primary.stellar}40)`,
          border: `1px solid ${QUANTUM_COLORS.primary.quantum}80`,
          boxShadow: `0 0 30px ${QUANTUM_COLORS.primary.quantum}40`
        };
      
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        };
    }
  };

  const renderNavigationItem = (item: NavigationItem) => {
    const isActive = location.pathname === item.path;
    const isHovered = hoveredItem === item.id;
    
    return (
      <motion.div
        key={item.id}
        style={{
          ...getVariantStyles(),
          ...getActiveStyles(isActive)
        }}
        whileHover={hoverAnimation}
        whileTap={clickAnimation}
        onHoverStart={() => setHoveredItem(item.id)}
        onHoverEnd={() => setHoveredItem(null)}
        onClick={() => handleNavigation(item.path)}
        {...transitionAnimation}
      >
        {/* Background glow effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle, ${QUANTUM_COLORS.primary.quantum}20 0%, transparent 70%)`,
                borderRadius: 'inherit',
                zIndex: -1
              }}
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        {showIcons && item.icon && (
          <motion.div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isActive ? QUANTUM_COLORS.primary.quantum : QUANTUM_COLORS.grayscale.white,
              fontSize: variant === 'breadcrumb' ? '0.875rem' : '1.25rem'
            }}
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 5 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {item.icon}
          </motion.div>
        )}

        {/* Label */}
        {showLabels && (
          <motion.span
            style={{
              ...TEXT_STYLES.body,
              fontSize: variant === 'breadcrumb' ? TEXT_STYLES.bodySmall.fontSize : TEXT_STYLES.body.fontSize,
              fontWeight: isActive ? TEXT_STYLES.h6.fontWeight : TEXT_STYLES.body.fontWeight,
              color: isActive ? QUANTUM_COLORS.primary.quantum : QUANTUM_COLORS.grayscale.white,
              whiteSpace: 'nowrap' as const
            }}
            animate={{
              x: isHovered ? 2 : 0
            }}
            transition={{ duration: 0.2 }}
          >
            {item.label}
          </motion.span>
        )}

        {/* Active indicator */}
        {isActive && variant !== 'breadcrumb' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              bottom: variant === 'header' ? '-2px' : 'auto',
              right: variant === 'sidebar' ? '-2px' : 'auto',
              left: variant === 'header' ? '50%' : 'auto',
              top: variant === 'sidebar' ? '50%' : 'auto',
              transform: variant === 'header' ? 'translateX(-50%)' : variant === 'sidebar' ? 'translateY(-50%)' : 'none',
              width: variant === 'header' ? '60%' : '3px',
              height: variant === 'header' ? '2px' : '60%',
              backgroundColor: QUANTUM_COLORS.primary.quantum,
              borderRadius: '1px',
              boxShadow: `0 0 8px ${QUANTUM_COLORS.primary.quantum}`
            }}
          />
        )}
      </motion.div>
    );
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: variant === 'sidebar' ? 'column' as const : 'row' as const,
    gap: variant === 'breadcrumb' ? '0.5rem' : '0.75rem',
    alignItems: variant === 'sidebar' ? 'stretch' : 'center',
    padding: variant === 'sidebar' ? '1rem' : '0.5rem'
  };

  return (
    <motion.nav
      style={containerStyles}
      {...transitionAnimation}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {renderNavigationItem(item)}
          
          {/* Breadcrumb separator */}
          {variant === 'breadcrumb' && index < items.length - 1 && (
            <motion.span
              style={{
                color: QUANTUM_COLORS.grayscale.gray400,
                fontSize: TEXT_STYLES.bodySmall.fontSize,
                userSelect: 'none' as const
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              /
            </motion.span>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
  );
};