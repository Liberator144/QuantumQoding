# 🚀 QQ-Verse Master Setup Guide
## Complete Installation & Configuration Guide

> **CANONICAL SETUP GUIDE**  
> This is the authoritative source for all QQ-Verse setup procedures  
> **Quick Setup**: See [Quick Start](../quick-start/setup.md) for 5-minute setup  
> **Tutorial**: See [First Quantum Experience](../tutorials/01-first-quantum-experience.md) for hands-on learning  

---

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher  
- **Git**: 2.30.0 or higher
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 20.04+)

### Development Environment
- **IDE**: VS Code (recommended) with extensions:
  - TypeScript and JavaScript Language Features
  - ES7+ React/Redux/React-Native snippets
  - Prettier - Code formatter
  - ESLint
- **Browser**: Chrome or Firefox (latest version)
- **Terminal**: PowerShell (Windows), Terminal (macOS), or Bash (Linux)

### Hardware Recommendations
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space minimum
- **CPU**: Multi-core processor recommended for optimal development experience

---

## ⚡ Quick Setup (5 minutes)

### One-Command Setup
```bash
# Clone repository
git clone https://github.com/your-org/QuantumQoding.git
cd QuantumQoding

# Run automated setup
npm run setup

# Start development environment
npm run dev
```

### Verification
```bash
# Verify installation
npm run test

# Check quantum coherence
npm run quantum:health
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Documentation**: http://localhost:3001/docs

---

## 🔧 Detailed Setup Process

### Step 1: Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-org/QuantumQoding.git
cd QuantumQoding

# Verify repository structure
ls -la
```

**Expected Structure**:
```
QuantumQoding/
├── frontend/          # React frontend application
├── backend/           # Node.js backend services
├── docs/              # Documentation
├── scripts/           # Setup and utility scripts
├── monitoring/        # Monitoring configuration
├── nginx/             # Nginx configuration
└── package.json       # Root package configuration
```

### Step 2: Environment Configuration

#### Root Environment Setup
```bash
# Copy environment template
cp .env.development .env

# Edit environment variables (optional)
nano .env
```

#### Frontend Environment Setup
```bash
cd frontend

# Copy frontend environment template
cp .env.example .env.local

# Configure frontend environment
nano .env.local
```

**Frontend Environment Variables**:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_QUANTUM_COHERENCE_LEVEL=0.95
VITE_CONSCIOUSNESS_STREAM_URL=ws://localhost:3001/consciousness
VITE_NEURAL_FABRIC_ENDPOINT=http://localhost:3001/neural-fabric
```

#### Backend Environment Setup
```bash
cd ../backend

# Copy backend environment template
cp .env.example .env

# Configure backend environment
nano .env
```

**Backend Environment Variables**:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=sqlite:./data/quantum.db
JWT_SECRET=your-quantum-secret-key
CONSCIOUSNESS_STREAM_PORT=3002
NEURAL_FABRIC_PORT=3003
```

### Step 3: Dependency Installation

#### Install Root Dependencies
```bash
# Return to project root
cd ..

# Install root dependencies
npm install
```

#### Install Frontend Dependencies
```bash
cd frontend
npm install

# Install quantum-specific dependencies
npm install @quantum/core @quantum/visualization @quantum/consciousness
npm install three @react-three/fiber @react-three/drei
npm install framer-motion lucide-react
```

#### Install Backend Dependencies
```bash
cd ../backend
npm install

# Install quantum backend dependencies
npm install @quantum/neural-fabric @quantum/dimensional-gateway
npm install express cors helmet morgan
npm install sqlite3 prisma @prisma/client
npm install jsonwebtoken bcryptjs
```

### Step 4: Database Setup

#### Initialize Database
```bash
# From backend directory
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed initial data (optional)
npx prisma db seed
```

#### Verify Database
```bash
# Check database connection
npm run db:check

# View database in Prisma Studio (optional)
npx prisma studio
```

### Step 5: Build and Start Services

#### Development Mode (Recommended)
```bash
# From project root
npm run dev
```

This command starts:
- Frontend development server (port 5173)
- Backend API server (port 3001)
- Consciousness stream service (port 3002)
- Neural fabric service (port 3003)

#### Production Mode
```bash
# Build all services
npm run build

# Start production servers
npm run start
```

#### Docker Mode (Alternative)
```bash
# Build and start with Docker
docker-compose up --build

# Or for development
docker-compose -f docker-compose.dev.yml up
```

---

## ✅ Installation Verification

### Automated Verification
```bash
# Run comprehensive verification
npm run verify

# Check individual services
npm run verify:frontend
npm run verify:backend
npm run verify:quantum
```

### Manual Verification Checklist

#### Frontend Verification
- [ ] Navigate to http://localhost:5173
- [ ] Verify quantum theme loads correctly
- [ ] Check browser console for errors
- [ ] Test quantum component interactions

#### Backend Verification
- [ ] Navigate to http://localhost:3001/health
- [ ] Check API documentation at http://localhost:3001/docs
- [ ] Verify database connection
- [ ] Test authentication endpoints

#### Quantum System Verification
- [ ] Check quantum coherence level (should be >0.9)
- [ ] Verify consciousness stream connectivity
- [ ] Test neural fabric health
- [ ] Validate dimensional gateway responses

### Health Check Commands
```bash
# Check overall system health
curl http://localhost:3001/health

# Check quantum coherence
curl http://localhost:3001/quantum/coherence

# Check consciousness stream
curl http://localhost:3001/consciousness/health

# Check neural fabric
curl http://localhost:3001/neural-fabric/status
```

---

## 🔧 Development Tools Setup

### VS Code Configuration
```bash
# Install recommended extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

### Git Hooks Setup
```bash
# Install pre-commit hooks
npm run prepare

# Test pre-commit hooks
npm run pre-commit:test
```

### Development Scripts
```bash
# Start development with hot reload
npm run dev

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

---

## 🚨 Troubleshooting Common Issues

### Port Conflicts
**Problem**: Ports 3001, 3002, or 5173 already in use
**Solution**:
```bash
# Find and kill processes using ports
lsof -ti:3001 | xargs kill -9
lsof -ti:3002 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or configure different ports in .env files
```

### Node Version Issues
**Problem**: Node.js version incompatibility
**Solution**:
```bash
# Check Node version
node --version

# Install correct version with nvm
nvm install 18
nvm use 18
```

### Database Connection Issues
**Problem**: Cannot connect to database
**Solution**:
```bash
# Reset database
cd backend
rm -rf data/
npx prisma migrate reset
npx prisma generate
```

### Dependency Installation Issues
**Problem**: npm install fails
**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Quantum Coherence Issues
**Problem**: Low quantum coherence level
**Solution**:
```bash
# Reset quantum state
npm run quantum:reset

# Recalibrate quantum systems
npm run quantum:calibrate
```

---

## 🎯 Next Steps

### Immediate Next Steps
1. **Complete Tutorial**: [First Quantum Experience](../tutorials/01-first-quantum-experience.md)
2. **Explore Components**: [Component Library](../components/README.md)
3. **API Integration**: [API Integration Guide](../api/integration-guide.md)

### Development Workflow
1. **Daily Development**: Use `npm run dev` for development
2. **Testing**: Run `npm test` before committing
3. **Code Quality**: Use `npm run lint` and `npm run format`
4. **Documentation**: Update docs as you develop

### Learning Path
1. **Foundation**: Complete tutorials 1-4
2. **Intermediate**: Progress through tutorials 5-8
3. **Advanced**: Master tutorials 9-12
4. **Expert**: Complete tutorials 13-17

---

## 📚 Additional Resources

### Documentation Links
- **[API Documentation](../api/README.md)** - Complete API reference
- **[Component Library](../components/README.md)** - UI component documentation
- **[Architecture Guide](../architecture/README.md)** - System architecture overview
- **[Troubleshooting Guide](../troubleshooting/README.md)** - Problem resolution

### External Resources
- **[Node.js Documentation](https://nodejs.org/docs/)**
- **[React Documentation](https://react.dev/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Quantum Computing Basics](https://quantum-computing.ibm.com/)**

### Community Support
- **Discord**: Join our quantum development community
- **GitHub Discussions**: Ask questions and share insights
- **Office Hours**: Weekly live Q&A sessions
- **Documentation Issues**: Report problems or suggest improvements

---

*This master setup guide provides everything needed to get QQ-Verse running in any environment. For quick setup, use the automated scripts. For learning, follow the tutorials. For troubleshooting, check the common issues section.*