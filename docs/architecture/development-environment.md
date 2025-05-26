# QQ-Verse Development Environment Setup Guide

This guide provides step-by-step instructions for setting up the QQ-Verse development environment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later)
- **npm** (v8 or later)
- **Git**
- **Visual Studio Code** (recommended) or your preferred IDE

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/QuantumQoding/QQ-Verse-.git

# Navigate to the project directory
cd QQ-Verse
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

#### Frontend Environment

Create a `.env.local` file in the `frontend` directory:

```
# Frontend environment variables
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_QUANTUM_EFFECTS=true
VITE_DEBUG_MODE=true
```

#### Backend Environment

Create a `.env` file in the `backend` directory:

```
# Backend environment variables
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/qqverse
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

### 4. Set Up Local Development Server

#### Start the Frontend Development Server

```bash
# Navigate to the frontend directory
cd frontend

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### Start the Backend Development Server

```bash
# Navigate to the backend directory
cd backend

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:3001`.

### 5. Database Setup (Optional)

If you need to work with a local database:

1. Install PostgreSQL
2. Create a database named `qqverse`
3. Run the database migrations:

```bash
cd backend
npm run migrate
```

### 6. Configure IDE

#### Visual Studio Code Extensions

Install the following recommended extensions:

- ESLint
- Prettier
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- GitLens
- Quantum Coherence Validator

#### VS Code Settings

Add the following to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

## Running Tests

### Frontend Tests

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

### Quantum Coherence Tests

```bash
# Run from the root directory
npm run verify:quantum-coherence
```

## Build Process

### Build Frontend

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

### Build Backend

```bash
cd backend
npm run build
```

The build output will be in the `backend/dist` directory.

## Troubleshooting

### Common Issues

#### Node.js Version Mismatch

If you encounter errors related to Node.js version:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install and use the correct Node.js version
nvm install 18
nvm use 18
```

#### Dependency Installation Errors

If you encounter errors during dependency installation:

```bash
# Clear npm cache
npm cache clean --force

# Try installing dependencies again
npm install
```

#### Quantum Coherence Errors

If you encounter quantum coherence errors:

```bash
# Reset neural fabric
npm run reset:neural-fabric

# Verify consciousness stream
npm run verify:consciousness
```

## Development Workflow

1. Create a new branch from `develop` following the [Git workflow](./git-workflow.md)
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request

## Additional Resources

- [Git Workflow Guide](./git-workflow.md)
- [Development Standards](./development-standards.md)
- [API Documentation](../api/README.md)
- [Component Documentation](../components/README.md)

## Conclusion

```bash
cd frontend
npm test
```

### Backend Tests

```bash
cd backend
npm test
```

### Quantum Coherence Tests

```bash
# Run from the root directory
npm run verify:quantum-coherence
```

## Build Process

### Build Frontend

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

### Build Backend

```bash
cd backend
npm run build
```

The build output will be in the `backend/dist` directory.

## Troubleshooting

### Common Issues

#### Node.js Version Mismatch

If you encounter errors related to Node.js version:

```bash
# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Install and use the correct Node.js version
nvm install 18
nvm use 18
```

#### Dependency Installation Errors

If you encounter errors during dependency installation:

```bash
# Clear npm cache
npm cache clean --force

# Try installing dependencies again
npm install
```

#### Quantum Coherence Errors

If you encounter quantum coherence errors:

```bash
# Reset neural fabric
npm run reset:neural-fabric

# Verify consciousness stream
npm run verify:consciousness
```

## Development Workflow

1. Create a new branch from `develop` following the [Git workflow](./git-workflow.md)
2. Make your changes
3. Run tests to ensure everything works
4. Submit a pull request

## Additional Resources

- [Git Workflow Guide](./git-workflow.md)
- [Development Standards](./development-standards.md)
- [API Documentation](../api/README.md)
- [Component Documentation](../components/README.md)

## Conclusion

You should now have a fully functional QQ-Verse development environment. If you encounter any issues not covered in this guide, please reach out to the development team or create an issue in the repository.