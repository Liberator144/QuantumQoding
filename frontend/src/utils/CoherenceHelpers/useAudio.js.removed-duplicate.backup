/**
 * Enhanced utility for audio management in the QQ-Verse cosmic UI
 * Provides simplified audio loading, playback and management
 */
import { useState, useEffect, useRef } from 'react';
// Available sound effects 
const SOUND_EFFECTS = {
    // Transition sounds
    'wormhole-enter': { category: 'transition', path: '/audio/wormhole-enter.mp3', defaultVolume: 0.7 },
    'wormhole-exit': { category: 'transition', path: '/audio/wormhole-exit.mp3', defaultVolume: 0.7 },
    'quantum-surge': { category: 'quantum', path: '/audio/quantum-surge.mp3', defaultVolume: 0.6 },
    'quantum-collapse': { category: 'quantum', path: '/audio/quantum-collapse.mp3', defaultVolume: 0.6 },
    'dimensional-shift': { category: 'transition', path: '/audio/dimensional-shift.mp3', defaultVolume: 0.65 },
    // Ambient sounds
    'space-ambience': { category: 'ambient', path: '/audio/space-ambience.mp3', defaultVolume: 0.3, defaultLoop: true },
    'cosmic-background': { category: 'ambient', path: '/audio/cosmic-background.mp3', defaultVolume: 0.25, defaultLoop: true },
    'quantum-hum': { category: 'ambient', path: '/audio/quantum-hum.mp3', defaultVolume: 0.2, defaultLoop: true },
    // Interaction sounds
    'star-select': { category: 'interaction', path: '/audio/star-select.mp3', defaultVolume: 0.5 },
    'planet-select': { category: 'interaction', path: '/audio/planet-select.mp3', defaultVolume: 0.5 },
    'hover': { category: 'interaction', path: '/audio/hover.mp3', defaultVolume: 0.3 },
    'click': { category: 'interaction', path: '/audio/click.mp3', defaultVolume: 0.4 },
    'toggle': { category: 'interaction', path: '/audio/toggle.mp3', defaultVolume: 0.4 },
    // Notification sounds
    'success': { category: 'notification', path: '/audio/success.mp3', defaultVolume: 0.5 },
    'error': { category: 'notification', path: '/audio/error.mp3', defaultVolume: 0.5 },
    'alert': { category: 'notification', path: '/audio/alert.mp3', defaultVolume: 0.6 },
    // Quantum effects
    'data-flow': { category: 'quantum', path: '/audio/data-flow.mp3', defaultVolume: 0.4 },
    'quantum-pulse': { category: 'quantum', path: '/audio/quantum-pulse.mp3', defaultVolume: 0.5 },
    'energy-burst': { category: 'quantum', path: '/audio/energy-burst.mp3', defaultVolume: 0.5 },
};
/**
 * Custom hook for managing audio playback
 */
export function useAudio() {
    // Store audio elements and their current state
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [categoryVolumes, setCategoryVolumes] = useState({
        transition: 0.7,
        ambient: 0.3,
        interaction: 0.5,
        notification: 0.6,
        quantum: 0.6
    });
    const [masterVolume, setMasterVolume] = useState(0.8);
    // Ref to store audio elements
    const audioElements = useRef({});
    const activeAudio = useRef({});
    // Initialize audio elements
    useEffect(() => {
        // Preload sound effects to reduce loading time when needed
        Object.entries(SOUND_EFFECTS).forEach(([key, effect]) => {
            const audio = new Audio(effect.path);
            audio.preload = 'auto';
            audio.volume = 0; // Initially silent until played
            audioElements.current[key] = audio;
        });
        // Cleanup function to stop and remove all audio
        return () => {
            Object.values(audioElements.current).forEach(audio => {
                audio.pause();
                audio.src = '';
            });
            Object.values(activeAudio.current).forEach(audio => {
                audio.pause();
            });
            audioElements.current = {};
            activeAudio.current = {};
        };
    }, []);
    /**
     * Play sound with fallback for browsers that block autoplay
     */
    const playSoundWithFallback = (audio) => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn('Audio playback was prevented by the browser:', error);
            });
        }
    };
    /**
     * Clean up audio element
     */
    const cleanupAudio = (id) => {
        delete activeAudio.current[id];
    };
    /**
     * Stop audio with optional fade out
     */
    const stopAudio = (id, fadeOutMs) => {
        const audio = activeAudio.current[id];
        if (!audio)
            return;
        if (fadeOutMs && fadeOutMs > 0) {
            const originalVolume = audio.volume;
            const startTime = Date.now();
            const fadeOutInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / fadeOutMs, 1);
                audio.volume = originalVolume * (1 - progress);
                if (progress >= 1) {
                    clearInterval(fadeOutInterval);
                    audio.pause();
                    cleanupAudio(id);
                }
            }, 20);
        }
        else {
            audio.pause();
            cleanupAudio(id);
        }
    };
    /**
     * Play a sound effect with options
     */
    const play = (soundKey, options = {}) => {
        if (!audioEnabled)
            return null;
        // Try to get the sound effect
        const effect = SOUND_EFFECTS[soundKey];
        if (!effect) {
            console.warn(`Sound effect "${soundKey}" not found`);
            return null;
        }
        // Get or create audio element
        const originalAudio = audioElements.current[soundKey];
        if (!originalAudio) {
            console.warn(`Audio element for "${soundKey}" not found`);
            return null;
        }
        // Clone the audio element for multiple plays of the same sound
        const audio = originalAudio.cloneNode(true);
        // Configure audio with options
        const category = effect.category;
        const categoryVolume = categoryVolumes[category] || 0.5;
        const effectVolume = effect.defaultVolume || 0.5;
        const finalVolume = (options.volume || effectVolume) * categoryVolume * masterVolume;
        audio.volume = finalVolume;
        audio.loop = options.loop || effect.defaultLoop || false;
        audio.playbackRate = options.playbackRate || 1;
        // Apply fade in if specified
        if (options.fadeIn && options.fadeIn > 0) {
            audio.volume = 0;
            let startTime = Date.now();
            const fadeInInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / options.fadeIn, 1);
                audio.volume = progress * finalVolume;
                if (progress >= 1) {
                    clearInterval(fadeInInterval);
                }
            }, 20);
        }
        // Apply delay if specified
        if (options.delay && options.delay > 0) {
            setTimeout(() => {
                playSoundWithFallback(audio);
            }, options.delay);
        }
        else {
            playSoundWithFallback(audio);
        }
        // Handle fade out and cleanup
        const id = Date.now().toString();
        activeAudio.current[id] = audio;
        // Handle end of audio
        audio.addEventListener('ended', () => {
            cleanupAudio(id);
        });
        // Return control functions
        return {
            stop: () => stopAudio(id, options.fadeOut),
            setVolume: (volume) => {
                if (activeAudio.current[id]) {
                    activeAudio.current[id].volume = volume * categoryVolume * masterVolume;
                }
            },
            fadeOut: (duration = 1000) => {
                stopAudio(id, duration);
            }
        };
    };
    /**
     * Toggle audio on/off
     */
    const toggleAudio = () => {
        setAudioEnabled(!audioEnabled);
        // Pause or resume all active audio
        Object.values(activeAudio.current).forEach(audio => {
            if (!audioEnabled) {
                // Resuming audio
                playSoundWithFallback(audio);
            }
            else {
                // Pausing audio
                audio.pause();
            }
        });
    };
    /**
     * Set volume level for a category
     */
    const setCategoryVolume = (category, volume) => {
        setCategoryVolumes(prev => ({
            ...prev,
            [category]: Math.max(0, Math.min(1, volume))
        }));
        // Update any active audio in this category
        Object.entries(activeAudio.current).forEach(([id, audio]) => {
            const soundKey = Object.entries(SOUND_EFFECTS).find(([_, effect]) => audio.src.includes(effect.path))?.[0];
            if (soundKey && SOUND_EFFECTS[soundKey].category === category) {
                audio.volume = SOUND_EFFECTS[soundKey].defaultVolume * volume * masterVolume;
            }
        });
    };
    /**
     * Set master volume
     */
    const setMasterVolumeLevel = (volume) => {
        const newVolume = Math.max(0, Math.min(1, volume));
        setMasterVolume(newVolume);
        // Update all active audio
        Object.entries(activeAudio.current).forEach(([id, audio]) => {
            const soundKey = Object.entries(SOUND_EFFECTS).find(([_, effect]) => audio.src.includes(effect.path))?.[0];
            if (soundKey) {
                const category = SOUND_EFFECTS[soundKey].category;
                audio.volume = SOUND_EFFECTS[soundKey].defaultVolume * categoryVolumes[category] * newVolume;
            }
        });
    };
    /**
     * Play ambient sound with looping
     */
    const playAmbient = (soundKey, options = {}) => {
        return play(soundKey, {
            loop: true,
            fadeIn: 2000,
            ...options
        });
    };
    /**
     * Play a sequence of sounds with timing
     */
    const playSequence = (sequence) => {
        let timeoutIds = [];
        sequence.forEach(item => {
            const timeoutId = setTimeout(() => {
                play(item.sound, item.options);
            }, item.delay);
            timeoutIds.push(timeoutId);
        });
        // Return function to cancel sequence
        return () => {
            timeoutIds.forEach(id => clearTimeout(id));
        };
    };
    return {
        play,
        playAmbient,
        playSequence,
        toggleAudio,
        setCategoryVolume,
        setMasterVolume: setMasterVolumeLevel,
        isEnabled: audioEnabled,
        masterVolume,
        categoryVolumes
    };
}
