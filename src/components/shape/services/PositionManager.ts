import { ref, type Ref } from 'vue'
import type { Position } from '../types'
import type { IPositionManager } from '../interfaces'

export class PositionManager implements IPositionManager {
  private position: Ref<Position>

  constructor(initialPosition: Position = { x: 0, y: 0 }) {
    this.position = ref<Position>({ ...initialPosition })
  }

  getPosition(): Position {
    return { ...this.position.value }
  }

  setPosition(position: Position): void {
    this.position.value = { ...position }
  }

  updatePosition(position: Position): void {
    this.position.value.x = position.x
    this.position.value.y = position.y
  }

  get currentPosition(): Ref<Position> {
    return this.position
  }

  // Utility methods
  translate(deltaX: number, deltaY: number): void {
    this.position.value.x += deltaX
    this.position.value.y += deltaY
  }

  distanceTo(otherPosition: Position): number {
    const dx = this.position.value.x - otherPosition.x
    const dy = this.position.value.y - otherPosition.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  isWithinBounds(bounds: { minX: number; minY: number; maxX: number; maxY: number }): boolean {
    const pos = this.position.value
    return pos.x >= bounds.minX && pos.x <= bounds.maxX &&
      pos.y >= bounds.minY && pos.y <= bounds.maxY
  }
}
