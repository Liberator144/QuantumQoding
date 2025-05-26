/**
 * TypeScript Migration
 * Migrated from: ThemeToggle.js
 * @version 2.0.0
 */
/**
 * Theme Toggle Component
 *
 * This component provides a toggle for switching between light, dark, and system themes.
 *
 * @version 1.0.0
 */
import React from 'react';
import { motion } from 'framer-motion';
import { useDesignSystem } from './DesignSystemProvider';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Theme toggle component
 */
export const ThemeToggle = ({ className = '' }) => {
    // Get theme from design system
    const { theme, setTheme, isDarkMode } = useDesignSystem();
    const audio = useAudio();
    // Handle theme change
    const handleThemeChange = () => {
        audio.play('click', { volume: 0.3 });
        if (isDarkMode) {
            setTheme('light');
        }
        else {
            setTheme('dark');
        }
    };
    return (<button onClick={handleThemeChange} className={`relative w-12 h-6 rounded-full p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-100'} ${className}`} aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
      <motion.div className={`absolute w-5 h-5 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-yellow-400'}`} initial={false} animate={{ x: isDarkMode ? 24 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}>
        {isDarkMode ? (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 m-0.5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
          </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 m-0.5 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
          </svg>)}
      </motion.div>
    </button>);
};
export default ThemeToggle;
