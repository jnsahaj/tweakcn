import { defaultLightThemeStyles } from "@/config/theme";
import { ColorFormat } from "@/types";
import { ThemeEditorState } from "@/types/editor";
import { ThemeStyles } from "@/types/theme";
import { colorFormatter } from "@/utils/color-converter";
import { getShadowMap } from "@/utils/shadows";

type ThemeMode = "light" | "dark";

const generateColorVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string
): string => {
  const styles = themeStyles[mode];
  return `
  --background: ${formatColor(styles.background)};
  --foreground: ${formatColor(styles.foreground)};
  --card: ${formatColor(styles.card)};
  --card-foreground: ${formatColor(styles["card-foreground"])};
  --popover: ${formatColor(styles.popover)};
  --popover-foreground: ${formatColor(styles["popover-foreground"])};
  --primary: ${formatColor(styles.primary)};
  --primary-foreground: ${formatColor(styles["primary-foreground"])};
  --secondary: ${formatColor(styles.secondary)};
  --secondary-foreground: ${formatColor(styles["secondary-foreground"])};
  --muted: ${formatColor(styles.muted)};
  --muted-foreground: ${formatColor(styles["muted-foreground"])};
  --accent: ${formatColor(styles.accent)};
  --accent-foreground: ${formatColor(styles["accent-foreground"])};
  --destructive: ${formatColor(styles.destructive)};
  --destructive-foreground: ${formatColor(styles["destructive-foreground"])};
  --border: ${formatColor(styles.border)};
  --input: ${formatColor(styles.input)};
  --ring: ${formatColor(styles.ring)};
  --chart-1: ${formatColor(styles["chart-1"])};
  --chart-2: ${formatColor(styles["chart-2"])};
  --chart-3: ${formatColor(styles["chart-3"])};
  --chart-4: ${formatColor(styles["chart-4"])};
  --chart-5: ${formatColor(styles["chart-5"])};
  --sidebar: ${formatColor(styles.sidebar)};
  --sidebar-foreground: ${formatColor(styles["sidebar-foreground"])};
  --sidebar-primary: ${formatColor(styles["sidebar-primary"])};
  --sidebar-primary-foreground: ${formatColor(styles["sidebar-primary-foreground"])};
  --sidebar-accent: ${formatColor(styles["sidebar-accent"])};
  --sidebar-accent-foreground: ${formatColor(styles["sidebar-accent-foreground"])};
  --sidebar-border: ${formatColor(styles["sidebar-border"])};
  --sidebar-ring: ${formatColor(styles["sidebar-ring"])};`;
};

const generateFontVariables = (themeStyles: ThemeStyles, mode: ThemeMode): string => {
  const styles = themeStyles[mode];
  return `
  --font-sans: ${styles["font-sans"]};
  --font-serif: ${styles["font-serif"]};
  --font-mono: ${styles["font-mono"]};`;
};

const generateShadowVariables = (shadowMap: Record<string, string>): string => {
  return `
  --shadow-2xs: ${shadowMap["shadow-2xs"]};
  --shadow-xs: ${shadowMap["shadow-xs"]};
  --shadow-sm: ${shadowMap["shadow-sm"]};
  --shadow: ${shadowMap["shadow"]};
  --shadow-md: ${shadowMap["shadow-md"]};
  --shadow-lg: ${shadowMap["shadow-lg"]};
  --shadow-xl: ${shadowMap["shadow-xl"]};
  --shadow-2xl: ${shadowMap["shadow-2xl"]};`;
};

export type GenerateVarsPreferences = {
  includeFontVariables?: boolean;
};

const generateThemeVariables = (
  themeStyles: ThemeStyles,
  mode: ThemeMode,
  formatColor: (color: string) => string,
  preferences: GenerateVarsPreferences
) => {
  const { includeFontVariables = true } = preferences;

  const selector = mode === "dark" ? ".dark" : ":root";
  const colorVars = generateColorVariables(themeStyles, mode, formatColor);
  const fontVars = includeFontVariables ? generateFontVariables(themeStyles, mode) : "";
  const radiusVar = `\n  --radius: ${themeStyles[mode].radius};`;
  const shadowVars = generateShadowVariables(
    getShadowMap({ styles: themeStyles, currentMode: mode })
  );
  const spacingVar =
    mode === "light"
      ? `\n  --spacing: ${themeStyles["light"].spacing ?? defaultLightThemeStyles.spacing};`
      : "";

  const trackingVars =
    mode === "light"
      ? `\n  --tracking-normal: ${themeStyles["light"]["letter-spacing"] ?? defaultLightThemeStyles["letter-spacing"]};`
      : "";

  if (mode === "light") {
    return (
      selector +
      " {" +
      fontVars +
      radiusVar +
      colorVars +
      shadowVars +
      trackingVars +
      spacingVar +
      "\n}"
    );
  }

  if (mode === "dark") {
    return selector + " {" + colorVars + shadowVars + "\n}";
  }
};

const generateInlineTrackingVariables = (themeStyles: ThemeStyles): string => {
  const styles = themeStyles["light"];
  if (styles["letter-spacing"] === "0em") return "";

  return `\n  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);\n`;
};

const generateTailwindV4ThemeInline = (
  themeStyles: ThemeStyles,
  preferences: GenerateVarsPreferences
): string => {
  const { includeFontVariables = true } = preferences;

  const fontVarsInline = includeFontVariables
    ? `\n  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);\n`
    : "";

  const colorVarsInline = `\n  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);\n`;

  const radiusVarsInline = `\n  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);\n`;

  const shadowVarsInline = `\n  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);\n`;

  const trackingVarsInline = generateInlineTrackingVariables(themeStyles);

  return (
    "@theme inline {" +
    fontVarsInline +
    colorVarsInline +
    radiusVarsInline +
    shadowVarsInline +
    trackingVarsInline +
    "}"
  );
};

const generateTailwindV3ConfigFile = (
  _themeStyles: ThemeStyles,
  preferences: GenerateVarsPreferences
): string => {
  const { includeFontVariables = true } = preferences;

  const fontFamilyBlock = includeFontVariables
    ? `fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },`
    : "";

  const code = `
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      ${fontFamilyBlock}
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        chart: {
          1: "var(--chart-1)",
          2: "var(--chart-2)",
          3: "var(--chart-3)",
          4: "var(--chart-4)",
          5: "var(--chart-5)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
}`;

  return code
    .trim()
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
};

export const generateThemeCode = (
  themeEditorState: ThemeEditorState,
  colorFormat: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3",
  preferences: GenerateVarsPreferences = {}
): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles;
  const formatColor = (color: string) => colorFormatter(color, colorFormat, tailwindVersion);

  const lightTheme = generateThemeVariables(themeStyles, "light", formatColor, preferences);
  const darkTheme = generateThemeVariables(themeStyles, "dark", formatColor, preferences);
  const tailwindV4Theme =
    tailwindVersion === "4" ? `\n\n${generateTailwindV4ThemeInline(themeStyles, preferences)}` : "";

  const bodyLetterSpacing =
    themeStyles["light"]["letter-spacing"] !== "0em"
      ? "\n\nbody {\n  letter-spacing: var(--tracking-normal);\n}"
      : "";

  return `${lightTheme}\n\n${darkTheme}${tailwindV4Theme}${bodyLetterSpacing}`;
};

export const generateTailwindConfigFileCode = (
  themeEditorState: ThemeEditorState,
  preferences: GenerateVarsPreferences = {}
): string => {
  if (
    !themeEditorState ||
    !("light" in themeEditorState.styles) ||
    !("dark" in themeEditorState.styles)
  ) {
    throw new Error("Invalid theme styles: missing light or dark mode");
  }

  const themeStyles = themeEditorState.styles;
  return generateTailwindV3ConfigFile(themeStyles, preferences);
};
