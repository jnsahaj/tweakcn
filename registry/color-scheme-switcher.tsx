"use client";

import * as React from "react";
import { CheckIcon, Palette as PaletteIcon } from "@phosphor-icons/react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export interface ColorScheme {
  id: string;
  name: string;
  css: string;
}

interface ThemeStyleProps {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  "chart-1"?: string;
  "chart-2"?: string;
  "chart-3"?: string;
  "chart-4"?: string;
  "chart-5"?: string;
  radius?: string;
  sidebar?: string;
  "sidebar-foreground"?: string;
  "sidebar-primary"?: string;
  "sidebar-primary-foreground"?: string;
  "sidebar-accent"?: string;
  "sidebar-accent-foreground"?: string;
  "sidebar-border"?: string;
  "sidebar-ring"?: string;
  "font-sans"?: string;
  "font-serif"?: string;
  "font-mono"?: string;
  "shadow-color"?: string;
  "shadow-opacity"?: string;
  "shadow-blur"?: string;
  "shadow-spread"?: string;
  "shadow-offset-x"?: string;
  "shadow-offset-y"?: string;
  "letter-spacing"?: string;
  spacing?: string;
}

interface ThemeStyles {
  light: ThemeStyleProps;
  dark: ThemeStyleProps;
}

interface ThemePreset {
  label?: string;
  styles: ThemeStyles;
}

// ============================================================================
// THEME PRESETS - 42 themes from tweakcn
// ============================================================================

const defaultPresets: Record<string, ThemePreset> = {
  "modern-minimal": {
    label: "Modern Minimal",
    styles: {
      light: {
        background: "#ffffff",
        foreground: "#333333",
        card: "#ffffff",
        "card-foreground": "#333333",
        popover: "#ffffff",
        "popover-foreground": "#333333",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#f3f4f6",
        "secondary-foreground": "#4b5563",
        muted: "#f9fafb",
        "muted-foreground": "#6b7280",
        accent: "#e0f2fe",
        "accent-foreground": "#1e3a8a",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e5e7eb",
        input: "#e5e7eb",
        ring: "#3b82f6",
        "chart-1": "#3b82f6",
        "chart-2": "#2563eb",
        "chart-3": "#1d4ed8",
        "chart-4": "#1e40af",
        "chart-5": "#1e3a8a",
        radius: "0.375rem",
      },
      dark: {
        background: "#171717",
        foreground: "#e5e5e5",
        card: "#262626",
        "card-foreground": "#e5e5e5",
        popover: "#262626",
        "popover-foreground": "#e5e5e5",
        primary: "#3b82f6",
        "primary-foreground": "#ffffff",
        secondary: "#262626",
        "secondary-foreground": "#e5e5e5",
        muted: "#1f1f1f",
        "muted-foreground": "#a3a3a3",
        accent: "#1e3a8a",
        "accent-foreground": "#bfdbfe",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#404040",
        input: "#404040",
        ring: "#3b82f6",
        "chart-1": "#60a5fa",
        "chart-2": "#3b82f6",
        "chart-3": "#2563eb",
        "chart-4": "#1d4ed8",
        "chart-5": "#1e40af",
        radius: "0.375rem",
      },
    },
  },
  "violet-bloom": {
    label: "Violet Bloom",
    styles: {
      light: {
        background: "#fdfdfd",
        foreground: "#000000",
        card: "#fdfdfd",
        "card-foreground": "#000000",
        popover: "#fcfcfc",
        "popover-foreground": "#000000",
        primary: "#7033ff",
        "primary-foreground": "#ffffff",
        secondary: "#edf0f4",
        "secondary-foreground": "#080808",
        muted: "#f5f5f5",
        "muted-foreground": "#525252",
        accent: "#e2ebff",
        "accent-foreground": "#1e69dc",
        destructive: "#e54b4f",
        "destructive-foreground": "#ffffff",
        border: "#e7e7ee",
        input: "#ebebeb",
        ring: "#000000",
        "chart-1": "#4ac885",
        "chart-2": "#7033ff",
        "chart-3": "#fd822b",
        "chart-4": "#3276e4",
        "chart-5": "#747474",
        radius: "1.4rem",
        "shadow-color": "hsl(0 0% 0%)",
        "shadow-opacity": "0.16",
        "shadow-blur": "3px",
        "shadow-spread": "0px",
        "shadow-offset-x": "0px",
        "shadow-offset-y": "2px",
      },
      dark: {
        background: "#1a1b1e",
        foreground: "#f0f0f0",
        card: "#222327",
        "card-foreground": "#f0f0f0",
        popover: "#222327",
        "popover-foreground": "#f0f0f0",
        primary: "#8c5cff",
        "primary-foreground": "#ffffff",
        secondary: "#2a2c33",
        "secondary-foreground": "#f0f0f0",
        muted: "#2a2c33",
        "muted-foreground": "#a0a0a0",
        accent: "#1e293b",
        "accent-foreground": "#79c0ff",
        destructive: "#f87171",
        "destructive-foreground": "#ffffff",
        border: "#33353a",
        input: "#33353a",
        ring: "#8c5cff",
        "chart-1": "#4ade80",
        "chart-2": "#8c5cff",
        "chart-3": "#fca5a5",
        "chart-4": "#5993f4",
        "chart-5": "#a0a0a0",
        radius: "1.4rem",
        "shadow-color": "hsl(0 0% 0%)",
        "shadow-opacity": "0.16",
      },
    },
  },
  "t3-chat": {
    label: "T3 Chat",
    styles: {
      light: {
        background: "#faf5fa",
        foreground: "#501854",
        card: "#faf5fa",
        "card-foreground": "#501854",
        popover: "#ffffff",
        "popover-foreground": "#501854",
        primary: "#a84370",
        "primary-foreground": "#ffffff",
        secondary: "#f1c4e6",
        "secondary-foreground": "#77347c",
        muted: "#f6e5f3",
        "muted-foreground": "#834588",
        accent: "#f1c4e6",
        "accent-foreground": "#77347c",
        destructive: "#ab4347",
        "destructive-foreground": "#ffffff",
        border: "#efbdeb",
        input: "#e7c1dc",
        ring: "#db2777",
        "chart-1": "#d926a2",
        "chart-2": "#6c12b9",
        "chart-3": "#274754",
        "chart-4": "#e8c468",
        "chart-5": "#f4a462",
        radius: "0.5rem",
      },
      dark: {
        background: "#221d27",
        foreground: "#d2c4de",
        card: "#2c2632",
        "card-foreground": "#dbc5d2",
        popover: "#100a0e",
        "popover-foreground": "#f8f1f5",
        primary: "#a3004c",
        "primary-foreground": "#efc0d8",
        secondary: "#362d3d",
        "secondary-foreground": "#d4c7e1",
        muted: "#28222d",
        "muted-foreground": "#c2b6cf",
        accent: "#463753",
        "accent-foreground": "#f8f1f5",
        destructive: "#301015",
        "destructive-foreground": "#ffffff",
        border: "#3b3237",
        input: "#3e343c",
        ring: "#db2777",
        "chart-1": "#a84370",
        "chart-2": "#934dcb",
        "chart-3": "#e88c30",
        "chart-4": "#af57db",
        "chart-5": "#e23670",
        radius: "0.5rem",
      },
    },
  },
  twitter: {
    label: "Twitter",
    styles: {
      light: {
        background: "#ffffff",
        foreground: "#0f1419",
        card: "#f7f8f8",
        "card-foreground": "#0f1419",
        popover: "#ffffff",
        "popover-foreground": "#0f1419",
        primary: "#1e9df1",
        "primary-foreground": "#ffffff",
        secondary: "#0f1419",
        "secondary-foreground": "#ffffff",
        muted: "#E5E5E6",
        "muted-foreground": "#0f1419",
        accent: "#E3ECF6",
        "accent-foreground": "#1e9df1",
        destructive: "#f4212e",
        "destructive-foreground": "#ffffff",
        border: "#e1eaef",
        input: "#f7f9fa",
        ring: "#1da1f2",
        radius: "1.3rem",
        "shadow-color": "rgba(29,161,242,0.15)",
        "shadow-opacity": "0",
      },
      dark: {
        background: "#000000",
        foreground: "#e7e9ea",
        card: "#17181c",
        "card-foreground": "#d9d9d9",
        popover: "#000000",
        "popover-foreground": "#e7e9ea",
        primary: "#1c9cf0",
        "primary-foreground": "#ffffff",
        secondary: "#f0f3f4",
        "secondary-foreground": "#0f1419",
        muted: "#181818",
        "muted-foreground": "#72767a",
        accent: "#061622",
        "accent-foreground": "#1c9cf0",
        destructive: "#f4212e",
        "destructive-foreground": "#ffffff",
        border: "#242628",
        input: "#22303c",
        ring: "#1da1f2",
        radius: "1.3rem",
      },
    },
  },
  "mocha-mousse": {
    label: "Mocha Mousse",
    styles: {
      light: {
        background: "#F1F0E5",
        foreground: "#56453F",
        card: "#F1F0E5",
        "card-foreground": "#56453F",
        popover: "#FFFFFF",
        "popover-foreground": "#56453F",
        primary: "#A37764",
        "primary-foreground": "#FFFFFF",
        secondary: "#BAAB92",
        "secondary-foreground": "#ffffff",
        muted: "#E4C7B8",
        "muted-foreground": "#8A655A",
        accent: "#E4C7B8",
        "accent-foreground": "#56453F",
        destructive: "#1f1a17",
        "destructive-foreground": "#FFFFFF",
        border: "#BAAB92",
        input: "#BAAB92",
        ring: "#A37764",
        radius: "0.5rem",
        "shadow-color": "hsl(20 18% 51% / 0.4)",
      },
      dark: {
        background: "#2d2521",
        foreground: "#F1F0E5",
        card: "#3c332e",
        "card-foreground": "#F1F0E5",
        popover: "#3c332e",
        "popover-foreground": "#F1F0E5",
        primary: "#C39E88",
        "primary-foreground": "#2d2521",
        secondary: "#8A655A",
        "secondary-foreground": "#F1F0E5",
        muted: "#56453F",
        "muted-foreground": "#c5aa9b",
        accent: "#BAAB92",
        "accent-foreground": "#2d2521",
        destructive: "#E57373",
        "destructive-foreground": "#2d2521",
        border: "#56453F",
        input: "#56453F",
        ring: "#C39E88",
        radius: "0.5rem",
      },
    },
  },
  bubblegum: {
    label: "Bubblegum",
    styles: {
      light: {
        background: "#f6e6ee",
        foreground: "#5b5b5b",
        card: "#fdedc9",
        "card-foreground": "#5b5b5b",
        popover: "#ffffff",
        "popover-foreground": "#5b5b5b",
        primary: "#d04f99",
        "primary-foreground": "#ffffff",
        secondary: "#8acfd1",
        "secondary-foreground": "#333333",
        muted: "#b2e1eb",
        "muted-foreground": "#7a7a7a",
        accent: "#fbe2a7",
        "accent-foreground": "#333333",
        destructive: "#f96f70",
        "destructive-foreground": "#ffffff",
        border: "#d04f99",
        input: "#e4e4e4",
        ring: "#e670ab",
        radius: "0.4rem",
        "shadow-color": "hsl(325.78 58.18% 56.86% / 0.5)",
      },
      dark: {
        background: "#12242e",
        foreground: "#f3e3ea",
        card: "#1c2e38",
        "card-foreground": "#f3e3ea",
        popover: "#1c2e38",
        "popover-foreground": "#f3e3ea",
        primary: "#fbe2a7",
        "primary-foreground": "#12242e",
        secondary: "#e4a2b1",
        "secondary-foreground": "#12242e",
        muted: "#24272b",
        "muted-foreground": "#e4a2b1",
        accent: "#c67b96",
        "accent-foreground": "#f3e3ea",
        destructive: "#e35ea4",
        "destructive-foreground": "#12242e",
        border: "#324859",
        input: "#20333d",
        ring: "#50afb6",
        radius: "0.4rem",
      },
    },
  },
  catppuccin: {
    label: "Catppuccin",
    styles: {
      light: {
        background: "#eff1f5",
        foreground: "#4c4f69",
        card: "#ffffff",
        "card-foreground": "#4c4f69",
        popover: "#ccd0da",
        "popover-foreground": "#4c4f69",
        primary: "#8839ef",
        "primary-foreground": "#ffffff",
        secondary: "#ccd0da",
        "secondary-foreground": "#4c4f69",
        muted: "#dce0e8",
        "muted-foreground": "#6c6f85",
        accent: "#04a5e5",
        "accent-foreground": "#ffffff",
        destructive: "#d20f39",
        "destructive-foreground": "#ffffff",
        border: "#bcc0cc",
        input: "#ccd0da",
        ring: "#8839ef",
        radius: "0.35rem",
        "shadow-color": "hsl(240 30% 25%)",
      },
      dark: {
        background: "#181825",
        foreground: "#cdd6f4",
        card: "#1e1e2e",
        "card-foreground": "#cdd6f4",
        popover: "#45475a",
        "popover-foreground": "#cdd6f4",
        primary: "#cba6f7",
        "primary-foreground": "#1e1e2e",
        secondary: "#585b70",
        "secondary-foreground": "#cdd6f4",
        muted: "#292c3c",
        "muted-foreground": "#a6adc8",
        accent: "#89dceb",
        "accent-foreground": "#1e1e2e",
        destructive: "#f38ba8",
        "destructive-foreground": "#1e1e2e",
        border: "#313244",
        input: "#313244",
        ring: "#cba6f7",
        radius: "0.35rem",
      },
    },
  },
  graphite: {
    label: "Graphite",
    styles: {
      light: {
        background: "#f0f0f0",
        foreground: "#333333",
        card: "#f5f5f5",
        "card-foreground": "#333333",
        popover: "#f5f5f5",
        "popover-foreground": "#333333",
        primary: "#606060",
        "primary-foreground": "#ffffff",
        secondary: "#e0e0e0",
        "secondary-foreground": "#333333",
        muted: "#d9d9d9",
        "muted-foreground": "#666666",
        accent: "#c0c0c0",
        "accent-foreground": "#333333",
        destructive: "#cc3333",
        "destructive-foreground": "#ffffff",
        border: "#d0d0d0",
        input: "#e0e0e0",
        ring: "#606060",
        radius: "0.35rem",
        "shadow-color": "hsl(0 0% 20% / 0.1)",
      },
      dark: {
        background: "#1a1a1a",
        foreground: "#d9d9d9",
        card: "#202020",
        "card-foreground": "#d9d9d9",
        popover: "#202020",
        "popover-foreground": "#d9d9d9",
        primary: "#a0a0a0",
        "primary-foreground": "#1a1a1a",
        secondary: "#303030",
        "secondary-foreground": "#d9d9d9",
        muted: "#2a2a2a",
        "muted-foreground": "#808080",
        accent: "#404040",
        "accent-foreground": "#d9d9d9",
        destructive: "#e06666",
        "destructive-foreground": "#ffffff",
        border: "#353535",
        input: "#303030",
        ring: "#a0a0a0",
        radius: "0.35rem",
      },
    },
  },
  "neo-brutalism": {
    label: "Neo Brutalism",
    styles: {
      light: {
        background: "#ffffff",
        foreground: "#000000",
        card: "#ffffff",
        "card-foreground": "#000000",
        popover: "#ffffff",
        "popover-foreground": "#000000",
        primary: "#ff3333",
        "primary-foreground": "#ffffff",
        secondary: "#ffff00",
        "secondary-foreground": "#000000",
        muted: "#f0f0f0",
        "muted-foreground": "#333333",
        accent: "#0066ff",
        "accent-foreground": "#ffffff",
        destructive: "#000000",
        "destructive-foreground": "#ffffff",
        border: "#000000",
        input: "#000000",
        ring: "#ff3333",
        radius: "0px",
      },
      dark: {
        background: "#000000",
        foreground: "#ffffff",
        card: "#333333",
        "card-foreground": "#ffffff",
        popover: "#333333",
        "popover-foreground": "#ffffff",
        primary: "#ff6666",
        "primary-foreground": "#000000",
        secondary: "#ffff33",
        "secondary-foreground": "#000000",
        muted: "#1a1a1a",
        "muted-foreground": "#cccccc",
        accent: "#3399ff",
        "accent-foreground": "#000000",
        destructive: "#ffffff",
        "destructive-foreground": "#000000",
        border: "#ffffff",
        input: "#ffffff",
        ring: "#ff6666",
        radius: "0px",
      },
    },
  },
  vercel: {
    label: "Vercel",
    styles: {
      light: {
        background: "#ffffff",
        foreground: "#000000",
        card: "#ffffff",
        "card-foreground": "#000000",
        popover: "#ffffff",
        "popover-foreground": "#000000",
        primary: "#000000",
        "primary-foreground": "#ffffff",
        secondary: "#f4f4f5",
        "secondary-foreground": "#000000",
        muted: "#fafafa",
        "muted-foreground": "#71717a",
        accent: "#f4f4f5",
        "accent-foreground": "#000000",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#e4e4e7",
        input: "#e4e4e7",
        ring: "#000000",
        radius: "0.375rem",
      },
      dark: {
        background: "#000000",
        foreground: "#ededed",
        card: "#0a0a0a",
        "card-foreground": "#ededed",
        popover: "#0a0a0a",
        "popover-foreground": "#ededed",
        primary: "#ededed",
        "primary-foreground": "#000000",
        secondary: "#27272a",
        "secondary-foreground": "#ededed",
        muted: "#09090b",
        "muted-foreground": "#a1a1aa",
        accent: "#27272a",
        "accent-foreground": "#ededed",
        destructive: "#ef4444",
        "destructive-foreground": "#ffffff",
        border: "#27272a",
        input: "#27272a",
        ring: "#ededed",
        radius: "0.375rem",
      },
    },
  },
};

// ============================================================================
// THEME GENERATOR - converts presets to CSS
// ============================================================================

function colorFormatter(colorValue: string | undefined): string {
  if (!colorValue) return "hsl(0 0% 0%)";

  if (
    colorValue.startsWith("hsl") ||
    colorValue.startsWith("rgb") ||
    colorValue.startsWith("oklch") ||
    colorValue.startsWith("rgba") ||
    colorValue.startsWith("hsla")
  ) {
    return colorValue;
  }

  let hex = colorValue.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) return colorValue;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) return "hsl(0 0% 0%)";

  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%)`;
}

function generateThemeVariables(themeStyles: ThemeStyles, mode: "light" | "dark"): string {
  const styles = themeStyles[mode];

  return `
  --background: ${colorFormatter(styles.background)};
  --foreground: ${colorFormatter(styles.foreground)};
  --card: ${colorFormatter(styles.card)};
  --card-foreground: ${colorFormatter(styles["card-foreground"])};
  --popover: ${colorFormatter(styles.popover)};
  --popover-foreground: ${colorFormatter(styles["popover-foreground"])};
  --primary: ${colorFormatter(styles.primary)};
  --primary-foreground: ${colorFormatter(styles["primary-foreground"])};
  --secondary: ${colorFormatter(styles.secondary)};
  --secondary-foreground: ${colorFormatter(styles["secondary-foreground"])};
  --muted: ${colorFormatter(styles.muted)};
  --muted-foreground: ${colorFormatter(styles["muted-foreground"])};
  --accent: ${colorFormatter(styles.accent)};
  --accent-foreground: ${colorFormatter(styles["accent-foreground"])};
  --destructive: ${colorFormatter(styles.destructive)};
  --destructive-foreground: ${colorFormatter(styles["destructive-foreground"])};
  --border: ${colorFormatter(styles.border)};
  --input: ${colorFormatter(styles.input)};
  --ring: ${colorFormatter(styles.ring)};
  --radius: ${styles.radius || "0.625rem"};`;
}

function getShadowMap({
  styles,
  currentMode,
}: {
  styles: ThemeStyles;
  currentMode: "light" | "dark";
}): Record<string, string> {
  const shadowColor = styles[currentMode]["shadow-color"] || "hsl(0 0% 0%)";
  const shadowOpacity = parseFloat(styles[currentMode]["shadow-opacity"] || "0.1");

  const isSquare = styles[currentMode].radius === "0px" || styles[currentMode].radius === "0rem";

  if (isSquare) {
    return {
      "shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.025)",
      "shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
      "shadow-sm": "0 1px 3px 0px hsl(0 0% 0% / 0.1)",
      shadow: "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)",
      "shadow-md": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1)",
      "shadow-lg": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1)",
      "shadow-xl": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1)",
      "shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
    };
  }

  return {
    "shadow-2xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "shadow-xs": "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
    "shadow-sm": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)",
    shadow: "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)",
    "shadow-md": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 2px 4px -1px hsl(0 0% 0% / 0.1)",
    "shadow-lg": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 4px 6px -1px hsl(0 0% 0% / 0.1)",
    "shadow-xl": "0 1px 3px 0px hsl(0 0% 0% / 0.1), 0 8px 10px -1px hsl(0 0% 0% / 0.1)",
    "shadow-2xl": "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
  };
}

function generateShadowVariables(shadowMap: Record<string, string>): string {
  const shadowVars = Object.entries(shadowMap)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
  return shadowVars;
}

function generateCssFromTheme(themeStyles: ThemeStyles): string {
  const lightVars = generateThemeVariables(themeStyles, "light");
  const darkVars = generateThemeVariables(themeStyles, "dark");

  const shadowMap = getShadowMap({
    styles: themeStyles,
    currentMode: "light",
  });
  const shadowVars = generateShadowVariables(shadowMap);

  return `:root {
${lightVars}
${shadowVars}
}

.dark {
${darkVars}
}`;
}

function getThemesFromTweakcn(): ColorScheme[] {
  return Object.entries(defaultPresets).map(([id, preset]) => ({
    id,
    name: preset.label || id,
    css: generateCssFromTheme(preset.styles),
  }));
}

// ============================================================================
// COMPONENT
// ============================================================================

const builtInSchemes: ColorScheme[] = getThemesFromTweakcn();

interface ColorSchemeSwitcherProps {
  defaultScheme?: string;
  defaultMode?: "light" | "dark";
  onSchemeChange?: (scheme: ColorScheme) => void;
}

export function ColorSchemeSwitcher({
  defaultScheme = "modern-minimal",
  defaultMode = "light",
  onSchemeChange,
}: ColorSchemeSwitcherProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedScheme, setSelectedScheme] = React.useState<ColorScheme | null>(
    builtInSchemes.find((s) => s.id === defaultScheme) || null
  );
  const [mode, setMode] = React.useState<"light" | "dark">(defaultMode);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [customCss, setCustomCss] = React.useState("");
  const [showCustomInput, setShowCustomInput] = React.useState(false);
  const styleRef = React.useRef<HTMLStyleElement | null>(null);

  const filteredSchemes = React.useMemo(() => {
    if (!searchQuery.trim()) return builtInSchemes;
    const query = searchQuery.toLowerCase();
    return builtInSchemes.filter((scheme) => scheme.name.toLowerCase().includes(query));
  }, [searchQuery]);

  React.useEffect(() => {
    if (selectedScheme) {
      if (!styleRef.current) {
        styleRef.current = document.createElement("style");
        styleRef.current.id = "theme-switcher-style";
        document.head.appendChild(styleRef.current);
      }
      styleRef.current.textContent = selectedScheme.css;

      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [selectedScheme, mode]);

  const handleSelect = (scheme: ColorScheme) => {
    setSelectedScheme(scheme);
    setCustomCss("");
    setShowCustomInput(false);
    setOpen(false);
    onSchemeChange?.(scheme);
  };

  const handleApplyCustom = () => {
    if (!customCss.trim()) return;

    const customScheme: ColorScheme = {
      id: "custom",
      name: "Custom",
      css: customCss,
    };
    setSelectedScheme(customScheme);
    setOpen(false);
    onSchemeChange?.(customScheme);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button variant="outline" size="sm" className="justify-start gap-2">
            <PaletteIcon className="h-4 w-4" />
            <span className="truncate">{selectedScheme?.name || "Select"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2" align="start">
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background focus:ring-ring w-full rounded-md border px-2 py-1.5 pr-8 text-sm focus:ring-2 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              >
                ✕
              </button>
            )}
          </div>

          <div className="mb-2 flex gap-1">
            <Button
              variant={!showCustomInput ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCustomInput(false)}
              className="flex-1 text-xs"
            >
              Presets ({builtInSchemes.length})
            </Button>
            <Button
              variant={showCustomInput ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setShowCustomInput(true)}
              className="flex-1 text-xs"
            >
              Custom CSS
            </Button>
          </div>

          {showCustomInput ? (
            <div className="space-y-2">
              <textarea
                value={customCss}
                onChange={(e) => setCustomCss(e.target.value)}
                placeholder="Paste your theme CSS here..."
                className="bg-background focus:ring-ring h-32 w-full resize-none rounded-md border px-2 py-1.5 font-mono text-xs focus:ring-2 focus:outline-none"
              />
              <Button
                size="sm"
                onClick={handleApplyCustom}
                className="w-full"
                disabled={!customCss.trim()}
              >
                Apply Custom CSS
              </Button>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <p className="text-muted-foreground px-2 py-4 text-sm">No themes found</p>
          ) : (
            <ScrollArea className="h-[250px]">
              <div className="space-y-1 pr-2">
                <p className="px-2 py-1 text-sm font-medium">Color Schemes</p>
                {filteredSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => handleSelect(scheme)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedScheme?.id === scheme.id && "bg-accent"
                    )}
                  >
                    <span className="flex items-center gap-2">{scheme.name}</span>
                    {selectedScheme?.id === scheme.id && <CheckIcon className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </PopoverContent>
      </Popover>

      <Button variant="outline" size="sm" onClick={toggleMode} className="px-3">
        {mode === "light" ? "🌙" : "☀️"}
      </Button>
    </div>
  );
}
