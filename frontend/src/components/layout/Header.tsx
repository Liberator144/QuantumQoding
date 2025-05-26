import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';
import { UserProfile } from './UserProfile';
/**
 * Header Component
 *
 * Main navigation header with search functionality and user authentication.
 * Provides quantum-themed styling and responsive design.
 */
export function Header() {
    const { isAuthenticated, user } = useAuth();
    const [showProfile, setShowProfile] = useState(false);
    const handleProfileToggle = () => {
        setShowProfile(!showProfile);
    };
    const handleProfileClose = () => {
        setShowProfile(false);
    };
    return (_jsxs("header", { className: "px-6 py-5 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-white text-2xl font-bold", children: "QQ" }), _jsx("span", { className: "text-white text-2xl", children: "QuantumQoding" })] }), _jsxs("div", { className: "flex items-center px-4 py-2 bg-[#0a0e1f] rounded-full border border-[#1a2040] w-64", children: [_jsx(Search, { className: "w-5 h-5 text-[#4a5482]" }), _jsx("input", { type: "text", placeholder: "Search", className: "bg-transparent border-none outline-none text-[#4a5482] ml-2 w-full" })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("a", { href: "#", className: "text-[#8a94c2] hover:text-white transition-colors", children: "Pricing" }), isAuthenticated ? (_jsxs("div", { className: "relative cursor-pointer flex items-center gap-2", onClick: handleProfileToggle, children: [_jsx("div", { className: "text-[#8a94c2]", children: user?.username }), _jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold", children: user?.username?.substring(0, 1).toUpperCase() }), _jsx(UserProfile, { isOpen: showProfile, onClose: handleProfileClose })] })) : (_jsx("div", { className: "w-10 h-10 rounded-full bg-[#0a0e1f] border border-[#1a2040] flex items-center justify-center", children: _jsx(User, { className: "w-5 h-5 text-[#4a5482]" }) }))] })] }));
}
