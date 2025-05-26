/**
 * Theme
 *
 * This module defines the theme system for the QQ-Verse project.
 *
 * @version 1.0.0
 */
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { animations } from './animations';
/**
 * Border radius
 */
export const borderRadius = {
    /** No border radius */
    none: '0',
    /** Extra small border radius */
    xs: '2px',
    /** Small border radius */
    sm: '4px',
    /** Medium border radius */
    md: '8px',
    /** Large border radius */
    lg: '12px',
    /** Extra large border radius */
    xl: '16px',
    /** 2x large border radius */
    '2xl': '24px',
    /** Full border radius (circle) */
    full: '9999px',
};
/**
 * Box shadow
 */
export const boxShadow = {
    /** No box shadow */
    none: 'none',
    /** Extra small box shadow */
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    /** Small box shadow */
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    /** Medium box shadow */
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    /** Large box shadow */
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    /** Extra large box shadow */
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    /** 2x large box shadow */
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    /** Inner box shadow */
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    /** Cosmic glow box shadow */
    cosmicGlow: '0 0 15px rgba(74, 141, 228, 0.5)',
    /** Quantum glow box shadow */
    quantumGlow: '0 0 15px rgba(171, 71, 188, 0.5)',
    /** Star glow box shadow */
    starGlow: '0 0 15px rgba(255, 215, 0, 0.5)',
};
/**
 * Transition
 */
export const transition = {
    /** No transition */
    none: 'none',
    /** All properties transition */
    all: `all ${animations.duration.normal} ${animations.easing.easeInOut}`,
    /** Colors transition */
    colors: `background-color ${animations.duration.normal} ${animations.easing.easeInOut}, border-color ${animations.duration.normal} ${animations.easing.easeInOut}, color ${animations.duration.normal} ${animations.easing.easeInOut}, fill ${animations.duration.normal} ${animations.easing.easeInOut}, stroke ${animations.duration.normal} ${animations.easing.easeInOut}`,
    /** Opacity transition */
    opacity: `opacity ${animations.duration.normal} ${animations.easing.easeInOut}`,
    /** Shadow transition */
    shadow: `box-shadow ${animations.duration.normal} ${animations.easing.easeInOut}`,
    /** Transform transition */
    transform: `transform ${animations.duration.normal} ${animations.easing.easeInOut}`,
};
/**
 * Base theme
 */
export const baseTheme = {
    colors,
    typography,
    spacing,
    animations,
    borderRadius,
    boxShadow,
    transition,
};
