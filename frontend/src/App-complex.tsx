import React from 'react';
import { EnhancedQuantumRouter } from './router/EnhancedQuantumRouter';
import { AuthProvider } from './lib/supabase/AuthContext';
import { QuantumThemeProvider, setupQuantumDesignSystem } from './design-system';
import { StarBackground } from './cosmos';
import { StardustCursor } from './components';

/**
 * App component - Root component for the QQ-Verse application
 * Enhanced with QuantumThemeProvider for complete UI/UX coherence
 * @returns {JSX.Element} The main application component
 */
export function App() {
    // Initialize design system
    React.useEffect(() => {
        setupQuantumDesignSystem();
    }, []);

    return (
        <QuantumThemeProvider>
            <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
                <StardustCursor />
                <StarBackground />
                <div className="relative z-10">
                    <AuthProvider>
                        <EnhancedQuantumRouter />
                    </AuthProvider>
                </div>
            </div>
        </QuantumThemeProvider>
    );
}