import { useState, useCallback } from "react";
import type { Point, PanState, ZoomState } from "../types/canvas-types";

export function useCanvasViewport() {
  const [canvasOffset, setCanvasOffset] = useState<Point>({ x: 0, y: 0 });
  const [panState, setPanState] = useState<PanState>({
    isPanning: false,
    panStart: { x: 0, y: 0 },
  });
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    minScale: 0.1,
    maxScale: 5,
  });

  const resetPanState = useCallback(() => {
    setPanState({
      isPanning: false,
      panStart: { x: 0, y: 0 },
    });
  }, []);

  const startPan = useCallback((point: Point) => {
    setPanState({
      isPanning: true,
      panStart: point,
    });
  }, []);

  const updatePan = useCallback(
    (currentPoint: Point) => {
      if (!panState.isPanning) return;

      const deltaX = currentPoint.x - panState.panStart.x;
      const deltaY = currentPoint.y - panState.panStart.y;

      setCanvasOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      setPanState((prev) => ({
        ...prev,
        panStart: currentPoint,
      }));
    },
    [panState]
  );

  const zoomIn = useCallback((origin?: Point) => {
    setZoomState((prev) => {
      const newScale = Math.min(prev.scale * 1.2, prev.maxScale);

      if (origin) {
        const scaleChange = newScale / prev.scale;
        setCanvasOffset((prevOffset) => ({
          x: origin.x - (origin.x - prevOffset.x) * scaleChange,
          y: origin.y - (origin.y - prevOffset.y) * scaleChange,
        }));
      }

      return { ...prev, scale: newScale };
    });
  }, []);

  const zoomOut = useCallback((origin?: Point) => {
    setZoomState((prev) => {
      const newScale = Math.max(prev.scale / 1.2, prev.minScale);

      if (origin) {
        const scaleChange = newScale / prev.scale;
        setCanvasOffset((prevOffset) => ({
          x: origin.x - (origin.x - prevOffset.x) * scaleChange,
          y: origin.y - (origin.y - prevOffset.y) * scaleChange,
        }));
      }

      return { ...prev, scale: newScale };
    });
  }, []);

  const resetZoom = useCallback((origin?: Point) => {
    setZoomState((prev) => {
      const newScale = 1;

      if (origin) {
        const scaleChange = newScale / prev.scale;
        setCanvasOffset((prevOffset) => ({
          x: origin.x - (origin.x - prevOffset.x) * scaleChange,
          y: origin.y - (origin.y - prevOffset.y) * scaleChange,
        }));
      }

      return { ...prev, scale: newScale };
    });
  }, []);

  const setZoomScale = useCallback((scale: number) => {
    setZoomState((prev) => ({
      ...prev,
      scale: Math.max(prev.minScale, Math.min(scale, prev.maxScale)),
    }));
  }, []);

  const zoomToFit = useCallback(
    (
      contentBounds: { width: number; height: number },
      containerSize: { width: number; height: number }
    ) => {
      const scaleX = containerSize.width / contentBounds.width;
      const scaleY = containerSize.height / contentBounds.height;
      const newScale = Math.min(scaleX, scaleY, zoomState.maxScale);

      setZoomScale(newScale);
      setCanvasOffset({
        x: (containerSize.width - contentBounds.width * newScale) / 2,
        y: (containerSize.height - contentBounds.height * newScale) / 2,
      });
    },
    [zoomState.maxScale, setZoomScale]
  );

  const screenToCanvas = useCallback(
    (screenPoint: Point): Point => {
      return {
        x: (screenPoint.x - canvasOffset.x) / zoomState.scale,
        y: (screenPoint.y - canvasOffset.y) / zoomState.scale,
      };
    },
    [canvasOffset, zoomState.scale]
  );

  const canvasToScreen = useCallback(
    (canvasPoint: Point): Point => {
      return {
        x: canvasPoint.x * zoomState.scale + canvasOffset.x,
        y: canvasPoint.y * zoomState.scale + canvasOffset.y,
      };
    },
    [canvasOffset, zoomState.scale]
  );

  return {
    canvasOffset,
    panState,
    zoomState,
    setCanvasOffset,
    setPanState,
    setZoomState,
    resetPanState,
    startPan,
    updatePan,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomScale,
    zoomToFit,
    screenToCanvas,
    canvasToScreen,
  };
}
