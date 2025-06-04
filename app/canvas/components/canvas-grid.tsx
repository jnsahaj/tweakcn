import { GRID_SIZE } from "../utils/grid-utils";

interface CanvasGridProps {
  canvasOffset: { x: number; y: number };
  zoomScale: number;
}

export function CanvasGrid({ canvasOffset, zoomScale }: CanvasGridProps) {
  const scaledGridSize = GRID_SIZE * zoomScale;
  const scaledBlockSize = GRID_SIZE * 10 * zoomScale; // 10x10 blocks

  return (
    <>
      {/* Regular grid lines */}
      <div
        className="absolute inset-0 opacity-15"
        data-canvas-area
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
        }}
      />

      {/* Bold 10x10 block borders */}
      <div
        className="absolute inset-0 opacity-30"
        data-canvas-area
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--color-border) 2px, transparent 2px),
            linear-gradient(to bottom, var(--color-border) 2px, transparent 2px)
          `,
          backgroundSize: `${scaledBlockSize}px ${scaledBlockSize}px`,
          backgroundPosition: `${canvasOffset.x}px ${canvasOffset.y}px`,
        }}
      />
    </>
  );
}
