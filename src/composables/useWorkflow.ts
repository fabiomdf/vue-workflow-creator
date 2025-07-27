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
