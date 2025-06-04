export function getCanvasCursor(isSelectionMode: boolean, currentInteractionMode: string): string {
  // Handle active interaction modes
  switch (currentInteractionMode) {
    case "pan":
      return "cursor-grabbing";
    case "drag":
      return "cursor-move";
    case "groupDrag":
      return "cursor-move";
    case "select":
      return "cursor-default";
    case "resize":
      return "cursor-default";
    default:
      // Handle default cursors based on mode
      if (isSelectionMode) {
        return "cursor-default";
      } else {
        return "cursor-grab";
      }
  }
}
