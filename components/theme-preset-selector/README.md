# Reusable Theme Preset Selector

This directory contains a reusable component for selecting a theme preset from a list.

## How to Use

1.  **Copy to Your Project**: Copy the `theme-preset-selector` directory into the `components` directory of your project.

2.  **Import and Use**: Import the `ThemePresetSelector` component and provide it with the necessary props.

    -   `presets`: An object where keys are preset IDs and values are `ThemePreset` objects.
    -   `currentPresetId`: The ID of the currently active preset.
    -   `onSelectPreset`: A callback function that is triggered when a user selects a preset.
    -   `currentMode` (optional): "light" or "dark", defaults to "light". Determines which color palette to display in the preview.

## Example

```tsx
import { useState } from "react";
import { ThemePresetSelector, ThemePreset } from "@/components/theme-preset-selector";

// Define your theme presets
const myPresets: Record<string, ThemePreset> = {
  default: {
    id: "default",
    label: "Default",
    colors: {
      light: { primary: "#FFFFFF", secondary: "#F0F0F0", accent: "#007BFF", border: "#CCCCCC" },
      dark: { primary: "#1A1A1A", secondary: "#2C2C2C", accent: "#007BFF", border: "#444444" },
    },
  },
  "doom-64": {
    id: "doom-64",
    label: "Doom 64",
    colors: {
      light: { primary: "#7B0000", secondary: "#A52A2A", accent: "#FFD700", border: "#D2691E" },
      dark: { primary: "#4B0000", secondary: "#800000", accent: "#FFD700", border: "#8B4513" },
    },
  },
};

// Your component
function MyThemeComponent() {
  const [activePreset, setActivePreset] = useState("default");

  const handleSelectTheme = (presetId: string) => {
    setActivePreset(presetId);
    // Add your theme application logic here
    console.log("Selected theme:", presetId);
  };

  return (
    <ThemePresetSelector
      presets={myPresets}
      currentPresetId={activePreset}
      onSelectPreset={handleSelectTheme}
      currentMode="light"
    />
  );
}
``` 