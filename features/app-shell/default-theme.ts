/**
 * The app shell's default theme (its src/styles/theme.css, copied to themes/app-shell-default.css; 0 errors in
 * theme:check). Used as the generator's default for new themes, the "Default" preset and Reset.
 *
 * The editor chrome keeps tweakcn's own neutral theme (`defaultLightThemeStyles` / `defaultDarkThemeStyles` in
 * config/theme.ts). Pure data, no imports: config/theme.ts imports this file.
 *
 * Fonts: the app shell's file says `"Geist Variable", "Geist", …`; theme:apply adds the "Variable" name itself
 * (theme-generator-krav.md 2.4), so the generator stores plain `"Geist"`.
 */

const shared = {
  "font-sans": '"Geist", ui-sans-serif, system-ui, sans-serif',
  "font-serif": 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  "font-mono": 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  radius: "0.625rem",
  "shadow-color": "oklch(0 0 0)",
  "shadow-opacity": "0.1",
  "shadow-blur": "3px",
  "shadow-spread": "0px",
  "shadow-offset-x": "0",
  "shadow-offset-y": "1px",
  "letter-spacing": "0em",
  spacing: "0.25rem",
};

export const appShellLightStyles = {
  background: "oklch(1 0 0)",
  foreground: "oklch(0.145 0 0)",
  card: "oklch(1 0 0)",
  "card-foreground": "oklch(0.145 0 0)",
  popover: "oklch(1 0 0)",
  "popover-foreground": "oklch(0.145 0 0)",
  primary: "oklch(0.205 0 0)",
  "primary-foreground": "oklch(0.985 0 0)",
  secondary: "oklch(0.97 0 0)",
  "secondary-foreground": "oklch(0.205 0 0)",
  muted: "oklch(0.97 0 0)",
  "muted-foreground": "oklch(0.52 0 0)",
  accent: "oklch(0.97 0 0)",
  "accent-foreground": "oklch(0.205 0 0)",
  destructive: "oklch(0.53 0.22 27)",
  "destructive-foreground": "oklch(0.985 0 0)",
  border: "oklch(0.922 0 0)",
  input: "oklch(0.922 0 0)",
  ring: "oklch(0.62 0 0)",
  "chart-1": "oklch(0.55 0.2 262)",
  "chart-2": "oklch(0.6 0.12 200)",
  "chart-3": "oklch(0.63 0.17 50)",
  "chart-4": "oklch(0.55 0.2 305)",
  "chart-5": "oklch(0.6 0.15 150)",
  sidebar: "oklch(0.985 0 0)",
  "sidebar-foreground": "oklch(0.145 0 0)",
  "sidebar-primary": "oklch(0.205 0 0)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.97 0 0)",
  "sidebar-accent-foreground": "oklch(0.205 0 0)",
  "sidebar-border": "oklch(0.922 0 0)",
  "sidebar-ring": "oklch(0.62 0 0)",
  ...shared,
};

export const appShellDarkStyles = {
  background: "oklch(0.145 0 0)",
  foreground: "oklch(0.985 0 0)",
  card: "oklch(0.205 0 0)",
  "card-foreground": "oklch(0.985 0 0)",
  popover: "oklch(0.205 0 0)",
  "popover-foreground": "oklch(0.985 0 0)",
  primary: "oklch(0.922 0 0)",
  "primary-foreground": "oklch(0.205 0 0)",
  secondary: "oklch(0.269 0 0)",
  "secondary-foreground": "oklch(0.985 0 0)",
  muted: "oklch(0.269 0 0)",
  "muted-foreground": "oklch(0.708 0 0)",
  accent: "oklch(0.269 0 0)",
  "accent-foreground": "oklch(0.985 0 0)",
  destructive: "oklch(0.704 0.191 22.216)",
  "destructive-foreground": "oklch(0.145 0 0)",
  border: "oklch(1 0 0 / 10%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.556 0 0)",
  "chart-1": "oklch(0.68 0.16 262)",
  "chart-2": "oklch(0.72 0.12 200)",
  "chart-3": "oklch(0.74 0.16 60)",
  "chart-4": "oklch(0.68 0.17 305)",
  "chart-5": "oklch(0.72 0.17 150)",
  sidebar: "oklch(0.205 0 0)",
  "sidebar-foreground": "oklch(0.985 0 0)",
  "sidebar-primary": "oklch(0.54 0.2 264)",
  "sidebar-primary-foreground": "oklch(0.985 0 0)",
  "sidebar-accent": "oklch(0.269 0 0)",
  "sidebar-accent-foreground": "oklch(0.985 0 0)",
  "sidebar-border": "oklch(1 0 0 / 10%)",
  "sidebar-ring": "oklch(0.556 0 0)",
  ...shared,
};
