import { useCallback, useEffect } from "react";
import type { Point, ZoomState } from "../types/canvas-types";

interface UseWheelInteractionsProps {
  zoomState: ZoomState;
  setZoomScale: (scale: number) => void;
  setCanvasOffset: (offset: Point | ((prev: Point) => Point)) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  startPan: (point: Point) => void;
  updatePan: (point: Point) => void;
  resetPanState: () => void;
  isSelectionMode: boolean;
}

export function useWheelInteractions({
  zoomState,
  setZoomScale,
  setCanvasOffset,
  canvasRef,
  startPan,
  updatePan,
  resetPanState,
  isSelectionMode,
}: UseWheelInteractionsProps) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      // Zoom with Ctrl/Cmd + wheel (existing behavior)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let zoomFactor = 1;
        if (e.deltaMode === WheelEvent.DOM_DELTA_PIXEL) {
          zoomFactor = 1 + e.deltaY * -0.01;
        } else if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
          zoomFactor = 1 + e.deltaY * -0.1;
        } else {
          zoomFactor = 1 + e.deltaY * -0.5;
        }

        zoomFactor = Math.max(0.1, Math.min(zoomFactor, 3));

        const newScale = Math.max(
          zoomState.minScale,
          Math.min(zoomState.scale * zoomFactor, zoomState.maxScale)
        );

        const scaleChange = newScale / zoomState.scale;

        setCanvasOffset((prevOffset) => ({
          x: mouseX - (mouseX - prevOffset.x) * scaleChange,
          y: mouseY - (mouseY - prevOffset.y) * scaleChange,
        }));

        setZoomScale(newScale);
      }
      // Pan with 2-finger drag on trackpad (no Ctrl/Cmd modifier)
      // This works in both selection mode and panning mode
      else if (Math.abs(e.deltaX) > 0 || Math.abs(e.deltaY) > 0) {
        e.preventDefault();

        // Apply panning offset directly to canvas
        const panDeltaX = -e.deltaX * 1.0; // Negative for natural scrolling direction
        const panDeltaY = -e.deltaY * 1.0;

        setCanvasOffset((prev) => ({
          x: prev.x + panDeltaX,
          y: prev.y + panDeltaY,
        }));
      }
    },
    [zoomState, setZoomScale, setCanvasOffset, canvasRef, setCanvasOffset]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      return () => canvas.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel, canvasRef]);

  return {
    handleWheel,
  };
}
