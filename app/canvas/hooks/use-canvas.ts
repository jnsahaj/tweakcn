import { useRef } from "react";
import { useCanvasStore } from "@/store/canvas-store";
import { useCanvasInteractionHandlers } from "./use-canvas-interaction-handlers";
import { useKeyboardInteractions } from "./use-keyboard-interactions";
import { useWheelInteractions } from "./use-wheel-interactions";
import { useInteractionPrevention } from "./use-interaction-prevention";
import { useDragInteractions } from "./use-drag-interactions";
import { useResizeInteractions } from "./use-resize-interactions";
import { useSelectionInteractions } from "./use-selection-interactions";
import { getBoundingRect } from "../utils/selection-utils";
import { screenToCanvas, canvasToScreen } from "../utils/coordinate-utils";

export function useCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);

  const {
    components,
    selectedComponentIds,
    canvasOffset,
    zoomState,
    panState,
    dragState,
    resizeState,
    selectionState,
    groupDragState,
    currentInteractionMode,
    isSelectionMode,
    getSelectedComponents,
    isInteracting,

    addComponent,
    updateComponent,
    updateComponentProps,
    deleteComponent,
    duplicateComponent,

    selectComponent,
    selectMultipleComponents,
    toggleComponentSelection,
    addComponentToSelection,
    clearSelection,
    deleteSelectedComponents,
    duplicateSelectedComponents,

    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,

    setCanvasOffset,
    setZoomScale,
    zoomIn,
    zoomOut,
    resetZoom,

    startPan,
    updatePan,
    resetPanState,

    startDrag,
    updateDrag,
    resetDragState,

    startResize,
    updateResize,
    resetResizeState,

    startSelection,
    updateSelection,
    endSelection,

    startGroupDrag,
    updateGroupDrag,
    endGroupDrag,

    toggleSelectionMode,
    resetAllStates,
  } = useCanvasStore();

  const selectedComponents = getSelectedComponents();

  const dragInteractions = useDragInteractions({
    components,
    canvasOffset,
    zoomScale: zoomState.scale,
    updateComponent,
    addComponent,
  });

  const resizeInteractions = useResizeInteractions({
    components,
    zoomScale: zoomState.scale,
    updateComponent,
  });

  const selectionInteractions = useSelectionInteractions({
    components,
    zoomScale: zoomState.scale,
    canvasOffset,
    updateComponent,
  });

  const eventHandlers = useCanvasInteractionHandlers({
    canvasRef,
    componentState: {
      components,
      selectedComponentIds,
      selectedComponents,
      setComponents: () => {},
      addComponent,
      updateComponent,
      updateComponentProps,
      deleteComponent,
      duplicateComponent,
      bringToFront,
      sendToBack,
      bringForward,
      sendBackward,
      selectComponent,
      selectMultipleComponents,
      toggleComponentSelection,
      addComponentToSelection,
      clearSelection,
      deleteSelectedComponents,
      duplicateSelectedComponents,
    },
    viewport: {
      canvasOffset,
      zoomState,
      panState,
      setCanvasOffset,
      setZoomState: () => {},
      setZoomScale,
      zoomIn,
      zoomOut,
      resetZoom,
      zoomToFit: () => {},
      setPanState: () => {},
      startPan,
      updatePan,
      resetPanState,
    },
    interactions: {
      currentMode: currentInteractionMode,
      isSelectionMode,
      dragState,
      resizeState,
      selectionState,
      groupDragState,
      toggleSelectionMode,
      startDrag,
      updateDrag,
      endDrag: resetDragState,
      startResize,
      updateResize,
      endResize: resetResizeState,
      startSelection,
      updateSelection,
      endSelection,
      startGroupDrag,
      updateGroupDrag,
      endGroupDrag,
      resetAllStates,
      isInteracting: isInteracting(),
    },
    dragInteractions,
    resizeInteractions,
    selectionInteractions,
  });

  useKeyboardInteractions({
    zoomIn,
    zoomOut,
    resetZoom,
    canvasRef,
  });

  useWheelInteractions({
    zoomState,
    setZoomScale,
    setCanvasOffset,
    canvasRef,
    startPan,
    updatePan,
    resetPanState,
    isSelectionMode,
  });

  useInteractionPrevention({
    isInteracting: isInteracting(),
  });

  return {
    canvasRef,
    components,
    selectedComponentIds,
    selectedComponents,
    canvasOffset,
    zoomState,
    panState,
    currentInteractionMode,
    isSelectionMode,
    selectionState,
    groupDragState,

    componentActions: {
      addComponent,
      updateComponent,
      updateComponentProps,
      deleteComponent,
      duplicateComponent,
      bringToFront,
      sendToBack,
      bringForward,
      sendBackward,
      deleteSelectedComponents,
      duplicateSelectedComponents,
    },

    selectionActions: {
      selectComponent,
      selectMultipleComponents,
      toggleComponentSelection,
      clearSelection,
    },

    viewportActions: {
      zoomIn,
      zoomOut,
      resetZoom,
      setZoomScale,
      zoomToFit: () => {},
    },

    modeActions: {
      toggleSelectionMode: () => {
        if (isSelectionMode) {
          clearSelection();
        }
        toggleSelectionMode();
      },
    },

    eventHandlers: {
      ...eventHandlers,
      handleCanvasDragOver: dragInteractions.handleCanvasDragOver,
      handleSidebarDragStart: dragInteractions.handleSidebarDragStart,
    },

    utils: {
      getResizeHandles: resizeInteractions.getResizeHandles,
      getHandleCursor: resizeInteractions.getHandleCursor,
      screenToCanvas: (point: any) => screenToCanvas(point, canvasOffset, zoomState.scale),
      canvasToScreen: (point: any) => canvasToScreen(point, canvasOffset, zoomState.scale),
      getBoundingRect,
    },
  };
}
