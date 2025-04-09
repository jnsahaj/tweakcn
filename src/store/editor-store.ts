import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeEditorState, EditorType } from "@/types/editor";
import { isEqual } from "@ngard/tiny-isequal";
import { defaultThemeState } from "@/config/theme";
import { getPresetThemeStyles } from "../utils/theme-presets";

interface EditorStore {
  themeState: ThemeEditorState;
  setThemeState: (state: ThemeEditorState) => void;
  applyThemePreset: (preset: string) => void;
  resetToDefault: (type: EditorType) => void;
  hasStateChanged: (type: EditorType) => boolean;
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      setThemeState: (state: ThemeEditorState) => {
        set({ themeState: state });
      },
      applyThemePreset: (preset: string) => {
        const themeState = get().themeState;
        set({
          themeState: {
            ...themeState,
            preset,
            styles: getPresetThemeStyles(preset),
          },
        });
      },
      resetToDefault: (type: EditorType) => {
        if (type === "theme") {
          const mode = get().themeState.currentMode;
          set({ themeState: { ...defaultThemeState, currentMode: mode } });
        }
      },
      hasStateChanged: (type: EditorType) => {
        const state = get();
        if (type === "theme") {
          return !isEqual(state.themeState.styles, defaultThemeState.styles);
        }
        return false;
      },
    }),
    {
      name: "editor-storage", // unique name for localStorage
    }
  )
);
