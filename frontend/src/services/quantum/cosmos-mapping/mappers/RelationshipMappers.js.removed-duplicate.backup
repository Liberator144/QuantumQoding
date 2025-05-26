/**
 * Relationship Mappers for Data-to-Cosmos Mapping System
 *
 * This module implements relationship mappers for the Data-to-Cosmos Mapping System,
 * which map database relationships to cosmic connections in the visualization.
 *
 * @version 1.0.0
 */
import { v4 as uuidv4 } from 'uuid';
import { RelationshipType, } from '../types';
/**
 * Parent-child relationship mapper
 */
export class ParentChildRelationshipMapper {
    constructor() {
        /** Mapper name */
        this.name = 'ParentChildRelationshipMapper';
        /** Supported relationship types */
        this.supportedRelationshipTypes = [RelationshipType.PARENT_CHILD];
    }
    /**
     * Map relationship to cosmic connection
     * @param relationship - Relationship to map
     * @param options - Mapping options
     * @returns Cosmic connection
     */
    mapRelationshipToCosmicConnection(relationship, options = {}) {
        // Determine connection strength
        const strength = options.connectionStrengthMapping?.[relationship.type] ||
            relationship.strength || 1.0;
        // Determine connection style
        const style = options.connectionStyleMapping?.[relationship.type] || 'solid';
        // Determine connection width
        const width = options.connectionWidthMapping?.[relationship.type] || 2;
        // Determine connection color
        const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#FFFFFF';
        // Create cosmic connection
        const cosmicConnection = {
            id: uuidv4(),
            sourceId: relationship.sourceId,
            targetId: relationship.targetId,
            type: relationship.type,
            name: relationship.name || 'Parent-Child',
            description: relationship.description || 'Parent-child relationship',
            strength,
            color,
            style,
            width,
            properties: relationship.properties || {},
            relationshipId: relationship.id,
        };
        return cosmicConnection;
    }
}
/**
 * Reference relationship mapper
 */
export class ReferenceRelationshipMapper {
    constructor() {
        /** Mapper name */
        this.name = 'ReferenceRelationshipMapper';
        /** Supported relationship types */
        this.supportedRelationshipTypes = [RelationshipType.REFERENCE];
    }
    /**
     * Map relationship to cosmic connection
     * @param relationship - Relationship to map
     * @param options - Mapping options
     * @returns Cosmic connection
     */
    mapRelationshipToCosmicConnection(relationship, options = {}) {
        // Determine connection strength
        const strength = options.connectionStrengthMapping?.[relationship.type] ||
            relationship.strength || 0.7;
        // Determine connection style
        const style = options.connectionStyleMapping?.[relationship.type] || 'dashed';
        // Determine connection width
        const width = options.connectionWidthMapping?.[relationship.type] || 1;
        // Determine connection color
        const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#AAAAAA';
        // Create cosmic connection
        const cosmicConnection = {
            id: uuidv4(),
            sourceId: relationship.sourceId,
            targetId: relationship.targetId,
            type: relationship.type,
            name: relationship.name || 'Reference',
            description: relationship.description || 'Reference relationship',
            strength,
            color,
            style,
            width,
            properties: relationship.properties || {},
            relationshipId: relationship.id,
        };
        return cosmicConnection;
    }
} /**
 * Ownership relationship mapper
 */
export class OwnershipRelationshipMapper {
    constructor() {
        /** Mapper name */
        this.name = 'OwnershipRelationshipMapper';
        /** Supported relationship types */
        this.supportedRelationshipTypes = [RelationshipType.OWNERSHIP];
    }
    /**
     * Map relationship to cosmic connection
     * @param relationship - Relationship to map
     * @param options - Mapping options
     * @returns Cosmic connection
     */
    mapRelationshipToCosmicConnection(relationship, options = {}) {
        // Determine connection strength
        const strength = options.connectionStrengthMapping?.[relationship.type] ||
            relationship.strength || 0.9;
        // Determine connection style
        const style = options.connectionStyleMapping?.[relationship.type] || 'solid';
        // Determine connection width
        const width = options.connectionWidthMapping?.[relationship.type] || 2;
        // Determine connection color
        const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#FFD700';
        // Create cosmic connection
        const cosmicConnection = {
            id: uuidv4(),
            sourceId: relationship.sourceId,
            targetId: relationship.targetId,
            type: relationship.type,
            name: relationship.name || 'Ownership',
            description: relationship.description || 'Ownership relationship',
            strength,
            color,
            style,
            width,
            properties: relationship.properties || {},
            relationshipId: relationship.id,
        };
        return cosmicConnection;
    }
}
/**
 * Creation relationship mapper
 */
export class CreationRelationshipMapper {
    constructor() {
        /** Mapper name */
        this.name = 'CreationRelationshipMapper';
        /** Supported relationship types */
        this.supportedRelationshipTypes = [RelationshipType.CREATION];
    }
    /**
     * Map relationship to cosmic connection
     * @param relationship - Relationship to map
     * @param options - Mapping options
     * @returns Cosmic connection
     */
    mapRelationshipToCosmicConnection(relationship, options = {}) {
        // Determine connection strength
        const strength = options.connectionStrengthMapping?.[relationship.type] ||
            relationship.strength || 0.8;
        // Determine connection style
        const style = options.connectionStyleMapping?.[relationship.type] || 'solid';
        // Determine connection width
        const width = options.connectionWidthMapping?.[relationship.type] || 1.5;
        // Determine connection color
        const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 10));
        const color = options.colorPalette?.[colorIndex] || '#4ECDC4';
        // Create cosmic connection
        const cosmicConnection = {
            id: uuidv4(),
            sourceId: relationship.sourceId,
            targetId: relationship.targetId,
            type: relationship.type,
            name: relationship.name || 'Creation',
            description: relationship.description || 'Creation relationship',
            strength,
            color,
            style,
            width,
            properties: relationship.properties || {},
            relationshipId: relationship.id,
        };
        return cosmicConnection;
    }
}
