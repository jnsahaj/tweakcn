import { useRef, useCallback } from "react";
import type { ResizeHandle } from "../types/canvas-types";

import { useComponentState } from "./use-component-state";
import { useCanvasViewport } from "./use-canvas-viewport";
import { useInteractionState } from "./use-interaction-state";
import { useDragInteractions } from "./use-drag-interactions";
import { useResizeInteractions } from "./use-resize-interactions";
import { useKeyboardInteractions } from "./use-keyboard-interactions";
import { useWheelInteractions } from "./use-wheel-interactions";
import { useInteractionPrevention } from "./use-interaction-prevention";

export function useCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const componentState = useComponentState();
  const viewport = useCanvasViewport();
  const interactions = useInteractionState();

  const dragInteractions = useDragInteractions({
    components: componentState.components,
    canvasOffset: viewport.canvasOffset,
    zoomScale: viewport.zoomState.scale,
    updateComponent: componentState.updateComponent,
    addComponent: componentState.addComponent,
  });

  const resizeInteractions = useResizeInteractions({
    components: componentState.components,
    zoomScale: viewport.zoomState.scale,
    updateComponent: componentState.updateComponent,
  });

  useKeyboardInteractions({
    zoomIn: viewport.zoomIn,
    zoomOut: viewport.zoomOut,
    resetZoom: viewport.resetZoom,
    canvasRef,
  });

  useWheelInteractions({
    zoomState: viewport.zoomState,
    setZoomScale: viewport.setZoomScale,
    setCanvasOffset: viewport.setCanvasOffset,
    canvasRef,
  });

  useInteractionPrevention({
    isInteracting: interactions.isInteracting,
  });

  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      e.preventDefault();
      e.stopPropagation();

      componentState.selectComponent(componentId);

      if (!canvasRef.current) return;

      const dragOffset = dragInteractions.calculateComponentDragOffset(
        e,
        e.currentTarget as HTMLElement
      );

      interactions.startDrag(componentId, dragOffset);
    },
    [componentState, dragInteractions, interactions]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => {
      e.preventDefault();
      e.stopPropagation();

      const component = componentState.components.find((c) => c.id === componentId);
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
    interactions.resetAllStates();
    viewport.resetPanState();
  }, [interactions, viewport]);

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickedOnComponent = target.closest("[data-component-id]");

      if (!clickedOnComponent) {
        e.preventDefault();
        componentState.clearSelection();
        viewport.startPan({ x: e.clientX, y: e.clientY });
      }
    },
    [componentState, viewport]
  );

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      if (!canvasRef.current) return;
      dragInteractions.handleCanvasDrop(e, canvasRef.current);
    },
    [dragInteractions]
  );

  return {
    canvasRef,

    components: componentState.components,
    selectedComponentIds: componentState.selectedComponentIds,
    selectedComponents: componentState.selectedComponents,

    canvasOffset: viewport.canvasOffset,
    zoomState: viewport.zoomState,

    currentInteractionMode: interactions.currentMode,

    componentActions: {
      addComponent: componentState.addComponent,
      updateComponent: componentState.updateComponent,
      updateComponentProps: componentState.updateComponentProps,
      deleteComponent: componentState.deleteComponent,
      duplicateComponent: componentState.duplicateComponent,
      bringToFront: componentState.bringToFront,
      sendToBack: componentState.sendToBack,
      bringForward: componentState.bringForward,
      sendBackward: componentState.sendBackward,
    },

    selectionActions: {
      selectComponent: componentState.selectComponent,
      selectMultipleComponents: componentState.selectMultipleComponents,
      toggleComponentSelection: componentState.toggleComponentSelection,
      clearSelection: componentState.clearSelection,
    },

    viewportActions: {
      zoomIn: viewport.zoomIn,
      zoomOut: viewport.zoomOut,
      resetZoom: viewport.resetZoom,
      setZoomScale: viewport.setZoomScale,
      zoomToFit: viewport.zoomToFit,
    },

    eventHandlers: {
      handleComponentMouseDown,
      handleResizeMouseDown,
      handleMouseMove,
      handleMouseUp,
      handleCanvasMouseDown,
      handleCanvasDrop,
      handleCanvasDragOver: dragInteractions.handleCanvasDragOver,
      handleSidebarDragStart: dragInteractions.handleSidebarDragStart,
    },

    utils: {
      getResizeHandles: resizeInteractions.getResizeHandles,
      getHandleCursor: resizeInteractions.getHandleCursor,
      screenToCanvas: viewport.screenToCanvas,
      canvasToScreen: viewport.canvasToScreen,
    },
  };
}
