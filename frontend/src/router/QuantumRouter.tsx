/**
 * Quantum Router Component
 *
 * This component provides the main routing system for the QQ-Verse project,
 * maintaining quantum coherence during navigation between different dimensional spaces.
 *
 * @version 2.0.0
 */
import React, { Suspense, lazy, ReactNode } from 'react';
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
const QuantumVisualizationTestScreen = lazy(() => import('../screens/test/QuantumVisualizationTestScreen'));

// Loading component
const QuantumLoading: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg text-blue-500">Quantum Entanglement in Progress...</p>
        </div>
    </div>
);

interface TransitionWrapperProps {
    children: ReactNode;
    requiresAuth?: boolean;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children, requiresAuth = false }) => {
    const location = useLocation();
    const { state } = location;
    const transitionType = state?.transitionType || 'fade';

    const content = requiresAuth ? <PrivateRoute>{children}</PrivateRoute> : <>{children}</>;

    return (
        <RouteTransition transitionType={transitionType}>
            <Suspense fallback={<QuantumLoading />}>
                {content}
            </Suspense>
        </RouteTransition>
    );
};

export const QuantumRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TransitionWrapper><HubScreen /></TransitionWrapper>} />
                
                <Route path="/auth">
                    <Route path="login" element={<TransitionWrapper><LoginScreen /></TransitionWrapper>} />
                    <Route path="register" element={<TransitionWrapper><RegisterScreen /></TransitionWrapper>} />
                </Route>
                
                <Route path="/profile" element={<TransitionWrapper requiresAuth><ProfileScreen /></TransitionWrapper>} />
                <Route path="/settings" element={<TransitionWrapper requiresAuth><SettingsScreen /></TransitionWrapper>} />
                <Route path="/help" element={<TransitionWrapper><HelpScreen /></TransitionWrapper>} />
                <Route path="/test/quantum-visualization" element={<TransitionWrapper><QuantumVisualizationTestScreen /></TransitionWrapper>} />
                
                {/* Star system routes */}
                {routes
                    .filter(route => route.meta?.starSystem && !route.meta?.feature)
                    .map(route => (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={<TransitionWrapper requiresAuth><StarSystemScreen starSystem={route.meta?.starSystem} /></TransitionWrapper>}
                        />
                    ))}
                
                {/* Feature routes */}
                {routes
                    .filter(route => route.meta?.starSystem && route.meta?.feature)
                    .map(route => (
                        <Route 
                            key={route.path} 
                            path={`${route.meta?.starSystem}${route.path}`} 
                            element={<TransitionWrapper requiresAuth><FeatureScreen starSystem={route.meta?.starSystem} feature={route.meta?.feature} /></TransitionWrapper>}
                        />
                    ))}
                
                <Route path="*" element={<TransitionWrapper><NotFoundScreen /></TransitionWrapper>} />
            </Routes>
        </BrowserRouter>
    );
};

export default QuantumRouter;