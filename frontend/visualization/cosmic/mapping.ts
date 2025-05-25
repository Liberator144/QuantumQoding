/**
 * Data-to-Cosmos Mapping
 *
 * This module provides utilities for mapping data entities to cosmic objects.
 *
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';
import { CosmicObject, CosmicObjectType, CosmicObjectStyle, CosmicConnection, CosmicSystem, CosmicUniverse, OrbitType } from './types';

/**
 * Entity type
 */
export enum EntityType {
  REPOSITORY = 'repository',
  ISSUE = 'issue',
  PULL_REQUEST = 'pull_request',
  USER = 'user',
  ORGANIZATION = 'organization',
  DATABASE = 'database',
  TABLE = 'table',
  RECORD = 'record',
  CUSTOM = 'custom',
}

/**
 * Relationship type
 */
export enum RelationshipType {
  PARENT_CHILD = 'parent_child',
  REFERENCE = 'reference',
  OWNERSHIP = 'ownership',
  CREATION = 'creation',
  CUSTOM = 'custom',
}/**
 * Data source type
 */
export enum DataSourceType {
  GITHUB = 'github',
  SUPABASE = 'supabase',
  MONGODB = 'mongodb',
  CUSTOM = 'custom',
}

/**
 * Entity interface
 */
export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  description?: string;
  url?: string;
  properties?: Record<string, any>;
  dataSource: DataSourceType;
  dataSourceId: string;
}

/**
 * Relationship interface
 */
export interface Relationship {
  id: string;
  type: RelationshipType;
  sourceId: string;
  targetId: string;
  name?: string;
  description?: string;
  properties?: Record<string, any>;
  dataSource: DataSourceType;
  dataSourceId: string;
}

/**
 * Mapping options
 */
export interface MappingOptions {
  colorPalette?: string[];
  styleMapping?: Record<EntityType, CosmicObjectStyle>;
  orbitMapping?: Record<EntityType, OrbitType>;
  sizeMapping?: Record<EntityType, number>;
}/**
 * Default mapping options
 */
const defaultMappingOptions: MappingOptions = {
  colorPalette: [
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#FFE66D', // Yellow
    '#6B5B95', // Purple
    '#88D8B0', // Green
    '#FF8C94', // Pink
    '#6A7FDB', // Blue
    '#F7A072', // Orange
  ],
  styleMapping: {
    [EntityType.REPOSITORY]: CosmicObjectStyle.STANDARD,
    [EntityType.ISSUE]: CosmicObjectStyle.ROCKY,
    [EntityType.PULL_REQUEST]: CosmicObjectStyle.QUANTUM,
    [EntityType.USER]: CosmicObjectStyle.STANDARD,
    [EntityType.ORGANIZATION]: CosmicObjectStyle.NEBULA,
    [EntityType.DATABASE]: CosmicObjectStyle.NEBULA,
    [EntityType.TABLE]: CosmicObjectStyle.GAS,
    [EntityType.RECORD]: CosmicObjectStyle.ROCKY,
    [EntityType.CUSTOM]: CosmicObjectStyle.CUSTOM,
  },
  orbitMapping: {
    [EntityType.REPOSITORY]: OrbitType.INNER,
    [EntityType.ISSUE]: OrbitType.MIDDLE,
    [EntityType.PULL_REQUEST]: OrbitType.MIDDLE,
    [EntityType.USER]: OrbitType.INNER,
    [EntityType.ORGANIZATION]: OrbitType.INNER,
    [EntityType.DATABASE]: OrbitType.INNER,
    [EntityType.TABLE]: OrbitType.MIDDLE,
    [EntityType.RECORD]: OrbitType.OUTER,
    [EntityType.CUSTOM]: OrbitType.CUSTOM,
  },
  sizeMapping: {
    [EntityType.REPOSITORY]: 1.5,
    [EntityType.ISSUE]: 0.8,
    [EntityType.PULL_REQUEST]: 0.9,
    [EntityType.USER]: 1.0,
    [EntityType.ORGANIZATION]: 1.5,
    [EntityType.DATABASE]: 1.5,
    [EntityType.TABLE]: 1.2,
    [EntityType.RECORD]: 0.7,
    [EntityType.CUSTOM]: 1.0,
  },
};/**
 * Map entity to cosmic object
 * 
 * @param entity - Entity to map
 * @param options - Mapping options
 * @returns Cosmic object
 */
export function mapEntityToCosmicObject(
  entity: Entity,
  options: MappingOptions = defaultMappingOptions
): CosmicObject {
  // Determine cosmic object type
  let cosmicType: CosmicObjectType;
  switch (entity.type) {
    case EntityType.REPOSITORY:
    case EntityType.ORGANIZATION:
    case EntityType.DATABASE:
      cosmicType = CosmicObjectType.STAR_SYSTEM;
      break;
    case EntityType.USER:
      cosmicType = CosmicObjectType.STAR;
      break;
    case EntityType.ISSUE:
    case EntityType.PULL_REQUEST:
    case EntityType.TABLE:
      cosmicType = CosmicObjectType.PLANET;
      break;
    case EntityType.RECORD:
      cosmicType = CosmicObjectType.MOON;
      break;
    default:
      cosmicType = CosmicObjectType.CUSTOM;
  }
  
  // Determine cosmic object style
  const style = options.styleMapping?.[entity.type] || CosmicObjectStyle.STANDARD;
  
  // Determine cosmic object orbit
  const orbit = options.orbitMapping?.[entity.type] || OrbitType.MIDDLE;
  
  // Determine cosmic object size
  const size = options.sizeMapping?.[entity.type] || 1.0;
  
  // Determine cosmic object color
  const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 8));
  const color = options.colorPalette?.[colorIndex] || '#FFFFFF';
  
  // Create cosmic object
  const cosmicObject: CosmicObject = {
    id: uuidv4(),
    type: cosmicType,
    name: entity.name,
    description: entity.description,
    color,
    style,
    orbit,
    size,
    angle: Math.random() * 360,
    distance: 100 + Math.random() * 100,
    rotationSpeed: 0.5 + Math.random(),
    properties: entity.properties,
    entityId: entity.id,
    entityType: entity.type,
    dataSource: entity.dataSource,
    dataSourceId: entity.dataSourceId,
  };
  
  return cosmicObject;
}/**
 * Map relationship to cosmic connection
 * 
 * @param relationship - Relationship to map
 * @param options - Mapping options
 * @returns Cosmic connection
 */
export function mapRelationshipToCosmicConnection(
  relationship: Relationship,
  options: MappingOptions = defaultMappingOptions
): CosmicConnection {
  // Determine connection style
  let style: 'solid' | 'dashed' | 'dotted' | 'wavy' = 'solid';
  switch (relationship.type) {
    case RelationshipType.PARENT_CHILD:
      style = 'solid';
      break;
    case RelationshipType.REFERENCE:
      style = 'dashed';
      break;
    case RelationshipType.OWNERSHIP:
      style = 'solid';
      break;
    case RelationshipType.CREATION:
      style = 'dotted';
      break;
    default:
      style = 'solid';
  }
  
  // Determine connection strength
  let strength = 1.0;
  switch (relationship.type) {
    case RelationshipType.PARENT_CHILD:
      strength = 1.0;
      break;
    case RelationshipType.REFERENCE:
      strength = 0.7;
      break;
    case RelationshipType.OWNERSHIP:
      strength = 0.9;
      break;
    case RelationshipType.CREATION:
      strength = 0.8;
      break;
    default:
      strength = 0.5;
  }
  
  // Determine connection color
  const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 8));
  const color = options.colorPalette?.[colorIndex] || '#FFFFFF';
  
  // Create cosmic connection
  const cosmicConnection: CosmicConnection = {
    id: uuidv4(),
    sourceId: relationship.sourceId,
    targetId: relationship.targetId,
    type: relationship.type,
    name: relationship.name,
    description: relationship.description,
    strength,
    color,
    style,
    properties: relationship.properties,
    relationshipId: relationship.id,
  };
  
  return cosmicConnection;
}

/**
 * Create cosmic system from entities and relationships
 * 
 * @param centralEntity - Central entity
 * @param relatedEntities - Related entities
 * @param relationships - Relationships
 * @param options - Mapping options
 * @returns Cosmic system
 */
export function createCosmicSystem(
  centralEntity: Entity,
  relatedEntities: Entity[],
  relationships: Relationship[],
  options: MappingOptions = defaultMappingOptions
): CosmicSystem {
  // Map central entity to cosmic object
  const centralObject = mapEntityToCosmicObject(centralEntity, options);
  
  // Map related entities to cosmic objects
  const orbitingObjects = relatedEntities.map(entity => 
    mapEntityToCosmicObject(entity, options)
  );
  
  // Map relationships to cosmic connections
  const connections = relationships.map(relationship => 
    mapRelationshipToCosmicConnection(relationship, options)
  );
  
  // Create cosmic system
  const cosmicSystem: CosmicSystem = {
    id: uuidv4(),
    name: centralEntity.name,
    description: centralEntity.description,
    centralObject,
    orbitingObjects,
    connections,
    properties: {
      entityId: centralEntity.id,
      entityType: centralEntity.type,
      dataSource: centralEntity.dataSource,
    },
  };
  
  return cosmicSystem;
}