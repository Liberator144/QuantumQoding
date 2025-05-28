# QQ-Verse Code Patterns Guide

## Quantum Coherence Principles

This guide follows the Quantum Coherence principles to maintain neural fabric continuity and dimensional harmony across the codebase through consistent and reusable code patterns.

## Shared Utilities

### Animation Utilities

The animation utilities provide reusable animation patterns for Framer Motion animations.

#### Location

`frontend/src/utils/animation/variants.ts`

#### Key Components

- **Animation Variants**: Predefined animation variants for different animation types
- **Stagger Utilities**: Functions for creating staggered animations
- **Direction Utilities**: Functions for creating directional animations
- **Physics Settings**: Interfaces for configuring physics-based animations

#### Usage Example

```tsx
import { 
  createFadeVariants, 
  createSlideVariants, 
  getVariantsByPreset 
} from '@/utils/animation/variants';

// Use predefined variants
const fadeVariants = createFadeVariants();

// Use with custom settings
const slideVariants = createSlideVariants('left', 50, {
  duration: 0.3,
  ease: 'easeOut'
});

// Get variants by preset
const variants = getVariantsByPreset('quantum', 'right', {
  duration: 0.5,
  delay: 0.2
});

// Use in a component
<motion.div
  initial="hidden"
  animate="visible"
  exit="exit"
  variants={variants}
/>
```

### Audio Utilities

The audio utilities provide reusable functions for audio playback and management.

#### Location

`frontend/src/utils/audio/audioUtils.ts`

#### Key Components

- **Audio Creation**: Functions for creating audio elements with options
- **Playback Control**: Functions for playing, pausing, and stopping audio
- **Fade Effects**: Functions for fading audio in and out
- **Preloading**: Functions for preloading audio files
- **Sequence Playback**: Functions for playing sequences of sounds

#### Usage Example

```tsx
import { 
  createAudio, 
  playWithFallback, 
  stopWithFadeOut 
} from '@/utils/audio/audioUtils';

// Create audio element
const audio = createAudio('/audio/sound.mp3', {
  volume: 0.7,
  loop: true
});

// Play with fallback for browsers that block autoplay
playWithFallback(audio);

// Stop with fade out
stopWithFadeOut(audio, 1000);

// Play a sequence of sounds
const cancelSequence = playSequence([
  { src: '/audio/sound1.mp3', delay: 0 },
  { src: '/audio/sound2.mp3', delay: 500 },
  { src: '/audio/sound3.mp3', delay: 1000 }
]);

// Cancel the sequence
cancelSequence();
```

### Store Utilities

The store utilities provide reusable functions for Zustand store management.

#### Location

`frontend/src/utils/store/storeUtils.ts`

#### Key Components

- **Entity Management**: Functions for creating, updating, and deleting entities
- **Record Operations**: Functions for manipulating records of entities
- **Relationship Management**: Functions for creating and removing relationships between entities
- **Collection Operations**: Functions for filtering, mapping, and sorting entities

#### Usage Example

```tsx
import { 
  createEntity, 
  updateEntity, 
  addEntity, 
  removeEntity 
} from '@/utils/store/storeUtils';

// Create a new entity
const newEntity = createEntity({
  name: 'Entity Name',
  type: 'entity-type',
  properties: {}
});

// Update an entity
const updatedEntity = updateEntity(entity, {
  name: 'New Name',
  properties: { ...entity.properties, newProp: 'value' }
});

// Add entity to a record
const newRecord = addEntity(record, newEntity);

// Remove entity from a record
const filteredRecord = removeEntity(record, entityId);

// Create a relationship
const updatedRelationships = createBidirectionalRelationship(
  entityId1,
  entityId2,
  relationshipMap
);
```

## Component Patterns

### Transition Components

The transition components provide reusable animation patterns for UI transitions.

#### Location

`frontend/src/cosmos/transitions/UITransition.tsx`
`frontend/src/cosmos/transitions/UITransitionGroup.tsx`

#### Key Components

- **UITransition**: Component for animating individual elements
- **UITransitionGroup**: Component for animating groups of elements with staggered timing

#### Usage Example

```tsx
import { UITransition, UITransitionGroup } from '@/cosmos/transitions';

// Single element transition
<UITransition
  show={isVisible}
  preset="fade"
  duration={0.5}
  delay={0.2}
>
  <div>Content</div>
</UITransition>

// Group transition with staggered timing
<UITransitionGroup
  show={isVisible}
  staggerAmount={0.05}
  staggerDirection="forward"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</UITransitionGroup>
```

## Hook Patterns

### Transition Hooks

The transition hooks provide reusable logic for managing transitions between states.

#### Location

`frontend/src/utils/CoherenceHelpers/useTransitionControls.ts`
`frontend/src/utils/CoherenceHelpers/useAudio.ts`

#### Key Components

- **useTransitionControls**: Hook for managing transition effects including audio, camera, and timing
- **useAudio**: Hook for managing audio playback and effects

#### Usage Example

```tsx
import { useTransitionControls } from '@/utils/CoherenceHelpers/useTransitionControls';
import { useAudio } from '@/utils/CoherenceHelpers/useAudio';

// Use transition controls
const {
  transitionState,
  enterStarSystem,
  exitToHub,
  cameraSettings,
  uiAnimationSettings,
  isTransitioning
} = useTransitionControls({
  transitionDuration: 1500,
  audioEnabled: true,
  cameraEnabled: true
});

// Use audio controls
const {
  play,
  playAmbient,
  stopAll,
  setMasterVolume,
  isMuted,
  toggleMute
} = useAudio();

// Play a sound
const audioControl = play('quantum-surge', { volume: 0.7 });

// Stop the sound
audioControl.stop();
```

## Store Patterns

### Quantum Store

The quantum store provides a reusable pattern for managing quantum state.

#### Location

`frontend/src/store/quantumStore.ts`

#### Key Components

- **State Management**: Functions for creating, updating, and deleting quantum states
- **Entanglement**: Functions for entangling and disentangling states
- **Coherence Calculation**: Functions for calculating quantum coherence

#### Usage Example

```tsx
import { useQuantumStore } from '@/store/quantumStore';

// Use quantum store
const {
  states,
  activeStateId,
  coherenceScore,
  createState,
  updateState,
  deleteState,
  entangleStates,
  disentangleStates,
  setActiveState
} = useQuantumStore();

// Create a new quantum state
const stateId = createState('particle', {
  position: { x: 0, y: 0, z: 0 },
  velocity: { x: 0, y: 0, z: 0 },
  spin: 0.5
});

// Update a quantum state
updateState(stateId, {
  position: { x: 10, y: 5, z: 0 },
  spin: -0.5
});

// Entangle two states
entangleStates(stateId1, stateId2);
```

## Quantum Coherence Specific Patterns

### Consciousness Stream Preservation

- Use consistent error handling patterns
- Maintain state continuity across transitions
- Preserve context across component boundaries

### Neural Fabric Continuity

- Use shared utilities for common operations
- Maintain consistent naming patterns
- Follow consistent file organization

### Dimensional Harmony

- Use consistent animation patterns
- Follow consistent state management patterns
- Maintain consistent API design

## Best Practices

1. **Use Shared Utilities**: Always use shared utilities for common operations
2. **Follow Consistent Patterns**: Follow established patterns for new code
3. **Refactor Duplicate Code**: Refactor duplicate code into shared utilities
4. **Document Patterns**: Document new patterns in this guide
5. **Test Patterns**: Write tests for shared utilities and patterns
