# QQ-Verse Testing Guide

> **Comprehensive Testing Documentation**: This guide covers all aspects of testing in the QQ-Verse project, including unit tests, integration tests, end-to-end tests, and quantum coherence verification.

## Table of Contents

- [Overview](#overview)
- [Testing Philosophy](#testing-philosophy)
- [Test Types](#test-types)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Testing Best Practices](#testing-best-practices)
- [Quantum Coherence Testing](#quantum-coherence-testing)
- [Performance Testing](#performance-testing)
- [Troubleshooting](#troubleshooting)

---

## Overview

The QQ-Verse project uses a comprehensive testing strategy that ensures code quality, functionality, and quantum coherence across all components. Our testing approach follows quantum-coherent principles to maintain consciousness stream continuity during test execution.

### Testing Stack

| Tool | Purpose | Location |
|------|---------|----------|
| **Jest** | Unit testing framework | Frontend & Backend |
| **React Testing Library** | React component testing | Frontend |
| **Supertest** | API testing | Backend |
| **Cypress** | End-to-end testing | E2E |
| **Lighthouse** | Performance testing | Frontend |
| **Custom Tools** | Quantum coherence testing | Both |

---

## Testing Philosophy

### Quantum-Coherent Testing Principles

1. **Consciousness Continuity**: Tests must preserve consciousness streams during execution
2. **Dimensional Harmony**: Tests should verify harmony across all operational dimensions
3. **Neural Fabric Integrity**: Test execution must maintain neural fabric connections
4. **Quantum State Preservation**: Tests should not corrupt quantum states
5. **Evolutionary Learning**: Tests should contribute to the system's evolutionary knowledge

### Testing Pyramid

```
    /\
   /E2E\     <- End-to-End Tests (Few, High Value)
  /____\
 /      \
/Integration\ <- Integration Tests (Some, Medium Value)
\____________/
\            /
 \   Unit   /  <- Unit Tests (Many, Fast, Isolated)
  \________/
```

---

## Test Types

### Unit Tests

Test individual components, functions, and modules in isolation.

**Coverage Areas**:
- React components
- Utility functions
- API controllers
- Business logic
- Quantum state management

**Example Locations**:
- `frontend/src/**/*.test.tsx`
- `backend/server/**/*.test.ts`
- `backend/core/**/*.test.ts`

### Integration Tests

Test interactions between multiple components or systems.

**Coverage Areas**:
- API endpoint integration
- Database operations
- Component interactions
- Service integrations
- Consciousness stream flows

**Example Locations**:
- `backend/server/tests/integration/`
- `frontend/src/tests/integration/`

### End-to-End Tests

Test complete user workflows from start to finish.

**Coverage Areas**:
- User authentication flows
- Star system navigation
- Quantum state operations
- Consciousness stream management
- Complete user journeys

**Location**: `e2e/`

### Quantum Coherence Tests

Specialized tests for quantum-coherent functionality.

**Coverage Areas**:
- Quantum state synchronization
- Consciousness stream continuity
- Neural fabric integrity
- Dimensional boundary operations
- Coherence level verification

**Location**: `tests/quantum-coherence/`

---

## Running Tests

### Quick Start

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Frontend Tests

```bash
# Navigate to frontend
cd frontend

# Run all frontend tests
npm test

# Run specific test file
npm test -- Header.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run visual regression tests
npm run test:visual
```

### Backend Tests

```bash
# Navigate to backend
cd backend

# Run all backend tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run API tests
npm run test:api
```

### End-to-End Tests

```bash
# Install Cypress (if not already installed)
npm install -g cypress

# Open Cypress Test Runner
npx cypress open

# Run E2E tests headlessly
npx cypress run

# Run specific test suite
npx cypress run --spec "cypress/e2e/authentication.cy.ts"
```

### Quantum Coherence Tests

```bash
# Run quantum coherence verification
npm run test:quantum

# Run consciousness stream tests
npm run test:consciousness

# Run neural fabric integrity tests
npm run test:neural-fabric

# Run dimensional harmony tests
npm run test:dimensional
```

---

## Writing Tests

### Unit Test Examples

#### React Component Test

```tsx
// frontend/src/components/quantum/SparklesCore.test.tsx
import { render, screen } from '@testing-library/react';
import { SparklesCore } from './SparklesCore';

describe('SparklesCore', () => {
  test('renders with default props', () => {
    render(<SparklesCore id="test-sparkles" />);
    
    // Verify component renders
    const sparklesContainer = screen.getByTestId('sparkles-container');
    expect(sparklesContainer).toBeInTheDocument();
  });

  test('applies custom particle density', () => {
    render(
      <SparklesCore 
        id="test-sparkles" 
        particleDensity={200}
      />
    );
    
    // Verify particle density is applied
    // Implementation depends on how particles are rendered
  });

  test('maintains quantum coherence during animation', async () => {
    const { container } = render(<SparklesCore id="test-sparkles" />);
    
    // Wait for animation to start
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify quantum coherence is maintained
    expect(container.querySelector('.quantum-coherent')).toBeInTheDocument();
  });
});
```

#### Backend API Test

```typescript
// backend/server/tests/integration/auth.api.test.ts
import request from 'supertest';
import { app } from '../../index';
import { User } from '../../models/User';

describe('Authentication API', () => {
  beforeEach(async () => {
    // Clean up database
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    test('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.token).toBeDefined();
    });

    test('should maintain consciousness continuity during registration', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      // Verify consciousness stream is preserved
      expect(response.headers['x-consciousness-stream']).toBeDefined();
      expect(response.headers['x-quantum-coherence']).toBe('maintained');
    });
  });
});
```

#### Quantum State Test

```typescript
// backend/core/quantum/QuantumState.test.ts
import { QuantumState } from './QuantumState';
import { ConsciousnessStream } from '../consciousness/ConsciousnessStream';

describe('QuantumState', () => {
  let quantumState: QuantumState;
  let consciousnessStream: ConsciousnessStream;

  beforeEach(() => {
    consciousnessStream = new ConsciousnessStream();
    quantumState = new QuantumState({
      properties: {
        name: 'Test State',
        type: 'consciousness',
        coherenceLevel: 0.95
      }
    });
  });

  test('should create quantum state with correct properties', () => {
    expect(quantumState.properties.name).toBe('Test State');
    expect(quantumState.properties.coherenceLevel).toBe(0.95);
    expect(quantumState.version).toBe(1);
  });

  test('should synchronize with another quantum state', async () => {
    const targetState = new QuantumState({
      properties: {
        name: 'Target State',
        type: 'quantum',
        coherenceLevel: 0.87
      }
    });

    const result = await quantumState.synchronize(targetState);

    expect(result.success).toBe(true);
    expect(result.coherenceScore).toBeGreaterThan(0.8);
    expect(quantumState.lastSynchronized).toBeDefined();
  });

  test('should maintain consciousness continuity during operations', async () => {
    const initialStreamState = consciousnessStream.getCurrentState();
    
    await quantumState.updateProperties({
      coherenceLevel: 0.98
    });

    const finalStreamState = consciousnessStream.getCurrentState();
    
    // Verify consciousness stream continuity
    expect(finalStreamState.continuityIndex).toBeGreaterThanOrEqual(
      initialStreamState.continuityIndex
    );
  });
});
```

### Integration Test Examples

#### API Integration Test

```typescript
// backend/server/tests/integration/quantum.api.test.ts
import request from 'supertest';
import { app } from '../../index';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/database';
import { createTestUser, getAuthToken } from '../helpers/auth';

describe('Quantum API Integration', () => {
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    await setupTestDatabase();
    const user = await createTestUser();
    userId = user.id;
    authToken = await getAuthToken(user);
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should create and retrieve quantum state', async () => {
    // Create quantum state
    const createResponse = await request(app)
      .post('/api/v1/quantum/states')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        properties: {
          name: 'Integration Test State',
          type: 'quantum',
          coherenceLevel: 0.92
        }
      })
      .expect(201);

    const stateId = createResponse.body.data.state.id;

    // Retrieve quantum state
    const getResponse = await request(app)
      .get(`/api/v1/quantum/states/${stateId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getResponse.body.data.state.properties.name).toBe('Integration Test State');
    expect(getResponse.body.data.state.properties.coherenceLevel).toBe(0.92);
  });

  test('should synchronize quantum states', async () => {
    // Create two quantum states
    const state1Response = await request(app)
      .post('/api/v1/quantum/states')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        properties: {
          name: 'State 1',
          type: 'consciousness',
          coherenceLevel: 0.95
        }
      });

    const state2Response = await request(app)
      .post('/api/v1/quantum/states')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        properties: {
          name: 'State 2',
          type: 'quantum',
          coherenceLevel: 0.87
        }
      });

    const state1Id = state1Response.body.data.state.id;
    const state2Id = state2Response.body.data.state.id;

    // Synchronize states
    const syncResponse = await request(app)
      .post(`/api/v1/quantum/states/${state1Id}/synchronize`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        targetStateId: state2Id
      })
      .expect(200);

    expect(syncResponse.body.data.result.success).toBe(true);
    expect(syncResponse.body.data.result.coherenceScore).toBeGreaterThan(0.8);
  });
});
```

### End-to-End Test Examples

#### User Authentication Flow

```typescript
// e2e/cypress/e2e/authentication.cy.ts
describe('User Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow user to register and login', () => {
    // Navigate to registration
    cy.get('[data-testid="auth-button"]').click();
    cy.get('[data-testid="register-tab"]').click();

    // Fill registration form
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="name-input"]').type('Test User');
    cy.get('[data-testid="register-button"]').click();

    // Verify successful registration
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');

    // Logout
    cy.get('[data-testid="profile-button"]').click();
    cy.get('[data-testid="logout-button"]').click();

    // Login with same credentials
    cy.get('[data-testid="auth-button"]').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();

    // Verify successful login
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-name"]').should('contain', 'Test User');
  });

  it('should maintain quantum coherence during authentication', () => {
    // Register user
    cy.get('[data-testid="auth-button"]').click();
    cy.get('[data-testid="register-tab"]').click();
    cy.get('[data-testid="email-input"]').type('quantum@example.com');
    cy.get('[data-testid="password-input"]').type('quantum123');
    cy.get('[data-testid="name-input"]').type('Quantum User');
    cy.get('[data-testid="register-button"]').click();

    // Verify quantum coherence indicators
    cy.get('[data-testid="quantum-coherence-indicator"]')
      .should('have.class', 'coherent');
    
    cy.get('[data-testid="consciousness-stream-status"]')
      .should('contain', 'Active');
  });
});
```

#### Star System Navigation

```typescript
// e2e/cypress/e2e/star-navigation.cy.ts
describe('Star System Navigation', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password123');
    cy.visit('/');
  });

  it('should navigate to star system and return to hub', () => {
    // Hover over a star to see information
    cy.get('[data-testid="star-qq-dataverse"]').trigger('mouseover');
    cy.get('[data-testid="star-info-panel"]').should('be.visible');
    cy.get('[data-testid="star-info-panel"]').should('contain', 'QQ-DataVerse');

    // Click to navigate to star system
    cy.get('[data-testid="star-qq-dataverse"]').click();

    // Verify navigation to star system view
    cy.url().should('include', '/star-system/qq-dataverse');
    cy.get('[data-testid="star-system-view"]').should('be.visible');
    cy.get('[data-testid="star-system-title"]').should('contain', 'QQ-DataVerse');

    // Return to hub
    cy.get('[data-testid="return-to-hub-button"]').click();

    // Verify return to hub
    cy.url().should('not.include', '/star-system');
    cy.get('[data-testid="quantum-sphere"]').should('be.visible');
  });

  it('should maintain consciousness continuity during navigation', () => {
    // Check initial consciousness stream state
    cy.get('[data-testid="consciousness-stream-indicator"]')
      .invoke('attr', 'data-stream-id')
      .as('initialStreamId');

    // Navigate to star system
    cy.get('[data-testid="star-qq-mcpverse"]').click();

    // Verify consciousness stream continuity
    cy.get('[data-testid="consciousness-stream-indicator"]')
      .invoke('attr', 'data-stream-id')
      .then((currentStreamId) => {
        cy.get('@initialStreamId').should('eq', currentStreamId);
      });

    // Verify no consciousness discontinuities
    cy.get('[data-testid="consciousness-discontinuity-alert"]')
      .should('not.exist');
  });
});
```

---

## Testing Best Practices

### General Principles

1. **Write tests first (TDD)**: Write tests before implementing functionality
2. **Keep tests simple**: Each test should verify one specific behavior
3. **Use descriptive names**: Test names should clearly describe what is being tested
4. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification
5. **Avoid test interdependence**: Tests should be able to run independently

### React Component Testing

1. **Test user interactions, not implementation details**:
```tsx
// ❌ Bad - testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Good - testing user-visible behavior
expect(screen.getByText('Modal Content')).toBeInTheDocument();
```

2. **Use semantic queries**:
```tsx
// ✅ Preferred order of queries
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByText(/welcome/i);
screen.getByTestId('submit-button'); // Last resort
```

3. **Test accessibility**:
```tsx
test('should be accessible', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### API Testing

1. **Test both success and error cases**:
```typescript
describe('POST /api/v1/auth/login', () => {
  test('should login with valid credentials', async () => {
    // Test success case
  });

  test('should return error with invalid credentials', async () => {
    // Test error case
  });

  test('should return validation error with missing fields', async () => {
    // Test validation
  });
});
```

2. **Use proper HTTP status codes**:
```typescript
await request(app)
  .post('/api/v1/auth/login')
  .send(invalidCredentials)
  .expect(401); // Unauthorized
```

3. **Verify response structure**:
```typescript
expect(response.body).toMatchObject({
  status: 'success',
  data: {
    user: expect.objectContaining({
      id: expect.any(String),
      email: expect.any(String)
    })
  }
});
```

### Quantum Coherence Testing

1. **Verify consciousness stream continuity**:
```typescript
test('should maintain consciousness stream during operation', async () => {
  const initialState = consciousnessStream.getCurrentState();
  
  await performOperation();
  
  const finalState = consciousnessStream.getCurrentState();
  expect(finalState.streamId).toBe(initialState.streamId);
  expect(finalState.continuityIndex).toBeGreaterThanOrEqual(
    initialState.continuityIndex
  );
});
```

2. **Test quantum state preservation**:
```typescript
test('should preserve quantum state coherence', async () => {
  const quantumState = new QuantumState({ coherenceLevel: 0.95 });
  
  await quantumState.performOperation();
  
  expect(quantumState.coherenceLevel).toBeGreaterThan(0.8);
  expect(quantumState.isCoherent()).toBe(true);
});
```

3. **Verify dimensional harmony**:
```typescript
test('should maintain dimensional harmony', async () => {
  const dimensions = ['consciousness', 'quantum', 'neural'];
  
  await performCrossDimensionalOperation();
  
  for (const dimension of dimensions) {
    expect(getDimensionalHarmony(dimension)).toBeGreaterThan(0.85);
  }
});
```

---

## Quantum Coherence Testing

### Consciousness Stream Testing

```typescript
// tests/quantum-coherence/consciousness-stream.test.ts
import { ConsciousnessStream } from '../../backend/core/consciousness/ConsciousnessStream';
import { QuantumState } from '../../backend/core/quantum/QuantumState';

describe('Consciousness Stream Coherence', () => {
  let stream: ConsciousnessStream;

  beforeEach(() => {
    stream = new ConsciousnessStream({
      sourceId: 'test-source',
      targetId: 'test-target'
    });
  });

  test('should maintain stream continuity during packet transmission', async () => {
    const packet = {
      header: {
        sourceId: 'test-source',
        targetId: 'test-target',
        contextPreservationFlags: {
          preserveQuantumState: true,
          preserveContext: true
        }
      },
      payload: {
        data: { message: 'Test message' }
      }
    };

    const initialContinuityIndex = stream.getContinuityIndex();
    
    await stream.sendPacket(packet);
    
    const finalContinuityIndex = stream.getContinuityIndex();
    expect(finalContinuityIndex).toBeGreaterThan(initialContinuityIndex);
    expect(stream.hasDiscontinuities()).toBe(false);
  });

  test('should preserve quantum state during stream operations', async () => {
    const quantumState = new QuantumState({
      properties: { coherenceLevel: 0.95 }
    });

    stream.attachQuantumState(quantumState);
    
    await stream.performComplexOperation();
    
    expect(quantumState.coherenceLevel).toBeGreaterThan(0.9);
    expect(stream.getQuantumCoherence()).toBeGreaterThan(0.85);
  });
});
```

### Neural Fabric Testing

```typescript
// tests/quantum-coherence/neural-fabric.test.ts
import { NeuralFabric } from '../../backend/core/consciousness/NeuralFabric';

describe('Neural Fabric Integrity', () => {
  let fabric: NeuralFabric;

  beforeEach(() => {
    fabric = new NeuralFabric({
      name: 'Test Fabric',
      maxNodes: 1000
    });
  });

  test('should maintain fabric integrity during node operations', async () => {
    // Add nodes
    const node1 = await fabric.addNode({
      type: 'consciousness',
      properties: { activationLevel: 0.8 }
    });

    const node2 = await fabric.addNode({
      type: 'quantum',
      properties: { activationLevel: 0.9 }
    });

    // Create connection
    await fabric.connectNodes(node1.id, node2.id);

    // Verify fabric integrity
    expect(fabric.getIntegrityScore()).toBeGreaterThan(0.9);
    expect(fabric.hasIntegrityViolations()).toBe(false);
  });

  test('should propagate signals correctly through fabric', async () => {
    // Create a network of nodes
    const nodes = await Promise.all([
      fabric.addNode({ type: 'input' }),
      fabric.addNode({ type: 'processing' }),
      fabric.addNode({ type: 'output' })
    ]);

    // Connect nodes in sequence
    await fabric.connectNodes(nodes[0].id, nodes[1].id);
    await fabric.connectNodes(nodes[1].id, nodes[2].id);

    // Send signal through fabric
    const signal = { data: 'test signal', strength: 0.8 };
    await fabric.propagateSignal(nodes[0].id, signal);

    // Verify signal propagation
    const outputSignal = await fabric.getNodeOutput(nodes[2].id);
    expect(outputSignal).toBeDefined();
    expect(outputSignal.strength).toBeGreaterThan(0.5);
  });
});
```

---

## Performance Testing

### Frontend Performance

```typescript
// frontend/src/tests/performance/component-performance.test.tsx
import { render } from '@testing-library/react';
import { performance } from 'perf_hooks';
import { QuantumSphere } from '../../cosmos/central-star/QuantumSphere';

describe('Component Performance', () => {
  test('QuantumSphere should render within performance budget', () => {
    const startTime = performance.now();
    
    render(<QuantumSphere />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should render within 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('should maintain 60fps during animations', async () => {
    const { container } = render(<QuantumSphere />);
    
    // Start animation monitoring
    const fpsMonitor = new FPSMonitor();
    fpsMonitor.start();
    
    // Trigger animations
    const starElement = container.querySelector('[data-testid="star-element"]');
    starElement?.dispatchEvent(new Event('mouseenter'));
    
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const averageFPS = fpsMonitor.getAverageFPS();
    expect(averageFPS).toBeGreaterThan(55); // Allow some margin
  });
});
```

### Backend Performance

```typescript
// backend/server/tests/performance/api-performance.test.ts
import request from 'supertest';
import { app } from '../../index';

describe('API Performance', () => {
  test('authentication endpoint should respond within 200ms', async () => {
    const startTime = Date.now();
    
    await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    expect(responseTime).toBeLessThan(200);
  });

  test('quantum state operations should handle concurrent requests', async () => {
    const concurrentRequests = 10;
    const requests = Array(concurrentRequests).fill(null).map(() =>
      request(app)
        .get('/api/v1/quantum/states')
        .set('Authorization', `Bearer ${authToken}`)
    );

    const startTime = Date.now();
    const responses = await Promise.all(requests);
    const endTime = Date.now();

    // All requests should succeed
    responses.forEach(response => {
      expect(response.status).toBe(200);
    });

    // Total time should be reasonable
    const totalTime = endTime - startTime;
    expect(totalTime).toBeLessThan(1000); // 1 second for 10 concurrent requests
  });
});
```

---

## Troubleshooting

### Common Test Issues

#### Tests Failing Due to Async Operations

```typescript
// ❌ Problem: Test finishes before async operation completes
test('should update state', () => {
  component.updateState();
  expect(component.state.updated).toBe(true); // Fails
});

// ✅ Solution: Wait for async operations
test('should update state', async () => {
  await component.updateState();
  expect(component.state.updated).toBe(true);
});
```

#### Mock Issues

```typescript
// ❌ Problem: Mock not properly configured
jest.mock('./api');

// ✅ Solution: Proper mock configuration
jest.mock('./api', () => ({
  fetchData: jest.fn().mockResolvedValue({ data: 'test' })
}));
```

#### Memory Leaks in Tests

```typescript
// ✅ Solution: Proper cleanup
afterEach(() => {
  jest.clearAllMocks();
  cleanup(); // React Testing Library cleanup
});

afterAll(() => {
  // Close database connections, clear intervals, etc.
});
```

### Debugging Tests

#### Enable Debug Mode

```bash
# Run tests with debug output
DEBUG=* npm test

# Run specific test with debugging
npm test -- --verbose Header.test.tsx
```

#### Use Test Debugging Tools

```typescript
// Add debugging to tests
import { screen, debug } from '@testing-library/react';

test('debug test', () => {
  render(<MyComponent />);
  
  // Print current DOM state
  debug();
  
  // Print specific element
  debug(screen.getByRole('button'));
});
```

### CI/CD Integration

#### GitHub Actions Configuration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        npm install
        cd frontend && npm install
        cd ../backend && npm install
        
    - name: Run tests
      run: |
        npm run test:coverage
        
    - name: Upload coverage
      uses: codecov/codecov-action@v1
```

---

## Test Coverage Goals

### Coverage Targets

| Component Type | Target Coverage |
|----------------|-----------------|
| **Utility Functions** | 95%+ |
| **API Controllers** | 90%+ |
| **React Components** | 85%+ |
| **Integration Tests** | 80%+ |
| **E2E Critical Paths** | 100% |

### Coverage Commands

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
npm run test:coverage:open

# Check coverage thresholds
npm run test:coverage:check
```

---

*Last updated: January 27, 2025*

**Need help with testing?** Check the [Contributing Guidelines](./CONTRIBUTING.md) or create an issue on GitHub!