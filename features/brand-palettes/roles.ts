/**
 * Roles: assign brand palettes to Primary / Secondary / Neutral / Destructive, and every shadcn colour
 * token follows a rule (role + step per mode, with contrast checks). Pure module.
 *
 * State lives in `brandRoles` on the editor state:
 * - `assignments`: role → palette id
 * - `auto[mode][token]`: what the rule last wrote (value, brand ref, label, warning)
 * - `manual[mode]`: tokens the user has taken over
 *
 * A token is detected as Manual when its current value differs from what the rule last wrote, unless
 * it still points to the same brand step (a palette edit moved the value, not the user). Manual tokens
 * keep their value through role changes until reset to Auto.
 */
import { toGamut, wcagContrast, type Color } from "culori";
import { createPalette, getActiveRef, refFor, type BrandState } from "./palette";
import { SCALE_STEPS, type ScaleStep } from "./scale";
import type { BrandPalette, BrandRefs, Mode } from "./types";

export const ROLES = ["primary", "secondary", "neutral", "destructive"] as const;
export type RoleId = (typeof ROLES)[number];

export const ROLE_LABELS: Record<RoleId, string> = {
  primary: "Primary",
  secondary: "Secondary",
  neutral: "Neutral",
  destructive: "Destructive",
};

export const WHITE = "oklch(1 0 0)";
/** WCAG thresholds */
export const TEXT_CONTRAST = 4.5;
export const UI_CONTRAST = 3;

type StepPick = ScaleStep | "anchor";
/**
 * What a colour must contrast with: another token, or the colour itself at `tint` alpha over a token
 * (how the app shell draws destructive badges: `bg-destructive/10`, dark `/20`, with destructive text).
 */
type Against = string | { tint: number; over: string };
/** Contrast is measured against every entry in `against`; the lowest ratio must reach `ratio`. */
type MinContrast = { against: Against | Against[]; ratio: number; towards: "lighter" | "darker" };

export type ModeRule =
  /** a step of the role's palette; optionally walk lighter/darker until it contrasts enough with another token */
  | {
      kind: "step";
      pick: StepPick;
      min?: MinContrast;
      warnBelow?: { against: string; ratio: number };
      whiteOption?: boolean;
      /** skip steps whose value equals one of these tokens (keeps chart series apart while walking) */
      avoid?: string[];
      /** last step the walk may reach (keeps a colour recognisable instead of fading to white/black) */
      limit?: ScaleStep;
    }
  /** a foreground for `on`: `prefer` if it reaches 4.5:1, else the best of white / 50 / 950 */
  | { kind: "on"; on: string; prefer?: ScaleStep }
  /** same value (and reference) as another token */
  | { kind: "mirror"; token: string };

export type TokenRule = { role: RoleId; light: ModeRule; dark: ModeRule };

const step = (pick: StepPick, extra: Partial<Extract<ModeRule, { kind: "step" }>> = {}): ModeRule => ({
  kind: "step",
  pick,
  ...extra,
});
const on = (token: string, prefer?: ScaleStep): ModeRule => ({ kind: "on", on: token, prefer });
const mirror = (token: string): ModeRule => ({ kind: "mirror", token });
const darkUI = (against: Against | Against[] = "background"): MinContrast => ({
  against,
  ratio: UI_CONTRAST,
  towards: "lighter",
});
const lightUI = (against: Against | Against[] = "background"): MinContrast => ({
  against,
  ratio: UI_CONTRAST,
  towards: "darker",
});
const darkText = (against: Against | Against[]): MinContrast => ({ against, ratio: TEXT_CONTRAST, towards: "lighter" });
const lightText = (against: Against | Against[]): MinContrast => ({ against, ratio: TEXT_CONTRAST, towards: "darker" });

/**
 * The surfaces each token is drawn on in the app shell. Must match the pairs in
 * scripts/theme/rules.mjs (TEXT_PAIRS / GRAPHIC_PAIRS), or exported themes fail theme:check.
 */
const MUTED_TEXT_ON: Against[] = ["background", "muted", "card"];
const chart = (role: RoleId, light: ScaleStep, dark: ScaleStep, avoid: string[] = []): TokenRule => ({
  role,
  light: step(light, { min: lightUI("card"), avoid }),
  dark: step(dark, { min: darkUI("card"), avoid }),
});

/**
 * Default rules, in resolution order (a rule may only depend on tokens listed above it).
 * Final table documented in docs/DECISIONS.md ("Token rules").
 */
export const TOKEN_RULES: Record<string, TokenRule> = {
  background: { role: "neutral", light: step(50, { whiteOption: true }), dark: step(950) },
  card: { role: "neutral", light: step(50, { whiteOption: true }), dark: step(900) },
  popover: { role: "neutral", light: step(50, { whiteOption: true }), dark: step(900) },
  foreground: { role: "neutral", light: step(950), dark: step(50) },
  "card-foreground": { role: "neutral", light: step(950), dark: step(50) },
  "popover-foreground": { role: "neutral", light: step(950), dark: step(50) },
  muted: { role: "neutral", light: step(100), dark: step(800) },
  "muted-foreground": {
    role: "neutral",
    light: step(600, { min: lightText(MUTED_TEXT_ON) }),
    dark: step(400, { min: darkText(MUTED_TEXT_ON) }),
  },
  border: { role: "neutral", light: step(200), dark: step(800) },
  input: { role: "neutral", light: step(200), dark: step(800) },

  // brand = the exact brand colour, for buttons and badges (app shell `bg-brand`). primary is used for
  // text, links and small controls on the page, so it walks from the brand colour until it reads as text.
  brand: { role: "primary", light: step("anchor"), dark: step("anchor") },
  "brand-foreground": { role: "primary", light: on("brand"), dark: on("brand") },
  primary: {
    role: "primary",
    light: step("anchor", { min: lightText("background") }),
    dark: step("anchor", { min: darkText("background") }),
  },
  "primary-foreground": { role: "primary", light: on("primary"), dark: on("primary") },
  ring: { role: "primary", light: step(400), dark: step(500) },

  secondary: { role: "secondary", light: step(100), dark: step(800) },
  "secondary-foreground": { role: "secondary", light: on("secondary", 900), dark: on("secondary", 100) },
  accent: { role: "secondary", light: step(100), dark: step(800) },
  "accent-foreground": { role: "secondary", light: on("accent", 900), dark: on("accent", 100) },

  destructive: {
    role: "destructive",
    // error text on the page, and destructive text on its own tint (badges, outline buttons)
    // stops at 800 / 200: past that red turns into near-black / near-white and stops reading as an error
    light: step(600, { min: lightText(["background", { tint: 0.1, over: "background" }]), limit: 800 }),
    dark: step(400, { min: darkText(["background", { tint: 0.2, over: "background" }]), limit: 200 }),
  },
  "destructive-foreground": { role: "destructive", light: on("destructive"), dark: on("destructive") },

  // Series alternate palette and lightness so neighbours are easy to tell apart. Each walks until it
  // reaches 3:1 on card, skipping steps an earlier series of the same palette already uses.
  "chart-1": chart("primary", 600, 400),
  "chart-2": chart("secondary", 400, 300),
  "chart-3": chart("primary", 800, 200, ["chart-1"]),
  "chart-4": chart("secondary", 700, 600, ["chart-2"]),
  "chart-5": chart("primary", 300, 700, ["chart-1", "chart-3"]),

  sidebar: { role: "neutral", light: mirror("background"), dark: mirror("background") },
  "sidebar-foreground": { role: "neutral", light: mirror("foreground"), dark: mirror("foreground") },
  "sidebar-primary": { role: "primary", light: mirror("primary"), dark: mirror("primary") },
  "sidebar-primary-foreground": {
    role: "primary",
    light: mirror("primary-foreground"),
    dark: mirror("primary-foreground"),
  },
  "sidebar-accent": { role: "secondary", light: mirror("accent"), dark: mirror("accent") },
  "sidebar-accent-foreground": {
    role: "secondary",
    light: mirror("accent-foreground"),
    dark: mirror("accent-foreground"),
  },
  "sidebar-border": { role: "neutral", light: mirror("border"), dark: mirror("border") },
  "sidebar-ring": { role: "primary", light: mirror("ring"), dark: mirror("ring") },
};

export type AutoEntry = {
  value: string;
  /** brand reference, absent when the rule resolved to white */
  ref?: string;
  /** e.g. "Primary 700", "White", "Same as primary" */
  label: string;
  /** contrast problem the rule couldn't solve */
  warning?: string;
};

export type BrandRoles = {
  assignments: Partial<Record<RoleId, string>>;
  /** Light-mode background/card/popover: pure white instead of Neutral 50 */
  whiteBackground?: boolean;
  auto: { light: Record<string, AutoEntry>; dark: Record<string, AutoEntry> };
  manual: { light: string[]; dark: string[] };
};

export type RoleState = BrandState & { brandRoles?: BrandRoles };

const MODES: Mode[] = ["light", "dark"];

/**
 * Used for the Destructive role while no brand palette is assigned to it, so error colours still get
 * the contrast rules. The default red as-is fails the app shell's badge check on most brand dark
 * backgrounds. Not added to the theme's palettes, so tokens resolved from it carry no brand reference.
 */
export const FALLBACK_DESTRUCTIVE = createPalette("Red", "#DC2626", "builtin-destructive");

export const emptyRoles = (): BrandRoles => ({
  assignments: {},
  auto: { light: {}, dark: {} },
  manual: { light: [], dark: [] },
});

const contrast = (a: string | Color, b: string | Color) => {
  try {
    return wcagContrast(a, b);
  } catch {
    return 1;
  }
};

const toRgb = toGamut("rgb", "oklch");
/** `fg` at `alpha` over an opaque `bg`, as the browser paints it (same as composite() in rules.mjs). */
function composite(fg: string, bg: string, alpha: number): Color | null {
  try {
    const f = toRgb(fg);
    const b = toRgb(bg);
    if (!f || !b) return null;
    const mix = (k: "r" | "g" | "b") => f[k] * alpha + b[k] * (1 - alpha);
    return { mode: "rgb", r: mix("r"), g: mix("g"), b: mix("b") };
  } catch {
    return null;
  }
}

const againstLabel = (a: Against) =>
  typeof a === "string" ? a : `its own ${Math.round(a.tint * 100)}% tint on ${a.over}`;

/** Lowest contrast of `value` against every surface in `min.against`, and which one that was. */
function worstContrast(value: string, min: MinContrast, styles: Record<string, unknown>) {
  const list = Array.isArray(min.against) ? min.against : [min.against];
  let worst = { ratio: Infinity, label: "" };
  for (const a of list) {
    const bg =
      typeof a === "string"
        ? String(styles[a] ?? "")
        : composite(value, String(styles[a.over] ?? ""), a.tint);
    const ratio = bg ? contrast(value, bg) : 1;
    if (ratio < worst.ratio) worst = { ratio, label: againstLabel(a) };
  }
  return worst;
}
const fmt = (r: number) => r.toFixed(2).replace(/\.?0+$/, "");

type Ctx = {
  palette: BrandPalette;
  roleLabel: string;
  styles: Record<string, unknown>;
  refs: BrandRefs[Mode];
  mode: Mode;
  whiteBackground: boolean;
};

const fromStep = (ctx: Ctx, s: ScaleStep): AutoEntry => ({
  value: ctx.palette.steps[s].value,
  ref: refFor(ctx.palette.slug, s),
  label: `${ctx.roleLabel} ${s}`,
});

export function resolveRule(rule: ModeRule, ctx: Ctx): AutoEntry {
  if (rule.kind === "mirror") {
    const value = String(ctx.styles[rule.token] ?? "");
    const ref = ctx.refs[rule.token];
    return { value, ...(ref ? { ref } : {}), label: `Same as ${rule.token}` };
  }

  if (rule.kind === "on") {
    const bg = String(ctx.styles[rule.on] ?? "");
    if (rule.prefer !== undefined) {
      const preferred = fromStep(ctx, rule.prefer);
      if (contrast(preferred.value, bg) >= TEXT_CONTRAST) return preferred;
    }
    const candidates: AutoEntry[] = [
      { value: WHITE, label: "White" },
      fromStep(ctx, 50),
      fromStep(ctx, 950),
    ];
    const best = candidates.reduce((a, b) => (contrast(b.value, bg) > contrast(a.value, bg) ? b : a));
    const ratio = contrast(best.value, bg);
    return ratio >= TEXT_CONTRAST
      ? best
      : { ...best, warning: `Only ${fmt(ratio)}:1 against ${rule.on} (text needs 4.5:1).` };
  }

  // kind === "step"
  if (rule.whiteOption && ctx.mode === "light" && ctx.whiteBackground) return { value: WHITE, label: "White" };
  const start = rule.pick === "anchor" ? ctx.palette.anchorStep : rule.pick;
  let result = fromStep(ctx, start);

  if (rule.min) {
    const min = rule.min;
    const taken = new Set((rule.avoid ?? []).map((t) => String(ctx.styles[t] ?? "")));
    const i0 = SCALE_STEPS.indexOf(start);
    const dir = min.towards === "lighter" ? -1 : 1;
    const iEnd = rule.limit !== undefined ? SCALE_STEPS.indexOf(rule.limit) : dir < 0 ? 0 : SCALE_STEPS.length - 1;
    let best = result;
    let bestWorst = worstContrast(result.value, min, ctx.styles);
    let found = bestWorst.ratio >= min.ratio;
    for (let i = i0 + dir; !found && (dir < 0 ? i >= iEnd : i <= iEnd); i += dir) {
      const candidate = fromStep(ctx, SCALE_STEPS[i]);
      if (taken.has(candidate.value)) continue;
      const w = worstContrast(candidate.value, min, ctx.styles);
      if (w.ratio > bestWorst.ratio) {
        best = candidate;
        bestWorst = w;
      }
      if (w.ratio >= min.ratio) found = true;
    }
    result = found
      ? best
      : {
          ...best,
          warning: `Only ${fmt(bestWorst.ratio)}:1 against ${bestWorst.label} (needs ${min.ratio}:1).`,
        };
  }

  if (rule.warnBelow) {
    const ratio = contrast(result.value, String(ctx.styles[rule.warnBelow.against] ?? ""));
    if (ratio < rule.warnBelow.ratio) {
      result = {
        ...result,
        warning: `Only ${fmt(ratio)}:1 against ${rule.warnBelow.against} (needs ${rule.warnBelow.ratio}:1). The brand colour is kept as is.`,
      };
    }
  }
  return result;
}

const hasAnyAssignment = (roles: BrandRoles, palettes: { id: string }[]) =>
  Object.values(roles.assignments).some((id) => palettes.some((p) => p.id === id));

/** Role a token belongs to (mirrors follow their source token's role). */
export const roleOf = (token: string): RoleId | undefined => TOKEN_RULES[token]?.role;

function isDetectedManual<S extends RoleState>(state: S, mode: Mode, token: string): boolean {
  const prev = state.brandRoles?.auto[mode]?.[token];
  if (!prev) return false;
  if (state.styles[mode]?.[token] === prev.value) return false;
  // value moved because the palette step it points at was edited → still Auto
  return !(prev.ref && getActiveRef(state, mode, token) === prev.ref);
}

/**
 * Re-resolve every Auto token from the current role assignments. Returns the same object when nothing
 * changes (safe to call after every state change).
 */
export function syncRoles<S extends RoleState>(state: S): S {
  const roles = state.brandRoles;
  if (!roles) return state;

  const palettes = state.brandPalettes ?? [];
  const styles = { light: { ...state.styles.light }, dark: { ...state.styles.dark } };
  const refsIn = state.brandRefs ?? { light: {}, dark: {} };
  const refs: BrandRefs = { light: { ...refsIn.light }, dark: { ...refsIn.dark } };
  const auto: BrandRoles["auto"] = { light: {}, dark: {} };
  const manual: BrandRoles["manual"] = { light: [], dark: [] };

  for (const mode of MODES) {
    for (const [token, rule] of Object.entries(TOKEN_RULES)) {
      let palette = palettes.find((p) => p.id === roles.assignments[rule.role]);
      const fallback = !palette && rule.role === "destructive" && hasAnyAssignment(roles, palettes);
      if (fallback) palette = FALLBACK_DESTRUCTIVE;
      if (!palette) continue; // unassigned role: token stays exactly as it is

      if (roles.manual[mode]?.includes(token) || isDetectedManual(state, mode, token)) {
        manual[mode].push(token);
        continue;
      }

      const entry = resolveRule(rule[mode], {
        palette,
        roleLabel: ROLE_LABELS[rule.role],
        styles: styles[mode],
        refs: refs[mode],
        mode,
        whiteBackground: !!roles.whiteBackground,
      });
      if (fallback) {
        delete entry.ref;
        entry.label = entry.label.replace(/^Destructive/, "Default red");
      }
      styles[mode][token] = entry.value;
      if (entry.ref) refs[mode][token] = entry.ref;
      else delete refs[mode][token];
      auto[mode][token] = entry;
    }
  }

  // Drop assignments to palettes that no longer exist.
  const assignments = Object.fromEntries(
    Object.entries(roles.assignments).filter(([, id]) => palettes.some((p) => p.id === id))
  );

  const nextRoles: BrandRoles = { ...roles, assignments, auto, manual };
  const changed =
    JSON.stringify([styles, refs, nextRoles]) !==
    JSON.stringify([state.styles, refsIn, roles]);
  if (!changed) return state;
  return { ...state, styles: styles as S["styles"], brandRefs: refs, brandRoles: nextRoles };
}

const withRoles = <S extends RoleState>(state: S, update: (r: BrandRoles) => BrandRoles): S =>
  syncRoles({ ...state, brandRoles: update(state.brandRoles ?? emptyRoles()) });

/** Assign a palette to a role (or `null` to unassign; its tokens keep their current colours). */
export function assignRole<S extends RoleState>(state: S, role: RoleId, paletteId: string | null): S {
  return withRoles(state, (r) => {
    const assignments = { ...r.assignments };
    if (paletteId) assignments[role] = paletteId;
    else delete assignments[role];
    return { ...r, assignments };
  });
}

export function setWhiteBackground<S extends RoleState>(state: S, white: boolean): S {
  return withRoles(state, (r) => ({ ...r, whiteBackground: white }));
}

/** Return one token (in one mode) to its rule. */
export function resetTokenToAuto<S extends RoleState>(state: S, mode: Mode, token: string): S {
  return withRoles(state, (r) => ({
    ...r,
    manual: { ...r.manual, [mode]: r.manual[mode].filter((t) => t !== token) },
    // forget the old auto value so the current value isn't detected as a manual change again
    auto: { ...r.auto, [mode]: Object.fromEntries(Object.entries(r.auto[mode]).filter(([t]) => t !== token)) },
  }));
}

/**
 * After the styles were replaced wholesale (preset applied, reset to preset): forget what the rules
 * last wrote, so the new values aren't mistaken for manual edits and assigned roles apply again on
 * top of the preset. Palettes and role assignments are kept.
 */
export function forgetRoleTracking<S extends RoleState>(state: S): S {
  if (!state.brandRoles) return state;
  return { ...state, brandRoles: { ...state.brandRoles, auto: { light: {}, dark: {} }, manual: { light: [], dark: [] } } };
}

export function resetAllToAuto<S extends RoleState>(state: S): S {
  return withRoles(state, (r) => ({ ...r, manual: { light: [], dark: [] }, auto: { light: {}, dark: {} } }));
}

export type TokenRoleStatus =
  | { kind: "auto"; label: string; warning?: string }
  | { kind: "manual"; role: RoleId }
  | null;

/** For the UI: is this token following a role rule, overridden, or not role-driven at all? */
export function getTokenRoleStatus<S extends RoleState>(state: S, mode: Mode, token: string): TokenRoleStatus {
  const roles = state.brandRoles;
  const role = roleOf(token);
  if (!roles || !role) return null;
  // Destructive follows the built-in red while unassigned (see FALLBACK_DESTRUCTIVE)
  const followsFallback = role === "destructive" && !!roles.auto[mode]?.[token];
  if (!roles.assignments[role] && !followsFallback) return null;
  if (roles.manual[mode]?.includes(token) || isDetectedManual(state, mode, token)) return { kind: "manual", role };
  const entry = roles.auto[mode]?.[token];
  return entry ? { kind: "auto", label: entry.label, warning: entry.warning } : null;
}
