// Components
export { default as DraggableShape } from './DraggableShape.vue'
export { default as ShapeRenderer } from './ShapeRenderer.vue'
export { default as ShapeSelector } from './ShapeSelector.vue'

// Types
export type * from './types'

// Services
export { ShapeConfigService } from './services/ShapeConfigService'
export { DragBehavior } from './services/DragBehavior'
export { ResizeBehavior } from './services/ResizeBehavior'
export { PositionManager } from './services/PositionManager'
export { SizeManager } from './services/SizeManager'
export { StyleManager } from './services/StyleManager'
export { EventHandlerFactory } from './services/EventHandler'

// Composables
export { useShape } from './composables/useShape'

// Interfaces
export type * from './interfaces'
