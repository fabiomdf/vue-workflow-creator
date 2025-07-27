<template>
  <div ref="shapeElement" class="draggable-shape" :class="{ dragging: isDragging }" :style="shapeStyle"
    @mousedown="startDrag" @touchstart="startDrag" @click="handleClick">
    <div class="shape-content">
      <slot>
        <div class="default-shape">
          {{ label || 'Shape' }}
        </div>
      </slot>
    </div>
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
  disabled: false
})

const emit = defineEmits<ShapeEvents>()

// Create wrapper function for emit
const emitWrapper = (event: 'dragStart' | 'dragMove' | 'dragEnd' | 'click', position: Position) => {
  switch (event) {
    case 'dragStart':
      emit('dragStart', position)
      break
    case 'dragMove':
      emit('dragMove', position)
      break
    case 'dragEnd':
      emit('dragEnd', position)
      break
    case 'click':
      emit('click', position)
      break
  }
}

const {
  shapeElement,
  position,
  isDragging,
  shapeStyle,
  startDrag,
  handleClick,
  setPosition,
  getPosition
} = useShape(props, emitWrapper)

// Expose methods for parent components
defineExpose({
  position,
  setPosition,
  getPosition
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
</style>
