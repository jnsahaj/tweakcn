import { ColorFormat } from ".";
import { ButtonStyles } from "./button";
import { ThemeStyles } from "./theme";

// Base interface for any editor's state
export interface BaseEditorState {
  styles: ButtonStyles | ThemeStyles;
}

// Interface for editor-specific controls
export interface EditorControls {
  // Controls can be added per editor type as needed
}

// Interface for editor-specific preview props
export interface EditorPreviewProps {
  styles: ButtonStyles | ThemeStyles;
}

// Interface for editor-specific code generation
export interface EditorCodeGenerator {
  generateComponentCode: (
    styles: ThemeStyles | ButtonStyles,
    colorFormat?: ColorFormat,
    tailwindVersion?: "3" | "4"
  ) => string;
}

// Button-specific editor state
export interface ButtonEditorState extends BaseEditorState {
  styles: ButtonStyles;
}

// Theme-specific editor state
export interface ThemeEditorState extends BaseEditorState {
  preset?: string;
  styles: ThemeStyles;
  currentMode: "light" | "dark" | "system";


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
