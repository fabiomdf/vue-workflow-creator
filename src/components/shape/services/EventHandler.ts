import type { Position } from '../types'
import type { IEventHandler } from '../interfaces'

export class ShapeEventHandler implements IEventHandler {
  constructor(
    private emitDragStart: (position: Position) => void,
    private emitDragMove: (position: Position) => void,
    private emitDragEnd: (position: Position) => void,
    private emitClick: (position: Position) => void,
    private emitResizeStart: (size: { width: number; height: number }) => void,
    private emitResizeMove: (size: { width: number; height: number }) => void,
    private emitResizeEnd: (size: { width: number; height: number }) => void
  ) { }

  onDragStart(position: Position): void {
    this.emitDragStart(position)
    this.logEvent('Drag Start', position)
  }

  onDragMove(position: Position): void {
    this.emitDragMove(position)
  }

  onDragEnd(position: Position): void {
    this.emitDragEnd(position)
    this.logEvent('Drag End', position)
  }

  onClick(position: Position): void {
    this.emitClick(position)
    this.logEvent('Click', position)
  }

  onResizeStart(size: { width: number; height: number }): void {
    this.emitResizeStart(size)
    this.logEvent('Resize Start', size)
  }

  onResizeMove(size: { width: number; height: number }): void {
    this.emitResizeMove(size)
  }

  onResizeEnd(size: { width: number; height: number }): void {
    this.emitResizeEnd(size)
    this.logEvent('Resize End', size)
  }

  private logEvent(eventType: string, data: Position | { width: number; height: number }): void {
    if (import.meta.env.DEV) {
      console.log(`Shape ${eventType}:`, data)
    }
  }
}

// Factory for creating event handlers
export class EventHandlerFactory {
  static create(
    emitDragStart: (position: Position) => void,
    emitDragMove: (position: Position) => void,
    emitDragEnd: (position: Position) => void,
    emitClick: (position: Position) => void,
    emitResizeStart: (size: { width: number; height: number }) => void,
    emitResizeMove: (size: { width: number; height: number }) => void,
    emitResizeEnd: (size: { width: number; height: number }) => void
  ): IEventHandler {
    return new ShapeEventHandler(
      emitDragStart,
      emitDragMove,
      emitDragEnd,
      emitClick,
      emitResizeStart,
      emitResizeMove,
      emitResizeEnd
    )
  }
}
