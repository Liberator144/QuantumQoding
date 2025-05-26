/**
 * Audio utility functions for QQ-Verse
 * Provides enhanced audio management with fallback support
 */

export interface AudioOptions {
  volume?: number;
  loop?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: string;
}

/**
 * Creates an audio element with specified options
 */
export function createAudio(src: string, options: AudioOptions = {}): HTMLAudioElement {
  const audio = new Audio();

  // Set source
  audio.src = src;

  // Apply options
  if (options.volume !== undefined) {
    audio.volume = Math.max(0, Math.min(1, options.volume));
  }

  if (options.loop !== undefined) {
    audio.loop = options.loop;
  }

  if (options.preload !== undefined) {
    audio.preload = options.preload;
  }

  if (options.crossOrigin !== undefined) {
    audio.crossOrigin = options.crossOrigin;
  }

  // Add error handling for missing files
  audio.addEventListener('error', (e) => {
    console.warn(`Audio file not found or failed to load: ${src}`);
  });

  return audio;
}

/**
 * Plays audio with fallback error handling
 */
export async function playWithFallback(audio: HTMLAudioElement): Promise<void> {
   try {
     if (!audio.src || audio.readyState < 2) {
       console.warn('Audio not ready or source missing:', audio.src);
       return;
     }
     await audio.play();
   } catch (error) {
     console.warn('Audio playback failed:', error);

    // Clean up any existing listeners to prevent duplicates
    const existingHandler = (audio as any)._fallbackHandler;
    if (existingHandler) {
      document.removeEventListener('click', existingHandler);
      document.removeEventListener('keydown', existingHandler);
    }

     const playOnInteraction = () => {
       audio.play().catch(() => {
         console.warn('Audio playback failed even after user interaction');
       });
       document.removeEventListener('click', playOnInteraction);
       document.removeEventListener('keydown', playOnInteraction);
      delete (audio as any)._fallbackHandler;
     };

    (audio as any)._fallbackHandler = playOnInteraction;
     document.addEventListener('click', playOnInteraction);
     document.addEventListener('keydown', playOnInteraction);
   }
 }

/**
 * Stops audio with fade out effect
 */
export function stopWithFadeOut(audio: HTMLAudioElement, duration: number = 1000): Promise<void> {
  return new Promise((resolve) => {
    const originalVolume = audio.volume;
    const fadeStep = originalVolume / (duration / 50); // 50ms intervals

    const fadeInterval = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume -= fadeStep;
      } else {
        audio.volume = 0;
        audio.pause();
        audio.volume = originalVolume; // Reset for next use
        clearInterval(fadeInterval);
        resolve();
      }
    }, 50);
  });
}

/**
 * Preloads multiple audio files
 */
export function preloadAudio(sources: string[]): Promise<HTMLAudioElement[]> {
  const promises = sources.map(src => {
    return new Promise<HTMLAudioElement>((resolve, reject) => {
      const audio = createAudio(src, { preload: 'auto' });

      audio.addEventListener('canplaythrough', () => resolve(audio));
      audio.addEventListener('error', () => {
        console.warn(`Failed to load audio: ${src}`);
        // Resolve with the audio element anyway to prevent blocking
        resolve(audio);
      });

      // Timeout after 5 seconds
      setTimeout(() => {
        console.warn(`Audio load timeout: ${src}`);
        resolve(audio);
      }, 5000);
    });
  });

  return Promise.all(promises);
}

/**
 * Creates a spatial audio context for 3D positioning
 */
interface SpatialAudioElement extends HTMLAudioElement {
  setPosition?(x: number, y: number, z: number): void;
  setOrientation?(x: number, y: number, z: number): void;
}

export function createSpatialAudio(src: string, options: AudioOptions = {}): SpatialAudioElement {
  const audio = createAudio(src, options);

  // Add spatial audio properties if Web Audio API is available
  if (typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined') {
    try {
      const AudioContextClass = AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaElementSource(audio);
      const panner = audioContext.createPanner();

      // Configure panner for 3D audio
      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 1;
      panner.maxDistance = 10000;
      panner.rolloffFactor = 1;

      // Connect the audio graph
      source.connect(panner);
      panner.connect(audioContext.destination);

      // Add position control methods
      (audio as any).setPosition = (x: number, y: number, z: number) => {
        panner.positionX.setValueAtTime(x, audioContext.currentTime);
        panner.positionY.setValueAtTime(y, audioContext.currentTime);
        panner.positionZ.setValueAtTime(z, audioContext.currentTime);
      };

      (audio as any).setOrientation = (x: number, y: number, z: number) => {
        panner.orientationX.setValueAtTime(x, audioContext.currentTime);
        panner.orientationY.setValueAtTime(y, audioContext.currentTime);
        panner.orientationZ.setValueAtTime(z, audioContext.currentTime);
      };

    } catch (error) {
      console.warn('Spatial audio not supported:', error);
    }
      (audio as any).setOrientation = (x: number, y: number, z: number) => {
        panner.orientationX.setValueAtTime(x, audioContext.currentTime);
        panner.orientationY.setValueAtTime(y, audioContext.currentTime);
        panner.orientationZ.setValueAtTime(z, audioContext.currentTime);
      };

    } catch (error) {
      console.warn('Spatial audio not supported:', error);
    }
  }

  return audio;
}
