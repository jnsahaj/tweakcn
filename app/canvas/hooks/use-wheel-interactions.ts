import { useCallback, useEffect } from "react";
import type { Point, ZoomState } from "../types/canvas-types";

interface UseWheelInteractionsProps {
  zoomState: ZoomState;
  setZoomScale: (scale: number) => void;
  setCanvasOffset: (offset: Point | ((prev: Point) => Point)) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useWheelInteractions({
  zoomState,
  setZoomScale,
  setCanvasOffset,
  canvasRef,
}: UseWheelInteractionsProps) {
  const handleWheel = useCallback(
    (e: WheelEvent) => {
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
    },
    [zoomState, setZoomScale, setCanvasOffset, canvasRef]
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
