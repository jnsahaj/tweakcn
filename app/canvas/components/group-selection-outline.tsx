import type { Rect } from "../types/canvas-types";

interface GroupSelectionOutlineProps {
  boundingRect: Rect;
  isVisible: boolean;
  zoomScale: number;
  canvasOffset: { x: number; y: number };
}

export function GroupSelectionOutline({
  boundingRect,
  isVisible,
  zoomScale,
  canvasOffset,
}: GroupSelectionOutlineProps) {
  if (!isVisible || boundingRect.width === 0 || boundingRect.height === 0) return null;

  const screenX = boundingRect.x * zoomScale + canvasOffset.x;
  const screenY = boundingRect.y * zoomScale + canvasOffset.y;
  const screenWidth = boundingRect.width * zoomScale;
  const screenHeight = boundingRect.height * zoomScale;

  return (
    <div
      className="pointer-events-none absolute z-40 border-2 border-blue-600 bg-blue-600/10"
      style={{
        left: screenX - 2,
        top: screenY - 2,
        width: screenWidth + 4,
        height: screenHeight + 4,
        borderRadius: 4,
      }}
    >
      {/* Corner handles for visual indication */}
      <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-blue-600" />
      <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-600" />
      <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-blue-600" />
      <div className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-blue-600" />
    </div>
  );
}
