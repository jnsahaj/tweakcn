/**
 * Font stacks in the format the app shell expects (theme-generator-krav.md 1.3):
 * family names in double quotes, followed by a full fallback stack, e.g.
 * `"Oxanium", ui-sans-serif, system-ui, sans-serif`.
 */
import families from "./fontsource-families.json";

export type FontKind = "sans" | "serif" | "mono";

export const FALLBACK_STACKS: Record<FontKind, string> = {
  sans: "ui-sans-serif, system-ui, sans-serif",
  serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

/** CSS keywords that must stay unquoted (generic families and system-font keywords). */
const KEYWORDS = new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "emoji",
  "math",
  "fangsong",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "-apple-system",
  "blinkmacsystemfont",
]);

/** System fonts that are never loaded (mirrors SYSTEM_FONTS in scripts/theme/lib.mjs). */
const SYSTEM_FAMILIES = new Set([
  ...KEYWORDS,
  "segoe ui",
  "helvetica neue",
  "helvetica",
  "arial",
  "noto sans",
  "georgia",
  "cambria",
  "times new roman",
  "times",
  "sfmono-regular",
  "menlo",
  "monaco",
  "consolas",
  "liberation mono",
  "courier new",
  "apple color emoji",
  "segoe ui emoji",
  "segoe ui symbol",
  "noto color emoji",
]);

const unquote = (s: string) => s.trim().replace(/^["']|["']$/g, "").trim();

export function splitStack(value: string): string[] {
  const out: string[] = [];
  let quote: string | null = null;
  let cur = "";
  for (const ch of value) {
    if (quote) {
      if (ch === quote) quote = null;
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === ",") {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map(unquote).filter(Boolean);
}

const isKeyword = (name: string) => KEYWORDS.has(name.toLowerCase());
const formatName = (name: string) => (isKeyword(name) ? name : `"${name}"`);

/** Which fallback stack a font value belongs to: from its generic family, else from the token. */
export function fontKind(value: string, token: string): FontKind {
  const names = splitStack(value).map((n) => n.toLowerCase());
  if (names.includes("monospace") || names.includes("ui-monospace")) return "mono";
  if (names.includes("sans-serif") || names.includes("ui-sans-serif") || names.includes("system-ui"))
    return "sans";
  if (names.includes("serif") || names.includes("ui-serif")) return "serif";
  if (token === "font-mono") return "mono";
  if (token === "font-serif") return "serif";
  return "sans";
}

/**
 * Quote family names and give a custom font the full fallback stack for its kind.
 * A pure system stack (starts with a keyword) keeps its order; only the quoting is normalised.
 */
export function formatFontStack(value: string, token: string): string {
  const names = splitStack(value ?? "");
  if (!names.length) return value;
  if (isKeyword(names[0]) || SYSTEM_FAMILIES.has(names[0].toLowerCase())) {
    return names.map(formatName).join(", ");
  }
  const firstKeyword = names.findIndex(isKeyword);
  const custom = firstKeyword === -1 ? names : names.slice(0, firstKeyword);
  return [...custom.map(formatName), FALLBACK_STACKS[fontKind(value, token)]].join(", ");
}

/** The first family in a stack, or null for a system stack. */
export function primaryCustomFamily(value: string | undefined): string | null {
  const first = splitStack(value ?? "")[0];
  if (!first || SYSTEM_FAMILIES.has(first.toLowerCase())) return null;
  return first;
}

const FONTSOURCE = families as Record<string, 0 | 1>;

/** "variable" / "static" if the family is on Fontsource, otherwise null. */
export function fontsourceAvailability(family: string): "variable" | "static" | null {
  const base = family.replace(/\s+Variable$/, "");
  const hit = FONTSOURCE[base] ?? FONTSOURCE[Object.keys(FONTSOURCE).find((k) => k.toLowerCase() === base.toLowerCase()) ?? ""];
  if (hit === undefined) return null;
  return hit ? "variable" : "static";
}
