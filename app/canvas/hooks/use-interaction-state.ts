import { useState, useCallback } from "react";
import type {
  DragState,
  ResizeState,
  SelectionState,
  InteractionMode,
  Point,
  ResizeHandle,
} from "../types/canvas-types";

export function useInteractionState() {
  const [currentMode, setCurrentMode] = useState<InteractionMode>("none");

  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    componentId: null,
  });

  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    componentId: null,
    handle: null,
    startPoint: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });

  const [selectionState, setSelectionState] = useState<SelectionState>({
    isSelecting: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    selectedIds: [],
  });

  const startDrag = useCallback((componentId: string, dragOffset: Point) => {
    setCurrentMode("drag");
    setDragState({
      isDragging: true,
      dragOffset,
      componentId,
    });
  }, []);

  const updateDrag = useCallback(
    (newPosition: Point) => {
      if (!dragState.isDragging) return;

      setDragState((prev) => ({
        ...prev,
        dragOffset: newPosition,
      }));
    },
    [dragState.isDragging]
  );

  const endDrag = useCallback(() => {
    setCurrentMode("none");
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      componentId: null,
    });
  }, []);

  const startResize = useCallback(
    (
      componentId: string,
      handle: ResizeHandle,
      startPoint: Point,
      startSize: { width: number; height: number }
    ) => {
      setCurrentMode("resize");
      setResizeState({
        isResizing: true,
        componentId,
        handle: handle.position,
        startPoint,
        startSize,
      });
    },
    []
  );

  const updateResize = useCallback(
    (currentPoint: Point) => {
      if (!resizeState.isResizing) return;

      setResizeState((prev) => ({
        ...prev,
        currentPoint,
      }));
    },
    [resizeState.isResizing]
  );

  const endResize = useCallback(() => {
    setCurrentMode("none");
    setResizeState({
      isResizing: false,
      componentId: null,
      handle: null,
      startPoint: { x: 0, y: 0 },
      startSize: { width: 0, height: 0 },
    });
  }, []);

  const startSelection = useCallback((startPoint: Point) => {
    setCurrentMode("select");
    setSelectionState({
      isSelecting: true,
      startPoint,
      currentPoint: startPoint,
      selectedIds: [],
    });
  }, []);

  const updateSelection = useCallback(
    (currentPoint: Point) => {
      if (!selectionState.isSelecting) return;

      setSelectionState((prev) => ({
        ...prev,
        currentPoint,
      }));
    },
    [selectionState.isSelecting]
  );

  const endSelection = useCallback((selectedIds: string[] = []) => {
    setCurrentMode("none");
    setSelectionState((prev) => ({
      ...prev,
      isSelecting: false,
      selectedIds,
    }));
  }, []);

  const resetAllStates = useCallback(() => {
    setCurrentMode("none");
    endDrag();
    endResize();
    endSelection();
  }, [endDrag, endResize, endSelection]);

  const isInteracting = currentMode !== "none";

  return {
    currentMode,
    dragState,
    resizeState,
    selectionState,
    isInteracting,

    startDrag,
    updateDrag,
    endDrag,

    startResize,
    updateResize,
    endResize,

    startSelection,
    updateSelection,
    endSelection,

    resetAllStates,
  };
}
