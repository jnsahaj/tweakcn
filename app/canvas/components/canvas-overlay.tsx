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
}

export function CanvasOverlay({
  selectionState,
  selectedComponents,
  groupBoundingRect,
  currentInteractionMode,
  groupDragOffset,
  zoomScale,
  canvasOffset,
}: CanvasOverlayProps) {
  const hasMultipleSelected = selectedComponents.length > 1;

  return (
    <>
      <SelectionRectangle
        startPoint={selectionState.startPoint}
        currentPoint={selectionState.currentPoint}
        isVisible={selectionState.isSelecting}
      />

      <GroupSelectionOutline
        boundingRect={groupBoundingRect}
        isVisible={hasMultipleSelected && currentInteractionMode !== "groupDrag"}
        zoomScale={zoomScale}
        canvasOffset={canvasOffset}
      />

      <GroupDragPreview
        selectedComponents={selectedComponents}
        isVisible={currentInteractionMode === "groupDrag"}
        dragOffset={groupDragOffset}
        zoomScale={zoomScale}
        canvasOffset={canvasOffset}
      />
    </>
  );
}
