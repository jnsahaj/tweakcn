"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface ComponentsSidebarProps {
  onDragStart: (e: React.DragEvent, componentType: "button" | "input" | "card") => void;
}

// Shared component factory to ensure preview and canvas components are identical
const createComponent = (
  type: "button" | "input" | "card",
  props?: Record<string, any>,
  size?: { width?: number; height?: number }
) => {
  const style = size ? { width: size.width, height: size.height } : {};

  switch (type) {
    case "button":
      return (
        <Button style={style} {...props}>
          {props?.children || "Button"}
        </Button>
      );
    case "input":
      return <Input style={style} placeholder="Enter text..." {...props} />;
    case "card":
      return (
        <Card className="h-full w-full" style={style} {...props}>
          <div className="flex h-full flex-col p-4">
            <h3 className="font-semibold">{props?.title || "Card Title"}</h3>
            <p className="text-muted-foreground mt-2 flex-1 text-sm">
              {props?.content || "This is a card component with some content."}
            </p>
          </div>
        </Card>
      );
    default:
      return null;
  }
};

export function ComponentsSidebar({ onDragStart }: ComponentsSidebarProps) {
  const components = [
    { type: "button" as const, label: "Button" },
    { type: "input" as const, label: "Input" },
    { type: "card" as const, label: "Card" },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: "button" | "input" | "card") => {
    // Find the corresponding preview element and use it as drag image
    const previewElement = document.getElementById(`preview-${componentType}`);
    if (previewElement) {
      e.dataTransfer.setDragImage(previewElement, 50, 25);
    }

    // Call the original onDragStart
    onDragStart(e, componentType);
  };

  return (
    <>
      {/* Hidden drag preview components - using same factory as canvas */}
      <div className="pointer-events-none fixed -top-[1000px] -left-[1000px] z-50">
        <div id="preview-button">{createComponent("button")}</div>
        <div id="preview-input">{createComponent("input")}</div>
        <div id="preview-card">{createComponent("card")}</div>
      </div>

      <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2">
        <div className="bg-background/95 border-border w-48 rounded-lg border shadow-lg backdrop-blur-sm">
          <div className="p-3">
            <h3 className="text-foreground mb-3 text-sm font-semibold">Components</h3>

            <div className="space-y-1">
              {components.map((component) => (
                <div
                  key={component.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component.type)}
                  className="text-foreground bg-card hover:bg-accent hover:border-border cursor-grab rounded-md border border-transparent px-3 py-2 text-sm transition-all duration-150 select-none active:cursor-grabbing"
                >
                  {component.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Export the component factory for use in canvas
export { createComponent };
