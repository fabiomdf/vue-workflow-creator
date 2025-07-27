import { ref, type Ref } from 'vue'
import type { Position, DragState } from '../types'
import type { IDragBehavior } from '../interfaces'

export class DragBehavior implements IDragBehavior {
  private dragState: Ref<DragState>

  constructor() {
    this.dragState = ref<DragState>({
      isDragging: false,
      offset: { x: 0, y: 0 }
    })
  }

  startDrag(event: MouseEvent | TouchEvent, currentPosition: Position): DragState {
    event.preventDefault()

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    this.dragState.value = {
      isDragging: true,
      offset: {
        x: clientX - currentPosition.x,
        y: clientY - currentPosition.y
      }
    }

    return { ...this.dragState.value }
  }

  handleDrag(event: MouseEvent | TouchEvent, dragState: DragState): Position {
    if (!dragState.isDragging) {
      return { x: 0, y: 0 }
    }

    event.preventDefault()

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

    return {
      x: clientX - dragState.offset.x,
      y: clientY - dragState.offset.y
    }
  }

  stopDrag(): void {
    this.dragState.value.isDragging = false
  }

  cleanup(): void {
    this.stopDrag()
  }

  get isDragging(): boolean {
    return this.dragState.value.isDragging
  }

  get currentDragState(): DragState {
    return { ...this.dragState.value }
  }
}
