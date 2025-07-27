import { ref, computed, onUnmounted } from 'vue'
import type { Position, ShapeProps } from '../types'
import { DragBehavior } from '../services/DragBehavior'
import { PositionManager } from '../services/PositionManager'
import { EventHandlerFactory } from '../services/EventHandler'
import type { IDragBehavior, IPositionManager, IEventHandler } from '../interfaces'

export function useShape(
    props: ShapeProps,
    emit: (event: 'dragStart' | 'dragMove' | 'dragEnd' | 'click', position: Position) => void
) {
    // Initialize services
    const positionManager: IPositionManager = new PositionManager({
        x: props.initialX || 100,
        y: props.initialY || 100
    })

    const dragBehavior: IDragBehavior = new DragBehavior()

    const eventHandler: IEventHandler = EventHandlerFactory.create(
        (position: Position) => emit('dragStart', position),
        (position: Position) => emit('dragMove', position),
        (position: Position) => emit('dragEnd', position),
        (position: Position) => emit('click', position)
    )

    // Reactive state
    const shapeElement = ref<HTMLElement>()
    const isDragging = computed(() => dragBehavior.isDragging)
    const position = computed(() => positionManager.getPosition())

    // Style management - simplified approach
    const shapeStyle = computed(() => ({
        left: `${position.value.x}px`,
        top: `${position.value.y}px`,
        width: `${props.width || 120}px`,
        height: `${props.height || 80}px`,
        backgroundColor: props.backgroundColor || '#4f46e5',
        borderColor: props.borderColor || '#312e81',
        borderRadius: `${props.borderRadius || 8}px`,
        cursor: props.disabled ? 'default' : (isDragging.value ? 'grabbing' : 'grab')
    }))

    // Drag handling
    const startDrag = (event: MouseEvent | TouchEvent) => {
        if (props.disabled) return

        const currentPosition = positionManager.getPosition()
        const dragState = dragBehavior.startDrag(event, currentPosition)

        eventHandler.onDragStart(currentPosition)

        // Setup drag event listeners
        const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
            if (dragBehavior.isDragging) {
                const newPosition = dragBehavior.handleDrag(moveEvent, dragState)
                if (newPosition.x !== 0 || newPosition.y !== 0) {
                    positionManager.setPosition(newPosition)
                    eventHandler.onDragMove(newPosition)
                }
            }
        }

        const handleDragEnd = () => {
            if (dragBehavior.isDragging) {
                const finalPosition = positionManager.getPosition()
                dragBehavior.stopDrag()
                eventHandler.onDragEnd(finalPosition)

                // Cleanup
                document.removeEventListener('mousemove', handleDragMove)
                document.removeEventListener('mouseup', handleDragEnd)
                document.removeEventListener('touchmove', handleDragMove)
                document.removeEventListener('touchend', handleDragEnd)
            }
        }

        // Add listeners
        document.addEventListener('mousemove', handleDragMove)
        document.addEventListener('mouseup', handleDragEnd)
        document.addEventListener('touchmove', handleDragMove)
        document.addEventListener('touchend', handleDragEnd)
    }

    const handleClick = () => {
        if (!isDragging.value && !props.disabled) {
            eventHandler.onClick(positionManager.getPosition())
        }
    }

    // Cleanup on unmount
    onUnmounted(() => {
        dragBehavior.cleanup()
    })

    // Expose methods for external control
    const setPosition = (newPosition: Position) => {
        positionManager.setPosition(newPosition)
    }

    const getPosition = () => {
        return positionManager.getPosition()
    }

    return {
        // Refs
        shapeElement,

        // Computed properties
        position,
        isDragging,
        shapeStyle,

        // Event handlers
        startDrag,
        handleClick,

        // Methods
        setPosition,
        getPosition
    }
}
