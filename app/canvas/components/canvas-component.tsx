import type { CanvasComponent, ResizeHandle } from "../types/canvas-types";
import { createComponent } from "./components-sidebar";
import { ResizeHandles } from "./resize-handles";

interface CanvasComponentProps {
  component: CanvasComponent;
  isSelected: boolean;
  canvasOffset: { x: number; y: number };
  dragState: any;
  onMouseDown: (e: React.MouseEvent, componentId: string) => void;
  onResizeMouseDown: (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => void;
}

export function CanvasComponentRenderer({
  component,
  isSelected,
  canvasOffset,
  dragState,
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
    cursor:
      dragState.isDragging && dragState.componentId === component.id
        ? "grabbing"
        : isSelected
          ? "grab"
          : "pointer",
    userSelect: "none" as const,
    WebkitUserSelect: "none" as const,
    MozUserSelect: "none" as const,
    msUserSelect: "none" as const,
  };

  return (
    <div
      key={component.id}
      style={style}
      className={`relative select-none ${isSelected ? "ring-1 ring-blue-500" : ""}`}
      data-component-id={component.id}
      onMouseDown={(e) => onMouseDown(e, component.id)}
    >
      <div className="h-full w-full overflow-hidden">
        {createComponent(component.type, component.props, {
          width: component.width,
          height: component.height,
        })}
      </div>
      {isSelected && (
        <ResizeHandles componentId={component.id} onResizeMouseDown={onResizeMouseDown} />
      )}
    </div>
  );
}
