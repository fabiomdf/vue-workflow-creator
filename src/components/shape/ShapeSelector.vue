<template>
    <div class="shape-selector">
        <h3 class="selector-title">Shape Library</h3>

        <!-- Category Filter -->
        <div class="category-filter">
            <button v-for="category in categories" :key="category.key"
                :class="['category-btn', { active: selectedCategory === category.key }]"
                @click="selectedCategory = category.key">
                {{ category.label }}
            </button>
        </div>

        <!-- Shape Grid -->
        <div class="shape-grid">
            <div v-for="shapeConfig in filteredShapes" :key="shapeConfig.type" class="shape-item"
                :title="shapeConfig.description" @click="selectShape(shapeConfig.type)">
                <!-- Shape Preview -->
                <div class="shape-preview">
                    <ShapeRenderer :geometry="shapeConfig.geometry" :width="40" :height="30"
                        :background-color="shapeConfig.backgroundColor" :border-color="shapeConfig.borderColor"
                        :border-radius="4" />
                </div>

                <!-- Shape Label -->
                <span class="shape-label">{{ shapeConfig.type }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ShapeType, ShapeTypeConfig } from './types'
import { ShapeConfigService } from './services/ShapeConfigService'
import ShapeRenderer from './ShapeRenderer.vue'

interface ShapeCategory {
    key: string
    label: string
}

const categories: ShapeCategory[] = [
    { key: 'all', label: 'All' },
    { key: 'flow', label: 'Flow' },
    { key: 'data', label: 'Data' },
    { key: 'process', label: 'Process' },
    { key: 'decision', label: 'Decision' },
    { key: 'connector', label: 'Connector' }
]

const selectedCategory = ref<string>('all')

const emit = defineEmits<{
    shapeSelected: [shapeType: ShapeType]
}>()

const allShapes = computed((): ShapeTypeConfig[] => {
    return ShapeConfigService.getAllConfigs()
})

const filteredShapes = computed((): ShapeTypeConfig[] => {
    if (selectedCategory.value === 'all') {
        return allShapes.value
    }
    return allShapes.value.filter(shape => shape.category === selectedCategory.value)
})

const selectShape = (shapeType: ShapeType) => {
    emit('shapeSelected', shapeType)
}
</script>

<style scoped>
.shape-selector {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    min-width: 250px;
}

.selector-title {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #2d3748;
    text-align: center;
}

.category-filter {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 16px;
}

.category-btn {
    padding: 6px 12px;
    border: 1px solid #cbd5e0;
    background: white;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #4a5568;
}

.category-btn:hover {
    background: #f7fafc;
    border-color: #a0aec0;
}

.category-btn.active {
    background: #4f46e5;
    color: white;
    border-color: #4f46e5;
}

.shape-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;
    max-height: 400px;
    overflow-y: auto;
}

.shape-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
    text-align: center;
}

.shape-item:hover {
    border-color: #4f46e5;
    background: #f8faff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(79, 70, 229, 0.15);
}

.shape-preview {
    width: 50px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    position: relative;
    /* Força centralização perfeita */
    text-align: center;
}

/* Garantir que o ShapeRenderer fique centralizado */
.shape-preview > * {
    margin: 0 auto;
    display: block;
    position: relative !important;
    top: auto !important;
    left: auto !important;
}

.shape-label {
    font-size: 10px;
    color: #4a5568;
    text-align: center;
    line-height: 1.2;
    word-break: break-word;
    width: 100%;
    display: block;
    margin-top: 2px;
}

/* Custom scrollbar */
.shape-grid::-webkit-scrollbar {
    width: 6px;
}

.shape-grid::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.shape-grid::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 3px;
}

.shape-grid::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
}
</style>
