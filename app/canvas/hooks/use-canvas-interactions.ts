import { useCallback, useRef } from "react";
import type { CanvasComponent, ComponentType } from "../types/canvas-types";
import { snapToGrid, snapSizeToGrid } from "../utils/grid-utils";
import { getDefaultSize, getDefaultProps } from "../utils/component-utils";

interface UseCanvasInteractionsProps {
  components: CanvasComponent[];
  dragState: any;
  resizeState: any;
  canvasOffset: { x: number; y: number };
  panState: any;
  setDragState: (state: any) => void;
  setResizeState: (state: any) => void;
  setCanvasOffset: (offset: any) => void;
  setPanState: (state: any) => void;
  setSelectedComponentId: (id: string | null) => void;
  addComponent: (component: CanvasComponent) => void;
  updateComponent: (id: string, updates: Partial<CanvasComponent>) => void;
  resetDragState: () => void;
  resetResizeState: () => void;
  resetPanState: () => void;
}

export function useCanvasInteractions({
  components,
  dragState,
  resizeState,
  canvasOffset,
  panState,
  setDragState,
  setResizeState,
  setCanvasOffset,
  setPanState,
  setSelectedComponentId,
  addComponent,
  updateComponent,
  resetDragState,
  resetResizeState,
  resetPanState,
}: UseCanvasInteractionsProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSidebarDragStart = useCallback((e: React.DragEvent, componentType: ComponentType) => {
    e.dataTransfer.setData("componentType", componentType);
    e.dataTransfer.effectAllowed = "copy";
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const componentType = e.dataTransfer.getData("componentType") as ComponentType;

      if (componentType && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left - canvasOffset.x;
        const rawY = e.clientY - rect.top - canvasOffset.y;

        const x = snapToGrid(rawX);
        const y = snapToGrid(rawY);

        const defaultSize = getDefaultSize(componentType);
        const newComponent: CanvasComponent = {
          id: `${componentType}-${Date.now()}`,
          type: componentType,
          x,
          y,
          width: snapSizeToGrid(defaultSize.width, 50),
          height: snapSizeToGrid(defaultSize.height, 30),
          props: getDefaultProps(componentType),
        };

        addComponent(newComponent);
      }
    },
    [canvasOffset, addComponent]
  );

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      e.stopPropagation();
      setSelectedComponentId(componentId);

      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const canvasRect = canvasRef.current?.getBoundingClientRect();
      if (!canvasRect) return;

      setDragState({
        isDragging: true,
        dragOffset: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
        componentId,
      });
    },
    [components, setSelectedComponentId, setDragState]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string, handle: string) => {
      e.stopPropagation();
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      setResizeState({
        isResizing: true,
        componentId,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        startWidth: component.width || getDefaultSize(component.type).width,
        startHeight: component.height || getDefaultSize(component.type).height,
      });
    },
    [components, setResizeState]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (resizeState.isResizing && resizeState.componentId && resizeState.handle) {
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;

        let newWidth = resizeState.startWidth;
        let newHeight = resizeState.startHeight;

        if (resizeState.handle.includes("right")) {
          newWidth = snapSizeToGrid(resizeState.startWidth + deltaX, 50);
        }
        if (resizeState.handle.includes("left")) {
          newWidth = snapSizeToGrid(resizeState.startWidth - deltaX, 50);
        }
        if (resizeState.handle.includes("bottom")) {
          newHeight = snapSizeToGrid(resizeState.startHeight + deltaY, 30);
        }
        if (resizeState.handle.includes("top")) {
          newHeight = snapSizeToGrid(resizeState.startHeight - deltaY, 30);
        }

        updateComponent(resizeState.componentId, { width: newWidth, height: newHeight });
      } else if (dragState.isDragging && dragState.componentId && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const rawX = e.clientX - rect.left - dragState.dragOffset.x - canvasOffset.x;
        const rawY = e.clientY - rect.top - dragState.dragOffset.y - canvasOffset.y;

        const newX = snapToGrid(rawX);
        const newY = snapToGrid(rawY);

        updateComponent(dragState.componentId, { x: newX, y: newY });
      } else if (panState.isPanning) {
        const deltaX = e.clientX - panState.panStart.x;
        const deltaY = e.clientY - panState.panStart.y;
        setCanvasOffset((prev: any) => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));
        setPanState((prev: any) => ({
          ...prev,
          panStart: { x: e.clientX, y: e.clientY },
        }));
      }
    },
    [dragState, resizeState, canvasOffset, panState, updateComponent, setCanvasOffset, setPanState]
  );

  const handleMouseUp = useCallback(() => {
    resetDragState();
    resetResizeState();
    resetPanState();
  }, [resetDragState, resetResizeState, resetPanState]);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Check if we clicked on a component (components have a specific class or data attribute)
      const target = e.target as HTMLElement;
      const clickedOnComponent = target.closest("[data-component-id]");

      if (!clickedOnComponent) {
        // Deselect any selected component when clicking outside components
        setSelectedComponentId(null);

        // Start panning
        setPanState({
          isPanning: true,
          panStart: { x: e.clientX, y: e.clientY },
        });
      }
    },
    [setSelectedComponentId, setPanState]
  );

  return {
    canvasRef,
    handleSidebarDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleComponentMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
  };
}
