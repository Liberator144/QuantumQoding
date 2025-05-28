# QQ-Verse Developer Setup Guide

> **Complete Setup Guide**: This comprehensive guide will help new developers set up the QQ-Verse development environment and get the project running locally in under 30 minutes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

---

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software

| Software | Version | Download Link | Notes |
|----------|---------|---------------|-------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) | LTS version recommended |
| **npm** | 9.0+ | Included with Node.js | Package manager |
| **Git** | 2.30+ | [git-scm.com](https://git-scm.com/) | Version control |
| **MongoDB** | 4.4+ | [mongodb.com](https://www.mongodb.com/) | Database (optional for local dev) |

### Optional Software

| Software | Purpose | Download Link |
|----------|---------|---------------|
| **MongoDB Compass** | Database GUI | [mongodb.com/compass](https://www.mongodb.com/compass) |
| **Postman** | API testing | [postman.com](https://www.postman.com/) |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |

### System Requirements

- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 5GB free space
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)

---

## Quick Start

For experienced developers who want to get started immediately:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/qq-verse.git
cd qq-verse

# 2. Install dependencies
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..

# 3. Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Start the development servers
./start-dev-bulletproof.sh
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

---

## Detailed Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/your-org/qq-verse.git

# Navigate to the project directory
cd qq-verse

# Check the project structure
ls -la
```

You should see the following structure:
```
qq-verse/
├── backend/          # Backend API server
├── frontend/         # React frontend application
├── docs/             # Documentation
├── scripts/          # Utility scripts
├── package.json      # Root package configuration
├── README.md         # Project overview
└── start-dev.sh      # Development server starter
```

### Step 2: Install Dependencies

The QQ-Verse project has dependencies for both frontend and backend:

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Expected Output:**
- Root: ~50 packages installed
- Backend: ~600 packages installed
- Frontend: ~400 packages installed

### Step 3: Environment Configuration

#### Backend Environment Setup

```bash
# Copy the example environment file
cp backend/.env.example backend/.env

# Edit the environment file
nano backend/.env  # or use your preferred editor
```

**Required Environment Variables:**

```env
# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/qq-verse-dev
# OR use MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/qq-verse

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Email Configuration (optional for development)
EMAIL_FROM=noreply@qq-verse.com
SENDGRID_API_KEY=your-sendgrid-api-key

# External API Keys (optional)
GITHUB_TOKEN=your-github-token
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key

# Quantum Configuration
QUANTUM_COHERENCE_THRESHOLD=0.85
CONSCIOUSNESS_STREAM_BUFFER_SIZE=1000
NEURAL_FABRIC_MAX_NODES=10000
```

#### Frontend Environment Setup

```bash
# Copy the example environment file
cp frontend/.env.example frontend/.env

# Edit the environment file
nano frontend/.env
```

**Required Environment Variables:**

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_API_VERSION=v1

# Authentication
VITE_JWT_STORAGE_KEY=qq-verse-token

# Feature Flags
VITE_ENABLE_QUANTUM_AUTH=true
VITE_ENABLE_CONSCIOUSNESS_STREAMS=true
VITE_ENABLE_NEURAL_FABRIC=true

# Development
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# External Services (optional)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## Database Setup

### Option 1: Local MongoDB (Recommended for Development)

#### Install MongoDB

**macOS (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. Start MongoDB as a Windows service

#### Verify MongoDB Installation

```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Expected output: { ismaster: true, ... }
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account and cluster
3. Get your connection string
4. Update `MONGODB_URI` in `backend/.env`

### Option 3: Docker (Alternative)

```bash
# Run MongoDB in Docker
docker run -d \
  --name qq-verse-mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:4.4

# Update your .env file
MONGODB_URI=mongodb://admin:password@localhost:27017/qq-verse-dev?authSource=admin
```

---

## Running the Application

### Method 1: Using the Bulletproof Script (Recommended)

The bulletproof script automatically handles port detection, error recovery, and monitoring:

```bash
# Make the script executable
chmod +x start-dev-bulletproof.sh

# Start both frontend and backend
./start-dev-bulletproof.sh
```

**Expected Output:**
```
🚀 Starting BULLETPROOF QQ-Verse Development Environment...
[INFO] 🔍 Finding available ports...
[SUCCESS] Backend will use port: 3001
[SUCCESS] Frontend will use port: 5173
[SUCCESS] Environment configuration created
[INFO] 🔧 Starting backend server on port 3001...
[INFO] Backend started with PID: 1234
[SUCCESS] ✅ Backend server operational
[INFO] 🎨 Starting frontend server on port 5173...
[INFO] Frontend started with PID: 5678
[SUCCESS] ✅ Frontend server operational

╔══════════════════════════════════════════════════════════════╗
║                 🎉 BULLETPROOF SERVERS READY! 🎉              ║
╚══════════════════════════════════════════════════════════════╝

🌐 Access Points:
   📱 Frontend:  http://localhost:5173
   🔧 Backend:   http://localhost:3001
   📊 API Docs:  http://localhost:3001/api-docs
   🔍 Health:    http://localhost:3001/api/health
```

### Method 2: Manual Startup

If you prefer to start services manually:

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### Method 3: Using the Simple Script

```bash
# Alternative startup script
chmod +x start-dev.sh
./start-dev.sh
```

---

## Development Workflow

### Code Organization

The project follows a modular architecture:

```
backend/
├── core/                 # Core business logic
│   ├── consciousness/    # Consciousness processing
│   ├── dimensions/       # Dimensional operations
│   ├── quantum/          # Quantum state management
│   └── system/           # System utilities
├── server/               # Express server
│   ├── api/              # API endpoints
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   └── models/           # Data models
└── database/             # Database management

frontend/
├── src/
│   ├── components/       # React components
│   ├── cosmos/           # Visualization components
│   ├── core/             # Core logic
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   └── types/            # TypeScript types
```

### Development Commands

```bash
# Root level commands
npm run dev              # Start frontend only
npm run lint             # Lint all code
npm run format           # Format all code
npm run test             # Run all tests
npm run build            # Build for production

# Backend commands
cd backend
npm run dev              # Start backend with nodemon
npm run test             # Run backend tests
npm run lint             # Lint backend code

# Frontend commands
cd frontend
npm run dev              # Start frontend with Vite
npm run build            # Build frontend
npm run test             # Run frontend tests
npm run lint             # Lint frontend code
```

### Git Workflow

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add your feature description"

# Push to your branch
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

### Code Quality

The project uses several tools to maintain code quality:

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **TypeScript**: Type checking

Pre-commit hooks automatically run:
- Linting
- Formatting
- Type checking
- Tests

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find and kill the process using the port
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Or use the bulletproof script which handles this automatically
./start-dev-bulletproof.sh
```

#### 2. MongoDB Connection Failed

**Error:** `MongoNetworkError: failed to connect to server`

**Solutions:**
```bash
# Check if MongoDB is running
brew services list | grep mongodb  # macOS
sudo systemctl status mongod       # Linux

# Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Check connection string in .env file
echo $MONGODB_URI
```

#### 3. Dependencies Installation Failed

**Error:** `npm ERR! peer dep missing`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For frontend/backend specific issues
cd frontend && rm -rf node_modules package-lock.json && npm install
cd backend && rm -rf node_modules package-lock.json && npm install
```

#### 4. TypeScript Errors

**Error:** `TS2307: Cannot find module`

**Solution:**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Install missing type definitions
npm install --save-dev @types/node @types/react

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

#### 5. Environment Variables Not Loading

**Error:** `process.env.VARIABLE_NAME is undefined`

**Solution:**
```bash
# Check if .env files exist
ls -la backend/.env frontend/.env

# Verify environment variables are loaded
cd backend && node -e "require('dotenv').config(); console.log(process.env.PORT)"

# Restart the development servers
./start-dev-bulletproof.sh
```

### Getting Help

If you encounter issues not covered here:

1. **Check the logs**: Look at the console output for error messages
2. **Search existing issues**: Check GitHub issues for similar problems
3. **Ask for help**: Create a new GitHub issue with:
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node.js version, etc.)
   - Relevant log output

---

## Next Steps

Once you have the development environment running:

### 1. Explore the Application

- **Frontend**: http://localhost:5173
  - Navigate through the quantum visualization interface
  - Test the 9-star system navigation
  - Explore the consciousness streams

- **Backend API**: http://localhost:3001/api-docs
  - Browse the API documentation
  - Test endpoints using the interactive docs
  - Check the health endpoint

### 2. Read the Documentation

- **[API Reference](./api/API_REFERENCE.md)**: Complete API documentation
- **[Architecture Guide](./architecture/)**: System architecture overview
- **[Contributing Guidelines](./CONTRIBUTING.md)**: How to contribute to the project

### 3. Run the Tests

```bash
# Run all tests
npm run test

# Run backend tests only
cd backend && npm run test

# Run frontend tests only
cd frontend && npm run test
```

### 4. Start Development

- Choose a feature from the GitHub issues
- Create a new branch
- Make your changes
- Write tests
- Submit a pull request

### 5. Join the Community

- **Discord**: [Join our Discord server](https://discord.gg/qq-verse)
- **GitHub Discussions**: [Participate in discussions](https://github.com/qq-verse/qq-verse/discussions)
- **Weekly Standups**: Check the calendar for team meetings

---

## Development Tools and Extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

### Browser Extensions

- **React Developer Tools**: Debug React components
- **Redux DevTools**: Debug state management
- **MongoDB Compass**: Database GUI

### Useful Commands

```bash
# Check project health
npm run lint && npm run test && npm run build

# Reset development environment
git clean -fdx && npm install && cd frontend && npm install && cd ../backend && npm install && cd ..

# Update all dependencies
npx npm-check-updates -u && npm install

# Generate API documentation
npm run docs:generate

# Analyze bundle size
cd frontend && npm run build:analyze
```

---

## Performance Tips

### Development Performance

- **Use the bulletproof script**: It includes performance optimizations
- **Enable hot reloading**: Both frontend and backend support hot reloading
- **Use TypeScript strict mode**: Catch errors early
- **Monitor memory usage**: Use `htop` or Activity Monitor

### Database Performance

- **Use indexes**: MongoDB indexes are configured automatically
- **Monitor queries**: Use MongoDB Compass to analyze slow queries
- **Connection pooling**: Configured automatically in the backend

---

## Security Considerations

### Development Security

- **Never commit secrets**: Use `.env` files and `.gitignore`
- **Use HTTPS in production**: Configure SSL certificates
- **Validate all inputs**: Use the built-in validation middleware
- **Keep dependencies updated**: Run `npm audit` regularly

### API Security

- **JWT tokens**: Properly configured with expiration
- **Rate limiting**: Configured for all endpoints
- **CORS**: Properly configured for development and production
- **Input validation**: All endpoints validate input data

---

*Last updated: January 27, 2025*

**Need help?** Create an issue on GitHub or join our Discord community!