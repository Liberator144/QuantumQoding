/**
 * Navigation Styles
 *
 * This module defines the navigation styles for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';
/**
 * Navigation item variants
 */
export const navigationItemVariant = {
    /** Primary navigation item variant */
    primary: {
        color: colors.text.secondary,
        /** Hover state */
        _hover: {
            color: colors.text.primary,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        /** Active state */
        _active: {
            color: colors.text.primary,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderLeftColor: colors.primary.stellar,
        },
        /** Disabled state */
        _disabled: {
            color: colors.text.disabled,
            cursor: 'not-allowed',
        },
    },
    /** Secondary navigation item variant */
    secondary: {
        color: colors.text.secondary,
        /** Hover state */
        _hover: {
            color: colors.text.primary,
            backgroundColor: 'transparent',
            borderBottomColor: colors.primary.stellar,
        },
        /** Active state */
        _active: {
            color: colors.text.primary,
            backgroundColor: 'transparent',
            borderBottomColor: colors.primary.stellar,
        },
        /** Disabled state */
        _disabled: {
            color: colors.text.disabled,
            cursor: 'not-allowed',
        },
    },
    /** Minimal navigation item variant */
    minimal: {
        color: colors.text.secondary,
        /** Hover state */
        _hover: {
            color: colors.text.primary,
        },
        /** Active state */
        _active: {
            color: colors.primary.stellar,
        },
        /** Disabled state */
        _disabled: {
            color: colors.text.disabled,
            cursor: 'not-allowed',
        },
    },
};
/**
 * Navigation item sizes
 */
export const navigationItemSize = {
    /** Small navigation item size */
    sm: {
        height: spacing.space['8'],
        padding: `0 ${spacing.space['3']}`,
        fontSize: typography.fontSize.sm,
    },
    /** Medium navigation item size */
    md: {
        height: spacing.space['10'],
        padding: `0 ${spacing.space['4']}`,
        fontSize: typography.fontSize.base,
    },
    /** Large navigation item size */
    lg: {
        height: spacing.space['12'],
        padding: `0 ${spacing.space['6']}`,
        fontSize: typography.fontSize.lg,
    },
};
/**
 * Base navigation item style
 */
export const navigationItemBase = {
    display: 'flex',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.medium,
    transition: transition.all,
    cursor: 'pointer',
    borderLeftWidth: '3px',
    borderLeftStyle: 'solid',
    borderLeftColor: 'transparent',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: 'transparent',
};
/**
 * Navigation bar style
 */
export const navigationBar = {
    /** Horizontal navigation bar */
    horizontal: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background.secondary,
        padding: `0 ${spacing.space['4']}`,
        height: spacing.layout.header,
        boxShadow: boxShadow.md,
    },
    /** Vertical navigation bar */
    vertical: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.background.secondary,
        width: spacing.layout.sidebar,
        height: '100%',
        padding: spacing.space['4'],
        boxShadow: boxShadow.md,
    },
};
/**
 * Navigation styles
 */
export const navigation = {
    item: {
        base: navigationItemBase,
        variant: navigationItemVariant,
        size: navigationItemSize,
    },
    bar: navigationBar,
};
