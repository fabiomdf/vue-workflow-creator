import type { Position } from '../types'
import type { IEventHandler } from '../interfaces'

export class ShapeEventHandler implements IEventHandler {
  constructor(
    private emitDragStart: (position: Position) => void,
    private emitDragMove: (position: Position) => void,
    private emitDragEnd: (position: Position) => void,
    private emitClick: (position: Position) => void
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

  private logEvent(eventType: string, position: Position): void {
    if (import.meta.env.DEV) {
      console.log(`Shape ${eventType}:`, position)
    }
  }
}

// Factory for creating event handlers
export class EventHandlerFactory {
  static create(
    emitDragStart: (position: Position) => void,
    emitDragMove: (position: Position) => void,
    emitDragEnd: (position: Position) => void,
    emitClick: (position: Position) => void
  ): IEventHandler {
    return new ShapeEventHandler(emitDragStart, emitDragMove, emitDragEnd, emitClick)
  }
}
