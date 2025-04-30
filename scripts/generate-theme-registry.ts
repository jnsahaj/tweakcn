import fs from "fs";
import path from "path";

import { generateThemeRegistryFromPreset } from "@/utils/registry/themes";
import { defaultPresets } from "@/utils/theme-presets";

const THEMES_DIR = path.join(process.cwd(), "public", "r", "themes");

// Ensure the themes directory exists
if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}

// Generate registry files for all presets
Object.keys(defaultPresets).forEach((name) => {
  const registryItem = generateThemeRegistryFromPreset(name);
  const filePath = path.join(THEMES_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(registryItem, null, 2));
  console.log(`Generated registry file for theme: ${name}`);
});
