/**
 * QQ-Akasha API Endpoints
 * Provides REST API for QQ-Akasha knowledge management system
 */

import { Express, Request, Response, NextFunction } from 'express';

// Mock data for development
const mockMemories: any[] = [];
let memoryIdCounter = 1;

// Mock enums for development
const MemoryType = {
  CODE: 'CODE',
  DOCUMENTATION: 'DOCUMENTATION',
  INSIGHT: 'INSIGHT',
  REFERENCE: 'REFERENCE',
  TASK: 'TASK',
  IDEA: 'IDEA'
};

const DeletionType = {
  SOFT: 'soft',
  HARD: 'hard',
  CASCADE: 'cascade',
  ARCHIVE_THEN_DELETE: 'archive_then_delete'
};

const ArchiveTier = {
  HOT: 'hot',
  WARM: 'warm',
  COLD: 'cold',
  FROZEN: 'frozen'
};

/**
 * Request validation middleware
 */
const validateRequest = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        code: 'VALIDATION_ERROR'
      });
    }
    
    next();
  };
};

/**
 * Error handling middleware
 */
const handleApiError = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('QQ-Akasha API Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: error.message,
      code: 'VALIDATION_ERROR'
    });
  }
  
  if (error.message.includes('not found')) {
    return res.status(404).json({
      status: 'error',
      message: error.message,
      code: 'NOT_FOUND'
    });
  }
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    code: 'INTERNAL_ERROR'
  });
};

/**
 * Setup QQ-Akasha API endpoints
 */
export const setupAkashaAPI = (app: Express) => {
  const basePath = '/api/v1/akasha';
  
  console.log(`Setting up QQ-Akasha API endpoints at ${basePath}`);

  // ===== MEMORY MANAGEMENT ENDPOINTS =====

  /**
   * @route   GET /api/v1/akasha/memories
   * @desc    Get all memories with optional filtering
   * @access  Public
   */
  app.get(`${basePath}/memories`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        searchTerm,
        tags,
        type,
        projectContext,
        sortBy = 'createdAt',
        sortDirection = 'desc',
        limit = 50,
        offset = 0,
        useContextualSearch = false
      } = req.query;

      // Mock filtering logic
      let filteredMemories = [...mockMemories];

      if (searchTerm) {
        filteredMemories = filteredMemories.filter(m =>
          m.content.toLowerCase().includes((searchTerm as string).toLowerCase())
        );
      }

      if (tags) {
        const tagArray = (tags as string).split(',');
        filteredMemories = filteredMemories.filter(m =>
          tagArray.some(tag => m.tags.includes(tag))
        );
      }

      if (type) {
        filteredMemories = filteredMemories.filter(m => m.type === type);
      }

      if (projectContext) {
        filteredMemories = filteredMemories.filter(m => m.projectContext === projectContext);
      }

      // Mock pagination
      const startIndex = parseInt(offset as string) || 0;
      const limitNum = parseInt(limit as string) || 50;
      const paginatedMemories = filteredMemories.slice(startIndex, startIndex + limitNum);

      res.status(200).json({
        status: 'success',
        data: {
          memories: paginatedMemories,
          totalCount: filteredMemories.length,
          enhancedResults: paginatedMemories.map(m => ({ ...m, relevanceScore: 0.8 })),
          searchMetadata: {
            searchTime: 5,
            algorithmUsed: 'mock-search',
            contextFactors: ['content-match', 'tag-match']
          }
        }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route   GET /api/v1/akasha/memories/:id
   * @desc    Get memory by ID
   * @access  Public
   */
  app.get(`${basePath}/memories/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const memory = mockMemories.find(m => m.id === id);

      if (!memory) {
        return res.status(404).json({
          status: 'error',
          message: 'Memory not found',
          code: 'NOT_FOUND'
        });
      }

      res.status(200).json({
        status: 'success',
        data: { memory }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route   POST /api/v1/akasha/memories
   * @desc    Create a new memory
   * @access  Public
   */
  app.post(`${basePath}/memories`,
    validateRequest(['content', 'type']),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          content,
          type,
          tags = [],
          metadata = {},
          projectContext,
          filePath,
          createdBy = 'api-user'
        } = req.body;

        const memory = {
          id: `memory_${memoryIdCounter++}`,
          content,
          type,
          tags,
          metadata,
          projectContext,
          filePath,
          createdBy,
          createdAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
          accessCount: 0,
          relatedMemories: []
        };

        mockMemories.push(memory);

        res.status(201).json({
          status: 'success',
          data: { memory }
        });
      } catch (error) {
        next(error);
      }
    }
  );

  /**
   * @route   DELETE /api/v1/akasha/memories/:id
   * @desc    Delete memory (soft delete by default)
   * @access  Public
   */
  app.delete(`${basePath}/memories/:id`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const {
        deletionType = DeletionType.SOFT,
        force = false,
        reason,
        deletedBy = 'api-user'
      } = req.body;

      const memoryIndex = mockMemories.findIndex(m => m.id === id);

      if (memoryIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: 'Memory not found',
          code: 'NOT_FOUND'
        });
      }

      const deletionRecord = {
        operationId: `del_${Date.now()}`,
        memoryId: id,
        deletionType,
        deletedAt: new Date().toISOString(),
        deletedBy,
        reason,
        recoverable: deletionType === DeletionType.SOFT,
        recoveryDeadline: deletionType === DeletionType.SOFT ?
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        affectedMemories: [id]
      };

      if (deletionType === DeletionType.HARD) {
        mockMemories.splice(memoryIndex, 1);
      } else {
        mockMemories[memoryIndex].metadata = {
          ...mockMemories[memoryIndex].metadata,
          deleted: true,
          deletedAt: deletionRecord.deletedAt
        };
      }

      res.status(200).json({
        status: 'success',
        data: { deletionRecord }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route   GET /api/v1/akasha/statistics
   * @desc    Get QQ-Akasha statistics
   * @access  Public
   */
  app.get(`${basePath}/statistics`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deletedMemories = mockMemories.filter(m => m.metadata?.deleted);
      const archivedMemories = mockMemories.filter(m => m.metadata?.archived);
      const activeMemories = mockMemories.filter(m => !m.metadata?.deleted && !m.metadata?.archived);

      const statistics = {
        totalMemories: mockMemories.length,
        deletedMemories: deletedMemories.length,
        archivedMemories: archivedMemories.length,
        activeMemories: activeMemories.length,
        archiveStatistics: {
          totalArchives: archivedMemories.length,
          archivesByTier: {
            hot: archivedMemories.filter(m => m.metadata?.archiveTier === 'hot').length,
            warm: archivedMemories.filter(m => m.metadata?.archiveTier === 'warm').length,
            cold: archivedMemories.filter(m => m.metadata?.archiveTier === 'cold').length,
            frozen: archivedMemories.filter(m => m.metadata?.archiveTier === 'frozen').length
          },
          totalStorageUsed: mockMemories.length * 1024, // Mock storage size
          averageCompressionRatio: 0.75
        },
        memoryTypes: mockMemories.reduce((acc: any, memory) => {
          acc[memory.type] = (acc[memory.type] || 0) + 1;
          return acc;
        }, {}),
        lastUpdated: new Date().toISOString()
      };

      res.status(200).json({
        status: 'success',
        data: { statistics }
      });
    } catch (error) {
      next(error);
    }
  });

  /**
   * @route   GET /api/v1/akasha/health
   * @desc    Health check for QQ-Akasha
   * @access  Public
   */
  app.get(`${basePath}/health`, async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Perform basic health checks
      const testMemory = {
        id: `health_test_${Date.now()}`,
        content: 'Health check test memory',
        type: MemoryType.DOCUMENTATION,
        tags: ['health-check'],
        metadata: { temporary: true },
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        accessCount: 0,
        relatedMemories: []
      };

      // Test create and delete
      mockMemories.push(testMemory);
      const index = mockMemories.findIndex(m => m.id === testMemory.id);
      if (index !== -1) {
        mockMemories.splice(index, 1);
      }

      res.status(200).json({
        status: 'success',
        message: 'QQ-Akasha is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mockDataCount: mockMemories.length
      });
    } catch (error) {
      res.status(503).json({
        status: 'error',
        message: 'QQ-Akasha health check failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Apply error handling middleware
  app.use(basePath, handleApiError);

  console.log(`QQ-Akasha API endpoints setup complete`);
};

export default setupAkashaAPI;
