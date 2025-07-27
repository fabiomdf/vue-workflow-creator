import { ref, computed, onUnmounted, watch } from 'vue'
import type { Position, ShapeProps, ResizeHandle } from '../types'
import { DragBehavior } from '../services/DragBehavior'
import { ResizeBehavior } from '../services/ResizeBehavior'
import { PositionManager } from '../services/PositionManager'
import { SizeManager } from '../services/SizeManager'
import { EventHandlerFactory } from '../services/EventHandler'
import type { IDragBehavior, IResizeBehavior, IPositionManager, ISizeManager, IEventHandler } from '../interfaces'

export function useShape(
  props: ShapeProps,
  emit: (event: 'dragStart' | 'dragMove' | 'dragEnd' | 'click' | 'resizeStart' | 'resizeMove' | 'resizeEnd' | 'anchorModeToggle', data: Position | { width: number; height: number } | boolean) => void
) {
  // Initialize services
  const positionManager: IPositionManager = new PositionManager({
    x: props.initialX || 100,
    y: props.initialY || 100
  })

  const sizeManager: ISizeManager = new SizeManager({
    width: props.width || 120,
    height: props.height || 80
  })

  const dragBehavior: IDragBehavior = new DragBehavior()
  const resizeBehavior: IResizeBehavior = new ResizeBehavior()

  const eventHandler: IEventHandler = EventHandlerFactory.create(
    (position: Position) => emit('dragStart', position),
    (position: Position) => emit('dragMove', position),
    (position: Position) => emit('dragEnd', position),
    (position: Position) => emit('click', position),
    (size: { width: number; height: number }) => emit('resizeStart', size),
    (size: { width: number; height: number }) => emit('resizeMove', size),
    (size: { width: number; height: number }) => emit('resizeEnd', size)
  )

  // Reactive state
  const shapeElement = ref<HTMLElement>()
  const isDragging = computed(() => dragBehavior.isDragging)
  const isResizing = computed(() => resizeBehavior.isResizing)
  const position = computed(() => positionManager.getPosition())
  const size = computed(() => sizeManager.getSize())
  const isAnchorMode = ref(props.anchorMode || false)

  // Watch for changes in anchor mode
  watch(isAnchorMode, (newValue, oldValue) => {
    console.log('🔄 isAnchorMode watcher triggered:', { oldValue, newValue })
  }, { immediate: true })

  // Style management
  const shapeStyle = computed(() => ({
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
    width: `${size.value.width}px`,
    height: `${size.value.height}px`,
    // Remove background and border - let ShapeRenderer handle the visual
    cursor: props.disabled ? 'default' : (isDragging.value ? 'grabbing' : (isResizing.value ? 'resizing' : 'grab'))
  }))

  // Drag handling
  const startDrag = (event: MouseEvent | TouchEvent) => {
    // Ignore right clicks for drag
    if (event instanceof MouseEvent && event.button === 2) {
      console.log('🚫 Ignoring right click for drag')
      return
    }

    if (props.disabled || isResizing.value) return

    console.log('👆 Starting drag with button:', event instanceof MouseEvent ? event.button : 'touch')

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

  // Resize handling
  const startResize = (event: MouseEvent | TouchEvent, handle: ResizeHandle) => {
    if (props.disabled || !props.resizable) return

    const currentSize = sizeManager.getSize()
    const currentPosition = positionManager.getPosition()
    const resizeState = resizeBehavior.startResize(event, handle, currentSize, currentPosition)

    eventHandler.onResizeStart(currentSize)

    // Setup resize event listeners
    const handleResizeMove = (moveEvent: MouseEvent | TouchEvent) => {
      if (resizeBehavior.isResizing) {
        const constraints = {
          minWidth: props.minWidth || 50,
          minHeight: props.minHeight || 30,
          maxWidth: props.maxWidth || 500,
          maxHeight: props.maxHeight || 300
        }

        const result = resizeBehavior.handleResize(moveEvent, resizeState, constraints)
        sizeManager.setSize(result.size)
        positionManager.setPosition(result.position)
        eventHandler.onResizeMove(result.size)
      }
    }

    const handleResizeEnd = () => {
      if (resizeBehavior.isResizing) {
        const finalSize = sizeManager.getSize()
        resizeBehavior.stopResize()
        eventHandler.onResizeEnd(finalSize)

        // Cleanup
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('touchmove', handleResizeMove)
        document.removeEventListener('touchend', handleResizeEnd)
      }
    }

    // Add listeners
    document.addEventListener('mousemove', handleResizeMove)
    document.addEventListener('mouseup', handleResizeEnd)
    document.addEventListener('touchmove', handleResizeMove)
    document.addEventListener('touchend', handleResizeEnd)
  }

  const handleClick = () => {
    console.log('👆 Left click detected')
    if (!isDragging.value && !isResizing.value && !props.disabled) {
      eventHandler.onClick(positionManager.getPosition())
    }
  }

  const handleContextMenu = () => {
    console.log('🖱️ RIGHT CLICK DETECTED!')
    console.log('Current isAnchorMode.value:', isAnchorMode.value)
    console.log('Current props.anchorMode:', props.anchorMode)
    console.log('Conditions check:', {
      isDragging: isDragging.value,
      isResizing: isResizing.value,
      disabled: props.disabled
    })

    if (!isDragging.value && !isResizing.value && !props.disabled) {
      const newValue = !isAnchorMode.value
      console.log('✅ Changing anchor mode from', isAnchorMode.value, 'to:', newValue)
      isAnchorMode.value = newValue
      console.log('After assignment, isAnchorMode.value is now:', isAnchorMode.value)
      emit('anchorModeToggle', newValue)
      console.log('Emitted anchorModeToggle with value:', newValue)
    } else {
      console.log('❌ Cannot toggle - conditions not met')
    }
  }

  const toggleAnchorMode = () => {
    isAnchorMode.value = !isAnchorMode.value
    emit('anchorModeToggle', isAnchorMode.value)
  }

  // Cleanup on unmount
  onUnmounted(() => {
    dragBehavior.cleanup()
    resizeBehavior.cleanup()
  })

  // Expose methods for external control
  const setPosition = (newPosition: Position) => {
    positionManager.setPosition(newPosition)
  }

  const getPosition = () => {
    return positionManager.getPosition()
  }

  const setSize = (newSize: { width: number; height: number }) => {
    sizeManager.setSize(newSize)
  }

  const getSize = () => {
    return sizeManager.getSize()
  }

  return {
    // Refs
    shapeElement,

    // Computed properties
    position,
    size,
    isDragging,
    isResizing,
    shapeStyle,
    isAnchorMode,

    // Event handlers
    startDrag,
    startResize,
    handleClick,
    handleContextMenu,
    toggleAnchorMode,

    // Methods
    setPosition,
    getPosition,
    setSize,
    getSize
  }
}
