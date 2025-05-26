import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: RegisterScreen.js
 * @version 2.0.0
 */
/**
 * Register Screen Component
 *
 * This component provides the registration interface for the QQ-Verse project,
 * allowing users to create a new quantum identity.
 *
 * @version 1.0.0
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { useQuantumRouter } from '../../router/useQuantumRouter';
import { useAudio } from '../../utils/CoherenceHelpers/useAudio';
/**
 * Register screen component
 */
const RegisterScreen = () => {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Get auth, router, and audio
    const { register } = useAuth();
    const { navigate } = useQuantumRouter();
    const audio = useAudio();
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Quantum entanglement failed: Passwords do not match');
            audio.play('error', { volume: 0.5 });
            return;
        }
        setIsLoading(true);
        try {
            // Play sound
            audio.play('quantum-pulse', { volume: 0.5 });
            // Attempt registration
            await register(name, email, password);
            // Navigate to hub on success
            navigate('/');
        }
        catch (err) {
            // Play error sound
            audio.play('error', { volume: 0.5 });
            // Set error message
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-900", children: _jsxs(motion.div, { className: "w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-extrabold text-white", children: "Create Quantum Identity" }), _jsx("p", { className: "mt-2 text-sm text-gray-400", children: "Register to access the QQ-Verse" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "p-3 text-sm text-red-300 bg-red-900 rounded-md", children: error })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-300", children: "Full Name" }), _jsx("input", { id: "name", name: "name", type: "text", autoComplete: "name", required: true, value: name, onChange: (e) => setName(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "Quantum Explorer" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300", children: "Email Address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "quantum@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-300", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "new-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-300", children: "Confirm Password" }), _jsx("input", { id: "confirmPassword", name: "confirmPassword", type: "password", autoComplete: "new-password", required: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isLoading, className: "flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: isLoading ? 'Creating Identity...' : 'Create Quantum Identity' }) }), _jsx("div", { className: "text-sm text-center", children: _jsx(Link, { to: "/auth/login", className: "font-medium text-blue-400 hover:text-blue-300", children: "Already have a quantum identity? Login" }) })] })] }) }));
};
export default RegisterScreen;
