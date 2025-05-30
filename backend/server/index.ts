/**
 * Server Entry Point
 * 
 * This is the main entry point for the QQ-Verse backend server.
 * 
 * @version 1.0.0
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { setupRoutes } from './routes';
import { setupSocketHandlers } from './socket';
import { connectDatabases } from './database';
import { setupAPI } from './api';
import { setupSwagger } from './middleware/swagger';
import { apiVersionMiddleware } from './middleware/apiVersion';

// Create Express app
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Apply middleware
app.use(cors({
  origin: config.corsOrigins,
  credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply API version middleware
app.use('/api', apiVersionMiddleware);

// Setup routes
setupRoutes(app);

// Setup API endpoints
setupAPI(app);

// Setup Swagger documentation
setupSwagger(app);

// Setup socket handlers
setupSocketHandlers(io);

// 404 handler (must be after all other routes)
app.all('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Apply error handler
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to databases
    await connectDatabases();
    
    // Start HTTP server
    httpServer.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Start server
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer();
}

export { app, httpServer, io };