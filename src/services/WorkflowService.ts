import { ref, type Ref } from 'vue'
import type { ShapeData, Position, ShapeType } from '../components/shape/types'
import { ShapeConfigService } from '../components/shape/services/ShapeConfigService'

export interface IWorkflowService {
    shapes: Ref<ShapeData[]>
    addShape(type?: ShapeType, position?: Position): ShapeData
    removeShape(id: string): boolean
    clearShapes(): void
    updateShapePosition(id: string, position: Position): boolean
    getShape(id: string): ShapeData | undefined
    getShapeCount(): number
    addMultipleShapes(count: number, type?: ShapeType): ShapeData[]
    exportShapes(): string
    importShapes(data: string): boolean
}

export class WorkflowService implements IWorkflowService {
    shapes: Ref<ShapeData[]>
    private shapeCounter = 1

    constructor() {
        this.shapes = ref<ShapeData[]>([])
    }

    addShape(type?: ShapeType, position?: Position): ShapeData {
        const shapeType = type || ShapeConfigService.getRandomShapeType()
        const config = ShapeConfigService.getShapeConfig(shapeType)

        const defaultPosition = position || {
            x: 50 + (this.shapeCounter - 1) * 30,
            y: 50 + (this.shapeCounter - 1) * 30
        }

        const newShape: ShapeData = {
            id: `shape-${this.shapeCounter}`,
            position: defaultPosition,
            label: `${shapeType} ${this.shapeCounter}`,
            type: shapeType,
            style: {
                width: config.defaultWidth || 140,
                height: config.defaultHeight || 80,
                backgroundColor: config.backgroundColor,
                borderColor: config.borderColor,
                borderRadius: 8
            }
        }

        this.shapes.value.push(newShape)
        this.shapeCounter++

        return newShape
    }

    removeShape(id: string): boolean {
        const index = this.shapes.value.findIndex(shape => shape.id === id)
        if (index !== -1) {
            this.shapes.value.splice(index, 1)
            return true
        }
        return false
    }

    clearShapes(): void {
        this.shapes.value = []
        this.shapeCounter = 1
    }

    updateShapePosition(id: string, position: Position): boolean {
        const shape = this.shapes.value.find(s => s.id === id)
        if (shape) {
            shape.position = { ...position }
            return true
        }
        return false
    }

    getShape(id: string): ShapeData | undefined {
        return this.shapes.value.find(shape => shape.id === id)
    }

    getShapeCount(): number {
        return this.shapes.value.length
    }

    // Utility methods
    addMultipleShapes(count: number, type?: ShapeType): ShapeData[] {
        const addedShapes: ShapeData[] = []
        for (let i = 0; i < count; i++) {
            addedShapes.push(this.addShape(type))
        }
        return addedShapes
    }

    getShapesByType(type: ShapeType): ShapeData[] {
        return this.shapes.value.filter(shape => shape.type === type)
    }

    exportShapes(): string {
        return JSON.stringify(this.shapes.value, null, 2)
    }

    importShapes(data: string): boolean {
        try {
            const importedShapes = JSON.parse(data) as ShapeData[]
            this.shapes.value = importedShapes
            // Update counter to avoid ID conflicts
            const maxId = Math.max(...importedShapes.map(s => parseInt(s.id.split('-')[1]) || 0))
            this.shapeCounter = maxId + 1
            return true
        } catch {
            return false
        }
    }
}
