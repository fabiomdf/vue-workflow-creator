<template>
  <div class="workflow-canvas">
    <div class="toolbar">
      <h1>Vue Workflow Creator</h1>
      <button @click="() => addShape()" class="add-shape-btn">Add Random Shape</button>
      <button @click="() => clearAll()" class="clear-btn">Clear All</button>
      <span class="shape-count">Shapes: {{ shapes.length }}</span>
    </div>

    <div class="main-content">
      <!-- Shape Selector Panel -->
      <div class="sidebar">
        <ShapeSelector @shape-selected="onShapeSelected" />
      </div>

      <!-- Canvas Area -->
      <div class="canvas" ref="canvasRef">
        <!-- Connections Layer -->
        <ShapeConnector v-for="connection in connections" :key="connection.id" :connection="connection"
          :source-position="getAnchorPosition(connection.sourceShapeId, connection.sourceAnchor)"
          :target-position="getAnchorPosition(connection.targetShapeId, connection.targetAnchor)" />

        <!-- Shapes Layer -->
        <DraggableShape v-for="shape in shapes" :key="shape.id" :ref="(el) => setShapeRef(shape.id, el)" :id="shape.id" :initial-x="shape.position.x"
          :initial-y="shape.position.y" :label="shape.label" :width="shape.style.width" :height="shape.style.height"
          :shape-geometry="shape.geometry || 'rectangle'" :background-color="shape.style.backgroundColor"
          :border-color="shape.style.borderColor" :border-radius="shape.style.borderRadius" :resizable="true"
          @drag-start="onShapeDragStart(shape.id, $event)" @drag-move="onShapeDragMove(shape.id, $event)"
          @drag-end="onShapeDragEnd(shape.id, $event)" @click="onShapeClick(shape.id, $event)"
          @resize-start="onShapeResizeStart(shape.id, $event)" @resize-move="onShapeResizeMove(shape.id, $event)"
          @resize-end="onShapeResizeEnd(shape.id, $event)"
          @anchor-mode-toggle="onShapeAnchorModeToggle(shape.id, $event)" @anchor-click="onShapeAnchorClick">
          <div class="custom-shape-content">
            <div class="shape-title">{{ shape.label }}</div>
            <div class="shape-subtitle">{{ shape.type }}</div>
          </div>
        </DraggableShape>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DraggableShape, ShapeSelector, ShapeConnector } from '@/components/shape'
import { useWorkflow } from '@/composables/useWorkflow'
import { useConnections } from '@/composables/useConnections'
import type { ShapeType, AnchorPoint, ConnectionPoint } from '@/components/shape/types'

const canvasRef = ref<HTMLElement>()

// Store refs to all shape components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const shapeRefs = ref<Map<string, any>>(new Map())

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setShapeRef = (shapeId: string, el: any) => {
  if (el) {
    shapeRefs.value.set(shapeId, el)
  } else {
    shapeRefs.value.delete(shapeId)
  }
}

// Function to disable anchor mode on all shapes
const disableAllAnchorModes = () => {
  shapeRefs.value.forEach((shapeRef) => {
    if (shapeRef && typeof shapeRef.disableAnchorMode === 'function') {
      shapeRef.disableAnchorMode()
    }
  })
}

const {
  shapes,
  onShapeDragStart,
  onShapeDragMove,
  onShapeDragEnd,
  onShapeClick,
  onShapeResizeStart,
  onShapeResizeMove,
  onShapeResizeEnd,
  onShapeAnchorModeToggle,
  addShape,
  clearShapes,
  addRandomShapes
} = useWorkflow()

const {
  connections,
  isConnecting,
  startConnection,
  completeConnection,
  clearAllConnections
} = useConnections()

// Handle shape selection from the selector
const onShapeSelected = (shapeType: ShapeType) => {
  // Add shape at a default position, user can drag it later
  const position = { x: 200 + Math.random() * 100, y: 100 + Math.random() * 100 }
  addShape(shapeType, position)
}

// Handle anchor clicks for connections
const onShapeAnchorClick = (shapeId: string, anchor: AnchorPoint, position: ConnectionPoint) => {
  console.log('🔗 Anchor clicked:', { shapeId, anchor, position })

  if (isConnecting.value) {
    // Complete the connection
    const connection = completeConnection(shapeId, anchor)
    if (connection) {
      // Disable anchor mode on all shapes after successful connection
      disableAllAnchorModes()
    }
  } else {
    // Start a new connection
    startConnection(shapeId, anchor, position)
  }
}

// Get anchor position for a specific shape and anchor point
const getAnchorPosition = (shapeId: string, anchor: AnchorPoint): ConnectionPoint => {
  const shape = shapes.value.find(s => s.id === shapeId)
  if (!shape) {
    return { x: 0, y: 0 }
  }

  const { position, style } = shape

  switch (anchor) {
    case 'top':
      return {
        x: position.x + style.width / 2,
        y: position.y
      }
    case 'right':
      return {
        x: position.x + style.width,
        y: position.y + style.height / 2
      }
    case 'bottom':
      return {
        x: position.x + style.width / 2,
        y: position.y + style.height
      }
    case 'left':
      return {
        x: position.x,
        y: position.y + style.height / 2
      }
    default:
      return { x: position.x, y: position.y }
  }
}

// Clear all shapes and connections
const clearAll = () => {
  disableAllAnchorModes() // Disable anchor mode on all shapes first
  clearShapes()
  clearAllConnections()
  console.log('🧹 Cleared all shapes and connections')
}// Add some initial shapes
addRandomShapes(3)
</script>

<style scoped>
.workflow-canvas {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

.toolbar {
  background: white;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-right: auto;
}

.add-shape-btn,
.clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-shape-btn {
  background-color: #3b82f6;
  color: white;
}

.add-shape-btn:hover {
  background-color: #2563eb;
}

.clear-btn {
  background-color: #ef4444;
  color: white;
}

.clear-btn:hover {
  background-color: #dc2626;
}

.shape-count {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.main-content {
  display: flex;
  flex: 1;
  height: calc(100vh - 80px);
}

.sidebar {
  width: 300px;
  background-color: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 16px;
  overflow-y: auto;
}

.canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-image:
    linear-gradient(#e2e8f0 1px, transparent 1px),
    linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
  background-size: 20px 20px;
}

.custom-shape-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
}

.shape-title {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}

.shape-subtitle {
  font-size: 12px;
  opacity: 0.9;
}
</style>
