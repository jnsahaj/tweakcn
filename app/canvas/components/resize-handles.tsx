import { RESIZE_HANDLES, getHandlePositionClass } from "../utils/resize-utils";

interface ResizeHandlesProps {
  componentId: string;
  onResizeMouseDown: (e: React.MouseEvent, componentId: string, handle: string) => void;
}

export function ResizeHandles({ componentId, onResizeMouseDown }: ResizeHandlesProps) {
  return (
    <>
      {RESIZE_HANDLES.map((handle) => (
        <div
          key={handle.position}
          className={`absolute size-2 rounded-sm bg-blue-500 ${getHandlePositionClass(handle.position)}`}
          style={{ cursor: handle.cursor }}
          onMouseDown={(e) => onResizeMouseDown(e, componentId, handle.position)}
        />
      ))}
    </>
  );
}
