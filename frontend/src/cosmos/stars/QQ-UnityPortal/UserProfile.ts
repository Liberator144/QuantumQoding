import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: UserProfile.js
 * @version 2.0.0
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../../lib/AuthContext';
export const UserProfile = ({ isOpen, onClose }) => {
    const { user, logout, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [preferences, setPreferences] = useState(user?.preferences || {
        theme: 'quantum',
        animationLevel: 'high',
        notifications: true,
        dataVisibility: true,
        uiDensity: 'comfortable',
    });
    const handleSavePreferences = async () => {
        if (!user)
            return;
        try {
            await updateUser({
                preferences
            });
        }
        catch (error) {
            console.error('Failed to update preferences:', error);
        }
    };
    const handleLogout = () => {
        logout();
        onClose();
    };
    if (!user)
        return null;
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "fixed top-20 right-6 w-96 backdrop-blur-lg rounded-lg overflow-hidden border border-cyan-400/20 bg-black/40 z-50", children: [_jsxs("div", { className: "flex justify-between items-center p-4 border-b border-cyan-400/20", children: [_jsx("h2", { className: "text-xl font-light bg-gradient-to-r from-cyan-300 to-purple-300 text-transparent bg-clip-text", children: "Quantum Profile" }), _jsx("button", { onClick: onClose, className: "text-cyan-400/60 hover:text-cyan-400 transition-colors", children: _jsx(X, { size: 20 }) })] }), _jsxs("div", { className: "flex border-b border-cyan-400/20", children: [_jsx("button", { className: `flex-1 py-2 text-sm font-medium ${activeTab === 'profile'
                                ? 'text-cyan-300 border-b-2 border-cyan-400'
                                : 'text-cyan-400/60 hover:text-cyan-400'}`, onClick: () => setActiveTab('profile'), children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(User, { size: 16 }), "Profile"] }) }), _jsx("button", { className: `flex-1 py-2 text-sm font-medium ${activeTab === 'preferences'
                                ? 'text-cyan-300 border-b-2 border-cyan-400'
                                : 'text-cyan-400/60 hover:text-cyan-400'}`, onClick: () => setActiveTab('preferences'), children: _jsxs("span", { className: "flex items-center justify-center gap-2", children: [_jsx(Settings, { size: 16 }), "Preferences"] }) })] }), _jsx("div", { className: "p-4", children: activeTab === 'profile' ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold", children: user.username.substring(0, 1).toUpperCase() }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg text-cyan-200", children: user.username }), _jsx("p", { className: "text-sm text-cyan-400/60", children: user.email }), _jsx("span", { className: "inline-block mt-1 px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300", children: user.role.charAt(0).toUpperCase() + user.role.slice(1) })] })] }), _jsxs("div", { className: "space-y-2 mt-6", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-cyan-400/60", children: "Member since" }), _jsx("span", { className: "text-cyan-200", children: new Date(user.createdAt).toLocaleDateString() })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-cyan-400/60", children: "Last login" }), _jsx("span", { className: "text-cyan-200", children: new Date(user.lastLogin).toLocaleDateString() })] })] }), _jsxs("button", { onClick: handleLogout, className: "mt-6 w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-300 py-2 rounded transition-colors", children: [_jsx(LogOut, { size: 16 }), "Log Out"] })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm text-cyan-400/80", children: "UI Theme" }), _jsxs("select", { value: preferences.theme, onChange: (e) => setPreferences({
                                            ...preferences,
                                            theme: e.target.value,
                                        }), className: "w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40", children: [_jsx("option", { value: "default", children: "Default" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "quantum", children: "Quantum" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm text-cyan-400/80", children: "Animation Level" }), _jsxs("select", { value: preferences.animationLevel, onChange: (e) => setPreferences({
                                            ...preferences,
                                            animationLevel: e.target.value,
                                        }), className: "w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40", children: [_jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "minimal", children: "Minimal" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "block text-sm text-cyan-400/80", children: "UI Density" }), _jsxs("select", { value: preferences.uiDensity, onChange: (e) => setPreferences({
                                            ...preferences,
                                            uiDensity: e.target.value,
                                        }), className: "w-full bg-black/20 border border-cyan-400/20 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400/40", children: [_jsx("option", { value: "compact", children: "Compact" }), _jsx("option", { value: "comfortable", children: "Comfortable" }), _jsx("option", { value: "spacious", children: "Spacious" })] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm text-cyan-400/80", children: "Notifications" }), _jsx("div", { className: `w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${preferences.notifications ? 'bg-cyan-500/50' : 'bg-gray-700'}`, onClick: () => setPreferences({
                                            ...preferences,
                                            notifications: !preferences.notifications,
                                        }), children: _jsx(motion.div, { className: "w-4 h-4 bg-white rounded-full", animate: { translateX: preferences.notifications ? 24 : 0 }, transition: { type: 'spring', stiffness: 500, damping: 30 } }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-sm text-cyan-400/80", children: "Data Visibility" }), _jsx("div", { className: `w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${preferences.dataVisibility ? 'bg-cyan-500/50' : 'bg-gray-700'}`, onClick: () => setPreferences({
                                            ...preferences,
                                            dataVisibility: !preferences.dataVisibility,
                                        }), children: _jsx(motion.div, { className: "w-4 h-4 bg-white rounded-full", animate: { translateX: preferences.dataVisibility ? 24 : 0 }, transition: { type: 'spring', stiffness: 500, damping: 30 } }) })] }), _jsx("button", { onClick: handleSavePreferences, className: "mt-4 w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2 rounded transition-colors", children: "Save Preferences" })] })) })] })) }));
};
