import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: NavigationControls.js
 * @version 2.0.0
 */
/**
 * Navigation Controls
 *
 * This component provides UI controls for the Wormhole Navigation System.
 *
 * @version 1.0.0
 */
import React, { useState } from 'react';
import { UITransition } from '../transitions/UITransition';
import { useNavigation } from './NavigationProvider';
import { VisualizationLevel } from './WormholeNavigationSystem';
/**
 * Navigation Controls Component
 */
const NavigationControls = ({ showBackButton = true, showLevelSelector = true, showHistory = true, showPath = true, position = 'bottom-left', theme = 'quantum', className = '', }) => {
    // Navigation context
    const { currentLevel, currentEntityId, currentEntityName, currentEntityColor, navigationHistory, navigateTo, navigateBack, } = useNavigation();
    // State
    const [showHistoryPanel, setShowHistoryPanel] = useState(false);
    const [showLevelPanel, setShowLevelPanel] = useState(false);
    /**
     * Get level name
     */
    const getLevelName = (level) => {
        switch (level) {
            case VisualizationLevel.UNIVERSE:
                return 'Universe';
            case VisualizationLevel.GALAXY:
                return 'Galaxy';
            case VisualizationLevel.STAR_SYSTEM:
                return 'Star System';
            case VisualizationLevel.PLANETARY_SYSTEM:
                return 'Planetary System';
            case VisualizationLevel.PLANET:
                return 'Planet';
            default:
                return 'Unknown';
        }
    };
    /**
     * Get level color
     */
    const getLevelColor = (level) => {
        switch (level) {
            case VisualizationLevel.UNIVERSE:
                return '#9c27b0'; // Purple
            case VisualizationLevel.GALAXY:
                return '#673ab7'; // Deep Purple
            case VisualizationLevel.STAR_SYSTEM:
                return '#3f51b5'; // Indigo
            case VisualizationLevel.PLANETARY_SYSTEM:
                return '#2196f3'; // Blue
            case VisualizationLevel.PLANET:
                return '#03a9f4'; // Light Blue
            default:
                return '#4fc3f7';
        }
    };
    /**
     * Get position classes
     */
    const getPositionClasses = () => {
        switch (position) {
            case 'top-left':
                return 'top-4 left-4';
            case 'top-right':
                return 'top-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'top':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'bottom-4 left-4';
        }
    };
    /**
     * Get theme classes
     */
    const getThemeClasses = () => {
        switch (theme) {
            case 'dark':
                return 'bg-gray-900 bg-opacity-70 text-white border-gray-700';
            case 'light':
                return 'bg-white bg-opacity-70 text-gray-900 border-gray-200';
            case 'quantum':
                return 'bg-black bg-opacity-50 backdrop-blur-sm text-white border-blue-500 border-opacity-40';
            case 'nebula':
                return 'bg-indigo-900 bg-opacity-60 backdrop-blur-sm text-white border-purple-500 border-opacity-40';
            default:
                return 'bg-black bg-opacity-50 backdrop-blur-sm text-white border-blue-500 border-opacity-40';
        }
    };
    /**
     * Render back button
     */
    const renderBackButton = () => {
        if (!showBackButton)
            return null;
        return (_jsx("button", { className: `p-2 rounded-full ${getThemeClasses()} hover:bg-opacity-70 transition-colors`, onClick: navigateBack, disabled: navigationHistory.length <= 1, title: "Navigate Back", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z", clipRule: "evenodd" }) }) }));
    };
    /**
     * Render current location
     */
    const renderCurrentLocation = () => {
        return (_jsxs("div", { className: `px-3 py-1.5 rounded-lg ${getThemeClasses()} flex items-center space-x-2`, onClick: () => setShowLevelPanel(!showLevelPanel), children: [_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: currentEntityColor || getLevelColor(currentLevel) } }), _jsxs("div", { children: [_jsx("div", { className: "text-xs opacity-70", children: getLevelName(currentLevel) }), _jsx("div", { className: "text-sm font-medium", children: currentEntityName })] }), showLevelSelector && (_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: `h-4 w-4 transition-transform ${showLevelPanel ? 'rotate-180' : ''}`, viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z", clipRule: "evenodd" }) }))] }));
    };
    /**
     * Render history button
     */
    const renderHistoryButton = () => {
        if (!showHistory)
            return null;
        return (_jsx("button", { className: `p-2 rounded-full ${getThemeClasses()} hover:bg-opacity-70 transition-colors`, onClick: () => setShowHistoryPanel(!showHistoryPanel), title: "Navigation History", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z", clipRule: "evenodd" }) }) }));
    };
    /**
     * Render level selector panel
     */
    const renderLevelSelectorPanel = () => {
        if (!showLevelSelector || !showLevelPanel)
            return null;
        const levels = Object.values(VisualizationLevel);
        return (_jsxs(UITransition, { show: showLevelPanel, preset: "quantum", direction: "up", className: `absolute ${position.includes('bottom') ? 'bottom-16' : 'top-16'} left-0 p-2 rounded-lg ${getThemeClasses()} min-w-[200px]`, children: [_jsx("div", { className: "text-xs font-medium mb-1", children: "Select Level" }), _jsx("div", { className: "space-y-1", children: levels.map((level) => (_jsxs("div", { className: `flex items-center text-xs cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-2 py-1 transition-colors ${currentLevel === level ? 'bg-white bg-opacity-10' : ''}`, onClick: () => {
                            // Close panel
                            setShowLevelPanel(false);
                            // Don't navigate if already at this level
                            if (currentLevel === level)
                                return;
                            // Navigate to first entity at this level in history
                            const historyItem = navigationHistory.find((item) => item.level === level);
                            if (historyItem) {
                                navigateTo(historyItem.level, historyItem.entityId, historyItem.entityName, historyItem.entityColor, historyItem.data);
                            }
                        }, children: ["              ", _jsx("div", { className: "w-2 h-2 rounded-full mr-2", style: { backgroundColor: getLevelColor(level) } }), _jsx("div", { children: getLevelName(level) })] }, `level-${level}`))) })] }));
    };
    /**
     * Render history panel
     */
    const renderHistoryPanel = () => {
        if (!showHistory || !showHistoryPanel)
            return null;
        return (_jsxs(UITransition, { show: showHistoryPanel, preset: "quantum", direction: "up", className: `absolute ${position.includes('bottom') ? 'bottom-16' : 'top-16'} right-0 p-2 rounded-lg ${getThemeClasses()} min-w-[200px] max-w-[300px]`, children: [_jsx("div", { className: "text-xs font-medium mb-1", children: "Navigation History" }), _jsx("div", { className: "space-y-1 max-h-40 overflow-y-auto", children: navigationHistory.map((item, index) => (_jsxs("div", { className: `flex items-center text-xs cursor-pointer hover:bg-white hover:bg-opacity-10 rounded px-2 py-1 transition-colors ${index === navigationHistory.length - 1 ? 'bg-white bg-opacity-10' : ''}`, onClick: () => {
                            // Close panel
                            setShowHistoryPanel(false);
                            // Don't navigate if already at this item
                            if (index === navigationHistory.length - 1)
                                return;
                            // Navigate to this item
                            navigateTo(item.level, item.entityId, item.entityName, item.entityColor, item.data);
                        }, children: [_jsx("div", { className: "w-2 h-2 rounded-full mr-2 flex-shrink-0", style: { backgroundColor: item.entityColor || getLevelColor(item.level) } }), _jsxs("div", { className: "flex flex-col", children: [_jsx("div", { className: "opacity-70", children: getLevelName(item.level) }), _jsx("div", { className: index === navigationHistory.length - 1 ? 'font-medium' : '', children: item.entityName })] })] }, `history-${item.level}-${item.entityId}-${item.timestamp}`))) })] }));
    };
    /**
     * Render path visualization
     */
    const renderPathVisualization = () => {
        if (!showPath || navigationHistory.length <= 1)
            return null;
        return (_jsx("div", { className: `absolute top-4 left-1/2 transform -translate-x-1/2 z-50`, children: _jsx(UITransition, { show: true, preset: "glide", direction: "down", className: `px-4 py-2 rounded-lg ${getThemeClasses()}`, children: _jsx("div", { className: "flex items-center space-x-2", children: navigationHistory.map((item, index) => (_jsxs(React.Fragment, { children: [_jsxs("div", { className: "flex items-center cursor-pointer hover:opacity-80 transition-opacity", onClick: () => {
                                    if (index < navigationHistory.length - 1) {
                                        navigateTo(item.level, item.entityId, item.entityName, item.entityColor, item.data);
                                    }
                                }, children: [_jsx("div", { className: "w-3 h-3 rounded-full mr-1", style: { backgroundColor: item.entityColor || getLevelColor(item.level) } }), _jsx("div", { className: `text-xs ${index === navigationHistory.length - 1 ? 'font-medium' : ''}`, children: item.entityName })] }), index < navigationHistory.length - 1 && (_jsx("div", { className: "text-white opacity-50", children: "\u2192" }))] }, `${item.level}-${item.entityId}-${item.timestamp}`))) }) }) }));
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: `absolute ${getPositionClasses()} z-50 ${className}`, children: _jsxs("div", { className: "flex items-center space-x-2", children: [renderBackButton(), renderCurrentLocation(), renderHistoryButton()] }) }), renderLevelSelectorPanel(), renderHistoryPanel(), renderPathVisualization()] }));
};
export default NavigationControls;
