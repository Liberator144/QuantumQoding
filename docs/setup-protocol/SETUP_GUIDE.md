# QuantumQoding Setup Guide v3.0.0

**Complete Setup Instructions for Production Backend Configuration**

## 🎯 **Overview**

This guide provides comprehensive instructions for setting up the QuantumQoding development environment using our three specialized setup scripts. Each script is designed for specific use cases and environments.

## 🚀 **Prerequisites**

### **System Requirements**
- **Operating System**: macOS, Linux, or Windows (with WSL)
- **Node.js**: v18.0.0 or higher (automatically installed if missing)
- **Git**: Latest version (automatically installed if missing)
- **Memory**: Minimum 4GB RAM recommended
- **Storage**: At least 2GB free space for dependencies

### **Network Requirements**
- **Internet Connection**: Required for dependency downloads
- **Ports**: 3001 (backend), 5173 (frontend) - automatically detected if occupied
- **Firewall**: Allow Node.js applications through firewall

## 📋 **Setup Script Selection**

### **Choose Your Setup Script:**

#### **1. Enhanced Main Setup (`setup.sh`)** - **Recommended for Development**
- **Best for**: Local development, first-time setup, learning the system
- **Features**: Comprehensive setup with detailed reporting
- **Time**: 3-5 minutes
- **User Interaction**: Minimal

#### **2. Bulletproof Setup (`setup-bulletproof.sh`)** - **Recommended for Production**
- **Best for**: Production environments, CI/CD, unreliable networks
- **Features**: Maximum error recovery, intelligent retry mechanisms
- **Time**: 5-8 minutes
- **User Interaction**: None (fully autonomous)

#### **3. Remote Agent Setup (`.augment/env/setup-remote-agent.sh`)** - **For Agents**
- **Best for**: Remote Augment agents, containers, automated systems
- **Features**: Silent operation, autonomous decision making
- **Time**: 2-4 minutes
- **User Interaction**: None (completely silent)

## 🛠️ **Setup Instructions**

### **Method 1: Enhanced Main Setup (Recommended)**

```bash
# 1. Navigate to project root
cd /path/to/QuantumQoding

# 2. Make script executable (if needed)
chmod +x setup.sh

# 3. Run the setup
./setup.sh

# 4. Wait for completion (3-5 minutes)
# The script will display progress and create detailed logs

# 5. Verify setup
./verify-setup.sh

# 6. Start development environment
./start-dev-bulletproof.sh
```

### **Method 2: Bulletproof Setup (Production)**

```bash
# 1. Navigate to project root
cd /path/to/QuantumQoding

# 2. Make script executable (if needed)
chmod +x setup-bulletproof.sh

# 3. Run the bulletproof setup
./setup-bulletproof.sh

# 4. Wait for completion (5-8 minutes)
# The script runs autonomously with maximum error recovery

# 5. Verify bulletproof setup
./verify-bulletproof.sh

# 6. Start development environment
./start-dev-bulletproof.sh
```

### **Method 3: Remote Agent Setup (Agents)**

```bash
# 1. Navigate to project root
cd /path/to/QuantumQoding

# 2. Make script executable (if needed)
chmod +x .augment/env/setup-remote-agent.sh

# 3. Run the agent setup
./.augment/env/setup-remote-agent.sh

# 4. Wait for completion (2-4 minutes)
# The script runs silently with autonomous operation

# 5. Verify agent setup
./.augment/env/verify-agent-setup.sh

# 6. Check agent status
./.augment/env/agent-status.sh

# 7. Start development environment
./start-dev-bulletproof.sh
```

## 🔧 **What Each Setup Script Does**

### **All Setup Scripts Perform:**
1. **System Detection**: Automatically detect OS, architecture, and environment
2. **Prerequisite Installation**: Install Node.js v18+, npm, Git if missing
3. **Dependency Installation**: Install all frontend and backend dependencies
4. **Backend Configuration**: Configure production server (server/index.ts)
5. **Environment Setup**: Create .env files with proper configuration
6. **Quantum Systems**: Initialize neural fabric, consciousness stream, dimensional gateway
7. **Development Scripts**: Create helper scripts for development workflow
8. **Verification**: Generate verification scripts and reports

### **Enhanced Main Setup Additional Features:**
- Detailed progress indicators and logging
- Comprehensive setup report generation
- Development helper script creation
- Manual verification steps

### **Bulletproof Setup Additional Features:**
- Exponential backoff retry mechanisms
- Automatic port conflict resolution
- Database connection testing
- Security hardening with secure secret generation
- Performance optimization
- Comprehensive error recovery

### **Remote Agent Setup Additional Features:**
- Silent operation (no user output)
- Autonomous decision making
- Agent-specific quantum configurations
- Self-monitoring capabilities
- Container/CI environment detection

## 📊 **Expected Output**

### **Successful Setup Indicators:**
```bash
✅ Node.js v20.x.x verified
✅ Dependencies installed successfully
✅ Production backend configured
✅ Environment files created
✅ Quantum Coherence Systems initialized
✅ Development scripts created
🎉 Setup completed successfully!
```

### **Files Created:**
- `frontend/.env.local` - Frontend environment configuration
- `backend/.env` - Backend environment configuration
- `.quantum-state/neural-fabric.json` - Neural fabric configuration
- `.quantum-state/consciousness-stream.json` - Consciousness stream state
- `.quantum-state/dimensional-gateway.json` - Dimensional gateway settings
- `verify-setup.sh` or `verify-bulletproof.sh` - Verification script
- `SETUP_REPORT.md` or `BULLETPROOF_SETUP_REPORT.md` - Setup report

### **Logs Created:**
- `setup.log` - Main setup process log
- `setup-errors.log` - Error log (if any issues)
- `logs/setup-bulletproof.log` - Bulletproof setup log (bulletproof setup)
- `.augment/logs/remote-agent-setup.log` - Agent setup log (agent setup)

## 🌐 **Verification Steps**

### **1. Run Verification Script:**
```bash
# For main setup
./verify-setup.sh

# For bulletproof setup
./verify-bulletproof.sh

# For agent setup
./.augment/env/verify-agent-setup.sh
```

### **2. Check Access Points:**
```bash
# Start development servers
./start-dev-bulletproof.sh

# In another terminal, test endpoints:
curl http://localhost:3001/health          # Backend health
curl http://localhost:3001/api/health      # API health
curl http://localhost:5173                 # Frontend (in browser)
```

### **3. Verify Quantum Systems:**
```bash
# Check quantum state files
ls -la .quantum-state/

# Expected files:
# neural-fabric.json
# consciousness-stream.json
# dimensional-gateway.json
# agents/ (for agent setup)
```

## 🚨 **Troubleshooting**

### **Common Issues and Solutions:**

#### **1. Node.js Version Issues**
```bash
# Problem: Node.js version too old
# Solution: Setup scripts automatically install Node.js v20

# Manual installation if needed:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
nvm install 20
nvm use 20
```

#### **2. Permission Errors**
```bash
# Problem: Permission denied
# Solution: Make scripts executable
chmod +x setup.sh setup-bulletproof.sh
chmod +x .augment/env/setup-remote-agent.sh
chmod +x start-dev-bulletproof.sh
```

#### **3. Port Conflicts**
```bash
# Problem: Ports 3001 or 5173 already in use
# Solution: Scripts automatically detect and use alternative ports

# Manual port checking:
lsof -i :3001  # Check backend port
lsof -i :5173  # Check frontend port
```

#### **4. Dependency Installation Failures**
```bash
# Problem: npm install fails
# Solution: Clear caches and retry

npm cache clean --force
rm -rf node_modules frontend/node_modules backend/node_modules
rm -f package-lock.json frontend/package-lock.json backend/package-lock.json

# Then re-run setup script
./setup-bulletproof.sh  # Use bulletproof for better error recovery
```

#### **5. TypeScript Compilation Errors**
```bash
# Problem: TypeScript compilation fails
# Solution: Check TypeScript configuration

# Verify TypeScript installation
cd backend && npm list typescript
cd ../frontend && npm list typescript

# Test compilation manually
cd backend && npx tsc --noEmit
cd ../frontend && npx tsc --noEmit
```

#### **6. Backend Server Not Starting**
```bash
# Problem: Backend server fails to start
# Solution: Check backend configuration

# Verify production server file exists
ls -la backend/server/index.ts

# Check nodemon configuration
cat backend/nodemon.json

# Test manual startup
cd backend && npx tsx server/index.ts
```

### **Advanced Troubleshooting:**

#### **Complete Environment Reset**
```bash
# 1. Stop all processes
pkill -f "node"
pkill -f "npm"

# 2. Clean all dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
rm -f package-lock.json frontend/package-lock.json backend/package-lock.json

# 3. Clear npm cache
npm cache clean --force

# 4. Remove environment files
rm -f frontend/.env.local backend/.env

# 5. Remove quantum state
rm -rf .quantum-state

# 6. Re-run bulletproof setup
./setup-bulletproof.sh
```

#### **Log Analysis**
```bash
# Check setup logs for errors
tail -f setup.log
tail -f setup-errors.log

# For bulletproof setup
tail -f logs/setup-bulletproof.log

# For agent setup
tail -f .augment/logs/remote-agent-setup.log
```

## 📈 **Performance Optimization**

### **Setup Performance Tips:**
1. **Use Bulletproof Setup**: For fastest and most reliable installation
2. **Stable Internet**: Ensure stable internet connection for dependency downloads
3. **Close Other Applications**: Free up system resources during setup
4. **Use SSD**: Faster disk I/O improves installation speed

### **Development Performance Tips:**
1. **Use Node.js v20**: Latest LTS version for best performance
2. **Enable Caching**: npm and TypeScript caching enabled by default
3. **Monitor Resources**: Use `./agent-status.sh` for system monitoring

## 🔄 **Updating the Setup**

### **When to Re-run Setup:**
- After major system updates
- When switching Node.js versions
- After dependency conflicts
- When quantum systems become corrupted
- After manual environment modifications

### **Update Process:**
```bash
# 1. Backup current configuration
cp -r .quantum-state .quantum-state-backup
cp frontend/.env.local frontend/.env.local.backup
cp backend/.env backend/.env.backup

# 2. Re-run setup (preserves existing configuration)
./setup-bulletproof.sh

# 3. Verify update
./verify-bulletproof.sh
```

## 📚 **Next Steps After Setup**

1. **Start Development**: `./start-dev-bulletproof.sh`
2. **Access Frontend**: http://localhost:5173
3. **Access Backend**: http://localhost:3001
4. **View API Docs**: http://localhost:3001/api-docs
5. **Monitor Health**: http://localhost:3001/health

## 🎯 **Success Metrics**

Your setup is successful when:
- ✅ All verification scripts pass
- ✅ Frontend loads without errors
- ✅ Backend API responds to health checks
- ✅ All quantum systems are operational
- ✅ Development workflow is functional

---

**Quantum Coherence Architect - Production Backend Configuration System**  
*QuantumQoding Setup Guide v3.0.0*  
*Last Updated: $(date)*