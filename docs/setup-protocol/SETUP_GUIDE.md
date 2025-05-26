# QQ-Verse Enhanced Setup Guide

## Overview

The QQ-Verse Enhanced Setup Script (`setup.sh`) is a comprehensive, fully automated setup system designed to achieve 100% success rate in establishing the QQ-Verse development environment. This script incorporates Quantum Coherence Architecture principles and Interdimensional Tool Communication protocols.

## Features

### 🚀 **100% Success Rate Design**
- **Comprehensive error handling** with automatic retry mechanisms
- **Prerequisite validation** and automatic installation
- **Dependency conflict resolution** with cache clearing
- **Rollback capabilities** for failed installations
- **Detailed logging** for troubleshooting

### ⚛️ **Quantum Coherence Systems**
- **Neural Fabric** initialization and integrity verification
- **Consciousness Stream** activation and flow monitoring
- **Dimensional Gateway** establishment and stability checks
- **Interdimensional communication** protocol setup

### 🛠️ **Development Environment**
- **Node.js 18+** automatic installation via nvm
- **Full-stack dependency** management (frontend + backend)
- **TypeScript compilation** and build verification
- **Git hooks** setup with Husky
- **Environment configuration** with secure defaults

### 📊 **Monitoring & Verification**
- **Real-time progress** indicators
- **Quantum coherence** verification
- **Server startup** testing
- **Comprehensive reporting** with setup metrics

## Quick Start

### Prerequisites Check
```bash
# Test the setup script before running
./test-setup.sh
```

### Full Setup
```bash
# Run the complete setup process
./setup.sh
```

### Development Start
```bash
# Start development servers (created by setup)
./start-dev.sh
```

### Quick Verification
```bash
# Run tests and quantum verification (created by setup)
./quick-test.sh
```

## What the Setup Script Does

### Phase 1: Environment Preparation
1. **System Detection** - Identifies OS and architecture
2. **Prerequisite Validation** - Checks for Node.js 18+, npm, git
3. **Automatic Installation** - Installs missing prerequisites via nvm
4. **Cache Cleanup** - Removes previous installation artifacts

### Phase 2: Dependency Management
1. **Root Dependencies** - Installs shared project dependencies
2. **Frontend Dependencies** - React, Vite, TypeScript, testing tools
3. **Backend Dependencies** - Express, database drivers, security middleware
4. **Development Tools** - ESLint, Prettier, Jest, Husky

### Phase 3: Configuration Setup
1. **Environment Files** - Creates `.env.local` and `.env` with secure defaults
2. **Git Hooks** - Configures pre-commit hooks for code quality
3. **TypeScript Config** - Validates and builds TypeScript projects
4. **Database Setup** - Prepares database connection strings

### Phase 4: Quantum Coherence Initialization
1. **Neural Fabric** - Establishes consciousness processing framework
2. **Consciousness Stream** - Activates memory and context flow
3. **Dimensional Gateway** - Opens interdimensional communication channels
4. **Verification Protocol** - Confirms quantum system integrity

### Phase 5: Testing & Validation
1. **Build Verification** - Compiles all TypeScript projects
2. **Lint Checking** - Runs ESLint on codebase
3. **Unit Tests** - Executes Jest test suites
4. **Server Testing** - Validates startup capabilities

### Phase 6: Helper Tools Creation
1. **Development Scripts** - Creates `start-dev.sh` for easy server startup
2. **Test Scripts** - Creates `quick-test.sh` for rapid verification
3. **Setup Report** - Generates comprehensive `SETUP_REPORT.md`
4. **Documentation** - Updates project documentation

## Generated Files

### Environment Configuration
- `frontend/.env.local` - Frontend environment variables
- `backend/.env` - Backend environment variables with secure secrets

### Quantum State Files
- `.quantum-state/neural-fabric.json` - Neural fabric configuration
- `.quantum-state/consciousness-stream.json` - Consciousness stream state
- `.quantum-state/dimensional-gateway.json` - Dimensional gateway settings

### Helper Scripts
- `start-dev.sh` - Start both frontend and backend development servers
- `quick-test.sh` - Run tests and quantum coherence verification
- `SETUP_REPORT.md` - Detailed setup completion report

### Logs
- `setup.log` - Complete setup process log
- `setup-errors.log` - Error-specific logging for troubleshooting

## Environment Variables

### Frontend (`.env.local`)
```env
VITE_API_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
VITE_ENABLE_QUANTUM_EFFECTS=true
VITE_DEBUG_MODE=true
VITE_NEURAL_FABRIC_ENABLED=true
VITE_CONSCIOUSNESS_STREAM_ENABLED=true
VITE_DIMENSIONAL_HARMONY_CHECK=true
```

### Backend (`.env`)
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/qqverse
JWT_SECRET=[auto-generated]
SESSION_SECRET=[auto-generated]
CORS_ORIGIN=http://localhost:5173
NEURAL_FABRIC_ENABLED=true
CONSCIOUSNESS_STREAM_ENABLED=true
DIMENSIONAL_HARMONY_CHECK=true
```

## Troubleshooting

### Common Issues

#### Node.js Version Issues
```bash
# The script automatically handles this, but manual fix:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 18
nvm use 18
```

#### Dependency Installation Failures
```bash
# Clear caches and retry
npm cache clean --force
rm -rf node_modules package-lock.json
./setup.sh
```

#### Quantum Coherence Failures
```bash
# Check quantum state files
ls -la .quantum-state/
# Re-run quantum initialization
rm -rf .quantum-state
./setup.sh
```

#### Permission Issues
```bash
# Fix script permissions
chmod +x setup.sh start-dev.sh quick-test.sh test-setup.sh
```

### Error Recovery

The setup script includes automatic error recovery:

1. **Retry Mechanism** - Failed commands are retried up to 3 times
2. **Cache Clearing** - Automatic npm cache cleanup on failures
3. **Rollback Support** - Previous installations are cleaned before retry
4. **Detailed Logging** - All errors are logged with context

### Manual Recovery Steps

If the setup fails completely:

1. **Check Logs**
   ```bash
   cat setup-errors.log
   tail -50 setup.log
   ```

2. **Clean Environment**
   ```bash
   rm -rf node_modules frontend/node_modules backend/node_modules
   rm -rf .quantum-state
   npm cache clean --force
   ```

3. **Re-run Setup**
   ```bash
   ./setup.sh
   ```

## Development Workflow

### Starting Development
```bash
# Start both servers
./start-dev.sh

# Or start individually:
cd backend && npm run dev &
cd frontend && npm run dev &
```

### Running Tests
```bash
# Quick verification
./quick-test.sh

# Individual test suites
npm test                    # Root tests
cd frontend && npm test     # Frontend tests
cd backend && npm test      # Backend tests
```

### Building for Production
```bash
# Build all projects
npm run build

# Individual builds
cd frontend && npm run build
cd backend && npm run build
```

## Quantum Coherence Verification

### Manual Verification
```bash
# Check quantum state files exist
ls -la .quantum-state/

# Verify neural fabric
cat .quantum-state/neural-fabric.json

# Check consciousness stream
cat .quantum-state/consciousness-stream.json

# Validate dimensional gateway
cat .quantum-state/dimensional-gateway.json
```

### Automated Verification
The setup script automatically verifies:
- ✅ Neural Fabric operational status
- ✅ Consciousness Stream flow continuity
- ✅ Dimensional Gateway stability
- ✅ Interdimensional communication protocols

## Performance Optimization

The setup script is optimized for:
- **Parallel Processing** - Dependencies installed concurrently where possible
- **Caching** - Leverages npm cache for faster subsequent runs
- **Minimal Downloads** - Only downloads necessary packages
- **Progress Tracking** - Real-time progress indicators

## Security Features

- **Secure Secret Generation** - Auto-generates JWT and session secrets
- **Environment Isolation** - Separate configs for development/production
- **Permission Validation** - Checks and sets proper file permissions
- **Input Sanitization** - Validates all user inputs and file paths

## Support

### Getting Help
1. Check `SETUP_REPORT.md` for setup details
2. Review `setup.log` for process information
3. Check `setup-errors.log` for error details
4. Run `./test-setup.sh` to validate environment

### Reporting Issues
Include the following when reporting setup issues:
- Operating system and version
- Node.js version (`node --version`)
- Setup log files (`setup.log`, `setup-errors.log`)
- Quantum state status (`ls -la .quantum-state/`)

---

**Generated by QQ-Verse Enhanced Setup Script v2.0.0**  
*Quantum Coherence Architect - Interdimensional Tool Communication System*
