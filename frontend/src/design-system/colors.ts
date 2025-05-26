/**
 * Colors
 *
 * This module defines the color palette for the QQ-Verse project.
 *
 * @version 1.0.0
 */
/**
 * Primary colors
 */
export const primary = {
    /** Deep space blue */
    deepSpace: '#0A0E17',
    /** Cosmic blue */
    cosmic: '#1A2B45',
    /** Nebula blue */
    nebula: '#2A4B7A',
    /** Stellar blue */
    stellar: '#3A6CAF',
    /** Celestial blue */
    celestial: '#4A8DE4',
};
/**
 * Secondary colors
 */
export const secondary = {
    /** Quantum purple */
    quantum: '#6A1B9A',
    /** Dimensional purple */
    dimensional: '#8E24AA',
    /** Neural purple */
    neural: '#AB47BC',
    /** Consciousness purple */
    consciousness: '#CE93D8',
};
/**
 * Accent colors
 */
export const accent = {
    /** Star yellow */
    star: '#FFD700',
    /** Planet green */
    planet: '#00C853',
    /** Galaxy red */
    galaxy: '#D50000',
    /** Wormhole cyan */
    wormhole: '#00BCD4',
    /** Singularity white */
    singularity: '#FFFFFF',
}; /**
 * Gradient colors
 */
export const gradients = {
    /** Cosmic gradient */
    cosmic: `linear-gradient(135deg, ${primary.deepSpace} 0%, ${primary.cosmic} 100%)`,
    /** Nebula gradient */
    nebula: `linear-gradient(135deg, ${primary.cosmic} 0%, ${primary.nebula} 100%)`,
    /** Stellar gradient */
    stellar: `linear-gradient(135deg, ${primary.nebula} 0%, ${primary.stellar} 100%)`,
    /** Quantum gradient */
    quantum: `linear-gradient(135deg, ${secondary.quantum} 0%, ${secondary.dimensional} 100%)`,
    /** Neural gradient */
    neural: `linear-gradient(135deg, ${secondary.dimensional} 0%, ${secondary.neural} 100%)`,
    /** Consciousness gradient */
    consciousness: `linear-gradient(135deg, ${secondary.neural} 0%, ${secondary.consciousness} 100%)`,
    /** Star gradient */
    star: `radial-gradient(circle, ${accent.singularity} 0%, ${accent.star} 100%)`,
    /** Planet gradient */
    planet: `radial-gradient(circle, ${accent.singularity} 0%, ${accent.planet} 100%)`,
    /** Galaxy gradient */
    galaxy: `radial-gradient(circle, ${accent.singularity} 0%, ${accent.galaxy} 100%)`,
    /** Wormhole gradient */
    wormhole: `radial-gradient(circle, ${accent.singularity} 0%, ${accent.wormhole} 100%)`,
};
/**
 * Text colors
 */
export const text = {
    /** Primary text color */
    primary: '#FFFFFF',
    /** Secondary text color */
    secondary: '#B0BEC5',
    /** Disabled text color */
    disabled: '#78909C',
    /** Accent text color */
    accent: accent.star,
};
/**
 * Background colors
 */
export const background = {
    /** Primary background color */
    primary: primary.deepSpace,
    /** Secondary background color */
    secondary: primary.cosmic,
    /** Tertiary background color */
    tertiary: primary.nebula,
    /** Card background color */
    card: 'rgba(26, 43, 69, 0.7)',
    /** Modal background color */
    modal: 'rgba(10, 14, 23, 0.9)',
}; /**
 * Border colors
 */
export const border = {
    /** Primary border color */
    primary: primary.nebula,
    /** Secondary border color */
    secondary: primary.stellar,
    /** Accent border color */
    accent: accent.star,
};
/**
 * Status colors
 */
export const status = {
    /** Success color */
    success: '#00C853',
    /** Warning color */
    warning: '#FFD600',
    /** Error color */
    error: '#D50000',
    /** Info color */
    info: '#00B0FF',
};
/**
 * All colors
 */
export const colors = {
    primary,
    secondary,
    accent,
    gradients,
    text,
    background,
    border,
    status,
};
