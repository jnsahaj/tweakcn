import { useEffect } from "react";

interface UseInteractionPreventionProps {
  isInteracting: boolean;
}

export function useInteractionPrevention({ isInteracting }: UseInteractionPreventionProps) {
  useEffect(() => {
    const preventSelection = (e: Event) => {
      if (isInteracting) {
        e.preventDefault();
        return false;
      }
    };

    const preventDragStart = (e: DragEvent) => {
      if (isInteracting) {
        e.preventDefault();
        return false;
      }
    };

    const preventContextMenu = (e: Event) => {
      if (isInteracting) {
        e.preventDefault();
        return false;
      }
    };

    if (isInteracting) {
      document.addEventListener("selectstart", preventSelection);
      document.addEventListener("dragstart", preventDragStart);
      document.addEventListener("contextmenu", preventContextMenu);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "default";
    }

    return () => {
      document.removeEventListener("selectstart", preventSelection);
      document.removeEventListener("dragstart", preventDragStart);
      document.removeEventListener("contextmenu", preventContextMenu);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isInteracting]);

  return null;
}
