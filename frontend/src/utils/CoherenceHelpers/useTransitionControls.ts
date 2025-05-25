import { useEffect, useState, useRef } from 'react';
import { createAudio, playWithFallback, stopWithFadeOut } from '../audio/audioUtils';
import { createQuantumVariants, createSlideVariants } from '../animation/variants';

type TransitionState = 'none' | 'entering' | 'exiting';

interface TransitionControlsOptions {
  transitionDuration?: number;
  audioEnabled?: boolean;
  audioVolume?: number;
  cameraEnabled?: boolean;
  cameraZoomFactor?: number;
  cameraRotationFactor?: number;
  cameraMovementEnabled?: boolean;
  staggerDelay?: number;
  onTransitionStart?: (state: TransitionState) => void;
  onTransitionComplete?: (state: TransitionState) => void;
}

interface CameraPosition {
  x: number | number[];
  y: number | number[];
  z: number | number[];
}

interface CameraTransition {
  duration: number;
  ease: string;
  times: number[];
}

interface CameraSettings {
  scale: number | number[];
  rotation: number | number[];
  position: CameraPosition;
  transition: CameraTransition;
  progress: number;
}

interface UIAnimationSettings {
  staggerDelay: number;
  elementsVisible: boolean;
  progress: number;
  enterVariants: {
    hidden: any;
    visible: (index: number) => any;
    exit: any;
  };
  slideVariants: {
    hidden: (direction?: 'left' | 'right' | 'up' | 'down') => any;
    visible: (index: number) => any;
    exit: (direction?: 'left' | 'right' | 'up' | 'down') => any;
  };
}

interface TransitionControlsReturn {
  transitionState: TransitionState;
  enterStarSystem: () => void;
  exitToHub: () => void;
  cameraSettings: CameraSettings;
  uiAnimationSettings: UIAnimationSettings;
  transitionProgress: number;
  isTransitioning: boolean;
}
/**
 * Enhanced hook to manage transition effects including audio, camera, and timing
 * with improved animation capabilities
 */
export function useTransitionControls({
  transitionDuration = 1500,
  audioEnabled = true,
  audioVolume = 0.7,
  cameraEnabled = true,
  cameraZoomFactor = 1.2,
  cameraRotationFactor = 5,
  cameraMovementEnabled = true,
  staggerDelay = 50,
  onTransitionStart,
  onTransitionComplete,
}: TransitionControlsOptions = {}): TransitionControlsReturn {
  const [transitionState, setTransitionState] = useState<TransitionState>('none');
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [ambientAudio, setAmbientAudio] = useState<HTMLAudioElement | null>(null);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Create and configure audio elements
  useEffect(() => {
    if (audioEnabled) {
      const enterAudio = createAudio('/audio/wormhole-enter.mp3', {
        volume: audioVolume,
        preload: 'auto'
      });

      const exitAudio = createAudio('/audio/wormhole-exit.mp3', {
        volume: audioVolume,
        preload: 'auto'
      });

      const ambient = createAudio('/audio/space-ambience.mp3', {
        volume: audioVolume * 0.4,
        loop: true,
        preload: 'auto'
      });

      // Store for later use
      setAudioElement(enterAudio); // Default to enter
      setAmbientAudio(ambient);

      // Start ambient audio
      playWithFallback(ambient);

      // Cleanup function
      return () => {
        ambient.pause();
        enterAudio.pause();
        exitAudio.pause();
      };
    }
  }, [audioEnabled, audioVolume]);
  // Animation loop for smooth progress updates
  useEffect(() => {
    if (transitionState !== 'none') {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / transitionDuration, 1);

        setTransitionProgress(progress);

        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        }
      };

      // Start animation loop
      animationFrameRef.current = requestAnimationFrame(animate);

      // Cleanup
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // Reset progress and start time when not transitioning
      setTransitionProgress(0);
      startTimeRef.current = null;
    }
  }, [transitionState, transitionDuration]);

  // Function to start transition to a new view
  const startTransition = (newState: 'entering' | 'exiting') => {
    // Already in transition
    if (transitionState !== 'none') return;

    // Start transition
    setTransitionState(newState);

    // Call start callback
    if (onTransitionStart) {
      onTransitionStart(newState);
    }

    // Play appropriate audio
    if (audioEnabled && audioElement) {
      // Update audio source based on transition type
      audioElement.src = `/audio/wormhole-${newState}.mp3`;
      audioElement.currentTime = 0;

      // Play transition audio
      playWithFallback(audioElement);

      // Play quantum surge/collapse sound after a slight delay
      setTimeout(() => {
        const surgeAudio = createAudio(
          `/audio/${newState === 'entering' ? 'quantum-surge.mp3' : 'quantum-collapse.mp3'}`,
          { volume: audioVolume * 0.6 }
        );
        playWithFallback(surgeAudio);
      }, 300);
    }

    // Schedule end of transition
    setTimeout(() => {
      if (onTransitionComplete) {
        onTransitionComplete(newState);
      }

      // Add a small delay before resetting state to allow for UI animations
      setTimeout(() => {
        setTransitionState('none');
      }, 200);

    }, transitionDuration);
  };

  // Functions to trigger specific transitions
  const enterStarSystem = () => startTransition('entering');
  const exitToHub = () => startTransition('exiting');

  // Enhanced camera settings with more parameters
  const cameraSettings: CameraSettings = {
    // Zoom effect
    scale: cameraEnabled
      ? transitionState === 'entering'
          ? [1, 1.1, 1.15, cameraZoomFactor] // Multi-keyframe zoom effect
          : transitionState === 'exiting'
              ? [cameraZoomFactor, 1.15, 1.1, 1]
              : 1
      : 1,

    // Rotation effect
    rotation: cameraEnabled && cameraRotationFactor > 0
      ? transitionState === 'entering'
          ? [0, cameraRotationFactor * 0.4, cameraRotationFactor * 0.7, cameraRotationFactor]
          : transitionState === 'exiting'
              ? [cameraRotationFactor, cameraRotationFactor * 0.7, cameraRotationFactor * 0.4, 0]
              : 0
      : 0,

    // Position effect for 3D movement
    position: cameraEnabled && cameraMovementEnabled
      ? {
          x: transitionState === 'entering'
              ? [0, 5, 10, 15]
              : transitionState === 'exiting'
                  ? [15, 10, 5, 0]
                  : 0,
          y: transitionState === 'entering'
              ? [0, -3, -7, -12]
              : transitionState === 'exiting'
                  ? [-12, -7, -3, 0]
                  : 0,
          z: transitionState === 'entering'
              ? [0, 5, 8, 10]
              : transitionState === 'exiting'
                  ? [10, 8, 5, 0]
                  : 0
        }
      : { x: 0, y: 0, z: 0 },

    // Animation timing
    transition: {
      duration: transitionDuration / 1000, // Convert to seconds for animation
      ease: "easeInOut",
      times: [0, 0.3, 0.7, 1] // Control timing of each keyframe
    },

    // Current progress for partial animations
    progress: transitionProgress
  };

  // UI Animation settings
  const uiAnimationSettings: UIAnimationSettings = {
    // Staggered delay for animating multiple elements
    staggerDelay,

    // Whether UI elements should be visible (false during most of transition)
    elementsVisible:
      transitionState === 'none' ||
      (transitionState === 'entering' && transitionProgress > 0.7) ||
      (transitionState === 'exiting' && transitionProgress < 0.3),

    // Current animation progress
    progress: transitionProgress,

    // Animation variants for elements entering the view
    enterVariants: createQuantumVariants({
      duration: 0.5,
      ease: "easeOut",
      // Add stagger delay function
      delay: (index: number) => index * (staggerDelay / 1000) // Convert to seconds
    }),

    // Direction-based variants for sliding elements
    slideVariants: {
      hidden: (direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
        // Use the shared slide variants but customize the direction
        const variants = createSlideVariants(direction, direction === 'left' || direction === 'right' ? 50 : 30, {
          duration: 0.2,
          ease: "easeIn"
        });
        return variants.hidden;
      },
      visible: (index: number) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          delay: index * (staggerDelay / 1000),
          duration: 0.5,
          ease: "easeOut"
        }
      }),
      exit: (direction: 'left' | 'right' | 'up' | 'down' = 'left') => {
        // Use the shared slide variants but customize the direction
        const variants = createSlideVariants(direction, direction === 'left' || direction === 'right' ? 50 : 30, {
          duration: 0.3,
          ease: "easeIn"
        });
        return variants.exit;
      }
    }
  };

  return {
    transitionState,
    enterStarSystem,
    exitToHub,
    cameraSettings,
    uiAnimationSettings,
    transitionProgress,
    isTransitioning: transitionState !== 'none'
  };
}