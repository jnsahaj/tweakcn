export interface CanvasComponent {
  id: string;
  type: "button" | "input" | "card" | "textarea" | "checkbox";
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  props?: Record<string, any>;
}

export interface DragState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  componentId: string | null;
}

export interface ResizeState {
  isResizing: boolean;
  componentId: string | null;
  handle: string | null;
  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;
}

export interface CanvasOffset {
  x: number;
  y: number;
}

export interface PanState {
  isPanning: boolean;
  panStart: { x: number; y: number };
}

export interface ZoomState {
  scale: number;
  minScale: number;
  maxScale: number;
}

export type ComponentType = "button" | "input" | "card" | "textarea" | "checkbox";

export interface ComponentSize {
  width: number;
  height: number;
}

export interface ResizeHandle {
  position: string;
  cursor: string;
}
