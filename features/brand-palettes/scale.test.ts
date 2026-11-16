import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_SCALE_CONFIG,
  SCALE_STEPS,
  detectAnchorStep,
  formatExactOklch,
  generateScale,
  isInSrgb,
  parseToOklch,
  toHex,
} from "./scale";

const SAMPLES = ["#0B3D2E", "#FF6B1A", "#1D4ED8", "#F5E6A8", "#1A1A1A"];
const EXTRA = ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FAFAFA", "#0A0A0A", "#7C3AED", "#808080"];
const ALL = [...SAMPLES, ...EXTRA];

const lightness = (v: string) => parseToOklch(v)!.l;

describe("generateScale", () => {
  it("anchor step round-trips to the exact input hex", () => {
    for (const hex of ALL) {
      const { anchorStep, steps } = generateScale(hex);
      assert.equal(toHex(steps[anchorStep]), hex.toLowerCase(), `${hex} anchor ${anchorStep}`);
    }
  });

  it("produces all 11 steps", () => {
    const { steps } = generateScale("#1D4ED8");
    assert.deepEqual(Object.keys(steps).map(Number), [...SCALE_STEPS]);
  });

  it("lightness strictly decreases from 50 to 950", () => {
    for (const hex of ALL) {
      const { steps } = generateScale(hex);
      const ls = SCALE_STEPS.map((s) => lightness(steps[s]));
      for (let i = 1; i < ls.length; i++) {
        assert.ok(ls[i] < ls[i - 1], `${hex}: step ${SCALE_STEPS[i]} (${ls[i]}) !< ${SCALE_STEPS[i - 1]} (${ls[i - 1]})`);
      }
    }
  });

  it("keeps a usable gap between steps for typical brand colours", () => {
    for (const hex of SAMPLES) {
      const { steps } = generateScale(hex);
      const ls = SCALE_STEPS.map((s) => lightness(steps[s]));
      for (let i = 1; i < ls.length; i++) {
        // gamut mapping may move L by a hair, so allow a little slack under minGap
        assert.ok(ls[i - 1] - ls[i] > DEFAULT_SCALE_CONFIG.minGap - 0.005, `${hex} gap at ${SCALE_STEPS[i]}`);
      }
    }
  });

  it("every step is inside sRGB", () => {
    for (const hex of ALL) {
      const { steps } = generateScale(hex);
      for (const s of SCALE_STEPS) assert.ok(isInSrgb(steps[s]), `${hex} ${s}: ${steps[s]}`);
    }
  });

  it("very light inputs anchor at 50/100, very dark at 900/950", () => {
    for (const hex of ["#FFFFFF", "#FAFAFA", "#F5F5F0", "#FDF6E3"]) {
      assert.ok([50, 100].includes(generateScale(hex).anchorStep), hex);
    }
    for (const hex of ["#000000", "#0A0A0A", "#1A1A1A", "#111827"]) {
      assert.ok([900, 950].includes(generateScale(hex).anchorStep), hex);
    }
  });

  it("detects anchors for the sample colours at sensible steps", () => {
    assert.equal(detectAnchorStep(parseToOklch("#1D4ED8")!.l), 700);
    assert.equal(detectAnchorStep(parseToOklch("#FF6B1A")!.l), 400);
    assert.equal(detectAnchorStep(parseToOklch("#0B3D2E")!.l), 900);
  });

  it("neutral inputs stay neutral", () => {
    for (const hex of ["#1A1A1A", "#808080", "#FAFAFA", "#000000"]) {
      const base = parseToOklch(hex)!;
      const { steps } = generateScale(hex);
      for (const s of SCALE_STEPS) {
        const c = parseToOklch(steps[s])!.c ?? 0;
        assert.ok(c <= Math.max(base.c ?? 0, 0) + 0.002, `${hex} ${s} chroma ${c}`);
      }
    }
  });

  it("near-neutral inputs keep their tint but don't saturate", () => {
    const hex = "#78716C"; // warm grey, C ≈ 0.016
    const base = parseToOklch(hex)!;
    assert.ok((base.c ?? 0) < DEFAULT_SCALE_CONFIG.neutralChroma);
    const { steps } = generateScale(hex);
    for (const s of SCALE_STEPS) assert.ok(Math.abs((parseToOklch(steps[s])!.c ?? 0) - base.c!) < 0.003);
  });

  it("keeps the hue of the brand colour", () => {
    const base = parseToOklch("#1D4ED8")!;
    const { steps } = generateScale("#1D4ED8");
    for (const s of [100, 300, 500, 900] as const) {
      const h = parseToOklch(steps[s])!.h!;
      assert.ok(Math.abs(h - base.h!) < 3, `step ${s} hue ${h}`);
    }
  });

  it("locked steps are untouched by regeneration", () => {
    const locked = { 200: "oklch(0.9 0.05 120)", 800: "oklch(0.3 0.1 30)" } as const;
    const { steps } = generateScale("#FF6B1A", { locked });
    assert.equal(steps[200], locked[200]);
    assert.equal(steps[800], locked[800]);
  });

  it("re-anchors to the nearest unlocked step when the natural anchor is locked", () => {
    const natural = generateScale("#1D4ED8").anchorStep; // 700
    const { anchorStep, steps } = generateScale("#1D4ED8", { locked: { [natural]: "oklch(0.5 0.1 200)" } });
    assert.notEqual(anchorStep, natural);
    assert.ok([600, 800].includes(anchorStep));
    assert.equal(toHex(steps[anchorStep]), "#1d4ed8");
    assert.equal(steps[natural], "oklch(0.5 0.1 200)");
  });

  it("is deterministic", () => {
    assert.deepEqual(generateScale("#0B3D2E"), generateScale("#0B3D2E"));
  });

  it("rejects invalid input", () => {
    assert.throws(() => generateScale("not a colour"));
  });
});

describe("formatExactOklch", () => {
  it("round-trips a wide range of hexes", () => {
    for (let i = 0; i < 2000; i++) {
      const hex = "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      assert.equal(toHex(formatExactOklch(hex)), hex);
    }
  });
});
