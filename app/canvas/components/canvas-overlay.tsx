import type { CanvasComponent, Point, Rect } from "../types/canvas-types";
import { SelectionRectangle } from "./selection-rectangle";
import { GroupSelectionOutline } from "./group-selection-outline";
import { GroupDragPreview } from "./group-drag-preview";

interface CanvasOverlayProps {
  selectionState: {
    isSelecting: boolean;
    startPoint: Point;
    currentPoint: Point;
  };
  selectedComponents: CanvasComponent[];
  groupBoundingRect: Rect;
  currentInteractionMode: string;
  groupDragOffset: Point;
  zoomScale: number;
  canvasOffset: Point;
  isSelectionMode: boolean;
}

export function CanvasOverlay({
  selectionState,
  selectedComponents,
  groupBoundingRect,
  currentInteractionMode,
  groupDragOffset,
  zoomScale,
  canvasOffset,
  isSelectionMode,
}: CanvasOverlayProps) {
  const hasMultipleSelected = selectedComponents.length > 1;

  return (
    <>
      <SelectionRectangle
        startPoint={selectionState.startPoint}
        currentPoint={selectionState.currentPoint}
        isVisible={selectionState.isSelecting && isSelectionMode}
      />

      <GroupSelectionOutline
        boundingRect={groupBoundingRect}
        isVisible={hasMultipleSelected && currentInteractionMode !== "groupDrag" && isSelectionMode}
        zoomScale={zoomScale}
        canvasOffset={canvasOffset}
      />

      <GroupDragPreview
        selectedComponents={selectedComponents}
        isVisible={currentInteractionMode === "groupDrag" && isSelectionMode}
        dragOffset={groupDragOffset}
        zoomScale={zoomScale}
        canvasOffset={canvasOffset}
      />
    </>
  );
}
