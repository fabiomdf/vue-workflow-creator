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
}

export interface ShapeData {
    id: string
    position: Position
    label: string
    type: ShapeType
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
}

export interface ShapeEvents {
    dragStart: [position: Position]
    dragMove: [position: Position]
    dragEnd: [position: Position]
    click: [position: Position]
    resizeStart: [size: { width: number; height: number }]
    resizeMove: [size: { width: number; height: number }]
    resizeEnd: [size: { width: number; height: number }]
}

export type ShapeType = 'Process' | 'Decision' | 'Data' | 'Terminal' | 'Document'

export interface ShapeTypeConfig {
    type: ShapeType
    backgroundColor: string
    borderColor: string
    defaultWidth?: number
    defaultHeight?: number
}
