/**
 * Private Route Component
 *
 * This component provides authentication protection for routes,
 * redirecting unauthenticated users to the login page.
 *
 * @version 2.0.0
 */
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

/**
 * Props for PrivateRoute component
 */
interface PrivateRouteProps {
    children: ReactNode;
}

/**
 * Private route component
 */
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    // Get authentication state and location
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // Render children if authenticated
    return <>{children}</>;
};

export default PrivateRoute;