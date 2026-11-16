/**
 * Recreates the app shell's test themes (themes/test-N.css) in the generator, fixes their theme:check
 * ERRORS by changing lightness only (hue and chroma kept; chroma only drops if sRGB needs it), and
 * exports them as "App shell" CSS.
 *
 *   npx tsx features/app-shell/dev/test-themes.ts            # print the before/after list
 *   npx tsx features/app-shell/dev/test-themes.ts --write    # also write exports/test-N.css
 *
 * Warnings are left alone on purpose (e.g. test-3's black/white destructive), so they stay visible.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { converter, parse, toGamut } from "culori";

import { parseTheme } from "@/scripts/theme/lib.mjs";
import { defaultThemeState } from "@/config/theme";
import type { ThemeStyleProps, ThemeStyles } from "@/types/theme";

import { generateTailwindV4Css } from "../generate-css";
import { runThemeCheck, type CheckResult } from "../theme-check";

const ROOT = process.cwd(); // run from the repo root
const toOklch = converter("oklch");
const toRgb = toGamut("rgb", "oklch");

type Mode = "light" | "dark";

/** CSS variable → editor style key, where they differ. */
const KEY: Record<string, string> = {
  "shadow-x": "shadow-offset-x",
  "shadow-y": "shadow-offset-y",
  "tracking-normal": "letter-spacing",
};
const IGNORE = /^shadow-(2xs|xs|sm|md|lg|xl|2xl)$|^shadow$/; // computed by the generator

/** A theme file as the generator would hold it (original colour strings, no hex round-trip). */
export function stylesFromCss(css: string): ThemeStyles {
  const theme = parseTheme(css);
  const toProps = (block: Map<string, string>, base: Partial<ThemeStyleProps>) => {
    const out: Record<string, string> = { ...defaultThemeState.styles.light, ...base };
    for (const [k, v] of block) if (!IGNORE.test(k)) out[KEY[k] ?? k] = v;
    return out as ThemeStyleProps;
  };
  const light = toProps(theme.root, {});
  const dark = toProps(theme.dark, light); // .dark inherits what it doesn't set
  return { light, dark };
}

const fmt = (n: number) => Number(n.toFixed(4)).toString();
const lightness = (value: string) => toOklch(parse(value)!)!.l;

function withLightness(value: string, l: number): string {
  const o = toOklch(parse(value)!)!;
  const mapped = toOklch(toRgb({ ...o, l }))!;
  const c = mapped.c ?? 0;
  // Achromatic colours (white/black/grey) have no meaningful hue.
  return `oklch(${fmt(mapped.l)} ${c < 0.0005 ? "0" : fmt(c)} ${c < 0.0005 ? "0" : fmt(mapped.h ?? 0)})`;
}

const fails = (styles: ThemeStyles) => runThemeCheck({ styles }).filter((r) => r.status === "fail");
const same = (a: CheckResult, b: CheckResult) => a.modeKey === b.modeKey && a.check === b.check;

/** Which token to move: the foreground of a pair; for chart duplicates, the higher-numbered chart. */
function targetOf(r: CheckResult): string | null {
  if (r.check.startsWith("Graffarver")) return [...r.tokens].sort().at(-1) ?? null;
  if (/^(Tekst|Grafik):/.test(r.check)) return r.tokens[0];
  return null;
}

export type Change = { mode: Mode; token: string; before: string; after: string; reason: string };

/**
 * Fix one failing check by moving the target's lightness as little as possible. Checks where the target
 * is the foreground must not start failing (pairs where it is the background are fixed next round).
 */
function fixOne(
  styles: ThemeStyles,
  failure: CheckResult,
  token = targetOf(failure)
): { styles: ThemeStyles; change: Change } | null {
  const mode = failure.modeKey;
  if (!token || !mode) return null;
  const before = styles[mode][token as keyof ThemeStyleProps] as string;
  const l0 = lightness(before);
  const baseline = runThemeCheck({ styles });
  const protectedPassing = baseline.filter((r) => r.status === "pass" && r.modeKey === mode && r.tokens[0] === token);

  const candidates: number[] = [];
  for (let d = 0.0025; d <= 1; d += 0.0025) candidates.push(l0 - d, l0 + d);
  for (const l of candidates) {
    if (l < 0 || l > 1) continue;
    const after = withLightness(before, l);
    const next: ThemeStyles = { ...styles, [mode]: { ...styles[mode], [token]: after } };
    const results = runThemeCheck({ styles: next });
    const target = results.find((r) => same(r, failure) || (failure.check.startsWith("Graffarver") && r.modeKey === mode && r.check === failure.check));
    if (target && target.status === "fail") continue;
    if (protectedPassing.some((p) => results.find((r) => same(r, p))?.status === "fail")) continue;
    return {
      styles: next,
      change: { mode, token, before, after, reason: `${failure.check} (${failure.detail.split(" – ")[0]})` },
    };
  }
  return null;
}

function mirror(original: ThemeStyles, styles: ThemeStyles, failure: CheckResult) {
  const mode = failure.modeKey;
  if (!mode) return null;
  const copies = failure.tokens.filter((t) => {
    const base = t.replace(/^sidebar-/, "");
    const key = (k: string) => original[mode][k as keyof ThemeStyleProps];
    return t.startsWith("sidebar-") && base !== "sidebar" && key(t) === key(base) && styles[mode][base as keyof ThemeStyleProps] !== key(base);
  });
  if (!copies.length) return null;
  const changes: Change[] = [];
  let next = styles;
  for (const t of copies) {
    const after = styles[mode][t.replace(/^sidebar-/, "") as keyof ThemeStyleProps] as string;
    const before = next[mode][t as keyof ThemeStyleProps] as string;
    next = { ...next, [mode]: { ...next[mode], [t]: after } };
    changes.push({ mode, token: t, before, after, reason: `følger ${t.replace(/^sidebar-/, "")}; ${failure.check}` });
  }
  const still = runThemeCheck({ styles: next }).find((r) => same(r, failure));
  return still?.status === "fail" ? null : { styles: next, changes };
}

export function fixErrors(input: ThemeStyles): { styles: ThemeStyles; changes: Change[]; unfixed: CheckResult[] } {
  let styles = input;
  const changes: Change[] = [];
  for (let round = 0; round < 40; round++) {
    const open = fails(styles);
    if (!open.length) break;
    // Surfaces first: move colours that sit on backgrounds before their *-foreground partners.
    const next =
      open.find((r) => targetOf(r) && !targetOf(r)!.endsWith("-foreground")) ?? open.find((r) => targetOf(r));
    if (!next) break;
    // Sidebar tokens that started as copies of their base token (sidebar-primary = primary) follow the
    // base token's fix, so the sidebar and the main UI stay alike.
    const mirrored = mirror(input, styles, next);
    if (mirrored) {
      styles = mirrored.styles;
      changes.push(...mirrored.changes);
      continue;
    }
    // For "X-foreground on X", either side may move: take the smaller lightness change, so e.g. white text
    // on a too-light button keeps being white when darkening the button is enough (and allowed).
    const options = [fixOne(styles, next)];
    if (targetOf(next)!.endsWith("-foreground") && next.tokens[1]) options.push(fixOne(styles, next, next.tokens[1]));
    const delta = (o: NonNullable<(typeof options)[number]>) =>
      Math.abs(lightness(o.change.after) - lightness(o.change.before));
    const fixed = options
      .filter((o): o is NonNullable<typeof o> => !!o)
      .sort((a, b) => delta(a) - delta(b))[0];
    if (!fixed) break;
    styles = fixed.styles;
    const prev = changes.find((c) => c.mode === fixed.change.mode && c.token === fixed.change.token);
    if (prev) {
      prev.after = fixed.change.after;
      prev.reason += `; ${fixed.change.reason}`;
    } else changes.push(fixed.change);
  }
  return { styles, changes, unfixed: fails(styles) };
}

/**
 * Hand-picked values approved by Jacob, applied after the automatic fixes. These may change hue.
 * test-2 light: chart-4 was a lightness-shifted copy of grey chart-2 (still indistinguishable in a chart);
 * a dusty blue at the dark theme's accent hue, same lightness as the other charts.
 */
export const OVERRIDES: Record<number, Partial<Record<Mode, Record<string, string>>>> = {
  2: { light: { "chart-4": "oklch(0.55 0.1 232)" } },
};

export function fixTestTheme(n: number, original: ThemeStyles) {
  const fixed = fixErrors(original);
  let styles = fixed.styles;
  const changes = [...fixed.changes];
  for (const [mode, tokens] of Object.entries(OVERRIDES[n] ?? {}) as [Mode, Record<string, string>][]) {
    for (const [token, after] of Object.entries(tokens)) {
      const prev = changes.find((c) => c.mode === mode && c.token === token);
      if (prev) {
        prev.after = after;
        prev.reason += "; ny farvetone (godkendt undtagelse)";
      } else {
        const before = original[mode][token as keyof ThemeStyleProps] as string;
        changes.push({ mode, token, before, after, reason: "ny farvetone (godkendt undtagelse)" });
      }
      styles = { ...styles, [mode]: { ...styles[mode], [token]: after } };
    }
  }
  return { styles, changes, unfixed: fails(styles) };
}

// --- CLI ----------------------------------------------------------------------------------------

if (process.argv[1]?.endsWith("test-themes.ts")) {
  const write = process.argv.includes("--write");
  for (const n of [1, 2, 3]) {
    const css = readFileSync(resolve(ROOT, `themes/test-${n}.css`), "utf8");
    const original = stylesFromCss(css);
    const before = runThemeCheck({ styles: original });
    const { styles, changes, unfixed } = fixTestTheme(n, original);
    const after = runThemeCheck({ styles });
    const count = (rs: CheckResult[], s: string) => rs.filter((r) => r.status === s).length;

    console.log(`\n## test-${n}.css`);
    console.log(
      `Før: ${count(before, "fail")} fejl, ${count(before, "warn")} advarsler · Efter: ${count(after, "fail")} fejl, ${count(after, "warn")} advarsler\n`
    );
    console.log("| Tema | Token | Før | Efter | ΔL | Retter |");
    console.log("|---|---|---|---|---|---|");
    for (const c of changes) {
      const dl = lightness(c.after) - lightness(c.before);
      console.log(
        `| ${c.mode === "light" ? "Lyst" : "Mørkt"} | \`${c.token}\` | \`${c.before}\` | \`${c.after}\` | ${dl > 0 ? "+" : ""}${dl.toFixed(3)} | ${c.reason} |`
      );
    }
    for (const r of unfixed) console.log(`IKKE RETTET: ${r.mode} ${r.check} ${r.detail}`);

    if (write) {
      mkdirSync(resolve(ROOT, "exports"), { recursive: true });
      writeFileSync(resolve(ROOT, `exports/test-${n}.css`), generateTailwindV4Css({ styles } as never, "app-shell"));
    }
  }
}
