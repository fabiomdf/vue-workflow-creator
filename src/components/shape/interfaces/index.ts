import type { Position, DragState, ResizeState, ResizeHandle } from '../types'

// Interface for drag behavior
export interface IDragBehavior {
    readonly isDragging: boolean
    startDrag(event: MouseEvent | TouchEvent, currentPosition: Position): DragState
    handleDrag(event: MouseEvent | TouchEvent, dragState: DragState): Position
    stopDrag(): void
    cleanup(): void
}

// Interface for resize behavior
export interface IResizeBehavior {
    readonly isResizing: boolean
    startResize(event: MouseEvent | TouchEvent, handle: ResizeHandle, currentSize: { width: number; height: number }, currentPosition: Position): ResizeState
    handleResize(event: MouseEvent | TouchEvent, resizeState: ResizeState, constraints?: { minWidth?: number; minHeight?: number; maxWidth?: number; maxHeight?: number }): { size: { width: number; height: number }; position: Position }
    stopResize(): void
    cleanup(): void
}

// Interface for position management
export interface IPositionManager {
    getPosition(): Position
    setPosition(position: Position): void
    updatePosition(position: Position): void
}

// Interface for size management
export interface ISizeManager {
    getSize(): { width: number; height: number }
    setSize(size: { width: number; height: number }): void
    updateSize(size: { width: number; height: number }): void
}

// Interface for event handling
export interface IEventHandler {
    onDragStart(position: Position): void
    onDragMove(position: Position): void
    onDragEnd(position: Position): void
    onClick(position: Position): void
    onResizeStart(size: { width: number; height: number }): void
    onResizeMove(size: { width: number; height: number }): void
    onResizeEnd(size: { width: number; height: number }): void
}

// Interface for shape styling
export interface IStyleManager {
    getComputedStyle(): Record<string, string>
    updateStyle(properties: Partial<Record<string, string>>): void
}
