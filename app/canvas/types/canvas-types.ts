export type ComponentType =
  | "button"
  | "input"
  | "card"
  | "textarea"
  | "checkbox"
  | "label"
  | "select"
  | "switch"
  | "badge"
  | "avatar"
  | "progress";

export interface CanvasComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  props?: ComponentProps;
}

// Component-specific props interface
export interface ComponentProps {
  [key: string]: string | number | boolean | undefined;
}

export interface Point {
  x: number;
  y: number;
}

// Alias for canvas offset (same as Point)
export type CanvasOffset = Point;

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DragState {
  isDragging: boolean;
  dragOffset: Point;
  componentId: string | null;
}

export type ResizeHandlePosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

export interface ResizeHandle {
  position: ResizeHandlePosition;
  cursor: string;
}

export interface ResizeState {
  isResizing: boolean;
  componentId: string | null;
  handle: ResizeHandlePosition | null;
  startPoint: Point;
  startSize: { width: number; height: number };
  startPosition: { x: number; y: number };
}

export interface PanState {
  isPanning: boolean;
  panStart: Point;
}

export interface ZoomState {
  scale: number;
  minScale: number;
  maxScale: number;
}

export interface SelectionState {
  isSelecting: boolean;
  startPoint: Point;
  currentPoint: Point;
  selectedIds: string[];
}

export type InteractionMode = "none" | "drag" | "resize" | "pan" | "select" | "groupDrag";

export interface ComponentSize {
  width: number;
  height: number;
}

export interface ResizeHandleData {
  position: ResizeHandle;
  cursor: string;
}

export interface MouseEventData {
  clientX: number;
  clientY: number;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface CanvasPosition {
  x: number;
  y: number;
}
