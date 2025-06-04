import type { Point } from "../types/canvas-types";

export function screenToCanvas(screenPoint: Point, canvasOffset: Point, zoomScale: number): Point {
  return {
    x: (screenPoint.x - canvasOffset.x) / zoomScale,
    y: (screenPoint.y - canvasOffset.y) / zoomScale,
  };
}

export function canvasToScreen(canvasPoint: Point, canvasOffset: Point, zoomScale: number): Point {
  return {
    x: canvasPoint.x * zoomScale + canvasOffset.x,
    y: canvasPoint.y * zoomScale + canvasOffset.y,
  };
}
