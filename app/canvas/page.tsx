"use client";

import { ComponentsSidebar } from "./components/components-sidebar";
import { PropertiesSidebar } from "./components/properties-sidebar";
import { CanvasComponentRenderer } from "./components/canvas-component";
import { CanvasGrid } from "./components/canvas-grid";
import { CanvasInfo } from "./components/canvas-info";
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
    updateComponentProps,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
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
        <CanvasGrid canvasOffset={canvasOffset} />

        {/* Canvas Components */}
        {sortedComponents.map((component) => (
          <CanvasComponentRenderer
            key={component.id}
            component={component}
            isSelected={selectedComponentId === component.id}
            canvasOffset={canvasOffset}
            dragState={dragState}
            onMouseDown={handleComponentMouseDown}
            onResizeMouseDown={handleResizeMouseDown}
          />
        ))}

        {/* Canvas Info */}
        <CanvasInfo componentCount={components.length} />
      </div>
    </div>
  );
}
