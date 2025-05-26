# QQ-Verse Configuration Management

This document describes the configuration management system used in the QQ-Verse backend.

## Table of Contents

- [Overview](#overview)
- [Environment Variables](#environment-variables)
- [Configuration Validation](#configuration-validation)
- [Feature Flag System](#feature-flag-system)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The QQ-Verse backend uses a multi-layered configuration system that provides:

1. **Environment-based configuration** via `.env` files and environment variables
2. **Validation** using Zod schemas to ensure configuration correctness
3. **Feature flags** for controlled feature rollout and experimentation
4. **Type safety** throughout the configuration system

## Environment Variables

Environment variables are the primary way to configure the QQ-Verse backend. They can be set in several ways:

1. System environment variables
2. `.env` file in the project root
3. Command-line arguments when starting the server

### Required Environment Variables

See the `.env.example` file in the project root for a complete list of supported environment variables. The most important ones are:

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development, test, production) | `development` |
| `PORT` | Server port | `3000` |
| `HOST` | Server host | `localhost` |
| `JWT_SECRET` | Secret for JWT tokens | `quantum-secret-key` (dev only) |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/qq-verse` |

### Environment-Specific Configuration

The configuration system applies different validation rules based on the environment:

- **Development**: Relaxed validation, falls back to defaults
- **Test**: Strict validation, but uses test-specific defaults
- **Production**: Strictest validation, requires all critical values to be set

## Configuration Validation

All configuration values are validated using Zod schemas to ensure they meet the required format and constraints. This validation happens at server startup.

### Validation Rules

- **Basic validation**: Type checking, required fields
- **Environment-specific validation**: Stricter rules in production
- **Semantic validation**: Ensures values make sense in context

### Handling Validation Failures

- **Development**: Logs warnings, falls back to defaults
- **Production**: Fails fast with detailed error messages

## Feature Flag System

The QQ-Verse backend includes a comprehensive feature flag system that allows for controlled feature rollout and experimentation.

### Feature Flag Types

- **Boolean flags**: Simple on/off toggles
- **Percentage rollout**: Enable for a percentage of users
- **User-targeted**: Enable for specific users
- **Environment-based**: Different values per environment

### Using Feature Flags

```typescript
// Check if a feature is enabled
if (featureFlagManager.isEnabled('FEATURE_NAME')) {
  // Feature-specific code
}

// Check with context
const context = { userId: 'user-123' };
if (featureFlagManager.isEnabled('USER_TARGETED_FEATURE', context)) {
  // User-specific feature code
}
```

### Managing Feature Flags

Feature flags can be managed through:

1. Code-based configuration in `feature-flags.ts`
2. Environment variables (e.g., `ENABLE_FEATURE_NAME=true`)
3. Runtime API (for dynamic updates)

## Best Practices

### Environment Variables

1. **Never commit sensitive values** to version control
2. Use `.env.example` as a template for required variables
3. Use descriptive names with a consistent pattern
4. Group related variables with common prefixes

### Feature Flags

1. **Clean up old flags** once a feature is fully deployed
2. Document each flag's purpose and lifecycle
3. Use dependencies between flags for complex features
4. Test both enabled and disabled states

### Configuration Changes

1. **Validate all changes** before deployment
2. Update documentation when adding new configuration options
3. Provide sensible defaults for development
4. Ensure backward compatibility when possible

## Troubleshooting

### Common Issues

#### Configuration Validation Errors

If you see validation errors at startup:

1. Check the error message for the specific field that failed validation
2. Verify that all required environment variables are set
3. Ensure values meet the constraints (e.g., minimum length, numeric range)

#### Feature Flag Issues

If features aren't behaving as expected:

1. Check if the flag is registered in `feature-flags.ts`
2. Verify the flag's status (active, inactive, deprecated)
3. Check if the flag has dependencies that aren't enabled
4. Look for environment-specific overrides

### Debugging Configuration

To debug the configuration:

1. Set `LOG_LEVEL=debug` to see more detailed logs
2. Use the `/api/v1/admin/config` endpoint (admin only) to view current configuration
3. Check the feature flag status with `/api/v1/admin/feature-flags`

## Further Reading

- [Environment Configuration Guide](./environment-configuration.md)
- [Feature Flag Best Practices](./feature-flag-best-practices.md)
- [Security Configuration Guide](./security-configuration.md)