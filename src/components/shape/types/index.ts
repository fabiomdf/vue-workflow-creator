// Core interfaces and types for shape system
export interface Position {
  x: number
  y: number
}

export interface ShapeStyle {
  width: number
  height: number
  backgroundColor: string
  borderColor: string
  borderRadius: number
  shape: ShapeGeometry
}

export interface ShapeData {
  id: string
  position: Position
  label: string
  type: ShapeType
  geometry: ShapeGeometry
  style: ShapeStyle
}

export interface DragState {
  isDragging: boolean
  offset: Position
}

export interface ResizeState {
  isResizing: boolean
  handle: ResizeHandle | null
  startSize: { width: number; height: number }
  startPosition: Position
  startMousePosition: Position
}

export type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w'

export interface ShapeProps {
  initialX?: number
  initialY?: number
  label?: string
  width?: number
  height?: number
  backgroundColor?: string
  borderColor?: string
  borderRadius?: number
  disabled?: boolean
  resizable?: boolean
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  shapeGeometry?: ShapeGeometry
  anchorMode?: boolean
}

export interface ShapeEvents {
  dragStart: [position: Position]
  dragMove: [position: Position]
  dragEnd: [position: Position]
  click: [position: Position]
  resizeStart: [size: { width: number; height: number }]
  resizeMove: [size: { width: number; height: number }]
  resizeEnd: [size: { width: number; height: number }]
  anchorModeToggle: [anchorMode: boolean]
}

// Workflow shape types (business logic)
export type ShapeType =
  | 'Process'           // Rectangle - Process/Task
  | 'Decision'          // Diamond - Decision
  | 'Data'              // Parallelogram - Data/Input/Output
  | 'Terminal'          // Oval/Circle - Start/End
  | 'Document'          // Document - Report/Document
  | 'Database'          // Cylinder - Database
  | 'Connector'         // Small circle - Connector
  | 'Preparation'       // Hexagon - Preparation
  | 'ManualOperation'   // Trapezoid - Manual operation
  | 'Delay'             // Semicircle - Delay/Wait
  | 'StoredData'        // Triangle-rectangle - Stored data
  | 'Display'           // Circle-rectangle - Display/Screen
  | 'Loop'              // Extended diamond - Loop
  | 'Comment'           // Dotted rectangle - Comment

// Geometric shapes (visual representation)
export type ShapeGeometry =
  | 'rectangle'         // Rectangle
  | 'circle'            // Circle
  | 'diamond'           // Diamond
  | 'parallelogram'     // Parallelogram
  | 'triangle'          // Triangle
  | 'hexagon'           // Hexagon
  | 'trapezoid'         // Trapezoid
  | 'pentagon'          // Pentagon
  | 'cylinder'          // Cylinder
  | 'oval'              // Oval
  | 'star'              // Star
  | 'arrow'             // Arrow
  | 'custom'            // Custom shape

export interface ShapeTypeConfig {
  type: ShapeType
  geometry: ShapeGeometry
  backgroundColor: string
  borderColor: string
  defaultWidth?: number
  defaultHeight?: number
  description: string
  category: 'flow' | 'data' | 'process' | 'decision' | 'connector'
}
