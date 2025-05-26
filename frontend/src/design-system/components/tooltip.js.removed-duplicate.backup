/**
 * Tooltip Styles
 *
 * This module defines the tooltip styles for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from '../colors';
import { typography } from '../typography';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';
import { animations } from '../animations';
/**
 * Tooltip variants
 */
export const tooltipVariant = {
    /** Dark tooltip variant */
    dark: {
        backgroundColor: colors.background.primary,
        color: colors.text.primary,
        borderColor: colors.border.primary,
        boxShadow: boxShadow.md,
    },
    /** Light tooltip variant */
    light: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        color: colors.primary.deepSpace,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: boxShadow.md,
    },
    /** Cosmic tooltip variant */
    cosmic: {
        backgroundColor: 'rgba(42, 75, 122, 0.9)',
        color: colors.text.primary,
        borderColor: colors.primary.stellar,
        boxShadow: boxShadow.cosmicGlow,
    },
    /** Quantum tooltip variant */
    quantum: {
        backgroundColor: 'rgba(106, 27, 154, 0.9)',
        color: colors.text.primary,
        borderColor: colors.secondary.neural,
        boxShadow: boxShadow.quantumGlow,
    },
};
/**
 * Tooltip sizes
 */
export const tooltipSize = {
    /** Small tooltip size */
    sm: {
        padding: `${spacing.space['1']} ${spacing.space['2']}`,
        fontSize: typography.fontSize.xs,
        maxWidth: '200px',
    },
    /** Medium tooltip size */
    md: {
        padding: `${spacing.space['2']} ${spacing.space['3']}`,
        fontSize: typography.fontSize.sm,
        maxWidth: '300px',
    },
    /** Large tooltip size */
    lg: {
        padding: `${spacing.space['3']} ${spacing.space['4']}`,
        fontSize: typography.fontSize.base,
        maxWidth: '400px',
    },
};
/**
 * Tooltip placements
 */
export const tooltipPlacement = {
    /** Top placement */
    top: {
        marginBottom: spacing.space['2'],
    },
    /** Bottom placement */
    bottom: {
        marginTop: spacing.space['2'],
    },
    /** Left placement */
    left: {
        marginRight: spacing.space['2'],
    },
    /** Right placement */
    right: {
        marginLeft: spacing.space['2'],
    },
};
/**
 * Tooltip animations
 */
export const tooltipAnimation = {
    /** Scale animation */
    scale: {
        enter: animations.preset.scaleIn,
        exit: animations.preset.scaleOut,
    },
    /** Fade animation */
    fade: {
        enter: animations.preset.fadeIn,
        exit: animations.preset.fadeOut,
    },
};
/**
 * Base tooltip style
 */
export const tooltipBase = {
    position: 'relative',
    borderRadius: borderRadius.md,
    borderWidth: '1px',
    borderStyle: 'solid',
    fontFamily: typography.fontFamily.secondary,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.lineHeight.tight,
    zIndex: 'tooltip',
    transition: transition.all,
    pointerEvents: 'none',
};
/**
 * Tooltip arrow style
 */
export const tooltipArrow = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    transform: 'rotate(45deg)',
    /** Top placement */
    top: {
        bottom: '-4px',
    },
    /** Bottom placement */
    bottom: {
        top: '-4px',
    },
    /** Left placement */
    left: {
        right: '-4px',
    },
    /** Right placement */
    right: {
        left: '-4px',
    },
};
/**
 * Tooltip styles
 */
export const tooltip = {
    base: tooltipBase,
    variant: tooltipVariant,
    size: tooltipSize,
    placement: tooltipPlacement,
    animation: tooltipAnimation,
    arrow: tooltipArrow,
};
