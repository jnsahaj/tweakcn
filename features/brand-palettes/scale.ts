/**
 * Brand palette scale generation.
 *
 * Pure, framework-free module: given one brand colour (hex), generate a Tailwind-style
 * 50–950 scale in OKLCH. All colour maths goes through culori.
 */
import { clampChroma, converter, formatHex, parse, type Oklch } from "culori";

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];
export type StepRecord<T> = Record<ScaleStep, T>;

export type ScaleConfig = {
  /** Target OKLCH lightness per step. Must be strictly decreasing. */
  lightness: StepRecord<number>;
  /** Relative chroma multiplier per step. */
  chromaTaper: StepRecord<number>;
  /** Minimum lightness gap between neighbouring steps. */
  minGap: number;
  /** Brightest / darkest lightness a generated step may get. */
  maxLightness: number;
  minLightness: number;
  /** Below this chroma the brand colour is treated as neutral (grey stays grey). */
  neutralChroma: number;
};

// Final tuned values: see docs/DECISIONS.md ("Scale curve tuning").
export const DEFAULT_SCALE_CONFIG: ScaleConfig = {
  lightness: {
    50: 0.977,
    100: 0.937,
    200: 0.877,
    300: 0.8,
    400: 0.716,
    500: 0.635,
    600: 0.556,
    700: 0.48,
    800: 0.41,
    900: 0.347,
    950: 0.27,
  },
  chromaTaper: {
    50: 0.14,
    100: 0.3,
    200: 0.54,
    300: 0.78,
    400: 0.92,
    500: 1.0,
    600: 1.0,
    700: 0.97,
    800: 0.88,
    900: 0.78,
    950: 0.68,
  },
  minGap: 0.015,
  maxLightness: 0.995,
  minLightness: 0.13,
  neutralChroma: 0.02,
};

const toOklch = converter("oklch");

export function parseToOklch(color: string): Oklch | null {
  const parsed = parse(color.trim());
  if (!parsed) return null;
  const o = toOklch(parsed);
  return { mode: "oklch", l: o.l, c: o.c ?? 0, h: o.h ?? 0, alpha: o.alpha };
}

/** Normalise any parseable colour to lowercase `#rrggbb`, or null. */
export function toHex(color: string): string | null {
  const parsed = parse(color.trim());
  return parsed ? formatHex(parsed) : null;
}

const round = (n: number, digits: number) => {
  const s = n.toFixed(digits);
  // trim trailing zeros but keep at least one digit: 0.5000 -> 0.5, 1.0000 -> 1
  return s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
};

/** Format an OKLCH colour the way tweakcn does: `oklch(L C H)`. */
export function formatOklch(color: { l: number; c?: number; h?: number }, digits = 4): string {
  const l = Math.min(1, Math.max(0, color.l));
  const c = Math.max(0, color.c ?? 0);
  const h = c === 0 ? 0 : (((color.h ?? 0) % 360) + 360) % 360;
  return `oklch(${round(l, digits)} ${round(c, digits)} ${round(h, Math.max(2, digits - 2))})`;
}

/** True when the colour is inside sRGB (with a tiny tolerance for float rounding). */
export function isInSrgb(color: string, epsilon = 1e-4): boolean {
  const parsed = parse(color);
  if (!parsed) return false;
  const rgb = converter("rgb")(parsed);
  return [rgb.r, rgb.g, rgb.b].every((v) => v >= -epsilon && v <= 1 + epsilon);
}

/**
 * Format the brand colour as OKLCH so that it converts back to *exactly* the same hex.
 * Uses the fewest decimals (from 4 up) that round-trip and stay inside sRGB (colours on the gamut
 * edge, like #00ff00, need more decimals).
 */
export function formatExactOklch(hex: string): string {
  const target = toHex(hex);
  const o = parseToOklch(hex);
  if (!target || !o) throw new Error(`Invalid colour: ${hex}`);
  for (let digits = 4; digits <= 12; digits++) {
    const s = formatOklch(o, digits);
    const p = parse(s);
    if (p && formatHex(p) === target && isInSrgb(s)) return s;
  }
  return formatOklch(o, 12);
}

/**
 * Gamut-map an OKLCH colour into sRGB and format it; the result is guaranteed to be displayable.
 *
 * Uses chroma reduction at constant lightness and hue (culori `clampChroma`), not `toGamut`:
 * `toGamut` finishes with an RGB clip that visibly shifts hue on light tints (a blue-100 drifted
 * ~14° towards cyan), which breaks the "hue stays H_b" rule.
 */
function formatInGamut(color: Oklch): string {
  const mapped = clampChroma(color, "oklch", "rgb") as Oklch;
  const l = mapped.l;
  const h = color.h ?? 0;
  let c = mapped.c ?? 0;
  // Rounding to 4 decimals can nudge a colour on the gamut edge just outside; pull chroma in.
  let s = formatOklch({ l, c, h });
  for (let i = 0; i < 200 && !isInSrgb(s) && c > 0; i++) {
    c = Math.max(0, c - 0.0005);
    s = formatOklch({ l, c, h });
  }
  return s;
}

const indexOfStep = (step: ScaleStep) => SCALE_STEPS.indexOf(step);

/** The step whose target lightness is closest to `l` (ties go to the lighter step). */
export function detectAnchorStep(l: number, config: ScaleConfig = DEFAULT_SCALE_CONFIG): ScaleStep {
  let best: ScaleStep = SCALE_STEPS[0];
  let bestDist = Infinity;
  for (const step of SCALE_STEPS) {
    const d = Math.abs(config.lightness[step] - l);
    if (d < bestDist - 1e-12) {
      best = step;
      bestDist = d;
    }
  }
  return best;
}

/**
 * Pick the anchor, avoiding locked steps: if the natural anchor is locked, use the nearest
 * unlocked step (ties broken by closest target lightness). Returns null if every step is locked.
 */
export function chooseAnchorStep(
  l: number,
  locked: Partial<Record<ScaleStep, unknown>>,
  config: ScaleConfig = DEFAULT_SCALE_CONFIG
): ScaleStep | null {
  const natural = detectAnchorStep(l, config);
  if (locked[natural] === undefined) return natural;
  const ni = indexOfStep(natural);
  const candidates = SCALE_STEPS.filter((s) => locked[s] === undefined);
  if (candidates.length === 0) return null;
  return candidates.reduce((best, s) => {
    const d = Math.abs(indexOfStep(s) - ni);
    const bd = Math.abs(indexOfStep(best) - ni);
    if (d !== bd) return d < bd ? s : best;
    return Math.abs(config.lightness[s] - l) < Math.abs(config.lightness[best] - l) ? s : best;
  });
}

export type GenerateScaleOptions = {
  /** Steps with a fixed (manually edited) value. These are returned untouched. */
  locked?: Partial<Record<ScaleStep, string>>;
  /**
   * Anchor to use when the natural anchor step is locked. Without it, the nearest unlocked step
   * becomes the anchor (used when the base colour changes). Reset actions pass the palette's
   * current anchor so resetting one step doesn't move the brand colour around.
   */
  fallbackAnchor?: ScaleStep;
  config?: ScaleConfig;
};

export type GeneratedScale = {
  anchorStep: ScaleStep;
  steps: StepRecord<string>;
};

/**
 * Generate a 50–950 scale from one brand colour.
 *
 * 1. baseHex → OKLCH (L_b, C_b, H_b)
 * 2. anchor = step with target L closest to L_b (see `fallbackAnchor` for locked anchors); it holds
 *    baseHex exactly (unless that step itself is locked)
 * 3. bend the lightness curve around the anchor: L_i = L_target_i + delta × w_i, with w falling
 *    linearly from 1 at the anchor to 0 at steps 50 and 950
 * 4. enforce strictly decreasing lightness (min gap), never moving the anchor
 * 5. chroma taper relative to the anchor; neutral inputs keep C_b everywhere; hue constant
 * 6. gamut-map every generated step into sRGB
 */
export function generateScale(baseHex: string, options: GenerateScaleOptions = {}): GeneratedScale {
  const config = options.config ?? DEFAULT_SCALE_CONFIG;
  const locked = options.locked ?? {};
  const base = parseToOklch(baseHex);
  if (!base) throw new Error(`Invalid colour: ${baseHex}`);

  const { l: Lb, c: Cb, h: Hb } = base as Required<Pick<Oklch, "l" | "c" | "h">>;
  const natural = detectAnchorStep(Lb, config);
  const anchorStep =
    locked[natural] !== undefined && options.fallbackAnchor
      ? options.fallbackAnchor
      : (chooseAnchorStep(Lb, locked, config) ?? natural);
  const a = indexOfStep(anchorStep);
  const n = SCALE_STEPS.length - 1;

  // The curve is computed as if nothing were locked: locked steps are exceptions that are swapped in
  // at the end, they don't push the generated steps around. Only the anchor is fixed (at L_b).

  // 3. Bend the curve around the anchor.
  const delta = Lb - config.lightness[anchorStep];
  const L = SCALE_STEPS.map((step, i) => {
    const w = i < a ? (a === 0 ? 0 : i / a) : i > a ? (a === n ? 0 : (n - i) / (n - a)) : 1;
    return config.lightness[step] + delta * w;
  });

  // 4. Strictly decreasing lightness, never moving the anchor.
  const gap = config.minGap;
  for (let i = a + 1; i <= n; i++) if (L[i] > L[i - 1] - gap) L[i] = L[i - 1] - gap;
  for (let i = a - 1; i >= 0; i--) if (L[i] < L[i + 1] + gap) L[i] = L[i + 1] + gap;
  // If that ran out of room at either end, space the steps between anchor and end evenly instead.
  if (a > 0 && L[0] > config.maxLightness) {
    const g = Math.min(gap, (config.maxLightness - Lb) / a);
    for (let i = a - 1; i >= 0; i--) L[i] = Lb + (a - i) * g;
  }
  if (a < n && L[n] < config.minLightness) {
    const g = Math.min(gap, (Lb - config.minLightness) / (n - a));
    for (let i = a + 1; i <= n; i++) L[i] = Lb - (i - a) * g;
  }

  // 5 + 6. Chroma taper, constant hue, gamut mapping.
  const neutral = Cb < config.neutralChroma;
  const mAnchor = config.chromaTaper[anchorStep];

  const steps = {} as StepRecord<string>;
  SCALE_STEPS.forEach((step, i) => {
    const lockedValue = locked[step];
    if (lockedValue !== undefined) {
      steps[step] = lockedValue;
      return;
    }
    if (i === a) {
      steps[step] = formatExactOklch(baseHex);
      return;
    }
    const C = neutral ? Cb : (Cb * config.chromaTaper[step]) / mAnchor;
    steps[step] = formatInGamut({ mode: "oklch", l: L[i], c: C, h: Hb });
  });

  return { anchorStep, steps };
}
