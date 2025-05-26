/**
 * Entity Mappers for Data-to-Cosmos Mapping System
 *
 * This module implements entity mappers for the Data-to-Cosmos Mapping System,
 * which map database entities to cosmic objects in the visualization.
 *
 * @version 1.0.0
 */
import { v4 as uuidv4 } from 'uuid';
import { EntityType, CosmicObjectType, CosmicObjectStyle, OrbitType, } from '../types';
/**
 * Repository entity mapper
 */
export class RepositoryEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'RepositoryEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.REPOSITORY];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color
        const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#4ECDC4';
        // Create features based on repository properties
        const features = [];
        if (entity.properties?.language) {
            features.push({
                name: 'Language',
                description: `Primary language: ${entity.properties.language}`,
                orbit: OrbitType.INNER,
                properties: {
                    value: entity.properties.language,
                },
            });
        }
        if (entity.properties?.topics && Array.isArray(entity.properties.topics)) {
            features.push({
                name: 'Topics',
                description: `Topics: ${entity.properties.topics.join(', ')}`,
                orbit: OrbitType.MIDDLE,
                properties: {
                    value: entity.properties.topics,
                },
            });
        }
        if (entity.properties?.license) {
            features.push({
                name: 'License',
                description: `License: ${entity.properties.license}`,
                orbit: OrbitType.OUTER,
                properties: {
                    value: entity.properties.license,
                },
            });
        }
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.STAR_SYSTEM,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.STANDARD,
            size: 1.5,
            features,
            properties: {
                ...entity.properties,
                url: entity.url,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                owner: entity.owner,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * Issue entity mapper
 */
export class IssueEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'IssueEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.ISSUE];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color based on issue state
        let color = '#6B5B95'; // Default purple
        if (entity.properties?.state === 'open') {
            color = '#88D8B0'; // Green for open issues
        }
        else if (entity.properties?.state === 'closed') {
            color = '#FF6B6B'; // Red for closed issues
        }
        // Override with color from palette if specified
        if (options.colorPalette) {
            const colorIndex = Math.abs(entity.id.charCodeAt(0) % options.colorPalette.length);
            color = options.colorPalette[colorIndex];
        }
        // Create features based on issue properties
        const features = [];
        if (entity.properties?.labels && Array.isArray(entity.properties.labels)) {
            features.push({
                name: 'Labels',
                description: `Labels: ${entity.properties.labels.join(', ')}`,
                orbit: OrbitType.INNER,
                properties: {
                    value: entity.properties.labels,
                },
            });
        }
        if (entity.properties?.milestone) {
            features.push({
                name: 'Milestone',
                description: `Milestone: ${entity.properties.milestone}`,
                orbit: OrbitType.MIDDLE,
                properties: {
                    value: entity.properties.milestone,
                },
            });
        }
        if (entity.properties?.assignees && Array.isArray(entity.properties.assignees)) {
            features.push({
                name: 'Assignees',
                description: `Assignees: ${entity.properties.assignees.join(', ')}`,
                orbit: OrbitType.OUTER,
                properties: {
                    value: entity.properties.assignees,
                },
            });
        }
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.PLANET,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.ROCKY,
            orbit: OrbitType.MIDDLE,
            angle: Math.random() * 360,
            distance: 150 + Math.random() * 50,
            rotationSpeed: 0.5 + Math.random() * 0.5,
            size: 0.8,
            features,
            properties: {
                ...entity.properties,
                url: entity.url,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                owner: entity.owner,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * Pull request entity mapper
 */
export class PullRequestEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'PullRequestEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.PULL_REQUEST];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color based on pull request state
        let color = '#6A7FDB'; // Default blue
        if (entity.properties?.state === 'open') {
            color = '#4ECDC4'; // Teal for open PRs
        }
        else if (entity.properties?.state === 'closed' && !entity.properties?.merged) {
            color = '#FF6B6B'; // Red for closed unmerged PRs
        }
        else if (entity.properties?.merged) {
            color = '#6B5B95'; // Purple for merged PRs
        }
        // Override with color from palette if specified
        if (options.colorPalette) {
            const colorIndex = Math.abs(entity.id.charCodeAt(0) % options.colorPalette.length);
            color = options.colorPalette[colorIndex];
        }
        // Create features based on pull request properties
        const features = [];
        if (entity.properties?.labels && Array.isArray(entity.properties.labels)) {
            features.push({
                name: 'Labels',
                description: `Labels: ${entity.properties.labels.join(', ')}`,
                orbit: OrbitType.INNER,
                properties: {
                    value: entity.properties.labels,
                },
            });
        }
        if (entity.properties?.milestone) {
            features.push({
                name: 'Milestone',
                description: `Milestone: ${entity.properties.milestone}`,
                orbit: OrbitType.MIDDLE,
                properties: {
                    value: entity.properties.milestone,
                },
            });
        }
        if (entity.properties?.assignees && Array.isArray(entity.properties.assignees)) {
            features.push({
                name: 'Assignees',
                description: `Assignees: ${entity.properties.assignees.join(', ')}`,
                orbit: OrbitType.OUTER,
                properties: {
                    value: entity.properties.assignees,
                },
            });
        }
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.PLANET,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.QUANTUM,
            orbit: OrbitType.MIDDLE,
            angle: Math.random() * 360,
            distance: 200 + Math.random() * 50,
            rotationSpeed: 0.7 + Math.random() * 0.5,
            size: 0.9,
            features,
            properties: {
                ...entity.properties,
                url: entity.url,
                createdAt: entity.createdAt,
                updatedAt: entity.updatedAt,
                owner: entity.owner,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * User entity mapper
 */
export class UserEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'UserEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.USER];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color
        const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#FFE66D';
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.STAR,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.STANDARD,
            size: 1.0,
            properties: {
                ...entity.properties,
                url: entity.url,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * Database entity mapper
 */
export class DatabaseEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'DatabaseEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.DATABASE];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color
        const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#6A7FDB';
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.STAR_SYSTEM,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.NEBULA,
            size: 1.5,
            properties: {
                ...entity.properties,
                url: entity.url,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * Table entity mapper
 */
export class TableEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'TableEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.TABLE];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color
        const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#F7A072';
        // Create features based on table properties
        const features = [];
        if (entity.properties?.schema) {
            features.push({
                name: 'Schema',
                description: `Schema: ${entity.properties.schema}`,
                orbit: OrbitType.INNER,
                properties: {
                    value: entity.properties.schema,
                },
            });
        }
        if (entity.properties?.rowCount !== undefined) {
            features.push({
                name: 'Row Count',
                description: `Row Count: ${entity.properties.rowCount}`,
                orbit: OrbitType.MIDDLE,
                properties: {
                    value: entity.properties.rowCount,
                },
            });
        }
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.PLANET,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.GAS,
            orbit: OrbitType.MIDDLE,
            angle: Math.random() * 360,
            distance: 150 + Math.random() * 50,
            rotationSpeed: 0.3 + Math.random() * 0.3,
            size: 1.2,
            parentId: entity.parentId,
            features,
            properties: {
                ...entity.properties,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
/**
 * Record entity mapper
 */
export class RecordEntityMapper {
    constructor() {
        /** Mapper name */
        this.name = 'RecordEntityMapper';
        /** Supported entity types */
        this.supportedEntityTypes = [EntityType.RECORD, EntityType.DOCUMENT];
    }
    /**
     * Map entity to cosmic object
     * @param entity - Entity to map
     * @param options - Mapping options
     * @returns Cosmic object
     */
    mapEntityToCosmicObject(entity, options = {}) {
        // Determine cosmic object color
        const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#FF8C94';
        // Create cosmic object
        const cosmicObject = {
            id: uuidv4(),
            type: CosmicObjectType.MOON,
            name: entity.name,
            description: entity.description,
            color,
            style: CosmicObjectStyle.ROCKY,
            orbit: OrbitType.OUTER,
            angle: Math.random() * 360,
            distance: 50 + Math.random() * 20,
            rotationSpeed: 1.0 + Math.random() * 1.0,
            size: 0.7,
            parentId: entity.parentId,
            properties: {
                ...entity.properties,
            },
            entityId: entity.id,
            entityType: entity.type,
            dataSource: entity.dataSource,
            dataSourceId: entity.dataSourceId,
        };
        return cosmicObject;
    }
}
