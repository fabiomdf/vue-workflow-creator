import type { ShapeType, ShapeTypeConfig } from '../types'

export class ShapeConfigService {
  private static readonly SHAPE_CONFIGS: Record<ShapeType, ShapeTypeConfig> = {
    Process: {
      type: 'Process',
      geometry: 'rectangle',
      backgroundColor: '#3b82f6',
      borderColor: '#1e40af',
      defaultWidth: 140,
      defaultHeight: 80,
      description: 'Processo ou tarefa',
      category: 'process'
    },
    Decision: {
      type: 'Decision',
      geometry: 'diamond',
      backgroundColor: '#ef4444',
      borderColor: '#b91c1c',
      defaultWidth: 120,
      defaultHeight: 100,
      description: 'Ponto de decisão',
      category: 'decision'
    },
    Data: {
      type: 'Data',
      geometry: 'parallelogram',
      backgroundColor: '#10b981',
      borderColor: '#047857',
      defaultWidth: 130,
      defaultHeight: 70,
      description: 'Entrada ou saída de dados',
      category: 'data'
    },
    Terminal: {
      type: 'Terminal',
      geometry: 'oval',
      backgroundColor: '#8b5cf6',
      borderColor: '#6d28d9',
      defaultWidth: 160,
      defaultHeight: 80,
      description: 'Início ou fim do processo',
      category: 'flow'
    },
    Document: {
      type: 'Document',
      geometry: 'rectangle',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      defaultWidth: 140,
      defaultHeight: 90,
      description: 'Documento ou relatório',
      category: 'data'
    },
    Database: {
      type: 'Database',
      geometry: 'cylinder',
      backgroundColor: '#06b6d4',
      borderColor: '#0891b2',
      defaultWidth: 120,
      defaultHeight: 100,
      description: 'Banco de dados',
      category: 'data'
    },
    Connector: {
      type: 'Connector',
      geometry: 'circle',
      backgroundColor: '#64748b',
      borderColor: '#475569',
      defaultWidth: 60,
      defaultHeight: 60,
      description: 'Conector ou junção',
      category: 'connector'
    },
    Preparation: {
      type: 'Preparation',
      geometry: 'hexagon',
      backgroundColor: '#ec4899',
      borderColor: '#be185d',
      defaultWidth: 140,
      defaultHeight: 80,
      description: 'Preparação ou configuração',
      category: 'process'
    },
    ManualOperation: {
      type: 'ManualOperation',
      geometry: 'trapezoid',
      backgroundColor: '#84cc16',
      borderColor: '#65a30d',
      defaultWidth: 130,
      defaultHeight: 80,
      description: 'Operação manual',
      category: 'process'
    },
    Delay: {
      type: 'Delay',
      geometry: 'oval',
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      defaultWidth: 120,
      defaultHeight: 60,
      description: 'Delay ou espera',
      category: 'flow'
    },
    StoredData: {
      type: 'StoredData',
      geometry: 'triangle',
      backgroundColor: '#06b6d4',
      borderColor: '#0891b2',
      defaultWidth: 100,
      defaultHeight: 80,
      description: 'Dados armazenados',
      category: 'data'
    },
    Display: {
      type: 'Display',
      geometry: 'rectangle',
      backgroundColor: '#8b5cf6',
      borderColor: '#6d28d9',
      defaultWidth: 150,
      defaultHeight: 90,
      description: 'Display ou tela',
      category: 'process'
    },
    Loop: {
      type: 'Loop',
      geometry: 'diamond',
      backgroundColor: '#ef4444',
      borderColor: '#b91c1c',
      defaultWidth: 160,
      defaultHeight: 80,
      description: 'Loop ou repetição',
      category: 'flow'
    },
    Comment: {
      type: 'Comment',
      geometry: 'rectangle',
      backgroundColor: '#fbbf24',
      borderColor: '#f59e0b',
      defaultWidth: 120,
      defaultHeight: 60,
      description: 'Comentário ou anotação',
      category: 'connector'
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

  static getShapesByCategory(category: 'flow' | 'data' | 'process' | 'decision' | 'connector'): ShapeTypeConfig[] {
    return Object.values(this.SHAPE_CONFIGS).filter(config => config.category === category)
  }

  static getShapesByGeometry(geometry: string): ShapeTypeConfig[] {
    return Object.values(this.SHAPE_CONFIGS).filter(config => config.geometry === geometry)
  }

  static getAllCategories(): string[] {
    return [...new Set(Object.values(this.SHAPE_CONFIGS).map(config => config.category))]
  }

  static getAllGeometries(): string[] {
    return [...new Set(Object.values(this.SHAPE_CONFIGS).map(config => config.geometry))]
  }

  static getRandomShapeByCategory(category: 'flow' | 'data' | 'process' | 'decision' | 'connector'): ShapeType {
    const shapes = this.getShapesByCategory(category)
    return shapes[Math.floor(Math.random() * shapes.length)].type
  }
}
