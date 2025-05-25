/**
 * Consciousness Stream Tester
 *
 * Verifies visualization consciousness continuity.
 *
 * @version 1.0.0
 */

import * as THREE from 'three';

/**
 * Consciousness Stream Event Type
 */
export enum ConsciousnessEventType {
  /** Scene change */
  SCENE_CHANGE = 'scene_change',
  
  /** Camera change */
  CAMERA_CHANGE = 'camera_change',
  
  /** Object change */
  OBJECT_CHANGE = 'object_change',
  
  /** Transition */
  TRANSITION = 'transition',
  
  /** Interaction */
  INTERACTION = 'interaction',
  
  /** Error */
  ERROR = 'error',
  
  /** Warning */
  WARNING = 'warning',
  
  /** Information */
  INFO = 'info',
}

/**
 * Consciousness Stream Event
 */
export interface ConsciousnessEvent {
  /** Event ID */
  id: string;
  
  /** Event type */
  type: ConsciousnessEventType;
  
  /** Event timestamp */
  timestamp: number;
  
  /** Event source */
  source: string;
  
  /** Event data */
  data: any;
  
  /** Event severity (0-1) */
  severity: number;
  
  /** Event duration (ms) */
  duration?: number;
  
  /** Related events */
  relatedEvents?: string[];
}/**
 * Consciousness Checkpoint
 */
export interface ConsciousnessCheckpoint {
  /** Checkpoint ID */
  id: string;
  
  /** Checkpoint name */
  name: string;
  
  /** Checkpoint timestamp */
  timestamp: number;
  
  /** Checkpoint data */
  data: any;
  
  /** Checkpoint hash */
  hash: string;
  
  /** Previous checkpoint ID */
  previousCheckpointId?: string;
  
  /** Events since last checkpoint */
  events: string[];
}

/**
 * Consciousness Stream Test Result
 */
export interface ConsciousnessStreamTestResult {
  /** Test ID */
  id: string;
  
  /** Test name */
  name: string;
  
  /** Test timestamp */
  timestamp: number;
  
  /** Test duration (ms) */
  duration: number;
  
  /** Test success */
  success: boolean;
  
  /** Test score (0-1) */
  score: number;
  
  /** Test details */
  details: string;
  
  /** Test events */
  events: ConsciousnessEvent[];
  
  /** Test checkpoints */
  checkpoints: ConsciousnessCheckpoint[];
  
  /** Test errors */
  errors: string[];
  
  /** Test warnings */
  warnings: string[];
}

/**
 * Consciousness Stream Tester Options
 */
export interface ConsciousnessStreamTesterOptions {
  /** Enable automatic checkpoints */
  enableAutomaticCheckpoints?: boolean;
  
  /** Automatic checkpoint interval (ms) */
  automaticCheckpointInterval?: number;
  
  /** Maximum events to store */
  maxEvents?: number;
  
  /** Maximum checkpoints to store */
  maxCheckpoints?: number;
  
  /** Enable event filtering */
  enableEventFiltering?: boolean;
  
  /** Minimum event severity to record (0-1) */
  minimumEventSeverity?: number;
  
  /** Debug mode */
  debugMode?: boolean;
}/**
 * Default options
 */
const defaultOptions: ConsciousnessStreamTesterOptions = {
  enableAutomaticCheckpoints: true,
  automaticCheckpointInterval: 5000,
  maxEvents: 1000,
  maxCheckpoints: 100,
  enableEventFiltering: true,
  minimumEventSeverity: 0.1,
  debugMode: false,
};

/**
 * Consciousness Stream Tester
 */
export class ConsciousnessStreamTester {
  /** Options */
  private options: ConsciousnessStreamTesterOptions;
  
  /** Scene */
  private scene: THREE.Scene;
  
  /** Camera */
  private camera: THREE.Camera;
  
  /** Renderer */
  private renderer: THREE.WebGLRenderer;
  
  /** Events */
  private events: Map<string, ConsciousnessEvent> = new Map();
  
  /** Checkpoints */
  private checkpoints: Map<string, ConsciousnessCheckpoint> = new Map();
  
  /** Current test */
  private currentTest: ConsciousnessStreamTestResult | null = null;
  
  /** Automatic checkpoint timer */
  private automaticCheckpointTimer: number | null = null;
  
  /** Previous camera position */
  private previousCameraPosition: THREE.Vector3 = new THREE.Vector3();
  
  /** Previous camera rotation */
  private previousCameraRotation: THREE.Euler = new THREE.Euler();
  
  /** Previous scene objects */
  private previousSceneObjects: Set<string> = new Set();
  
  /** Is initialized */
  private isInitialized: boolean = false;
  
  /**
   * Constructor
   * @param scene - Scene
   * @param camera - Camera
   * @param renderer - Renderer
   * @param options - Options
   */
  constructor(
    scene: THREE.Scene,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    options: ConsciousnessStreamTesterOptions = {}
  ) {
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    
    this.options = {
      ...defaultOptions,
      ...options,
    };
    
    this.log('Consciousness Stream Tester initialized');
  }  
  /**
   * Initialize the consciousness stream tester
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }
    
    // Store initial camera position and rotation
    this.previousCameraPosition.copy(this.camera.position);
    this.previousCameraRotation.copy(this.camera.rotation);
    
    // Store initial scene objects
    this.updatePreviousSceneObjects();
    
    // Start automatic checkpoints
    if (this.options.enableAutomaticCheckpoints) {
      this.startAutomaticCheckpoints();
    }
    
    // Create initial checkpoint
    this.createCheckpoint('Initial state');
    
    // Mark as initialized
    this.isInitialized = true;
    
    this.log('Consciousness Stream Tester started');
  }
  
  /**
   * Start automatic checkpoints
   */
  private startAutomaticCheckpoints(): void {
    // Clear existing timer
    this.stopAutomaticCheckpoints();
    
    // Start new timer
    this.automaticCheckpointTimer = window.setInterval(() => {
      this.createCheckpoint('Automatic checkpoint');
    }, this.options.automaticCheckpointInterval);
  }
  
  /**
   * Stop automatic checkpoints
   */
  private stopAutomaticCheckpoints(): void {
    if (this.automaticCheckpointTimer !== null) {
      window.clearInterval(this.automaticCheckpointTimer);
      this.automaticCheckpointTimer = null;
    }
  }
  
  /**
   * Update previous scene objects
   */
  private updatePreviousSceneObjects(): void {
    // Clear previous scene objects
    this.previousSceneObjects.clear();
    
    // Store current scene objects
    this.scene.traverse((object) => {
      if (object.visible && !(object instanceof THREE.Camera) && !(object instanceof THREE.Light)) {
        this.previousSceneObjects.add(object.uuid);
      }
    });
  }  
  /**
   * Start test
   * @param name - Test name
   * @returns Test ID
   */
  startTest(name: string): string {
    // Generate test ID
    const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create test
    this.currentTest = {
      id: testId,
      name,
      timestamp: Date.now(),
      duration: 0,
      success: false,
      score: 0,
      details: '',
      events: [],
      checkpoints: [],
      errors: [],
      warnings: [],
    };
    
    // Clear events and checkpoints
    this.events.clear();
    this.checkpoints.clear();
    
    // Create initial checkpoint
    this.createCheckpoint('Test start');
    
    this.log(`Started test: ${name} (${testId})`);
    
    return testId;
  }
  
  /**
   * End test
   * @param success - Test success
   * @param details - Test details
   * @returns Test result
   */
  endTest(success: boolean, details: string = ''): ConsciousnessStreamTestResult | null {
    // Check if test is running
    if (!this.currentTest) {
      return null;
    }
    
    // Create final checkpoint
    this.createCheckpoint('Test end');
    
    // Update test
    this.currentTest.success = success;
    this.currentTest.details = details;
    this.currentTest.duration = Date.now() - this.currentTest.timestamp;
    this.currentTest.events = Array.from(this.events.values());
    this.currentTest.checkpoints = Array.from(this.checkpoints.values());
    
    // Calculate test score
    this.currentTest.score = this.calculateTestScore();
    
    // Get test result
    const testResult = { ...this.currentTest };
    
    // Clear current test
    this.currentTest = null;
    
    this.log(`Ended test: ${testResult.name} (${testResult.id}) - Success: ${success}`);
    
    return testResult;
  }  
  /**
   * Calculate test score
   * @returns Test score (0-1)
   */
  private calculateTestScore(): number {
    // Check if test is running
    if (!this.currentTest) {
      return 0;
    }
    
    // Get events
    const events = Array.from(this.events.values());
    
    // Calculate score based on event severity
    let totalSeverity = 0;
    let errorCount = 0;
    let warningCount = 0;
    
    events.forEach((event) => {
      totalSeverity += event.severity;
      
      if (event.type === ConsciousnessEventType.ERROR) {
        errorCount++;
      } else if (event.type === ConsciousnessEventType.WARNING) {
        warningCount++;
      }
    });
    
    // Calculate base score
    const baseScore = Math.max(0, 1 - (totalSeverity / Math.max(1, events.length)));
    
    // Apply penalties for errors and warnings
    const errorPenalty = errorCount * 0.1;
    const warningPenalty = warningCount * 0.05;
    
    // Calculate final score
    const score = Math.max(0, Math.min(1, baseScore - errorPenalty - warningPenalty));
    
    return score;
  }
  
  /**
   * Create checkpoint
   * @param name - Checkpoint name
   * @returns Checkpoint ID
   */
  createCheckpoint(name: string): string {
    // Generate checkpoint ID
    const checkpointId = `checkpoint-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Get previous checkpoint
    let previousCheckpointId: string | undefined;
    let events: string[] = [];
    
    if (this.checkpoints.size > 0) {
      // Get latest checkpoint
      const checkpoints = Array.from(this.checkpoints.values()).sort((a, b) => b.timestamp - a.timestamp);
      previousCheckpointId = checkpoints[0].id;
      
      // Get events since last checkpoint
      events = Array.from(this.events.values())
        .filter((event) => event.timestamp > checkpoints[0].timestamp)
        .map((event) => event.id);
    }    
    // Create checkpoint data
    const data = {
      camera: {
        position: this.camera.position.clone(),
        rotation: this.camera.rotation.clone(),
      },
      renderer: {
        size: {
          width: this.renderer.domElement.width,
          height: this.renderer.domElement.height,
        },
      },
      scene: {
        objectCount: 0,
        visibleObjectCount: 0,
      },
    };
    
    // Count objects in scene
    let objectCount = 0;
    let visibleObjectCount = 0;
    
    this.scene.traverse((object) => {
      objectCount++;
      
      if (object.visible) {
        visibleObjectCount++;
      }
    });
    
    data.scene.objectCount = objectCount;
    data.scene.visibleObjectCount = visibleObjectCount;
    
    // Create checkpoint
    const checkpoint: ConsciousnessCheckpoint = {
      id: checkpointId,
      name,
      timestamp: Date.now(),
      data,
      hash: this.generateCheckpointHash(data),
      previousCheckpointId,
      events,
    };
    
    // Store checkpoint
    this.checkpoints.set(checkpointId, checkpoint);
    
    // Limit checkpoints
    if (this.checkpoints.size > this.options.maxCheckpoints!) {
      // Remove oldest checkpoint
      const oldestCheckpoint = Array.from(this.checkpoints.values()).sort((a, b) => a.timestamp - b.timestamp)[0];
      this.checkpoints.delete(oldestCheckpoint.id);
    }
    
    this.log(`Created checkpoint: ${name} (${checkpointId})`);
    
    return checkpointId;
  }  
  /**
   * Generate checkpoint hash
   * @param data - Checkpoint data
   * @returns Hash
   */
  private generateCheckpointHash(data: any): string {
    // Convert data to string
    const dataString = JSON.stringify(data);
    
    // Generate hash
    let hash = 0;
    
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  }
  
  /**
   * Record event
   * @param type - Event type
   * @param source - Event source
   * @param data - Event data
   * @param severity - Event severity (0-1)
   * @param duration - Event duration (ms)
   * @param relatedEvents - Related events
   * @returns Event ID
   */
  recordEvent(
    type: ConsciousnessEventType,
    source: string,
    data: any,
    severity: number = 0.5,
    duration?: number,
    relatedEvents?: string[]
  ): string {
    // Skip if event filtering is enabled and severity is below minimum
    if (this.options.enableEventFiltering && severity < this.options.minimumEventSeverity!) {
      return '';
    }
    
    // Generate event ID
    const eventId = `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create event
    const event: ConsciousnessEvent = {
      id: eventId,
      type,
      timestamp: Date.now(),
      source,
      data,
      severity,
      duration,
      relatedEvents,
    };
    
    // Store event
    this.events.set(eventId, event);
    
    // Limit events
    if (this.events.size > this.options.maxEvents!) {
      // Remove oldest event
      const oldestEvent = Array.from(this.events.values()).sort((a, b) => a.timestamp - b.timestamp)[0];
      this.events.delete(oldestEvent.id);
    }    
    // Add to current test
    if (this.currentTest) {
      if (type === ConsciousnessEventType.ERROR) {
        this.currentTest.errors.push(data.message || 'Unknown error');
      } else if (type === ConsciousnessEventType.WARNING) {
        this.currentTest.warnings.push(data.message || 'Unknown warning');
      }
    }
    
    this.log(`Recorded event: ${type} (${eventId}) - Severity: ${severity}`);
    
    return eventId;
  }
  
  /**
   * Update
   */
  update(): void {
    if (!this.isInitialized) {
      return;
    }
    
    // Check for camera changes
    this.checkCameraChanges();
    
    // Check for scene changes
    this.checkSceneChanges();
  }
  
  /**
   * Check camera changes
   */
  private checkCameraChanges(): void {
    // Get current camera position and rotation
    const currentPosition = this.camera.position.clone();
    const currentRotation = this.camera.rotation.clone();
    
    // Check if camera position changed significantly
    if (currentPosition.distanceTo(this.previousCameraPosition) > 0.1) {
      // Record event
      this.recordEvent(
        ConsciousnessEventType.CAMERA_CHANGE,
        'camera',
        {
          previousPosition: this.previousCameraPosition.clone(),
          currentPosition: currentPosition.clone(),
          distance: currentPosition.distanceTo(this.previousCameraPosition),
        },
        0.2
      );
      
      // Update previous camera position
      this.previousCameraPosition.copy(currentPosition);
    }
    
    // Check if camera rotation changed significantly
    const rotationDifference = Math.abs(currentRotation.x - this.previousCameraRotation.x) +
                              Math.abs(currentRotation.y - this.previousCameraRotation.y) +
                              Math.abs(currentRotation.z - this.previousCameraRotation.z);
    
    if (rotationDifference > 0.1) {
      // Record event
      this.recordEvent(
        ConsciousnessEventType.CAMERA_CHANGE,
        'camera',
        {
          previousRotation: this.previousCameraRotation.clone(),
          currentRotation: currentRotation.clone(),
          difference: rotationDifference,
        },
        0.2
      );      
      // Update previous camera rotation
      this.previousCameraRotation.copy(currentRotation);
    }
  }
  
  /**
   * Check scene changes
   */
  private checkSceneChanges(): void {
    // Get current scene objects
    const currentSceneObjects = new Set<string>();
    
    this.scene.traverse((object) => {
      if (object.visible && !(object instanceof THREE.Camera) && !(object instanceof THREE.Light)) {
        currentSceneObjects.add(object.uuid);
      }
    });
    
    // Check for added objects
    const addedObjects: string[] = [];
    
    currentSceneObjects.forEach((uuid) => {
      if (!this.previousSceneObjects.has(uuid)) {
        addedObjects.push(uuid);
      }
    });
    
    // Check for removed objects
    const removedObjects: string[] = [];
    
    this.previousSceneObjects.forEach((uuid) => {
      if (!currentSceneObjects.has(uuid)) {
        removedObjects.push(uuid);
      }
    });
    
    // Record event if objects changed
    if (addedObjects.length > 0 || removedObjects.length > 0) {
      this.recordEvent(
        ConsciousnessEventType.OBJECT_CHANGE,
        'scene',
        {
          addedObjects,
          removedObjects,
          addedCount: addedObjects.length,
          removedCount: removedObjects.length,
        },
        0.3
      );
      
      // Update previous scene objects
      this.updatePreviousSceneObjects();
    }
  }
  
  /**
   * Record interaction
   * @param source - Interaction source
   * @param data - Interaction data
   * @returns Event ID
   */
  recordInteraction(source: string, data: any): string {
    return this.recordEvent(
      ConsciousnessEventType.INTERACTION,
      source,
      data,
      0.4
    );
  }  
  /**
   * Record transition
   * @param source - Transition source
   * @param data - Transition data
   * @param duration - Transition duration (ms)
   * @returns Event ID
   */
  recordTransition(source: string, data: any, duration?: number): string {
    return this.recordEvent(
      ConsciousnessEventType.TRANSITION,
      source,
      data,
      0.3,
      duration
    );
  }
  
  /**
   * Record error
   * @param source - Error source
   * @param message - Error message
   * @param data - Error data
   * @returns Event ID
   */
  recordError(source: string, message: string, data: any = {}): string {
    return this.recordEvent(
      ConsciousnessEventType.ERROR,
      source,
      {
        message,
        ...data,
      },
      0.9
    );
  }
  
  /**
   * Record warning
   * @param source - Warning source
   * @param message - Warning message
   * @param data - Warning data
   * @returns Event ID
   */
  recordWarning(source: string, message: string, data: any = {}): string {
    return this.recordEvent(
      ConsciousnessEventType.WARNING,
      source,
      {
        message,
        ...data,
      },
      0.6
    );
  }
  
  /**
   * Record info
   * @param source - Info source
   * @param message - Info message
   * @param data - Info data
   * @returns Event ID
   */
  recordInfo(source: string, message: string, data: any = {}): string {
    return this.recordEvent(
      ConsciousnessEventType.INFO,
      source,
      {
        message,
        ...data,
      },
      0.2
    );
  }  
  /**
   * Test for discontinuities
   * @returns Discontinuities
   */
  testForDiscontinuities(): { found: boolean; details: string[] } {
    const discontinuities: string[] = [];
    
    // Check for missing checkpoints
    const checkpoints = Array.from(this.checkpoints.values()).sort((a, b) => a.timestamp - b.timestamp);
    
    for (let i = 1; i < checkpoints.length; i++) {
      const checkpoint = checkpoints[i];
      const previousCheckpoint = checkpoints[i - 1];
      
      // Check if previous checkpoint ID matches
      if (checkpoint.previousCheckpointId !== previousCheckpoint.id) {
        discontinuities.push(`Checkpoint chain broken between ${previousCheckpoint.id} and ${checkpoint.id}`);
      }
      
      // Check for large time gaps
      const timeGap = checkpoint.timestamp - previousCheckpoint.timestamp;
      
      if (timeGap > this.options.automaticCheckpointInterval! * 2) {
        discontinuities.push(`Large time gap (${timeGap}ms) between checkpoints ${previousCheckpoint.id} and ${checkpoint.id}`);
      }
    }
    
    // Check for errors
    const errors = Array.from(this.events.values()).filter((event) => event.type === ConsciousnessEventType.ERROR);
    
    if (errors.length > 0) {
      discontinuities.push(`Found ${errors.length} errors in consciousness stream`);
    }
    
    return {
      found: discontinuities.length > 0,
      details: discontinuities,
    };
  }
  
  /**
   * Get events
   * @returns Events
   */
  getEvents(): ConsciousnessEvent[] {
    return Array.from(this.events.values());
  }
  
  /**
   * Get checkpoints
   * @returns Checkpoints
   */
  getCheckpoints(): ConsciousnessCheckpoint[] {
    return Array.from(this.checkpoints.values());
  }  
  /**
   * Get current test
   * @returns Current test
   */
  getCurrentTest(): ConsciousnessStreamTestResult | null {
    return this.currentTest ? { ...this.currentTest } : null;
  }
  
  /**
   * Set options
   * @param options - Options
   */
  setOptions(options: ConsciousnessStreamTesterOptions): void {
    this.options = {
      ...this.options,
      ...options,
    };
    
    // Update automatic checkpoints
    if (options.enableAutomaticCheckpoints !== undefined || 
        options.automaticCheckpointInterval !== undefined) {
      if (this.options.enableAutomaticCheckpoints) {
        this.startAutomaticCheckpoints();
      } else {
        this.stopAutomaticCheckpoints();
      }
    }
  }
  
  /**
   * Dispose
   */
  dispose(): void {
    // Stop automatic checkpoints
    this.stopAutomaticCheckpoints();
    
    // Clear events and checkpoints
    this.events.clear();
    this.checkpoints.clear();
    
    // Clear current test
    this.currentTest = null;
    
    // Mark as not initialized
    this.isInitialized = false;
    
    this.log('Consciousness Stream Tester disposed');
  }
  
  /**
   * Log message if debug mode is enabled
   * @param message - Message to log
   */
  private log(message: string): void {
    if (this.options.debugMode) {
      console.log(`[ConsciousnessStreamTester] ${message}`);
    }
  }
}

export { ConsciousnessStreamTester };