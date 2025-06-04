import { RESIZE_HANDLES, getHandlePositionClass } from "../utils/resize-utils";
import type { ResizeHandle } from "../types/canvas-types";

interface ResizeHandlesProps {
  componentId: string;
  onResizeMouseDown: (e: React.MouseEvent, componentId: string, handle: ResizeHandle) => void;
}

export function ResizeHandles({ componentId, onResizeMouseDown }: ResizeHandlesProps) {
  return (
    <>
      {RESIZE_HANDLES.map((handle) => (
        <div
          key={handle.position}
          className={`absolute size-2 rounded-sm bg-blue-500 select-none ${getHandlePositionClass(handle.position)}`}
          style={{
            cursor: handle.cursor,
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
          }}
          onMouseDown={(e) => {
            e.preventDefault(); // Prevent text selection
            onResizeMouseDown(e, componentId, handle);
          }}
        />
      ))}
    </>
  );
}
