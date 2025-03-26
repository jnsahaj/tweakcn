import React, { useCallback, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemePreset } from "../../types/theme";
import { useEditorStore } from "../../store/editor-store";
import { getPresetThemeStyles } from "../../utils/theme-presets";
import { Button } from "../ui/button";
import { Shuffle } from "lucide-react";

interface ThemePresetSelectProps {
  presets: Record<string, ThemePreset>;
  currentPreset: string | null;
  onPresetChange: (preset: string) => void;
}

const ColorBox = ({ color }: { color: string }) => {
  return (
    <div
      className="w-3 h-3 rounded-sm border border-muted"
      style={{ backgroundColor: color }}
    />
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  presets,
  currentPreset,
  onPresetChange,
}) => {
  const { themeState } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
  const value = presetNames?.find((name) => name === currentPreset);
  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    onPresetChange(presetNames[random]);
  }, [onPresetChange, presetNames]);

  return (
    <Select value={value || ""} onValueChange={onPresetChange}>
      <div className="flex gap-1 items-center">
        <SelectTrigger className="w-full md:w-64 h-10">
          <SelectValue placeholder="Select theme preset" />
        </SelectTrigger>
        <Button
          size="icon"
          variant="outline"
          className="h-10 w-10"
          title="Randomize"
          onClick={randomize}
        >
          <Shuffle />
        </Button>
      </div>
      <SelectContent>
        <SelectGroup>
          {presetNames.map((presetName) => (
            <SelectItem key={presetName} value={presetName}>
              <div className="flex items-center justify-between w-full">
                <div className="flex">
                  <ColorBox color={getPresetThemeStyles(presetName)[mode].primary} />
                  <ColorBox color={getPresetThemeStyles(presetName)[mode].accent} />
                  <ColorBox
                    color={getPresetThemeStyles(presetName)[mode].secondary}
                  />
                  <ColorBox color={getPresetThemeStyles(presetName)[mode].border} />
                </div>
                <span className="capitalize ml-2">
                  {presetName.replace(/-/g, " ")}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default ThemePresetSelect;
