import { useCallback } from "react";
import type {
  CanvasComponent,
  Point,
  ResizeHandle,
  ResizeHandlePosition,
} from "../types/canvas-types";
import { snapSizeToGrid } from "../utils/grid-utils";
import { getDefaultSize } from "../utils/component-utils";

interface UseResizeInteractionsProps {
  components: CanvasComponent[];
  zoomScale: number;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
}

export function useResizeInteractions({
  components,
  zoomScale,
  updateComponent,
}: UseResizeInteractionsProps) {
  const calculateResizeDeltas = useCallback(
    (
      currentPoint: Point,
      startPoint: Point,
      handle: ResizeHandlePosition,
      startSize: { width: number; height: number },
      startPosition: { x: number; y: number }
    ) => {
      const deltaX = (currentPoint.x - startPoint.x) / zoomScale;
      const deltaY = (currentPoint.y - startPoint.y) / zoomScale;

      let newWidth = startSize.width;
      let newHeight = startSize.height;
      let newX = startPosition.x;
      let newY = startPosition.y;

      switch (handle) {
        case "top-left":
          newWidth = snapSizeToGrid(startSize.width - deltaX, 50);
          newHeight = snapSizeToGrid(startSize.height - deltaY, 30);
          newX = startPosition.x + startSize.width - newWidth;
          newY = startPosition.y + startSize.height - newHeight;
          break;
        case "top-right":
          newWidth = snapSizeToGrid(startSize.width + deltaX, 50);
          newHeight = snapSizeToGrid(startSize.height - deltaY, 30);
          newX = startPosition.x;
          newY = startPosition.y + startSize.height - newHeight;
          break;
        case "bottom-left":
          newWidth = snapSizeToGrid(startSize.width - deltaX, 50);
          newHeight = snapSizeToGrid(startSize.height + deltaY, 30);
          newX = startPosition.x + startSize.width - newWidth;
          newY = startPosition.y;
          break;
        case "bottom-right":
          newWidth = snapSizeToGrid(startSize.width + deltaX, 50);
          newHeight = snapSizeToGrid(startSize.height + deltaY, 30);
          newX = startPosition.x;
          newY = startPosition.y;
          break;
        case "top":
          newHeight = snapSizeToGrid(startSize.height - deltaY, 30);
          newX = startPosition.x;
          newY = startPosition.y + startSize.height - newHeight;
          break;
        case "bottom":
          newHeight = snapSizeToGrid(startSize.height + deltaY, 30);
          newX = startPosition.x;
          newY = startPosition.y;
          break;
        case "left":
          newWidth = snapSizeToGrid(startSize.width - deltaX, 50);
          newX = startPosition.x + startSize.width - newWidth;
          newY = startPosition.y;
          break;
        case "right":
          newWidth = snapSizeToGrid(startSize.width + deltaX, 50);
          newX = startPosition.x;
          newY = startPosition.y;
          break;
      }

      return { newWidth, newHeight, newX, newY };
    },
    [zoomScale]
  );

  const resizeComponent = useCallback(
    (
      componentId: string,
      currentPoint: Point,
      startPoint: Point,
      handle: ResizeHandlePosition,
      startSize: { width: number; height: number },
      startPosition: { x: number; y: number }
    ) => {
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const { newWidth, newHeight, newX, newY } = calculateResizeDeltas(
        currentPoint,
        startPoint,
        handle,
        startSize,
        startPosition
      );

      const updates: Partial<CanvasComponent> = {
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      };

      updateComponent(componentId, updates);
    },
    [components, updateComponent, calculateResizeDeltas]
  );

  const getResizeHandles = useCallback((component: CanvasComponent) => {
    const handles: Array<{ handle: ResizeHandlePosition; x: number; y: number; cursor: string }> = [
      { handle: "top-left", x: 0, y: 0, cursor: "nw-resize" },
      { handle: "top-right", x: component.width, y: 0, cursor: "ne-resize" },
      { handle: "bottom-left", x: 0, y: component.height, cursor: "sw-resize" },
      { handle: "bottom-right", x: component.width, y: component.height, cursor: "se-resize" },
      { handle: "top", x: component.width / 2, y: 0, cursor: "n-resize" },
      { handle: "bottom", x: component.width / 2, y: component.height, cursor: "s-resize" },
      { handle: "left", x: 0, y: component.height / 2, cursor: "w-resize" },
      { handle: "right", x: component.width, y: component.height / 2, cursor: "e-resize" },
    ];

    return handles;
  }, []);

  const getHandleCursor = useCallback((handle: ResizeHandlePosition): string => {
    const cursorMap: Record<ResizeHandlePosition, string> = {
      "top-left": "nw-resize",
      "top-right": "ne-resize",
      "bottom-left": "sw-resize",
      "bottom-right": "se-resize",
      top: "n-resize",
      bottom: "s-resize",
      left: "w-resize",
      right: "e-resize",
    };
    return cursorMap[handle];
  }, []);

  const validateComponentSize = useCallback((component: CanvasComponent): CanvasComponent => {
    const defaultSize = getDefaultSize(component.type);
    return {
      ...component,
      width: Math.max(component.width, defaultSize.width * 0.5),
      height: Math.max(component.height, defaultSize.height * 0.5),
    };
  }, []);

  return {
    calculateResizeDeltas,
    resizeComponent,
    getResizeHandles,
    getHandleCursor,
    validateComponentSize,
  };
}
