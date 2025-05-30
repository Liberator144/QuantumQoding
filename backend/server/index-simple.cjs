/**
 * Simplified Server Entry Point for Development (CommonJS)
 *
 * This is a simplified version of the QQ-Verse backend server for development purposes.
 * It includes basic functionality without complex database connections.
 *
 * @version 1.0.0 - CommonJS Version for Maximum Compatibility
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { createServer: createNetServer } = require('net');

// Create Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Port detection utility
async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createNetServer();
    server.listen(startPort, () => {
      const port = server.address()?.port;
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

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    server: 'simplified-js'
  });
});

// Quantum status endpoint
app.get('/api/quantum/status', (req, res) => {
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
    server: 'simplified-js'
  });
});

// Basic API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'QQ-Verse Backend API (Simplified JS)',
    version: '1.0.0',
    description: 'Quantum-Coherent Backend Server - Simplified JavaScript Mode',
    endpoints: [
      '/api/health',
      '/api/quantum/status'
    ],
    server: 'simplified-js'
  });
});

// Mock star system endpoints for frontend testing
const starSystems = [
  'dataverse', 'mcpverse', 'akasha', 'taskverse', 
  'quantumforge', 'nexushub', 'evolvecore', 'harmonyverse', 'unity-portal'
];

starSystems.forEach(system => {
  app.get(`/api/v1/${system}/status`, (req, res) => {
    res.json({
      system,
      status: 'operational',
      features: ['mock-data', 'basic-functionality'],
      lastUpdate: new Date().toISOString()
    });
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    server: 'simplified-js'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message || 'Unknown error occurred',
    server: 'simplified-js'
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
      console.log('🚀 QQ-Verse Backend Server (Simplified JS) running on port', PORT);
      console.log('🌐 Health check: http://localhost:' + PORT + '/api/health');
      console.log('⚛️  Quantum status: http://localhost:' + PORT + '/api/quantum/status');
      console.log('🧠 Neural Fabric: OPERATIONAL (Simplified JS Mode)');
      console.log('🌊 Consciousness Stream: FLOWING (Simplified JS Mode)');
      console.log('🌟 Star Systems: Mock endpoints available');
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

module.exports = { app, httpServer };