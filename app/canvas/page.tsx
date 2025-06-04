"use client";

import { ComponentsSidebar } from "./components/components-sidebar";
import { PropertiesSidebar } from "./components/properties-sidebar";
import { CanvasComponentRenderer } from "./components/canvas-component";
import { CanvasGrid } from "./components/canvas-grid";
import { CanvasInfo } from "./components/canvas-info";
import { ZoomControls } from "./components/zoom-controls";
import { useCanvasState } from "./hooks/use-canvas-state";
import { useCanvasInteractions } from "./hooks/use-canvas-interactions";

export default function CanvasPage() {
  const canvasState = useCanvasState();
  const {
    components,
    selectedComponentId,
    selectedComponent,
    dragState,
    resizeState,
    canvasOffset,
    panState,
    zoomState,
    updateComponentProps,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomScale,
  } = canvasState;

  const interactions = useCanvasInteractions(canvasState);
  const {
    canvasRef,
    handleSidebarDragStart,
    handleCanvasDrop,
    handleCanvasDragOver,
    handleComponentMouseDown,
    handleResizeMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleCanvasMouseDown,
  } = interactions;

  // Calculate viewport center relative to canvas
  const getCanvasCenter = () => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: rect.height / 2,
    };
  };

  // Sort components by zIndex for proper rendering order
  const sortedComponents = [...components].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  return (
    <div className="bg-background relative h-screen w-full overflow-hidden">
      {/* Floating Sidebar */}
      <ComponentsSidebar onDragStart={handleSidebarDragStart} />

      {/* Properties Sidebar */}
      {selectedComponent && (
        <PropertiesSidebar
          component={selectedComponent}
          onUpdateProps={(newProps: Record<string, any>) =>
            updateComponentProps(selectedComponent.id, newProps)
          }
          onBringToFront={bringToFront}
          onBringForward={bringForward}
          onSendBackward={sendBackward}
          onSendToBack={sendToBack}
        />
      )}

      {/* Zoom Controls */}
      <ZoomControls
        zoomState={zoomState}
        onZoomIn={() => zoomIn(getCanvasCenter())}
        onZoomOut={() => zoomOut(getCanvasCenter())}
        onResetZoom={() => resetZoom(getCanvasCenter())}
      />

      {/* Infinite Canvas */}
      <div
        ref={canvasRef}
        className={`relative h-full w-full ${
          panState.isPanning
            ? "cursor-grabbing"
            : dragState.isDragging
              ? "cursor-default"
              : "cursor-grab"
        }`}
        data-canvas-area
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          userSelect: panState.isPanning ? "none" : "auto",
        }}
      >
        {/* Grid Pattern */}
        <CanvasGrid canvasOffset={canvasOffset} zoomScale={zoomState.scale} />

        {/* Canvas Content with Zoom Transform */}
        <div
          style={{
            transform: `scale(${zoomState.scale}) translate(${canvasOffset.x / zoomState.scale}px, ${canvasOffset.y / zoomState.scale}px)`,
            transformOrigin: "0 0",
            width: `${100 / zoomState.scale}%`,
            height: `${100 / zoomState.scale}%`,
          }}
        >
          {/* Canvas Components */}
          {sortedComponents.map((component) => (
            <CanvasComponentRenderer
              key={component.id}
              component={component}
              isSelected={selectedComponentId === component.id}
              canvasOffset={{ x: 0, y: 0 }} // Offset is now handled by the transform
              dragState={dragState}
              onMouseDown={handleComponentMouseDown}
              onResizeMouseDown={handleResizeMouseDown}
            />
          ))}
        </div>

        {/* Canvas Info */}
        <CanvasInfo componentCount={components.length} zoomScale={zoomState.scale} />
      </div>
    </div>
  );
}
