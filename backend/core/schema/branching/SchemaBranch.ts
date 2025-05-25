/**
 * Schema Branch
 *
 * Manages schema branches for experimental schema development.
 *
 * @version 1.0.0
 */

/**
 * Schema Branch
 *
 * Manages schema branches for experimental schema development.
 */
class SchemaBranch {
  /**
   * Create a new SchemaBranch instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    // Configuration
    this.config = {
      // Debug mode
      debugMode: false,

      // Database instance
      database: null,

      // Branch collection name
      branchCollection: '_schema_branches',

      // Default branch name
      defaultBranch: 'main',

      // Merge with provided options
      ...options,
    };

    // State
    this.branches = new Map();
    this.activeBranch = this.config.defaultBranch;

    // Initialize
    this._init();
  }

  /**
   * Initialize the branch manager
   * @private
   */
  _init() {
    this.log('Initializing Schema Branch');

    // Set up branch collection if database is provided
    if (this.config.database) {
      this._setupBranchCollection();
    }

    this.log('Schema Branch initialized');
  }

  /**
   * Set up branch collection
   * @private
   */
  _setupBranchCollection() {
    if (!this.config.database) {
      return;
    }

    // Get or create branch collection
    try {
      this.config.database.getCollection(this.config.branchCollection) ||
        this.config.database.createCollection(this.config.branchCollection);
    } catch (error) {
      this.log(`Error setting up branch collection: ${error.message}`);
    }

    this.log(`Branch collection set up: ${this.config.branchCollection}`);

    // Create default branch if it doesn't exist
    this._ensureDefaultBranch();
  }

  /**
   * Ensure default branch exists
   * @private
   */
  async _ensureDefaultBranch() {
    try {
      const defaultBranch = await this.getBranch(this.config.defaultBranch);

      if (!defaultBranch) {
        await this.createBranch(this.config.defaultBranch, {
          description: 'Default branch',
          isDefault: true,
        });
      }
    } catch (error) {
      // Ignore errors when creating default branch
      this.log(`Error ensuring default branch: ${error.message}`);
    }
  }

  /**
   * Set database reference
   * @param {UnifiedQuantumDatabase} database - Database instance
   * @returns {SchemaBranch} This instance for chaining
   */
  setDatabase(database) {
    this.config.database = database;
    this._setupBranchCollection();
    this.log('Database reference set');
    return this;
  }

  /**
   * Create a new branch
   * @param {string} name - Branch name
   * @param {Object} options - Branch options
   * @param {string} options.description - Branch description
   * @param {string} options.baseBranch - Base branch name
   * @param {boolean} options.isDefault - Whether this is the default branch
   * @returns {Promise<Object>} Created branch
   */
  async createBranch(name, options = {}) {
    if (!this.config.database) {
      throw new Error('Database not set');
    }

    // Validate parameters
    if (!name) {
      throw new Error('Branch name is required');
    }

    // Get or create branch collection
    let branchCollection;
    try {
      branchCollection = this.config.database.getCollection(this.config.branchCollection);

      if (!branchCollection) {
        branchCollection = this.config.database.createCollection(this.config.branchCollection);
      }
    } catch (error) {
      this.log(`Error getting branch collection: ${error.message}`);
      return null;
    }

    // Check if branch already exists
    const existingBranch = await this.getBranch(name);

    if (existingBranch) {
      throw new Error(`Branch already exists: ${name}`);
    }

    // Get base branch
    const baseBranchName = options.baseBranch || this.config.defaultBranch;
    const baseBranch = await this.getBranch(baseBranchName);

    if (!baseBranch && baseBranchName !== this.config.defaultBranch) {
      throw new Error(`Base branch not found: ${baseBranchName}`);
    }

    // Create new branch
    const newBranch = {
      id: `branch-${name}`,
      name,
      description: options.description || '',
      baseBranch: baseBranchName,
      isDefault: options.isDefault || false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    branchCollection.insert(newBranch);

    // Update cache
    this._updateBranchCache(newBranch);

    this.log(`Created branch: ${name}`);

    return newBranch;
  }

  /**
   * Get a branch
   * @param {string} name - Branch name
   * @returns {Promise<Object>} Branch
   */
  async getBranch(name) {
    // Check cache first
    if (this.branches.has(name)) {
      return this.branches.get(name);
    }

    if (!this.config.database) {
      return null;
    }

    // Get branch collection
    let branchCollection;
    try {
      branchCollection = this.config.database.getCollection(this.config.branchCollection);

      if (!branchCollection) {
        return null;
      }
    } catch (error) {
      this.log(`Error getting branch collection: ${error.message}`);
      return null;
    }

    // Find branch
    const branch = branchCollection.findOne({ name });

    if (branch) {
      // Update cache
      this._updateBranchCache(branch);
    }

    return branch;
  }

  /**
   * Get all branches
   * @returns {Promise<Array>} Branches
   */
  async getBranches() {
    if (!this.config.database) {
      return [];
    }

    // Get branch collection
    let branchCollection;
    try {
      branchCollection = this.config.database.getCollection(this.config.branchCollection);

      if (!branchCollection) {
        return [];
      }
    } catch (error) {
      this.log(`Error getting branch collection: ${error.message}`);
      return [];
    }

    // Find branches
    const branches = branchCollection.find({}, { sort: { name: 1 } });

    // Update cache
    for (const branch of branches) {
      this._updateBranchCache(branch);
    }

    return branches;
  }

  /**
   * Set active branch
   * @param {string} name - Branch name
   * @returns {Promise<Object>} Active branch
   */
  async setActiveBranch(name) {
    const branch = await this.getBranch(name);

    if (!branch) {
      throw new Error(`Branch not found: ${name}`);
    }

    this.activeBranch = name;
    this.log(`Set active branch: ${name}`);

    return branch;
  }

  /**
   * Get active branch
   * @returns {Promise<Object>} Active branch
   */
  async getActiveBranch() {
    return this.getBranch(this.activeBranch);
  }

  /**
   * Update branch cache
   * @param {Object} branch - Branch
   * @private
   */
  _updateBranchCache(branch) {
    this.branches.set(branch.name, branch);
  }

  /**
   * Log message if debug mode is enabled
   * @param {string} message - Message to log
   * @private
   */
  log(message) {
    if (this.config.debugMode) {
      console.log(`[SchemaBranch] ${message}`);
    }
  }
}

module.exports = { SchemaBranch };
