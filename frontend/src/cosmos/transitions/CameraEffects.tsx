/**
 * TypeScript Migration
 * Migrated from: CameraEffects.js
 * @version 2.0.0
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
/**
 * Enhanced camera effects component for transitions between views
 * Applies advanced 3D camera movements, perspective, blur, vignette, and rotation effects
 * Supports keyframe animations, multi-layered effects, and complex 3D transformations
 * Provides coordination with UI elements through milestone events
 */
const CameraEffects = ({ isTransitioning, transitionState, mode = 'zoom', zoomFactor = 1.2, rotationDegrees = { x: 5, y: -3, z: 2 }, blurAmount = 4, vignetteAmount = 30, perspective = 1000, translate3d = { x: 25, y: -15, z: 50 }, useAcceleration = true, transitionDuration = 1.5, useReverseRotation = true, easeType = "easeInOut", layers = [], intensity = 1.0, shouldShake = false, backfaceVisible = false, zIndexDuringTransition, onTransitionProgress, onTransitionComplete, onTransitionMilestone, children }) => {
    // For visual effects
    const [blurStyle, setBlurStyle] = useState('');
    const [vignetteStyle, setVignetteStyle] = useState('');
    // Keep track of animation progress
    const [progress, setProgress] = useState(0);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);
    const lastMilestoneRef = useRef(null);
    // Animation controls for complex animations
    const controls = useAnimation();
    // Function to check and trigger transition milestones
    const checkMilestones = useCallback((currentProgress) => {
        if (!onTransitionMilestone)
            return;
        const milestones = [
            ['quarter', 0.25],
            ['third', 0.33],
            ['half', 0.5],
            ['two-thirds', 0.66],
            ['three-quarters', 0.75],
            ['almost-complete', 0.9],
            ['complete', 1.0]
        ];
        for (const [milestone, threshold] of milestones) {
            if (currentProgress >= threshold &&
                (!lastMilestoneRef.current ||
                    milestones.findIndex(m => m[0] === lastMilestoneRef.current) <
                        milestones.findIndex(m => m[0] === milestone))) {
                onTransitionMilestone(milestone, currentProgress);
                lastMilestoneRef.current = milestone;
                break;
            }
        }
    }, [onTransitionMilestone]);
    // Normalize rotation degrees if it's a single number
    const rotationX = typeof rotationDegrees === 'number' ? rotationDegrees * 0.3 : rotationDegrees.x || 0;
    const rotationY = typeof rotationDegrees === 'number'
        ? (useReverseRotation ? -rotationDegrees * 0.5 : rotationDegrees * 0.5)
        : (useReverseRotation ? -(rotationDegrees.y || 0) : (rotationDegrees.y || 0));
    const rotationZ = typeof rotationDegrees === 'number' ? rotationDegrees : (rotationDegrees.z || 0);
    // Calculate translate values, applying intensity modifier
    const translateX = (translate3d.x || 0) * intensity;
    const translateY = (translate3d.y || 0) * intensity;
    const translateZ = (translate3d.z || 0) * intensity;
    // Apply scaled zoom based on intensity
    const scaledZoom = 1 + ((zoomFactor - 1) * intensity);
    // Dynamic vignette intensity based on progress
    const getVignetteIntensity = (baseAmount, p) => {
        // Increase vignette during middle of transition for dramatic effect
        const dynamicMultiplier = transitionState === 'entering'
            ? 1 + Math.sin(p * Math.PI) * 0.5 // Peak at p=0.5
            : 1 + Math.sin((1 - p) * Math.PI) * 0.5; // Peak at the beginning for exiting
        return baseAmount * dynamicMultiplier * intensity;
    };
    // Animation loop for smooth progress updates
    useEffect(() => {
        if (isTransitioning) {
            // Reset last milestone at the start of a transition
            lastMilestoneRef.current = null;
            // Trigger start milestone
            if (onTransitionMilestone) {
                onTransitionMilestone('start', 0);
            }
            const animate = (timestamp) => {
                if (!startTimeRef.current)
                    startTimeRef.current = timestamp;
                const elapsed = timestamp - startTimeRef.current;
                const newProgress = Math.min(elapsed / (transitionDuration * 1000), 1);
                setProgress(newProgress);
                // Notify of progress updates
                if (onTransitionProgress) {
                    onTransitionProgress(newProgress);
                }
                // Check and trigger milestones
                checkMilestones(newProgress);
                // Update vignette intensity dynamically
                const currentVignetteAmount = getVignetteIntensity(vignetteAmount, newProgress);
                document.documentElement.style.setProperty('--vignette-amount', `${currentVignetteAmount}%`);
                if (newProgress < 1) {
                    animationRef.current = requestAnimationFrame(animate);
                }
                else if (onTransitionComplete) {
                    onTransitionComplete();
                }
            };
            // Start animation loop
            animationRef.current = requestAnimationFrame(animate);
            // Apply visual effects
            document.documentElement.style.setProperty('--transition-blur', `${blurAmount * intensity}px`);
            document.documentElement.style.setProperty('--vignette-amount', `${vignetteAmount * intensity}%`);
            // Add new CSS variables for 3D effects
            document.documentElement.style.setProperty('--camera-perspective', `${perspective}px`);
            document.documentElement.style.setProperty('--camera-z-index', zIndexDuringTransition ? `${zIndexDuringTransition}` : 'auto');
            setBlurStyle('transition-blur');
            setVignetteStyle('vignette-effect');
            // Start camera animations
            startCameraAnimation();
            return () => {
                if (animationRef.current) {
                    cancelAnimationFrame(animationRef.current);
                }
                // Reset effects
                document.documentElement.style.setProperty('--transition-blur', '0px');
                document.documentElement.style.setProperty('--vignette-amount', '0%');
                document.documentElement.style.setProperty('--camera-perspective', 'none');
                document.documentElement.style.setProperty('--camera-z-index', 'auto');
                setBlurStyle('');
                setVignetteStyle('');
                startTimeRef.current = null;
            };
        }
        else {
            // Reset when not transitioning
            setProgress(0);
            setBlurStyle('');
            setVignetteStyle('');
            document.documentElement.style.setProperty('--transition-blur', '0px');
            document.documentElement.style.setProperty('--vignette-amount', '0%');
            document.documentElement.style.setProperty('--camera-perspective', 'none');
            document.documentElement.style.setProperty('--camera-z-index', 'auto');
        }
    }, [
        isTransitioning,
        blurAmount,
        vignetteAmount,
        transitionDuration,
        onTransitionProgress,
        onTransitionComplete,
        onTransitionMilestone,
        intensity,
        perspective,
        zIndexDuringTransition,
        checkMilestones,
        transitionState
    ]);
    // Start camera animations based on mode
    const startCameraAnimation = () => {
        // Start the animation with the appropriate variant
        controls.start(transitionState === 'entering' ? 'entering' : 'exiting');
    };
    // Get predefined camera animation variants based on selected mode
    const getCameraVariants = () => {
        const baseTransition = {
            duration: transitionDuration,
            ease: easeType,
        };
        // Define variants based on camera mode
        const variants = {
            initial: {
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                x: 0,
                y: 0,
                z: 0,
            },
            entering: {},
            exiting: {},
        };
        // Apply different animations based on mode
        switch (mode) {
            case 'zoom':
                variants.entering = {
                    scale: scaledZoom,
                    rotateX: rotationX,
                    rotateY: rotationY,
                    rotateZ: rotationZ,
                    x: translateX,
                    y: translateY,
                    z: translateZ,
                    transition: baseTransition,
                };
                variants.exiting = {
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    x: 0,
                    y: 0,
                    z: 0,
                    transition: baseTransition,
                };
                break;
            case 'pan':
                variants.entering = {
                    x: translateX * 3,
                    y: translateY,
                    scale: scaledZoom * 0.9,
                    transition: baseTransition,
                };
                variants.exiting = {
                    x: 0,
                    y: 0,
                    scale: 1,
                    transition: baseTransition,
                };
                break;
            case 'rotate':
                variants.entering = {
                    rotateX: rotationX * 2,
                    rotateY: rotationY * 2,
                    rotateZ: rotationZ * 2,
                    scale: scaledZoom * 0.9,
                    transition: baseTransition,
                };
                variants.exiting = {
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                    transition: baseTransition,
                };
                break;
            case 'swirl':
                variants.entering = {
                    rotateZ: rotationZ * 4,
                    scale: scaledZoom,
                    x: translateX,
                    y: translateY,
                    transition: {
                        ...baseTransition,
                        rotateZ: {
                            duration: transitionDuration,
                            ease: [0.4, 0, 0.2, 1], // Custom easing for swirl
                        }
                    },
                };
                variants.exiting = {
                    rotateZ: 0,
                    scale: 1,
                    x: 0,
                    y: 0,
                    transition: baseTransition,
                };
                break;
            case 'dive':
                variants.entering = {
                    z: translateZ * 2,
                    y: translateY * 2,
                    rotateX: rotationX * 2,
                    scale: scaledZoom * 1.2,
                    transition: baseTransition,
                };
                variants.exiting = {
                    z: 0,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    transition: baseTransition,
                };
                break;
            case 'rise':
                variants.entering = {
                    z: translateZ,
                    y: translateY * -3,
                    rotateX: rotationX * -2,
                    scale: scaledZoom,
                    transition: baseTransition,
                };
                variants.exiting = {
                    z: 0,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    transition: baseTransition,
                };
                break;
            case 'tilt':
                variants.entering = {
                    rotateX: rotationX * 3,
                    rotateY: rotationY * 2,
                    z: translateZ * 0.5,
                    scale: scaledZoom * 0.9,
                    transition: {
                        ...baseTransition,
                        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
                    },
                };
                variants.exiting = {
                    rotateX: 0,
                    rotateY: 0,
                    z: 0,
                    scale: 1,
                    transition: baseTransition,
                };
                break;
            case 'quantum':
                // New quantum mode with more complex 3D effects
                variants.entering = {
                    rotateX: [0, rotationX * 2, rotationX],
                    rotateY: [0, rotationY * -3, rotationY],
                    rotateZ: [0, rotationZ * 4, rotationZ * 2],
                    scale: [1, scaledZoom * 1.2, scaledZoom],
                    x: [0, translateX * 2, translateX],
                    y: [0, translateY * -2, translateY],
                    z: [0, translateZ * 3, translateZ],
                    transition: {
                        ...baseTransition,
                        times: [0, 0.6, 1],
                        ease: [0.25, 0.1, 0.25, 1] // Custom easing for quantum effect
                    }
                };
                variants.exiting = {
                    rotateX: [rotationX, rotationX * -1, 0],
                    rotateY: [rotationY, rotationY * 2, 0],
                    rotateZ: [rotationZ * 2, rotationZ * -2, 0],
                    scale: [scaledZoom, scaledZoom * 0.9, 1],
                    x: [translateX, translateX * -1, 0],
                    y: [translateY, translateY * -1, 0],
                    z: [translateZ, translateZ * 2, 0],
                    transition: {
                        ...baseTransition,
                        times: [0, 0.4, 1],
                        ease: [0.25, 0.1, 0.25, 1]
                    }
                };
                break;
            case 'custom':
                // Use custom keyframe values from layers if provided
                // This is just a fallback for when no layers are provided
                variants.entering = {
                    scale: scaledZoom,
                    rotateX: rotationX,
                    rotateY: rotationY,
                    rotateZ: rotationZ,
                    x: translateX,
                    y: translateY,
                    z: translateZ,
                    transition: baseTransition,
                };
                variants.exiting = {
                    scale: 1,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    x: 0,
                    y: 0,
                    z: 0,
                    transition: baseTransition,
                };
                break;
        }
        return variants;
    };
    // Calculate keyframe-based animation values for smoother motion
    const getKeyframedValue = (start, end, progress) => {
        if (useAcceleration) {
            // Apply custom easing for more natural motion
            const p1 = progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            return start + (end - start) * p1;
        }
        return start + (end - start) * progress;
    };
    // Configure 3D perspective and transforms
    const perspectiveStyle = isTransitioning
        ? {
            perspective: `${perspective}px`,
            zIndex: zIndexDuringTransition !== undefined ? zIndexDuringTransition : 'auto'
        }
        : {};
    // Create more dynamic animations with keyframes
    const scale = isTransitioning
        ? transitionState === 'entering'
            ? getKeyframedValue(1, scaledZoom, progress)
            : getKeyframedValue(scaledZoom, 1, progress)
        : 1;
    // Apply shake class if needed
    const shakeClass = shouldShake && isTransitioning ? 'camera-shake' : '';
    // Control backface visibility
    const backfaceClass = backfaceVisible ? '' : 'backface-hidden';
    return (<div className={`w-full h-full transition-transform ${vignetteStyle} preserve-3d perspective-${perspective}`} style={perspectiveStyle}>
      <motion.div className={`w-full h-full transform-gpu ${blurStyle} ${shakeClass} ${backfaceClass} preserve-3d`} animate={controls} initial="initial" variants={getCameraVariants()}>
        {children}
      </motion.div>
    </div>);
};
export default CameraEffects;
