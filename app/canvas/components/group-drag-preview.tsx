import type { CanvasComponent, Point } from "../types/canvas-types";
import { snapToGrid } from "../utils/grid-utils";
import { useCanvasStore } from "@/store/canvas-store";

interface GroupDragPreviewProps {
  selectedComponents: CanvasComponent[];
  isVisible: boolean;
  dragOffset: Point;
  zoomScale: number;
  canvasOffset: Point;
}

export function GroupDragPreview({
  selectedComponents,
  isVisible,
  dragOffset,
  zoomScale,
  canvasOffset,
}: GroupDragPreviewProps) {
  const gridSize = useCanvasStore((state) => state.gridSize);

  if (!isVisible || selectedComponents.length === 0) return null;

  // Apply grid snapping to the drag offset
  const rawDeltaX = dragOffset.x / zoomScale;
  const rawDeltaY = dragOffset.y / zoomScale;
  const deltaX = snapToGrid(rawDeltaX, gridSize);
  const deltaY = snapToGrid(rawDeltaY, gridSize);

  return (
    <div className="pointer-events-none absolute z-30">
      {selectedComponents.map((component) => {
        const screenX = (component.x + deltaX) * zoomScale + canvasOffset.x;
        const screenY = (component.y + deltaY) * zoomScale + canvasOffset.y;
        const screenWidth = component.width * zoomScale;
        const screenHeight = component.height * zoomScale;

        return (
          <div
            key={`preview-${component.id}`}
            className="absolute rounded border-2 border-blue-400 bg-blue-400/20"
            style={{
              left: screenX,
              top: screenY,
              width: screenWidth,
              height: screenHeight,
            }}
          />
        );
      })}
    </div>
  );
}
