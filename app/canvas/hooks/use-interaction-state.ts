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
  const [isSelectionMode, setIsSelectionMode] = useState(false);

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

  // Group drag state for moving multiple selected components
  const [groupDragState, setGroupDragState] = useState({
    isDragging: false,
    startPoint: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
  });

  const toggleSelectionMode = useCallback(() => {
    setIsSelectionMode((prev) => !prev);
    if (currentMode !== "none") {
      resetAllStates();
    }
  }, [currentMode]);

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

  const startGroupDrag = useCallback((startPoint: Point) => {
    setCurrentMode("groupDrag");
    setGroupDragState({
      isDragging: true,
      startPoint,
      dragOffset: { x: 0, y: 0 },
    });
  }, []);

  const updateGroupDrag = useCallback(
    (currentPoint: Point) => {
      if (!groupDragState.isDragging) return;

      const dragOffset = {
        x: currentPoint.x - groupDragState.startPoint.x,
        y: currentPoint.y - groupDragState.startPoint.y,
      };

      setGroupDragState((prev) => ({
        ...prev,
        dragOffset,
      }));
    },
    [groupDragState.isDragging, groupDragState.startPoint]
  );

  const endGroupDrag = useCallback(() => {
    setCurrentMode("none");
    setGroupDragState({
      isDragging: false,
      startPoint: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 },
    });
  }, []);

  const resetAllStates = useCallback(() => {
    setCurrentMode("none");
    endDrag();
    endResize();
    endSelection();
    endGroupDrag();
  }, [endDrag, endResize, endSelection, endGroupDrag]);

  const isInteracting = currentMode !== "none";

  return {
    currentMode,
    isSelectionMode,
    dragState,
    resizeState,
    selectionState,
    groupDragState,
    isInteracting,

    toggleSelectionMode,

    startDrag,
    updateDrag,
    endDrag,

    startResize,
    updateResize,
    endResize,

    startSelection,
    updateSelection,
    endSelection,

    startGroupDrag,
    updateGroupDrag,
    endGroupDrag,

    resetAllStates,
  };
}
