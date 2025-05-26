/**
 * Supabase Client Configuration - Phase 3 Implementation
 * 
 * Configures the Supabase client for authentication and database operations.
 * Supports Google, GitHub, and email/password authentication.
 * 
 * @version 1.0.0
 */
import { createClient } from '@supabase/supabase-js';

// Environment variables for Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Configure authentication settings
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Redirect URLs for OAuth providers
        redirectTo: `${window.location.origin}/auth/callback`
    }
});

// Authentication provider configurations
export const authProviders = {
    google: {
        provider: 'google' as const,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'email profile'
        }
    },
    github: {
        provider: 'github' as const,
        options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            scopes: 'user:email'
        }
    }
};

// Authentication helper functions
export const authHelpers = {
    // Sign in with OAuth provider
    signInWithProvider: async (provider: 'google' | 'github') => {
        const { data, error } = await supabase.auth.signInWithOAuth(authProviders[provider]);
        return { data, error };
    },

    // Sign in with email and password
    signInWithEmail: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return { data, error };
    },

    // Sign up with email and password
    signUpWithEmail: async (email: string, password: string, metadata?: any) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        return { data, error };
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
    },

    // Get current session
    getSession: async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        return { session, error };
    },

    // Get current user
    getUser: async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    }
};

export default supabase;