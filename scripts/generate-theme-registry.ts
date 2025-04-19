import { ThemeStyles, ThemeStyleProps } from "@/types/theme";
import { getPresetThemeStyles, presets } from "@/utils/theme-presets";
import fs from "fs";
import path from "path";
import { colorFormatter } from "@/utils/color-converter";
import {
  defaultDarkThemeStyles,
  defaultLightThemeStyles,
} from "@/config/theme";
import { getShadowMap } from "@/utils/shadows";

const THEMES_DIR = path.join(process.cwd(), "public", "r", "themes");

// Ensure the themes directory exists
if (!fs.existsSync(THEMES_DIR)) {
  fs.mkdirSync(THEMES_DIR, { recursive: true });
}

// Convert HSL color to the format expected by shadcn registry
const convertToRegistryColor = (color: string): string => {
  return colorFormatter(color, "oklch");
};

// Helper to get a value from either dark or light theme
const getThemeValue = (
  dark: ThemeStyleProps,
  light: ThemeStyleProps,
  key: keyof ThemeStyleProps
): string => {
  return dark[key] || light[key] || "";
};

// Convert theme styles to registry format
// Add color property keys type
type ColorPropertyKey = keyof Pick<ThemeStyleProps, 
  | 'background' 
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring'
>;

const COLOR_PROPERTIES: ColorPropertyKey[] = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'muted',
  'muted-foreground',
  'accent',
  'accent-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring'
];

const convertThemeStyles = (styles: ThemeStyles) => {
  const { light, dark } = styles;

  const convertTheme = (theme: ThemeStyleProps): ThemeStyleProps => {
    const result = { ...theme };
    
    // Convert all color values in a single loop
    COLOR_PROPERTIES.forEach(key => {
      result[key] = convertToRegistryColor(theme[key] || '');
    });

    return result;
  };

  return {
    light: { ...defaultLightThemeStyles, ...convertTheme(light) },
    dark: { ...defaultDarkThemeStyles, ...convertTheme(dark) },
  };
};

const generateThemeRegistry = (name: string) => {
  const { light, dark } = convertThemeStyles(getPresetThemeStyles(name));

  // Generate shadow variables for both light and dark modes
  const lightShadows = getShadowMap({
    styles: { light, dark },
    currentMode: "light",
  });
  const darkShadows = getShadowMap({
    styles: { light, dark },
    currentMode: "dark",
  });

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:style",
    dependencies: [],
    registryDependencies: [],
    css: {
      "@layer base": {
        body: {
          "letter-spacing": "var(--tracking-normal)",
        },
      },
    },
    cssVars: {
      theme: {
        "font-sans":
          getThemeValue(dark, light, "font-sans") || "Inter, sans-serif",
        "font-mono": getThemeValue(dark, light, "font-mono") || "monospace",
        "font-serif": getThemeValue(dark, light, "font-serif") || "serif",
        radius: getThemeValue(dark, light, "radius") || "0.5rem",
        "tracking-tighter": "calc(var(--tracking-normal) - 0.05em)",
        "tracking-tight": "calc(var(--tracking-normal) - 0.025em)",
        "tracking-wide": "calc(var(--tracking-normal) + 0.025em)",
        "tracking-wider": "calc(var(--tracking-normal) + 0.05em)",
        "tracking-widest": "calc(var(--tracking-normal) + 0.1em)",
      },
      light: {
        ...light,
        "shadow-2xs": lightShadows["shadow-2xs"],
        "shadow-xs": lightShadows["shadow-xs"],
        "shadow-sm": lightShadows["shadow-sm"],
        shadow: lightShadows["shadow"],
        "shadow-md": lightShadows["shadow-md"],
        "shadow-lg": lightShadows["shadow-lg"],
        "shadow-xl": lightShadows["shadow-xl"],
        "shadow-2xl": lightShadows["shadow-2xl"],
        "tracking-normal":
          getThemeValue(dark, light, "letter-spacing") || "0em",
        spacing: getThemeValue(dark, light, "spacing") || "0.25rem",
      },
      dark: {
        ...dark,
        "shadow-2xs": darkShadows["shadow-2xs"],
        "shadow-xs": darkShadows["shadow-xs"],
        "shadow-sm": darkShadows["shadow-sm"],
        shadow: darkShadows["shadow"],
        "shadow-md": darkShadows["shadow-md"],
        "shadow-lg": darkShadows["shadow-lg"],
        "shadow-xl": darkShadows["shadow-xl"],
        "shadow-2xl": darkShadows["shadow-2xl"],
      },
    },
  };

  return registryItem;
};

// Generate registry files for all presets
Object.keys(presets).forEach((name) => {
  const registryItem = generateThemeRegistry(name);
  const filePath = path.join(THEMES_DIR, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(registryItem, null, 2));
  console.log(`Generated registry file for theme: ${name}`);
});
