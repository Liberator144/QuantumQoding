/**
 * Card Styles
 * 
 * This module defines the card styles for the QQ-Verse project.
 * 
 * @version 1.0.0
 */

import { colors } from '../colors';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';

/**
 * Card variants
 */
export const cardVariant = {
  /** Primary card variant */
  primary: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.primary,
    color: colors.text.primary,
    boxShadow: boxShadow.md,
    
    /** Hover state */
    _hover: {
      boxShadow: boxShadow.lg,
    },
  },
  
  /** Secondary card variant */
  secondary: {
    backgroundColor: 'rgba(26, 43, 69, 0.5)',
    borderColor: colors.border.secondary,
    color: colors.text.primary,
    boxShadow: boxShadow.sm,
    
    /** Hover state */
    _hover: {
      boxShadow: boxShadow.md,
    },
  },
  
  /** Quantum card variant */
  quantum: {
    backgroundColor: 'rgba(106, 27, 154, 0.2)',
    borderColor: colors.secondary.quantum,
    color: colors.text.primary,
    boxShadow: boxShadow.md,
    
    /** Hover state */
    _hover: {
      boxShadow: boxShadow.quantumGlow,
    },
  },
  
  /** Cosmic card variant */
  cosmic: {
    backgroundColor: 'rgba(58, 108, 175, 0.2)',
    borderColor: colors.primary.stellar,
    color: colors.text.primary,
    boxShadow: boxShadow.md,
    
    /** Hover state */
    _hover: {
      boxShadow: boxShadow.cosmicGlow,
    },
  },
  
  /** Elevated card variant */
  elevated: {
    backgroundColor: colors.background.card,
    borderColor: 'transparent',
    color: colors.text.primary,
    boxShadow: boxShadow.lg,
    
    /** Hover state */
    _hover: {
      boxShadow: boxShadow.xl,
    },
  },
  
  /** Outlined card variant */
  outlined: {
    backgroundColor: 'transparent',
    borderColor: colors.border.primary,
    color: colors.text.primary,
    boxShadow: boxShadow.none,
    
    /** Hover state */
    _hover: {
      borderColor: colors.border.secondary,
    },
  },
};

/**
 * Card sizes
 */
export const cardSize = {
  /** Small card size */
  sm: {
    padding: spacing.space['4'],
  },
  
  /** Medium card size */
  md: {
    padding: spacing.space['6'],
  },
  
  /** Large card size */
  lg: {
    padding: spacing.space['8'],
  },
};

/**
 * Base card style
 */
export const cardBase = {
  display: 'flex',
  flexDirection: 'column',
  borderRadius: borderRadius.lg,
  borderWidth: '1px',
  borderStyle: 'solid',
  transition: transition.all,
  overflow: 'hidden',
};

/**
 * Card styles
 */
export const card = {
  base: cardBase,
  variant: cardVariant,
  size: cardSize,
};