/**
 * Modular Quantum Router - Enhanced version with star system modularity
 * Preserves existing design while adding advanced modular capabilities
 * 
 * @version 3.0.0 - Modular Star System Architecture
 */
import React, { Suspense, lazy, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import { RouteTransition } from './RouteTransition';
import { PrivateRoute } from './PrivateRoute';
import { MainLayout } from '../components/layout/MainLayout';

// Existing screens (preserved)
const HubScreen = lazy(() => import('../screens/hub/HubScreen'));
const EnhancedLoginScreen = lazy(() => import('../screens/auth/EnhancedLoginScreen'));
const RegisterScreen = lazy(() => import('../screens/auth/RegisterScreen'));
const ProfileScreen = lazy(() => import('../screens/profile/ProfileScreen'));
const SettingsScreen = lazy(() => import('../screens/settings/SettingsScreen'));
const HelpScreen = lazy(() => import('../screens/help/HelpScreen'));
const NotFoundScreen = lazy(() => import('../screens/NotFoundScreen'));
const AuthCallbackScreen = lazy(() => import('../screens/auth/AuthCallbackScreen'));

// Modular Star System Pages (implemented)
const QQDataVersePage = lazy(() => import('../pages/star-systems/QQDataVerse/QQDataVersePage'));
const QQMCPVersePage = lazy(() => import('../pages/star-systems/QQMCPVerse/QQMCPVersePage'));
const QQAkashaPage = lazy(() => import('../pages/star-systems/QQAkasha/QQAkashaPage'));
const QQUnityPortalPage = lazy(() => import('../pages/star-systems/QQUnityPortal/QQUnityPortalPage'));
const QQTaskVersePage = lazy(() => import('../pages/star-systems/QQTaskVerse/QQTaskVersePage'));
const QQQuantumForgePage = lazy(() => import('../pages/star-systems/QQQuantumForge/QQQuantumForgePage'));
const QQNexusHubPage = lazy(() => import('../pages/star-systems/QQNexusHub/QQNexusHubPage'));
const QQEvolveCoreePage = lazy(() => import('../pages/star-systems/QQEvolveCore/QQEvolveCoreePage'));
const QQHarmonyVersePage = lazy(() => import('../pages/star-systems/QQHarmonyVerse/QQHarmonyVersePage'));

// Placeholder for not-yet-implemented stars (none remaining)
const ComingSoonPage = lazy(() => import('../components/ComingSoonPage'));

// Star System Loader for performance optimization
const StarSystemLoader: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Suspense fallback={<QuantumLoading />}>
        {children}
    </Suspense>
);

// Enhanced Loading component with quantum effects (preserved design)
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
                Initializing Modular Star Systems
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

export const ModularQuantumRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Hub route - preserved existing design */}
                <Route 
                    path="/" 
                    element={
                        <TransitionWrapper showHeader={true}>
                            <HubScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Auth routes - preserved existing design */}
                <Route path="/auth/*">
                    <Route
                        path="login"
                        element={
                            <TransitionWrapper showHeader={false}>
                                <EnhancedLoginScreen />
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
                
                {/* Profile, Settings, Help routes - preserved */}
                <Route 
                    path="/profile" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <ProfileScreen />
                        </TransitionWrapper>
                    } 
                />
                
                <Route 
                    path="/settings" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <SettingsScreen />
                        </TransitionWrapper>
                    } 
                />
                
                <Route 
                    path="/help" 
                    element={
                        <TransitionWrapper>
                            <HelpScreen />
                        </TransitionWrapper>
                    } 
                />
                
                {/* Modular Star System Routes - Enhanced Architecture */}
                
                {/* Inner Orbit Stars */}
                <Route 
                    path="/dataverse/*" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQDataVersePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    } 
                />
                
                <Route 
                    path="/mcpverse/*" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQMCPVersePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    } 
                />
                
                <Route 
                    path="/akasha/*" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQAkashaPage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    } 
                />
                
                {/* Middle Orbit Stars */}
                <Route
                    path="/taskverse/*"
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQTaskVersePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    }
                />

                <Route
                    path="/quantumforge/*"
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQQuantumForgePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    }
                />

                <Route
                    path="/nexushub/*"
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQNexusHubPage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    }
                />

                {/* Outer Orbit Stars */}
                <Route
                    path="/evolvecore/*"
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQEvolveCoreePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    }
                />

                <Route
                    path="/harmonyverse/*"
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQHarmonyVersePage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    }
                />
                
                <Route 
                    path="/unity-portal/*" 
                    element={
                        <TransitionWrapper requiresAuth>
                            <StarSystemLoader>
                                <QQUnityPortalPage />
                            </StarSystemLoader>
                        </TransitionWrapper>
                    } 
                />
                
                {/* 404 route - preserved */}
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

export default ModularQuantumRouter;
