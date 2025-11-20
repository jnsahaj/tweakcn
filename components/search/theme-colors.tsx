import { getPresetThemeStyles } from "@/utils/theme-preset-helper";
import { ColorBox } from "./color-box";
import { useMemo } from "react";

interface ThemeColorsProps {
  presetName: string;
  mode: "light" | "dark";
}

export const ThemeColors: React.FC<ThemeColorsProps> = ({ presetName, mode }) => {
  const styles = useMemo(() => getPresetThemeStyles(presetName)[mode], [presetName, mode]);
  return (
    <div className="flex gap-0.5">
      <ColorBox color={styles.primary} />
      <ColorBox color={styles.accent} />
      <ColorBox color={styles.secondary} />
      <ColorBox color={styles.border} />
    </div>
  );
};
