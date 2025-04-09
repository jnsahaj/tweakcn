import { ThemeEditorState } from "../types/theme";

// these are common between light and dark modes
// we can assume that light mode's value will be used for dark mode as well
export const COMMON_STYLES = [
  "font-sans",
  "font-serif",
  "font-mono",
  "radius",
  "shadow-opacity",
  "shadow-blur",
  "shadow-spread",
  "shadow-offset-x",
  "shadow-offset-y",
];

export const DEFAULT_FONT_SANS =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

export const DEFAULT_FONT_SERIF =
  'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

export const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// Default light theme styles
export const defaultLightThemeStyles = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(0 0% 14.5%)",
  card: "hsl(0 0% 100%)",
  "card-foreground": "hsl(0 0% 14.5%)",
  popover: "hsl(0 0% 100%)",
  "popover-foreground": "hsl(0 0% 14.5%)",
  primary: "hsl(0 0% 20.5%)",
  "primary-foreground": "hsl(0 0% 98.5%)",
  secondary: "hsl(0 0% 97%)",
  "secondary-foreground": "hsl(0 0% 20.5%)",
  muted: "hsl(0 0% 97%)",
  "muted-foreground": "hsl(0 0% 55.6%)",
  accent: "hsl(0 0% 97%)",
  "accent-foreground": "hsl(0 0% 20.5%)",
  destructive: "hsl(0 80% 57.7%)",
  "destructive-foreground": "hsl(0 0% 100%)",
  border: "hsl(0 0% 92.2%)",
  input: "hsl(0 0% 92.2%)",
  ring: "hsl(0 0% 70.8%)",
  "chart-1": "hsl(41 78% 64.6%)",
  "chart-2": "hsl(185 68% 60%)",
  "chart-3": "hsl(227 65% 39.8%)",
  "chart-4": "hsl(84 63% 82.8%)",
  "chart-5": "hsl(70 68% 76.9%)",
  radius: "0.625rem",
  sidebar: "hsl(0 0% 98.5%)",
  "sidebar-foreground": "hsl(0 0% 14.5%)",
  "sidebar-primary": "hsl(0 0% 20.5%)",
  "sidebar-primary-foreground": "hsl(0 0% 98.5%)",
  "sidebar-accent": "hsl(0 0% 97%)",
  "sidebar-accent-foreground": "hsl(0 0% 20.5%)",
  "sidebar-border": "hsl(0 0% 92.2%)",
  "sidebar-ring": "hsl(0 0% 70.8%)",
  "font-sans": DEFAULT_FONT_SANS,
  "font-serif": DEFAULT_FONT_SERIF,
  "font-mono": DEFAULT_FONT_MONO,

  "shadow-color": "hsl(0 0% 0%)",
  "shadow-opacity": "0.1",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0",
  "shadow-offset-y": "1px",
};

// Default dark theme styles
export const defaultDarkThemeStyles = {
  background: "hsl(240 10% 3.9%)",
  foreground: "hsl(0 0% 98%)",
  card: "hsl(240 10% 3.9%)",
  "card-foreground": "hsl(0 0% 98%)",
  popover: "hsl(240 10% 3.9%)",
  "popover-foreground": "hsl(0 0% 98%)",
  primary: "hsl(0 0% 98%)",
  "primary-foreground": "hsl(240 5.9% 10%)",
  secondary: "hsl(240 3.7% 15.9%)",
  "secondary-foreground": "hsl(0 0% 98%)",
  muted: "hsl(240 3.7% 15.9%)",
  "muted-foreground": "hsl(240 5% 64.9%)",
  accent: "hsl(240 3.7% 15.9%)",
  "accent-foreground": "hsl(0 0% 98%)",
  destructive: "hsl(0 62.8% 30.6%)",
  "destructive-foreground": "hsl(0 85.7% 97.3%)",
  border: "hsl(240 3.7% 15.9%)",
  input: "hsl(240 3.7% 15.9%)",
  ring: "hsl(240 4.9% 83.9%)",
  "chart-1": "hsl(220 70% 50%)",
  "chart-2": "hsl(160 60% 45%)",
  "chart-3": "hsl(30 80% 55%)",
  "chart-4": "hsl(280 65% 60%)",
  "chart-5": "hsl(340 75% 55%)",
  // Actual has radius but not in Expected, keeping it as is
  radius: "0.625rem",
  // Converting sidebar-related variables to match Actual format
  sidebar: "hsl(240 5.9% 10%)",
  "sidebar-foreground": "hsl(240 4.8% 95.9%)",
  "sidebar-primary": "hsl(224.3 76.3% 48%)",
  "sidebar-primary-foreground": "hsl(0 0% 100%)",
  "sidebar-accent": "hsl(240 3.7% 15.9%)",
  "sidebar-accent-foreground": "hsl(240 4.8% 95.9%)",
  "sidebar-border": "hsl(240 3.7% 15.9%)",
  "sidebar-ring": "hsl(240 4.9% 83.9%)",

  "shadow-color": "hsl(0 0% 0%)",
};

// Default theme state
export const defaultThemeState: ThemeEditorState = {
  styles: {
    light: defaultLightThemeStyles,
    dark: defaultDarkThemeStyles,
  },
  currentMode:
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
};
