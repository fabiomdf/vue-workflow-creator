# Resize Functionality - Quick Guide

## 🎯 How to Use Shape Resizing

### Features Added:

- **8 Resize Handles**: 4 corners + 4 edges
- **Smooth Resizing**: No more jumps or desynchronization
- **Constraints**: Min/max width and height limits
- **Visual Feedback**: Handles appear on hover

### Resize Handles:

- **Corner handles**: `nw`, `ne`, `sw`, `se` - Resize both width and height
- **Edge handles**: `n`, `s`, `e`, `w` - Resize single dimension

### Default Constraints:

- **Min Size**: 50px × 30px
- **Max Size**: 500px × 300px

### Usage:

1. **Hover** over a shape to see resize handles
2. **Click and drag** any handle to resize
3. **Release** mouse button to finish resizing

### Props:

```vue
<DraggableShape
  :resizable="true"          <!-- Enable/disable resizing -->
  :min-width="50"           <!-- Minimum width -->
  :min-height="30"          <!-- Minimum height -->
  :max-width="500"          <!-- Maximum width -->
  :max-height="300"         <!-- Maximum height -->
/>
```

### Events:

- `@resize-start` - Fired when resize begins
- `@resize-move` - Fired during resize (real-time)
- `@resize-end` - Fired when resize completes

### Technical Improvements Made:

1. **Fixed synchronization**: Mouse position is now properly tracked
2. **Prevented drag conflicts**: Resize handles don't trigger shape dragging
3. **Smooth positioning**: No more jumps when starting to resize
4. **Proper constraints**: Size limits are enforced correctly

### Architecture:

- **ResizeBehavior Service**: Handles resize logic
- **SizeManager Service**: Manages shape dimensions
- **Clean separation**: Resize and drag work independently
