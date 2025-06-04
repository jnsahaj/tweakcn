import { useRef } from "react";

import { useComponentState } from "./use-component-state";
import { useCanvasViewport } from "./use-canvas-viewport";
import { useInteractionState } from "./use-interaction-state";
import { useDragInteractions } from "./use-drag-interactions";
import { useResizeInteractions } from "./use-resize-interactions";
import { useSelectionInteractions } from "./use-selection-interactions";
import { useCanvasInteractionHandlers } from "./use-canvas-interaction-handlers";
import { useKeyboardInteractions } from "./use-keyboard-interactions";
import { useWheelInteractions } from "./use-wheel-interactions";
import { useInteractionPrevention } from "./use-interaction-prevention";
import { getBoundingRect } from "../utils/selection-utils";
import { screenToCanvas, canvasToScreen } from "../utils/coordinate-utils";

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

  const selectionInteractions = useSelectionInteractions({
    components: componentState.components,
    zoomScale: viewport.zoomState.scale,
    canvasOffset: viewport.canvasOffset,
    updateComponent: componentState.updateComponent,
  });

  const eventHandlers = useCanvasInteractionHandlers({
    canvasRef,
    componentState,
    viewport,
    interactions,
    dragInteractions,
    resizeInteractions,
    selectionInteractions,
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

  return {
    canvasRef,
    components: componentState.components,
    selectedComponentIds: componentState.selectedComponentIds,
    selectedComponents: componentState.selectedComponents,
    canvasOffset: viewport.canvasOffset,
    zoomState: viewport.zoomState,
    currentInteractionMode: interactions.currentMode,
    isSelectionMode: interactions.isSelectionMode,
    selectionState: interactions.selectionState,
    groupDragState: interactions.groupDragState,

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

    modeActions: {
      toggleSelectionMode: interactions.toggleSelectionMode,
    },

    eventHandlers: {
      ...eventHandlers,
      handleCanvasDragOver: dragInteractions.handleCanvasDragOver,
      handleSidebarDragStart: dragInteractions.handleSidebarDragStart,
    },

    utils: {
      getResizeHandles: resizeInteractions.getResizeHandles,
      getHandleCursor: resizeInteractions.getHandleCursor,
      screenToCanvas: (point: any) =>
        screenToCanvas(point, viewport.canvasOffset, viewport.zoomState.scale),
      canvasToScreen: (point: any) =>
        canvasToScreen(point, viewport.canvasOffset, viewport.zoomState.scale),
      getBoundingRect,
    },
  };
}
