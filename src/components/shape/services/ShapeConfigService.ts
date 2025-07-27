import type { ShapeType, ShapeTypeConfig } from '../types'

export class ShapeConfigService {
  private static readonly SHAPE_CONFIGS: Record<ShapeType, ShapeTypeConfig> = {
    Process: {
      type: 'Process',
      backgroundColor: '#3b82f6',
      borderColor: '#1e40af',
      defaultWidth: 140,
      defaultHeight: 80
    },
    Decision: {
      type: 'Decision',
      backgroundColor: '#ef4444',
      borderColor: '#b91c1c',
      defaultWidth: 120,
      defaultHeight: 100
    },
    Data: {
      type: 'Data',
      backgroundColor: '#10b981',
      borderColor: '#047857',
      defaultWidth: 130,
      defaultHeight: 70
    },
    Terminal: {
      type: 'Terminal',
      backgroundColor: '#8b5cf6',
      borderColor: '#6d28d9',
      defaultWidth: 160,
      defaultHeight: 80
    },
    Document: {
      type: 'Document',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      defaultWidth: 140,
      defaultHeight: 90
    }
  }

  static getShapeConfig(type: ShapeType): ShapeTypeConfig {
    return this.SHAPE_CONFIGS[type]
  }

  static getAllShapeTypes(): ShapeType[] {
    return Object.keys(this.SHAPE_CONFIGS) as ShapeType[]
  }

  static getRandomShapeType(): ShapeType {
    const types = this.getAllShapeTypes()
    return types[Math.floor(Math.random() * types.length)]
  }

  static createShapeWithDefaults(type: ShapeType, overrides: Partial<ShapeTypeConfig> = {}): ShapeTypeConfig {
    const config = this.getShapeConfig(type)
    return { ...config, ...overrides }
  }
}
