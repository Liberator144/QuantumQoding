/**
 * Typography
 *
 * This module defines the typography system for the QQ-Verse project.
 *
 * @version 1.0.0
 */
/**
 * Font families
 */
export const fontFamily = {
    /** Primary font family */
    primary: "'Space Grotesk', sans-serif",
    /** Secondary font family */
    secondary: "'Inter', sans-serif",
    /** Monospace font family */
    monospace: "'Fira Code', monospace",
};
/**
 * Font sizes
 */
export const fontSize = {
    /** Extra small font size */
    xs: '0.75rem', // 12px
    /** Small font size */
    sm: '0.875rem', // 14px
    /** Base font size */
    base: '1rem', // 16px
    /** Medium font size */
    md: '1.125rem', // 18px
    /** Large font size */
    lg: '1.25rem', // 20px
    /** Extra large font size */
    xl: '1.5rem', // 24px
    /** 2x large font size */
    '2xl': '1.875rem', // 30px
    /** 3x large font size */
    '3xl': '2.25rem', // 36px
    /** 4x large font size */
    '4xl': '3rem', // 48px
    /** 5x large font size */
    '5xl': '4rem', // 64px
};
/**
 * Font weights
 */
export const fontWeight = {
    /** Light font weight */
    light: 300,
    /** Regular font weight */
    regular: 400,
    /** Medium font weight */
    medium: 500,
    /** Semi-bold font weight */
    semibold: 600,
    /** Bold font weight */
    bold: 700,
};
/**
 * Line heights
 */
export const lineHeight = {
    /** Tight line height */
    tight: 1.2,
    /** Normal line height */
    normal: 1.5,
    /** Loose line height */
    loose: 1.8,
};
/**
 * Letter spacing
 */
export const letterSpacing = {
    /** Tight letter spacing */
    tight: '-0.025em',
    /** Normal letter spacing */
    normal: '0',
    /** Wide letter spacing */
    wide: '0.025em',
    /** Extra wide letter spacing */
    extraWide: '0.05em',
}; /**
 * Text styles
 */
export const textStyle = {
    /** Heading 1 */
    h1: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize['4xl'],
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Heading 2 */
    h2: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize['3xl'],
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Heading 3 */
    h3: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize['2xl'],
        fontWeight: fontWeight.bold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Heading 4 */
    h4: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize.xl,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Heading 5 */
    h5: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Heading 6 */
    h6: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.tight,
    },
    /** Body */
    body: {
        fontFamily: fontFamily.secondary,
        fontSize: fontSize.base,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
    /** Body small */
    bodySmall: {
        fontFamily: fontFamily.secondary,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
    /** Caption */
    caption: {
        fontFamily: fontFamily.secondary,
        fontSize: fontSize.xs,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.wide,
    },
    /** Button */
    button: {
        fontFamily: fontFamily.primary,
        fontSize: fontSize.base,
        fontWeight: fontWeight.medium,
        lineHeight: lineHeight.tight,
        letterSpacing: letterSpacing.wide,
    },
    /** Code */
    code: {
        fontFamily: fontFamily.monospace,
        fontSize: fontSize.sm,
        fontWeight: fontWeight.regular,
        lineHeight: lineHeight.normal,
        letterSpacing: letterSpacing.normal,
    },
};
/**
 * All typography
 */
export const typography = {
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    textStyle,
};
