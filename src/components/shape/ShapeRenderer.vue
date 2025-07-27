<template>
  <!-- Rectangle -->
  <div v-if="geometry === 'rectangle'" class="shape-rectangle" :style="rectangleStyle"></div>

  <!-- Circle -->
  <div v-else-if="geometry === 'circle'" class="shape-circle" :style="circleStyle"></div>

  <!-- Diamond -->
  <svg v-else-if="geometry === 'diamond'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="50,5 95,50 50,95 5,50" :fill="backgroundColor" :stroke="borderColor" :stroke-width="strokeWidth" />
  </svg>

  <!-- Parallelogram -->
  <svg v-else-if="geometry === 'parallelogram'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="20,10 90,10 80,90 10,90" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Triangle -->
  <svg v-else-if="geometry === 'triangle'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="50,10 90,90 10,90" :fill="backgroundColor" :stroke="borderColor" :stroke-width="strokeWidth" />
  </svg>

  <!-- Hexagon -->
  <svg v-else-if="geometry === 'hexagon'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="25,10 75,10 90,50 75,90 25,90 10,50" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Trapezoid -->
  <svg v-else-if="geometry === 'trapezoid'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="30,10 70,10 90,90 10,90" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Pentagon -->
  <svg v-else-if="geometry === 'pentagon'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="50,10 90,35 75,85 25,85 10,35" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Cylinder -->
  <svg v-else-if="geometry === 'cylinder'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <ellipse cx="50" cy="15" rx="40" ry="10" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
    <rect x="10" y="15" width="80" height="70" :fill="backgroundColor" :stroke="borderColor" :stroke-width="strokeWidth"
      stroke-dasharray="0" />
    <ellipse cx="50" cy="85" rx="40" ry="10" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Oval -->
  <div v-else-if="geometry === 'oval'" class="shape-oval" :style="ovalStyle"></div>

  <!-- Star -->
  <svg v-else-if="geometry === 'star'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="50,10 61,35 90,35 69,57 79,91 50,70 21,91 31,57 10,35 39,35" :fill="backgroundColor"
      :stroke="borderColor" :stroke-width="strokeWidth" />
  </svg>

  <!-- Arrow -->
  <svg v-else-if="geometry === 'arrow'" class="shape-svg" :style="svgStyle" viewBox="0 0 100 100"
    preserveAspectRatio="none">
    <polygon points="10,40 60,40 60,20 90,50 60,80 60,60 10,60" :fill="backgroundColor" :stroke="borderColor"
      :stroke-width="strokeWidth" />
  </svg>

  <!-- Default Rectangle for unknown shapes -->
  <div v-else class="shape-rectangle" :style="rectangleStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ShapeGeometry } from './types'

interface Props {
  geometry: ShapeGeometry
  width: number
  height: number
  backgroundColor: string
  borderColor: string
  borderRadius?: number
}

const props = withDefaults(defineProps<Props>(), {
  borderRadius: 0
})

const rectangleStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  backgroundColor: props.backgroundColor,
  border: `2px solid ${props.borderColor}`,
  borderRadius: `${props.borderRadius}px`,
  position: 'absolute' as const,
  top: '0',
  left: '0',
  boxSizing: 'border-box' as const
}))

const circleStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  backgroundColor: props.backgroundColor,
  border: `2px solid ${props.borderColor}`,
  borderRadius: '50%',
  position: 'absolute' as const,
  top: '0',
  left: '0',
  boxSizing: 'border-box' as const
}))

const ovalStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  backgroundColor: props.backgroundColor,
  border: `2px solid ${props.borderColor}`,
  borderRadius: '50%',
  position: 'absolute' as const,
  top: '0',
  left: '0',
  boxSizing: 'border-box' as const
}))

const svgStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'absolute' as const,
  top: '0',
  left: '0'
}))

const strokeWidth = computed(() => {
  // Calculate stroke width based on shape size
  const avgSize = (props.width + props.height) / 2
  return Math.max(1, Math.round(avgSize / 50))
})
</script>

<style scoped>
.shape-svg {
  display: block;
}

/* Special handling for cylinder to avoid border conflicts */
.shape-svg rect {
  stroke-dasharray: none !important;
}
</style>
