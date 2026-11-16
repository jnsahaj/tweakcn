/**
 * Live theme check in the editor. Runs the app shell's own rules (scripts/theme/rules.mjs, shared with
 * the app shell repo) on exactly the CSS the "App shell" export produces, so the editor and
 * `npm run theme:check` always agree.
 *
 * Generator-only extra: a font check against the Fontsource list (theme-generator-krav.md 2.4).
 */
import { FONT_TOKENS, parseTheme } from "@/scripts/theme/lib.mjs";
import { checkTheme } from "@/scripts/theme/rules.mjs";
import { defaultThemeState } from "@/config/theme";
import type { ThemeEditorState } from "@/types/editor";
import type { ThemeStyleProps, ThemeStyles } from "@/types/theme";

import { fontsourceAvailability, primaryCustomFamily } from "./font-stack";
import { generateTailwindV4Css } from "./generate-css";

export type CheckStatus = "pass" | "fail" | "warn" | "info";
export type CheckMode = "light" | "dark";

export type CheckResult = {
  status: CheckStatus;
  /** "lyst" | "mørkt" | "–", as theme:check prints it. */
  mode: string;
  modeKey: CheckMode | null;
  check: string;
  detail: string;
  /** Editor style keys the result is about (e.g. "primary", "shadow-opacity", "letter-spacing"). */
  tokens: string[];
};

export type ThemeCheckSummary = {
  issues: CheckResult[];
  fails: number;
  warns: number;
  /** Non-passing results per editor key. */
  byToken: Record<string, CheckResult[]>;
};

/** Exported CSS variable name → editor style key, where they differ. */
const EDITOR_KEY: Record<string, string> = {
  "shadow-x": "shadow-offset-x",
  "shadow-y": "shadow-offset-y",
  "tracking-normal": "letter-spacing",
};
const toEditorKey = (token: string) => EDITOR_KEY[token] ?? token;

function fontResults(styles: ThemeStyles): CheckResult[] {
  const light: ThemeStyleProps = { ...defaultThemeState.styles.light, ...styles.light };
  const out: CheckResult[] = [];
  for (const token of FONT_TOKENS as string[]) {
    const family = primaryCustomFamily(light[token as keyof ThemeStyleProps] as string | undefined);
    if (!family) continue;
    const availability = fontsourceAvailability(family);
    if (availability === "variable") continue;
    out.push({
      status: availability === "static" ? "info" : "warn",
      mode: "–",
      modeKey: null,
      check: "Font på Fontsource",
      detail:
        availability === "static"
          ? `"${family}" findes kun statisk på Fontsource (ingen variabel version) – virker, men kun med de vægte, der er udgivet`
          : `"${family}" findes ikke på Fontsource – theme:apply kan ikke installere den, så den kræver manuelt arbejde i app shell'en`,
      tokens: [token],
    });
  }
  return out;
}

export function runThemeCheck(state: Pick<ThemeEditorState, "styles">): CheckResult[] {
  const css = generateTailwindV4Css(state as ThemeEditorState, "app-shell");
  const results = checkTheme(parseTheme(css), "theme.css") as CheckResult[];
  return [
    ...results.map((r) => ({ ...r, tokens: (r.tokens ?? []).map(toEditorKey) })),
    ...fontResults(state.styles),
  ];
}

const ORDER: Record<CheckStatus, number> = { fail: 0, warn: 1, info: 2, pass: 3 };

export function summarize(results: CheckResult[]): ThemeCheckSummary {
  const issues = results.filter((r) => r.status !== "pass").sort((a, b) => ORDER[a.status] - ORDER[b.status]);
  const byToken: Record<string, CheckResult[]> = {};
  for (const r of issues) for (const t of r.tokens) (byToken[t] ??= []).push(r);
  return {
    issues,
    fails: issues.filter((r) => r.status === "fail").length,
    warns: issues.filter((r) => r.status === "warn").length,
    byToken,
  };
}

const cache = new WeakMap<object, ThemeCheckSummary>();

/** Memoised per styles object, so every token row can ask without re-running the check. */
export function themeCheckFor(styles: ThemeStyles): ThemeCheckSummary {
  let hit = cache.get(styles);
  if (!hit) {
    hit = summarize(runThemeCheck({ styles }));
    cache.set(styles, hit);
  }
  return hit;
}
