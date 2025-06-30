"use client";

import { useEffect, useState } from "react";
import { ThemePresetSelector, type ThemePreset } from "@/components/theme-preset-selector";

interface ReusableThemeSelectorProps {
  registryUrl: string;
  onThemeSelect: (themeStyles: { light: Record<string, string>; dark: Record<string, string> }) => void;
  currentMode?: "light" | "dark";
}

interface RegistryTheme {
  name: string;
  title: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export function ReusableThemeSelector({ registryUrl, onThemeSelect, currentMode = "light" }: ReusableThemeSelectorProps) {
  const [presets, setPresets] = useState<Record<string, ThemePreset>>({});
  const [currentPresetId, setCurrentPresetId] = useState<string | undefined>();

  useEffect(() => {
    async function fetchThemes() {
      try {
        const response = await fetch(registryUrl);
        const registry = await response.json();
        
        const transformedPresets = registry.items.reduce((acc: Record<string, ThemePreset>, theme: RegistryTheme) => {
          acc[theme.name] = {
            id: theme.name,
            label: theme.title,
            colors: {
              light: theme.cssVars.light,
              dark: theme.cssVars.dark,
            },
          };
          return acc;
        }, {});
        
        setPresets(transformedPresets);
        // Set a default selection
        if (registry.items.length > 0) {
          setCurrentPresetId(registry.items[0].name);
        }

      } catch (error) {
        console.error("Failed to fetch or process themes:", error);
      }
    }

    fetchThemes();
  }, [registryUrl]);

  const handleSelectPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    const selectedPreset = presets[presetId];
    if (selectedPreset) {
      onThemeSelect(selectedPreset.colors);
    }
  };

  return (
    <ThemePresetSelector
      presets={presets}
      currentPresetId={currentPresetId}
      onSelectPreset={handleSelectPreset}
      currentMode={currentMode}
    />
  );
} 