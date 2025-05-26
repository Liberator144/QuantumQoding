import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: ProfileScreen.js
 * @version 2.0.0
 */
/**
 * Profile Screen Component
 *
 * This component provides the user profile interface for the QQ-Verse project,
 * allowing users to view and edit their quantum identity.
 *
 * @version 1.0.0
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../lib/AuthContext';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Profile screen component
 */
const ProfileScreen = () => {
    // Get user from auth context
    const { user, updateProfile } = useAuth();
    const audio = useAudio();
    // State for form inputs
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Handle edit toggle
    const handleEditToggle = () => {
        audio.play('click', { volume: 0.3 });
        setIsEditing(!isEditing);
        setError('');
        setSuccess('');
    };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSaving(true);
        try {
            // Play sound
            audio.play('quantum-pulse', { volume: 0.5 });
            // Update profile
            await updateProfile({ name, bio });
            // Set success message
            setSuccess('Quantum identity updated successfully');
            setIsEditing(false);
        }
        catch (err) {
            // Play error sound
            audio.play('error', { volume: 0.5 });
            // Set error message
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsSaving(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-900", children: _jsxs(motion.div, { className: "w-full max-w-2xl p-8 bg-gray-800 rounded-lg shadow-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-3xl font-extrabold text-white", children: "Quantum Identity" }), _jsx("button", { onClick: handleEditToggle, className: "px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: isEditing ? 'Cancel' : 'Edit Profile' })] }), error && (_jsx("div", { className: "p-3 mb-4 text-sm text-red-300 bg-red-900 rounded-md", children: error })), success && (_jsx("div", { className: "p-3 mb-4 text-sm text-green-300 bg-green-900 rounded-md", children: success })), isEditing ? (_jsx("form", { onSubmit: handleSubmit, children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-300", children: "Name" }), _jsx("input", { id: "name", name: "name", type: "text", value: name, onChange: (e) => setName(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "bio", className: "block text-sm font-medium text-gray-300", children: "Bio" }), _jsx("textarea", { id: "bio", name: "bio", rows: 4, value: bio, onChange: (e) => setBio(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isSaving, className: "flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: isSaving ? 'Saving...' : 'Save Changes' }) })] }) })) : (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-300", children: "Profile Information" }), _jsxs("div", { className: "mt-2 space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Name" }), _jsx("p", { className: "mt-1 text-lg text-white", children: user?.name || 'Not set' })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Email" }), _jsx("p", { className: "mt-1 text-lg text-white", children: user?.email })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Bio" }), _jsx("p", { className: "mt-1 text-lg text-white", children: user?.bio || 'Not set' })] })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-gray-300", children: "Quantum Statistics" }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-2", children: [_jsxs("div", { className: "p-4 bg-gray-700 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Coherence Level" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-blue-400", children: "98%" })] }), _jsxs("div", { className: "p-4 bg-gray-700 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Star Systems" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-green-400", children: "5" })] }), _jsxs("div", { className: "p-4 bg-gray-700 rounded-lg", children: [_jsx("p", { className: "text-sm font-medium text-gray-400", children: "Dimensional Shifts" }), _jsx("p", { className: "mt-1 text-2xl font-bold text-purple-400", children: "42" })] })] })] })] }))] }) }));
};
export default ProfileScreen;
