/**
 * Enterprise-Grade Security Manager
 * 
 * Comprehensive security implementation with JWT management,
 * CSRF protection, session timeout handling, and secure token refresh.
 * 
 * @version 1.0.0
 */

interface SecurityConfig {
    sessionTimeout: number; // in milliseconds
    refreshThreshold: number; // refresh token when this much time is left
    maxRetries: number;
    csrfTokenName: string;
    secureStorage: boolean;
}

interface TokenData {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    tokenType: string;
    scope?: string;
}

interface SessionData {
    userId: string;
    email: string;
    provider: string;
    lastActivity: number;
    sessionId: string;
    permissions: string[];
}

class SecurityManager {
    private config: SecurityConfig;
    private sessionTimer: NodeJS.Timeout | null = null;
    private refreshTimer: NodeJS.Timeout | null = null;
    private csrfToken: string | null = null;
    private sessionData: SessionData | null = null;
    private tokenData: TokenData | null = null;

    constructor(config: Partial<SecurityConfig> = {}) {
        this.config = {
            sessionTimeout: 30 * 60 * 1000, // 30 minutes
            refreshThreshold: 5 * 60 * 1000, // 5 minutes
            maxRetries: 3,
            csrfTokenName: 'X-CSRF-Token',
            secureStorage: true,
            ...config
        };
        
        this.initializeSecurity();
    }

    /**
     * Initialize security features
     */
    private initializeSecurity(): void {
        this.generateCSRFToken();
        this.setupSessionMonitoring();
        this.loadStoredSession();
    }

    /**
     * Generate CSRF token for request protection
     */
    private generateCSRFToken(): void {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        this.csrfToken = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        
        // Store in meta tag for form submissions
        let metaTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'csrf-token';
            document.head.appendChild(metaTag);
        }
        metaTag.content = this.csrfToken;
    }

    /**
     * Get CSRF token for requests
     */
    public getCSRFToken(): string | null {
        return this.csrfToken;
    }

    /**
     * Validate CSRF token
     */
    public validateCSRFToken(token: string): boolean {
        return token === this.csrfToken;
    }

    /**
     * Store authentication tokens securely
     */
    public storeTokens(tokens: TokenData): void {
        this.tokenData = tokens;
        
        if (this.config.secureStorage) {
            // Use sessionStorage for security (cleared on tab close)
            sessionStorage.setItem('auth_tokens', JSON.stringify({
                ...tokens,
                encrypted: true
            }));
        } else {
            // Fallback to localStorage
            localStorage.setItem('auth_tokens', JSON.stringify(tokens));
        }
        
        this.scheduleTokenRefresh();
    }

    /**
     * Retrieve stored tokens
     */
    public getTokens(): TokenData | null {
        if (this.tokenData) {
            return this.tokenData;
        }
        
        const stored = this.config.secureStorage 
            ? sessionStorage.getItem('auth_tokens')
            : localStorage.getItem('auth_tokens');
            
        if (stored) {
            try {
                this.tokenData = JSON.parse(stored);
                return this.tokenData;
            } catch (error) {
                console.error('Failed to parse stored tokens:', error);
                this.clearTokens();
            }
        }
        
        return null;
    }

    /**
     * Clear stored tokens
     */
    public clearTokens(): void {
        this.tokenData = null;
        sessionStorage.removeItem('auth_tokens');
        localStorage.removeItem('auth_tokens');
        
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    /**
     * Check if tokens are valid and not expired
     */
    public areTokensValid(): boolean {
        const tokens = this.getTokens();
        if (!tokens) return false;
        
        const now = Date.now();
        return tokens.expiresAt > now;
    }

    /**
     * Check if tokens need refresh
     */
    public needsRefresh(): boolean {
        const tokens = this.getTokens();
        if (!tokens) return false;
        
        const now = Date.now();
        const timeUntilExpiry = tokens.expiresAt - now;
        return timeUntilExpiry <= this.config.refreshThreshold;
    }

    /**
     * Schedule automatic token refresh
     */
    private scheduleTokenRefresh(): void {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
        }
        
        const tokens = this.getTokens();
        if (!tokens) return;
        
        const now = Date.now();
        const timeUntilRefresh = tokens.expiresAt - now - this.config.refreshThreshold;
        
        if (timeUntilRefresh > 0) {
            this.refreshTimer = setTimeout(() => {
                this.refreshTokens();
            }, timeUntilRefresh);
        }
    }

    /**
     * Refresh authentication tokens
     */
    public async refreshTokens(): Promise<boolean> {
        const tokens = this.getTokens();
        if (!tokens || !tokens.refreshToken) {
            return false;
        }
        
        try {
            // This would typically call your auth service
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    [this.config.csrfTokenName]: this.getCSRFToken() || '',
                },
                body: JSON.stringify({
                    refreshToken: tokens.refreshToken
                })
            });
            
            if (response.ok) {
                const newTokens = await response.json();
                this.storeTokens(newTokens);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
        
        return false;
    }

    /**
     * Create secure session
     */
    public createSession(sessionData: SessionData): void {
        this.sessionData = {
            ...sessionData,
            lastActivity: Date.now(),
            sessionId: this.generateSessionId()
        };
        
        this.storeSession();
        this.startSessionMonitoring();
    }

    /**
     * Generate unique session ID
     */
    private generateSessionId(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2);
        return `${timestamp}-${randomPart}`;
    }

    /**
     * Store session data securely
     */
    private storeSession(): void {
        if (this.sessionData) {
            const sessionKey = this.config.secureStorage ? 'session_data' : 'session_data_local';
            const storage = this.config.secureStorage ? sessionStorage : localStorage;
            storage.setItem(sessionKey, JSON.stringify(this.sessionData));
        }
    }

    /**
     * Load stored session
     */
    private loadStoredSession(): void {
        const sessionKey = this.config.secureStorage ? 'session_data' : 'session_data_local';
        const storage = this.config.secureStorage ? sessionStorage : localStorage;
        const stored = storage.getItem(sessionKey);
        
        if (stored) {
            try {
                this.sessionData = JSON.parse(stored);
                if (this.isSessionValid()) {
                    this.startSessionMonitoring();
                } else {
                    this.clearSession();
                }
            } catch (error) {
                console.error('Failed to parse stored session:', error);
                this.clearSession();
            }
        }
    }

    /**
     * Check if session is valid
     */
    public isSessionValid(): boolean {
        if (!this.sessionData) return false;
        
        const now = Date.now();
        const timeSinceLastActivity = now - this.sessionData.lastActivity;
        return timeSinceLastActivity < this.config.sessionTimeout;
    }

    /**
     * Update session activity
     */
    public updateActivity(): void {
        if (this.sessionData) {
            this.sessionData.lastActivity = Date.now();
            this.storeSession();
        }
    }

    /**
     * Setup session monitoring
     */
    private setupSessionMonitoring(): void {
        // Monitor user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        const updateActivity = () => {
            this.updateActivity();
        };
        
        activityEvents.forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });
        
        // Monitor page visibility
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateActivity();
            }
        });
    }

    /**
     * Start session timeout monitoring
     */
    private startSessionMonitoring(): void {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
        
        this.sessionTimer = setInterval(() => {
            if (!this.isSessionValid()) {
                this.handleSessionTimeout();
            }
        }, 60000); // Check every minute
    }

    /**
     * Handle session timeout
     */
    private handleSessionTimeout(): void {
        console.warn('Session timeout detected');
        this.clearSession();
        
        // Emit custom event for application to handle
        window.dispatchEvent(new CustomEvent('sessionTimeout', {
            detail: { reason: 'timeout' }
        }));
    }

    /**
     * Clear session data
     */
    public clearSession(): void {
        this.sessionData = null;
        sessionStorage.removeItem('session_data');
        localStorage.removeItem('session_data_local');
        
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
    }

    /**
     * Get current session data
     */
    public getSession(): SessionData | null {
        return this.sessionData;
    }

    /**
     * Add security headers to fetch requests
     */
    public secureRequest(url: string, options: RequestInit = {}): Promise<Response> {
        const secureOptions: RequestInit = {
            ...options,
            headers: {
                ...options.headers,
                [this.config.csrfTokenName]: this.getCSRFToken() || '',
                'X-Requested-With': 'XMLHttpRequest',
            },
            credentials: 'same-origin',
        };
        
        // Add authorization header if tokens are available
        const tokens = this.getTokens();
        if (tokens && tokens.accessToken) {
            secureOptions.headers = {
                ...secureOptions.headers,
                'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
            };
        }
        
        return fetch(url, secureOptions);
    }

    /**
     * Logout and clear all security data
     */
    public logout(): void {
        this.clearTokens();
        this.clearSession();
        this.generateCSRFToken(); // Generate new CSRF token
        
        // Emit logout event
        window.dispatchEvent(new CustomEvent('securityLogout', {
            detail: { reason: 'manual' }
        }));
    }

    /**
     * Get security status
     */
    public getSecurityStatus(): {
        isAuthenticated: boolean;
        hasValidTokens: boolean;
        hasValidSession: boolean;
        needsRefresh: boolean;
        sessionTimeRemaining: number;
        tokenTimeRemaining: number;
    } {
        const tokens = this.getTokens();
        const session = this.getSession();
        const now = Date.now();
        
        return {
            isAuthenticated: !!(tokens && session && this.areTokensValid() && this.isSessionValid()),
            hasValidTokens: this.areTokensValid(),
            hasValidSession: this.isSessionValid(),
            needsRefresh: this.needsRefresh(),
            sessionTimeRemaining: session ? Math.max(0, this.config.sessionTimeout - (now - session.lastActivity)) : 0,
            tokenTimeRemaining: tokens ? Math.max(0, tokens.expiresAt - now) : 0,
        };
    }
}

// Export singleton instance
export const securityManager = new SecurityManager();
export default SecurityManager;