import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CanvasComponent,
  Point,
  DragState,
  ResizeState,
  SelectionState,
  PanState,
  ZoomState,
  InteractionMode,
  ResizeHandlePosition,
  ComponentProps,
} from "@/app/canvas/types/canvas-types";
import { GRID_SIZE } from "@/app/canvas/utils/grid-utils";

interface GroupDragState {
  isDragging: boolean;
  startPoint: Point;
  dragOffset: Point;
}

interface CanvasState {
  components: CanvasComponent[];
  selectedComponentIds: string[];
  canvasOffset: Point;
  zoomState: ZoomState;
  panState: PanState;
  dragState: DragState;
  resizeState: ResizeState;
  selectionState: SelectionState;
  groupDragState: GroupDragState;
  currentInteractionMode: InteractionMode;
  isSelectionMode: boolean;
}

interface CanvasActions {
  addComponent: (component: CanvasComponent) => void;
  updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => void;
  updateComponentProps: (componentId: string, newProps: ComponentProps) => void;
  deleteComponent: (componentId: string) => void;
  duplicateComponent: (componentId: string) => void;

  selectComponent: (componentId: string) => void;
  selectMultipleComponents: (componentIds: string[]) => void;
  toggleComponentSelection: (componentId: string) => void;
  addComponentToSelection: (componentId: string) => void;
  clearSelection: () => void;
  deleteSelectedComponents: () => void;
  duplicateSelectedComponents: () => void;

  bringToFront: (componentId: string) => void;
  sendToBack: (componentId: string) => void;
  bringForward: (componentId: string) => void;
  sendBackward: (componentId: string) => void;

  setCanvasOffset: (offset: Point | ((prev: Point) => Point)) => void;
  setZoomState: (zoomState: ZoomState) => void;
  setZoomScale: (scale: number) => void;
  zoomIn: (origin?: Point) => void;
  zoomOut: (origin?: Point) => void;
  resetZoom: (origin?: Point) => void;

  setPanState: (panState: PanState) => void;
  startPan: (panStart: Point) => void;
  updatePan: (currentPoint: Point) => void;
  resetPanState: () => void;

  setDragState: (dragState: DragState) => void;
  startDrag: (componentId: string, dragOffset: Point) => void;
  updateDrag: (newPosition: Point) => void;
  resetDragState: () => void;

  setResizeState: (resizeState: ResizeState) => void;
  startResize: (
    componentId: string,
    handle: ResizeHandlePosition,
    startPoint: Point,
    startSize: { width: number; height: number },
    startPosition: Point
  ) => void;
  updateResize: (currentPoint: Point) => void;
  resetResizeState: () => void;

  setSelectionState: (selectionState: SelectionState) => void;
  startSelection: (startPoint: Point) => void;
  updateSelection: (currentPoint: Point) => void;
  endSelection: (selectedIds?: string[]) => void;

  setGroupDragState: (groupDragState: GroupDragState) => void;
  startGroupDrag: (startPoint: Point) => void;
  updateGroupDrag: (currentPoint: Point) => void;
  endGroupDrag: () => void;

  setCurrentInteractionMode: (mode: InteractionMode) => void;
  toggleSelectionMode: () => void;
  resetAllStates: () => void;
}

interface CanvasStore extends CanvasState, CanvasActions {
  getSelectedComponents: () => CanvasComponent[];
  isInteracting: () => boolean;
}

const initialState: CanvasState = {
  components: [],
  selectedComponentIds: [],
  canvasOffset: { x: 0, y: 0 },
  zoomState: {
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
  },
  panState: {
    isPanning: false,
    panStart: { x: 0, y: 0 },
  },
  dragState: {
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    componentId: null,
  },
  resizeState: {
    isResizing: false,
    componentId: null,
    handle: null,
    startPoint: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
    startPosition: { x: 0, y: 0 },
  },
  selectionState: {
    isSelecting: false,
    startPoint: { x: 0, y: 0 },
    currentPoint: { x: 0, y: 0 },
    selectedIds: [],
  },
  groupDragState: {
    isDragging: false,
    startPoint: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 },
  },
  currentInteractionMode: "none",
  isSelectionMode: false,
};

export const useCanvasStore = create<CanvasStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      getSelectedComponents: () => {
        const { components, selectedComponentIds } = get();
        return components.filter((c) => selectedComponentIds.includes(c.id));
      },

      isInteracting: () => {
        const { currentInteractionMode } = get();
        return currentInteractionMode !== "none";
      },

      addComponent: (component: CanvasComponent) => {
        set((state) => {
          const maxZIndex = Math.max(...state.components.map((c) => c.zIndex || 0), 0);
          const componentWithZIndex = { ...component, zIndex: maxZIndex + 1 };
          return {
            components: [...state.components, componentWithZIndex],
            selectedComponentIds: [component.id],
          };
        });
      },

      updateComponent: (componentId: string, updates: Partial<CanvasComponent>) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId ? { ...comp, ...updates } : comp
          ),
        }));
      },

      updateComponentProps: (componentId: string, newProps: ComponentProps) => {
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
          ),
        }));
      },

      deleteComponent: (componentId: string) => {
        set((state) => ({
          components: state.components.filter((c) => c.id !== componentId),
          selectedComponentIds: state.selectedComponentIds.filter((id) => id !== componentId),
        }));
      },

      duplicateComponent: (componentId: string) => {
        const { components } = get();
        const component = components.find((c) => c.id === componentId);
        if (!component) return;

        const newId = `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const offset = GRID_SIZE * 2;
        const maxZIndex = Math.max(...components.map((c) => c.zIndex || 0), 0);

        const copiedComponent: CanvasComponent = {
          ...component,
          id: newId,
          x: component.x + offset,
          y: component.y + offset,
          zIndex: maxZIndex + 1,
          props: component.props ? JSON.parse(JSON.stringify(component.props)) : undefined,
        };

        set((state) => ({
          components: [...state.components, copiedComponent],
          selectedComponentIds: [newId],
        }));
      },

      selectComponent: (componentId: string) => {
        set({ selectedComponentIds: [componentId] });
      },

      selectMultipleComponents: (componentIds: string[]) => {
        set({ selectedComponentIds: componentIds });
      },

      toggleComponentSelection: (componentId: string) => {
        set((state) => ({
          selectedComponentIds: state.selectedComponentIds.includes(componentId)
            ? state.selectedComponentIds.filter((id) => id !== componentId)
            : [...state.selectedComponentIds, componentId],
        }));
      },

      addComponentToSelection: (componentId: string) => {
        set((state) => ({
          selectedComponentIds: state.selectedComponentIds.includes(componentId)
            ? state.selectedComponentIds
            : [...state.selectedComponentIds, componentId],
        }));
      },

      clearSelection: () => {
        set({ selectedComponentIds: [] });
      },

      deleteSelectedComponents: () => {
        set((state) => ({
          components: state.components.filter((c) => !state.selectedComponentIds.includes(c.id)),
          selectedComponentIds: [],
        }));
      },

      duplicateSelectedComponents: () => {
        const { components, selectedComponentIds } = get();
        const selectedComponents = components.filter((c) => selectedComponentIds.includes(c.id));
        if (selectedComponents.length === 0) return;

        const offset = GRID_SIZE * 2;
        const maxZIndex = Math.max(...components.map((c) => c.zIndex || 0), 0);
        const newComponents: CanvasComponent[] = [];
        const newSelectedIds: string[] = [];

        selectedComponents.forEach((component, index) => {
          const newId = `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const copiedComponent: CanvasComponent = {
            ...component,
            id: newId,
            x: component.x + offset,
            y: component.y + offset,
            zIndex: maxZIndex + 1 + index,
            props: component.props ? JSON.parse(JSON.stringify(component.props)) : undefined,
          };
          newComponents.push(copiedComponent);
          newSelectedIds.push(newId);
        });

        set((state) => ({
          components: [...state.components, ...newComponents],
          selectedComponentIds: newSelectedIds,
        }));
      },

      bringToFront: (componentId: string) => {
        const { components } = get();
        const maxZIndex = Math.max(...components.map((c) => c.zIndex || 0));
        get().updateComponent(componentId, { zIndex: maxZIndex + 1 });
      },

      sendToBack: (componentId: string) => {
        const { components } = get();
        const sortedComponents = components
          .filter((c) => c.id !== componentId)
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        get().updateComponent(componentId, { zIndex: 0 });
        sortedComponents.forEach((comp, index) => {
          get().updateComponent(comp.id, { zIndex: index + 1 });
        });
      },

      bringForward: (componentId: string) => {
        const { components } = get();
        const component = components.find((c) => c.id === componentId);
        if (!component) return;

        const componentsAbove = components
          .filter((c) => (c.zIndex || 0) > (component.zIndex || 0))
          .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

        if (componentsAbove.length === 0) return;

        const nextComponent = componentsAbove[0];
        get().updateComponent(componentId, { zIndex: nextComponent.zIndex });
        get().updateComponent(nextComponent.id, { zIndex: component.zIndex });
      },

      sendBackward: (componentId: string) => {
        const { components } = get();
        const component = components.find((c) => c.id === componentId);
        if (!component) return;

        const componentsBelow = components
          .filter((c) => (c.zIndex || 0) < (component.zIndex || 0))
          .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

        if (componentsBelow.length === 0) return;

        const nextComponent = componentsBelow[0];
        get().updateComponent(componentId, { zIndex: nextComponent.zIndex });
        get().updateComponent(nextComponent.id, { zIndex: component.zIndex });
      },

      setCanvasOffset: (offset: Point | ((prev: Point) => Point)) => {
        set((state) => ({
          canvasOffset: typeof offset === "function" ? offset(state.canvasOffset) : offset,
        }));
      },

      setZoomState: (zoomState: ZoomState) => {
        set({ zoomState });
      },

      setZoomScale: (scale: number) => {
        set((state) => ({
          zoomState: {
            ...state.zoomState,
            scale: Math.max(state.zoomState.minScale, Math.min(scale, state.zoomState.maxScale)),
          },
        }));
      },

      zoomIn: (origin?: Point) => {
        set((state) => {
          const newScale = Math.min(state.zoomState.scale * 1.2, state.zoomState.maxScale);

          let newOffset = state.canvasOffset;
          if (origin) {
            const scaleChange = newScale / state.zoomState.scale;
            newOffset = {
              x: origin.x - (origin.x - state.canvasOffset.x) * scaleChange,
              y: origin.y - (origin.y - state.canvasOffset.y) * scaleChange,
            };
          }

          return {
            zoomState: { ...state.zoomState, scale: newScale },
            canvasOffset: newOffset,
          };
        });
      },

      zoomOut: (origin?: Point) => {
        set((state) => {
          const newScale = Math.max(state.zoomState.scale / 1.2, state.zoomState.minScale);

          let newOffset = state.canvasOffset;
          if (origin) {
            const scaleChange = newScale / state.zoomState.scale;
            newOffset = {
              x: origin.x - (origin.x - state.canvasOffset.x) * scaleChange,
              y: origin.y - (origin.y - state.canvasOffset.y) * scaleChange,
            };
          }

          return {
            zoomState: { ...state.zoomState, scale: newScale },
            canvasOffset: newOffset,
          };
        });
      },

      resetZoom: (origin?: Point) => {
        set((state) => {
          const newScale = 1;

          let newOffset = state.canvasOffset;
          if (origin) {
            const scaleChange = newScale / state.zoomState.scale;
            newOffset = {
              x: origin.x - (origin.x - state.canvasOffset.x) * scaleChange,
              y: origin.y - (origin.y - state.canvasOffset.y) * scaleChange,
            };
          }

          return {
            zoomState: { ...state.zoomState, scale: newScale },
            canvasOffset: newOffset,
          };
        });
      },

      setPanState: (panState: PanState) => {
        set({ panState });
      },

      startPan: (panStart: Point) => {
        set({ panState: { isPanning: true, panStart } });
      },

      updatePan: (currentPoint: Point) => {
        set((state) => {
          if (!state.panState.isPanning) return state;

          const deltaX = currentPoint.x - state.panState.panStart.x;
          const deltaY = currentPoint.y - state.panState.panStart.y;

          return {
            canvasOffset: {
              x: state.canvasOffset.x + deltaX,
              y: state.canvasOffset.y + deltaY,
            },
            panState: {
              ...state.panState,
              panStart: currentPoint,
            },
          };
        });
      },

      resetPanState: () => {
        set({ panState: { isPanning: false, panStart: { x: 0, y: 0 } } });
      },

      setDragState: (dragState: DragState) => {
        set({ dragState });
      },

      startDrag: (componentId: string, dragOffset: Point) => {
        set({
          currentInteractionMode: "drag",
          dragState: {
            isDragging: true,
            dragOffset,
            componentId,
          },
        });
      },

      updateDrag: (newPosition: Point) => {
        set((state) => {
          if (!state.dragState.isDragging) return state;
          return {
            dragState: {
              ...state.dragState,
              dragOffset: newPosition,
            },
          };
        });
      },

      resetDragState: () => {
        set({
          currentInteractionMode: "none",
          dragState: {
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            componentId: null,
          },
        });
      },

      setResizeState: (resizeState: ResizeState) => {
        set({ resizeState });
      },

      startResize: (
        componentId: string,
        handle: ResizeHandlePosition,
        startPoint: Point,
        startSize: { width: number; height: number },
        startPosition: Point
      ) => {
        set({
          currentInteractionMode: "resize",
          resizeState: {
            isResizing: true,
            componentId,
            handle,
            startPoint,
            startSize,
            startPosition,
          },
        });
      },

      updateResize: (currentPoint: Point) => {
        set((state) => {
          if (!state.resizeState.isResizing) return state;
          return {
            resizeState: {
              ...state.resizeState,
              currentPoint,
            },
          };
        });
      },

      resetResizeState: () => {
        set({
          currentInteractionMode: "none",
          resizeState: {
            isResizing: false,
            componentId: null,
            handle: null,
            startPoint: { x: 0, y: 0 },
            startSize: { width: 0, height: 0 },
            startPosition: { x: 0, y: 0 },
          },
        });
      },

      setSelectionState: (selectionState: SelectionState) => {
        set({ selectionState });
      },

      startSelection: (startPoint: Point) => {
        set({
          currentInteractionMode: "select",
          selectionState: {
            isSelecting: true,
            startPoint,
            currentPoint: startPoint,
            selectedIds: [],
          },
        });
      },

      updateSelection: (currentPoint: Point) => {
        set((state) => {
          if (!state.selectionState.isSelecting) return state;
          return {
            selectionState: {
              ...state.selectionState,
              currentPoint,
            },
          };
        });
      },

      endSelection: (selectedIds: string[] = []) => {
        set((state) => ({
          currentInteractionMode: "none",
          selectionState: {
            ...state.selectionState,
            isSelecting: false,
            selectedIds,
          },
        }));
      },

      setGroupDragState: (groupDragState: GroupDragState) => {
        set({ groupDragState });
      },

      startGroupDrag: (startPoint: Point) => {
        set({
          currentInteractionMode: "groupDrag",
          groupDragState: {
            isDragging: true,
            startPoint,
            dragOffset: { x: 0, y: 0 },
          },
        });
      },

      updateGroupDrag: (currentPoint: Point) => {
        set((state) => {
          if (!state.groupDragState.isDragging) return state;

          const dragOffset = {
            x: currentPoint.x - state.groupDragState.startPoint.x,
            y: currentPoint.y - state.groupDragState.startPoint.y,
          };

          return {
            groupDragState: {
              ...state.groupDragState,
              dragOffset,
            },
          };
        });
      },

      endGroupDrag: () => {
        set({
          currentInteractionMode: "none",
          groupDragState: {
            isDragging: false,
            startPoint: { x: 0, y: 0 },
            dragOffset: { x: 0, y: 0 },
          },
        });
      },

      setCurrentInteractionMode: (mode: InteractionMode) => {
        set({ currentInteractionMode: mode });
      },

      toggleSelectionMode: () => {
        set((state) => {
          const newSelectionMode = !state.isSelectionMode;
          return {
            isSelectionMode: newSelectionMode,
            selectedComponentIds: newSelectionMode ? state.selectedComponentIds : [],
            currentInteractionMode: "none",
          };
        });
      },

      resetAllStates: () => {
        set({
          currentInteractionMode: "none",
          dragState: {
            isDragging: false,
            dragOffset: { x: 0, y: 0 },
            componentId: null,
          },
          resizeState: {
            isResizing: false,
            componentId: null,
            handle: null,
            startPoint: { x: 0, y: 0 },
            startSize: { width: 0, height: 0 },
            startPosition: { x: 0, y: 0 },
          },
          selectionState: {
            isSelecting: false,
            startPoint: { x: 0, y: 0 },
            currentPoint: { x: 0, y: 0 },
            selectedIds: [],
          },
          groupDragState: {
            isDragging: false,
            startPoint: { x: 0, y: 0 },
            dragOffset: { x: 0, y: 0 },
          },
          panState: {
            isPanning: false,
            panStart: { x: 0, y: 0 },
          },
        });
      },
    }),
    {
      name: "canvas-store",
      partialize: (state) => ({
        components: state.components,
        selectedComponentIds: state.selectedComponentIds,
        canvasOffset: state.canvasOffset,
        zoomState: state.zoomState,
        isSelectionMode: state.isSelectionMode,
      }),
    }
  )
);
