import { useCallback } from "react";
import type { ResizeHandle } from "../types/canvas-types";
import { screenToCanvas } from "../utils/coordinate-utils";
import { getBoundingRect, getTopmostComponentAtPoint } from "../utils/selection-utils";
import { snapToGrid } from "../utils/grid-utils";
import { useCanvasStore } from "@/store/canvas-store";

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
  const gridSize = useCanvasStore((state) => state.gridSize);
  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      e.preventDefault();
      e.stopPropagation();

      // Right-click anywhere should initiate panning (works in both modes)
      if (e.button === 2) {
        viewport.startPan({ x: e.clientX, y: e.clientY });
        return;
      }

      // In panning mode: no component selection or interaction is allowed (except right-click panning)
      if (!interactions.isSelectionMode) {
        return;
      }

      // Find the topmost component at the click position to handle overlapping components properly
      const canvasPoint = screenToCanvas(
        { x: e.clientX, y: e.clientY },
        viewport.canvasOffset,
        viewport.zoomState.scale
      );
      const topmostComponent = getTopmostComponentAtPoint(componentState.components, canvasPoint);
      const actualComponentId = topmostComponent ? topmostComponent.id : componentId;

      // In selection mode: allow component selection and interactions
      // Handle Shift+click for additive selection (add to selection without toggling)
      if (e.shiftKey) {
        componentState.addComponentToSelection(actualComponentId);
        return;
      }

      // Handle Cmd/Ctrl+click for toggle selection
      if (e.metaKey || e.ctrlKey) {
        componentState.toggleComponentSelection(actualComponentId);
        return;
      }

      // Check if the clicked component is part of a multiple selection
      const isPartOfMultipleSelection =
        componentState.selectedComponentIds.length > 1 &&
        componentState.selectedComponentIds.includes(actualComponentId);

      if (isPartOfMultipleSelection) {
        // Start group drag instead of individual component drag
        const startPoint = { x: e.clientX, y: e.clientY };
        interactions.startGroupDrag(startPoint);
        return;
      }

      // Check if we have a group selected and the click is within the group's bounding area
      if (componentState.selectedComponentIds.length > 1) {
        const boundingRect = getBoundingRect(componentState.selectedComponents);

        if (
          canvasPoint.x >= boundingRect.x &&
          canvasPoint.x <= boundingRect.x + boundingRect.width &&
          canvasPoint.y >= boundingRect.y &&
          canvasPoint.y <= boundingRect.y + boundingRect.height
        ) {
          // Clicking within group bounding area should start group drag
          const startPoint = { x: e.clientX, y: e.clientY };
          interactions.startGroupDrag(startPoint);
          return;
        }
      }

      // For single selection or clicking on non-selected component outside group area
      componentState.selectComponent(actualComponentId);

      if (!canvasRef.current) return;

      const dragOffset = dragInteractions.calculateComponentDragOffset(
        e,
        e.currentTarget as HTMLElement
      );

      interactions.startDrag(actualComponentId, dragOffset);
    },
    [componentState, dragInteractions, interactions, canvasRef, viewport]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      // Right-click on resize handle should also initiate panning
      if (e.button === 2) {
        viewport.startPan({ x: e.clientX, y: e.clientY });
        return;
      }

      // In panning mode: no resize interaction is allowed
      if (!interactions.isSelectionMode) {
        return;
      }

      const component = componentState.components.find((c: any) => c.id === componentId);
      if (!component) return;

      const startPoint = { x: e.clientX, y: e.clientY };
      const startSize = { width: component.width, height: component.height };
      const startPosition = { x: component.x, y: component.y };

      interactions.startResize(componentId, handle.position, startPoint, startSize, startPosition);
    },
    [componentState, interactions, viewport]
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
          interactions.resizeState.startSize,
          interactions.resizeState.startPosition
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

      if (interactions.isInteracting || viewport.panState.isPanning) {
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
      const rawDeltaX = interactions.groupDragState.dragOffset.x / viewport.zoomState.scale;
      const rawDeltaY = interactions.groupDragState.dragOffset.y / viewport.zoomState.scale;

      // Apply grid snapping to the deltas
      const deltaX = snapToGrid(rawDeltaX, gridSize);
      const deltaY = snapToGrid(rawDeltaY, gridSize);

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
  }, [interactions, selectionInteractions, componentState, viewport, gridSize]);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedOnComponent = target.closest("[data-component-id]");

      if (!clickedOnComponent) {
        e.preventDefault();

        // Right-click anywhere on canvas should initiate panning (works in both modes)
        if (e.button === 2) {
          viewport.startPan({ x: e.clientX, y: e.clientY });
          return;
        }

        if (interactions.isSelectionMode) {
          // In selection mode: allow canvas selection for group selection
          // But first check if clicking on selected components for group drag
          if (componentState.selectedComponentIds.length > 0) {
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
              return;
            }
          }

          // Start selection rectangle for group selection
          const startPoint = { x: e.clientX, y: e.clientY };
          interactions.startSelection(startPoint);
          componentState.clearSelection();
        } else {
          // In panning mode: only allow panning, no selection
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

  // Add context menu handler to prevent right-click menu
  const handleCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    handleComponentMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
    handleCanvasDrop,
    handleCanvasContextMenu,
  };
}
