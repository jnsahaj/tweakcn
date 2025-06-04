import type { ComponentType, ComponentSize } from "../types/canvas-types";

export function getDefaultProps(type: ComponentType): Record<string, any> {
  switch (type) {
    case "button":
      return { children: "Button", variant: "default" };
    case "input":
      return { placeholder: "Enter text..." };
    case "card":
      return { title: "Card Title", content: "This is a card component with some content." };
    case "textarea":
      return { placeholder: "Enter multi-line text..." };
    case "checkbox":
      return { label: "Checkbox" };
    case "label":
      return { children: "Label" };
    case "select":
      return { placeholder: "Select an option" };
    case "switch":
      return { label: "Switch", defaultChecked: false };
    default:
      return {};
  }
}

export function getDefaultSize(type: ComponentType): ComponentSize {
  switch (type) {
    case "button":
      return { width: 100, height: 40 };
    case "input":
      return { width: 200, height: 40 };
    case "card":
      return { width: 300, height: 200 };
    case "textarea":
      return { width: 200, height: 100 };
    case "checkbox":
      return { width: 120, height: 24 };
    case "label":
      return { width: 100, height: 24 };
    case "select":
      return { width: 220, height: 40 };
    case "switch":
      return { width: 52, height: 24 };
    default:
      return { width: 100, height: 40 };
  }
}
