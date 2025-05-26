import React, { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { UserProfile } from './UserProfile';

/**
 * Header Component
 * 
 * Main navigation header with search functionality and user authentication.
 * Provides quantum-themed styling and responsive design.
 */
export function Header(): JSX.Element {
    const { isAuthenticated, user } = useAuth();
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const handleProfileToggle = (): void => {
        setShowProfile(!showProfile);
    };

    const handleProfileClose = (): void => {
        setShowProfile(false);
    };

    return (
        <header className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-bold">QQ</span>
                <span className="text-white text-2xl">QuantumQoding</span>
            </div>
            
            <div className="flex items-center px-4 py-2 bg-[#0a0e1f] rounded-full border border-[#1a2040] w-64">
                <Search className="w-5 h-5 text-[#4a5482]" />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="bg-transparent border-none outline-none text-[#4a5482] ml-2 w-full"
                />
            </div>
            
            <div className="flex items-center gap-6">
                <a 
                    href="#" 
                    className="text-[#8a94c2] hover:text-white transition-colors"
                >
                    Pricing
                </a>
                
                {isAuthenticated ? (
                    <div 
                        className="relative cursor-pointer flex items-center gap-2" 
                        onClick={handleProfileToggle}
                    >
                        <div className="text-[#8a94c2]">{user?.username}</div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                            {user?.username?.substring(0, 1).toUpperCase()}
                        </div>
                        <UserProfile 
                            isOpen={showProfile} 
                            onClose={handleProfileClose}
                        />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-[#0a0e1f] border border-[#1a2040] flex items-center justify-center">
                        <User className="w-5 h-5 text-[#4a5482]" />
                    </div>
                )}
            </div>
        </header>
    );
}