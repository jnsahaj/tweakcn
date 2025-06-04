export function getCanvasCursor(isSelectionMode: boolean, currentInteractionMode: string): string {
  if (isSelectionMode && currentInteractionMode === "none") {
    return "cursor-crosshair";
  }

  switch (currentInteractionMode) {
    case "pan":
      return "cursor-grabbing";
    case "drag":
      return "cursor-default";
    case "groupDrag":
      return "cursor-move";
    case "select":
      return "cursor-crosshair";
    default:
      return "cursor-grab";
  }
}
