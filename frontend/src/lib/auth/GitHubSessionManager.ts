/**
 * GitHub Session Manager - Revolutionary Implementation
 * Advanced session management for GitHub authentication with logout and monitoring
 * @version 1.0.0
 */

interface GitHubSession {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    user: {
        id: string;
        login: string;
        name: string;
        email: string;
        avatar_url: string;
    };
    provider: 'github';
    sessionId: string;
    lastActivity: number;
}

interface SessionConfig {
    sessionTimeout: number;
    refreshThreshold: number;
    maxInactivity: number;
}

export class GitHubSessionManager {
    private session: GitHubSession | null = null;
    private sessionTimer: NodeJS.Timeout | null = null;
    private activityTimer: NodeJS.Timeout | null = null;
    
    private readonly config: SessionConfig = {
        sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
        refreshThreshold: 5 * 60 * 1000, // 5 minutes
        maxInactivity: 30 * 60 * 1000 // 30 minutes
    };

    private readonly STORAGE_KEY = 'github_session';
    private readonly ACTIVITY_KEY = 'github_last_activity';

    constructor() {
        this.initializeSession();
        this.setupActivityMonitoring();
    }

    private initializeSession(): void {
        try {
            const storedSession = localStorage.getItem(this.STORAGE_KEY);
            if (storedSession) {
                const session = JSON.parse(storedSession) as GitHubSession;
                if (this.isSessionValid(session)) {
                    this.session = session;
                    this.startSessionMonitoring();
                } else {
                    this.clearStoredSession();
                }
            }
        } catch (error) {
            console.error('Error initializing GitHub session:', error);
            this.clearStoredSession();
        }
    }

    public createSession(sessionData: Omit<GitHubSession, 'sessionId' | 'lastActivity' | 'provider'>): void {
        this.session = {
            ...sessionData,
            provider: 'github',
            sessionId: this.generateSessionId(),
            lastActivity: Date.now()
        };

        this.storeSession();
        this.startSessionMonitoring();
        this.updateActivity();

        window.dispatchEvent(new CustomEvent('githubSessionCreated', {
            detail: { user: this.session.user }
        }));
    }

    public getSession(): GitHubSession | null {
        if (this.session && this.isSessionValid(this.session)) {
            this.updateActivity();
            return this.session;
        }
        return null;
    }

    public isAuthenticated(): boolean {
        return this.getSession() !== null;
    }

    public getCurrentUser() {
        const session = this.getSession();
        return session?.user || null;
    }

    public async logout(): Promise<void> {
        try {
            if (this.session?.accessToken) {
                await this.revokeGitHubToken(this.session.accessToken);
            }
        } catch (error) {
            console.warn('Failed to revoke GitHub token:', error);
        }

        this.clearSession();
        window.dispatchEvent(new CustomEvent('githubSessionEnded', {
            detail: { reason: 'logout' }
        }));
    }

    public async refreshSession(): Promise<boolean> {
        if (!this.session) return false;

        try {
            const timeUntilExpiry = this.session.expiresAt - Date.now();
            if (timeUntilExpiry > this.config.refreshThreshold) {
                return true;
            }

            const refreshed = await this.refreshGitHubToken();
            if (refreshed) {
                this.storeSession();
                return true;
            }

            await this.logout();
            return false;
        } catch (error) {
            console.error('Error refreshing GitHub session:', error);
            await this.logout();
            return false;
        }
    }

    public updateActivity(): void {
        if (this.session) {
            this.session.lastActivity = Date.now();
            localStorage.setItem(this.ACTIVITY_KEY, Date.now().toString());
        }
    }

    private isSessionValid(session: GitHubSession): boolean {
        const now = Date.now();
        if (session.expiresAt <= now) return false;
        const inactivityTime = now - session.lastActivity;
        if (inactivityTime > this.config.maxInactivity) return false;
        return true;
    }

    private generateSessionId(): string {
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2);
        return `github-${timestamp}-${randomPart}`;
    }

    private storeSession(): void {
        if (this.session) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.session));
        }
    }

    private clearStoredSession(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.ACTIVITY_KEY);
    }

    private clearSession(): void {
        this.session = null;
        this.clearStoredSession();
        this.stopSessionMonitoring();
    }

    private startSessionMonitoring(): void {
        this.stopSessionMonitoring();
        this.sessionTimer = setInterval(() => {
            if (this.session && !this.isSessionValid(this.session)) {
                this.handleSessionExpiry();
            }
        }, 60 * 1000);
    }

    private stopSessionMonitoring(): void {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        if (this.activityTimer) {
            clearInterval(this.activityTimer);
            this.activityTimer = null;
        }
    }

    private setupActivityMonitoring(): void {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        const activityHandler = () => this.updateActivity();
        events.forEach(event => {
            document.addEventListener(event, activityHandler, { passive: true });
        });

        this.activityTimer = setInterval(() => {
            const lastActivity = localStorage.getItem(this.ACTIVITY_KEY);
            if (lastActivity && this.session) {
                this.session.lastActivity = parseInt(lastActivity);
            }
        }, 5000);
    }

    private handleSessionExpiry(): void {
        console.log('GitHub session expired');
        this.clearSession();
        window.dispatchEvent(new CustomEvent('githubSessionExpired', {
            detail: { reason: 'expired' }
        }));
    }

    private async revokeGitHubToken(token: string): Promise<void> {
        try {
            const response = await fetch('/api/auth/github/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to revoke token');
        } catch (error) {
            console.warn('Token revocation failed:', error);
        }
    }

    private async refreshGitHubToken(): Promise<boolean> {
        if (!this.session?.refreshToken) return false;

        try {
            const response = await fetch('/api/auth/github/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken: this.session.refreshToken })
            });

            if (!response.ok) return false;
            const data = await response.json();
            
            if (this.session) {
                this.session.accessToken = data.accessToken;
                this.session.expiresAt = data.expiresAt;
                if (data.refreshToken) {
                    this.session.refreshToken = data.refreshToken;
                }
            }
            return true;
        } catch (error) {
            console.error('Token refresh failed:', error);
            return false;
        }
    }

    public destroy(): void {
        this.stopSessionMonitoring();
    }
}

export const gitHubSessionManager = new GitHubSessionManager();