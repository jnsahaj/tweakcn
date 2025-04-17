import { EditorConfig } from "@/types/editor";
import ThemeControlPanel from "@/components/editor/theme-control-panel";
import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { generateThemeCode } from "@/utils/theme-style-generator";
import { defaultThemeState } from "@/config/theme";

export const themeEditorConfig: EditorConfig = {
  type: "theme",
  name: "Theme",
  description: "Customize your global theme colors",
  defaultState: defaultThemeState,
  controls: ThemeControlPanel,
  preview: ThemePreviewPanel,
  codeGenerator: {
    generateComponentCode: generateThemeCode,
  },
};
