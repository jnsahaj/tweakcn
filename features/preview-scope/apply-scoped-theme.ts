import {
  COMMON_STYLES,
  PER_MODE_STYLES,
  defaultDarkThemeStyles,
  defaultLightThemeStyles,
  defaultThemeState,
} from "@/config/theme";
import { OPTIONAL_COLOR_KEYS, formatColor } from "@/features/app-shell/generate-css";
import type { ThemeEditorState } from "@/types/editor";
import { applyStyleToElement } from "@/utils/apply-style-to-element";
import { getShadowMap } from "@/utils/shadows";

const isCommon = (key: string) => (COMMON_STYLES as readonly string[]).includes(key);

/**
 * Write a theme's CSS variables onto one element (and nothing else).
 *
 * Same output as tweakcn's `applyThemeToElement`, but without its side effects on the document root
 * (dark class, shadow variables), so it can scope a theme to the preview area only.
 */
export function applyScopedTheme(themeState: ThemeEditorState, element: HTMLElement) {
  const mode = themeState.currentMode;
  const light = { ...defaultThemeState.styles.light, ...themeState.styles.light };
  const current = { ...defaultThemeState.styles[mode], ...themeState.styles[mode] };

  for (const [key, value] of Object.entries(light)) {
    if (isCommon(key) && typeof value === "string") {
      // Per-mode keys (shadow opacity) come from the current mode.
      const own = PER_MODE_STYLES.includes(key) ? current[key as keyof typeof current] : value;
      applyStyleToElement(element, key, typeof own === "string" ? own : value);
    }
  }
  // Optional heading font: without it, --font-heading falls back to --font-sans in CSS.
  if (!light["font-heading"]) element.style.removeProperty("--font-heading");
  for (const [key, value] of Object.entries(current)) {
    if (!isCommon(key) && typeof value === "string") {
      // formatColor keeps alpha (e.g. dark borders `oklch(1 0 0 / 10%)`); tweakcn's formatter drops it.
      applyStyleToElement(element, key, formatColor(value, "hsl"));
    }
  }
  // Optional brand colours: without them the preview falls back to primary in CSS.
  for (const key of OPTIONAL_COLOR_KEYS) {
    if (!current[key]) element.style.removeProperty(`--${key}`);
  }
  for (const [name, value] of Object.entries(getShadowMap(themeState))) {
    applyStyleToElement(element, name, value);
  }
}

/** The editor chrome's fixed theme: tweakcn's default neutral theme, in the current light/dark mode. */
export function neutralEditorState(themeState: ThemeEditorState): ThemeEditorState {
  return {
    ...themeState,
    // tweakcn's neutral theme, not the generator's default for new themes (the app shell theme).
    styles: { light: defaultLightThemeStyles, dark: defaultDarkThemeStyles },
    hslAdjustments: defaultThemeState.hslAdjustments,
  };
}
