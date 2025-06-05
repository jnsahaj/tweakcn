"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Copy, Trash2 } from "lucide-react";

interface CanvasComponent {
  id: string;
  type:
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
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex?: number;
  props?: Record<string, any>;
}

interface PropertiesSidebarProps {
  component: CanvasComponent;
  onUpdateProps: (newProps: Record<string, any>) => void;
  onBringToFront: (componentId: string) => void;
  onBringForward: (componentId: string) => void;
  onSendBackward: (componentId: string) => void;
  onSendToBack: (componentId: string) => void;
  onDuplicateComponent: (componentId: string) => void;
  onDeleteComponent: (componentId: string) => void;
}

export function PropertiesSidebar({
  component,
  onUpdateProps,
  onBringToFront,
  onBringForward,
  onSendBackward,
  onSendToBack,
  onDuplicateComponent,
  onDeleteComponent,
}: PropertiesSidebarProps) {
  const [localProps, setLocalProps] = useState(component.props || {});

  const handlePropChange = (key: string, value: any) => {
    const newProps = { ...localProps, [key]: value };
    setLocalProps(newProps);
    onUpdateProps(newProps);
  };

  const handleBringToFront = () => {
    onBringToFront(component.id);
  };

  const handleBringForward = () => {
    onBringForward(component.id);
  };

  const handleSendBackward = () => {
    onSendBackward(component.id);
  };

  const handleSendToBack = () => {
    onSendToBack(component.id);
  };

  const handleDuplicateComponent = () => {
    onDuplicateComponent(component.id);
  };

  const handleDeleteComponent = () => {
    onDeleteComponent(component.id);
  };

  const renderButtonProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-text">Text</Label>
        <Input
          id="button-text"
          value={localProps.children || ""}
          onChange={(e) => handlePropChange("children", e.target.value)}
          placeholder="Button text"
        />
      </div>
      <div>
        <Label htmlFor="button-variant">Variant</Label>
        <Select
          value={localProps.variant || "default"}
          onValueChange={(value) => handlePropChange("variant", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="ghost">Ghost</SelectItem>
            <SelectItem value="link">Link</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="button-size">Size</Label>
        <Select
          value={localProps.size || "default"}
          onValueChange={(value) => handlePropChange("size", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="icon">Icon</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderInputProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="input-placeholder">Placeholder</Label>
        <Input
          id="input-placeholder"
          value={localProps.placeholder || ""}
          onChange={(e) => handlePropChange("placeholder", e.target.value)}
          placeholder="Enter placeholder text"
        />
      </div>
      <div>
        <Label htmlFor="input-type">Type</Label>
        <Select
          value={localProps.type || "text"}
          onValueChange={(value) => handlePropChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="tel">Phone</SelectItem>
            <SelectItem value="url">URL</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="input-disabled">Disabled</Label>
        <Select
          value={localProps.disabled ? "true" : "false"}
          onValueChange={(value) => handlePropChange("disabled", value === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCardProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="card-title">Title</Label>
        <Input
          id="card-title"
          value={localProps.title || ""}
          onChange={(e) => handlePropChange("title", e.target.value)}
          placeholder="Card title"
        />
      </div>
      <div>
        <Label htmlFor="card-content">Content</Label>
        <Textarea
          id="card-content"
          value={localProps.content || ""}
          onChange={(e) => handlePropChange("content", e.target.value)}
          placeholder="Card content"
          rows={4}
        />
      </div>
    </div>
  );

  const renderLabelProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="label-text">Text</Label>
        <Input
          id="label-text"
          value={localProps.children || ""}
          onChange={(e) => handlePropChange("children", e.target.value)}
          placeholder="Label text"
        />
      </div>
      <div>
        <Label htmlFor="label-for">For (connects to input)</Label>
        <Input
          id="label-for"
          value={localProps.htmlFor || ""}
          onChange={(e) => handlePropChange("htmlFor", e.target.value)}
          placeholder="Input ID"
        />
      </div>
    </div>
  );

  const renderSelectProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="select-placeholder">Placeholder</Label>
        <Input
          id="select-placeholder"
          value={localProps.placeholder || ""}
          onChange={(e) => handlePropChange("placeholder", e.target.value)}
          placeholder="Select placeholder text"
        />
      </div>
      <div>
        <Label htmlFor="select-disabled">Disabled</Label>
        <Select
          value={localProps.disabled ? "true" : "false"}
          onValueChange={(value) => handlePropChange("disabled", value === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderSwitchProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="switch-label">Label</Label>
        <Input
          id="switch-label"
          value={localProps.label || ""}
          onChange={(e) => handlePropChange("label", e.target.value)}
          placeholder="Switch label"
        />
      </div>
      <div>
        <Label htmlFor="switch-disabled">Disabled</Label>
        <Select
          value={localProps.disabled ? "true" : "false"}
          onValueChange={(value) => handlePropChange("disabled", value === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="switch-checked">Default Checked</Label>
        <Select
          value={localProps.defaultChecked ? "true" : "false"}
          onValueChange={(value) => handlePropChange("defaultChecked", value === "true")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="false">No</SelectItem>
            <SelectItem value="true">Yes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderBadgeProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="badge-text">Text</Label>
        <Input
          id="badge-text"
          value={localProps.children || ""}
          onChange={(e) => handlePropChange("children", e.target.value)}
          placeholder="Badge text"
        />
      </div>
      <div>
        <Label htmlFor="badge-variant">Variant</Label>
        <Select
          value={localProps.variant || "default"}
          onValueChange={(value) => handlePropChange("variant", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="destructive">Destructive</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderAvatarProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="avatar-src">Image URL</Label>
        <Input
          id="avatar-src"
          value={localProps.src || ""}
          onChange={(e) => handlePropChange("src", e.target.value)}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>
      <div>
        <Label htmlFor="avatar-alt">Alt Text</Label>
        <Input
          id="avatar-alt"
          value={localProps.alt || ""}
          onChange={(e) => handlePropChange("alt", e.target.value)}
          placeholder="Avatar description"
        />
      </div>
      <div>
        <Label htmlFor="avatar-fallback">Fallback Text</Label>
        <Input
          id="avatar-fallback"
          value={localProps.fallback || ""}
          onChange={(e) => handlePropChange("fallback", e.target.value)}
          placeholder="CN"
          maxLength={2}
        />
      </div>
    </div>
  );

  const renderProgressProperties = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="progress-value">Value (%)</Label>
        <Input
          id="progress-value"
          type="number"
          min="0"
          max="100"
          value={localProps.value || 50}
          onChange={(e) => handlePropChange("value", parseInt(e.target.value) || 0)}
          placeholder="50"
        />
      </div>
      <div>
        <Label htmlFor="progress-max">Maximum Value</Label>
        <Input
          id="progress-max"
          type="number"
          min="1"
          value={localProps.max || 100}
          onChange={(e) => handlePropChange("max", parseInt(e.target.value) || 100)}
          placeholder="100"
        />
      </div>
    </div>
  );

  const renderProperties = () => {
    switch (component.type) {
      case "button":
        return renderButtonProperties();
      case "input":
        return renderInputProperties();
      case "card":
        return renderCardProperties();
      case "label":
        return renderLabelProperties();
      case "select":
        return renderSelectProperties();
      case "switch":
        return renderSwitchProperties();
      case "badge":
        return renderBadgeProperties();
      case "avatar":
        return renderAvatarProperties();
      case "progress":
        return renderProgressProperties();
      default:
        return <div>No properties available</div>;
    }
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-80">
      <Card className="bg-background/95 shadow-lg backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold capitalize">
            {component.type} Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Layers Section */}
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Layers
            </h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBringToFront}
                className="h-8 w-8 p-0"
                title="Bring to Front"
              >
                <ChevronsUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBringForward}
                className="h-8 w-8 p-0"
                title="Bring Forward"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendBackward}
                className="h-8 w-8 p-0"
                title="Send Backward"
              >
                <ArrowDown className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSendToBack}
                className="h-8 w-8 p-0"
                title="Send to Back"
              >
                <ChevronsDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Actions
            </h4>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDuplicateComponent}
                className="h-8 w-8 p-0"
                title="Duplicate Component"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteComponent}
                className="h-8 w-8 p-0"
                title="Delete Component"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Position and Size */}
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Position & Size
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="pos-x" className="text-xs">
                  X
                </Label>
                <Input
                  id="pos-x"
                  type="number"
                  value={Math.round(component.x)}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="pos-y" className="text-xs">
                  Y
                </Label>
                <Input
                  id="pos-y"
                  type="number"
                  value={Math.round(component.y)}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="width" className="text-xs">
                  Width
                </Label>
                <Input
                  id="width"
                  type="number"
                  value={component.width || 0}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>
              <div>
                <Label htmlFor="height" className="text-xs">
                  Height
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={component.height || 0}
                  readOnly
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Component-specific Properties */}
          <div className="space-y-3">
            <h4 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Properties
            </h4>
            {renderProperties()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
