/**
 * Quantum Error Handling and Feedback Consistency System
 * Standardized error messages, notifications, validation, and feedback components
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Feedback types and severity levels
export type FeedbackType = 'error' | 'warning' | 'success' | 'info' | 'quantum';
export type FeedbackSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackVariant = 'toast' | 'banner' | 'modal' | 'inline' | 'tooltip';
export type FeedbackPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

// Standard error message configurations
export const ERROR_STANDARDS = {
  // Error message types
  types: {
    validation: {
      color: QUANTUM_COLORS.semantic.warning,
      icon: '⚠️',
      duration: 5000,
      dismissible: true
    },
    network: {
      color: QUANTUM_COLORS.semantic.error,
      icon: '🌐',
      duration: 8000,
      dismissible: true,
      retryable: true
    },
    authentication: {
      color: QUANTUM_COLORS.semantic.error,
      icon: '🔒',
      duration: 10000,
      dismissible: true,
      redirectable: true
    },
    permission: {
      color: QUANTUM_COLORS.semantic.warning,
      icon: '🚫',
      duration: 7000,
      dismissible: true
    },
    system: {
      color: QUANTUM_COLORS.semantic.error,
      icon: '⚡',
      duration: 0, // Persistent
      dismissible: false,
      reportable: true
    },
    quantum: {
      color: QUANTUM_COLORS.primary.quantum,
      icon: '⚛️',
      duration: 6000,
      dismissible: true,
      animated: true
    }
  },

  // Error severity styling
  severity: {
    low: {
      backgroundColor: `${QUANTUM_COLORS.semantic.info}15`,
      borderColor: QUANTUM_COLORS.semantic.info,
      textColor: QUANTUM_COLORS.grayscale.gray200
    },
    medium: {
      backgroundColor: `${QUANTUM_COLORS.semantic.warning}15`,
      borderColor: QUANTUM_COLORS.semantic.warning,
      textColor: QUANTUM_COLORS.grayscale.white
    },
    high: {
      backgroundColor: `${QUANTUM_COLORS.semantic.error}15`,
      borderColor: QUANTUM_COLORS.semantic.error,
      textColor: QUANTUM_COLORS.grayscale.white
    },
    critical: {
      backgroundColor: `${QUANTUM_COLORS.semantic.error}25`,
      borderColor: QUANTUM_COLORS.semantic.error,
      textColor: QUANTUM_COLORS.grayscale.white,
      boxShadow: `0 0 20px ${QUANTUM_COLORS.semantic.error}40`
    }
  },

  // Common error messages
  messages: {
    network: {
      offline: 'You appear to be offline. Please check your connection.',
      timeout: 'Request timed out. Please try again.',
      serverError: 'Server error occurred. Please try again later.',
      notFound: 'The requested resource was not found.',
      forbidden: 'You do not have permission to access this resource.'
    },
    validation: {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      password: 'Password must be at least 8 characters long.',
      match: 'Passwords do not match.',
      format: 'Please enter a valid format.'
    },
    authentication: {
      invalid: 'Invalid credentials. Please try again.',
      expired: 'Your session has expired. Please log in again.',
      locked: 'Account temporarily locked. Please try again later.',
      unverified: 'Please verify your email address.'
    },
    quantum: {
      coherence: 'Quantum coherence disrupted. Realigning...',
      entanglement: 'Entanglement synchronization failed.',
      tunnel: 'Quantum tunnel collapsed. Rebuilding...',
      matrix: 'Neural matrix connection unstable.'
    }
  }
} as const;

// Toast notification system
export const TOAST_STANDARDS = {
  // Toast positioning
  positions: {
    'top-left': { top: '1rem', left: '1rem' },
    'top-center': { top: '1rem', left: '50%', transform: 'translateX(-50%)' },
    'top-right': { top: '1rem', right: '1rem' },
    'bottom-left': { bottom: '1rem', left: '1rem' },
    'bottom-center': { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' },
    'bottom-right': { bottom: '1rem', right: '1rem' }
  },

  // Toast styling
  styling: {
    maxWidth: '400px',
    minWidth: '300px',
    padding: '1rem',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    border: '1px solid',
    zIndex: 9999,
    fontSize: TEXT_STYLES.body.fontSize,
    fontFamily: TEXT_STYLES.body.fontFamily
  },

  // Toast animations
  animations: {
    enter: {
      initial: { opacity: 0, y: -20, scale: 0.95 },
      animate: { opacity: 1, y: 0, scale: 1 },
      transition: {
        duration: QUANTUM_TIMING.transition / 1000,
        ease: QUANTUM_EASING.cosmicFlow
      }
    },
    exit: {
      animate: { opacity: 0, y: -20, scale: 0.95 },
      transition: {
        duration: QUANTUM_TIMING.fast / 1000,
        ease: QUANTUM_EASING.easeIn
      }
    },
    quantum: {
      initial: { opacity: 0, scale: 0, rotate: -180 },
      animate: { opacity: 1, scale: 1, rotate: 0 },
      exit: { opacity: 0, scale: 0, rotate: 180 },
      transition: {
        duration: QUANTUM_TIMING.dimensionalShift / 1000,
        ease: QUANTUM_EASING.quantumBounce
      }
    }
  },

  // Toast management
  management: {
    maxToasts: 5,
    stackSpacing: '0.5rem',
    autoRemoveDelay: 500,
    pauseOnHover: true,
    pauseOnFocus: true
  }
} as const;

// Form validation standards
export const VALIDATION_STANDARDS = {
  // Validation timing
  timing: {
    onBlur: true,
    onChange: false,
    onSubmit: true,
    debounceDelay: 300
  },

  // Validation styling
  styling: {
    valid: {
      borderColor: QUANTUM_COLORS.semantic.success,
      backgroundColor: `${QUANTUM_COLORS.semantic.success}05`,
      iconColor: QUANTUM_COLORS.semantic.success
    },
    invalid: {
      borderColor: QUANTUM_COLORS.semantic.error,
      backgroundColor: `${QUANTUM_COLORS.semantic.error}05`,
      iconColor: QUANTUM_COLORS.semantic.error
    },
    warning: {
      borderColor: QUANTUM_COLORS.semantic.warning,
      backgroundColor: `${QUANTUM_COLORS.semantic.warning}05`,
      iconColor: QUANTUM_COLORS.semantic.warning
    }
  },

  // Validation patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
    phone: /^\+?[\d\s\-\(\)]+$/,
    url: /^https?:\/\/.+/,
    quantum: /^QQ-[A-Z][a-zA-Z0-9]*$/
  },

  // Custom validators
  validators: {
    required: (value: any) => !!value || 'This field is required',
    minLength: (min: number) => (value: string) =>
      value.length >= min || `Minimum ${min} characters required`,
    maxLength: (max: number) => (value: string) =>
      value.length <= max || `Maximum ${max} characters allowed`,
    pattern: (pattern: RegExp, message: string) => (value: string) =>
      pattern.test(value) || message
  }
} as const;

// Success and confirmation feedback
export const SUCCESS_STANDARDS = {
  // Success message types
  types: {
    save: {
      message: 'Changes saved successfully',
      icon: '✅',
      color: QUANTUM_COLORS.semantic.success,
      duration: 3000
    },
    create: {
      message: 'Created successfully',
      icon: '🎉',
      color: QUANTUM_COLORS.semantic.success,
      duration: 4000
    },
    delete: {
      message: 'Deleted successfully',
      icon: '🗑️',
      color: QUANTUM_COLORS.semantic.success,
      duration: 3000
    },
    update: {
      message: 'Updated successfully',
      icon: '📝',
      color: QUANTUM_COLORS.semantic.success,
      duration: 3000
    },
    quantum: {
      message: 'Quantum operation completed',
      icon: '⚛️',
      color: QUANTUM_COLORS.primary.quantum,
      duration: 5000,
      animated: true
    }
  },

  // Confirmation dialogs
  confirmations: {
    delete: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      severity: 'high' as FeedbackSeverity
    },
    discard: {
      title: 'Discard Changes',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      confirmText: 'Discard',
      cancelText: 'Keep Editing',
      severity: 'medium' as FeedbackSeverity
    },
    logout: {
      title: 'Confirm Logout',
      message: 'Are you sure you want to log out?',
      confirmText: 'Logout',
      cancelText: 'Stay Logged In',
      severity: 'low' as FeedbackSeverity
    }
  }
} as const;

// Help and tooltip system
export const HELP_STANDARDS = {
  // Tooltip configurations
  tooltip: {
    maxWidth: '300px',
    padding: '0.5rem 0.75rem',
    fontSize: TEXT_STYLES.bodySmall.fontSize,
    backgroundColor: QUANTUM_COLORS.background.card,
    borderColor: QUANTUM_COLORS.border.primary,
    borderRadius: '6px',
    zIndex: 10000,
    delay: {
      show: 500,
      hide: 200
    }
  },

  // Help text styling
  helpText: {
    color: QUANTUM_COLORS.grayscale.gray400,
    fontSize: TEXT_STYLES.bodySmall.fontSize,
    lineHeight: TEXT_STYLES.bodySmall.lineHeight,
    marginTop: '0.25rem'
  },

  // Interactive help
  interactive: {
    expandable: true,
    searchable: true,
    contextual: true,
    keyboard: 'F1'
  }
} as const;

// Feedback utility functions
export const feedbackUtils = {
  // Create feedback component styles
  createFeedbackStyles(type: FeedbackType, severity: FeedbackSeverity, variant: FeedbackVariant) {
    const errorType = ERROR_STANDARDS.types[type];
    const severityStyles = ERROR_STANDARDS.severity[severity];

    const baseStyles = {
      color: severityStyles.textColor,
      backgroundColor: severityStyles.backgroundColor,
      borderColor: severityStyles.borderColor,
      border: '1px solid',
      borderRadius: '8px',
      padding: '1rem',
      fontSize: TEXT_STYLES.body.fontSize,
      fontFamily: TEXT_STYLES.body.fontFamily
    };

    if (variant === 'toast') {
      return {
        ...baseStyles,
        ...TOAST_STANDARDS.styling,
        position: 'fixed',
        zIndex: TOAST_STANDARDS.styling.zIndex
      };
    }

    if (variant === 'banner') {
      return {
        ...baseStyles,
        width: '100%',
        borderRadius: '0',
        borderLeft: 'none',
        borderRight: 'none'
      };
    }

    if (variant === 'modal') {
      return {
        ...baseStyles,
        maxWidth: '500px',
        margin: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)'
      };
    }

    return baseStyles;
  },

  // Generate error message
  generateErrorMessage(type: string, context?: any) {
    const messages = ERROR_STANDARDS.messages;

    // Try to find specific message
    for (const category of Object.keys(messages)) {
      const categoryMessages = messages[category as keyof typeof messages];
      if (categoryMessages[type as keyof typeof categoryMessages]) {
        return categoryMessages[type as keyof typeof categoryMessages];
      }
    }

    // Fallback to generic message
    return context?.message || 'An unexpected error occurred. Please try again.';
  },

  // Validate form field
  validateField(value: any, rules: any[]) {
    const errors: string[] = [];

    for (const rule of rules) {
      if (typeof rule === 'function') {
        const result = rule(value);
        if (typeof result === 'string') {
          errors.push(result);
        }
      } else if (rule.validator) {
        const result = rule.validator(value);
        if (typeof result === 'string') {
          errors.push(result);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      firstError: errors[0] || null
    };
  },

  // Create toast manager
  createToastManager() {
    const toasts = new Map<string, any>();
    let toastCounter = 0;

    return {
      // Add toast
      add(type: FeedbackType, message: string, options: any = {}) {
        const id = `toast-${++toastCounter}`;
        const toast = {
          id,
          type,
          message,
          severity: options.severity || 'medium',
          duration: options.duration || ERROR_STANDARDS.types[type]?.duration || 5000,
          dismissible: options.dismissible ?? ERROR_STANDARDS.types[type]?.dismissible ?? true,
          position: options.position || 'top-right',
          timestamp: Date.now()
        };

        toasts.set(id, toast);

        // Auto-remove if duration is set
        if (toast.duration > 0) {
          setTimeout(() => {
            this.remove(id);
          }, toast.duration);
        }

        // Emit toast event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('toastAdded', { detail: toast }));
        }

        return id;
      },

      // Remove toast
      remove(id: string) {
        if (toasts.has(id)) {
          const toast = toasts.get(id);
          toasts.delete(id);

          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('toastRemoved', { detail: toast }));
          }
        }
      },

      // Clear all toasts
      clear() {
        toasts.clear();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('toastsCleared'));
        }
      },

      // Get all toasts
      getAll() {
        return Array.from(toasts.values());
      },

      // Get toasts by position
      getByPosition(position: FeedbackPosition) {
        return Array.from(toasts.values()).filter(toast => toast.position === position);
      }
    };
  },

  // Create confirmation dialog
  createConfirmationDialog(type: keyof typeof SUCCESS_STANDARDS.confirmations, customOptions?: any) {
    const config = SUCCESS_STANDARDS.confirmations[type];

    return {
      ...config,
      ...customOptions,
      show: () => {
        return new Promise((resolve) => {
          // Implementation would show modal and resolve with boolean
          // This is a placeholder for the actual modal implementation
          resolve(true);
        });
      }
    };
  }
};

// Feedback component factory
export const createFeedbackComponent = (type: FeedbackType, options: any = {}) => {
  const standards = ERROR_STANDARDS.types[type];

  return {
    type,
    standards,
    options,

    // Get component styles
    getStyles(severity: FeedbackSeverity = 'medium', variant: FeedbackVariant = 'inline') {
      return feedbackUtils.createFeedbackStyles(type, severity, variant);
    },

    // Get animation config
    getAnimationConfig(variant: FeedbackVariant = 'inline') {
      if (variant === 'toast') {
        return type === 'quantum'
          ? TOAST_STANDARDS.animations.quantum
          : TOAST_STANDARDS.animations.enter;
      }

      return {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: {
          duration: QUANTUM_TIMING.transition / 1000,
          ease: QUANTUM_EASING.cosmicFlow
        }
      };
    },

    // Handle user interactions
    handleDismiss() {
      if (standards.dismissible) {
        // Trigger dismiss animation and remove
      }
    },

    handleRetry() {
      if (standards.retryable) {
        // Trigger retry action
      }
    }
  };
};

// Global feedback manager
export const globalFeedbackManager = {
  toastManager: feedbackUtils.createToastManager(),

  // Quick methods for common feedback types
  success(message: string, options?: any) {
    return this.toastManager.add('success', message, options);
  },

  error(message: string, options?: any) {
    return this.toastManager.add('error', message, options);
  },

  warning(message: string, options?: any) {
    return this.toastManager.add('warning', message, options);
  },

  info(message: string, options?: any) {
    return this.toastManager.add('info', message, options);
  },

  quantum(message: string, options?: any) {
    return this.toastManager.add('quantum', message, { ...options, animated: true });
  }
};

// Export types
export type ErrorStandards = typeof ERROR_STANDARDS;
export type ToastStandards = typeof TOAST_STANDARDS;
export type ValidationStandards = typeof VALIDATION_STANDARDS;
