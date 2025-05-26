/**
 * Quantum Layout System
 * Responsive layout components with consistent spacing and structure
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { QUANTUM_SPACING, mediaQueries } from '../../styles/responsive/quantum-responsive';
import { QUANTUM_COLORS } from '../../styles/theme/quantum-theme';
import { createQuantumAnimation } from '../../styles/animations/quantum-animations';

interface QuantumContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: keyof typeof QUANTUM_SPACING.scale;
  className?: string;
}

export const QuantumContainer: React.FC<QuantumContainerProps> = ({
  children,
  maxWidth = 'xl',
  padding = 4,
  className
}) => {
  const maxWidths = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    full: '100%'
  };

  const containerStyles = {
    width: '100%',
    maxWidth: maxWidths[maxWidth],
    margin: '0 auto',
    padding: `0 ${QUANTUM_SPACING.scale[padding]}`,
    [mediaQueries.mobile]: {
      padding: `0 ${QUANTUM_SPACING.responsive.containerPadding.xs}`
    },
    [mediaQueries.tablet]: {
      padding: `0 ${QUANTUM_SPACING.responsive.containerPadding.md}`
    },
    [mediaQueries.desktop]: {
      padding: `0 ${QUANTUM_SPACING.responsive.containerPadding.lg}`
    }
  };

  return (
    <motion.div
      className={className}
      style={containerStyles}
      {...createQuantumAnimation.pageTransition}
    >
      {children}
    </motion.div>
  );
};

interface QuantumGridProps {
  children: React.ReactNode;
  columns?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: keyof typeof QUANTUM_SPACING.scale;
  className?: string;
}

export const QuantumGrid: React.FC<QuantumGridProps> = ({
  children,
  columns = 12,
  gap = 4,
  className
}) => {
  const getGridColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }
    
    return {
      gridTemplateColumns: `repeat(${columns.xs || 1}, 1fr)`,
      [mediaQueries.sm]: {
        gridTemplateColumns: `repeat(${columns.sm || columns.xs || 2}, 1fr)`
      },
      [mediaQueries.md]: {
        gridTemplateColumns: `repeat(${columns.md || columns.sm || 3}, 1fr)`
      },
      [mediaQueries.lg]: {
        gridTemplateColumns: `repeat(${columns.lg || columns.md || 4}, 1fr)`
      },
      [mediaQueries.xl]: {
        gridTemplateColumns: `repeat(${columns.xl || columns.lg || 6}, 1fr)`
      }
    };
  };

  const gridStyles = {
    display: 'grid',
    gap: QUANTUM_SPACING.scale[gap],
    ...(typeof columns === 'number' 
      ? { gridTemplateColumns: getGridColumns() }
      : getGridColumns()
    )
  };

  return (
    <motion.div
      className={className}
      style={gridStyles}
      {...createQuantumAnimation.slideIn('up')}
    >
      {children}
    </motion.div>
  );
};

interface QuantumFlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: keyof typeof QUANTUM_SPACING.scale;
  className?: string;
}

export const QuantumFlex: React.FC<QuantumFlexProps> = ({
  children,
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = 'nowrap',
  gap = 0,
  className
}) => {
  const alignItems = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
    baseline: 'baseline'
  };

  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly'
  };

  const flexStyles = {
    display: 'flex',
    flexDirection: direction,
    alignItems: alignItems[align],
    justifyContent: justifyContent[justify],
    flexWrap: wrap,
    gap: QUANTUM_SPACING.scale[gap]
  };

  return (
    <motion.div
      className={className}
      style={flexStyles}
      {...createQuantumAnimation.slideIn('up')}
    >
      {children}
    </motion.div>
  );
};

interface QuantumSectionProps {
  children: React.ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'dark' | 'quantum' | 'gradient';
  className?: string;
}

export const QuantumSection: React.FC<QuantumSectionProps> = ({
  children,
  spacing = 'md',
  background = 'transparent',
  className
}) => {
  const spacingMap = {
    sm: QUANTUM_SPACING.responsive.sectionSpacing.xs,
    md: QUANTUM_SPACING.responsive.sectionSpacing.md,
    lg: QUANTUM_SPACING.responsive.sectionSpacing.lg,
    xl: QUANTUM_SPACING.responsive.sectionSpacing.xl
  };

  const backgrounds = {
    transparent: 'transparent',
    dark: QUANTUM_COLORS.grayscale.gray900,
    quantum: `${QUANTUM_COLORS.primary.quantum}10`,
    gradient: `linear-gradient(135deg, ${QUANTUM_COLORS.primary.quantum}20, ${QUANTUM_COLORS.primary.stellar}20)`
  };

  const sectionStyles = {
    padding: `${spacingMap[spacing]} 0`,
    backgroundColor: backgrounds[background],
    [mediaQueries.mobile]: {
      padding: `${QUANTUM_SPACING.responsive.sectionSpacing.xs} 0`
    }
  };

  return (
    <motion.section
      className={className}
      style={sectionStyles}
      {...createQuantumAnimation.slideIn('up')}
    >
      {children}
    </motion.section>
  );
};

interface QuantumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'quantum' | 'glass' | 'minimal';
  padding?: keyof typeof QUANTUM_SPACING.scale;
  hover?: boolean;
  className?: string;
}

export const QuantumCard: React.FC<QuantumCardProps> = ({
  children,
  variant = 'default',
  padding = 6,
  hover = true,
  className
}) => {
  const variants = {
    default: {
      backgroundColor: `${QUANTUM_COLORS.grayscale.white}05`,
      border: `1px solid ${QUANTUM_COLORS.grayscale.gray700}`,
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)'
    },
    quantum: {
      background: `linear-gradient(135deg, ${QUANTUM_COLORS.primary.quantum}20, ${QUANTUM_COLORS.primary.stellar}20)`,
      border: `1px solid ${QUANTUM_COLORS.primary.quantum}40`,
      borderRadius: '0.75rem',
      boxShadow: `0 0 20px ${QUANTUM_COLORS.primary.quantum}20`
    },
    glass: {
      backgroundColor: `${QUANTUM_COLORS.grayscale.white}08`,
      border: `1px solid ${QUANTUM_COLORS.grayscale.white}20`,
      borderRadius: '1rem',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    },
    minimal: {
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.5rem'
    }
  };

  const cardStyles = {
    ...variants[variant],
    padding: QUANTUM_SPACING.scale[padding],
    transition: 'all 0.3s ease'
  };

  const hoverStyles = hover ? {
    transform: 'translateY(-4px)',
    boxShadow: variant === 'quantum' 
      ? `0 8px 40px ${QUANTUM_COLORS.primary.quantum}30`
      : '0 12px 40px rgba(0, 0, 0, 0.4)'
  } : {};

  return (
    <motion.div
      className={className}
      style={cardStyles}
      whileHover={hover ? hoverStyles : {}}
      {...createQuantumAnimation.slideIn('up')}
    >
      {children}
    </motion.div>
  );
};