<template>
  <svg class="connector-svg" :style="svgStyle">
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"
        markerUnits="strokeWidth">
        <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
      </marker>
    </defs>

    <!-- Connection line -->
    <path :d="pathData" stroke="#374151" stroke-width="2" fill="none" marker-end="url(#arrowhead)"
      class="connection-line" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Connection, ConnectionPoint } from './types'

interface Props {
  connection: Connection
  sourcePosition: ConnectionPoint
  targetPosition: ConnectionPoint
}

const props = defineProps<Props>()

const svgStyle = computed(() => {
  const minX = Math.min(props.sourcePosition.x, props.targetPosition.x) - 20
  const minY = Math.min(props.sourcePosition.y, props.targetPosition.y) - 20
  const maxX = Math.max(props.sourcePosition.x, props.targetPosition.x) + 20
  const maxY = Math.max(props.sourcePosition.y, props.targetPosition.y) + 20

  return {
    position: 'absolute' as const,
    left: `${minX}px`,
    top: `${minY}px`,
    width: `${maxX - minX}px`,
    height: `${maxY - minY}px`,
    pointerEvents: 'none' as const,
    zIndex: 1
  }
})

const pathData = computed(() => {
  const minX = Math.min(props.sourcePosition.x, props.targetPosition.x) - 20
  const minY = Math.min(props.sourcePosition.y, props.targetPosition.y) - 20

  const startX = props.sourcePosition.x - minX
  const startY = props.sourcePosition.y - minY
  const endX = props.targetPosition.x - minX
  const endY = props.targetPosition.y - minY

  // Create a smooth curve
  const controlPoint1X = startX + (endX - startX) * 0.5
  const controlPoint1Y = startY
  const controlPoint2X = startX + (endX - startX) * 0.5
  const controlPoint2Y = endY

  return `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`
})
</script>

<style scoped>
.connector-svg {
  pointer-events: none;
}

.connection-line {
  transition: all 0.2s ease;
}

.connection-line:hover {
  stroke-width: 3;
  stroke: #2563eb;
}
</style>
