"use client";

import { Button } from "@/components/ui/button";
import type { ComponentType } from "../types/canvas-types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface ComponentsSidebarProps {
  onDragStart: (e: React.DragEvent, componentType: ComponentType) => void;
}

// Shared component factory to ensure preview and canvas components are identical
const createComponent = (
  type: ComponentType,
  props?: Record<string, any>,
  size?: { width?: number; height?: number },
  additionalClassName?: string
) => {
  const style = size ? { width: size.width, height: size.height } : {};

  switch (type) {
    case "button":
      return (
        <Button style={style} className={additionalClassName} {...props}>
          {props?.children || "Button"}
        </Button>
      );
    case "input":
      return (
        <Input
          style={style}
          className={additionalClassName}
          placeholder="Enter text..."
          {...props}
        />
      );
    case "card":
      return (
        <Card className={`h-full w-full ${additionalClassName || ""}`} style={style} {...props}>
          <CardHeader>
            {props?.title && <CardTitle>{props.title}</CardTitle>}
            {props?.content && <CardDescription>{props.content}</CardDescription>}
          </CardHeader>
        </Card>
      );
    case "textarea":
      return (
        <Textarea
          style={style}
          className={additionalClassName}
          placeholder="Enter multi-line text..."
          {...props}
        />
      );
    case "checkbox":
      return (
        <div className={`flex items-center space-x-2 ${additionalClassName || ""}`}>
          <Checkbox id="terms" {...props} />
          <label
            htmlFor="terms"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {props?.label || "Checkbox"}
          </label>
        </div>
      );
    case "label":
      return (
        <Label style={style} className={additionalClassName} {...props}>
          {props?.children || "Label"}
        </Label>
      );
    case "select":
      return (
        <Select {...props}>
          <SelectTrigger
            style={{ ...style, pointerEvents: "none" }}
            className={`cursor-pointer ${additionalClassName || ""}`}
          >
            <SelectValue placeholder={props?.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <div className={`flex items-center space-x-2 ${additionalClassName || ""}`}>
          <Switch id="switch" style={style} {...props} />
          <Label htmlFor="switch">{props?.label || "Switch"}</Label>
        </div>
      );
    case "badge":
      return (
        <Badge
          style={style}
          className={additionalClassName}
          variant={props?.variant || "default"}
          {...props}
        >
          {props?.children || "Badge"}
        </Badge>
      );
    case "avatar":
      return (
        <Avatar style={style} className={additionalClassName} {...props}>
          <AvatarImage src={props?.src} alt={props?.alt} />
          <AvatarFallback>{props?.fallback || "CN"}</AvatarFallback>
        </Avatar>
      );
    case "progress":
      return (
        <Progress
          style={style}
          className={additionalClassName}
          value={props?.value || 50}
          {...props}
        />
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
    { type: "label" as const, label: "Label" },
    { type: "select" as const, label: "Select" },
    { type: "switch" as const, label: "Switch" },
    { type: "badge" as const, label: "Badge" },
    { type: "avatar" as const, label: "Avatar" },
    { type: "progress" as const, label: "Progress" },
  ];

  const handleDragStart = (e: React.DragEvent, componentType: ComponentType) => {
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
        <div id="preview-label">{createComponent("label")}</div>
        <div id="preview-select">{createComponent("select")}</div>
        <div id="preview-switch">{createComponent("switch")}</div>
        <div id="preview-badge">{createComponent("badge")}</div>
        <div id="preview-avatar">{createComponent("avatar")}</div>
        <div id="preview-progress">{createComponent("progress")}</div>
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
