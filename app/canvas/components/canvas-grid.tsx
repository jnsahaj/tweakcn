import { GRID_SIZE } from "../utils/grid-utils";

interface CanvasGridProps {
  canvasOffset: { x: number; y: number };
}

export function CanvasGrid({ canvasOffset }: CanvasGridProps) {
  return (
    <div
      className="absolute inset-0 opacity-20"
      data-canvas-area
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
      }}
    />
  );
}
