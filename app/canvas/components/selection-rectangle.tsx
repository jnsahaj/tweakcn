import type { Point } from "../types/canvas-types";

interface SelectionRectangleProps {
  startPoint: Point;
  currentPoint: Point;
  isVisible: boolean;
}

export function SelectionRectangle({
  startPoint,
  currentPoint,
  isVisible,
}: SelectionRectangleProps) {
  if (!isVisible) return null;

  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const width = Math.abs(currentPoint.x - startPoint.x);
  const height = Math.abs(currentPoint.y - startPoint.y);

  return (
    <div
      className="pointer-events-none absolute z-50 border-2 border-blue-500 bg-blue-500/20"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
}
