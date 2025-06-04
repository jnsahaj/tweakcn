import { useCallback } from "react";
import type { CanvasComponent, Point, ComponentType } from "../types/canvas-types";
import { snapToGrid, snapSizeToGrid } from "../utils/grid-utils";
import { getDefaultSize, getDefaultProps } from "../utils/component-utils";

interface UseDragInteractionsProps {
  components: CanvasComponent[];
  canvasOffset: Point;
  zoomScale: number;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  addComponent: (component: CanvasComponent) => void;
}

export function useDragInteractions({
  components,
  canvasOffset,
  zoomScale,
  updateComponent,
  addComponent,
}: UseDragInteractionsProps) {
  const handleSidebarDragStart = useCallback((e: React.DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData("componentType", componentType);
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent, canvasElement: HTMLElement) => {
      e.preventDefault();
      const componentType = e.dataTransfer.getData("componentType") as ComponentType;

      if (componentType) {
        const rect = canvasElement.getBoundingClientRect();
        const rawX = (e.clientX - rect.left - canvasOffset.x) / zoomScale;
        const rawY = (e.clientY - rect.top - canvasOffset.y) / zoomScale;

        const x = snapToGrid(rawX);
        const y = snapToGrid(rawY);

        const defaultSize = getDefaultSize(componentType);
        const maxZIndex = Math.max(...components.map((c) => c.zIndex), 0);

        const newComponent: CanvasComponent = {
          id: `${componentType}-${Date.now()}`,
          type: componentType,
          x,
          y,
          width: snapSizeToGrid(defaultSize.width, 50),
          height: snapSizeToGrid(defaultSize.height, 30),
          zIndex: maxZIndex + 1,
          props: getDefaultProps(componentType),
        };

        addComponent(newComponent);
      }
    },
    [canvasOffset, zoomScale, components, addComponent]
  );

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const calculateComponentDragOffset = useCallback(
    (mouseEvent: React.MouseEvent, componentElement: HTMLElement): Point => {
      const rect = componentElement.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top,
      };
    },
    []
  );

  const calculateNewComponentPosition = useCallback(
    (mouseEvent: React.MouseEvent, dragOffset: Point, canvasElement: HTMLElement): Point => {
      const rect = canvasElement.getBoundingClientRect();
      const rawX = (mouseEvent.clientX - rect.left - dragOffset.x - canvasOffset.x) / zoomScale;
      const rawY = (mouseEvent.clientY - rect.top - dragOffset.y - canvasOffset.y) / zoomScale;

      return {
        x: snapToGrid(rawX),
        y: snapToGrid(rawY),
      };
    },
    [canvasOffset, zoomScale]
  );

  const moveComponent = useCallback(
    (componentId: string, newPosition: Point) => {
      updateComponent(componentId, newPosition);
    },
    [updateComponent]
  );

  const moveMultipleComponents = useCallback(
    (componentIds: string[], deltaX: number, deltaY: number) => {
      componentIds.forEach((id) => {
        const component = components.find((c) => c.id === id);
        if (component) {
          updateComponent(id, {
            x: snapToGrid(component.x + deltaX),
            y: snapToGrid(component.y + deltaY),
          });
        }
      });
    },
    [components, updateComponent]
  );

  return {
    handleSidebarDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    calculateComponentDragOffset,
    calculateNewComponentPosition,
    moveComponent,
    moveMultipleComponents,
  };
}
