import type { ResizeHandle } from "../types/canvas-types";

export const RESIZE_HANDLES: ResizeHandle[] = [
  { position: "top-left", cursor: "nw-resize" },
  { position: "top-right", cursor: "ne-resize" },
  { position: "bottom-left", cursor: "sw-resize" },
  { position: "bottom-right", cursor: "se-resize" },
  { position: "top", cursor: "n-resize" },
  { position: "right", cursor: "e-resize" },
  { position: "bottom", cursor: "s-resize" },
  { position: "left", cursor: "w-resize" },
];

export function getHandlePositionClass(position: string): string {
  switch (position) {
    case "top-left":
      return "-top-1 -left-1";
    case "top-right":
      return "-top-1 -right-1";
    case "bottom-left":
      return "-bottom-1 -left-1";
    case "bottom-right":
      return "-bottom-1 -right-1";
    case "top":
      return "-top-1 left-1/2 -translate-x-1/2";
    case "right":
      return "top-1/2 -translate-y-1/2 -right-1";
    case "bottom":
      return "-bottom-1 left-1/2 -translate-x-1/2";
    case "left":
      return "top-1/2 -translate-y-1/2 -left-1";
    default:
      return "";
  }
}
