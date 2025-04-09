import { EditorConfig } from "@/types/editor";
import { themeEditorConfig } from "./theme";

// Registry of all available editors
export const editorRegistry: Record<string, EditorConfig> = {
  theme: themeEditorConfig,
  // Add more editors here as they are created
};

// Helper function to get editor config by type
export const getEditorConfig = (type: string): EditorConfig => {
  const config = editorRegistry[type];
  if (!config) {
    throw new Error(`Editor type "${type}" not found`);
  }
  return config;
};

// Export all editor types
export const editorTypes = Object.keys(editorRegistry);
