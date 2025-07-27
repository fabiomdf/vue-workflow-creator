<template>
  <div ref="shapeElement" class="draggable-shape" :class="{ dragging: isDragging, resizing: isResizing }"
    :style="shapeStyle" @mousedown="startDrag" @touchstart="startDrag" @click="handleClick">
    <div class="shape-content">
      <slot>
        <div class="default-shape">
          {{ label || 'Shape' }}
        </div>
      </slot>
    </div>

    <!-- Resize handles -->
    <template v-if="resizable && !disabled">
      <!-- Corner handles -->
      <div class="resize-handle resize-handle-nw" @mousedown="(e) => startResize(e, 'nw')"
        @touchstart="(e) => startResize(e, 'nw')"></div>
      <div class="resize-handle resize-handle-ne" @mousedown="(e) => startResize(e, 'ne')"
        @touchstart="(e) => startResize(e, 'ne')"></div>
      <div class="resize-handle resize-handle-sw" @mousedown="(e) => startResize(e, 'sw')"
        @touchstart="(e) => startResize(e, 'sw')"></div>
      <div class="resize-handle resize-handle-se" @mousedown="(e) => startResize(e, 'se')"
        @touchstart="(e) => startResize(e, 'se')"></div>

      <!-- Edge handles -->
      <div class="resize-handle resize-handle-n" @mousedown="(e) => startResize(e, 'n')"
        @touchstart="(e) => startResize(e, 'n')"></div>
      <div class="resize-handle resize-handle-s" @mousedown="(e) => startResize(e, 's')"
        @touchstart="(e) => startResize(e, 's')"></div>
      <div class="resize-handle resize-handle-e" @mousedown="(e) => startResize(e, 'e')"
        @touchstart="(e) => startResize(e, 'e')"></div>
      <div class="resize-handle resize-handle-w" @mousedown="(e) => startResize(e, 'w')"
        @touchstart="(e) => startResize(e, 'w')"></div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ShapeProps, ShapeEvents, Position } from './types'
import { useShape } from './composables/useShape'

const props = withDefaults(defineProps<ShapeProps>(), {
  initialX: 100,
  initialY: 100,
  label: 'Shape',
  width: 120,
  height: 80,
  backgroundColor: '#4f46e5',
  borderColor: '#312e81',
  borderRadius: 8,
  disabled: false,
  resizable: true,
  minWidth: 50,
  minHeight: 30,
  maxWidth: 500,
  maxHeight: 300
})

const emit = defineEmits<ShapeEvents>()

// Create wrapper function for emit
const emitWrapper = (event: 'dragStart' | 'dragMove' | 'dragEnd' | 'click' | 'resizeStart' | 'resizeMove' | 'resizeEnd', data: Position | { width: number; height: number }) => {
  switch (event) {
    case 'dragStart':
      emit('dragStart', data as Position)
      break
    case 'dragMove':
      emit('dragMove', data as Position)
      break
    case 'dragEnd':
      emit('dragEnd', data as Position)
      break
    case 'click':
      emit('click', data as Position)
      break
    case 'resizeStart':
      emit('resizeStart', data as { width: number; height: number })
      break
    case 'resizeMove':
      emit('resizeMove', data as { width: number; height: number })
      break
    case 'resizeEnd':
      emit('resizeEnd', data as { width: number; height: number })
      break
  }
}

const {
  shapeElement,
  position,
  size,
  isDragging,
  isResizing,
  shapeStyle,
  startDrag,
  startResize,
  handleClick,
  setPosition,
  getPosition,
  setSize,
  getSize
} = useShape(props, emitWrapper)

// Expose methods for parent components
defineExpose({
  position,
  size,
  setPosition,
  getPosition,
  setSize,
  getSize
})
</script>

<style scoped>
.draggable-shape {
  position: absolute;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: box-shadow 0.2s ease;
  z-index: 1;
}

.draggable-shape:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.draggable-shape.dragging {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.draggable-shape.resizing {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.shape-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.default-shape {
  color: white;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  padding: 4px;
}

/* Resize handles */
.resize-handle {
  position: absolute;
  background-color: #3b82f6;
  border: 1px solid #1e40af;
  border-radius: 2px;
  z-index: 10;
}

/* Corner handles */
.resize-handle-nw {
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: nw-resize;
}

.resize-handle-ne {
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: ne-resize;
}

.resize-handle-sw {
  bottom: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  cursor: sw-resize;
}

.resize-handle-se {
  bottom: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  cursor: se-resize;
}

/* Edge handles */
.resize-handle-n {
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  cursor: n-resize;
}

.resize-handle-s {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  cursor: s-resize;
}

.resize-handle-e {
  top: 50%;
  right: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  cursor: e-resize;
}

.resize-handle-w {
  top: 50%;
  left: -4px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  cursor: w-resize;
}

/* Hide handles when not hovering */
.resize-handle {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.draggable-shape:hover .resize-handle {
  opacity: 1;
}

.draggable-shape.resizing .resize-handle {
  opacity: 1;
}
</style>
