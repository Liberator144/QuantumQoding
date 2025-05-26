import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: LoginScreen.js
 * @version 2.0.0
 */
/**
 * Login Screen Component
 *
 * This component provides the login interface for the QQ-Verse project,
 * allowing users to authenticate and access the quantum universe.
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
 * Login screen component
 */
const LoginScreen = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // Get auth, router, and audio
    const { login } = useAuth();
    const { navigate } = useQuantumRouter();
    const audio = useAudio();
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // Play sound
            audio.play('quantum-pulse', { volume: 0.5 });
            // Attempt login
            await login(email, password);
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
    return (_jsx("div", { className: "flex items-center justify-center w-full h-full bg-gray-900", children: _jsxs(motion.div, { className: "w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-extrabold text-white", children: "Quantum Portal Access" }), _jsx("p", { className: "mt-2 text-sm text-gray-400", children: "Enter your credentials to access the QQ-Verse" })] }), _jsxs("form", { className: "mt-8 space-y-6", onSubmit: handleSubmit, children: [error && (_jsx("div", { className: "p-3 text-sm text-red-300 bg-red-900 rounded-md", children: error })), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-300", children: "Email Address" }), _jsx("input", { id: "email", name: "email", type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "quantum@example.com" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-300", children: "Password" }), _jsx("input", { id: "password", name: "password", type: "password", autoComplete: "current-password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "block w-full px-3 py-2 mt-1 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" })] })] }), _jsx("div", { children: _jsx("button", { type: "submit", disabled: isLoading, className: "flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50", children: isLoading ? 'Authenticating...' : 'Access Quantum Portal' }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: "text-sm", children: _jsx(Link, { to: "/auth/register", className: "font-medium text-blue-400 hover:text-blue-300", children: "Create new quantum identity" }) }), _jsx("div", { className: "text-sm", children: _jsx("a", { href: "#", className: "font-medium text-blue-400 hover:text-blue-300", children: "Forgot password?" }) })] })] })] }) }));
};
export default LoginScreen;
