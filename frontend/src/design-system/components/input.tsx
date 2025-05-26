/**
 * Input Styles
 *
 * This module defines the input styles for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';
/**
 * Input sizes
 */
export const inputSize = {
    /** Small input size */
    sm: {
        height: spacing.space['8'],
        padding: `0 ${spacing.space['3']}`,
        fontSize: typography.fontSize.sm,
    },
    /** Medium input size */
    md: {
        height: spacing.space['10'],
        padding: `0 ${spacing.space['4']}`,
        fontSize: typography.fontSize.base,
    },
    /** Large input size */
    lg: {
        height: spacing.space['12'],
        padding: `0 ${spacing.space['6']}`,
        fontSize: typography.fontSize.lg,
    },
};
/**
 * Input variants
 */
export const inputVariant = {
    /** Outline input variant */
    outline: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderColor: colors.border.primary,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            borderColor: colors.border.secondary,
        },
        /** Focus state */
        _focus: {
            borderColor: colors.primary.stellar,
            boxShadow: `0 0 0 1px ${colors.primary.stellar}`,
        },
        /** Disabled state */
        _disabled: {
            backgroundColor: 'rgba(26, 43, 69, 0.3)',
            borderColor: colors.border.primary,
            color: colors.text.disabled,
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    },
    /** Filled input variant */
    filled: {
        backgroundColor: 'rgba(26, 43, 69, 0.5)',
        color: colors.text.primary,
        borderColor: 'transparent',
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: boxShadow.none,
        /** Hover state */
        _hover: {
            backgroundColor: 'rgba(26, 43, 69, 0.7)',
        },
        /** Focus state */
        _focus: {
            backgroundColor: 'rgba(26, 43, 69, 0.7)',
            borderColor: colors.primary.stellar,
            boxShadow: `0 0 0 1px ${colors.primary.stellar}`,
        },
        /** Disabled state */
        _disabled: {
            backgroundColor: 'rgba(26, 43, 69, 0.3)',
            color: colors.text.disabled,
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    },
    /** Flushed input variant */
    flushed: {
        backgroundColor: 'transparent',
        color: colors.text.primary,
        borderColor: 'transparent',
        borderWidth: '0 0 1px 0',
        borderStyle: 'solid',
        borderRadius: 0,
        boxShadow: boxShadow.none,
        paddingLeft: 0,
        paddingRight: 0,
        /** Hover state */
        _hover: {
            borderColor: colors.border.primary,
        },
        /** Focus state */
        _focus: {
            borderColor: colors.primary.stellar,
            boxShadow: `0 1px 0 0 ${colors.primary.stellar}`,
        },
        /** Disabled state */
        _disabled: {
            borderColor: 'rgba(26, 43, 69, 0.3)',
            color: colors.text.disabled,
            opacity: 0.6,
            cursor: 'not-allowed',
        },
    },
};
/**
 * Base input style
 */
export const inputBase = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    borderRadius: borderRadius.md,
    fontFamily: typography.fontFamily.secondary,
    fontWeight: typography.fontWeight.regular,
    transition: transition.all,
    outline: 'none',
    /** Placeholder */
    '::placeholder': {
        color: colors.text.disabled,
    },
};
/**
 * Input styles
 */
export const input = {
    base: inputBase,
    size: inputSize,
    variant: inputVariant,
};
