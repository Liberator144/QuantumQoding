/**
 * Navigation Provider
 *
 * This component provides navigation context and state management
 * for the Wormhole Navigation System.
 *
 * @version 1.0.0
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { VisualizationLevel, NavigationHistoryItem } from './WormholeNavigationSystem';

/**
 * Navigation context
 */
interface NavigationContextType {
  /** Current level */
  currentLevel: VisualizationLevel;
  
  /** Current entity ID */
  currentEntityId: string;
  
  /** Current entity name */
  currentEntityName: string;
  
  /** Current entity color */
  currentEntityColor?: string;
  
  /** Navigation history */
  navigationHistory: NavigationHistoryItem[];
  
  /** Navigate to a specific level and entity */
  navigateTo: (
    level: VisualizationLevel,
    entityId: string,
    entityName: string,
    entityColor?: string,
    data?: any
  ) => void;
  
  /** Navigate back in history */
  navigateBack: () => void;
  
  /** Clear navigation history */
  clearHistory: () => void;
  
  /** Custom data */
  data?: any;
}

/**
 * Navigation provider props
 */
interface NavigationProviderProps {
  /** Initial level */
  initialLevel: VisualizationLevel;
  
  /** Initial entity ID */
  initialEntityId: string;
  
  /** Initial entity name */
  initialEntityName: string;
  
  /** Initial entity color */
  initialEntityColor?: string;
  
  /** Maximum history items */
  maxHistoryItems?: number;
  
  /** Children */
  children: React.ReactNode;
  
  /** Initial data */
  initialData?: any;
}// Create navigation context
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Navigation Provider Component
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  initialLevel,
  initialEntityId,
  initialEntityName,
  initialEntityColor,
  maxHistoryItems = 10,
  children,
  initialData,
}) => {
  // State
  const [currentLevel, setCurrentLevel] = useState<VisualizationLevel>(initialLevel);
  const [currentEntityId, setCurrentEntityId] = useState<string>(initialEntityId);
  const [currentEntityName, setCurrentEntityName] = useState<string>(initialEntityName);
  const [currentEntityColor, setCurrentEntityColor] = useState<string | undefined>(initialEntityColor);
  const [navigationHistory, setNavigationHistory] = useState<NavigationHistoryItem[]>([
    {
      level: initialLevel,
      entityId: initialEntityId,
      entityName: initialEntityName,
      entityColor: initialEntityColor,
      timestamp: Date.now(),
      data: initialData,
    },
  ]);
  const [data, setData] = useState<any>(initialData);
  
  /**
   * Navigate to a specific level and entity
   */
  const navigateTo = useCallback(
    (
      level: VisualizationLevel,
      entityId: string,
      entityName: string,
      entityColor?: string,
      customData?: any
    ) => {
      // Update current location
      setCurrentLevel(level);
      setCurrentEntityId(entityId);
      setCurrentEntityName(entityName);
      setCurrentEntityColor(entityColor);
      setData(customData);
      
      // Add to history
      setNavigationHistory((prevHistory) => {
        // Create new history item
        const newItem: NavigationHistoryItem = {
          level,
          entityId,
          entityName,
          entityColor,
          timestamp: Date.now(),
          data: customData,
        };
        
        // Check if this is the same as the last item
        const lastItem = prevHistory[prevHistory.length - 1];
        if (lastItem && lastItem.level === level && lastItem.entityId === entityId) {
          return prevHistory;
        }        
        // Add to history and limit size
        const newHistory = [...prevHistory, newItem];
        if (newHistory.length > maxHistoryItems) {
          return newHistory.slice(newHistory.length - maxHistoryItems);
        }
        
        return newHistory;
      });
    },
    [maxHistoryItems]
  );
  
  /**
   * Navigate back in history
   */
  const navigateBack = useCallback(() => {
    // Don't navigate if history is empty
    if (navigationHistory.length <= 1) return;
    
    // Get previous item
    const previousItem = navigationHistory[navigationHistory.length - 2];
    
    // Update current location
    setCurrentLevel(previousItem.level);
    setCurrentEntityId(previousItem.entityId);
    setCurrentEntityName(previousItem.entityName);
    setCurrentEntityColor(previousItem.entityColor);
    setData(previousItem.data);
    
    // Remove current item from history
    setNavigationHistory((prevHistory) => prevHistory.slice(0, prevHistory.length - 1));
  }, [navigationHistory]);
  
  /**
   * Clear navigation history
   */
  const clearHistory = useCallback(() => {
    // Keep only current location
    setNavigationHistory([
      {
        level: currentLevel,
        entityId: currentEntityId,
        entityName: currentEntityName,
        entityColor: currentEntityColor,
        timestamp: Date.now(),
        data,
      },
    ]);
  }, [currentLevel, currentEntityId, currentEntityName, currentEntityColor, data]);
  
  // Create context value
  const contextValue = useMemo(
    () => ({
      currentLevel,
      currentEntityId,
      currentEntityName,
      currentEntityColor,
      navigationHistory,
      navigateTo,
      navigateBack,
      clearHistory,
      data,
    }),
    [
      currentLevel,
      currentEntityId,
      currentEntityName,
      currentEntityColor,
      navigationHistory,
      navigateTo,
      navigateBack,
      clearHistory,
      data,
    ]
  );  
  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Use navigation hook
 */
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};

export default NavigationProvider;