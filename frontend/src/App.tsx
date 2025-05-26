import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { QuantumRouter } from './router/QuantumRouter';
import { AuthProvider } from './lib/AuthContext';
import { StarBackground } from './cosmos';
import { StardustCursor } from './components';
/**
 * App component - Root component for the QQ-Verse application
 * @returns {JSX.Element} The main application component
 */
export function App() {
    return (_jsxs("div", { className: "relative w-full min-h-screen bg-[#050714] overflow-hidden", children: [_jsx(StardustCursor, {}), _jsx(StarBackground, {}), _jsx("div", { className: "relative z-10", children: _jsx(AuthProvider, { children: _jsx(QuantumRouter, {}) }) })] }));
}
