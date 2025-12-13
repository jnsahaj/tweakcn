import fs from "fs";
import path from "path";

import { generateThemeRegistryItemFromStyles } from "@/utils/registry/themes";
import { generateV0RegistryPayload } from "@/utils/registry/v0";
import { defaultPresets } from "@/utils/theme-presets";
import { defaultThemeState } from "@/config/theme";
import { ThemeStyles } from "@/types/theme";

const THEMES_DIR = path.join(process.cwd(), "public", "r", "themes");
const V0_DIR = path.join(process.cwd(), "public", "r", "v0");

// Ensure directories exist
[THEMES_DIR, V0_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper to get preset theme styles without going through the store
function getPresetThemeStylesForScript(name: string): ThemeStyles {
  const defaultTheme = defaultThemeState.styles;
  if (name === "default") {
    return defaultTheme;
  }

  const preset = defaultPresets[name];
  if (!preset) {
    return defaultTheme;
  }

  return {
    light: {
      ...defaultTheme.light,
      ...(preset.styles.light || {}),
    },
    dark: {
      ...defaultTheme.dark,
      ...(preset.styles.light || {}),
      ...(preset.styles.dark || {}),
    },
  };
}

// Generate registry files for all presets
Object.keys(defaultPresets).forEach((name) => {
  const preset = defaultPresets[name];
  const themeStyles = getPresetThemeStylesForScript(name);
  const themeName = preset.label || name;

  // Generate shadcn registry format
  const registryItem = generateThemeRegistryItemFromStyles(name, themeStyles);
  const filePath = path.join(THEMES_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(registryItem, null, 2));
  console.log(`Generated registry file for theme: ${name}`);

  // Generate v0 format
  const v0Payload = generateV0RegistryPayload(themeName, themeStyles);
  const v0FilePath = path.join(V0_DIR, `${name}.json`);
  fs.writeFileSync(v0FilePath, JSON.stringify(v0Payload, null, 2));
  console.log(`Generated v0 file for theme: ${name}`);
});
