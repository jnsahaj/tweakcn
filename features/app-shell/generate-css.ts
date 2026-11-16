/**
 * Tailwind v4 CSS exports (theme-generator-krav.md 1–2):
 *
 * - "app-shell": only `:root { … }` and `.dark { … }` with values. The app shell's own globals.css owns
 *   `@import "tailwindcss"`, `@custom-variant`, `@theme inline` and `@layer base`.
 * - "standalone": the same blocks wrapped in a full globals.css whose `@theme inline` matches the app
 *   shell's mapping exactly (7 radius steps, --font-heading, tracking scale).
 *
 * The editor's live check runs on the app-shell output, so what you see in the editor is what
 * `npm run theme:check` reports for the exported file.
 */
import { parse } from "culori";

import { defaultThemeState } from "@/config/theme";
import type { ColorFormat } from "@/types";
import type { ThemeEditorState } from "@/types/editor";
import type { ThemeStyleProps } from "@/types/theme";
import { colorFormatter } from "@/utils/color-converter";

import { formatFontStack } from "./font-stack";
import { asLength, VAR_SHADOWS } from "./shadows";

export type CssExportVariant = "app-shell" | "standalone";
type Mode = "light" | "dark";

/** Optional colours (app shell `COLOR_FALLBACKS`): exported only when set. */
export const OPTIONAL_COLOR_KEYS = ["brand", "brand-foreground"] as const satisfies readonly (keyof ThemeStyleProps)[];

export const COLOR_KEYS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
] as const satisfies readonly (keyof ThemeStyleProps)[];

const SHADOW_NAMES = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
] as const;

function stylesFor(state: ThemeEditorState, mode: Mode): ThemeStyleProps {
  return { ...defaultThemeState.styles[mode], ...state.styles[mode] };
}

/** --font-heading is exported only when it is set and differs from --font-sans. */
export function headingFont(styles: ThemeStyleProps): string | null {
  const heading = styles["font-heading"]?.trim();
  if (!heading) return null;
  const sans = formatFontStack(styles["font-sans"], "font-sans");
  const formatted = formatFontStack(heading, "font-heading");
  return formatted === sans ? null : formatted;
}

function block(state: ThemeEditorState, mode: Mode, formatColor: (c: string) => string): string {
  const s = stylesFor(state, mode);
  const light = stylesFor(state, "light");
  const lines: string[] = [];
  const v = (name: string, value: string) => lines.push(`  --${name}: ${value};`);

  for (const key of COLOR_KEYS) v(key, formatColor(s[key]));
  // Optional: without them the app shell falls back to primary / primary-foreground
  for (const key of OPTIONAL_COLOR_KEYS) {
    const value = s[key];
    if (value) v(key, formatColor(value));
  }

  v("font-sans", formatFontStack(s["font-sans"], "font-sans"));
  v("font-serif", formatFontStack(s["font-serif"], "font-serif"));
  v("font-mono", formatFontStack(s["font-mono"], "font-mono"));
  const heading = headingFont(s);
  if (heading) v("font-heading", heading);

  v("radius", s.radius);

  v("shadow-x", asLength(s["shadow-offset-x"]));
  v("shadow-y", asLength(s["shadow-offset-y"]));
  v("shadow-blur", asLength(s["shadow-blur"]));
  v("shadow-spread", asLength(s["shadow-spread"]));
  v("shadow-opacity", s["shadow-opacity"]);
  v("shadow-color", formatColor(s["shadow-color"]));
  for (const name of SHADOW_NAMES) v(name, VAR_SHADOWS[name]);

  if (mode === "light") {
    v("tracking-normal", light["letter-spacing"] ?? defaultThemeState.styles.light["letter-spacing"]);
    v("spacing", light.spacing ?? defaultThemeState.styles.light.spacing ?? "0.25rem");
  }

  return `${mode === "dark" ? ".dark" : ":root"} {\n${lines.join("\n")}\n}`;
}

/** The app shell's `@theme inline` mapping (theme-generator-krav.md 2.1), verbatim. */
export const APP_SHELL_THEME_INLINE = `@theme inline {
${COLOR_KEYS.map((k) => `  --color-${k}: var(--${k});`).join("\n")}
  --color-brand: var(--brand, var(--primary));
  --color-brand-foreground: var(--brand-foreground, var(--primary-foreground));

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --font-heading: var(--font-heading, var(--font-sans));

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

${SHADOW_NAMES.map((n) => `  --${n}: var(--${n});`).join("\n")}

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}`;

/** tweakcn's colorFormatter, but a colour with alpha keeps it (`oklch(1 0 0 / 0.1)`). */
export function formatColor(value: string, format: ColorFormat): string {
  const out = colorFormatter(value, format, "4");
  const alpha = parse(value)?.alpha;
  if (alpha === undefined || alpha >= 1 || !/^(oklch|hsl)\(.*\)$/.test(out)) return out;
  return out.replace(/\)$/, ` / ${Number(alpha.toFixed(4))})`);
}

export function generateTailwindV4Css(
  state: ThemeEditorState,
  variant: CssExportVariant,
  colorFormat: ColorFormat = "oklch"
): string {
  const format = (c: string) => formatColor(c, variant === "app-shell" ? "oklch" : colorFormat);
  const blocks = `${block(state, "light", format)}\n\n${block(state, "dark", format)}\n`;
  if (variant === "app-shell") return blocks;

  return `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

${blocks}
${APP_SHELL_THEME_INLINE}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    letter-spacing: var(--tracking-normal);
  }
}
`;
}
