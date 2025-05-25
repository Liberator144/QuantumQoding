# API Usage Examples

This document provides examples of how to use the QQ-Verse API.

## Authentication

### Register a new user

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

Response:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "1",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

## Quantum State Management

### Get all quantum states

```bash
curl -X GET http://localhost:3000/api/v1/quantum/states \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:

```json
{
  "status": "success",
  "results": 2,
  "data": {
    "states": [
      {
        "id": "1",
        "properties": {
          "name": "Primary State",
          "type": "consciousness",
          "coherenceLevel": 0.95
        },
        "version": 1,
        "lastSynchronized": "2023-01-01T00:00:00.000Z",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      },
      {
        "id": "2",
        "properties": {
          "name": "Secondary State",
          "type": "data",
          "coherenceLevel": 0.87
        },
        "version": 1,
        "lastSynchronized": null,
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Create a new quantum state

```bash
curl -X POST http://localhost:3000/api/v1/quantum/states \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "properties": {
      "name": "New State",
      "type": "quantum",
      "coherenceLevel": 0.92
    }
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "state": {
      "id": "3",
      "properties": {
        "name": "New State",
        "type": "quantum",
        "coherenceLevel": 0.92
      },
      "version": 1,
      "lastSynchronized": null,
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Synchronize quantum states

```bash
curl -X POST http://localhost:3000/api/v1/quantum/states/1/synchronize \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "targetStateId": "2"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "result": {
      "success": true,
      "sourceState": {
        "id": "1",
        "version": 2,
        "lastSynchronized": "2023-01-01T00:00:00.000Z"
      },
      "targetState": {
        "id": "2",
        "version": 2,
        "lastSynchronized": "2023-01-01T00:00:00.000Z"
      },
      "synchronizationDetails": {
        "propertiesSynchronized": ["coherenceLevel"],
        "coherenceScore": 0.95
      }
    }
  }
}
```

## Consciousness Stream Management

### Create a new consciousness stream

```bash
curl -X POST http://localhost:3000/api/v1/consciousness/streams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "Primary Stream",
    "sourceId": "user-1",
    "targetId": "system"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "stream": {
      "id": "1",
      "name": "Primary Stream",
      "sourceId": "user-1",
      "targetId": "system",
      "status": "active",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Send data through consciousness stream

```bash
curl -X POST http://localhost:3000/api/v1/consciousness/streams/1/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "packet": {
      "header": {
        "streamId": "1",
        "sourceId": "user-1",
        "targetId": "system",
        "contextPreservationFlags": {
          "preserveQuantumState": true,
          "preserveContext": true
        }
      },
      "payload": {
        "data": {
          "message": "Hello, Quantum World!"
        },
        "quantumState": {
          "id": "1"
        }
      }
    }
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "packet": {
      "header": {
        "packetId": "1",
        "streamId": "1",
        "sourceId": "user-1",
        "targetId": "system",
        "timestamp": "2023-01-01T00:00:00.000Z",
        "contextPreservationFlags": {
          "preserveQuantumState": true,
          "preserveContext": true
        }
      },
      "payload": {
        "data": {
          "message": "Hello, Quantum World!"
        },
        "quantumState": {
          "id": "1"
        }
      }
    }
  }
}
```