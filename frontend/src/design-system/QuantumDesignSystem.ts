/**
 * Quantum Design System - Revolutionary Universal Design Language
 * 
 * Core quantum design principles and philosophy based on quantum field theory,
 * with design tokens, interaction patterns, and visual hierarchy.
 * 
 * @version 1.0.0
 */

// Quantum Design Principles
export const QuantumDesignPrinciples = {
    // Core Philosophy
    philosophy: {
        coherence: "All elements maintain quantum coherence across the system",
        entanglement: "Components are quantum entangled - changes propagate instantly",
        superposition: "Elements can exist in multiple states simultaneously",
        uncertainty: "Embrace uncertainty in interactions for dynamic experiences",
        observation: "User observation affects the quantum state of components"
    },

    // Visual Hierarchy based on Quantum Field Theory
    hierarchy: {
        quantumCore: "Central focal point - highest energy state",
        orbitalLayers: "Decreasing energy levels from core outward",
        fieldLines: "Visual connections showing quantum field interactions",
        particleEffects: "Micro-interactions representing quantum particles",
        wavePatterns: "Flowing animations representing wave functions"
    },

    // Interaction Patterns inspired by Quantum Mechanics
    interactions: {
        quantumTunneling: "Elements can transition through barriers",
        waveCollapse: "Hover states collapse superposition to definite states",
        entanglement: "Related elements react simultaneously",
        quantumLeap: "Instant state transitions without intermediate steps",
        fieldDisturbance: "User actions create ripple effects"
    }
};

// Quantum Color Palette
export const QuantumColors = {
    // Primary Quantum Colors
    primary: {
        quantum: "#8b5cf6", // Purple - Core quantum energy
        cyber: "#06b6d4",   // Cyan - Digital quantum state
        energy: "#10b981",  // Green - Positive energy
        plasma: "#f59e0b",  // Amber - High energy plasma
        void: "#1f2937"     // Dark - Quantum void
    },

    // Semantic Colors
    semantic: {
        success: "#10b981",
        warning: "#f59e0b", 
        error: "#ef4444",
        info: "#06b6d4",
        neutral: "#6b7280"
    },

    // Quantum States
    states: {
        ground: "#1f2937",      // Ground state
        excited: "#8b5cf6",     // Excited state
        superposition: "#06b6d4", // Superposition
        entangled: "#10b981",   // Entangled state
        collapsed: "#ef4444"    // Wave function collapse
    },

    // Opacity Levels for Quantum Effects
    opacity: {
        ghost: "10",      // 10% - Barely visible
        ethereal: "20",   // 20% - Ethereal presence
        translucent: "40", // 40% - Translucent
        visible: "60",    // 60% - Clearly visible
        solid: "80",      // 80% - Nearly solid
        opaque: "100"     // 100% - Completely opaque
    }
};

// Typography Scale
export const QuantumTypography = {
    // Font Families
    fonts: {
        primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        mono: "'JetBrains Mono', 'Fira Code', monospace",
        display: "'Space Grotesk', sans-serif"
    },

    // Font Sizes (rem units)
    sizes: {
        xs: "0.75rem",    // 12px
        sm: "0.875rem",   // 14px
        base: "1rem",     // 16px
        lg: "1.125rem",   // 18px
        xl: "1.25rem",    // 20px
        "2xl": "1.5rem",  // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.25rem", // 36px
        "5xl": "3rem",    // 48px
        "6xl": "3.75rem"  // 60px
    },

    // Font Weights
    weights: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800"
    },

    // Line Heights
    lineHeights: {
        tight: "1.25",
        normal: "1.5",
        relaxed: "1.75",
        loose: "2"
    }
};

// Spacing System (based on 4px grid)
export const QuantumSpacing = {
    // Base unit: 4px
    px: "1px",
    0: "0",
    1: "0.25rem",  // 4px
    2: "0.5rem",   // 8px
    3: "0.75rem",  // 12px
    4: "1rem",     // 16px
    5: "1.25rem",  // 20px
    6: "1.5rem",   // 24px
    8: "2rem",     // 32px
    10: "2.5rem",  // 40px
    12: "3rem",    // 48px
    16: "4rem",    // 64px
    20: "5rem",    // 80px
    24: "6rem",    // 96px
    32: "8rem",    // 128px
    40: "10rem",   // 160px
    48: "12rem",   // 192px
    56: "14rem",   // 224px
    64: "16rem"    // 256px
};

// Animation Timing and Easing
export const QuantumAnimations = {
    // Duration (milliseconds)
    duration: {
        instant: 0,
        fast: 150,
        normal: 300,
        slow: 500,
        slower: 750,
        slowest: 1000
    },

    // Easing Functions
    easing: {
        linear: "linear",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        easeOut: "cubic-bezier(0, 0, 0.2, 1)",
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        quantum: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Custom quantum easing
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
    },

    // Quantum-specific animations
    quantum: {
        waveCollapse: {
            duration: 300,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        },
        quantumTunnel: {
            duration: 500,
            easing: "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        },
        entanglement: {
            duration: 200,
            easing: "linear"
        },
        fieldDisturbance: {
            duration: 750,
            easing: "cubic-bezier(0, 0, 0.2, 1)"
        }
    }
};

// Breakpoints for Responsive Design
export const QuantumBreakpoints = {
    xs: "320px",   // Extra small devices
    sm: "640px",   // Small devices
    md: "768px",   // Medium devices
    lg: "1024px",  // Large devices
    xl: "1280px",  // Extra large devices
    "2xl": "1536px" // 2X large devices
};

// Shadow System
export const QuantumShadows = {
    // Standard shadows
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",

    // Quantum glow effects
    quantum: {
        purple: "0 0 20px rgba(139, 92, 246, 0.5)",
        cyan: "0 0 20px rgba(6, 182, 212, 0.5)",
        green: "0 0 20px rgba(16, 185, 129, 0.5)",
        amber: "0 0 20px rgba(245, 158, 11, 0.5)"
    },

    // Inner shadows for depth
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
};

// Border Radius
export const QuantumBorderRadius = {
    none: "0",
    sm: "0.125rem",   // 2px
    base: "0.25rem",  // 4px
    md: "0.375rem",   // 6px
    lg: "0.5rem",     // 8px
    xl: "0.75rem",    // 12px
    "2xl": "1rem",    // 16px
    "3xl": "1.5rem",  // 24px
    full: "9999px"
};

// Z-Index Scale
export const QuantumZIndex = {
    hide: -1,
    auto: "auto",
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
};

// Component Variants
export const QuantumVariants = {
    // Button variants
    button: {
        primary: {
            background: QuantumColors.primary.quantum,
            color: "white",
            hover: {
                background: "#7c3aed",
                transform: "scale(1.05)"
            }
        },
        secondary: {
            background: "transparent",
            color: QuantumColors.primary.quantum,
            border: `1px solid ${QuantumColors.primary.quantum}`,
            hover: {
                background: `${QuantumColors.primary.quantum}20`
            }
        },
        ghost: {
            background: "transparent",
            color: QuantumColors.primary.quantum,
            hover: {
                background: `${QuantumColors.primary.quantum}10`
            }
        }
    },

    // Card variants
    card: {
        elevated: {
            background: `${QuantumColors.primary.void}90`,
            border: `1px solid ${QuantumColors.primary.quantum}30`,
            shadow: QuantumShadows.lg,
            backdropFilter: "blur(12px)"
        },
        flat: {
            background: `${QuantumColors.primary.void}60`,
            border: `1px solid ${QuantumColors.primary.quantum}20`
        },
        quantum: {
            background: `linear-gradient(135deg, ${QuantumColors.primary.quantum}20, ${QuantumColors.primary.cyber}20)`,
            border: `1px solid ${QuantumColors.primary.quantum}50`,
            boxShadow: QuantumShadows.quantum.purple
        }
    }
};

// Export complete design system
export const QuantumDesignSystem = {
    principles: QuantumDesignPrinciples,
    colors: QuantumColors,
    typography: QuantumTypography,
    spacing: QuantumSpacing,
    animations: QuantumAnimations,
    breakpoints: QuantumBreakpoints,
    shadows: QuantumShadows,
    borderRadius: QuantumBorderRadius,
    zIndex: QuantumZIndex,
    variants: QuantumVariants
};