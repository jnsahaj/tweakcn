import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

/**
 * Serializes editor state from localStorage to be used in URL
 */
export const serializeEditorState = (): string => {
  try {
    const editorState = localStorage.getItem("editor-storage");
    if (!editorState) return "";
    return compressToEncodedURIComponent(editorState);
  } catch (error) {
    console.error("Failed to serialize editor state:", error);
    return "";
  }
};

/**
 * Deserializes editor state from URL parameter and updates localStorage
 */
export const deserializeEditorState = (serializedState: string): boolean => {
  try {
    if (!serializedState) return false;

    const editorState = decompressFromEncodedURIComponent(serializedState);
    if (!editorState) return false;

    JSON.parse(editorState);
    localStorage.setItem("editor-storage", editorState);
    return true;
  } catch (error) {
    console.error("Failed to deserialize editor state:", error);
    return false;
  }
};
