import { useState, useCallback } from "react";
import type {
  CanvasComponent,
  DragState,
  ResizeState,
  CanvasOffset,
  PanState,
  ZoomState,
} from "../types/canvas-types";

export function useCanvasState() {
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    componentId: null,
  });
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    componentId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
  });
  const [canvasOffset, setCanvasOffset] = useState<CanvasOffset>({ x: 0, y: 0 });
  const [panState, setPanState] = useState<PanState>({
    isPanning: false,
    panStart: { x: 0, y: 0 },
  });
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
  });

  const addComponent = useCallback((component: CanvasComponent) => {
    setComponents((prev) => {
      const maxZIndex = Math.max(...prev.map((c) => c.zIndex || 0), 0);
      const componentWithZIndex = { ...component, zIndex: maxZIndex + 1 };
      return [...prev, componentWithZIndex];
    });
    setSelectedComponentId(component.id);
  }, []);

  const updateComponent = useCallback((componentId: string, updates: Partial<CanvasComponent>) => {
    setComponents((prev) =>
      prev.map((comp) => (comp.id === componentId ? { ...comp, ...updates } : comp))
    );
  }, []);

  const updateComponentProps = useCallback((componentId: string, newProps: Record<string, any>) => {
    setComponents((prev) =>
      prev.map((comp) =>
        comp.id === componentId ? { ...comp, props: { ...comp.props, ...newProps } } : comp
      )
    );
  }, []);

  const resetDragState = useCallback(() => {
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      componentId: null,
    });
  }, []);

  const resetResizeState = useCallback(() => {
    setResizeState({
      isResizing: false,
      componentId: null,
      handle: null,
      startX: 0,
      startY: 0,
      startWidth: 0,
      startHeight: 0,
    });
  }, []);

  const resetPanState = useCallback(() => {
    setPanState({
      isPanning: false,
      panStart: { x: 0, y: 0 },
    });
  }, []);

  // Zoom management functions
  const zoomIn = useCallback(
    (origin?: { x: number; y: number }) => {
      setZoomState((prev) => {
        const newScale = Math.min(prev.scale * 1.2, prev.maxScale);

        if (origin) {
          const scaleChange = newScale / prev.scale;
          setCanvasOffset((prevOffset) => ({
            x: origin.x - (origin.x - prevOffset.x) * scaleChange,
            y: origin.y - (origin.y - prevOffset.y) * scaleChange,
          }));
        }

        return {
          ...prev,
          scale: newScale,
        };
      });
    },
    [setCanvasOffset]
  );

  const zoomOut = useCallback(
    (origin?: { x: number; y: number }) => {
      setZoomState((prev) => {
        const newScale = Math.max(prev.scale / 1.2, prev.minScale);

        if (origin) {
          const scaleChange = newScale / prev.scale;
          setCanvasOffset((prevOffset) => ({
            x: origin.x - (origin.x - prevOffset.x) * scaleChange,
            y: origin.y - (origin.y - prevOffset.y) * scaleChange,
          }));
        }

        return {
          ...prev,
          scale: newScale,
        };
      });
    },
    [setCanvasOffset]
  );

  const resetZoom = useCallback(
    (origin?: { x: number; y: number }) => {
      setZoomState((prev) => {
        const newScale = 1;

        if (origin) {
          const scaleChange = newScale / prev.scale;
          setCanvasOffset((prevOffset) => ({
            x: origin.x - (origin.x - prevOffset.x) * scaleChange,
            y: origin.y - (origin.y - prevOffset.y) * scaleChange,
          }));
        }

        return {
          ...prev,
          scale: newScale,
        };
      });
    },
    [setCanvasOffset]
  );

  const setZoomScale = useCallback((scale: number) => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.max(prev.minScale, Math.min(scale, prev.maxScale)),
    }));
  }, []);

  // Layer management functions
  const bringToFront = useCallback((componentId: string) => {
    setComponents((prev) => {
      const component = prev.find((c) => c.id === componentId);
      if (!component) return prev;

      const maxZIndex = Math.max(...prev.map((c) => c.zIndex || 0));

      return prev.map((comp) =>
        comp.id === componentId ? { ...comp, zIndex: maxZIndex + 1 } : comp
      );
    });
  }, []);

  const sendToBack = useCallback((componentId: string) => {
    setComponents((prev) => {
      const component = prev.find((c) => c.id === componentId);
      if (!component) return prev;

      // Normalize all z-indexes to start from 1, then set this component to 0
      const sortedComponents = [...prev]
        .filter((c) => c.id !== componentId)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      return prev.map((comp) => {
        if (comp.id === componentId) {
          return { ...comp, zIndex: 0 };
        }
        const index = sortedComponents.findIndex((c) => c.id === comp.id);
        return { ...comp, zIndex: index + 1 };
      });
    });
  }, []);

  const bringForward = useCallback((componentId: string) => {
    setComponents((prev) => {
      const component = prev.find((c) => c.id === componentId);
      if (!component) return prev;

      const currentZIndex = component.zIndex || 0;

      // Find the component directly above this one
      const componentsAbove = prev
        .filter((c) => (c.zIndex || 0) > currentZIndex)
        .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

      if (componentsAbove.length === 0) return prev; // Already at the top

      const nextComponent = componentsAbove[0];
      const nextZIndex = nextComponent.zIndex || 0;

      // Swap z-indexes
      return prev.map((comp) => {
        if (comp.id === componentId) {
          return { ...comp, zIndex: nextZIndex };
        }
        if (comp.id === nextComponent.id) {
          return { ...comp, zIndex: currentZIndex };
        }
        return comp;
      });
    });
  }, []);

  const sendBackward = useCallback((componentId: string) => {
    setComponents((prev) => {
      const component = prev.find((c) => c.id === componentId);
      if (!component) return prev;

      const currentZIndex = component.zIndex || 0;

      // Find the component directly below this one
      const componentsBelow = prev
        .filter((c) => (c.zIndex || 0) < currentZIndex)
        .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

      if (componentsBelow.length === 0) return prev; // Already at the bottom

      const nextComponent = componentsBelow[0];
      const nextZIndex = nextComponent.zIndex || 0;

      // Swap z-indexes
      return prev.map((comp) => {
        if (comp.id === componentId) {
          return { ...comp, zIndex: nextZIndex };
        }
        if (comp.id === nextComponent.id) {
          return { ...comp, zIndex: currentZIndex };
        }
        return comp;
      });
    });
  }, []);

  const duplicateComponent = useCallback(
    (componentId: string) => {
      const component = components.find((c) => c.id === componentId);
      if (!component) return;

      // Generate a new unique ID
      const newId = `${component.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Calculate offset for the copy (20px down and right)
      const offset = 20;

      // Get the highest z-index to place the copy on top
      const maxZIndex = Math.max(...components.map((c) => c.zIndex || 0), 0);

      // Create the copied component
      const copiedComponent: CanvasComponent = {
        ...component,
        id: newId,
        x: component.x + offset,
        y: component.y + offset,
        zIndex: maxZIndex + 1,
        // Deep clone props if they exist
        props: component.props ? JSON.parse(JSON.stringify(component.props)) : undefined,
      };

      // Add the component first
      setComponents((prev) => [...prev, copiedComponent]);

      // Then select the newly copied component
      setSelectedComponentId(newId);
    },
    [components]
  );

  const selectedComponent = selectedComponentId
    ? components.find((c) => c.id === selectedComponentId)
    : null;

  return {
    // State
    components,
    selectedComponentId,
    selectedComponent,
    dragState,
    resizeState,
    canvasOffset,
    panState,
    zoomState,

    // Setters
    setComponents,
    setSelectedComponentId,
    setDragState,
    setResizeState,
    setCanvasOffset,
    setPanState,
    setZoomState,

    // Actions
    addComponent,
    updateComponent,
    updateComponentProps,
    resetDragState,
    resetResizeState,
    resetPanState,

    // Zoom actions
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomScale,

    // Layer management
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    duplicateComponent,
  };
}
