/**
 * Cosmic Visualization Types
 *
 * Type definitions for cosmic visualization components.
 *
 * @version 1.0.0
 */

/**
 * Cosmic object type
 */
export enum CosmicObjectType {
  /** Galaxy */
  GALAXY = 'galaxy',
  
  /** Star cluster */
  STAR_CLUSTER = 'star_cluster',
  
  /** Star system */
  STAR_SYSTEM = 'star_system',
  
  /** Star */
  STAR = 'star',
  
  /** Planet */
  PLANET = 'planet',
  
  /** Moon */
  MOON = 'moon',
  
  /** Asteroid */
  ASTEROID = 'asteroid',
  
  /** Comet */
  COMET = 'comet',
  
  /** Nebula */
  NEBULA = 'nebula',
  
  /** Black hole */
  BLACK_HOLE = 'black_hole',
  
  /** Wormhole */
  WORMHOLE = 'wormhole',
  
  /** Custom cosmic object */
  CUSTOM = 'custom',
}

/**
 * Cosmic object style
 */
export enum CosmicObjectStyle {
  /** Standard style */
  STANDARD = 'standard',
  
  /** Quantum style */
  QUANTUM = 'quantum',
  
  /** Nebula style */
  NEBULA = 'nebula',
  
  /** Spiral galaxy style */
  SPIRAL_GALAXY = 'spiral_galaxy',
  
  /** Elliptical galaxy style */
  ELLIPTICAL_GALAXY = 'elliptical_galaxy',
  
  /** Irregular galaxy style */
  IRREGULAR_GALAXY = 'irregular_galaxy',
  
  /** Rocky style */
  ROCKY = 'rocky',
  
  /** Gas style */
  GAS = 'gas',
  
  /** Ice style */
  ICE = 'ice',
  
  /** Oceanic style */
  OCEANIC = 'oceanic',
  
  /** Lava style */
  LAVA = 'lava',
  
  /** Custom style */
  CUSTOM = 'custom',
}

/**
 * Orbit type
 */
export enum OrbitType {
  /** Inner orbit */
  INNER = 'inner',
  
  /** Middle orbit */
  MIDDLE = 'middle',
  
  /** Outer orbit */
  OUTER = 'outer',
  
  /** Custom orbit */
  CUSTOM = 'custom',
}

/**
 * Cosmic object feature
 */
export interface CosmicObjectFeature {
  /** Feature name */
  name: string;
  
  /** Feature description */
  description: string;
  
  /** Feature orbit */
  orbit: OrbitType;
  
  /** Feature properties */
  properties?: Record<string, any>;
  
  /** Mapped entity ID */
  entityId?: string;
  
  /** Mapped entity type */
  entityType?: string;
}

/**
 * Cosmic object
 */
export interface CosmicObject {
  /** Cosmic object ID */
  id: string;
  
  /** Cosmic object type */
  type: CosmicObjectType;
  
  /** Cosmic object name */
  name: string;
  
  /** Cosmic object description */
  description?: string;
  
  /** Cosmic object color */
  color: string;
  
  /** Cosmic object style */
  style: CosmicObjectStyle;
  
  /** Cosmic object orbit type */
  orbit?: OrbitType;
  
  /** Cosmic object orbit angle */
  angle?: number;
  
  /** Cosmic object orbit distance */
  distance?: number;
  
  /** Cosmic object rotation speed */
  rotationSpeed?: number;
  
  /** Cosmic object size */
  size?: number;
  
  /** Cosmic object parent ID */
  parentId?: string;
  
  /** Cosmic object children IDs */
  childrenIds?: string[];
  
  /** Cosmic object features */
  features?: CosmicObjectFeature[];
  
  /** Cosmic object properties */
  properties?: Record<string, any>;
  
  /** Mapped entity ID */
  entityId: string;
  
  /** Mapped entity type */
  entityType: string;
  
  /** Mapped entity data source */
  dataSource: string;
  
  /** Mapped entity data source ID */
  dataSourceId: string;
}/**
 * Cosmic connection
 */
export interface CosmicConnection {
  /** Connection ID */
  id: string;
  
  /** Source cosmic object ID */
  sourceId: string;
  
  /** Target cosmic object ID */
  targetId: string;
  
  /** Connection type */
  type: string;
  
  /** Connection name */
  name?: string;
  
  /** Connection description */
  description?: string;
  
  /** Connection strength (0-1) */
  strength: number;
  
  /** Connection color */
  color?: string;
  
  /** Connection style */
  style?: 'solid' | 'dashed' | 'dotted' | 'wavy';
  
  /** Connection width */
  width?: number;
  
  /** Connection properties */
  properties?: Record<string, any>;
  
  /** Mapped relationship ID */
  relationshipId: string;
}

/**
 * Cosmic system
 */
export interface CosmicSystem {
  /** System ID */
  id: string;
  
  /** System name */
  name: string;
  
  /** System description */
  description?: string;
  
  /** Central cosmic object */
  centralObject: CosmicObject;
  
  /** Orbiting cosmic objects */
  orbitingObjects: CosmicObject[];
  
  /** Cosmic connections */
  connections: CosmicConnection[];
  
  /** System properties */
  properties?: Record<string, any>;
}

/**
 * Galaxy type
 */
export enum GalaxyType {
  /** Spiral galaxy */
  SPIRAL = 'spiral',
  
  /** Elliptical galaxy */
  ELLIPTICAL = 'elliptical',
  
  /** Irregular galaxy */
  IRREGULAR = 'irregular',
  
  /** Lenticular galaxy */
  LENTICULAR = 'lenticular',
  
  /** Ring galaxy */
  RING = 'ring',
  
  /** Custom galaxy */
  CUSTOM = 'custom',
}

/**
 * Cosmic galaxy
 */
export interface CosmicGalaxy {
  /** Galaxy ID */
  id: string;
  
  /** Galaxy name */
  name: string;
  
  /** Galaxy description */
  description?: string;
  
  /** Galaxy type */
  type: GalaxyType;
  
  /** Galaxy style */
  style: CosmicObjectStyle;
  
  /** Galaxy color */
  color: string;
  
  /** Galaxy size */
  size: number;
  
  /** Galaxy rotation speed */
  rotationSpeed?: number;
  
  /** Number of spiral arms (for spiral galaxies) */
  spiralArms?: number;
  
  /** Spiral arm tightness (0-1, for spiral galaxies) */
  spiralTightness?: number;
  
  /** Galaxy density (0-1) */
  density?: number;
  
  /** Star systems in the galaxy */
  systems: CosmicSystem[];
  
  /** Star clusters in the galaxy */
  clusters?: CosmicStarCluster[];
  
  /** Nebulae in the galaxy */
  nebulae?: CosmicObject[];
  
  /** Black holes in the galaxy */
  blackHoles?: CosmicObject[];
  
  /** Cosmic connections */
  connections: CosmicConnection[];
  
  /** Galaxy properties */
  properties?: Record<string, any>;
  
  /** Mapped entity ID */
  entityId?: string;
  
  /** Mapped entity type */
  entityType?: string;
  
  /** Mapped entity data source */
  dataSource?: string;
  
  /** Mapped entity data source ID */
  dataSourceId?: string;
}

/**
 * Cosmic star cluster
 */
export interface CosmicStarCluster {
  /** Cluster ID */
  id: string;
  
  /** Cluster name */
  name: string;
  
  /** Cluster description */
  description?: string;
  
  /** Cluster color */
  color: string;
  
  /** Cluster style */
  style: CosmicObjectStyle;
  
  /** Cluster size */
  size: number;
  
  /** Cluster position (x, y, z) */
  position: { x: number; y: number; z: number };
  
  /** Cluster rotation speed */
  rotationSpeed?: number;
  
  /** Star systems in the cluster */
  systems: CosmicSystem[];
  
  /** Cosmic connections */
  connections: CosmicConnection[];
  
  /** Cluster properties */
  properties?: Record<string, any>;
  
  /** Mapped entity ID */
  entityId?: string;
  
  /** Mapped entity type */
  entityType?: string;
  
  /** Mapped entity data source */
  dataSource?: string;
  
  /** Mapped entity data source ID */
  dataSourceId?: string;
}

/**
 * Cosmic universe
 */
export interface CosmicUniverse {
  /** Universe ID */
  id: string;
  
  /** Universe name */
  name: string;
  
  /** Universe description */
  description?: string;
  
  /** Galaxies in the universe */
  galaxies: CosmicGalaxy[];
  
  /** Star systems not part of any galaxy */
  systems: CosmicSystem[];
  
  /** Cosmic connections */
  connections: CosmicConnection[];
  
  /** Universe properties */
  properties?: Record<string, any>;
}

/**
 * Cosmic visualization options
 */
export interface CosmicVisualizationOptions {
  /** Show labels */
  showLabels?: boolean;
  
  /** Show connections */
  showConnections?: boolean;
  
  /** Show features */
  showFeatures?: boolean;
  
  /** Enable animations */
  enableAnimations?: boolean;
  
  /** Enable interactions */
  enableInteractions?: boolean;
  
  /** Enable physics */
  enablePhysics?: boolean;
  
  /** Enable zoom */
  enableZoom?: boolean;
  
  /** Enable pan */
  enablePan?: boolean;
  
  /** Enable rotation */
  enableRotation?: boolean;
  
  /** Theme */
  theme?: 'dark' | 'light' | 'quantum' | 'nebula';
  
  /** Width */
  width?: number;
  
  /** Height */
  height?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}