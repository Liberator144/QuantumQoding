/**
 * TypeScript Migration
 * Migrated from: UITransition.js
 * @version 2.0.0
 */
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVariantsByPreset } from '../../utils/animation/variants';
/**
 * Enhanced component for smooth UI element transitions during system changes
 * Provides various animation presets with configurable parameters
 * Supports physics-based animations and sophisticated motion effects
 */
export const UITransition = ({ show, preset = 'fade', direction = 'right', duration = 0.5, delay = 0, staggerIndex = 0, staggerAmount = 0.05, customVariants, className = '', style = {}, physics = {}, onAnimationStart, onAnimationComplete, children }) => {
    // Calculate total delay including stagger effect
    const totalDelay = delay + (staggerIndex * staggerAmount);
    // Track animation state
    const [isAnimating, setIsAnimating] = useState(false);
    // Handle animation events
    useEffect(() => {
        if (show && !isAnimating && onAnimationStart) {
            onAnimationStart();
            setIsAnimating(true);
        }
    }, [show, isAnimating, onAnimationStart]);
    // Get physics parameters with defaults
    const { mass = 1, stiffness = 300, damping = 24, velocity = 0 } = physics;
    // Preset variants with physics-based animations
    const variants = {
        // Simple fade transition
        fade: {
            hidden: {
                opacity: 0
            },
            visible: {
                opacity: 1,
                transition: {
                    duration,
                    delay: totalDelay
                }
            },
            exit: {
                opacity: 0,
                transition: {
                    duration: duration * 0.75
                }
            }
        },
        // Slide transition with direction
        slide: {
            hidden: {
                opacity: 0,
                x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
                y: direction === 'up' ? -50 : direction === 'down' ? 50 : 0,
            },
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness,
                    damping,
                    mass
                }
            },
            exit: {
                opacity: 0,
                x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
                y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Zoom transition
        zoom: {
            hidden: {
                opacity: 0,
                scale: 0.8
            },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 350,
                    damping: 25,
                    mass
                }
            },
            exit: {
                opacity: 0,
                scale: 0.9,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // 3D flip transition
        flip: {
            hidden: {
                opacity: 0,
                rotateX: direction === 'up' || direction === 'down' ? 90 : 0,
                rotateY: direction === 'left' || direction === 'right' ? 90 : 0,
                scale: 0.9,
                z: -10
            },
            visible: {
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                z: 0,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                    mass
                }
            },
            exit: {
                opacity: 0,
                rotateX: direction === 'up' || direction === 'down' ? -90 : 0,
                rotateY: direction === 'left' || direction === 'right' ? -90 : 0,
                scale: 0.9,
                z: -10,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Bouncy entrance
        bounce: {
            hidden: {
                opacity: 0,
                y: direction === 'up' ? -100 : direction === 'down' ? 100 : 0,
                x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
                scale: 0.8
            },
            visible: {
                opacity: 1,
                y: 0,
                x: 0,
                scale: 1,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 400,
                    damping: 15,
                    mass: 1.2,
                    velocity
                }
            },
            exit: {
                opacity: 0,
                y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
                x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Expanding from center
        expand: {
            hidden: {
                opacity: 0,
                scale: 0.2
            },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 250,
                    damping: 20,
                    mass
                }
            },
            exit: {
                opacity: 0,
                scale: 0.2,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Collapsing to center
        collapse: {
            hidden: {
                opacity: 0,
                scale: 1.5
            },
            visible: {
                opacity: 1,
                scale: 1,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 300,
                    damping: 22,
                    mass
                }
            },
            exit: {
                opacity: 0,
                scale: 1.5,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Pivot animation (rotating in from an edge)
        pivot: {
            hidden: {
                opacity: 0,
                scale: 0.9,
                originX: direction === 'left' ? 0 : direction === 'right' ? 1 : 0.5,
                originY: direction === 'up' ? 0 : direction === 'down' ? 1 : 0.5,
                rotate: direction === 'left' ? -90 :
                    direction === 'right' ? 90 :
                        direction === 'up' ? 90 :
                            direction === 'down' ? -90 : 0
            },
            visible: {
                opacity: 1,
                scale: 1,
                rotate: 0,
                transition: {
                    duration,
                    delay: totalDelay,
                    type: 'spring',
                    stiffness: 200,
                    damping: 25,
                    mass
                }
            },
            exit: {
                opacity: 0,
                scale: 0.9,
                rotate: direction === 'left' ? 90 :
                    direction === 'right' ? -90 :
                        direction === 'up' ? -90 :
                            direction === 'down' ? 90 : 0,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeInOut'
                }
            }
        },
        // Blur-based transition
        blur: {
            hidden: {
                opacity: 0,
                filter: "blur(20px)",
                scale: direction === 'center' ? 1.1 : 1
            },
            visible: {
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                transition: {
                    duration,
                    delay: totalDelay,
                    ease: 'easeOut'
                }
            },
            exit: {
                opacity: 0,
                filter: "blur(20px)",
                scale: direction === 'center' ? 0.9 : 1,
                transition: {
                    duration: duration * 0.75,
                    ease: 'easeIn'
                }
            }
        },
        // Glide entrance with physics
        glide: {
            hidden: {
                opacity: 0,
                x: direction === 'left' ? -100 :
                    direction === 'right' ? 100 : 0,
                y: direction === 'up' ? -100 :
                    direction === 'down' ? 100 : 0,
            },
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    type: 'spring',
                    duration,
                    delay: totalDelay,
                    stiffness: 100,
                    damping: 30,
                    mass: 1.8,
                    velocity
                }
            },
            exit: {
                opacity: 0,
                x: direction === 'left' ? 100 :
                    direction === 'right' ? -100 : 0,
                y: direction === 'up' ? 100 :
                    direction === 'down' ? -100 : 0,
                transition: {
                    type: 'spring',
                    duration: duration * 0.75,
                    stiffness: 500,
                    damping: 50
                }
            }
        },
        // Quantum effect with complex motion
        quantum: {
            hidden: {
                opacity: 0,
                scale: 0.8,
                filter: "blur(10px)",
                x: direction === 'left' ? -30 :
                    direction === 'right' ? 30 : 0,
                y: direction === 'up' ? -30 :
                    direction === 'down' ? 30 : 0,
                rotateX: 15,
                rotateY: -15
            },
            visible: {
                opacity: [0, 0.4, 0.8, 1],
                scale: [0.8, 1.05, 0.97, 1],
                filter: ["blur(10px)", "blur(6px)", "blur(3px)", "blur(0px)"],
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                transition: {
                    duration: duration * 1.5,
                    delay: totalDelay,
                    times: [0, 0.3, 0.7, 1],
                    ease: [0.25, 0.1, 0.25, 1]
                }
            },
            exit: {
                opacity: [1, 0.6, 0.3, 0],
                scale: [1, 0.95, 0.85, 0.8],
                filter: ["blur(0px)", "blur(4px)", "blur(8px)", "blur(12px)"],
                x: direction === 'left' ? 30 :
                    direction === 'right' ? -30 : 0,
                y: direction === 'up' ? 30 :
                    direction === 'down' ? -30 : 0,
                rotateX: -15,
                rotateY: 15,
                transition: {
                    duration: duration,
                    times: [0, 0.3, 0.7, 1],
                    ease: [0.25, 0.1, 0.25, 1]
                }
            }
        }
    };
    // Select the appropriate variant or use custom
    const activeVariants = customVariants ||
        // Try to use our predefined variants first
        variants[preset] ||
        // Fall back to shared animation utilities if preset not found in local variants
        getVariantsByPreset(preset, direction, {
            duration: duration,
            delay: totalDelay
        });
    // Determine animation class based on preset
    const animationClass = `ui-transition-${preset}`;
    return (<AnimatePresence mode="wait" onExitComplete={() => {
            setIsAnimating(false);
            if (onAnimationComplete)
                onAnimationComplete();
        }}>
      {show && (<motion.div className={`ui-transition ${animationClass} ${className}`} initial="hidden" animate="visible" exit="exit" variants={activeVariants} style={{
                ...style,
                originX: 0.5,
                originY: 0.5,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d'
            }}>
          {children}
        </motion.div>)}
    </AnimatePresence>);
};
export default UITransition;
export const UITransitionGroup = ({ show, staggerAmount = 0.05, staggerDirection = 'forward', totalDuration, wrapperPreset, wrapperDirection, className = '', itemClassName = '', physics = {}, onAnimationStart, onAnimationComplete, children }) => {
    // Track animation state
    const [isAnimating, setIsAnimating] = useState(false);
    useEffect(() => {
        if (show && !isAnimating && onAnimationStart) {
            onAnimationStart();
            setIsAnimating(true);
        }
    }, [show, isAnimating, onAnimationStart]);
    // Compute stagger indices based on direction
    const getStaggerIndex = (index, count) => {
        switch (staggerDirection) {
            case 'reverse':
                return count - index - 1;
            case 'from-center':
                const centerIndex = Math.floor(count / 2);
                return Math.abs(index - centerIndex);
            case 'to-center':
                const center = Math.floor(count / 2);
                return count - Math.abs(index - center) - 1;
            case 'random':
                // Generate a random but consistent stagger order
                // We use the index to seed the randomness for consistency
                return (index * 13) % count;
            case 'forward':
            default:
                return index;
        }
    };
    // Calculate actual stagger amount if totalDuration is specified
    const actualStaggerAmount = totalDuration && children.length > 1
        ? totalDuration / (children.length - 1)
        : staggerAmount;
    // Children count for stagger calculations
    const childCount = React.Children.count(children);
    // Create wrapper with optional animation
    const groupContent = (<div className={`ui-transition-group ${className}`}>
      {React.Children.map(children, (child, index) => {
            // Only process React elements
            if (!React.isValidElement(child))
                return child;
            // Calculate stagger index based on direction
            const staggerIdx = getStaggerIndex(index, childCount);
            // Clone the element to add stagger props
            return React.cloneElement(child, {
                staggerIndex: staggerIdx,
                staggerAmount: actualStaggerAmount,
                key: `ui-transition-item-${index}`,
                show: true, // Ensure child is shown
                className: `${child.props.className || ''} ${itemClassName}`.trim(),
                physics: { ...physics },
                onAnimationComplete: index === childCount - 1 ? () => {
                    setIsAnimating(false);
                    if (onAnimationComplete)
                        onAnimationComplete();
                } : undefined
            });
        })}
    </div>);
    // If no wrapper animation is needed, just return the group with AnimatePresence
    if (!wrapperPreset) {
        return (<AnimatePresence mode="wait" onExitComplete={() => {
                setIsAnimating(false);
                if (onAnimationComplete)
                    onAnimationComplete();
            }}>
        {show && groupContent}
      </AnimatePresence>);
    }
    // Physics settings for wrapper animation
    const { mass = 1, stiffness = 300, damping = 20 } = physics;
    // Create a wrapper animation for the entire group
    return (<AnimatePresence mode="wait" onExitComplete={() => {
            setIsAnimating(false);
            if (onAnimationComplete)
                onAnimationComplete();
        }}>
      {show && (<motion.div className="ui-transition-group-wrapper" initial="hidden" animate="visible" exit="exit" variants={{
                hidden: {
                    opacity: 0,
                    y: wrapperDirection === 'up' ? 20 : wrapperDirection === 'down' ? -20 : 0,
                    x: wrapperDirection === 'left' ? 20 : wrapperDirection === 'right' ? -20 : 0,
                    scale: wrapperPreset === 'zoom' ? 0.95 : 1
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    scale: 1,
                    transition: {
                        duration: 0.5,
                        type: wrapperPreset === 'bounce' ? 'spring' : undefined,
                        stiffness: wrapperPreset === 'bounce' ? stiffness : undefined,
                        damping: wrapperPreset === 'bounce' ? damping : undefined,
                        mass: wrapperPreset === 'bounce' ? mass : undefined,
                    }
                },
                exit: {
                    opacity: 0,
                    y: wrapperDirection === 'up' ? -20 : wrapperDirection === 'down' ? 20 : 0,
                    x: wrapperDirection === 'left' ? -20 : wrapperDirection === 'right' ? 20 : 0,
                    scale: wrapperPreset === 'zoom' ? 0.95 : 1,
                    transition: {
                        duration: 0.3
                    }
                }
            }} style={{
                originX: 0.5,
                originY: 0.5,
                willChange: 'transform, opacity',
                transformStyle: 'preserve-3d'
            }}>
          {groupContent}
        </motion.div>)}
    </AnimatePresence>);
};
