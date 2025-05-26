import { jsx as _jsx } from "react/jsx-runtime";
/**
 * TypeScript Migration
 * Migrated from: AuthContext.js
 * @version 2.0.0
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from './authService';
// Create auth context with default values
const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    tokens: null,
    loading: true,
    error: null,
    login: async () => { },
    logout: () => { },
    register: async () => { },
    updateUser: async () => { },
    refreshTokens: async () => { },
    clearError: () => { },
});
// Auth provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Initialize auth state from localStorage
    useEffect(() => {
        try {
            const { user, tokens } = authService.initialize();
            setUser(user);
            setTokens(tokens);
        }
        catch (err) {
            console.error('Failed to initialize auth state', err);
            setError('Failed to initialize authentication');
        }
        finally {
            setLoading(false);
        }
    }, []);
    // Set up token refresh interval
    useEffect(() => {
        if (!tokens)
            return;
        // Check if token needs refresh
        const checkTokenExpiry = async () => {
            if (authService.isTokenExpired()) {
                try {
                    const newTokens = await authService.refreshTokens();
                    setTokens(newTokens);
                }
                catch (err) {
                    // If refresh fails, log the user out
                    console.error('Token refresh failed', err);
                    handleLogout();
                }
            }
        };
        // Run the check immediately
        checkTokenExpiry();
        // Set up interval to check token expiry
        const intervalId = setInterval(checkTokenExpiry, 60000); // Check every minute
        // Clear interval on unmount
        return () => clearInterval(intervalId);
    }, [tokens]);
    // Login handler
    const handleLogin = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const { user, tokens } = await authService.login(credentials);
            setUser(user);
            setTokens(tokens);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // Logout handler
    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setTokens(null);
    };
    // Register handler
    const handleRegister = async (data) => {
        try {
            setLoading(true);
            setError(null);
            const { user, tokens } = await authService.register(data);
            setUser(user);
            setTokens(tokens);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Registration failed';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // Update user handler
    const handleUpdateUser = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const updatedUser = await authService.updateUser(userData);
            setUser(updatedUser);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'User update failed';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // Token refresh handler
    const handleRefreshTokens = async () => {
        try {
            setLoading(true);
            setError(null);
            const newTokens = await authService.refreshTokens();
            setTokens(newTokens);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Token refresh failed';
            setError(errorMessage);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // Clear error
    const handleClearError = () => {
        setError(null);
    };
    // Auth context value
    const value = {
        isAuthenticated: !!user && !!tokens,
        user,
        tokens,
        loading,
        error,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        updateUser: handleUpdateUser,
        refreshTokens: handleRefreshTokens,
        clearError: handleClearError,
    };
    return (_jsx(AuthContext.Provider, { value: value, children: children }));
};
// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
