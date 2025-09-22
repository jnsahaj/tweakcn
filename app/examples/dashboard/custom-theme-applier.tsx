"use client";

import { useEffect } from "react";

const customThemeVariables = {
  light: {
    background: "oklch(1.0000 0 0)",
    foreground: "oklch(0 0 0)",
    card: "oklch(0.9761 0 0)",
    "card-foreground": "oklch(0 0 0)",
    popover: "oklch(1.0000 0 0)",
    "popover-foreground": "oklch(0 0 0)",
    primary: "oklch(0.8148 0.0819 225.7537)",
    "primary-foreground": "oklch(1.0000 0 0)",
    secondary: "oklch(0.8562 0.0489 219.6543)",
    "secondary-foreground": "oklch(0 0 0)",
    muted: "oklch(0.7572 0 0)",
    "muted-foreground": "oklch(0 0 0)",
    accent: "oklch(0.7403 0.1357 244.2552)",
    "accent-foreground": "oklch(1.0000 0 0)",
    destructive: "oklch(0.6542 0.2321 28.6592)",
    "destructive-foreground": "oklch(1.0000 0 0)",
    border: "oklch(0.8975 0 0)",
    input: "oklch(0.9761 0 0)",
    ring: "oklch(0.8148 0.0819 225.7537)",
    "chart-1": "oklch(0.8148 0.0819 225.7537)",
    "chart-2": "oklch(0.8562 0.0489 219.6543)",
    "chart-3": "oklch(0.7403 0.1357 244.2552)",
    "chart-4": "oklch(0.8442 0.1722 84.9338)",
    "chart-5": "oklch(0.6542 0.2321 28.6592)",
    sidebar: "oklch(0.9761 0 0)",
    "sidebar-foreground": "oklch(0 0 0)",
    "sidebar-primary": "oklch(0.8148 0.0819 225.7537)",
    "sidebar-primary-foreground": "oklch(1.0000 0 0)",
    "sidebar-accent": "oklch(0.7403 0.1357 244.2552)",
    "sidebar-accent-foreground": "oklch(1.0000 0 0)",
    "sidebar-border": "oklch(0.8975 0 0)",
    "sidebar-ring": "oklch(0.8148 0.0819 225.7537)",
    "font-sans": "Inter",
    "font-serif": "Georgia",
    "font-mono": "Monaco",
    radius: "8px",
    "shadow-2xs": "0px 2px 4px 0px hsl(0 0% 0% / 0.05)",
    "shadow-xs": "0px 2px 4px 0px hsl(0 0% 0% / 0.05)",
    "shadow-sm": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
    shadow: "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "shadow-md": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 2px 4px -1px hsl(0 0% 0% / 0.10)",
    "shadow-lg": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 4px 6px -1px hsl(0 0% 0% / 0.10)",
    "shadow-xl": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 8px 10px -1px hsl(0 0% 0% / 0.10)",
    "shadow-2xl": "0px 2px 4px 0px hsl(0 0% 0% / 0.25)",
    "tracking-normal": "0px",
    "letter-spacing": "0px",
  },
  dark: {
    background: "oklch(0.2178 0 0)",
    foreground: "oklch(1.0000 0 0)",
    card: "oklch(0.3052 0 0)",
    "card-foreground": "oklch(1.0000 0 0)",
    popover: "oklch(0.2178 0 0)",
    "popover-foreground": "oklch(1.0000 0 0)",
    primary: "oklch(0.6531 0.1347 242.6867)",
    "primary-foreground": "oklch(1.0000 0 0)",
    secondary: "oklch(0.3645 0.0403 250.3174)",
    "secondary-foreground": "oklch(1.0000 0 0)",
    muted: "oklch(0.4855 0 0)",
    "muted-foreground": "oklch(1.0000 0 0)",
    accent: "oklch(0.4271 0.0887 258.2946)",
    "accent-foreground": "oklch(1.0000 0 0)",
    destructive: "oklch(0.6542 0.2321 28.6592)",
    "destructive-foreground": "oklch(1.0000 0 0)",
    border: "oklch(0.3867 0 0)",
    input: "oklch(0.3052 0 0)",
    ring: "oklch(0.6531 0.1347 242.6867)",
    "chart-1": "oklch(0.6531 0.1347 242.6867)",
    "chart-2": "oklch(0.3645 0.0403 250.3174)",
    "chart-3": "oklch(0.4271 0.0887 258.2946)",
    "chart-4": "oklch(0.8442 0.1722 84.9338)",
    "chart-5": "oklch(0.6542 0.2321 28.6592)",
    sidebar: "oklch(0.3052 0 0)",
    "sidebar-foreground": "oklch(1.0000 0 0)",
    "sidebar-primary": "oklch(0.6531 0.1347 242.6867)",
    "sidebar-primary-foreground": "oklch(1.0000 0 0)",
    "sidebar-accent": "oklch(0.4271 0.0887 258.2946)",
    "sidebar-accent-foreground": "oklch(1.0000 0 0)",
    "sidebar-border": "oklch(0.3867 0 0)",
    "sidebar-ring": "oklch(0.6531 0.1347 242.6867)",
    "font-sans": "Inter",
    "font-serif": "Georgia",
    "font-mono": "Monaco",
    radius: "8px",
    "shadow-2xs": "0px 2px 4px 0px hsl(0 0% 0% / 0.05)",
    "shadow-xs": "0px 2px 4px 0px hsl(0 0% 0% / 0.05)",
    "shadow-sm": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
    shadow: "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
    "shadow-md": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 2px 4px -1px hsl(0 0% 0% / 0.10)",
    "shadow-lg": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 4px 6px -1px hsl(0 0% 0% / 0.10)",
    "shadow-xl": "0px 2px 4px 0px hsl(0 0% 0% / 0.10), 0px 8px 10px -1px hsl(0 0% 0% / 0.10)",
    "shadow-2xl": "0px 2px 4px 0px hsl(0 0% 0% / 0.25)",
    "letter-spacing": "0px",
  },
};

export function CustomThemeApplier() {
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const themeVars = isDark ? customThemeVariables.dark : customThemeVariables.light;

      // Apply all theme variables
      Object.entries(themeVars).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
      });
    };

    // Apply theme immediately
    applyTheme();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          applyTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
