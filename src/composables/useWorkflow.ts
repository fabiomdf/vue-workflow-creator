import type { Position, ShapeType } from '../components/shape/types'
import { WorkflowService, type IWorkflowService } from '../services/WorkflowService'

export function useWorkflow() {
  const workflowService: IWorkflowService = new WorkflowService()

  // Event handlers
  const onShapeDragStart = (shapeId: string, position: Position) => {
    console.log(`Shape ${shapeId} drag started at:`, position)
  }

  const onShapeDragMove = (shapeId: string, position: Position) => {
    workflowService.updateShapePosition(shapeId, position)
  }

  const onShapeDragEnd = (shapeId: string, position: Position) => {
    workflowService.updateShapePosition(shapeId, position)
    console.log(`Shape ${shapeId} drag ended at:`, position)
  }

  const onShapeClick = (shapeId: string, position: Position) => {
    console.log(`Shape ${shapeId} clicked at:`, position)
  }

  const onShapeResizeStart = (shapeId: string, size: { width: number; height: number }) => {
    console.log(`Shape ${shapeId} resize started:`, size)
  }

  const onShapeResizeMove = (shapeId: string, size: { width: number; height: number }) => {
    const shape = workflowService.getShape(shapeId)
    if (shape) {
      shape.style.width = size.width
      shape.style.height = size.height
    }
  }

  const onShapeResizeEnd = (shapeId: string, size: { width: number; height: number }) => {
    const shape = workflowService.getShape(shapeId)
    if (shape) {
      shape.style.width = size.width
      shape.style.height = size.height
    }
    console.log(`Shape ${shapeId} resize ended:`, size)
  }

  // Actions
  const addShape = (type?: ShapeType, position?: Position) => {
    return workflowService.addShape(type, position)
  }

  const removeShape = (id: string) => {
    return workflowService.removeShape(id)
  }

  const clearShapes = () => {
    workflowService.clearShapes()
  }

  const addRandomShapes = (count: number = 3) => {
    return workflowService.addMultipleShapes(count)
  }

  return {
    // State
    shapes: workflowService.shapes,

    // Event handlers
    onShapeDragStart,
    onShapeDragMove,
    onShapeDragEnd,
    onShapeClick,
    onShapeResizeStart,
    onShapeResizeMove,
    onShapeResizeEnd,

    // Actions
    addShape,
    removeShape,
    clearShapes,
    addRandomShapes,

    // Service methods
    getShape: workflowService.getShape.bind(workflowService),
    getShapeCount: workflowService.getShapeCount.bind(workflowService),
    exportShapes: workflowService.exportShapes.bind(workflowService),
    importShapes: workflowService.importShapes.bind(workflowService)
  }
}
