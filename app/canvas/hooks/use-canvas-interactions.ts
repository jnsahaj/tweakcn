import { useCallback, useRef, useEffect } from "react";
import type { CanvasComponent, ComponentType } from "../types/canvas-types";
import { snapToGrid, snapSizeToGrid } from "../utils/grid-utils";
import { getDefaultSize, getDefaultProps } from "../utils/component-utils";

interface UseCanvasInteractionsProps {
  components: CanvasComponent[];
  dragState: any;
  resizeState: any;
  canvasOffset: { x: number; y: number };
  panState: any;
  zoomState: any;
  setDragState: (state: any) => void;
  setResizeState: (state: any) => void;
  setCanvasOffset: (offset: any) => void;
  setPanState: (state: any) => void;
  setZoomScale: (scale: number) => void;
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
  zoomState,
  setDragState,
  setResizeState,
  setCanvasOffset,
  setPanState,
  setZoomScale,
  setSelectedComponentId,
  addComponent,
  updateComponent,
  resetDragState,
  resetResizeState,
  resetPanState,
}: UseCanvasInteractionsProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Prevent text selection during drag operations
  useEffect(() => {
    const preventSelection = (e: Event) => {
      if (dragState.isDragging || resizeState.isResizing || panState.isPanning) {
        e.preventDefault();
        return false;
      }
    };

    const preventDragStart = (e: DragEvent) => {
      if (dragState.isDragging || resizeState.isResizing || panState.isPanning) {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners to prevent text selection during interactions
    document.addEventListener("selectstart", preventSelection);
    document.addEventListener("dragstart", preventDragStart);

    return () => {
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("dragstart", preventDragStart);
    };
  }, [dragState.isDragging, resizeState.isResizing, panState.isPanning]);

  // Handle mouse wheel events for zooming
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Use velocity-based zooming
        // Normalize deltaY and apply a scaling factor for smooth zooming
        let zoomFactor = 1;
        if (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
          // Pixel mode (most common on trackpads)
          zoomFactor = 1 + e.deltaY * -0.01; // Negative because deltaY is inverted
        } else if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
          // Line mode (mouse wheel)
          zoomFactor = 1 + e.deltaY * -0.1;
        } else {
          // Page mode (rare)
          zoomFactor = 1 + e.deltaY * -0.5;
        }

        // Clamp the zoom factor to prevent extreme jumps
        zoomFactor = Math.max(0.1, Math.min(zoomFactor, 3));

        const newScale = Math.max(
          zoomState.minScale,
          Math.min(zoomState.scale * zoomFactor, zoomState.maxScale)
        );

        // Calculate zoom origin adjustment
        const scaleChange = newScale / zoomState.scale;

        setCanvasOffset((prevOffset: any) => ({
          x: mouseX - (mouseX - prevOffset.x) * scaleChange,
          y: mouseY - (mouseY - prevOffset.y) * scaleChange,
        }));

        setZoomScale(newScale);
      }
    },
    [zoomState, setZoomScale, setCanvasOffset]
  );

  // Handle browser zoom detection
  useEffect(() => {
    const handleBrowserZoom = () => {
      const browserZoom = window.devicePixelRatio;
      // You can add logic here to adjust canvas scale based on browser zoom
      // For now, we'll just detect it and potentially warn users
      console.log("Browser zoom detected:", browserZoom);
    };

    window.addEventListener("resize", handleBrowserZoom);
    return () => window.removeEventListener("resize", handleBrowserZoom);
  }, []);

  // Handle keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let newScale = zoomState.scale;

        switch (e.key) {
          case "+":
          case "=":
            e.preventDefault();
            newScale = Math.min(zoomState.scale * 1.2, zoomState.maxScale);
            break;
          case "-":
            e.preventDefault();
            newScale = Math.max(zoomState.scale / 1.2, zoomState.minScale);
            break;
          case "0":
            e.preventDefault();
            newScale = 1;
            break;
          default:
            return;
        }

        // Calculate zoom origin adjustment for center-based zoom
        const scaleChange = newScale / zoomState.scale;

        setCanvasOffset((prevOffset: any) => ({
          x: centerX - (centerX - prevOffset.x) * scaleChange,
          y: centerY - (centerY - prevOffset.y) * scaleChange,
        }));

        setZoomScale(newScale);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomState, setZoomScale, setCanvasOffset]);

  // Add wheel event listener to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

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
        const rawX = (e.clientX - rect.left - canvasOffset.x) / zoomState.scale;
        const rawY = (e.clientY - rect.top - canvasOffset.y) / zoomState.scale;

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
    [canvasOffset, zoomState.scale, addComponent]
  );

  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleComponentMouseDown = useCallback(
    (e: React.MouseEvent, componentId: string) => {
      e.preventDefault(); // Prevent text selection
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
      e.preventDefault(); // Prevent text selection
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
      // Prevent text selection during mouse move
      if (resizeState.isResizing || dragState.isDragging || panState.isPanning) {
        e.preventDefault();
      }

      if (resizeState.isResizing && resizeState.componentId && resizeState.handle) {
        const deltaX = (e.clientX - resizeState.startX) / zoomState.scale;
        const deltaY = (e.clientY - resizeState.startY) / zoomState.scale;

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
        const rawX =
          (e.clientX - rect.left - dragState.dragOffset.x - canvasOffset.x) / zoomState.scale;
        const rawY =
          (e.clientY - rect.top - dragState.dragOffset.y - canvasOffset.y) / zoomState.scale;

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
    [
      dragState,
      resizeState,
      canvasOffset,
      panState,
      zoomState.scale,
      updateComponent,
      setCanvasOffset,
      setPanState,
    ]
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
        // Prevent text selection when starting pan operation
        e.preventDefault();

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
