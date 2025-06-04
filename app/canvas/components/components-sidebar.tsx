"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface ComponentsSidebarProps {
  onDragStart: (
    e: React.DragEvent,
    componentType: "button" | "input" | "card" | "textarea" | "checkbox"
  ) => void;
}

// Shared component factory to ensure preview and canvas components are identical
const createComponent = (
  type: "button" | "input" | "card" | "textarea" | "checkbox",
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
    case "textarea":
      return <Textarea style={style} placeholder="Enter multi-line text..." {...props} />;
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" {...props} />
          <label
            htmlFor="terms"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {props?.label || "Checkbox"}
          </label>
        </div>
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
    { type: "textarea" as const, label: "Textarea" },
    { type: "checkbox" as const, label: "Checkbox" },
  ];

  const handleDragStart = (
    e: React.DragEvent,
    componentType: "button" | "input" | "card" | "textarea" | "checkbox"
  ) => {
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
        <div id="preview-textarea">{createComponent("textarea")}</div>
        <div id="preview-checkbox">{createComponent("checkbox")}</div>
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
