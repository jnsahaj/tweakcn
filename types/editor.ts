import { ColorFormat } from ".";
import { ThemeStyles } from "./theme";

// Base interface for any editor's state
export interface BaseEditorState {
  styles: ThemeStyles;
}

// Interface for editor-specific controls
export interface EditorControls {
  // Controls can be added per editor type as needed
}

// Interface for editor-specific preview props
export interface EditorPreviewProps {
  styles: ThemeStyles;
}

export interface EditorCodeGenerator {
  generateComponentCode: (
    themeEditorState: ThemeEditorState,
    colorFormat?: ColorFormat,
    tailwindVersion?: "3" | "4"
  ) => string;
}

// Theme-specific editor state
export interface ThemeEditorState extends BaseEditorState {
  preset?: string;
  styles: ThemeStyles;
  currentMode: "light" | "dark";
}

// Type for available editors
export type EditorType = "button" | "input" | "card" | "dialog" | "theme";

// Interface for editor configuration
export interface EditorConfig {
  type: EditorType;
  name: string;
  description: string;
  defaultState: BaseEditorState;
  controls: React.ComponentType<any>;
  preview: React.ComponentType<any>;
  codeGenerator: EditorCodeGenerator;
}
