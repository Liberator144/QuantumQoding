/**
 * Quantum Form Design and Interaction Standardization System
 * Standardized form components, validation, and interaction patterns
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Form component types
export type FormFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'quantum';
export type FormFieldSize = 'sm' | 'md' | 'lg';
export type FormFieldState = 'default' | 'focus' | 'valid' | 'invalid' | 'disabled' | 'loading';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'quantum' | 'danger';

// Standard form field configurations
export const FORM_FIELD_STANDARDS = {
  // Base field styling
  base: {
    fontFamily: TEXT_STYLES.body.fontFamily,
    fontSize: TEXT_STYLES.body.fontSize,
    lineHeight: TEXT_STYLES.body.lineHeight,
    borderRadius: '6px',
    border: `1px solid ${QUANTUM_COLORS.border.primary}`,
    backgroundColor: QUANTUM_COLORS.background.card,
    color: QUANTUM_COLORS.grayscale.white,
    transition: `all ${QUANTUM_TIMING.hover}ms ${QUANTUM_EASING.cosmicFlow}`
  },

  // Field sizes
  sizes: {
    sm: {
      height: '36px',
      padding: '0 0.75rem',
      fontSize: TEXT_STYLES.bodySmall.fontSize
    },
    md: {
      height: '44px',
      padding: '0 1rem',
      fontSize: TEXT_STYLES.body.fontSize
    },
    lg: {
      height: '52px',
      padding: '0 1.25rem',
      fontSize: TEXT_STYLES.bodyLarge.fontSize
    }
  },

  // Field states
  states: {
    default: {
      borderColor: QUANTUM_COLORS.border.primary,
      backgroundColor: QUANTUM_COLORS.background.card,
      color: QUANTUM_COLORS.grayscale.white
    },
    focus: {
      borderColor: QUANTUM_COLORS.border.focus,
      backgroundColor: QUANTUM_COLORS.background.card,
      boxShadow: `0 0 0 2px ${QUANTUM_COLORS.border.focus}20`,
      outline: 'none'
    },
    valid: {
      borderColor: QUANTUM_COLORS.semantic.success,
      backgroundColor: `${QUANTUM_COLORS.semantic.success}05`
    },
    invalid: {
      borderColor: QUANTUM_COLORS.semantic.error,
      backgroundColor: `${QUANTUM_COLORS.semantic.error}05`
    },
    disabled: {
      borderColor: QUANTUM_COLORS.border.secondary,
      backgroundColor: QUANTUM_COLORS.grayscale.gray800,
      color: QUANTUM_COLORS.grayscale.gray400,
      cursor: 'not-allowed',
      opacity: 0.6
    },
    loading: {
      borderColor: QUANTUM_COLORS.border.primary,
      backgroundColor: QUANTUM_COLORS.background.card,
      cursor: 'wait'
    }
  },

  // Special quantum field styling
  quantum: {
    background: `linear-gradient(45deg, ${QUANTUM_COLORS.background.card}, ${QUANTUM_COLORS.primary.quantum}10)`,
    borderImage: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}, ${QUANTUM_COLORS.secondary.aurora}) 1`,
    boxShadow: `0 0 20px ${QUANTUM_COLORS.primary.quantum}20`,
    '&:focus': {
      boxShadow: `0 0 30px ${QUANTUM_COLORS.primary.quantum}40`,
      borderImage: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}, ${QUANTUM_COLORS.primary.stellar}) 1`
    }
  }
} as const;

// Button standardization
export const BUTTON_STANDARDS = {
  // Base button styling
  base: {
    fontFamily: TEXT_STYLES.body.fontFamily,
    fontWeight: TEXT_STYLES.h6.fontWeight,
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: `all ${QUANTUM_TIMING.hover}ms ${QUANTUM_EASING.energyPulse}`,
    textDecoration: 'none',
    userSelect: 'none'
  },

  // Button sizes
  sizes: {
    sm: {
      height: '32px',
      padding: '0 0.75rem',
      fontSize: TEXT_STYLES.bodySmall.fontSize,
      minWidth: '80px'
    },
    md: {
      height: '44px',
      padding: '0 1.5rem',
      fontSize: TEXT_STYLES.body.fontSize,
      minWidth: '120px'
    },
    lg: {
      height: '52px',
      padding: '0 2rem',
      fontSize: TEXT_STYLES.bodyLarge.fontSize,
      minWidth: '160px'
    }
  },

  // Button variants
  variants: {
    primary: {
      backgroundColor: QUANTUM_COLORS.primary.quantum,
      color: QUANTUM_COLORS.grayscale.black,
      '&:hover': {
        backgroundColor: QUANTUM_COLORS.secondary.aurora,
        boxShadow: `0 4px 12px ${QUANTUM_COLORS.primary.quantum}40`,
        transform: 'translateY(-1px)'
      },
      '&:active': {
        transform: 'translateY(0)',
        boxShadow: `0 2px 8px ${QUANTUM_COLORS.primary.quantum}60`
      }
    },

    secondary: {
      backgroundColor: QUANTUM_COLORS.grayscale.gray700,
      color: QUANTUM_COLORS.grayscale.white,
      '&:hover': {
        backgroundColor: QUANTUM_COLORS.grayscale.gray600,
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`
      }
    },

    outline: {
      backgroundColor: 'transparent',
      color: QUANTUM_COLORS.primary.quantum,
      border: `1px solid ${QUANTUM_COLORS.primary.quantum}`,
      '&:hover': {
        backgroundColor: QUANTUM_COLORS.primary.quantum,
        color: QUANTUM_COLORS.grayscale.black
      }
    },

    ghost: {
      backgroundColor: 'transparent',
      color: QUANTUM_COLORS.grayscale.gray300,
      '&:hover': {
        backgroundColor: QUANTUM_COLORS.states.hover,
        color: QUANTUM_COLORS.grayscale.white
      }
    },

    quantum: {
      background: `linear-gradient(45deg, ${QUANTUM_COLORS.primary.quantum}, ${QUANTUM_COLORS.secondary.aurora})`,
      color: QUANTUM_COLORS.grayscale.black,
      boxShadow: `0 0 20px ${QUANTUM_COLORS.primary.quantum}30`,
      '&:hover': {
        background: `linear-gradient(45deg, ${QUANTUM_COLORS.secondary.aurora}, ${QUANTUM_COLORS.primary.stellar})`,
        boxShadow: `0 0 30px ${QUANTUM_COLORS.primary.quantum}50`,
        transform: 'translateY(-2px) scale(1.02)'
      }
    },

    danger: {
      backgroundColor: QUANTUM_COLORS.semantic.error,
      color: QUANTUM_COLORS.grayscale.white,
      '&:hover': {
        backgroundColor: '#ff4444',
        boxShadow: `0 4px 12px ${QUANTUM_COLORS.semantic.error}40`
      }
    }
  },

  // Button states
  states: {
    disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    },
    loading: {
      cursor: 'wait',
      position: 'relative',
      color: 'transparent'
    }
  }
} as const;

// Form layout standards
export const FORM_LAYOUT_STANDARDS = {
  // Form spacing
  spacing: {
    fieldGap: '1rem',
    sectionGap: '2rem',
    labelMargin: '0.5rem',
    helpTextMargin: '0.25rem'
  },

  // Form grid layouts
  layouts: {
    single: {
      gridTemplateColumns: '1fr',
      gap: '1rem'
    },
    double: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    triple: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '1rem',
      '@media (max-width: 1024px)': {
        gridTemplateColumns: 'repeat(2, 1fr)'
      },
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    },
    sidebar: {
      gridTemplateColumns: '200px 1fr',
      gap: '2rem',
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr'
      }
    }
  },

  // Label positioning
  labelPositions: {
    top: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    left: {
      display: 'grid',
      gridTemplateColumns: '150px 1fr',
      gap: '1rem',
      alignItems: 'center'
    },
    inline: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  }
} as const;

// Form validation and submission
export const FORM_SUBMISSION_STANDARDS = {
  // Validation timing
  validation: {
    onBlur: true,
    onChange: false,
    onSubmit: true,
    debounceMs: 300
  },

  // Submission states
  submission: {
    idle: {
      buttonText: 'Submit',
      buttonVariant: 'primary' as ButtonVariant,
      disabled: false
    },
    validating: {
      buttonText: 'Validating...',
      buttonVariant: 'secondary' as ButtonVariant,
      disabled: true
    },
    submitting: {
      buttonText: 'Submitting...',
      buttonVariant: 'primary' as ButtonVariant,
      disabled: true,
      showSpinner: true
    },
    success: {
      buttonText: 'Success!',
      buttonVariant: 'primary' as ButtonVariant,
      disabled: true,
      duration: 2000
    },
    error: {
      buttonText: 'Try Again',
      buttonVariant: 'danger' as ButtonVariant,
      disabled: false
    }
  },

  // Error handling
  errorHandling: {
    showFieldErrors: true,
    showSummaryErrors: true,
    scrollToFirstError: true,
    focusFirstError: true,
    retryAttempts: 3
  }
} as const;

// Accessibility standards for forms
export const FORM_ACCESSIBILITY_STANDARDS = {
  // ARIA attributes
  aria: {
    required: 'aria-required',
    invalid: 'aria-invalid',
    describedBy: 'aria-describedby',
    labelledBy: 'aria-labelledby',
    expanded: 'aria-expanded',
    controls: 'aria-controls'
  },

  // Keyboard navigation
  keyboard: {
    tabOrder: true,
    enterSubmit: true,
    escapeCancel: true,
    arrowNavigation: true
  },

  // Screen reader support
  screenReader: {
    fieldDescriptions: true,
    errorAnnouncements: true,
    progressUpdates: true,
    completionNotification: true
  },

  // Focus management
  focus: {
    visibleIndicators: true,
    logicalOrder: true,
    trapInModals: true,
    restoreOnClose: true
  }
} as const;

// Form utility functions
export const formUtils = {
  // Create form field styles
  createFieldStyles(type: FormFieldType, size: FormFieldSize, state: FormFieldState) {
    const baseStyles = FORM_FIELD_STANDARDS.base;
    const sizeStyles = FORM_FIELD_STANDARDS.sizes[size];
    const stateStyles = FORM_FIELD_STANDARDS.states[state];

    if (type === 'quantum') {
      return {
        ...baseStyles,
        ...sizeStyles,
        ...stateStyles,
        ...FORM_FIELD_STANDARDS.quantum
      };
    }

    return {
      ...baseStyles,
      ...sizeStyles,
      ...stateStyles
    };
  },

  // Create button styles
  createButtonStyles(variant: ButtonVariant, size: FormFieldSize, disabled: boolean = false) {
    const baseStyles = BUTTON_STANDARDS.base;
    const sizeStyles = BUTTON_STANDARDS.sizes[size];
    const variantStyles = BUTTON_STANDARDS.variants[variant];
    const disabledStyles = disabled ? BUTTON_STANDARDS.states.disabled : {};

    return {
      ...baseStyles,
      ...sizeStyles,
      ...variantStyles,
      ...disabledStyles
    };
  },

  // Generate form layout
  createFormLayout(layout: keyof typeof FORM_LAYOUT_STANDARDS.layouts) {
    return FORM_LAYOUT_STANDARDS.layouts[layout];
  },

  // Create accessibility attributes
  createAccessibilityAttributes(fieldId: string, options: any = {}) {
    const attributes: Record<string, any> = {
      id: fieldId,
      'aria-required': options.required || false,
      'aria-invalid': options.invalid || false
    };

    if (options.describedBy) {
      attributes['aria-describedby'] = options.describedBy;
    }

    if (options.labelledBy) {
      attributes['aria-labelledby'] = options.labelledBy;
    }

    return attributes;
  },

  // Form validation manager
  createValidationManager() {
    const errors = new Map<string, string[]>();
    const touched = new Set<string>();

    return {
      // Add field error
      addError(fieldId: string, error: string) {
        const fieldErrors = errors.get(fieldId) || [];
        fieldErrors.push(error);
        errors.set(fieldId, fieldErrors);
      },

      // Clear field errors
      clearErrors(fieldId: string) {
        errors.delete(fieldId);
      },

      // Get field errors
      getErrors(fieldId: string) {
        return errors.get(fieldId) || [];
      },

      // Check if field has errors
      hasErrors(fieldId: string) {
        const fieldErrors = errors.get(fieldId) || [];
        return fieldErrors.length > 0;
      },

      // Mark field as touched
      touch(fieldId: string) {
        touched.add(fieldId);
      },

      // Check if field is touched
      isTouched(fieldId: string) {
        return touched.has(fieldId);
      },

      // Get all errors
      getAllErrors() {
        return Array.from(errors.entries()).reduce((acc, [fieldId, fieldErrors]) => {
          acc[fieldId] = fieldErrors;
          return acc;
        }, {} as Record<string, string[]>);
      },

      // Check if form is valid
      isValid() {
        return errors.size === 0;
      },

      // Clear all errors
      clearAll() {
        errors.clear();
        touched.clear();
      }
    };
  }
};

// Form component factory
export const createFormComponent = (type: FormFieldType, options: any = {}) => {
  const standards = FORM_FIELD_STANDARDS;

  return {
    type,
    standards,
    options,

    // Get component styles
    getStyles(size: FormFieldSize = 'md', state: FormFieldState = 'default') {
      return formUtils.createFieldStyles(type, size, state);
    },

    // Get accessibility attributes
    getAccessibilityProps(fieldId: string, validationOptions: any = {}) {
      return formUtils.createAccessibilityAttributes(fieldId, {
        required: options.required,
        invalid: validationOptions.invalid,
        describedBy: `${fieldId}-help ${fieldId}-error`,
        ...validationOptions
      });
    },

    // Handle field interactions
    handleFocus() {
      // Apply focus styles and emit focus event
    },

    handleBlur() {
      // Apply blur styles and trigger validation if enabled
    },

    handleChange(value: any) {
      // Update value and trigger onChange validation if enabled
    }
  };
};

// Button component factory
export const createButtonComponent = (variant: ButtonVariant, options: any = {}) => {
  const standards = BUTTON_STANDARDS;

  return {
    variant,
    standards,
    options,

    // Get component styles
    getStyles(size: FormFieldSize = 'md', disabled: boolean = false) {
      return formUtils.createButtonStyles(variant, size, disabled);
    },

    // Get loading state styles
    getLoadingStyles() {
      return {
        ...BUTTON_STANDARDS.states.loading,
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '16px',
          height: '16px',
          border: '2px solid transparent',
          borderTop: '2px solid currentColor',
          borderRadius: '50%',
          animation: `spin ${QUANTUM_TIMING.loading}ms linear infinite`
        }
      };
    },

    // Handle button interactions
    handleClick(event: MouseEvent) {
      if (options.disabled || options.loading) {
        event.preventDefault();
        return;
      }

      // Apply click animation and trigger onClick
    }
  };
};

// Export types
export type FormFieldStandards = typeof FORM_FIELD_STANDARDS;
export type ButtonStandards = typeof BUTTON_STANDARDS;
export type FormLayoutStandards = typeof FORM_LAYOUT_STANDARDS;
