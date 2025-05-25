/**
 * Security Manager
 *
 * Manages security-related functionality including authentication, authorization, and encryption.
 *
 * @version 1.0.0
 */

const { AuthenticationProvider } = require('./authentication/AuthenticationProvider');
const { AuthorizationProvider } = require('./authorization/AuthorizationProvider');
const { EncryptionManager } = require('./encryption/EncryptionManager');
const { MultiFactorAuth } = require('./authentication/MultiFactorAuth');
const { EventEmitter } = require('events');

/**
 * Security Manager
 *
 * Manages security-related functionality including authentication, authorization, and encryption.
 */
class SecurityManager extends EventEmitter {
  /**
   * Create a new SecurityManager instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    super();

    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Strict mode
      strictMode: true,

      // Merge with provided options
      ...options,
    };

    // Authentication provider
    this.authProvider = this.config.authProvider || new AuthenticationProvider(this.config);

    // Authorization provider
    this.authzProvider = this.config.authzProvider || new AuthorizationProvider(this.config);

    // Encryption manager
    this.encryptionManager = this.config.encryptionManager || new EncryptionManager(this.config);

    // Multi-factor authentication
    this.multiFactorAuth = this.config.multiFactorAuth || new MultiFactorAuth(this.config);

    // Initialize
    this._init();
  }

  /**
   * Initialize the security manager
   * @private
   */
  _init() {
    this.log('Initializing Security Manager');

    // Set up database if provided
    if (this.config.database) {
      this.setDatabase(this.config.database);
    }

    this.log('Security Manager initialized');
  }

  /**
   * Set database
   * @param {Object} database - Database instance
   * @returns {SecurityManager} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;

    // Set database for components
    if (this.authProvider && typeof this.authProvider.setDatabase === 'function') {
      this.authProvider.setDatabase(database);
    }

    if (this.authzProvider && typeof this.authzProvider.setDatabase === 'function') {
      this.authzProvider.setDatabase(database);
    }

    if (this.multiFactorAuth && typeof this.multiFactorAuth.setDatabase === 'function') {
      this.multiFactorAuth.setDatabase(database);
    }

    this.log('Database set');

    return this;
  }

  /**
   * Authenticate user
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} Authentication result
   */
  async authenticate(username, password) {
    try {
      const result = await this.authProvider.authenticate(username, password);

      if (result.success) {
        this.log(`User authenticated: ${username}`);
        this.emit('user-authenticated', { username });
      } else {
        this.log(`Authentication failed: ${username}`);
        this.emit('authentication-failed', { username, error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`Authentication error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Validate token
   * @param {string} token - Token to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateToken(token) {
    try {
      const result = await this.authProvider.validateToken(token);

      if (!result.valid) {
        this.log(`Token validation failed: ${result.error}`);
        this.emit('token-validation-failed', { error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`Token validation error: ${error.message}`);
      this.emit('error', error);

      return {
        valid: false,
        error: error.message,
      };
    }
  }

  /**
   * Refresh token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} Refresh result
   */
  async refreshToken(refreshToken) {
    try {
      const result = await this.authProvider.refreshToken(refreshToken);

      if (result.success) {
        this.log('Token refreshed');
        this.emit('token-refreshed');
      } else {
        this.log(`Token refresh failed: ${result.error}`);
        this.emit('token-refresh-failed', { error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`Token refresh error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Logout user
   * @param {string} token - Token to revoke
   * @returns {Promise<Object>} Logout result
   */
  async logout(token) {
    try {
      const result = await this.authProvider.logout(token);

      if (result.success) {
        this.log('User logged out');
        this.emit('user-logged-out');
      } else {
        this.log(`Logout failed: ${result.error}`);
        this.emit('logout-failed', { error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`Logout error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Authorize user
   * @param {Object} user - User object
   * @param {string} action - Action to authorize
   * @param {string} resource - Resource to access
   * @returns {Promise<Object>} Authorization result
   */
  async authorize(user, action, resource) {
    try {
      const result = await this.authzProvider.authorize(user, action, resource);

      if (!result.authorized) {
        this.log(`Authorization failed: ${user.username}, ${action}, ${resource}`);
        this.emit('authorization-failed', { user: user.username, action, resource });
      }

      return result;
    } catch (error) {
      this.log(`Authorization error: ${error.message}`);
      this.emit('error', error);

      return {
        authorized: false,
        error: error.message,
      };
    }
  }

  /**
   * Check if user has permission
   * @param {Object} user - User object
   * @param {string} action - Action to check
   * @param {string} resource - Resource to access
   * @returns {Promise<boolean>} True if user has permission
   */
  async hasPermission(user, action, resource) {
    try {
      return await this.authzProvider.hasPermission(user, action, resource);
    } catch (error) {
      this.log(`Permission check error: ${error.message}`);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Get user roles
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User roles
   */
  async getRoles(userId) {
    try {
      return await this.authzProvider.getRoles(userId);
    } catch (error) {
      this.log(`Get roles error: ${error.message}`);
      this.emit('error', error);
      return [];
    }
  }

  /**
   * Get user permissions
   * @param {string} userId - User ID
   * @returns {Promise<Array>} User permissions
   */
  async getPermissions(userId) {
    try {
      return await this.authzProvider.getPermissions(userId);
    } catch (error) {
      this.log(`Get permissions error: ${error.message}`);
      this.emit('error', error);
      return [];
    }
  }

  /**
   * Encrypt data
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data
   */
  encrypt(data) {
    try {
      return this.encryptionManager.encrypt(data);
    } catch (error) {
      this.log(`Encryption error: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Decrypt data
   * @param {string} data - Data to decrypt
   * @returns {string} Decrypted data
   */
  decrypt(data) {
    try {
      return this.encryptionManager.decrypt(data);
    } catch (error) {
      this.log(`Decryption error: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Hash data
   * @param {string} data - Data to hash
   * @returns {Promise<string>} Hashed data
   */
  async hash(data) {
    try {
      return await this.encryptionManager.hash(data);
    } catch (error) {
      this.log(`Hashing error: ${error.message}`);
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Verify hash
   * @param {string} data - Data to verify
   * @param {string} hash - Hash to compare
   * @returns {Promise<boolean>} True if hash matches
   */
  async verify(data, hash) {
    try {
      return await this.encryptionManager.verify(data, hash);
    } catch (error) {
      this.log(`Verification error: ${error.message}`);
      this.emit('error', error);
      return false;
    }
  }

  /**
   * Enable multi-factor authentication for user
   * @param {string} userId - User ID
   * @param {string} method - MFA method (totp, sms, email, biometric, hardware)
   * @param {Object} options - Method-specific options
   * @returns {Promise<Object>} Enablement result
   */
  async enableMFA(userId, method, options = {}) {
    try {
      const result = await this.multiFactorAuth.enableMFA(userId, method, options);

      if (result.success) {
        this.log(`MFA enabled for user: ${userId}, method: ${method}`);
        this.emit('mfa-enabled', { userId, method });
      } else {
        this.log(`MFA enablement failed: ${result.error}`);
        this.emit('mfa-enablement-failed', { userId, method, error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`MFA enablement error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Disable multi-factor authentication for user
   * @param {string} userId - User ID
   * @param {string} method - MFA method (totp, sms, email, biometric, hardware)
   * @returns {Promise<Object>} Disablement result
   */
  async disableMFA(userId, method) {
    try {
      const result = await this.multiFactorAuth.disableMFA(userId, method);

      if (result.success) {
        this.log(`MFA disabled for user: ${userId}, method: ${method}`);
        this.emit('mfa-disabled', { userId, method });
      } else {
        this.log(`MFA disablement failed: ${result.error}`);
        this.emit('mfa-disablement-failed', { userId, method, error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`MFA disablement error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verify multi-factor authentication code
   * @param {string} userId - User ID
   * @param {string} method - MFA method (totp, sms, email, biometric, hardware, backup)
   * @param {string} code - MFA code
   * @returns {Promise<Object>} Verification result
   */
  async verifyMFA(userId, method, code) {
    try {
      const result = await this.multiFactorAuth.verifyMFA(userId, method, code);

      if (result.success) {
        this.log(`MFA verified for user: ${userId}, method: ${method}`);
        this.emit('mfa-verified', { userId, method });
      } else {
        this.log(`MFA verification failed: ${result.error}`);
        this.emit('mfa-verification-failed', { userId, method, error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`MFA verification error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate backup codes for user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Generation result
   */
  async generateBackupCodes(userId) {
    try {
      const result = await this.multiFactorAuth.generateBackupCodes(userId);

      if (result.success) {
        this.log(`Backup codes generated for user: ${userId}`);
        this.emit('backup-codes-generated', { userId });
      } else {
        this.log(`Backup codes generation failed: ${result.error}`);
        this.emit('backup-codes-generation-failed', { userId, error: result.error });
      }

      return result;
    } catch (error) {
      this.log(`Backup codes generation error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get MFA methods for user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} MFA methods
   */
  async getMFAMethods(userId) {
    try {
      const result = await this.multiFactorAuth.getMFAMethods(userId);

      if (result.success) {
        this.log(`MFA methods retrieved for user: ${userId}`);
      } else {
        this.log(`MFA methods retrieval failed: ${result.error}`);
      }

      return result;
    } catch (error) {
      this.log(`MFA methods retrieval error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Authenticate with MFA
   * @param {string} username - Username
   * @param {string} password - Password
   * @param {string} mfaMethod - MFA method
   * @param {string} mfaCode - MFA code
   * @returns {Promise<Object>} Authentication result
   */
  async authenticateWithMFA(username, password, mfaMethod, mfaCode) {
    try {
      // First authenticate with username and password
      const authResult = await this.authenticate(username, password);

      if (!authResult.success) {
        return authResult;
      }

      // Then verify MFA
      const userId = authResult.user.id;
      const mfaResult = await this.verifyMFA(userId, mfaMethod, mfaCode);

      if (!mfaResult.success) {
        this.log(`MFA verification failed for user: ${username}`);
        this.emit('mfa-authentication-failed', { username, method: mfaMethod });

        return {
          success: false,
          error: mfaResult.error,
        };
      }

      this.log(`User authenticated with MFA: ${username}`);
      this.emit('user-authenticated-with-mfa', { username, method: mfaMethod });

      return authResult;
    } catch (error) {
      this.log(`MFA authentication error: ${error.message}`);
      this.emit('error', error);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SecurityManager] ${message}`);
    }
  }
}

module.exports = { SecurityManager };
