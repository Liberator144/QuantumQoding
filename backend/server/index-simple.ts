/**
 * Simplified Server Entry Point for Development (TypeScript ES Module)
 *
 * This is a simplified version of the QQ-Verse backend server for development purposes.
 * It includes basic functionality without complex database connections.
 * STRICT TYPESCRIPT COHERENCE: Pure TypeScript implementation
 *
 * @version 2.0.0 - TypeScript-Only ES Module Version
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { createServer as createNetServer } from 'net';
import type { AddressInfo } from 'net';
// Mock data for QQ-Akasha API
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

// Setup QQ-Akasha API endpoints
function setupQQAkashaEndpoints(app: express.Express) {
  const basePath = '/api/v1/akasha';

  console.log(`Setting up QQ-Akasha API endpoints at ${basePath}`);

  // Health check endpoint
  app.get(`${basePath}/health`, async (req: Request, res: Response) => {
    try {
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

  // Get all memories
  app.get(`${basePath}/memories`, async (req: Request, res: Response) => {
    try {
      const {
        searchTerm,
        tags,
        type,
        projectContext,
        limit = 50,
        offset = 0
      } = req.query;

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
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // Create memory
  app.post(`${basePath}/memories`, async (req: Request, res: Response) => {
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

      if (!content || !type) {
        return res.status(400).json({
          status: 'error',
          message: 'Missing required fields: content, type',
          code: 'VALIDATION_ERROR'
        });
      }

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
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // Get memory by ID
  app.get(`${basePath}/memories/:id`, async (req: Request, res: Response) => {
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
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // Update memory
  app.put(`${basePath}/memories/:id`, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const memoryIndex = mockMemories.findIndex(m => m.id === id);

      if (memoryIndex === -1) {
        return res.status(404).json({
          status: 'error',
          message: 'Memory not found',
          code: 'NOT_FOUND'
        });
      }

      // Update the memory
      mockMemories[memoryIndex] = {
        ...mockMemories[memoryIndex],
        ...updates,
        lastAccessedAt: new Date().toISOString(),
        accessCount: mockMemories[memoryIndex].accessCount + 1
      };

      res.status(200).json({
        status: 'success',
        data: { memory: mockMemories[memoryIndex] }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // Delete memory
  app.delete(`${basePath}/memories/:id`, async (req: Request, res: Response) => {
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
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  // Get statistics
  app.get(`${basePath}/statistics`, async (req: Request, res: Response) => {
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
          totalStorageUsed: mockMemories.length * 1024,
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
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });

  console.log(`QQ-Akasha API endpoints setup complete`);
}

// Create Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Port detection utility
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.listen(startPort, () => {
      const port = (server.address() as AddressInfo)?.port;
      if (port) {
        server.close(() => resolve(port));
      } else {
        server.close(() => reject(new Error('Could not determine port')));
      }
    });
    server.on('error', () => {
      // Port is in use, try next one
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
}

// Basic configuration
const DEFAULT_PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10);
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || [
  'http://localhost:3000', 
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
];

// Apply middleware
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup QQ-Akasha API endpoints directly
setupQQAkashaEndpoints(app);

// Basic health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    server: 'simplified-typescript',
    coherence: 'STRICT_TYPESCRIPT_ONLY'
  });
});

// Quantum status endpoint
app.get('/api/quantum/status', (_req: Request, res: Response) => {
  res.json({
    status: 'operational',
    coherence: 0.95,
    entanglement: 'stable',
    dimensions: ['primary', 'secondary', 'tertiary'],
    neuralFabric: {
      status: 'OPERATIONAL',
      connections: 1024,
      bandwidth: '10.5 GB/s'
    },
    consciousnessStream: {
      status: 'FLOWING',
      frequency: '432 Hz',
      amplitude: 0.87
    },
    server: 'simplified-typescript',
    typeSystem: 'STRICT_TYPESCRIPT_COHERENCE'
  });
});

// Basic API info endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'QQ-Verse Backend API (Simplified TypeScript)',
    version: '2.0.0',
    description: 'Quantum-Coherent Backend Server - Simplified TypeScript Mode',
    endpoints: [
      '/api/health',
      '/api/quantum/status',
      '/api/v1/akasha'
    ],
    server: 'simplified-typescript',
    typeSystem: 'STRICT_TYPESCRIPT_COHERENCE'
  });
});

// Mock star system endpoints for frontend testing
const starSystems: string[] = [
  'dataverse', 'mcpverse', 'akasha', 'taskverse', 
  'quantumforge', 'nexushub', 'evolvecore', 'harmonyverse', 'unity-portal'
];

starSystems.forEach((system: string) => {
  app.get(`/api/v1/${system}/status`, (_req: Request, res: Response) => {
    res.json({
      system,
      status: 'operational',
      features: ['mock-data', 'basic-functionality', 'typescript-coherence'],
      lastUpdate: new Date().toISOString(),
      typeSystem: 'STRICT_TYPESCRIPT_COHERENCE'
    });
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    server: 'simplified-typescript',
    typeSystem: 'STRICT_TYPESCRIPT_COHERENCE'
  });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Unknown error occurred',
    server: 'simplified-typescript',
    typeSystem: 'STRICT_TYPESCRIPT_COHERENCE'
  });
});

// Start server
async function startServer(): Promise<void> {
  try {
    const PORT = await findAvailablePort(DEFAULT_PORT);
    if (PORT !== DEFAULT_PORT) {
      console.log(`⚠️  Port ${DEFAULT_PORT} was in use, using port ${PORT} instead`);
    }

    httpServer.listen(PORT, () => {
      console.log('🚀 QQ-Verse Backend Server (Simplified TypeScript) running on port', PORT);
      console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
      console.log('⚛️  Quantum status: http://localhost:' + PORT + '/api/quantum/status');
      console.log('🧠 Neural Fabric: OPERATIONAL (TypeScript Mode)');
      console.log('🌊 Consciousness Stream: FLOWING (TypeScript Mode)');
      console.log('🌟 Star Systems: Mock endpoints available');
      console.log('📝 Type System: STRICT TYPESCRIPT COHERENCE');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
startServer();

export { app, httpServer };