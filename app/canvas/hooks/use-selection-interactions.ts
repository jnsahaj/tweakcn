import { useCallback } from "react";
import type { CanvasComponent, Point } from "../types/canvas-types";
import { screenToCanvas } from "../utils/coordinate-utils";
import {
  createSelectionRect,
  getComponentsInRect,
  getBoundingRect,
} from "../utils/selection-utils";
import { snapToGrid } from "../utils/grid-utils";
import { useCanvasStore } from "@/store/canvas-store";

interface UseSelectionInteractionsProps {
  components: CanvasComponent[];
  zoomScale: number;
  canvasOffset: Point;
  updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => void;
}

export function useSelectionInteractions({
  components,
  zoomScale,
  canvasOffset,
  updateComponent,
}: UseSelectionInteractionsProps) {
  const gridSize = useCanvasStore((state) => state.gridSize);
  const findComponentsInSelectionRect = useCallback(
    (startScreenPoint: Point, currentScreenPoint: Point): string[] => {
      const startCanvasPoint = screenToCanvas(startScreenPoint, canvasOffset, zoomScale);
      const currentCanvasPoint = screenToCanvas(currentScreenPoint, canvasOffset, zoomScale);
      const selectionRect = createSelectionRect(startCanvasPoint, currentCanvasPoint);
      const componentsInRect = getComponentsInRect(components, selectionRect);
      return componentsInRect.map((c) => c.id);
    },
    [components, canvasOffset, zoomScale]
  );

  const moveSelectedComponents = useCallback(
    (selectedComponents: CanvasComponent[], deltaX: number, deltaY: number) => {
      selectedComponents.forEach((component) => {
        const newX = snapToGrid(component.x + deltaX, gridSize);
        const newY = snapToGrid(component.y + deltaY, gridSize);
        updateComponent(component.id, { x: newX, y: newY });
      });
    },
    [updateComponent, gridSize]
  );

  return {
    findComponentsInSelectionRect,
    moveSelectedComponents,
    getBoundingRect,
  };
}
