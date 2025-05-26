import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Quantum Router Component
 *
 * This component provides the main routing system for the QQ-Verse project,
 * maintaining quantum coherence during navigation between different dimensional spaces.
 *
 * @version 2.0.0
 */
import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { RouteTransition } from './RouteTransition';
import { PrivateRoute } from './PrivateRoute';
// Lazy load screens
const HubScreen = lazy(() => import('../screens/hub/HubScreen'));
const LoginScreen = lazy(() => import('../screens/auth/LoginScreen'));
const RegisterScreen = lazy(() => import('../screens/auth/RegisterScreen'));
const ProfileScreen = lazy(() => import('../screens/profile/ProfileScreen'));
const SettingsScreen = lazy(() => import('../screens/settings/SettingsScreen'));
const HelpScreen = lazy(() => import('../screens/help/HelpScreen'));
const NotFoundScreen = lazy(() => import('../screens/NotFoundScreen'));
const StarSystemScreen = lazy(() => import('../screens/star-systems/StarSystemScreen'));
const FeatureScreen = lazy(() => import('../screens/star-systems/FeatureScreen'));
// Loading component
const QuantumLoading = () => (_jsx("div", { className: "flex items-center justify-center w-full h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin" }), _jsx("p", { className: "mt-4 text-lg text-blue-500", children: "Quantum Entanglement in Progress..." })] }) }));
const TransitionWrapper = ({ children, requiresAuth = false }) => {
    const location = useLocation();
    const { state } = location;
    const transitionType = state?.transitionType || 'fade';
    const content = requiresAuth ? _jsx(PrivateRoute, { children: children }) : _jsx(_Fragment, { children: children });
    return (_jsx(RouteTransition, { transitionType: transitionType, children: _jsx(Suspense, { fallback: _jsx(QuantumLoading, {}), children: content }) }));
};
export const QuantumRouter = () => {
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(TransitionWrapper, { children: _jsx(HubScreen, {}) }) }), _jsxs(Route, { path: "/auth", children: [_jsx(Route, { path: "login", element: _jsx(TransitionWrapper, { children: _jsx(LoginScreen, {}) }) }), _jsx(Route, { path: "register", element: _jsx(TransitionWrapper, { children: _jsx(RegisterScreen, {}) }) })] }), _jsx(Route, { path: "/profile", element: _jsx(TransitionWrapper, { requiresAuth: true, children: _jsx(ProfileScreen, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(TransitionWrapper, { requiresAuth: true, children: _jsx(SettingsScreen, {}) }) }), _jsx(Route, { path: "/help", element: _jsx(TransitionWrapper, { children: _jsx(HelpScreen, {}) }) }), routes
                    .filter(route => route.meta?.starSystem && !route.meta?.feature)
                    .map(route => (_jsx(Route, { path: route.path, element: _jsx(TransitionWrapper, { requiresAuth: true, children: _jsx(StarSystemScreen, { starSystem: route.meta?.starSystem }) }) }, route.path))), routes
                    .filter(route => route.meta?.starSystem && route.meta?.feature)
                    .map(route => (_jsx(Route, { path: `${route.meta?.starSystem}${route.path}`, element: _jsx(TransitionWrapper, { requiresAuth: true, children: _jsx(FeatureScreen, { starSystem: route.meta?.starSystem, feature: route.meta?.feature }) }) }, route.path))), _jsx(Route, { path: "*", element: _jsx(TransitionWrapper, { children: _jsx(NotFoundScreen, {}) }) })] }) }));
};
export default QuantumRouter;
