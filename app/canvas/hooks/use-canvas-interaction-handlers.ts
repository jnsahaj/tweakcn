import { useCallback } from "react";
import type { ResizeHandle } from "../types/canvas-types";
import { screenToCanvas } from "../utils/coordinate-utils";
import { getBoundingRect } from "../utils/selection-utils";

interface UseCanvasInteractionHandlersProps {
  canvasRef: React.RefObject<HTMLDivElement | null>;
  componentState: any;
  viewport: any;
  interactions: any;
  dragInteractions: any;
  resizeInteractions: any;
  selectionInteractions: any;
}

export function useCanvasInteractionHandlers({
  canvasRef,
  componentState,
  viewport,
  interactions,
  dragInteractions,
  resizeInteractions,
  selectionInteractions,
}: UseCanvasInteractionHandlersProps) {
  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (interactions.isSelectionMode) {
        if (e.metaKey || e.ctrlKey) {
          componentState.toggleComponentSelection(componentId);
        } else {
          componentState.selectComponent(componentId);
        }
        return;
      }

      if (e.metaKey || e.ctrlKey) {
        componentState.toggleComponentSelection(componentId);
        return;
      }

      componentState.selectComponent(componentId);

      if (!canvasRef.current) return;

      const dragOffset = dragInteractions.calculateComponentDragOffset(
        e,
        e.currentTarget as HTMLElement
      );

      interactions.startDrag(componentId, dragOffset);
    },
    [componentState, dragInteractions, interactions, canvasRef]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      const component = componentState.components.find((c: any) => c.id === componentId);
      if (!component) return;

      const startPoint = { x: e.clientX, y: e.clientY };
      const startSize = { width: component.width, height: component.height };

      interactions.startResize(componentId, handle, startPoint, startSize);
    },
    [componentState, interactions]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (
        interactions.resizeState.isResizing &&
        interactions.resizeState.componentId &&
        interactions.resizeState.handle
      ) {
        const currentPoint = { x: e.clientX, y: e.clientY };
        resizeInteractions.resizeComponent(
          interactions.resizeState.componentId,
          currentPoint,
          interactions.resizeState.startPoint,
          interactions.resizeState.handle,
          interactions.resizeState.startSize
        );
      } else if (
        interactions.dragState.isDragging &&
        interactions.dragState.componentId &&
        canvasRef.current
      ) {
        const newPosition = dragInteractions.calculateNewComponentPosition(
          e,
          interactions.dragState.dragOffset,
          canvasRef.current
        );
        dragInteractions.moveComponent(interactions.dragState.componentId, newPosition);
      } else if (interactions.selectionState.isSelecting) {
        const currentPoint = { x: e.clientX, y: e.clientY };
        interactions.updateSelection(currentPoint);
      } else if (interactions.groupDragState.isDragging) {
        const currentPoint = { x: e.clientX, y: e.clientY };
        interactions.updateGroupDrag(currentPoint);
      } else if (viewport.panState.isPanning) {
        viewport.updatePan({ x: e.clientX, y: e.clientY });
      }

      if (interactions.isInteracting) {
        e.preventDefault();
      }
    },
    [interactions, resizeInteractions, dragInteractions, viewport, canvasRef]
  );

  const handleMouseUp = useCallback(() => {
    if (interactions.selectionState.isSelecting) {
      const selectedIds = selectionInteractions.findComponentsInSelectionRect(
        interactions.selectionState.startPoint,
        interactions.selectionState.currentPoint
      );
      componentState.selectMultipleComponents(selectedIds);
      interactions.endSelection(selectedIds);
    } else if (interactions.groupDragState.isDragging) {
      const deltaX = interactions.groupDragState.dragOffset.x / viewport.zoomState.scale;
      const deltaY = interactions.groupDragState.dragOffset.y / viewport.zoomState.scale;

      if (Math.abs(deltaX) > 0.5 || Math.abs(deltaY) > 0.5) {
        selectionInteractions.moveSelectedComponents(
          componentState.selectedComponents,
          deltaX,
          deltaY
        );
      }

      interactions.resetAllStates();
    } else {
      interactions.resetAllStates();
    }

    viewport.resetPanState();
  }, [interactions, selectionInteractions, componentState, viewport]);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedOnComponent = target.closest("[data-component-id]");

      if (!clickedOnComponent) {
        e.preventDefault();

        if (interactions.isSelectionMode) {
          const startPoint = { x: e.clientX, y: e.clientY };
          interactions.startSelection(startPoint);
          componentState.clearSelection();
        } else if (componentState.selectedComponentIds.length > 0) {
          const boundingRect = getBoundingRect(componentState.selectedComponents);
          const canvasPoint = screenToCanvas(
            { x: e.clientX, y: e.clientY },
            viewport.canvasOffset,
            viewport.zoomState.scale
          );

          if (
            canvasPoint.x >= boundingRect.x &&
            canvasPoint.x <= boundingRect.x + boundingRect.width &&
            canvasPoint.y >= boundingRect.y &&
            canvasPoint.y <= boundingRect.y + boundingRect.height
          ) {
            const startPoint = { x: e.clientX, y: e.clientY };
            interactions.startGroupDrag(startPoint);
          } else {
            componentState.clearSelection();
            viewport.startPan({ x: e.clientX, y: e.clientY });
          }
        } else {
          componentState.clearSelection();
          viewport.startPan({ x: e.clientX, y: e.clientY });
        }
      }
    },
    [componentState, viewport, interactions]
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      if (!canvasRef.current) return;
      dragInteractions.handleCanvasDrop(e, canvasRef.current);
    },
    [dragInteractions, canvasRef]
  );

  return {
    handleComponentMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
    handleCanvasDrop,
  };
}
