import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addPalette,
  createPalette,
  deletePalette,
  getActiveRef,
  linkToken,
  parseRef,
  pruneRefs,
  renamePalette,
  resetAllOverrides,
  resetStep,
  resolveRef,
  setPaletteBase,
  setStepValue,
  unlinkToken,
  type BrandState,
} from "./palette";
import { toHex } from "./scale";

const base = (): BrandState => ({
  styles: {
    light: { primary: "oklch(0.2 0 0)", ring: "oklch(0.7 0 0)" },
    dark: { primary: "oklch(0.9 0 0)", ring: "oklch(0.5 0 0)" },
  },
});

const withGreen = () => addPalette(base(), createPalette("Forest Green", "#0B3D2E", "g"));

describe("createPalette", () => {
  it("builds a palette with slug, anchor and 11 unlocked steps", () => {
    const p = createPalette("Forest Green", "#0b3d2e", "g");
    assert.equal(p.slug, "forest-green");
    assert.equal(p.baseHex, "#0B3D2E");
    assert.equal(p.anchorStep, 900);
    assert.equal(toHex(p.steps[900].value), "#0b3d2e");
    assert.ok(Object.values(p.steps).every((s) => !s.locked && s.value.startsWith("oklch(")));
  });
});

describe("refs", () => {
  it("parses refs", () => {
    assert.deepEqual(parseRef("forest-green-700"), { slug: "forest-green", step: 700 });
    assert.equal(parseRef("forest-green-701"), null);
    assert.equal(parseRef("forest"), null);
  });

  it("links a token per mode and resolves its value", () => {
    let s = withGreen();
    s = linkToken(s, "light", "primary", "forest-green-700");
    s = linkToken(s, "dark", "primary", "forest-green-300");
    assert.equal(s.styles.light.primary, resolveRef(s.brandPalettes, "forest-green-700"));
    assert.equal(s.styles.dark.primary, resolveRef(s.brandPalettes, "forest-green-300"));
    assert.equal(getActiveRef(s, "light", "primary"), "forest-green-700");
    assert.equal(getActiveRef(s, "dark", "primary"), "forest-green-300");
    assert.equal(getActiveRef(s, "light", "ring"), undefined);
  });

  it("ignores links to unknown steps", () => {
    const s = withGreen();
    assert.equal(linkToken(s, "light", "primary", "nope-500"), s);
  });

  it("unlinks", () => {
    let s = linkToken(withGreen(), "light", "primary", "forest-green-700");
    s = unlinkToken(s, "light", "primary");
    assert.equal(getActiveRef(s, "light", "primary"), undefined);
  });

  it("a link goes stale when the value is changed elsewhere", () => {
    let s = linkToken(withGreen(), "light", "primary", "forest-green-700");
    s = { ...s, styles: { ...s.styles, light: { ...s.styles.light, primary: "#ff0000" } } };
    assert.equal(getActiveRef(s, "light", "primary"), undefined);
    assert.deepEqual(pruneRefs(s).brandRefs, { light: {}, dark: {} });
  });
});

describe("propagation", () => {
  it("editing a step updates every token linked to it, in both modes", () => {
    let s = withGreen();
    s = linkToken(s, "light", "primary", "forest-green-700");
    s = linkToken(s, "light", "ring", "forest-green-700");
    s = linkToken(s, "dark", "ring", "forest-green-700");
    s = setStepValue(s, "g", 700, "#123456");
    const v = s.brandPalettes![0].steps[700];
    assert.equal(v.locked, true);
    assert.equal(toHex(v.value), "#123456");
    assert.equal(s.styles.light.primary, v.value);
    assert.equal(s.styles.light.ring, v.value);
    assert.equal(s.styles.dark.ring, v.value);
  });

  it("editing a step does not regenerate the others", () => {
    const s0 = withGreen();
    const s = setStepValue(s0, "g", 500, "#ff0000");
    for (const step of [50, 400, 600, 900] as const) {
      assert.equal(s.brandPalettes![0].steps[step].value, s0.brandPalettes![0].steps[step].value);
    }
  });

  it("does not overwrite a token whose link went stale", () => {
    let s = linkToken(withGreen(), "light", "primary", "forest-green-700");
    s = { ...s, styles: { ...s.styles, light: { ...s.styles.light, primary: "#ff0000" } } };
    s = setStepValue(s, "g", 700, "#123456");
    assert.equal(s.styles.light.primary, "#ff0000");
    assert.equal(s.brandRefs!.light.primary, undefined);
  });

  it("changing the base colour regenerates unlocked steps, keeps locked ones and updates links", () => {
    let s = withGreen();
    s = setStepValue(s, "g", 200, "#eeeeee");
    s = linkToken(s, "light", "primary", "forest-green-500");
    s = linkToken(s, "light", "ring", "forest-green-200");
    const locked200 = s.brandPalettes![0].steps[200].value;
    s = setPaletteBase(s, "g", "#1D4ED8");
    const p = s.brandPalettes![0];
    assert.equal(p.baseHex, "#1D4ED8");
    assert.equal(p.anchorStep, 700);
    assert.equal(toHex(p.steps[700].value), "#1d4ed8");
    assert.equal(p.steps[200].value, locked200);
    assert.equal(s.styles.light.primary, p.steps[500].value);
    assert.equal(s.styles.light.ring, locked200);
  });

  it("if the new anchor step is locked, the base goes to the nearest unlocked step", () => {
    let s = withGreen();
    s = setStepValue(s, "g", 700, "#abcdef");
    s = setPaletteBase(s, "g", "#1D4ED8"); // natural anchor 700 is locked
    const p = s.brandPalettes![0];
    assert.ok([600, 800].includes(p.anchorStep));
    assert.equal(toHex(p.steps[p.anchorStep].value), "#1d4ed8");
    assert.equal(toHex(p.steps[700].value), "#abcdef");
  });

  it("reset step unlocks and regenerates it; reset all clears every override", () => {
    const s0 = withGreen();
    let s = setStepValue(s0, "g", 300, "#ff0000");
    s = setStepValue(s, "g", 900, "#00ff00");
    s = linkToken(s, "dark", "primary", "forest-green-300");
    s = resetStep(s, "g", 300);
    assert.equal(s.brandPalettes![0].steps[300].locked, false);
    assert.equal(s.brandPalettes![0].steps[300].value, s0.brandPalettes![0].steps[300].value);
    assert.equal(s.styles.dark.primary, s0.brandPalettes![0].steps[300].value);
    assert.equal(s.brandPalettes![0].steps[900].locked, true);
    s = resetAllOverrides(s, "g");
    assert.deepEqual(s.brandPalettes![0], s0.brandPalettes![0]);
  });

  it("resetting another step keeps the anchor even when the anchor step is hand-edited", () => {
    const s0 = withGreen(); // anchor 900
    let s = setStepValue(s0, "g", 900, "#00ff00");
    s = setStepValue(s, "g", 300, "#ff0000");
    s = resetStep(s, "g", 300);
    const p = s.brandPalettes![0];
    assert.equal(p.anchorStep, 900);
    assert.equal(toHex(p.steps[900].value), "#00ff00");
    for (const step of [50, 300, 500, 800, 950] as const) {
      assert.equal(p.steps[step].value, s0.brandPalettes![0].steps[step].value, `step ${step}`);
    }
    // resetting the anchor itself brings the brand colour back
    s = resetStep(s, "g", 900);
    assert.equal(toHex(s.brandPalettes![0].steps[900].value), "#0b3d2e");
  });

  it("renaming rewrites references to the new slug", () => {
    let s = linkToken(withGreen(), "dark", "ring", "forest-green-400");
    s = renamePalette(s, "g", "Pine");
    assert.equal(s.brandPalettes![0].slug, "pine");
    assert.equal(s.brandRefs!.dark.ring, "pine-400");
    assert.equal(getActiveRef(s, "dark", "ring"), "pine-400");
  });

  it("deleting a palette keeps the last colour as a plain value and removes the link", () => {
    let s = linkToken(withGreen(), "light", "primary", "forest-green-700");
    const value = s.styles.light.primary;
    s = deletePalette(s, "g");
    assert.equal(s.brandPalettes!.length, 0);
    assert.equal(s.styles.light.primary, value);
    assert.equal(s.brandRefs!.light.primary, undefined);
  });

  it("leaves other palettes' links alone", () => {
    let s = addPalette(withGreen(), createPalette("Sunset", "#FF6B1A", "o"));
    s = linkToken(s, "light", "primary", "sunset-500");
    s = linkToken(s, "light", "ring", "forest-green-500");
    const primary = s.styles.light.primary;
    s = deletePalette(s, "g");
    assert.equal(s.styles.light.primary, primary);
    assert.equal(s.brandRefs!.light.primary, "sunset-500");
    assert.equal(s.brandRefs!.light.ring, undefined);
  });
});
