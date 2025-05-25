/**
 * Quantum Router Hook
 * 
 * This hook provides quantum-coherent navigation capabilities,
 * maintaining consciousness continuity during route transitions.
 * 
 * @version 1.0.0
 */

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAudio } from '../utils/CoherenceHelpers/useAudio';
import { starSystems } from './routes';

/**
 * Navigation options
 */
interface NavigateOptions {
  replace?: boolean;
  state?: any;
  transitionType?: 'fade' | 'slide' | 'scale' | 'wormhole';
}

/**
 * Quantum router hook
 */
export const useQuantumRouter = () => {
  // Get navigate function and location
  const navigate = useNavigate();
  const location = useLocation();
  const audio = useAudio();
  
  /**
   * Navigate to a new route with quantum coherence
   */
  const quantumNavigate = useCallback((
    to: string,
    options: NavigateOptions = {}
  ) => {
    // Determine transition type based on route
    let transitionType = options.transitionType || 'fade';
    
    // Find current and target star systems
    const currentPath = location.pathname;
    const currentStarSystem = starSystems.find(system => 
      currentPath.startsWith(system.path)
    );
    
    const targetStarSystem = starSystems.find(system => 
      to.startsWith(system.path)
    );
    
    // Determine if this is a star system transition
    const isStarSystemTransition = currentStarSystem?.name !== targetStarSystem?.name;
    
    // Use wormhole transition for star system changes
    if (isStarSystemTransition) {
      transitionType = 'wormhole';
      audio.play('dimensional-shift', { volume: 0.7 });
    } else {
      audio.play('quantum-pulse', { volume: 0.3 });
    }
    
    // Navigate to the new route
    navigate(to, {
      replace: options.replace,
      state: {
        ...options.state,
        transitionType,
      },
    });
  }, [navigate, location.pathname, audio]);
  
  /**
   * Navigate to a star system
   */
  const navigateToStarSystem = useCallback((
    starSystemName: string,
    options: NavigateOptions = {}
  ) => {
    // Find star system
    const starSystem = starSystems.find(system => 
      system.name === starSystemName
    );
    
    if (!starSystem) {
      console.error(`Star system "${starSystemName}" not found`);
      return;
    }
    
    // Navigate to star system
    quantumNavigate(starSystem.path, {
      ...options,
      transitionType: 'wormhole',
    });
  }, [quantumNavigate]);
  
  /**
   * Navigate to a feature within a star system
   */
  const navigateToFeature = useCallback((
    starSystemName: string,
    featurePath: string,
    options: NavigateOptions = {}
  ) => {
    // Find star system
    const starSystem = starSystems.find(system => 
      system.name === starSystemName
    );
    
    if (!starSystem) {
      console.error(`Star system "${starSystemName}" not found`);
      return;
    }
    
    // Navigate to feature
    quantumNavigate(`${starSystem.path}${featurePath}`, {
      ...options,
      transitionType: 'slide',
    });
  }, [quantumNavigate]);
  
  return {
    navigate: quantumNavigate,
    navigateToStarSystem,
    navigateToFeature,
    location,
  };
};

export default useQuantumRouter;