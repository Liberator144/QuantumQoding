/**
 * Animation variants for QQ-Verse transitions and effects
 * Provides reusable motion configurations for Framer Motion
 */

export interface AnimationOptions {
  duration?: number;
  ease?: string | number[];
  delay?: number | ((index: number) => number);
  stagger?: number;
}

export interface QuantumVariantOptions extends AnimationOptions {
  scale?: number[];
  rotation?: number[];
  opacity?: number[];
}

/**
 * Creates quantum-themed animation variants with energy effects
 */
export function createQuantumVariants(options: QuantumVariantOptions = {}) {
  const {
    duration = 0.8,
    ease = "easeOut",
    delay = 0,
    scale = [0.8, 1.1, 1],
    rotation = [0, 5, 0],
    opacity = [0, 0.7, 1]
  } = options;

  return {
    hidden: {
      opacity: opacity[0],
      scale: scale[0],
      rotate: rotation[0],
      filter: "blur(10px) brightness(0.5)",
      transition: {
        duration: 0.1
      }
    },
    visible: (index: number = 0) => ({
      opacity: opacity[2],
      scale: scale[2],
      rotate: rotation[2],
      filter: "blur(0px) brightness(1)",
      transition: {
        duration,
        ease,
        delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.1),
        // Keyframe animation for quantum effect
        scale: {
          times: [0, 0.6, 1],
          values: scale,
          duration
        },
        rotate: {
          times: [0, 0.5, 1],
          values: rotation,
          duration
        },
        opacity: {
          times: [0, 0.3, 1],
          values: opacity,
          duration
        }
      }
    }),
    exit: {
      opacity: 0,
      scale: 0.8,
      rotate: -5,
      filter: "blur(5px) brightness(0.3)",
      transition: {
        duration: duration * 0.6,
        ease: "easeIn"
      }
    }
  };
}

/**
 * Creates slide animation variants for directional transitions
 */
export function createSlideVariants(
  direction: 'left' | 'right' | 'up' | 'down' = 'right',
  distance: number = 50,
  options: AnimationOptions = {}
) {
  const {
    duration = 0.5,
    ease = "easeOut",
    delay = 0
  } = options;

  const getOffset = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 };
      case 'right': return { x: distance, y: 0 };
      case 'up': return { x: 0, y: -distance };
      case 'down': return { x: 0, y: distance };
      default: return { x: distance, y: 0 };
    }
  };

  const offset = getOffset();

  return {
    hidden: {
      opacity: 0,
      x: offset.x,
      y: offset.y,
      transition: {
        duration: 0.1
      }
    },
    visible: (index: number = 0) => ({
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        ease,
        delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.05)
      }
    }),
    exit: {
      opacity: 0,
      x: -offset.x, // Exit in opposite direction
      y: -offset.y,
      transition: {
        duration: duration * 0.7,
        ease: "easeIn"
      }
    }
  };
}

/**
 * Creates fade animation variants with optional blur effect
 */
export function createFadeVariants(options: AnimationOptions & { blur?: boolean } = {}) {
  const {
    duration = 0.6,
    ease = "easeInOut",
    delay = 0,
    blur = false
  } = options;

  return {
    hidden: {
      opacity: 0,
      filter: blur ? "blur(10px)" : "blur(0px)",
      transition: {
        duration: 0.1
      }
    },
    visible: (index: number = 0) => ({
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration,
        ease,
        delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.1)
      }
    }),
    exit: {
      opacity: 0,
      filter: blur ? "blur(5px)" : "blur(0px)",
      transition: {
        duration: duration * 0.8,
        ease: "easeIn"
      }
    }
  };
}

/**
 * Creates scale animation variants for zoom effects
 */
export function createScaleVariants(options: AnimationOptions & { 
  scaleFrom?: number;
  scaleTo?: number;
  overshoot?: boolean;
} = {}) {
  const {
    duration = 0.7,
    ease = "easeOut",
    delay = 0,
    scaleFrom = 0.8,
    scaleTo = 1,
    overshoot = true
  } = options;

  const scaleSequence = overshoot 
    ? [scaleFrom, scaleTo * 1.05, scaleTo]
    : [scaleFrom, scaleTo];

  return {
    hidden: {
      opacity: 0,
      scale: scaleFrom,
      transition: {
        duration: 0.1
      }
    },
    visible: (index: number = 0) => ({
      opacity: 1,
      scale: scaleTo,
      transition: {
        duration,
        ease,
        delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.08),
        scale: overshoot ? {
          times: [0, 0.8, 1],
          values: scaleSequence,
          duration
        } : undefined
      }
    }),
    exit: {
      opacity: 0,
      scale: scaleFrom,
      transition: {
        duration: duration * 0.6,
        ease: "easeIn"
      }
    }
  };
}

/**
 * Creates rotation animation variants for spinning effects
 */
export function createRotationVariants(options: AnimationOptions & {
  rotateFrom?: number;
  rotateTo?: number;
  continuous?: boolean;
} = {}) {
  const {
    duration = 1,
    ease = "linear",
    delay = 0,
    rotateFrom = 0,
    rotateTo = 360,
    continuous = false
  } = options;

  return {
    hidden: {
      opacity: 0,
      rotate: rotateFrom,
      transition: {
        duration: 0.1
      }
    },
    visible: (index: number = 0) => ({
      opacity: 1,
      rotate: continuous ? [rotateFrom, rotateTo] : rotateTo,
      transition: {
        duration,
        ease,
        delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.1),
        rotate: continuous ? {
          repeat: Infinity,
          duration,
          ease
        } : undefined
      }
    }),
    exit: {
      opacity: 0,
      rotate: rotateFrom,
      transition: {
        duration: duration * 0.5,
        ease: "easeIn"
      }
    }
  };
}

/**
 * Creates stagger container variants for animating children
 */
export function createStaggerContainer(options: {
  staggerChildren?: number;
  delayChildren?: number;
} = {}) {
  const {
    staggerChildren = 0.1,
    delayChildren = 0
  } = options;

  return {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: staggerChildren * 0.5,
        staggerDirection: -1
      }
    }
  };
}

/**
 * Creates path drawing animation for SVG elements
 */
export function createPathVariants(options: AnimationOptions = {}) {
  const {
    duration = 2,
    ease = "easeInOut",
    delay = 0
  } = options;

  return {
    hidden: {
      pathLength: 0,
      opacity: 0
    },
    visible: (index: number = 0) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration,
          ease,
          delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.2)
        },
        opacity: {
          duration: 0.3,
          delay: typeof delay === 'function' ? delay(index) : delay + (index * 0.2)
        }
      }
    }),
    exit: {
      pathLength: 0,
      opacity: 0,
      transition: {
        duration: duration * 0.5,
        ease: "easeIn"
      }
    }
  };
}
