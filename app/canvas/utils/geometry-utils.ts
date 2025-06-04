import type { Point, Rect, CanvasComponent } from "../types/canvas-types";

export function pointsToRect(start: Point, end: Point): Rect {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return { x, y, width, height };
}

export function componentToRect(component: CanvasComponent): Rect {
  return {
    x: component.x,
    y: component.y,
    width: component.width,
    height: component.height,
  };
}

export function rectIntersectsRect(rect1: Rect, rect2: Rect): boolean {
  return !(
    rect1.x + rect1.width <= rect2.x ||
    rect2.x + rect2.width <= rect1.x ||
    rect1.y + rect1.height <= rect2.y ||
    rect2.y + rect2.height <= rect1.y
  );
}

export function rectContainsRect(container: Rect, contained: Rect): boolean {
  return (
    container.x <= contained.x &&
    container.y <= contained.y &&
    container.x + container.width >= contained.x + contained.width &&
    container.y + container.height >= contained.y + contained.height
  );
}

export function pointInRect(point: Point, rect: Rect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

export function calculateBoundingRect(components: CanvasComponent[]): Rect | null {
  if (components.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  components.forEach((component) => {
    minX = Math.min(minX, component.x);
    minY = Math.min(minY, component.y);
    maxX = Math.max(maxX, component.x + component.width);
    maxY = Math.max(maxY, component.y + component.height);
  });

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function transformPoint(point: Point, offset: Point, scale: number): Point {
  return {
    x: (point.x - offset.x) / scale,
    y: (point.y - offset.y) / scale,
  };
}

export function getDistanceBetweenPoints(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
