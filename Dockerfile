# 🚀 QQ-Verse Multi-Stage Production Dockerfile
# Quantum-Coherent Container Architecture for Zero-Touch Deployment
# @version 1.0.0

# ================================
# STAGE 1: Frontend Build
# ================================
FROM node:18-alpine AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies with quantum optimization
RUN npm ci --only=production --silent

# Copy frontend source code
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# ================================
# STAGE 2: Backend Build
# ================================
FROM node:18-alpine AS backend-builder

# Set working directory
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy backend source code
COPY backend/ ./

# Build backend TypeScript
RUN npm run build

# ================================
# STAGE 3: Production Runtime
# ================================
FROM node:18-alpine AS production

# Install system dependencies for quantum operations
RUN apk add --no-cache \
    dumb-init \
    curl \
    ca-certificates

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built backend from builder stage
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/dist ./backend
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=nextjs:nodejs /app/backend/package.json ./backend/

# Copy built frontend from builder stage
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder --chown=nextjs:nodejs /app/frontend/package.json ./frontend/

# Create necessary directories
RUN mkdir -p /app/logs /app/data && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose ports
EXPOSE 3000 5173

# Health check for quantum coherence
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "backend/server.js"]
