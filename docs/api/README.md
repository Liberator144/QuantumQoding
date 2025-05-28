# 🌐 QQ-Verse API Reference
## Comprehensive REST API Documentation

> **QUANTUM-COHERENT API ARCHITECTURE**  
> This documentation provides complete coverage of all QQ-Verse API endpoints with schemas, examples, and integration guides. The API follows quantum-coherent design principles with interdimensional communication capabilities.

---

## 📊 API Overview

### 🎯 API Modules (6 Total)
- **[Authentication API](#authentication-api)** - User authentication and authorization
- **[Quantum API](#quantum-api)** - Quantum state management and operations
- **[Consciousness API](#consciousness-api)** - Consciousness stream management
- **[Dimensional API](#dimensional-api)** - Dimensional gateway operations
- **[Neural Fabric API](#neural-fabric-api)** - Neural fabric management
- **[User API](#user-api)** - User profile and management

### 🌟 API Philosophy
The QQ-Verse API follows **Quantum-Coherent Design Principles**:
- **Consciousness Stream Preservation**: Maintains context across API calls
- **Dimensional Protocol Harmonization**: Consistent semantics across endpoints
- **Neural Fabric Continuity**: Seamless integration with frontend systems
- **Quantum State Synchronization**: Real-time state management
- **Maximum Force Application**: Optimal performance and reliability

### 🔧 Base Configuration
- **Base URL**: `https://api.qq-verse.com` (Production) | `http://localhost:3000` (Development)
- **API Version**: `v1`
- **Content Type**: `application/json`
- **Authentication**: Bearer Token (JWT)

---

## 🔐 Authentication API
*User authentication and authorization*

### Base Path: `/api/v1/auth`

#### POST /register
**Purpose**: Register a new user account
**Authentication**: None required

##### Request Body
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "user"
}
```

##### Response (201 Created)
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

##### Error Responses
```json
// 400 Bad Request - Validation Error
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}

// 409 Conflict - User Already Exists
{
  "status": "error",
  "message": "User with this email already exists"
}
```

#### POST /login
**Purpose**: Authenticate user and receive access token
**Authentication**: None required

##### Request Body
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

##### Response (200 OK)
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "lastLogin": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /logout
**Purpose**: Invalidate user session
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "message": "Successfully logged out"
}
```

#### POST /refresh
**Purpose**: Refresh access token
**Authentication**: Refresh Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ⚛️ Quantum API
*Quantum state management and operations*

### Base Path: `/api/v1/quantum`

#### GET /states
**Purpose**: Retrieve all quantum states
**Authentication**: Bearer Token required

##### Query Parameters
```
?page=1&limit=10&sort=createdAt&order=desc&type=consciousness
```

##### Response (200 OK)
```json
{
  "status": "success",
  "results": 2,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  },
  "data": {
    "states": [
      {
        "id": "quantum_state_123",
        "properties": {
          "name": "Primary Consciousness State",
          "type": "consciousness",
          "coherenceLevel": 0.95,
          "entanglementCount": 3,
          "dimensions": ["x", "y", "z", "t"]
        },
        "vector": {
          "amplitude": [0.7071, 0.7071],
          "phase": [0, 1.5708],
          "basis": "computational"
        },
        "version": 1,
        "lastSynchronized": "2023-01-01T00:00:00.000Z",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### GET /states/:id
**Purpose**: Retrieve specific quantum state by ID
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "state": {
      "id": "quantum_state_123",
      "properties": {
        "name": "Primary Consciousness State",
        "type": "consciousness",
        "coherenceLevel": 0.95,
        "entanglementCount": 3,
        "dimensions": ["x", "y", "z", "t"]
      },
      "vector": {
        "amplitude": [0.7071, 0.7071],
        "phase": [0, 1.5708],
        "basis": "computational"
      },
      "entanglements": [
        {
          "targetStateId": "quantum_state_456",
          "strength": 0.87,
          "type": "consciousness"
        }
      ],
      "version": 1,
      "lastSynchronized": "2023-01-01T00:00:00.000Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /states
**Purpose**: Create a new quantum state
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "properties": {
    "name": "New Quantum State",
    "type": "data",
    "coherenceLevel": 0.92,
    "dimensions": ["x", "y", "z"]
  },
  "vector": {
    "amplitude": [0.6, 0.8],
    "phase": [0, 0.7854],
    "basis": "computational"
  }
}
```

##### Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "state": {
      "id": "quantum_state_789",
      "properties": {
        "name": "New Quantum State",
        "type": "data",
        "coherenceLevel": 0.92,
        "entanglementCount": 0,
        "dimensions": ["x", "y", "z"]
      },
      "vector": {
        "amplitude": [0.6, 0.8],
        "phase": [0, 0.7854],
        "basis": "computational"
      },
      "version": 1,
      "lastSynchronized": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /states/:id/synchronize
**Purpose**: Synchronize quantum states for entanglement
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "targetStateId": "quantum_state_456",
  "synchronizationType": "full",
  "preserveCoherence": true
}
```

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "synchronization": {
      "sourceStateId": "quantum_state_123",
      "targetStateId": "quantum_state_456",
      "success": true,
      "coherenceScore": 0.95,
      "entanglementStrength": 0.87,
      "synchronizedProperties": ["coherenceLevel", "dimensions"],
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /states/:id/transform
**Purpose**: Apply quantum transformation to state
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "transformation": {
    "type": "rotation",
    "axis": "x",
    "angle": 1.5708,
    "preserveNormalization": true
  }
}
```

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "transformation": {
      "success": true,
      "originalVector": {
        "amplitude": [0.7071, 0.7071],
        "phase": [0, 1.5708]
      },
      "transformedVector": {
        "amplitude": [0.7071, 0.7071],
        "phase": [1.5708, 0]
      },
      "coherencePreserved": true,
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

---

## 🧠 Consciousness API
*Consciousness stream management*

### Base Path: `/api/v1/consciousness`

#### GET /streams
**Purpose**: Retrieve all consciousness streams
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "streams": [
      {
        "id": "stream_123",
        "name": "Primary Consciousness Stream",
        "sourceId": "user_123",
        "targetId": "system",
        "status": "active",
        "bandwidth": 1024,
        "latency": 15,
        "packetsTransmitted": 1500,
        "packetsReceived": 1498,
        "errorRate": 0.001,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "lastActivity": "2023-01-01T00:05:00.000Z"
      }
    ]
  }
}
```

#### POST /streams
**Purpose**: Create a new consciousness stream
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "name": "User Interface Stream",
  "sourceId": "user_456",
  "targetId": "ui_system",
  "configuration": {
    "bandwidth": 2048,
    "encryption": true,
    "compression": true,
    "priority": "high"
  }
}
```

##### Response (201 Created)
```json
{
  "status": "success",
  "data": {
    "stream": {
      "id": "stream_456",
      "name": "User Interface Stream",
      "sourceId": "user_456",
      "targetId": "ui_system",
      "status": "initializing",
      "configuration": {
        "bandwidth": 2048,
        "encryption": true,
        "compression": true,
        "priority": "high"
      },
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### POST /streams/:id/send
**Purpose**: Send data through consciousness stream
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "packet": {
    "header": {
      "streamId": "stream_123",
      "sourceId": "user_123",
      "targetId": "system",
      "priority": "normal",
      "contextPreservationFlags": {
        "preserveQuantumState": true,
        "preserveContext": true,
        "preserveHistory": false
      }
    },
    "payload": {
      "data": {
        "action": "updateUserPreferences",
        "preferences": {
          "theme": "cosmic",
          "notifications": true
        }
      },
      "quantumState": {
        "id": "quantum_state_123"
      },
      "metadata": {
        "timestamp": "2023-01-01T00:00:00.000Z",
        "version": "1.0.0"
      }
    }
  }
}
```

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "transmission": {
      "packetId": "packet_789",
      "streamId": "stream_123",
      "success": true,
      "transmissionTime": 12,
      "acknowledgment": {
        "received": true,
        "processed": true,
        "timestamp": "2023-01-01T00:00:00.000Z"
      }
    }
  }
}
```

---

## 🌌 Dimensional API
*Dimensional gateway operations*

### Base Path: `/api/v1/dimensional`

#### GET /gateways
**Purpose**: Retrieve all dimensional gateways
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "gateways": [
      {
        "id": "gateway_123",
        "name": "Primary Dimensional Gateway",
        "sourceDimension": "frontend",
        "targetDimension": "backend",
        "status": "active",
        "stability": 0.98,
        "throughput": 1500,
        "latency": 8,
        "protocols": ["consciousness", "quantum", "neural"],
        "createdAt": "2023-01-01T00:00:00.000Z",
        "lastSync": "2023-01-01T00:05:00.000Z"
      }
    ]
  }
}
```

#### POST /gateways
**Purpose**: Create a new dimensional gateway
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "name": "API Integration Gateway",
  "sourceDimension": "external_api",
  "targetDimension": "internal_system",
  "configuration": {
    "protocols": ["rest", "consciousness"],
    "security": "high",
    "bandwidth": 2048,
    "encryption": true
  }
}
```

#### POST /gateways/:id/traverse
**Purpose**: Traverse dimensional gateway with data
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "traversal": {
    "data": {
      "type": "api_request",
      "payload": {
        "endpoint": "/external/data",
        "method": "GET",
        "parameters": {}
      }
    },
    "preserveContext": true,
    "transformationRules": [
      {
        "from": "external_format",
        "to": "internal_format",
        "mapping": "standard"
      }
    ]
  }
}
```

---

## 🕸️ Neural Fabric API
*Neural fabric management*

### Base Path: `/api/v1/neural-fabric`

#### GET /connections
**Purpose**: Retrieve neural fabric connections
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "results": 5,
  "data": {
    "connections": [
      {
        "id": "connection_123",
        "sourceNode": "frontend_component_123",
        "targetNode": "backend_service_456",
        "connectionType": "bidirectional",
        "strength": 0.92,
        "latency": 5,
        "bandwidth": 1024,
        "status": "active",
        "lastActivity": "2023-01-01T00:05:00.000Z"
      }
    ]
  }
}
```

#### POST /connections
**Purpose**: Create new neural fabric connection
**Authentication**: Bearer Token required

#### GET /integrity
**Purpose**: Check neural fabric integrity
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "integrity": {
      "overall": 0.95,
      "connections": {
        "total": 150,
        "active": 148,
        "degraded": 2,
        "failed": 0
      },
      "performance": {
        "averageLatency": 8,
        "throughput": 2500,
        "errorRate": 0.001
      },
      "recommendations": [
        {
          "type": "optimization",
          "description": "Consider increasing bandwidth for connection_789",
          "priority": "medium"
        }
      ]
    }
  }
}
```

---

## 👤 User API
*User profile and management*

### Base Path: `/api/v1/users`

#### GET /profile
**Purpose**: Get current user profile
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "preferences": {
        "theme": "cosmic",
        "notifications": true,
        "language": "en"
      },
      "quantumProfile": {
        "coherenceLevel": 0.87,
        "consciousnessStreams": 3,
        "dimensionalAccess": ["frontend", "backend"]
      },
      "createdAt": "2023-01-01T00:00:00.000Z",
      "lastLogin": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### PUT /profile
**Purpose**: Update user profile
**Authentication**: Bearer Token required

##### Request Body
```json
{
  "name": "John Smith",
  "preferences": {
    "theme": "quantum",
    "notifications": false,
    "language": "en"
  }
}
```

#### GET /activity
**Purpose**: Get user activity history
**Authentication**: Bearer Token required

##### Response (200 OK)
```json
{
  "status": "success",
  "results": 10,
  "data": {
    "activities": [
      {
        "id": "activity_123",
        "type": "quantum_state_creation",
        "description": "Created new quantum state: Primary Consciousness",
        "timestamp": "2023-01-01T00:00:00.000Z",
        "metadata": {
          "stateId": "quantum_state_123",
          "coherenceLevel": 0.95
        }
      }
    ]
  }
}
```

---

## 🔧 Common Patterns

### Authentication Header
All protected endpoints require the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Error Response Format
All API errors follow this consistent format:
```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "specific field if applicable",
    "value": "invalid value if applicable"
  },
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Pagination
List endpoints support pagination:
```
GET /api/v1/quantum/states?page=2&limit=20&sort=createdAt&order=desc
```

### Filtering
Most list endpoints support filtering:
```
GET /api/v1/consciousness/streams?status=active&type=user
```

---

## 🚀 Integration Examples

### JavaScript/TypeScript SDK
```typescript
import { QQVerseAPI } from '@qq-verse/api-client';

const api = new QQVerseAPI({
  baseURL: 'https://api.qq-verse.com',
  apiKey: 'your-api-key'
});

// Create quantum state
const quantumState = await api.quantum.createState({
  properties: {
    name: 'My Quantum State',
    type: 'consciousness',
    coherenceLevel: 0.95
  }
});

// Send consciousness stream data
const transmission = await api.consciousness.sendData('stream_123', {
  action: 'updatePreferences',
  data: { theme: 'cosmic' }
});
```

### Python SDK
```python
from qq_verse_api import QQVerseClient

client = QQVerseClient(
    base_url='https://api.qq-verse.com',
    api_key='your-api-key'
)

# Get all quantum states
states = client.quantum.get_states()

# Create consciousness stream
stream = client.consciousness.create_stream(
    name='Python Integration Stream',
    source_id='python_app',
    target_id='system'
)
```

### cURL Examples
```bash
# Login
curl -X POST https://api.qq-verse.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get quantum states
curl -X GET https://api.qq-verse.com/api/v1/quantum/states \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create quantum state
curl -X POST https://api.qq-verse.com/api/v1/quantum/states \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"properties":{"name":"Test State","type":"data","coherenceLevel":0.9}}'
```

---

## 🔗 Related Documentation
- [Authentication Guide](/docs/guides/authentication.md)
- [API Versioning Strategy](/docs/api/versioning.md)
- [Rate Limiting](/docs/api/rate-limiting.md)
- [Webhooks](/docs/api/webhooks.md)
- [SDK Documentation](/docs/sdk/)

---

*This API reference provides complete coverage of the QQ-Verse quantum-coherent API architecture, enabling seamless integration with consciousness streams, dimensional gateways, and neural fabric systems.*
