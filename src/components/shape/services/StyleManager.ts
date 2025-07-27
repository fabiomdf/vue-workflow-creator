import { computed, type ComputedRef } from 'vue'
import type { ShapeProps, ShapeStyle } from '../types'
import type { IStyleManager } from '../interfaces'

export class StyleManager implements IStyleManager {
  private props: ShapeProps
  private style: ComputedRef<Record<string, string>>

  constructor(props: ShapeProps, position: { x: number; y: number }) {
    this.props = props
    this.style = computed(() => this.calculateStyle(position))
  }

  getComputedStyle(): Record<string, string> {
    return { ...this.style.value }
  }

  updateStyle(properties: Partial<Record<string, string>>): void {
    // For reactive updates, this would need to be implemented differently
    // This is a placeholder for future extension
    console.warn('StyleManager.updateStyle not fully implemented yet', properties)
  }

  get computedStyle(): ComputedRef<Record<string, string>> {
    return this.style
  }

  private calculateStyle(position: { x: number; y: number }): Record<string, string> {
    return {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${this.props.width || 120}px`,
      height: `${this.props.height || 80}px`,
      backgroundColor: this.props.backgroundColor || '#4f46e5',
      borderColor: this.props.borderColor || '#312e81',
      borderRadius: `${this.props.borderRadius || 8}px`,
      cursor: this.props.disabled ? 'default' : 'grab'
    }
  }

  // Static utility methods for style calculations
  static createShapeStyle(props: ShapeProps): ShapeStyle {
    return {
      width: props.width || 120,
      height: props.height || 80,
      backgroundColor: props.backgroundColor || '#4f46e5',
      borderColor: props.borderColor || '#312e81',
      borderRadius: props.borderRadius || 8
    }
  }

  static getCursorStyle(isDragging: boolean, disabled: boolean): string {
    if (disabled) return 'default'
    return isDragging ? 'grabbing' : 'grab'
  }
}
