<template>
  <div ref="shapeElement" class="draggable-shape"
    :class="{ dragging: isDragging, resizing: isResizing, 'anchor-mode': isAnchorMode }" :style="shapeStyle"
    @contextmenu.prevent.stop="handleContextMenu" @mousedown.left="startDrag" @touchstart="startDrag"
    @click.left="handleClick">

    <!-- Shape Renderer -->
    <ShapeRenderer :geometry="shapeGeometry || 'rectangle'" :width="size.width" :height="size.height"
      :background-color="backgroundColor || '#4f46e5'" :border-color="borderColor || '#312e81'"
      :border-radius="borderRadius || 8" />

    <!-- Content Overlay -->
    <div class="shape-content-overlay">
      <slot>
        <div class="default-shape">
          {{ label || 'Shape' }}
        </div>
      </slot>
    </div>

    <!-- Resize handles (only show when not in anchor mode) -->
    <template v-if="resizable && !disabled && !isAnchorMode">
      <!-- Corner handles -->
      <div class="resize-handle resize-handle-nw" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'nw') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'nw') }"></div>
      <div class="resize-handle resize-handle-ne" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'ne') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'ne') }"></div>
      <div class="resize-handle resize-handle-sw" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'sw') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'sw') }"></div>
      <div class="resize-handle resize-handle-se" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'se') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'se') }"></div>

      <!-- Edge handles -->
      <div class="resize-handle resize-handle-n" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'n') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'n') }"></div>
      <div class="resize-handle resize-handle-s" @mousedown="(e) => { e.stopPropagation(); startResize(e, 's') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 's') }"></div>
      <div class="resize-handle resize-handle-e" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'e') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'e') }"></div>
      <div class="resize-handle resize-handle-w" @mousedown="(e) => { e.stopPropagation(); startResize(e, 'w') }"
        @touchstart="(e) => { e.stopPropagation(); startResize(e, 'w') }"></div>
    </template>

    <!-- Anchor points (only show when in anchor mode) -->
    <template v-if="isAnchorMode">
      <div class="anchor-point anchor-point-top" @click.stop="handleAnchorClick('top')"></div>
      <div class="anchor-point anchor-point-right" @click.stop="handleAnchorClick('right')"></div>
      <div class="anchor-point anchor-point-bottom" @click.stop="handleAnchorClick('bottom')"></div>
      <div class="anchor-point anchor-point-left" @click.stop="handleAnchorClick('left')"></div>
    </template>

    <!-- Debug info -->
    <!-- Debug info -->
    <div v-if="false"
      style="position: absolute; top: -30px; left: 0; font-size: 10px; background: yellow; padding: 2px; z-index: 1000;">
      Anchor: {{ isAnchorMode }} | Prop: {{ anchorMode }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShapeProps, ShapeEvents, Position } from './types'
import { useShape } from './composables/useShape'
import ShapeRenderer from './ShapeRenderer.vue'

const props = withDefaults(defineProps<ShapeProps>(), {
  id: '',
  initialX: 100,
  initialY: 100,
  label: 'Shape',
  width: 120,
  height: 80,
  shapeGeometry: 'rectangle',
  backgroundColor: '#4f46e5',
  borderColor: '#312e81',
  borderRadius: 8,
  disabled: false,
  resizable: true,
  minWidth: 50,
  minHeight: 30,
  maxWidth: 500,
  maxHeight: 300,
  anchorMode: false
})

const emit = defineEmits<ShapeEvents>()

// Create wrapper function for emit
const emitWrapper = (event: 'dragStart' | 'dragMove' | 'dragEnd' | 'click' | 'resizeStart' | 'resizeMove' | 'resizeEnd' | 'anchorModeToggle' | 'anchorClick', data: Position | { width: number; height: number } | boolean | { shapeId: string; anchor: string; position: { x: number; y: number } }) => {
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
    case 'anchorModeToggle':
      emit('anchorModeToggle', data as boolean)
      break
    case 'anchorClick':
      const anchorData = data as { shapeId: string; anchor: string; position: { x: number; y: number } }
      emit('anchorClick', anchorData.shapeId, anchorData.anchor as 'top' | 'right' | 'bottom' | 'left', anchorData.position)
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
  isAnchorMode,
  startDrag,
  startResize,
  handleClick,
  handleContextMenu,
  handleAnchorClick,
  disableAnchorMode,
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
  getSize,
  disableAnchorMode
})
</script>

<style scoped>
.draggable-shape {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  transition: box-shadow 0.2s ease;
  z-index: 1;
  /* Remove any background - let ShapeRenderer handle the visual */
  background: transparent;
  border: none;
}

.draggable-shape:hover {
  /* Keep shadow but no background */
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
}

.draggable-shape.dragging {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
  z-index: 1000;
}

.draggable-shape.resizing {
  filter: drop-shadow(0 8px 24px rgba(0, 0, 0, 0.3));
  z-index: 1000;
}

.shape-content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 2;
}

.default-shape {
  font-size: 14px;
  font-weight: 500;
  color: white;
  text-align: center;
  pointer-events: none;
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

/* Anchor points */
.anchor-point {
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: #ef4444;
  border: 2px solid #dc2626;
  border-radius: 50%;
  z-index: 15;
  opacity: 1;
  transition: all 0.2s ease;
  cursor: pointer;
  pointer-events: auto;
}

/* Anchor point positions - center of each edge */
.anchor-point-top {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.anchor-point-right {
  top: 50%;
  right: -6px;
  transform: translateY(-50%);
}

.anchor-point-bottom {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
}

.anchor-point-left {
  top: 50%;
  left: -6px;
  transform: translateY(-50%);
}

/* Anchor mode styling */
.draggable-shape.anchor-mode:hover {
  filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3));
}
</style>
