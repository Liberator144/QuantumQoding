import React from 'react';
import { EnhancedQuantumRouter } from './router/EnhancedQuantumRouter';
import { AuthProvider } from './lib/supabase/AuthContext';
import { StarBackground } from './cosmos';
import { StardustCursor } from './components';

/**
 * App component - Root component for the QQ-Verse application
 * @returns {JSX.Element} The main application component
 */
export function App() {
    return (
        <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
            <StardustCursor />
            <StarBackground />
            <div className="relative z-10">
                <AuthProvider>
                    <EnhancedQuantumRouter />
                </AuthProvider>
            </div>
        </div>
    );
}