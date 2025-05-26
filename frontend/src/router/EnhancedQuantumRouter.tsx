/**
 * Enhanced Quantum Router Component - Phase 1 Implementation
 *
 * Enhanced version of the router with MainLayout integration for improved navigation
 * to revolutionary components and test screens.
 *
 * @version 2.0.0
 */
import React, { Suspense, lazy, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { routes } from './routes';
import { RouteTransition } from './RouteTransition.tsx';
import { PrivateRoute } from './PrivateRoute.tsx';
import { MainLayout } from '../components/layout/MainLayout';

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
const AuthCallbackScreen = lazy(() => import('../screens/auth/AuthCallbackScreen'));

// Enhanced Loading component with quantum effects
const QuantumLoading: React.FC = () => (
    <div className="flex items-center justify-center w-full h-full min-h-screen bg-[#050714]">
        <div className="text-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-t-4 border-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-r-4 border-cyan-500 rounded-full animate-spin animate-reverse"></div>
            </div>
            <p className="mt-4 text-lg text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                Quantum Entanglement in Progress...
            </p>
            <div className="mt-2 text-sm text-gray-400">
                Initializing Revolutionary Components
            </div>
        </div>
    </div>
);

interface TransitionWrapperProps {
    children: ReactNode;
    requiresAuth?: boolean;
    showHeader?: boolean;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ 
    children, 
    requiresAuth = false, 
    showHeader = true 
}) => {
    const location = useLocation();
    const { state } = location;
    const transitionType = state?.transitionType || 'fade';

    const content = requiresAuth ? <PrivateRoute>{children}</PrivateRoute> : <>{children}</>;

    return (
        <RouteTransition transitionType={transitionType}>
            <Suspense fallback={<QuantumLoading />}>
                {showHeader ? (
                    <MainLayout>
                        {content}
                    </MainLayout>
                ) : (
                    content
                )}
            </Suspense>
        </RouteTransition>
    );
};

export const EnhancedQuantumRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Hub route - no header for immersive experience */}
                <Route 
                    path="/" 
                    element={
                        <TransitionWrapper showHeader={false}>
                            <HubScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Auth routes - no header */}
                <Route path="/auth/*">
                    <Route 
                        path="login" 
                        element={
                            <TransitionWrapper showHeader={false}>
                                <LoginScreen />
                            </TransitionWrapper>
                        } 
                    />
                    <Route 
                        path="register" 
                        element={
                            <TransitionWrapper showHeader={false}>
                                <RegisterScreen />
                            </TransitionWrapper>
                        } 
                    />
                    <Route 
                        path="callback" 
                        element={
                            <TransitionWrapper showHeader={false}>
                                <AuthCallbackScreen />
                            </TransitionWrapper>
                        } 
                    />
                </Route>
                
                {/* Profile route - with header */}
                <Route 
                    path="/profile" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <ProfileScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Settings route - with header */}
                <Route 
                    path="/settings" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <SettingsScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Help route - with header */}
                <Route 
                    path="/help" 
                    element={
                        <TransitionWrapper>
                            <HelpScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Test route - with header for navigation */}
                <Route 
                    path="/test/quantum-visualization" 
                    element={
                        <TransitionWrapper>
                            <QuantumVisualizationTestScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Star system routes - with header */}
                {routes
                    .filter(route => route.meta?.starSystem && !route.meta?.feature)
                    .map(route => (
                        <Route 
                            key={route.path} 
                            path={route.path} 
                            element={
                                <TransitionWrapper requiresAuth>
                                    <StarSystemScreen starSystem={route.meta?.starSystem} />
                                </TransitionWrapper>
                            }
                        />
                    ))}
                
                {/* Feature routes - with header */}
                {routes
                    .filter(route => route.meta?.starSystem && route.meta?.feature)
                    .map(route => (
                        <Route 
                            key={route.path} 
                            path={`${route.meta?.starSystem}${route.path}`} 
                            element={
                                <TransitionWrapper requiresAuth>
                                    <FeatureScreen 
                                        starSystem={route.meta?.starSystem} 
                                        feature={route.meta?.feature} 
                                    />
                                </TransitionWrapper>
                            }
                        />
                    ))}
                
                {/* 404 route - with header */}
                <Route 
                    path="*" 
                    element={
                        <TransitionWrapper>
                            <NotFoundScreen />
                        </TransitionWrapper>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
};

export default EnhancedQuantumRouter;