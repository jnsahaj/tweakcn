import type { CanvasComponent, Point, Rect } from "../types/canvas-types";

export function createSelectionRect(startPoint: Point, currentPoint: Point): Rect {
  const x = Math.min(startPoint.x, currentPoint.x);
  const y = Math.min(startPoint.y, currentPoint.y);
  const width = Math.abs(currentPoint.x - startPoint.x);
  const height = Math.abs(currentPoint.y - startPoint.y);
  return { x, y, width, height };
}

export function isComponentInRect(component: CanvasComponent, rect: Rect): boolean {
  const compRect = {
    x: component.x,
    y: component.y,
    width: component.width,
    height: component.height,
  };

  return (
    rect.x <= compRect.x + compRect.width &&
    rect.x + rect.width >= compRect.x &&
    rect.y <= compRect.y + compRect.height &&
    rect.y + rect.height >= compRect.y
  );
}

export function getComponentsInRect(components: CanvasComponent[], rect: Rect): CanvasComponent[] {
  return components.filter((component) => isComponentInRect(component, rect));
}

export function getBoundingRect(components: CanvasComponent[]): Rect {
  if (components.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const minX = Math.min(...components.map((c) => c.x));
  const minY = Math.min(...components.map((c) => c.y));
  const maxX = Math.max(...components.map((c) => c.x + c.width));
  const maxY = Math.max(...components.map((c) => c.y + c.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}
