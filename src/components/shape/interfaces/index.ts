import type { Position, DragState } from '../types'

// Interface for drag behavior
export interface IDragBehavior {
    readonly isDragging: boolean
    startDrag(event: MouseEvent | TouchEvent, currentPosition: Position): DragState
    handleDrag(event: MouseEvent | TouchEvent, dragState: DragState): Position
    stopDrag(): void
    cleanup(): void
}

// Interface for position management
export interface IPositionManager {
    getPosition(): Position
    setPosition(position: Position): void
    updatePosition(position: Position): void
}

// Interface for event handling
export interface IEventHandler {
    onDragStart(position: Position): void
    onDragMove(position: Position): void
    onDragEnd(position: Position): void
    onClick(position: Position): void
}

// Interface for shape styling
export interface IStyleManager {
    getComputedStyle(): Record<string, string>
    updateStyle(properties: Partial<Record<string, string>>): void
}
