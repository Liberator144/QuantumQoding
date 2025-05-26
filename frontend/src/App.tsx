/**
 * App Component
 *
 * This component serves as the root component for the QQ-Verse project,
 * providing the quantum-coherent routing and state management.
 *
 * @version 2.0.0
 */
import React from 'react';
import { QuantumRouter } from './router/QuantumRouter';
import { AuthProvider } from './lib/AuthContext';
import { StarBackground } from './cosmos';
import { StardustCursor } from './components';

/**
 * App component - Root component for the QQ-Verse application
 * @returns {JSX.Element} The main application component
 */
export function App(): JSX.Element {
    return (
        <div className="relative w-full min-h-screen bg-[#050714] overflow-hidden">
            <StardustCursor />
            <StarBackground />
            <div className="relative z-10">
                <AuthProvider>
                    <QuantumRouter />
                </AuthProvider>
            </div>
        </div>
    );
}