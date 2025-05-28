/**
 * Quantum Navigation Standardization System
 * Consistent navigation patterns, behaviors, and interactions across all pages
 * @version 1.0.0
 */

import { QUANTUM_COLORS, TEXT_STYLES } from '../theme/quantum-theme';
import { QUANTUM_TIMING, QUANTUM_EASING } from '../animations/quantum-animations';
import { QUANTUM_BREAKPOINTS } from '../responsive/quantum-responsive';

// Navigation pattern types
export type NavigationType = 'header' | 'sidebar' | 'breadcrumb' | 'pagination' | 'tabs' | 'dropdown';
export type NavigationState = 'default' | 'active' | 'hover' | 'disabled' | 'loading';

// Standard navigation component configurations
export const NAVIGATION_STANDARDS = {
  // Header navigation standards
  header: {
    height: {
      mobile: '60px',
      tablet: '70px',
      desktop: '80px'
    },
    padding: {
      mobile: '0 1rem',
      tablet: '0 1.5rem',
      desktop: '0 2rem'
    },
    zIndex: 1000,
    background: QUANTUM_COLORS.background.primary,
    borderBottom: `1px solid ${QUANTUM_COLORS.border.primary}`,
    backdropFilter: 'blur(10px)'
  },

  // Sidebar navigation standards
  sidebar: {
    width: {
      collapsed: '60px',
      expanded: '280px'
    },
    transition: `width ${QUANTUM_TIMING.transition}ms ${QUANTUM_EASING.cosmicFlow}`,
    background: QUANTUM_COLORS.background.secondary,
    borderRight: `1px solid ${QUANTUM_COLORS.border.primary}`,
    zIndex: 900
  },

  // Breadcrumb standards
  breadcrumb: {
    fontSize: TEXT_STYLES.bodySmall.fontSize,
    color: QUANTUM_COLORS.grayscale.gray400,
    separator: '/',
    separatorColor: QUANTUM_COLORS.grayscale.gray600,
    activeColor: QUANTUM_COLORS.primary.quantum,
    hoverColor: QUANTUM_COLORS.grayscale.white
  },

  // Tab navigation standards
  tabs: {
    height: '48px',
    fontSize: TEXT_STYLES.body.fontSize,
    borderBottom: `2px solid ${QUANTUM_COLORS.border.primary}`,
    activeIndicator: {
      height: '2px',
      background: QUANTUM_COLORS.primary.quantum,
      transition: `all ${QUANTUM_TIMING.transition}ms ${QUANTUM_EASING.cosmicFlow}`
    }
  },

  // Dropdown standards
  dropdown: {
    minWidth: '200px',
    maxHeight: '300px',
    background: QUANTUM_COLORS.background.card,
    border: `1px solid ${QUANTUM_COLORS.border.primary}`,
    borderRadius: '8px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
    zIndex: 1100
  }
} as const;

// Navigation item states and styling
export const NAVIGATION_STATES = {
  default: {
    color: QUANTUM_COLORS.grayscale.gray300,
    backgroundColor: 'transparent',
    borderColor: 'transparent'
  },

  hover: {
    color: QUANTUM_COLORS.grayscale.white,
    backgroundColor: QUANTUM_COLORS.states.hover,
    borderColor: QUANTUM_COLORS.border.primary,
    transition: `all ${QUANTUM_TIMING.hover}ms ${QUANTUM_EASING.energyPulse}`
  },

  active: {
    color: QUANTUM_COLORS.primary.quantum,
    backgroundColor: QUANTUM_COLORS.states.active,
    borderColor: QUANTUM_COLORS.primary.quantum,
    boxShadow: `0 0 10px ${QUANTUM_COLORS.primary.quantum}40`
  },

  disabled: {
    color: QUANTUM_COLORS.states.disabled,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    cursor: 'not-allowed',
    opacity: 0.5
  },

  loading: {
    color: QUANTUM_COLORS.states.loading,
    backgroundColor: QUANTUM_COLORS.states.hover,
    borderColor: QUANTUM_COLORS.border.primary,
    cursor: 'wait'
  }
} as const;

// Navigation interaction patterns
export const NAVIGATION_INTERACTIONS = {
  // Click behaviors
  click: {
    feedback: {
      scale: [1, 0.98, 1],
      transition: {
        duration: QUANTUM_TIMING.click / 1000,
        ease: QUANTUM_EASING.quantumLeap
      }
    },
    ripple: {
      enabled: true,
      color: QUANTUM_COLORS.primary.quantum,
      duration: QUANTUM_TIMING.transition
    }
  },

  // Hover behaviors
  hover: {
    glow: {
      enabled: true,
      color: QUANTUM_COLORS.primary.quantum,
      intensity: 0.3
    },
    lift: {
      enabled: true,
      distance: '2px',
      shadow: `0 4px 12px ${QUANTUM_COLORS.primary.quantum}20`
    }
  },

  // Focus behaviors
  focus: {
    ring: {
      enabled: true,
      color: QUANTUM_COLORS.border.focus,
      width: '2px',
      offset: '2px'
    },
    glow: {
      enabled: true,
      color: QUANTUM_COLORS.primary.quantum,
      intensity: 0.5
    }
  }
} as const;

// Navigation accessibility standards
export const NAVIGATION_ACCESSIBILITY = {
  // ARIA attributes
  aria: {
    navigation: 'navigation',
    menubar: 'menubar',
    menu: 'menu',
    menuitem: 'menuitem',
    tablist: 'tablist',
    tab: 'tab',
    tabpanel: 'tabpanel'
  },

  // Keyboard navigation
  keyboard: {
    // Arrow key navigation
    arrowKeys: {
      enabled: true,
      wrap: true, // Wrap around at ends
      orientation: 'horizontal' as 'horizontal' | 'vertical'
    },

    // Tab navigation
    tabNavigation: {
      enabled: true,
      skipLinks: true,
      focusTrap: true // For modals/dropdowns
    },

    // Escape key behavior
    escapeKey: {
      enabled: true,
      closesDropdowns: true,
      exitsFocus: true
    },

    // Enter/Space activation
    activation: {
      enter: true,
      space: true
    }
  },

  // Screen reader support
  screenReader: {
    announcements: {
      enabled: true,
      navigationChange: 'Navigation changed to {item}',
      menuOpen: 'Menu opened',
      menuClosed: 'Menu closed',
      tabSelected: 'Tab {tab} selected'
    },

    descriptions: {
      enabled: true,
      currentPage: 'Current page',
      hasSubmenu: 'Has submenu',
      expandable: 'Expandable'
    }
  }
} as const;

// Navigation responsive behavior
export const NAVIGATION_RESPONSIVE = {
  // Mobile navigation patterns
  mobile: {
    // Hamburger menu
    hamburger: {
      enabled: true,
      icon: '☰',
      position: 'left' as 'left' | 'right',
      animation: 'slide' as 'slide' | 'fade' | 'scale'
    },

    // Mobile menu overlay
    overlay: {
      enabled: true,
      background: QUANTUM_COLORS.background.overlay,
      backdropFilter: 'blur(10px)',
      closeOnOutsideClick: true
    },

    // Touch gestures
    gestures: {
      swipeToClose: true,
      swipeThreshold: 50,
      tapToClose: true
    }
  },

  // Tablet adaptations
  tablet: {
    collapsibleSidebar: true,
    touchOptimized: true,
    minTouchTarget: '44px'
  },

  // Desktop enhancements
  desktop: {
    hoverMenus: true,
    keyboardShortcuts: true,
    contextMenus: true
  }
} as const;

// Navigation state management
export const NAVIGATION_STATE_MANAGEMENT = {
  // Active state tracking
  activeState: {
    trackCurrentPage: true,
    highlightParentItems: true,
    persistAcrossReloads: true,
    storageKey: 'quantum-navigation-state'
  },

  // Menu state management
  menuState: {
    rememberOpenMenus: true,
    autoCloseOnNavigate: true,
    maxOpenMenus: 3,
    storageKey: 'quantum-menu-state'
  },

  // User preferences
  userPreferences: {
    rememberSidebarState: true,
    rememberTheme: true,
    rememberLayout: true,
    storageKey: 'quantum-nav-preferences'
  }
} as const;

// Navigation performance optimization
export const NAVIGATION_PERFORMANCE = {
  // Lazy loading
  lazyLoading: {
    enabled: true,
    threshold: 0.1,
    rootMargin: '50px'
  },

  // Virtual scrolling for large menus
  virtualScrolling: {
    enabled: true,
    itemHeight: 40,
    overscan: 5
  },

  // Debouncing
  debouncing: {
    search: 300,
    resize: 150,
    scroll: 16
  },

  // Caching
  caching: {
    menuData: true,
    userPreferences: true,
    navigationState: true,
    ttl: 3600000 // 1 hour
  }
} as const;

// Navigation utility functions
export const navigationUtils = {
  // Generate navigation item styles based on state
  getNavigationItemStyles(state: NavigationState, type: NavigationType) {
    const baseStyles = NAVIGATION_STATES[state];
    const typeStyles = NAVIGATION_STANDARDS[type];

    return {
      ...baseStyles,
      ...typeStyles,
      transition: NAVIGATION_STATES.hover.transition
    };
  },

  // Create responsive navigation styles
  createResponsiveNavigation(type: NavigationType) {
    const standards = NAVIGATION_STANDARDS[type];

    return {
      [QUANTUM_BREAKPOINTS.xs]: NAVIGATION_RESPONSIVE.mobile,
      [QUANTUM_BREAKPOINTS.md]: NAVIGATION_RESPONSIVE.tablet,
      [QUANTUM_BREAKPOINTS.lg]: NAVIGATION_RESPONSIVE.desktop,
      ...standards
    };
  },

  // Generate accessibility attributes
  getAccessibilityAttributes(type: NavigationType, state: NavigationState) {
    const aria = NAVIGATION_ACCESSIBILITY.aria;

    const baseAttributes = {
      role: aria[type] || aria.menuitem,
      'aria-current': state === 'active' ? 'page' : undefined,
      'aria-disabled': state === 'disabled',
      tabIndex: state === 'disabled' ? -1 : 0
    };

    return baseAttributes;
  },

  // Handle keyboard navigation
  handleKeyboardNavigation(event: KeyboardEvent, items: HTMLElement[], currentIndex: number) {
    const { keyboard } = NAVIGATION_ACCESSIBILITY;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = keyboard.arrowKeys.wrap
          ? (currentIndex + 1) % items.length
          : Math.min(currentIndex + 1, items.length - 1);
        items[nextIndex]?.focus();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = keyboard.arrowKeys.wrap
          ? (currentIndex - 1 + items.length) % items.length
          : Math.max(currentIndex - 1, 0);
        items[prevIndex]?.focus();
        break;

      case 'Home':
        event.preventDefault();
        items[0]?.focus();
        break;

      case 'End':
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;

      case 'Escape':
        if (keyboard.escapeKey.enabled) {
          event.preventDefault();
          // Close dropdowns or exit focus
        }
        break;

      case 'Enter':
      case ' ':
        if (keyboard.activation.enter || keyboard.activation.space) {
          event.preventDefault();
          // Activate item
        }
        break;
    }
  },

  // Manage navigation state
  saveNavigationState(key: string, state: any) {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save navigation state:', error);
    }
  },

  loadNavigationState(key: string) {
    try {
      const state = localStorage.getItem(key);
      return state ? JSON.parse(state) : null;
    } catch (error) {
      console.warn('Failed to load navigation state:', error);
      return null;
    }
  }
};

// Navigation component factory
export const createNavigationComponent = (type: NavigationType, options: any = {}) => {
  const standards = NAVIGATION_STANDARDS[type];
  const interactions = NAVIGATION_INTERACTIONS;
  const accessibility = NAVIGATION_ACCESSIBILITY;

  return {
    type,
    standards,
    interactions,
    accessibility,
    options,

    // Get component styles
    getStyles(state: NavigationState = 'default') {
      return navigationUtils.getNavigationItemStyles(state, type);
    },

    // Get accessibility attributes
    getAccessibilityProps(state: NavigationState = 'default') {
      return navigationUtils.getAccessibilityAttributes(type, state);
    },

    // Handle interactions
    handleClick(event: MouseEvent) {
      if (interactions.click.feedback.enabled) {
        // Apply click feedback animation
      }
      if (interactions.click.ripple.enabled) {
        // Create ripple effect
      }
    },

    handleKeyDown(event: KeyboardEvent, items: HTMLElement[], currentIndex: number) {
      navigationUtils.handleKeyboardNavigation(event, items, currentIndex);
    }
  };
};

// Export types
export type NavigationStandards = typeof NAVIGATION_STANDARDS;
export type NavigationStates = typeof NAVIGATION_STATES;
export type NavigationInteractions = typeof NAVIGATION_INTERACTIONS;
