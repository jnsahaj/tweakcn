"use client";

import { ComponentsSidebar } from "./components/components-sidebar";
import { PropertiesSidebar } from "./components/properties-sidebar";
import { CanvasComponentRenderer } from "./components/canvas-component";
import { CanvasGrid } from "./components/canvas-grid";
import { CanvasInfo } from "./components/canvas-info";
import { ZoomControls } from "./components/zoom-controls";
import { CanvasControls } from "./components/canvas-controls";
import { CanvasOverlay } from "./components/canvas-overlay";
import { useCanvas } from "./hooks/use-canvas";
import { getCanvasCursor } from "./utils/cursor-utils";

export default function CanvasPage() {
  const canvas = useCanvas();

  const getCanvasCenter = () => {
    if (!canvas.canvasRef.current) return { x: 0, y: 0 };
    const rect = canvas.canvasRef.current.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  };

  const selectedComponent = canvas.selectedComponents[0];
  const sortedComponents = [...canvas.components].sort((a, b) => a.zIndex - b.zIndex);
  const hasMultipleSelected = canvas.selectedComponentIds.length > 1;
  const groupBoundingRect = hasMultipleSelected
    ? canvas.utils.getBoundingRect(canvas.selectedComponents)
    : { x: 0, y: 0, width: 0, height: 0 };

  return (
    <div className="bg-background relative h-screen w-full overflow-hidden">
      <ComponentsSidebar onDragStart={canvas.eventHandlers.handleSidebarDragStart} />

      {selectedComponent && !hasMultipleSelected && (
        <PropertiesSidebar
          component={selectedComponent}
          onUpdateProps={(newProps: Record<string, any>) =>
            canvas.componentActions.updateComponentProps(selectedComponent.id, newProps)
          }
          onBringToFront={canvas.componentActions.bringToFront}
          onBringForward={canvas.componentActions.bringForward}
          onSendBackward={canvas.componentActions.sendBackward}
          onSendToBack={canvas.componentActions.sendToBack}
          onDuplicateComponent={canvas.componentActions.duplicateComponent}
          onDeleteComponent={canvas.componentActions.deleteComponent}
        />
      )}

      <CanvasControls
        isSelectionMode={canvas.isSelectionMode}
        selectedCount={canvas.selectedComponentIds.length}
        onToggleSelectionMode={canvas.modeActions.toggleSelectionMode}
      />

      <ZoomControls
        zoomState={canvas.zoomState}
        onZoomIn={() => canvas.viewportActions.zoomIn(getCanvasCenter())}
        onZoomOut={() => canvas.viewportActions.zoomOut(getCanvasCenter())}
        onResetZoom={() => canvas.viewportActions.resetZoom(getCanvasCenter())}
      />

      <div
        ref={canvas.canvasRef}
        className={`relative h-full w-full select-none ${getCanvasCursor(
          canvas.isSelectionMode,
          canvas.currentInteractionMode
        )}`}
        data-canvas-area
        onDrop={canvas.eventHandlers.handleCanvasDrop}
        onDragOver={canvas.eventHandlers.handleCanvasDragOver}
        onMouseDown={canvas.eventHandlers.handleCanvasMouseDown}
        onMouseMove={canvas.eventHandlers.handleMouseMove}
        onMouseUp={canvas.eventHandlers.handleMouseUp}
        onMouseLeave={canvas.eventHandlers.handleMouseUp}
        style={{
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          WebkitTouchCallout: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <CanvasGrid canvasOffset={canvas.canvasOffset} zoomScale={canvas.zoomState.scale} />

        <CanvasOverlay
          selectionState={canvas.selectionState}
          selectedComponents={canvas.selectedComponents}
          groupBoundingRect={groupBoundingRect}
          currentInteractionMode={canvas.currentInteractionMode}
          groupDragOffset={canvas.groupDragState.dragOffset}
          zoomScale={canvas.zoomState.scale}
          canvasOffset={canvas.canvasOffset}
        />

        <div
          style={{
            transform: `scale(${canvas.zoomState.scale}) translate(${canvas.canvasOffset.x / canvas.zoomState.scale}px, ${canvas.canvasOffset.y / canvas.zoomState.scale}px)`,
            transformOrigin: "0 0",
            width: `${100 / canvas.zoomState.scale}%`,
            height: `${100 / canvas.zoomState.scale}%`,
          }}
        >
          {sortedComponents.map((component) => (
            <CanvasComponentRenderer
              key={component.id}
              component={component}
              isSelected={canvas.selectedComponentIds.includes(component.id)}
              canvasOffset={{ x: 0, y: 0 }}
              dragState={{
                isDragging: canvas.currentInteractionMode === "drag",
                dragOffset: { x: 0, y: 0 },
                componentId: null,
              }}
              onMouseDown={canvas.eventHandlers.handleComponentMouseDown}
              onResizeMouseDown={canvas.eventHandlers.handleResizeMouseDown}
            />
          ))}
        </div>

        <CanvasInfo componentCount={canvas.components.length} zoomScale={canvas.zoomState.scale} />
      </div>
    </div>
  );
}
