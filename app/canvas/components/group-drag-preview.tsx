import type { CanvasComponent, Point } from "../types/canvas-types";

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
  if (!isVisible || selectedComponents.length === 0) return null;

  const deltaX = dragOffset.x / zoomScale;
  const deltaY = dragOffset.y / zoomScale;

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
