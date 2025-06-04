// Grid snapping configuration - Tailwind 0.5 unit = 2px
export const GRID_SIZE = 10; // 2px corresponds to Tailwind's 0.5 unit

/**
 * Snap coordinates to grid
 */
export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

/**
 * Snap size to grid (ensuring minimum sizes)
 */
export function snapSizeToGrid(value: number, minSize: number): number {
  const snapped = Math.round(value / GRID_SIZE) * GRID_SIZE;
  return Math.max(snapped, minSize);
}
