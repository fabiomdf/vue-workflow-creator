<template>
  <svg class="connector-svg" :style="svgStyle">
    <defs>
      <!-- Seta apontando para baixo (quando target anchor é 'top') -->
      <marker id="arrow-down" markerWidth="10" markerHeight="10" refX="5" refY="10" orient="0">
        <polygon points="5 0, 10 10, 0 10" fill="#374151" />
      </marker>

      <!-- Seta apontando para cima (quando target anchor é 'bottom') -->
      <marker id="arrow-up" markerWidth="10" markerHeight="10" refX="5" refY="0" orient="0">
        <polygon points="5 10, 10 0, 0 0" fill="#374151" />
      </marker>

      <!-- Seta apontando para a direita (quando target anchor é 'left') -->
      <marker id="arrow-right" markerWidth="10" markerHeight="10" refX="10" refY="5" orient="0">
        <polygon points="0 0, 10 5, 0 10" fill="#374151" />
      </marker>

      <!-- Seta apontando para a esquerda (quando target anchor é 'right') -->
      <marker id="arrow-left" markerWidth="10" markerHeight="10" refX="0" refY="5" orient="0">
        <polygon points="10 0, 0 5, 10 10" fill="#374151" />
      </marker>
    </defs>

    <!-- Connection line -->
    <path :d="pathData" stroke="#374151" stroke-width="2" fill="none" :marker-end="arrowMarker"
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

// Calcula qual marcador de seta usar baseado no anchor de destino
const arrowMarker = computed(() => {
  switch (props.connection.targetAnchor) {
    case 'top':
      return 'url(#arrow-up)'    // Seta aponta para cima (entrando no shape pelo topo)
    case 'bottom':
      return 'url(#arrow-down)'  // Seta aponta para baixo (entrando no shape por baixo)
    case 'left':
      return 'url(#arrow-right)' // Seta aponta para a direita (entrando no shape pela esquerda)
    case 'right':
      return 'url(#arrow-left)'  // Seta aponta para a esquerda (entrando no shape pela direita)
    default:
      return 'url(#arrow-up)'
  }
})

// Ajusta a posição final para conectar no centro da base da seta
const adjustedTargetPosition = computed(() => {
  const offset = 10 // Distância da seta

  switch (props.connection.targetAnchor) {
    case 'top':
      // Seta aponta para cima, linha vem de baixo
      return {
        x: props.targetPosition.x,
        y: props.targetPosition.y - offset
      }
    case 'bottom':
      // Seta aponta para baixo, linha vem de cima
      return {
        x: props.targetPosition.x,
        y: props.targetPosition.y + offset
      }
    case 'left':
      // Seta aponta para a direita, linha vem da esquerda
      return {
        x: props.targetPosition.x - offset,
        y: props.targetPosition.y
      }
    case 'right':
      // Seta aponta para a esquerda, linha vem da direita
      return {
        x: props.targetPosition.x + offset,
        y: props.targetPosition.y
      }
    default:
      return props.targetPosition
  }
})

const svgStyle = computed(() => {
  const minX = Math.min(props.sourcePosition.x, adjustedTargetPosition.value.x) - 20
  const minY = Math.min(props.sourcePosition.y, adjustedTargetPosition.value.y) - 20
  const maxX = Math.max(props.sourcePosition.x, adjustedTargetPosition.value.x) + 20
  const maxY = Math.max(props.sourcePosition.y, adjustedTargetPosition.value.y) + 20

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
  const minX = Math.min(props.sourcePosition.x, adjustedTargetPosition.value.x) - 20
  const minY = Math.min(props.sourcePosition.y, adjustedTargetPosition.value.y) - 20

  const startX = props.sourcePosition.x - minX
  const startY = props.sourcePosition.y - minY
  const endX = adjustedTargetPosition.value.x - minX
  const endY = adjustedTargetPosition.value.y - minY

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
