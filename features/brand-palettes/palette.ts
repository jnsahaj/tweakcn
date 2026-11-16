/**
 * Pure state operations for brand palettes and token references.
 *
 * Every function takes a theme state and returns a new one; nothing here touches React or zustand.
 *
 * Model:
 * - `styles[mode][token]` always holds a plain, resolved colour string (so the preview, the existing
 *   exports and every upstream feature keep working on plain values).
 * - `brandRefs[mode][token]` records which brand step the token is linked to.
 * - A link is *active* only while the token's value equals the step's value. If anything else
 *   rewrites the token (typing, presets, HSL adjustments, AI), the link is considered gone and is
 *   pruned on the next palette operation — it never overwrites that change.
 */
import { slugify } from "./naming";
import {
  SCALE_STEPS,
  formatExactOklch,
  formatOklch,
  generateScale,
  parseToOklch,
  toHex,
  type ScaleStep,
} from "./scale";
import type { BrandPalette, BrandRef, BrandRefs, Mode } from "./types";

type Styles = { light: Record<string, unknown>; dark: Record<string, unknown> };

/** Minimal shape of the editor state these helpers need. */
export type BrandState = {
  styles: Styles;
  brandPalettes?: BrandPalette[];
  brandRefs?: BrandRefs;
};

const MODES: Mode[] = ["light", "dark"];
const EMPTY_REFS: BrandRefs = { light: {}, dark: {} };

export const refFor = (slug: string, step: ScaleStep): BrandRef => `${slug}-${step}`;

export function parseRef(ref: BrandRef): { slug: string; step: ScaleStep } | null {
  const m = /^(.+)-(\d+)$/.exec(ref);
  if (!m) return null;
  const step = Number(m[2]) as ScaleStep;
  if (!SCALE_STEPS.includes(step)) return null;
  return { slug: m[1], step };
}

/** Resolve "forest-green-700" to its colour value, or undefined if the palette/step doesn't exist. */
export function resolveRef(palettes: BrandPalette[] | undefined, ref: BrandRef): string | undefined {
  const parsed = parseRef(ref);
  if (!parsed) return undefined;
  return palettes?.find((p) => p.slug === parsed.slug)?.steps[parsed.step]?.value;
}

/** The token's reference, but only if it is still live (value matches the step). */
export function getActiveRef<S extends BrandState>(state: S, mode: Mode, token: string): BrandRef | undefined {
  const ref = state.brandRefs?.[mode]?.[token];
  if (!ref) return undefined;
  const value = resolveRef(state.brandPalettes, ref);
  return value !== undefined && value === state.styles[mode]?.[token] ? ref : undefined;
}

/** Normalise any colour string the user types (hex, oklch, rgb, …) to our oklch format. */
export function normaliseColour(input: string): string | null {
  const o = parseToOklch(input);
  if (!o) return null;
  // hex inputs keep exact round-tripping; other inputs just get the standard 4-decimal format
  return /^\s*#/.test(input) ? formatExactOklch(input) : formatOklch(o);
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `bp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function lockedValues(p: BrandPalette, except?: ScaleStep) {
  const locked: Partial<Record<ScaleStep, string>> = {};
  for (const s of SCALE_STEPS) if (p.steps[s].locked && s !== except) locked[s] = p.steps[s].value;
  return locked;
}

/**
 * Regenerate every unlocked step from `baseHex` (locked steps keep their value).
 * `keepAnchor`: if the natural anchor is locked, stay on the current anchor instead of moving the
 * brand colour to the nearest unlocked step (used by the reset actions).
 */
function regenerate(p: BrandPalette, unlock?: ScaleStep, keepAnchor = false): BrandPalette {
  const locked = lockedValues(p, unlock);
  const { anchorStep, steps } = generateScale(p.baseHex, {
    locked,
    fallbackAnchor: keepAnchor ? p.anchorStep : undefined,
  });
  return {
    ...p,
    anchorStep,
    steps: Object.fromEntries(
      SCALE_STEPS.map((s) => [s, { value: steps[s], locked: locked[s] !== undefined }])
    ) as BrandPalette["steps"],
  };
}

export function createPalette(name: string, hex: string, id: string = newId()): BrandPalette {
  const baseHex = toHex(hex);
  if (!baseHex) throw new Error(`Invalid colour: ${hex}`);
  const blank = Object.fromEntries(SCALE_STEPS.map((s) => [s, { value: "", locked: false }]));
  return regenerate({
    id,
    name: name.trim(),
    slug: slugify(name),
    baseHex: baseHex.toUpperCase(),
    anchorStep: 500,
    steps: blank as BrandPalette["steps"],
  });
}

/**
 * Replace one palette and keep every token linked to it in sync:
 * live links get the new step value, stale or broken links are dropped.
 */
function replacePalette<S extends BrandState>(
  state: S,
  id: string,
  update: (p: BrandPalette) => BrandPalette | null
): S {
  const palettes = state.brandPalettes ?? [];
  const old = palettes.find((p) => p.id === id);
  if (!old) return state;
  const next = update(old);
  const newPalettes = next ? palettes.map((p) => (p.id === id ? next : p)) : palettes.filter((p) => p.id !== id);

  const refs = state.brandRefs ?? EMPTY_REFS;
  const newRefs: BrandRefs = { light: { ...refs.light }, dark: { ...refs.dark } };
  const newStyles: Styles = { light: { ...state.styles.light }, dark: { ...state.styles.dark } };

  for (const mode of MODES) {
    for (const [token, ref] of Object.entries(refs[mode] ?? {})) {
      if (!ref) continue;
      const parsed = parseRef(ref);
      if (!parsed || parsed.slug !== old.slug) continue;
      const wasLive = old.steps[parsed.step]?.value === state.styles[mode]?.[token];
      if (!wasLive || !next) {
        // stale link, or palette deleted: keep the colour as a plain value, drop the link
        delete newRefs[mode][token];
        continue;
      }
      const newRef = refFor(next.slug, parsed.step);
      newRefs[mode][token] = newRef;
      newStyles[mode][token] = next.steps[parsed.step].value;
    }
  }

  return { ...state, brandPalettes: newPalettes, brandRefs: newRefs, styles: newStyles as S["styles"] };
}

export function addPalette<S extends BrandState>(state: S, palette: BrandPalette): S {
  return { ...state, brandPalettes: [...(state.brandPalettes ?? []), palette] };
}

/** Rename; the slug follows the name and every reference is rewritten to the new slug. */
export function renamePalette<S extends BrandState>(state: S, id: string, name: string): S {
  return replacePalette(state, id, (p) => ({ ...p, name: name.trim(), slug: slugify(name) }));
}

/** New base colour: regenerate all unlocked steps; locked steps keep their values. */
export function setPaletteBase<S extends BrandState>(state: S, id: string, hex: string): S {
  const baseHex = toHex(hex);
  if (!baseHex) return state;
  return replacePalette(state, id, (p) => regenerate({ ...p, baseHex: baseHex.toUpperCase() }));
}

/** Manual edit of one step: sets the value and locks it. Other steps are not touched. */
export function setStepValue<S extends BrandState>(state: S, id: string, step: ScaleStep, colour: string): S {
  const value = normaliseColour(colour);
  if (!value) return state;
  return replacePalette(state, id, (p) => ({
    ...p,
    steps: { ...p.steps, [step]: { value, locked: true } },
  }));
}

/** Unlock one step and regenerate it (the palette is regenerated so the anchor stays consistent). */
export function resetStep<S extends BrandState>(state: S, id: string, step: ScaleStep): S {
  return replacePalette(state, id, (p) => regenerate(p, step, true));
}

export function resetAllOverrides<S extends BrandState>(state: S, id: string): S {
  return replacePalette(state, id, (p) =>
    regenerate({
      ...p,
      steps: Object.fromEntries(
        SCALE_STEPS.map((s) => [s, { ...p.steps[s], locked: false }])
      ) as BrandPalette["steps"],
    })
  );
}

/** Delete; linked tokens keep their last colour as a plain value. */
export function deletePalette<S extends BrandState>(state: S, id: string): S {
  return replacePalette(state, id, () => null);
}

/** Point a token at a brand step in one mode (sets the value too). */
export function linkToken<S extends BrandState>(state: S, mode: Mode, token: string, ref: BrandRef): S {
  const value = resolveRef(state.brandPalettes, ref);
  if (value === undefined) return state;
  const refs = state.brandRefs ?? EMPTY_REFS;
  return {
    ...state,
    styles: { ...state.styles, [mode]: { ...state.styles[mode], [token]: value } },
    brandRefs: { ...refs, [mode]: { ...refs[mode], [token]: ref } },
  };
}

export function unlinkToken<S extends BrandState>(state: S, mode: Mode, token: string): S {
  const refs = state.brandRefs ?? EMPTY_REFS;
  if (!refs[mode]?.[token]) return state;
  const modeRefs = { ...refs[mode] };
  delete modeRefs[token];
  return { ...state, brandRefs: { ...refs, [mode]: modeRefs } };
}

/** Drop every reference that is stale (value changed elsewhere) or broken (palette/step missing). */
export function pruneRefs<S extends BrandState>(state: S): S {
  const refs = state.brandRefs;
  if (!refs) return state;
  const next: BrandRefs = { light: {}, dark: {} };
  let changed = false;
  for (const mode of MODES) {
    for (const [token, ref] of Object.entries(refs[mode] ?? {})) {
      if (ref && getActiveRef(state, mode, token) === ref) next[mode][token] = ref;
      else changed = true;
    }
  }
  return changed ? { ...state, brandRefs: next } : state;
}

/** Slugs of all palettes except `exceptId` (for name validation). */
export function otherSlugs(palettes: BrandPalette[] | undefined, exceptId?: string): string[] {
  return (palettes ?? []).filter((p) => p.id !== exceptId).map((p) => p.slug);
}
