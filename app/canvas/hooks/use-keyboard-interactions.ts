import { useEffect, useCallback } from "react";
import type { Point } from "../types/canvas-types";

interface UseKeyboardInteractionsProps {
  zoomIn: (origin?: Point) => void;
  zoomOut: (origin?: Point) => void;
  resetZoom: (origin?: Point) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export function useKeyboardInteractions({
  zoomIn,
  zoomOut,
  resetZoom,
  canvasRef,
}: UseKeyboardInteractionsProps) {
  const getCanvasCenter = useCallback((): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  }, [canvasRef]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const center = getCanvasCenter();

        switch (e.key) {
          case "+":
          case "=":
            e.preventDefault();
            zoomIn(center);
            break;
          case "-":
            e.preventDefault();
            zoomOut(center);
            break;
          case "0":
            e.preventDefault();
            resetZoom(center);
            break;
        }
      }
    },
    [zoomIn, zoomOut, resetZoom, getCanvasCenter]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return {
    handleKeyDown,
  };
}
