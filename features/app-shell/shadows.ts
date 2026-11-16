/**
 * Shadow tokens built from the shadow variables (theme-generator-krav.md 2.3), so editing
 * --shadow-color / --shadow-opacity in the exported file still works. Alpha never exceeds 1.
 *
 * Same sizes and opacity multipliers as tweakcn's `utils/shadows.ts` (which the preview uses).
 */

const color = (multiplier: number) => {
  const pct =
    multiplier === 1
      ? "calc(var(--shadow-opacity) * 100%)"
      : multiplier < 1
        ? `calc(var(--shadow-opacity) * ${multiplier * 100}%)`
        : `calc(min(1, var(--shadow-opacity) * ${multiplier}) * 100%)`;
  return `color-mix(in oklab, var(--shadow-color) ${pct}, transparent)`;
};

const base = (multiplier: number) =>
  `var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread) ${color(multiplier)}`;

const second = (offsetY: string, blur: string) =>
  `var(--shadow-x) ${offsetY} ${blur} calc(var(--shadow-spread) - 1px) ${color(1)}`;

export const VAR_SHADOWS: Record<string, string> = {
  "shadow-2xs": base(0.5),
  "shadow-xs": base(0.5),
  "shadow-sm": `${base(1)}, ${second("1px", "2px")}`,
  shadow: `${base(1)}, ${second("1px", "2px")}`,
  "shadow-md": `${base(1)}, ${second("2px", "4px")}`,
  "shadow-lg": `${base(1)}, ${second("4px", "6px")}`,
  "shadow-xl": `${base(1)}, ${second("8px", "10px")}`,
  "shadow-2xl": base(2.5),
};

/** A length for use inside calc(): bare numbers get "px" ("0" → "0px"). */
export const asLength = (value: string | undefined, fallback = "0px") => {
  const v = (value ?? "").trim();
  if (!v) return fallback;
  return /^-?[\d.]+$/.test(v) ? `${v}px` : v;
};
