/**
 * Data-to-Cosmos Mapping Service
 * 
 * This module implements the core mapping service for the Data-to-Cosmos Mapping System,
 * which maps database entities to cosmic objects in the visualization.
 * 
 * @version 1.0.0
 */

import { v4 as uuidv4 } from 'uuid';

import {
  Entity,
  EntityType,
  Relationship,
  RelationshipType,
  CosmicObject,
  CosmicObjectType,
  CosmicObjectStyle,
  CosmicConnection,
  CosmicSystem,
  CosmicUniverse,
  DataSourceType,
  EntityQuery,
  RelationshipQuery,
  MappingOptions,
  DataAdapter,
  EntityMapper,
  RelationshipMapper,
  MappingService,
  OrbitType,
} from './types';

/**
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
    '#00A8B5', // Cyan
    '#774936', // Brown
  ],
  styleMapping: {
    [EntityType.REPOSITORY]: CosmicObjectStyle.STANDARD,
    [EntityType.ISSUE]: CosmicObjectStyle.ROCKY,
    [EntityType.PULL_REQUEST]: CosmicObjectStyle.QUANTUM,
    [EntityType.USER]: CosmicObjectStyle.STANDARD,
    [EntityType.ORGANIZATION]: CosmicObjectStyle.NEBULA,
    [EntityType.PROJECT]: CosmicObjectStyle.GAS,
    [EntityType.MILESTONE]: CosmicObjectStyle.ICE,
    [EntityType.LABEL]: CosmicObjectStyle.STANDARD,
    [EntityType.COMMENT]: CosmicObjectStyle.STANDARD,
    [EntityType.COMMIT]: CosmicObjectStyle.STANDARD,
    [EntityType.BRANCH]: CosmicObjectStyle.STANDARD,
    [EntityType.TAG]: CosmicObjectStyle.STANDARD,
    [EntityType.WORKFLOW]: CosmicObjectStyle.STANDARD,
    [EntityType.ACTION]: CosmicObjectStyle.STANDARD,
    [EntityType.DATABASE]: CosmicObjectStyle.NEBULA,
    [EntityType.TABLE]: CosmicObjectStyle.GAS,
    [EntityType.RECORD]: CosmicObjectStyle.ROCKY,
    [EntityType.COLLECTION]: CosmicObjectStyle.GAS,
    [EntityType.DOCUMENT]: CosmicObjectStyle.ROCKY,
    [EntityType.FIELD]: CosmicObjectStyle.STANDARD,
    [EntityType.CUSTOM]: CosmicObjectStyle.CUSTOM,
  },
  orbitMapping: {
    [EntityType.REPOSITORY]: OrbitType.INNER,
    [EntityType.ISSUE]: OrbitType.MIDDLE,
    [EntityType.PULL_REQUEST]: OrbitType.MIDDLE,
    [EntityType.USER]: OrbitType.INNER,
    [EntityType.ORGANIZATION]: OrbitType.INNER,
    [EntityType.PROJECT]: OrbitType.INNER,
    [EntityType.MILESTONE]: OrbitType.MIDDLE,
    [EntityType.LABEL]: OrbitType.OUTER,
    [EntityType.COMMENT]: OrbitType.OUTER,
    [EntityType.COMMIT]: OrbitType.MIDDLE,
    [EntityType.BRANCH]: OrbitType.MIDDLE,
    [EntityType.TAG]: OrbitType.OUTER,
    [EntityType.WORKFLOW]: OrbitType.MIDDLE,
    [EntityType.ACTION]: OrbitType.OUTER,
    [EntityType.DATABASE]: OrbitType.INNER,
    [EntityType.TABLE]: OrbitType.MIDDLE,
    [EntityType.RECORD]: OrbitType.OUTER,
    [EntityType.COLLECTION]: OrbitType.MIDDLE,
    [EntityType.DOCUMENT]: OrbitType.OUTER,
    [EntityType.FIELD]: OrbitType.OUTER,
    [EntityType.CUSTOM]: OrbitType.CUSTOM,
  },
  sizeMapping: {
    [EntityType.REPOSITORY]: 1.5,
    [EntityType.ISSUE]: 0.8,
    [EntityType.PULL_REQUEST]: 0.9,
    [EntityType.USER]: 1.0,
    [EntityType.ORGANIZATION]: 1.5,
    [EntityType.PROJECT]: 1.2,
    [EntityType.MILESTONE]: 1.0,
    [EntityType.LABEL]: 0.6,
    [EntityType.COMMENT]: 0.5,
    [EntityType.COMMIT]: 0.7,
    [EntityType.BRANCH]: 0.8,
    [EntityType.TAG]: 0.6,
    [EntityType.WORKFLOW]: 0.9,
    [EntityType.ACTION]: 0.7,
    [EntityType.DATABASE]: 1.5,
    [EntityType.TABLE]: 1.2,
    [EntityType.RECORD]: 0.7,
    [EntityType.COLLECTION]: 1.2,
    [EntityType.DOCUMENT]: 0.8,
    [EntityType.FIELD]: 0.6,
    [EntityType.CUSTOM]: 1.0,
  },
  connectionStrengthMapping: {
    [RelationshipType.PARENT_CHILD]: 1.0,
    [RelationshipType.REFERENCE]: 0.7,
    [RelationshipType.DEPENDENCY]: 0.8,
    [RelationshipType.ASSOCIATION]: 0.6,
    [RelationshipType.OWNERSHIP]: 0.9,
    [RelationshipType.MEMBERSHIP]: 0.8,
    [RelationshipType.ASSIGNMENT]: 0.7,
    [RelationshipType.CREATION]: 0.8,
    [RelationshipType.MODIFICATION]: 0.7,
    [RelationshipType.CUSTOM]: 0.5,
  },
  connectionStyleMapping: {
    [RelationshipType.PARENT_CHILD]: 'solid',
    [RelationshipType.REFERENCE]: 'dashed',
    [RelationshipType.DEPENDENCY]: 'solid',
    [RelationshipType.ASSOCIATION]: 'dotted',
    [RelationshipType.OWNERSHIP]: 'solid',
    [RelationshipType.MEMBERSHIP]: 'solid',
    [RelationshipType.ASSIGNMENT]: 'dashed',
    [RelationshipType.CREATION]: 'solid',
    [RelationshipType.MODIFICATION]: 'dashed',
    [RelationshipType.CUSTOM]: 'wavy',
  },
  connectionWidthMapping: {
    [RelationshipType.PARENT_CHILD]: 2,
    [RelationshipType.REFERENCE]: 1,
    [RelationshipType.DEPENDENCY]: 1.5,
    [RelationshipType.ASSOCIATION]: 1,
    [RelationshipType.OWNERSHIP]: 2,
    [RelationshipType.MEMBERSHIP]: 1.5,
    [RelationshipType.ASSIGNMENT]: 1.5,
    [RelationshipType.CREATION]: 1.5,
    [RelationshipType.MODIFICATION]: 1,
    [RelationshipType.CUSTOM]: 1,
  },
};

/**
 * Default entity mapper
 */
export class DefaultEntityMapper implements EntityMapper {
  /** Mapper name */
  name = 'DefaultEntityMapper';
  
  /** Supported entity types */
  supportedEntityTypes = Object.values(EntityType);
  
  /**
   * Map entity to cosmic object
   * @param entity - Entity to map
   * @param options - Mapping options
   * @returns Cosmic object
   */
  mapEntityToCosmicObject(entity: Entity, options: MappingOptions = defaultMappingOptions): CosmicObject {
    // Determine cosmic object type
    let cosmicType: CosmicObjectType;
    switch (entity.type) {
      case EntityType.REPOSITORY:
      case EntityType.ORGANIZATION:
      case EntityType.DATABASE:
        cosmicType = CosmicObjectType.STAR_SYSTEM;
        break;
      case EntityType.PROJECT:
      case EntityType.USER:
        cosmicType = CosmicObjectType.STAR;
        break;
      case EntityType.ISSUE:
      case EntityType.PULL_REQUEST:
      case EntityType.TABLE:
      case EntityType.COLLECTION:
        cosmicType = CosmicObjectType.PLANET;
        break;
      case EntityType.COMMENT:
      case EntityType.RECORD:
      case EntityType.DOCUMENT:
      case EntityType.FIELD:
        cosmicType = CosmicObjectType.MOON;
        break;
      case EntityType.LABEL:
      case EntityType.TAG:
        cosmicType = CosmicObjectType.ASTEROID;
        break;
      case EntityType.COMMIT:
        cosmicType = CosmicObjectType.COMET;
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
    const colorIndex = Math.abs(entity.id.charCodeAt(0) % (options.colorPalette?.length || 10));
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
      parentId: entity.parentId,
      childrenIds: entity.childrenIds,
      features: [],
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
    
    // Apply custom entity mapper if provided
    if (options.entityMapper) {
      const customMappings = options.entityMapper(entity);
      Object.assign(cosmicObject, customMappings);
    }
    
    return cosmicObject;
  }
}

/**
 * Default relationship mapper
 */
export class DefaultRelationshipMapper implements RelationshipMapper {
  /** Mapper name */
  name = 'DefaultRelationshipMapper';
  
  /** Supported relationship types */
  supportedRelationshipTypes = Object.values(RelationshipType);
  
  /**
   * Map relationship to cosmic connection
   * @param relationship - Relationship to map
   * @param options - Mapping options
   * @returns Cosmic connection
   */
  mapRelationshipToCosmicConnection(
    relationship: Relationship,
    options: MappingOptions = defaultMappingOptions
  ): CosmicConnection {
    // Determine connection strength
    const strength = options.connectionStrengthMapping?.[relationship.type] || 
      relationship.strength || 0.5;
    
    // Determine connection style
    const style = options.connectionStyleMapping?.[relationship.type] || 'solid';
    
    // Determine connection width
    const width = options.connectionWidthMapping?.[relationship.type] || 1;
    
    // Determine connection color
    const colorIndex = Math.abs(relationship.id.charCodeAt(0) % (options.colorPalette?.length || 10));
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
      width,
      properties: relationship.properties,
      relationshipId: relationship.id,
    };
    
    // Apply custom relationship mapper if provided
    if (options.relationshipMapper) {
      const customMappings = options.relationshipMapper(relationship);
      Object.assign(cosmicConnection, customMappings);
    }
    
    return cosmicConnection;
  }
}

/**
 * Cosmos mapping service implementation
 */
export class CosmosMappingService implements MappingService {
  /** Service name */
  name = 'CosmosMappingService';
  
  /** Data adapters */
  adapters = new Map<DataSourceType, DataAdapter>();
  
  /** Entity mappers */
  entityMappers = new Map<EntityType, EntityMapper>();
  
  /** Relationship mappers */
  relationshipMappers = new Map<RelationshipType, RelationshipMapper>();
  
  /** Mapping options */
  options: MappingOptions = { ...defaultMappingOptions };
  
  /** Default entity mapper */
  private defaultEntityMapper = new DefaultEntityMapper();
  
  /** Default relationship mapper */
  private defaultRelationshipMapper = new DefaultRelationshipMapper();
  
  /**
   * Initialize the service
   * @param options - Initialization options
   */
  async initialize(options?: Record<string, any>): Promise<void> {
    // Initialize adapters
    for (const adapter of this.adapters.values()) {
      await adapter.initialize(options);
    }
  }
  
  /**
   * Register data adapter
   * @param adapter - Data adapter to register
   */
  registerAdapter(adapter: DataAdapter): void {
    this.adapters.set(adapter.dataSourceType, adapter);
  }
  
  /**
   * Register entity mapper
   * @param mapper - Entity mapper to register
   */
  registerEntityMapper(mapper: EntityMapper): void {
    for (const entityType of mapper.supportedEntityTypes) {
      this.entityMappers.set(entityType, mapper);
    }
  }
  
  /**
   * Register relationship mapper
   * @param mapper - Relationship mapper to register
   */
  registerRelationshipMapper(mapper: RelationshipMapper): void {
    for (const relationshipType of mapper.supportedRelationshipTypes) {
      this.relationshipMappers.set(relationshipType, mapper);
    }
  }
  
  /**
   * Set mapping options
   * @param options - Mapping options
   */
  setOptions(options: MappingOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
  }
  
  /**
   * Get entities
   * @param query - Entity query
   * @returns Entities
   */
  async getEntities(query?: EntityQuery): Promise<Entity[]> {
    const entities: Entity[] = [];
    
    // If data source is specified, use only that adapter
    if (query?.dataSource) {
      const adapter = this.adapters.get(query.dataSource);
      if (adapter) {
        const adapterEntities = await adapter.getEntities(query);
        entities.push(...adapterEntities);
      }
    } else {
      // Otherwise, use all adapters
      for (const adapter of this.adapters.values()) {
        const adapterEntities = await adapter.getEntities(query);
        entities.push(...adapterEntities);
      }
    }
    
    return entities;
  }
  
  /**
   * Get entity by ID
   * @param id - Entity ID
   * @param dataSource - Data source type
   * @returns Entity
   */
  async getEntityById(id: string, dataSource: DataSourceType): Promise<Entity | null> {
    const adapter = this.adapters.get(dataSource);
    if (!adapter) {
      return null;
    }
    
    return adapter.getEntityById(id);
  }
  
  /**
   * Get relationships
   * @param query - Relationship query
   * @returns Relationships
   */
  async getRelationships(query?: RelationshipQuery): Promise<Relationship[]> {
    const relationships: Relationship[] = [];
    
    // If data source is specified, use only that adapter
    if (query?.dataSource) {
      const adapter = this.adapters.get(query.dataSource);
      if (adapter) {
        const adapterRelationships = await adapter.getRelationships(query);
        relationships.push(...adapterRelationships);
      }
    } else {
      // Otherwise, use all adapters
      for (const adapter of this.adapters.values()) {
        const adapterRelationships = await adapter.getRelationships(query);
        relationships.push(...adapterRelationships);
      }
    }
    
    return relationships;
  }
  
  /**
   * Get relationship by ID
   * @param id - Relationship ID
   * @param dataSource - Data source type
   * @returns Relationship
   */
  async getRelationshipById(id: string, dataSource: DataSourceType): Promise<Relationship | null> {
    const adapter = this.adapters.get(dataSource);
    if (!adapter) {
      return null;
    }
    
    return adapter.getRelationshipById(id);
  }
  
  /**
   * Map entity to cosmic object
   * @param entity - Entity to map
   * @returns Cosmic object
   */
  mapEntityToCosmicObject(entity: Entity): CosmicObject {
    const mapper = this.entityMappers.get(entity.type) || this.defaultEntityMapper;
    return mapper.mapEntityToCosmicObject(entity, this.options);
  }
  
  /**
   * Map relationship to cosmic connection
   * @param relationship - Relationship to map
   * @returns Cosmic connection
   */
  mapRelationshipToCosmicConnection(relationship: Relationship): CosmicConnection {
    const mapper = this.relationshipMappers.get(relationship.type) || this.defaultRelationshipMapper;
    return mapper.mapRelationshipToCosmicConnection(relationship, this.options);
  }
  
  /**
   * Create cosmic system from entities
   * @param centralEntity - Central entity
   * @param orbitingEntities - Orbiting entities
   * @param relationships - Relationships
   * @returns Cosmic system
   */
  createCosmicSystem(
    centralEntity: Entity,
    orbitingEntities: Entity[],
    relationships: Relationship[]
  ): CosmicSystem {
    // Map central entity to cosmic object
    const centralObject = this.mapEntityToCosmicObject(centralEntity);
    
    // Map orbiting entities to cosmic objects
    const orbitingObjects = orbitingEntities.map(entity => {
      const cosmicObject = this.mapEntityToCosmicObject(entity);
      cosmicObject.parentId = centralObject.id;
      return cosmicObject;
    });
    
    // Distribute orbiting objects evenly around the central object
    const orbitTypes = [OrbitType.INNER, OrbitType.MIDDLE, OrbitType.OUTER];
    const objectsByOrbit = new Map<OrbitType, CosmicObject[]>();
    
    // Group objects by orbit
    for (const orbitType of orbitTypes) {
      objectsByOrbit.set(orbitType, orbitingObjects.filter(obj => obj.orbit === orbitType));
    }
    
    // Distribute objects in each orbit
    for (const [orbitType, objects] of objectsByOrbit.entries()) {
      const count = objects.length;
      if (count === 0) continue;
      
      // Calculate base distance for this orbit
      let baseDistance = 100;
      switch (orbitType) {
        case OrbitType.INNER:
          baseDistance = 100;
          break;
        case OrbitType.MIDDLE:
          baseDistance = 200;
          break;
        case OrbitType.OUTER:
          baseDistance = 300;
          break;
        case OrbitType.CUSTOM:
          baseDistance = 400;
          break;
      }
      
      // Distribute objects evenly
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const distance = baseDistance + (Math.random() * 50 - 25);
        
        objects[i].angle = angle;
        objects[i].distance = distance;
      }
    }
    
    // Map relationships to cosmic connections
    const connections = relationships.map(relationship => {
      return this.mapRelationshipToCosmicConnection(relationship);
    });
    
    // Create cosmic system
    const system: CosmicSystem = {
      id: uuidv4(),
      name: centralEntity.name,
      description: centralEntity.description,
      centralObject,
      orbitingObjects,
      connections,
      properties: {
        dataSource: centralEntity.dataSource,
        dataSourceId: centralEntity.dataSourceId,
        entityType: centralEntity.type,
        entityId: centralEntity.id,
      },
    };
    
    return system;
  }
  
  /**
   * Create cosmic universe from systems
   * @param systems - Cosmic systems
   * @param connections - Cosmic connections
   * @returns Cosmic universe
   */
  createCosmicUniverse(
    systems: CosmicSystem[],
    connections: CosmicConnection[]
  ): CosmicUniverse {
    // Create cosmic universe
    const universe: CosmicUniverse = {
      id: uuidv4(),
      name: 'Cosmic Universe',
      description: 'A universe of cosmic systems',
      systems,
      connections,
      properties: {},
    };
    
    return universe;
  }
}