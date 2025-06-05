// Grid snapping utilities - no default grid size to ensure dynamic sizing is always used

/**
 * Snap coordinates to grid
 */
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap size to grid (ensuring minimum sizes)
 */
export function snapSizeToGrid(value: number, minSize: number, gridSize: number): number {
  const snapped = Math.round(value / gridSize) * gridSize;
  return Math.max(snapped, minSize);
}
