/**
 * Simplified Server Entry Point for Development
 *
 * This is a simplified version of the QQ-Verse backend server for development purposes.
 * It includes basic functionality without complex database connections.
 *
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { createServer as createNetServer } from 'net';

// Create Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Port detection utility
async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const port = (server.address() as net.AddressInfo)?.port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port is in use, try next one
      findAvailablePort(startPort + 1).then(resolve).catch(reject);
    });
  });
}

// Basic configuration
const DEFAULT_PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT || '3001', 10);
const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'];

// Apply middleware
app.use(cors({
  origin: CORS_ORIGINS,
  credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Quantum status endpoint
app.get('/api/quantum/status', (_req: express.default.Request, res: express.default.Response) => {
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
    }
  });
});

// Basic API info endpoint
app.get('/api', (_req: express.default.Request, res: express.default.Response) => {
  res.json({
    name: 'QQ-Verse Backend API',
    version: '1.0.0',
    description: 'Quantum-Coherent Backend Server',
    endpoints: [
      '/api/health',
      '/api/quantum/status'
    ]
  });
});

// 404 handler
app.use('*', (req: express.default.Request, res: express.default.Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err: any, _req: express.default.Request, res: express.default.Response, _next: express.default.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Unknown error occurred'
  });
});

// Start server
async function startServer() {
  try {
    const PORT = await findAvailablePort(DEFAULT_PORT);
    if (PORT !== DEFAULT_PORT) {
      console.log(`⚠️  Port ${DEFAULT_PORT} was in use, using port ${PORT} instead`);
    }

    httpServer.listen(PORT, () => {
      console.log('🚀 QQ-Verse Backend Server running on port', PORT);
      console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
      console.log('⚛️  Quantum status: http://localhost:' + PORT + '/api/quantum/status');
      console.log('🧠 Neural Fabric: OPERATIONAL');
      console.log('🌊 Consciousness Stream: FLOWING');
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
