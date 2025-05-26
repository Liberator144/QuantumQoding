/**
 * Button Styles
 *
 * This module defines the button styles for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';
/**
 * Button sizes
 */
export const buttonSize = {
    /** Small button size */
    sm: {
        height: spacing.space['8'],
        padding: `0 ${spacing.space['3']}`,
        fontSize: typography.fontSize.sm,
    },
    /** Medium button size */
    md: {
        height: spacing.space['10'],
        padding: `0 ${spacing.space['4']}`,
        fontSize: typography.fontSize.base,
    },
    /** Large button size */
    lg: {
        height: spacing.space['12'],
        padding: `0 ${spacing.space['6']}`,
        fontSize: typography.fontSize.lg,
    },
};
/**
 * Button variants
 */
export const buttonVariant = {
    /** Primary button variant */
    primary: {
        backgroundColor: colors.primary.stellar,
        color: colors.text.primary,
        borderColor: 'transparent',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            backgroundColor: colors.primary.celestial,
            boxShadow: boxShadow.cosmicGlow,
        },
        /** Active state */
        _active: {
            backgroundColor: colors.primary.nebula,
        },
        /** Disabled state */
        _disabled: {
            backgroundColor: colors.primary.nebula,
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    /** Secondary button variant */
    secondary: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderColor: colors.primary.stellar,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            backgroundColor: 'rgba(58, 108, 175, 0.1)',
            borderColor: colors.primary.celestial,
            boxShadow: boxShadow.cosmicGlow,
        },
        /** Active state */
        _active: {
            backgroundColor: 'rgba(58, 108, 175, 0.2)',
        },
        /** Disabled state */
        _disabled: {
            borderColor: colors.primary.nebula,
            color: colors.text.disabled,
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    /** Quantum button variant */
    quantum: {
        backgroundColor: colors.secondary.quantum,
        color: colors.text.primary,
        borderColor: 'transparent',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            backgroundColor: colors.secondary.dimensional,
            boxShadow: boxShadow.quantumGlow,
        },
        /** Active state */
        _active: {
            backgroundColor: colors.secondary.neural,
        },
        /** Disabled state */
        _disabled: {
            backgroundColor: colors.secondary.neural,
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    /** Ghost button variant */
    ghost: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderColor: 'transparent',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        /** Active state */
        _active: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        /** Disabled state */
        _disabled: {
            color: colors.text.disabled,
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    /** Link button variant */
    link: {
        backgroundColor: 'transparent',
        color: colors.primary.celestial,
        borderColor: 'transparent',
        boxShadow: boxShadow.none,
        padding: 0,
        height: 'auto',
        /** Hover state */
        _hover: {
            color: colors.primary.stellar,
            textDecoration: 'underline',
        },
        /** Active state */
        _active: {
            color: colors.primary.nebula,
        },
        /** Disabled state */
        _disabled: {
            color: colors.text.disabled,
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
};
/**
 * Base button style
 */
export const buttonBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    transition: transition.all,
    cursor: 'pointer',
    outline: 'none',
    /** Focus state */
    _focus: {
        boxShadow: `0 0 0 3px rgba(74, 141, 228, 0.4)`,
    },
};
/**
 * Button styles
 */
export const button = {
    base: buttonBase,
    size: buttonSize,
    variant: buttonVariant,
};
