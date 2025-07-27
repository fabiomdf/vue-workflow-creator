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
}

export interface ShapeEvents {
    dragStart: [position: Position]
    dragMove: [position: Position]
    dragEnd: [position: Position]
    click: [position: Position]
}

export type ShapeType = 'Process' | 'Decision' | 'Data' | 'Terminal' | 'Document'

export interface ShapeTypeConfig {
    type: ShapeType
    backgroundColor: string
    borderColor: string
    defaultWidth?: number
    defaultHeight?: number
}
