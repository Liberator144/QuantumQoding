/**
 * Main Layout Component - Phase 1 Implementation
 * 
 * Provides the main layout structure with enhanced header navigation
 * for accessing revolutionary components and test screens.
 * 
 * @version 1.0.0
 */
import React, { ReactNode } from 'react';
import { EnhancedHeader } from './EnhancedHeader';

interface MainLayoutProps {
    children: ReactNode;
    showHeader?: boolean;
    className?: string;
}

/**
 * Main Layout Component
 * 
 * Wraps the application content with the enhanced header navigation
 */
export function MainLayout({ 
    children, 
    showHeader = true, 
    className = '' 
}: MainLayoutProps) {
    return (
        <div className={`min-h-screen bg-[#050714] ${className}`}>
            {showHeader && <EnhancedHeader />}
            <main className="relative">
                {children}
            </main>
        </div>
    );
}

export default MainLayout;