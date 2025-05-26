/**
 * Modal Styles
 *
 * This module defines the modal styles for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from '../colors';
import { spacing } from '../spacing';
import { borderRadius, boxShadow, transition } from '../theme';
import { animations } from '../animations';
/**
 * Modal sizes
 */
export const modalSize = {
    /** Small modal size */
    sm: {
        width: '320px',
    },
    /** Medium modal size */
    md: {
        width: '480px',
    },
    /** Large modal size */
    lg: {
        width: '640px',
    },
    /** Extra large modal size */
    xl: {
        width: '800px',
    },
    /** Full modal size */
    full: {
        width: '100%',
        height: '100%',
        margin: 0,
        borderRadius: 0,
    },
};
/**
 * Modal variants
 */
export const modalVariant = {
    /** Primary modal variant */
    primary: {
        backgroundColor: colors.background.modal,
        borderColor: colors.border.primary,
        color: colors.text.primary,
        boxShadow: boxShadow.xl,
    },
    /** Cosmic modal variant */
    cosmic: {
        backgroundColor: 'rgba(10, 14, 23, 0.95)',
        borderColor: colors.primary.stellar,
        color: colors.text.primary,
        boxShadow: boxShadow.cosmicGlow,
    },
    /** Quantum modal variant */
    quantum: {
        backgroundColor: 'rgba(10, 14, 23, 0.95)',
        borderColor: colors.secondary.quantum,
        color: colors.text.primary,
        boxShadow: boxShadow.quantumGlow,
    },
};
/**
 * Modal animations
 */
export const modalAnimation = {
    /** Scale animation */
    scale: {
        enter: animations.preset.scaleIn,
        exit: animations.preset.scaleOut,
    },
    /** Slide from top animation */
    slideTop: {
        enter: animations.preset.slideInTop,
        exit: animations.preset.slideOutTop,
    },
    /** Slide from bottom animation */
    slideBottom: {
        enter: animations.preset.slideInBottom,
        exit: animations.preset.slideOutBottom,
    },
    /** Fade animation */
    fade: {
        enter: animations.preset.fadeIn,
        exit: animations.preset.fadeOut,
    },
};
/**
 * Modal overlay style
 */
export const modalOverlay = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 14, 23, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 'overlay',
    animation: animations.preset.fadeIn,
};
/**
 * Base modal style
 */
export const modalBase = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    margin: spacing.space['4'],
    borderRadius: borderRadius.lg,
    borderWidth: '1px',
    borderStyle: 'solid',
    maxHeight: 'calc(100vh - 2rem)',
    maxWidth: 'calc(100vw - 2rem)',
    overflow: 'hidden',
    zIndex: 'modal',
    transition: transition.all,
};
/**
 * Modal header style
 */
export const modalHeader = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${spacing.space['4']} ${spacing.space['6']}`,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: colors.border.primary,
};
/**
 * Modal body style
 */
export const modalBody = {
    padding: spacing.space['6'],
    overflow: 'auto',
    flex: 1,
};
/**
 * Modal footer style
 */
export const modalFooter = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: `${spacing.space['4']} ${spacing.space['6']}`,
    borderTopWidth: '1px',
    borderTopStyle: 'solid',
    borderTopColor: colors.border.primary,
};
/**
 * Modal close button style
 */
export const modalCloseButton = {
    position: 'absolute',
    top: spacing.space['4'],
    right: spacing.space['4'],
    width: spacing.space['8'],
    height: spacing.space['8'],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
    color: colors.text.secondary,
    border: 'none',
    cursor: 'pointer',
    transition: transition.all,
    /** Hover state */
    _hover: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: colors.text.primary,
    },
};
/**
 * Modal styles
 */
export const modal = {
    base: modalBase,
    size: modalSize,
    variant: modalVariant,
    animation: modalAnimation,
    overlay: modalOverlay,
    header: modalHeader,
    body: modalBody,
    footer: modalFooter,
    closeButton: modalCloseButton,
};
