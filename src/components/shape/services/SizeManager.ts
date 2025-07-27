import { ref, type Ref } from 'vue'
import type { ISizeManager } from '../interfaces'

export class SizeManager implements ISizeManager {
    private size: Ref<{ width: number; height: number }>

    constructor(initialSize: { width: number; height: number } = { width: 120, height: 80 }) {
        this.size = ref<{ width: number; height: number }>({ ...initialSize })
    }

    getSize(): { width: number; height: number } {
        return { ...this.size.value }
    }

    setSize(size: { width: number; height: number }): void {
        this.size.value = { ...size }
    }

    updateSize(size: { width: number; height: number }): void {
        this.size.value.width = size.width
        this.size.value.height = size.height
    }

    get currentSize(): Ref<{ width: number; height: number }> {
        return this.size
    }

    // Utility methods
    scale(factor: number): void {
        this.size.value.width *= factor
        this.size.value.height *= factor
    }

    aspectRatio(): number {
        return this.size.value.width / this.size.value.height
    }

    area(): number {
        return this.size.value.width * this.size.value.height
    }

    isWithinBounds(minSize: { width: number; height: number }, maxSize: { width: number; height: number }): boolean {
        const current = this.size.value
        return current.width >= minSize.width &&
            current.height >= minSize.height &&
            current.width <= maxSize.width &&
            current.height <= maxSize.height
    }
}
