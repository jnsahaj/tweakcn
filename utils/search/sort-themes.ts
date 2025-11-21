import { ThemePreset } from "@/types/theme";

export const sortThemes = (list: string[], presets: Record<string, ThemePreset>) => {
  const defaultTheme = list.filter((name) => name === "default");
  const otherThemes = list
    .filter((name) => name !== "default")
    .sort((a, b) => {
      const labelA = presets[a]?.label || a;
      const labelB = presets[b]?.label || b;
      return labelA.localeCompare(labelB);
    });
  return [...defaultTheme, ...otherThemes];
};
