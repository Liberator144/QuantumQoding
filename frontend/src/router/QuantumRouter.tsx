/**
 * Quantum Router Component
 * 
 * This component provides the main routing system for the QQ-Verse project,
 * maintaining quantum coherence during navigation between different dimensional spaces.
 * 
 * @version 1.0.0
 */

import React, { Suspense, lazy } from 'react';
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

// Lazy load star system screens
const StarSystemScreen = lazy(() => import('../screens/star-systems/StarSystemScreen'));
const FeatureScreen = lazy(() => import('../screens/star-systems/FeatureScreen'));

// Loading component
const QuantumLoading = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-blue-500">Quantum Entanglement in Progress...</p>
    </div>
  </div>
);

/**
 * Route transition wrapper
 */
const TransitionWrapper: React.FC<{ requiresAuth?: boolean }> = ({ 
  children, 
  requiresAuth = false 
}) => {
  const location = useLocation();
  const { state } = location;
  const transitionType = state?.transitionType || 'fade';
  
  // Wrap with private route if authentication is required
  const content = requiresAuth ? (
    <PrivateRoute>{children}</PrivateRoute>
  ) : (
    <>{children}</>
  );
  
  // Wrap with transition
  return (
    <RouteTransition transitionType={transitionType}>
      <Suspense fallback={<QuantumLoading />}>
        {content}
      </Suspense>
    </RouteTransition>
  );
};

/**
 * Quantum router component
 */
export const QuantumRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Hub route */}
        <Route 
          path="/" 
          element={
            <TransitionWrapper>
              <HubScreen />
            </TransitionWrapper>
          } 
        />
        
        {/* Auth routes */}
        <Route path="/auth">
          <Route 
            path="login" 
            element={
              <TransitionWrapper>
                <LoginScreen />
              </TransitionWrapper>
            } 
          />
          <Route 
            path="register" 
            element={
              <TransitionWrapper>
                <RegisterScreen />
              </TransitionWrapper>
            } 
          />
        </Route>
        
        {/* Profile route */}
        <Route 
          path="/profile" 
          element={
            <TransitionWrapper requiresAuth>
              <ProfileScreen />
            </TransitionWrapper>
          } 
        />
        
        {/* Settings route */}
        <Route 
          path="/settings" 
          element={
            <TransitionWrapper requiresAuth>
              <SettingsScreen />
            </TransitionWrapper>
          } 
        />
        
        {/* Help route */}
        <Route 
          path="/help" 
          element={
            <TransitionWrapper>
              <HelpScreen />
            </TransitionWrapper>
          } 
        />
        
        {/* Star system routes */}
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
        
        {/* Feature routes */}
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
        
        {/* 404 route */}
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

export default QuantumRouter;