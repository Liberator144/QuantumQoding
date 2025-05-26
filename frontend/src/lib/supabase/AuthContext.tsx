/**
 * Authentication Context Provider - Phase 3 Implementation
 * 
 * Provides authentication state management across the application.
 * Handles user sessions, authentication status, and provider management.
 * 
 * @version 1.0.0
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, authHelpers } from './client';
import { AuthSuccessPortal } from '../../core/authentication/wormhole/AuthSuccessPortal';

// Types
interface AuthContextType {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signInWithProvider: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<{ error: AuthError | null }>;
    refreshSession: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Authentication Provider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSuccessPortal, setShowSuccessPortal] = useState(false);
    const [authProvider, setAuthProvider] = useState<'google' | 'github' | 'supabase'>('supabase');

    // Initialize authentication state
    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const { session: initialSession } = await authHelpers.getSession();
                setSession(initialSession);
                setUser(initialSession?.user ?? null);
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session);
                
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);

                // Handle specific auth events
                switch (event) {
                    case 'SIGNED_IN':
                        console.log('User signed in:', session?.user);
                        // Show success portal for new sign-ins
                        if (session?.user) {
                            setShowSuccessPortal(true);
                        }
                        break;
                    case 'SIGNED_OUT':
                        console.log('User signed out');
                        break;
                    case 'TOKEN_REFRESHED':
                        console.log('Token refreshed');
                        break;
                    case 'USER_UPDATED':
                        console.log('User updated:', session?.user);
                        break;
                }
            }
        );

        // Cleanup subscription
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Authentication methods
    const signInWithProvider = async (provider: 'google' | 'github') => {
        setIsLoading(true);
        setAuthProvider(provider);
        try {
            const { error } = await authHelpers.signInWithProvider(provider);
            return { error };
        } catch (error) {
            console.error(`Error signing in with ${provider}:`, error);
            return { error: error as AuthError };
        } finally {
            setIsLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        setIsLoading(true);
        setAuthProvider('supabase');
        try {
            const { error } = await authHelpers.signInWithEmail(email, password);
            return { error };
        } catch (error) {
            console.error('Error signing in with email:', error);
            return { error: error as AuthError };
        } finally {
            setIsLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
        setIsLoading(true);
        try {
            const { error } = await authHelpers.signUpWithEmail(email, password, metadata);
            return { error };
        } catch (error) {
            console.error('Error signing up with email:', error);
            return { error: error as AuthError };
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            const { error } = await authHelpers.signOut();
            return { error };
        } catch (error) {
            console.error('Error signing out:', error);
            return { error: error as AuthError };
        } finally {
            setIsLoading(false);
        }
    };

    const refreshSession = async () => {
        try {
            const { data: { session }, error } = await supabase.auth.refreshSession();
            if (error) throw error;
            setSession(session);
            setUser(session?.user ?? null);
        } catch (error) {
            console.error('Error refreshing session:', error);
        }
    };

    // Computed values
    const isAuthenticated = !!user && !!session;

    // Context value
    const value: AuthContextType = {
        user,
        session,
        isLoading,
        isAuthenticated,
        signInWithProvider,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            
            {/* Authentication Success Portal */}
            <AuthSuccessPortal
                isVisible={showSuccessPortal}
                provider={authProvider}
                userName={user?.email || user?.user_metadata?.name || 'Quantum Explorer'}
                onComplete={() => setShowSuccessPortal(false)}
                duration={2500}
            />
        </AuthContext.Provider>
    );
};

export default AuthProvider;