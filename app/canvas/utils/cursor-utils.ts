export function getCanvasCursor(isSelectionMode: boolean, currentInteractionMode: string): string {
  // Handle active interaction modes first
  switch (currentInteractionMode) {
    case "pan":
      return "cursor-grabbing";
    case "drag":
      return "cursor-default";
    case "groupDrag":
      return "cursor-move";
    case "select":
      return "cursor-crosshair";
    case "resize":
      return "cursor-default";
    default:
      // Handle default cursors based on mode
      if (isSelectionMode) {
        return "cursor-crosshair";
      } else {
        return "cursor-grab";
      }
  }
}
