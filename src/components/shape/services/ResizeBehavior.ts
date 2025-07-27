import { ref, type Ref } from 'vue'
import type { Position, ResizeState, ResizeHandle } from '../types'
import type { IResizeBehavior } from '../interfaces'

export class ResizeBehavior implements IResizeBehavior {
    private resizeState: Ref<ResizeState>

    constructor() {
        this.resizeState = ref<ResizeState>({
            isResizing: false,
            handle: null,
            startSize: { width: 0, height: 0 },
            startPosition: { x: 0, y: 0 },
            startMousePosition: { x: 0, y: 0 }
        })
    }

    startResize(
        event: MouseEvent | TouchEvent,
        handle: ResizeHandle,
        currentSize: { width: number; height: number },
        currentPosition: Position
    ): ResizeState {
        event.preventDefault()
        event.stopPropagation()

        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

        this.resizeState.value = {
            isResizing: true,
            handle,
            startSize: { ...currentSize },
            startPosition: { ...currentPosition },
            startMousePosition: { x: clientX, y: clientY }
        }

        return { ...this.resizeState.value }
    }

    handleResize(
        event: MouseEvent | TouchEvent,
        resizeState: ResizeState,
        constraints?: { minWidth?: number; minHeight?: number; maxWidth?: number; maxHeight?: number }
    ): { size: { width: number; height: number }; position: Position } {
        if (!resizeState.isResizing || !resizeState.handle) {
            return {
                size: resizeState.startSize,
                position: resizeState.startPosition
            }
        }

        event.preventDefault()

        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY

        const deltaX = clientX - resizeState.startMousePosition.x
        const deltaY = clientY - resizeState.startMousePosition.y

        let newWidth = resizeState.startSize.width
        let newHeight = resizeState.startSize.height
        let newX = resizeState.startPosition.x
        let newY = resizeState.startPosition.y

        // Calculate new dimensions based on resize handle
        switch (resizeState.handle) {
            case 'se': // South-East (bottom-right)
                newWidth = resizeState.startSize.width + deltaX
                newHeight = resizeState.startSize.height + deltaY
                break
            case 'sw': // South-West (bottom-left)
                newWidth = resizeState.startSize.width - deltaX
                newHeight = resizeState.startSize.height + deltaY
                newX = resizeState.startPosition.x + deltaX
                break
            case 'ne': // North-East (top-right)
                newWidth = resizeState.startSize.width + deltaX
                newHeight = resizeState.startSize.height - deltaY
                newY = resizeState.startPosition.y + deltaY
                break
            case 'nw': // North-West (top-left)
                newWidth = resizeState.startSize.width - deltaX
                newHeight = resizeState.startSize.height - deltaY
                newX = resizeState.startPosition.x + deltaX
                newY = resizeState.startPosition.y + deltaY
                break
            case 'n': // North (top)
                newHeight = resizeState.startSize.height - deltaY
                newY = resizeState.startPosition.y + deltaY
                break
            case 's': // South (bottom)
                newHeight = resizeState.startSize.height + deltaY
                break
            case 'e': // East (right)
                newWidth = resizeState.startSize.width + deltaX
                break
            case 'w': // West (left)
                newWidth = resizeState.startSize.width - deltaX
                newX = resizeState.startPosition.x + deltaX
                break
        }

        // Apply constraints
        const minWidth = constraints?.minWidth || 50
        const minHeight = constraints?.minHeight || 30
        const maxWidth = constraints?.maxWidth || 500
        const maxHeight = constraints?.maxHeight || 300

        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
        newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight))

        // Adjust position if constrained by minimum size
        if (resizeState.handle.includes('w') && newWidth === minWidth) {
            newX = resizeState.startPosition.x + (resizeState.startSize.width - minWidth)
        }
        if (resizeState.handle.includes('n') && newHeight === minHeight) {
            newY = resizeState.startPosition.y + (resizeState.startSize.height - minHeight)
        }

        return {
            size: { width: newWidth, height: newHeight },
            position: { x: newX, y: newY }
        }
    }

    stopResize(): void {
        this.resizeState.value.isResizing = false
        this.resizeState.value.handle = null
    }

    cleanup(): void {
        this.stopResize()
    }

    get isResizing(): boolean {
        return this.resizeState.value.isResizing
    }

    get currentResizeState(): ResizeState {
        return { ...this.resizeState.value }
    }
}
