import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
/**
 * Private route component
 */
export const PrivateRoute = ({ children }) => {
    // Get authentication state and location
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/auth/login", state: { from: location }, replace: true });
    }
    // Render children if authenticated
    return _jsx(_Fragment, { children: children });
};
export default PrivateRoute;
