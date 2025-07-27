# Vue Workflow Creator - Clean Architecture

This project demonstrates a clean, maintainable Vue.js application using SOLID principles, vertical slicing, and clean architecture patterns.

## 📁 Project Structure

```
src/
├── components/
│   └── shape/                    # Shape Component Slice (Vertical)
│       ├── types/               # Type definitions
│       │   └── index.ts
│       ├── interfaces/          # Interface definitions
│       │   └── index.ts
│       ├── services/           # Business logic services
│       │   ├── ShapeConfigService.ts
│       │   ├── DragBehavior.ts
│       │   ├── PositionManager.ts
│       │   ├── StyleManager.ts
│       │   └── EventHandler.ts
│       ├── composables/        # Vue composables
│       │   └── useShape.ts
│       ├── DraggableShape.vue  # Main component
│       └── index.ts           # Public API
├── services/                   # Application services
│   └── WorkflowService.ts
├── composables/               # Application composables
│   └── useWorkflow.ts
└── views/                    # Page components
    └── WorkflowView.vue
```

## 🏗️ Architecture Principles

### SOLID Principles Applied

#### Single Responsibility Principle (SRP)

- **DragBehavior**: Handles only drag operations
- **PositionManager**: Manages position state only
- **StyleManager**: Handles styling calculations only
- **EventHandler**: Manages event emission only
- **ShapeConfigService**: Provides shape configuration only

#### Open/Closed Principle (OCP)

- Services implement interfaces, allowing easy extension
- New shape types can be added without modifying existing code
- Drag behavior can be extended with new features

#### Liskov Substitution Principle (LSP)

- All services implement their respective interfaces
- Any implementation can be swapped without breaking functionality

#### Interface Segregation Principle (ISP)

- Separate interfaces for different concerns:
  - `IDragBehavior` for drag operations
  - `IPositionManager` for position management
  - `IStyleManager` for styling
  - `IEventHandler` for events

#### Dependency Inversion Principle (DIP)

- Components depend on interfaces, not concrete implementations
- Services are injected through dependency injection patterns

### Clean Architecture Layers

#### 1. **Entities** (`/types/`)

- Core business objects and types
- `Position`, `ShapeData`, `ShapeStyle`, etc.

#### 2. **Use Cases** (`/services/`)

- Business logic implementation
- `DragBehavior`, `PositionManager`, `WorkflowService`

#### 3. **Interface Adapters** (`/composables/`)

- Vue-specific logic and state management
- `useShape`, `useWorkflow`

#### 4. **Frameworks & Drivers** (`/components/`, `/views/`)

- Vue components and UI logic
- `DraggableShape.vue`, `WorkflowView.vue`

## 🔧 Key Services

### Shape Configuration Service

```typescript
// Centralized shape type management
ShapeConfigService.getShapeConfig('Process')
ShapeConfigService.getRandomShapeType()
ShapeConfigService.createShapeWithDefaults('Decision')
```

### Drag Behavior Service

```typescript
// Encapsulates all drag logic
const dragBehavior = new DragBehavior()
dragBehavior.startDrag(event, position)
dragBehavior.handleDrag(event, dragState)
dragBehavior.stopDrag()
```

### Position Manager

```typescript
// Manages position state and utilities
const positionManager = new PositionManager({ x: 100, y: 100 })
positionManager.setPosition({ x: 200, y: 200 })
positionManager.distanceTo(otherPosition)
```

### Workflow Service

```typescript
// Manages the entire workflow state
const workflow = new WorkflowService()
workflow.addShape('Process', { x: 100, y: 100 })
workflow.updateShapePosition('shape-1', { x: 200, y: 200 })
workflow.exportShapes() // JSON export
```

## 🎯 Vertical Slicing

The **shape** feature is organized as a complete vertical slice:

```
shape/
├── types/          # What the feature needs to know
├── interfaces/     # How services should behave
├── services/       # What the feature can do
├── composables/    # How Vue uses the feature
├── Component.vue   # How users interact with the feature
└── index.ts       # What the feature exposes
```

This allows:

- **Independent development** of features
- **Easy testing** of isolated functionality
- **Clear boundaries** between features
- **Scalable architecture** for new features

## 🧩 Composables Pattern

### useShape

Encapsulates all shape-related logic:

```typescript
const { position, isDragging, startDrag, setPosition } = useShape(props, emit)
```

### useWorkflow

Manages workflow state and operations:

```typescript
const { shapes, addShape, clearShapes, onShapeDragMove } = useWorkflow()
```

## 🚀 Benefits

### Maintainability

- Clear separation of concerns
- Easy to locate and modify specific functionality
- Minimal coupling between components

### Testability

- Each service can be tested in isolation
- Mock implementations can be easily created
- Business logic is separate from Vue specifics

### Extensibility

- New shape types: Add to `ShapeConfigService`
- New behaviors: Implement `IDragBehavior`
- New features: Create new vertical slices

### Reusability

- Services can be used across different components
- Clear interfaces make integration straightforward
- Business logic is framework-agnostic

## 📝 Usage Examples

### Adding a New Shape Type

```typescript
// 1. Add to types
export type ShapeType = 'Process' | 'Decision' | 'Data' | 'Terminal' | 'Document' | 'NewType'

// 2. Update ShapeConfigService
const SHAPE_CONFIGS = {
  // ... existing configs
  NewType: {
    type: 'NewType',
    backgroundColor: '#ff6b6b',
    borderColor: '#e55454',
  },
}
```

### Custom Drag Behavior

```typescript
class CustomDragBehavior implements IDragBehavior {
  // Implement custom drag logic
  startDrag(event, position) {
    // Custom implementation
  }
}
```

### Extending Workflow Service

```typescript
class AdvancedWorkflowService extends WorkflowService {
  saveToDatabase() {
    // Custom implementation
  }

  addConnections() {
    // Custom implementation
  }
}
```

This architecture provides a solid foundation for building complex workflow applications while maintaining clean, testable, and maintainable code.
