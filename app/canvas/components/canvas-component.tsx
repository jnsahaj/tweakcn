import type { CanvasComponent, ResizeHandle } from "../types/canvas-types";
import { createComponent } from "./components-sidebar";
import { ResizeHandles } from "./resize-handles";

interface CanvasComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  canvasOffset: { x: number; y: number };
  dragState: any;
  isSelectionMode: boolean;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onResizeMouseDown: (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => void;
}

export function CanvasComponentRenderer({
  component,
  isSelected,
  canvasOffset,
  dragState,
  isSelectionMode,
  onMouseDown,
  onResizeMouseDown,
}: CanvasComponentProps) {
  const style = {
    position: "absolute" as const,
    left: component.x + canvasOffset.x,
    top: component.y + canvasOffset.y,
    width: component.width,
    height: component.height,
    zIndex: component.zIndex || 0,
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    MozUserSelect: "none" as const,
    msUserSelect: "none" as const,
    pointerEvents: (!isSelectionMode ? "none" : "auto") as "none" | "auto",
  };

  // Determine cursor classes based on state
  const getCursorClasses = () => {
    if (!isSelectionMode) {
      return "cursor-grab"; // In panning mode
    }

    if (dragState.isDragging && dragState.componentId === component.id) {
      return "cursor-grabbing";
    }

    if (isSelected) {
      return "cursor-grab hover:cursor-move";
    }

    return "cursor-pointer";
  };

  // Get cursor classes specifically for components that override default cursor behavior
  const getComponentCursorClasses = () => {
    if (!isSelectionMode) {
      return "";
    }

    if (dragState.isDragging && dragState.componentId === component.id) {
      return "cursor-grabbing";
    }

    if (isSelected) {
      return "hover:cursor-move";
    }

    return "";
  };

  return (
    <div
      key={component.id}
      style={style}
      className={`relative select-none ${isSelected && isSelectionMode ? "ring-1 ring-blue-500" : ""} ${getCursorClasses()}`}
      data-component-id={component.id}
      onMouseDown={(e) => onMouseDown(e, component.id)}
    >
      <div className="h-full w-full overflow-hidden">
        {createComponent(
          component.type,
          component.props,
          {
            width: component.width,
            height: component.height,
          },
          getComponentCursorClasses()
        )}
      </div>
      {isSelected && isSelectionMode && (
        <ResizeHandles componentId={component.id} onResizeMouseDown={onResizeMouseDown} />
      )}
    </div>
  );
}
