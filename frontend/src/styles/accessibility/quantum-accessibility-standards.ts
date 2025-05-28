/**
 * Quantum Accessibility Feature Implementation System
 * Comprehensive accessibility standards for keyboard navigation, screen readers, and inclusive design
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Accessibility feature types
export type AccessibilityFeature = 'keyboard' | 'screenReader' | 'highContrast' | 'reducedMotion' | 'focus' | 'zoom';
export type KeyboardNavigationType = 'tab' | 'arrow' | 'spatial' | 'roving';
export type ScreenReaderMode = 'announce' | 'describe' | 'navigate' | 'interact';

// Keyboard navigation standards
export const KEYBOARD_NAVIGATION_STANDARDS = {
  // Tab navigation
  tabNavigation: {
    enabled: true,
    skipLinks: true,
    focusVisible: true,
    tabIndex: {
      interactive: 0,
      nonInteractive: -1,
      skip: -1
    }
  },

  // Arrow key navigation
  arrowNavigation: {
    enabled: true,
    wrap: true,
    orientation: {
      horizontal: ['ArrowLeft', 'ArrowRight'],
      vertical: ['ArrowUp', 'ArrowDown'],
      both: ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']
    }
  },

  // Keyboard shortcuts
  shortcuts: {
    global: {
      'Alt+1': 'Skip to main content',
      'Alt+2': 'Skip to navigation',
      'Alt+3': 'Skip to search',
      'F1': 'Help',
      'Escape': 'Close modal/dropdown',
      '/': 'Focus search'
    },
    navigation: {
      'Home': 'First item',
      'End': 'Last item',
      'PageUp': 'Previous page',
      'PageDown': 'Next page'
    },
    quantum: {
      'Ctrl+Q': 'Quantum mode toggle',
      'Ctrl+Shift+Q': 'Quantum debug mode',
      'Alt+Q': 'Quantum help'
    }
  },

  // Focus management
  focusManagement: {
    trapInModals: true,
    restoreOnClose: true,
    skipHidden: true,
    announceChanges: true
  }
} as const;

// Screen reader support standards
export const SCREEN_READER_STANDARDS = {
  // ARIA landmarks
  landmarks: {
    banner: 'banner',
    navigation: 'navigation',
    main: 'main',
    complementary: 'complementary',
    contentinfo: 'contentinfo',
    search: 'search',
    form: 'form',
    region: 'region'
  },

  // ARIA attributes
  attributes: {
    label: 'aria-label',
    labelledBy: 'aria-labelledby',
    describedBy: 'aria-describedby',
    expanded: 'aria-expanded',
    hidden: 'aria-hidden',
    live: 'aria-live',
    atomic: 'aria-atomic',
    relevant: 'aria-relevant',
    busy: 'aria-busy',
    current: 'aria-current',
    selected: 'aria-selected',
    checked: 'aria-checked',
    disabled: 'aria-disabled',
    invalid: 'aria-invalid',
    required: 'aria-required'
  },

  // Live regions
  liveRegions: {
    polite: {
      'aria-live': 'polite',
      'aria-atomic': 'false',
      'aria-relevant': 'additions text'
    },
    assertive: {
      'aria-live': 'assertive',
      'aria-atomic': 'true',
      'aria-relevant': 'all'
    },
    off: {
      'aria-live': 'off'
    }
  },

  // Announcements
  announcements: {
    pageLoad: 'Page loaded: {title}',
    navigationChange: 'Navigated to {section}',
    modalOpen: 'Modal opened: {title}',
    modalClose: 'Modal closed',
    formSubmit: 'Form submitted successfully',
    formError: 'Form has {count} errors',
    loadingStart: 'Loading content',
    loadingComplete: 'Content loaded',
    quantumMode: 'Quantum mode {status}'
  }
} as const;

// High contrast mode standards
export const HIGH_CONTRAST_STANDARDS = {
  // High contrast colors
  colors: {
    background: '#000000',
    text: '#ffffff',
    accent: '#ffff00',
    border: '#ffffff',
    focus: '#ffff00',
    error: '#ff0000',
    success: '#00ff00',
    warning: '#ffaa00',
    info: '#00aaff'
  },

  // High contrast styling
  styling: {
    borderWidth: '2px',
    outlineWidth: '3px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    lineHeight: 1.6,
    letterSpacing: '0.05em'
  },

  // Detection and toggle
  detection: {
    mediaQuery: '(prefers-contrast: high)',
    storageKey: 'quantum-high-contrast',
    className: 'high-contrast-mode'
  }
} as const;

// Reduced motion standards
export const REDUCED_MOTION_STANDARDS = {
  // Motion preferences
  preferences: {
    mediaQuery: '(prefers-reduced-motion: reduce)',
    storageKey: 'quantum-reduced-motion',
    className: 'reduced-motion-mode'
  },

  // Reduced motion alternatives
  alternatives: {
    animations: {
      duration: 0.1,
      easing: 'ease',
      scale: 0.5
    },
    transitions: {
      duration: 0.15,
      easing: 'ease-out'
    },
    effects: {
      disableParticles: true,
      disableParallax: true,
      disableAutoplay: true,
      simplifyAnimations: true
    }
  },

  // Static fallbacks
  staticFallbacks: {
    spinners: 'Loading...',
    progressBars: 'Progress: {percentage}%',
    carousels: 'Image {current} of {total}',
    parallax: 'Background image'
  }
} as const;

// Focus management standards
export const FOCUS_MANAGEMENT_STANDARDS = {
  // Focus indicators
  indicators: {
    visible: true,
    highContrast: true,
    customStyles: {
      outline: `2px solid ${QUANTUM_COLORS.border.focus}`,
      outlineOffset: '2px',
      borderRadius: '4px'
    },
    quantumStyles: {
      boxShadow: `0 0 0 2px ${QUANTUM_COLORS.primary.quantum}, 0 0 0 4px ${QUANTUM_COLORS.primary.quantum}40`,
      outline: 'none'
    }
  },

  // Focus order
  order: {
    logical: true,
    skipHidden: true,
    skipDisabled: true,
    customOrder: []
  },

  // Focus trapping
  trapping: {
    enabled: true,
    containers: ['modal', 'dropdown', 'dialog', 'sidebar'],
    escapeKey: true,
    clickOutside: false
  },

  // Focus restoration
  restoration: {
    enabled: true,
    storePrevious: true,
    restoreOnClose: true,
    fallbackToBody: true
  }
} as const;

// Zoom and scaling standards
export const ZOOM_STANDARDS = {
  // Zoom levels
  levels: {
    minimum: 0.5,
    maximum: 3.0,
    default: 1.0,
    step: 0.1
  },

  // Responsive zoom
  responsive: {
    maintainLayout: true,
    adjustFontSize: true,
    adjustSpacing: true,
    adjustImages: true
  },

  // Zoom controls
  controls: {
    keyboard: {
      'Ctrl+=': 'Zoom in',
      'Ctrl+-': 'Zoom out',
      'Ctrl+0': 'Reset zoom'
    },
    buttons: {
      zoomIn: 'Zoom In',
      zoomOut: 'Zoom Out',
      reset: 'Reset Zoom'
    }
  }
} as const;

// Skip links configuration
export const SKIP_LINKS_STANDARDS = {
  // Skip link targets
  targets: [
    { id: 'main-content', label: 'Skip to main content' },
    { id: 'navigation', label: 'Skip to navigation' },
    { id: 'search', label: 'Skip to search' },
    { id: 'footer', label: 'Skip to footer' }
  ],

  // Skip link styling
  styling: {
    position: 'absolute',
    top: '-100px',
    left: '0',
    zIndex: 10000,
    padding: '0.5rem 1rem',
    backgroundColor: QUANTUM_COLORS.primary.quantum,
    color: QUANTUM_COLORS.grayscale.black,
    textDecoration: 'none',
    fontSize: TEXT_STYLES.body.fontSize,
    fontWeight: TEXT_STYLES.h6.fontWeight,
    borderRadius: '0 0 4px 0',
    transition: `top ${QUANTUM_TIMING.fast}ms ${QUANTUM_EASING.easeOut}`,
    '&:focus': {
      top: '0'
    }
  }
} as const;

// Accessibility utility functions
export const accessibilityUtils = {
  // Detect user preferences
  detectPreferences() {
    const preferences = {
      reducedMotion: false,
      highContrast: false,
      darkMode: false,
      largeText: false
    };

    if (typeof window !== 'undefined') {
      preferences.reducedMotion = window.matchMedia(REDUCED_MOTION_STANDARDS.preferences.mediaQuery).matches;
      preferences.highContrast = window.matchMedia(HIGH_CONTRAST_STANDARDS.detection.mediaQuery).matches;
      preferences.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      preferences.largeText = window.matchMedia('(prefers-reduced-data: reduce)').matches;
    }

    return preferences;
  },

  // Create focus trap
  createFocusTrap(container: HTMLElement) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }

      if (event.key === 'Escape') {
        // Close modal or return focus
        container.dispatchEvent(new CustomEvent('escape'));
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return {
      activate() {
        firstElement?.focus();
      },
      deactivate() {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  },

  // Announce to screen readers
  announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (typeof window === 'undefined') return;

    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';

    document.body.appendChild(announcer);
    announcer.textContent = message;

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  // Manage keyboard navigation
  createKeyboardManager() {
    const shortcuts = new Map<string, () => void>();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = [
        event.ctrlKey && 'Ctrl',
        event.altKey && 'Alt',
        event.shiftKey && 'Shift',
        event.key
      ].filter(Boolean).join('+');

      const handler = shortcuts.get(key);
      if (handler) {
        event.preventDefault();
        handler();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return {
      addShortcut(key: string, handler: () => void) {
        shortcuts.set(key, handler);
      },
      removeShortcut(key: string) {
        shortcuts.delete(key);
      },
      destroy() {
        document.removeEventListener('keydown', handleKeyDown);
        shortcuts.clear();
      }
    };
  },

  // Create accessibility manager
  createAccessibilityManager() {
    const preferences = this.detectPreferences();
    let currentMode = 'default';

    return {
      // Get current preferences
      getPreferences() {
        return { ...preferences };
      },

      // Toggle high contrast mode
      toggleHighContrast() {
        const isEnabled = document.body.classList.contains(HIGH_CONTRAST_STANDARDS.detection.className);

        if (isEnabled) {
          document.body.classList.remove(HIGH_CONTRAST_STANDARDS.detection.className);
          localStorage.removeItem(HIGH_CONTRAST_STANDARDS.detection.storageKey);
          this.announce('High contrast mode disabled');
        } else {
          document.body.classList.add(HIGH_CONTRAST_STANDARDS.detection.className);
          localStorage.setItem(HIGH_CONTRAST_STANDARDS.detection.storageKey, 'true');
          this.announce('High contrast mode enabled');
        }

        return !isEnabled;
      },

      // Toggle reduced motion
      toggleReducedMotion() {
        const isEnabled = document.body.classList.contains(REDUCED_MOTION_STANDARDS.preferences.className);

        if (isEnabled) {
          document.body.classList.remove(REDUCED_MOTION_STANDARDS.preferences.className);
          localStorage.removeItem(REDUCED_MOTION_STANDARDS.preferences.storageKey);
          this.announce('Animations enabled');
        } else {
          document.body.classList.add(REDUCED_MOTION_STANDARDS.preferences.className);
          localStorage.setItem(REDUCED_MOTION_STANDARDS.preferences.storageKey, 'true');
          this.announce('Animations reduced');
        }

        return !isEnabled;
      },

      // Initialize accessibility features
      initialize() {
        // Load saved preferences
        if (localStorage.getItem(HIGH_CONTRAST_STANDARDS.detection.storageKey)) {
          document.body.classList.add(HIGH_CONTRAST_STANDARDS.detection.className);
        }

        if (localStorage.getItem(REDUCED_MOTION_STANDARDS.preferences.storageKey)) {
          document.body.classList.add(REDUCED_MOTION_STANDARDS.preferences.className);
        }

        // Add skip links
        this.addSkipLinks();

        // Set up keyboard shortcuts
        const keyboardManager = accessibilityUtils.createKeyboardManager();
        keyboardManager.addShortcut('Alt+1', () => {
          const mainContent = document.getElementById('main-content');
          mainContent?.focus();
        });

        return keyboardManager;
      },

      // Add skip links
      addSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';

        SKIP_LINKS_STANDARDS.targets.forEach(target => {
          const link = document.createElement('a');
          link.href = `#${target.id}`;
          link.textContent = target.label;
          link.className = 'skip-link';

          // Apply skip link styles
          Object.assign(link.style, SKIP_LINKS_STANDARDS.styling);

          skipLinksContainer.appendChild(link);
        });

        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
      },

      announce: accessibilityUtils.announce
    };
  }
};

// Global accessibility manager instance
export const globalAccessibilityManager = accessibilityUtils.createAccessibilityManager();

// Export types
export type KeyboardNavigationStandards = typeof KEYBOARD_NAVIGATION_STANDARDS;
export type ScreenReaderStandards = typeof SCREEN_READER_STANDARDS;
export type HighContrastStandards = typeof HIGH_CONTRAST_STANDARDS;
