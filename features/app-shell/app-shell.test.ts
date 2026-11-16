import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { parseTheme } from "@/scripts/theme/lib.mjs";
import { checkTheme } from "@/scripts/theme/rules.mjs";
import { defaultThemeState } from "@/config/theme";
import type { ThemeStyles } from "@/types/theme";

import { stylesFromCss, fixErrors } from "./dev/test-themes";
import { fontsourceAvailability, formatFontStack } from "./font-stack";
import { COLOR_KEYS, generateTailwindV4Css, headingFont } from "./generate-css";
import { differenceEuclidean, parse } from "culori";
import { runThemeCheck } from "./theme-check";

const withStyles = (styles: ThemeStyles) => ({ ...defaultThemeState, styles });
const patch = (light: object, dark: object = {}): ThemeStyles => ({
  light: { ...defaultThemeState.styles.light, ...light },
  dark: { ...defaultThemeState.styles.dark, ...dark },
});

describe("formatFontStack", () => {
  it("quotes the family and adds the full fallback stack", () => {
    assert.equal(formatFontStack("Oxanium, sans-serif", "font-sans"), '"Oxanium", ui-sans-serif, system-ui, sans-serif');
    assert.equal(
      formatFontStack("Fira Code, monospace", "font-mono"),
      '"Fira Code", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
    );
    assert.equal(
      formatFontStack("Merriweather, serif", "font-serif"),
      '"Merriweather", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
    );
  });

  it("takes the kind from the generic family before the token", () => {
    assert.match(formatFontStack("Lora, serif", "font-sans"), /^"Lora", ui-serif/);
  });

  it("keeps a pure system stack in order", () => {
    assert.equal(
      formatFontStack('ui-serif, Georgia, Cambria, "Times New Roman", Times, serif', "font-serif"),
      'ui-serif, "Georgia", "Cambria", "Times New Roman", "Times", serif'
    );
  });
});

describe("fontsourceAvailability", () => {
  it("knows variable, static-only and missing fonts", () => {
    assert.equal(fontsourceAvailability("Oxanium"), "variable");
    assert.equal(fontsourceAvailability("Space Mono"), "static");
    assert.equal(fontsourceAvailability("Not A Real Font"), null);
  });
});

describe("App shell CSS", () => {
  const css = generateTailwindV4Css(defaultThemeState, "app-shell");
  const theme = parseTheme(css);

  it("contains only :root and .dark", () => {
    assert.deepEqual(theme.removed, []);
    assert.deepEqual(theme.unknown, []);
    assert.doesNotMatch(css, /@import|@theme|@layer|@custom-variant/);
  });

  it("builds shadows from the shadow variables, with alpha capped at 1", () => {
    assert.match(theme.root.get("shadow-md"), /color-mix\(in oklab, var\(--shadow-color\)/);
    assert.match(theme.root.get("shadow-2xl"), /min\(1, var\(--shadow-opacity\) \* 2\.5\)/);
  });

  it("passes the structure and value checks", () => {
    const failing = checkTheme(theme).filter(
      (r: { status: string; check: string }) =>
        r.status === "fail" && /Påkrævede|Ugyldig/.test(r.check)
    );
    assert.deepEqual(failing, []);
  });

  it("writes the shadow opacity per mode", () => {
    const out = parseTheme(generateTailwindV4Css(withStyles(patch({ "shadow-opacity": "0.1" }, { "shadow-opacity": "0.5" })), "app-shell"));
    assert.equal(out.root.get("shadow-opacity"), "0.1");
    assert.equal(out.dark.get("shadow-opacity"), "0.5");
  });

  it("keeps alpha on colours", () => {
    const out = parseTheme(generateTailwindV4Css(withStyles(patch({}, { border: "oklch(1 0 0 / 10%)" })), "app-shell"));
    assert.equal(out.dark.get("border"), "oklch(1 0 0 / 0.1)");
  });
});

describe("--font-heading", () => {
  it("is exported only when it differs from the sans font", () => {
    assert.equal(headingFont(patch({ "font-sans": "Inter, sans-serif" }).light), null);
    assert.equal(headingFont(patch({ "font-sans": "Inter, sans-serif", "font-heading": "Inter, sans-serif" }).light), null);
    assert.equal(
      headingFont(patch({ "font-sans": "Inter, sans-serif", "font-heading": "Lora, serif" }).light),
      '"Lora", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
    );
  });
});

describe("Standalone CSS", () => {
  it("uses the app shell's radius scale and tracking", () => {
    const css = generateTailwindV4Css(defaultThemeState, "standalone");
    assert.match(css, /--radius-sm: calc\(var\(--radius\) \* 0\.6\);/);
    assert.match(css, /--radius-4xl: calc\(var\(--radius\) \* 2\.6\);/);
    assert.match(css, /--font-heading: var\(--font-heading, var\(--font-sans\)\);/);
    assert.match(css, /letter-spacing: var\(--tracking-normal\);/);
    assert.doesNotMatch(css, /- 4px|\+ 4px/);
  });
});

describe("live check", () => {
  it("matches theme:check on the exported file", () => {
    const styles = stylesFromCss(readFileSync("themes/test-2.css", "utf8"));
    const live = runThemeCheck({ styles }).filter((r) => r.status !== "info");
    const cli = checkTheme(parseTheme(generateTailwindV4Css(withStyles(styles), "app-shell")), "theme.css");
    assert.deepEqual(
      live.map((r) => [r.status, r.mode, r.check, r.detail]),
      cli.map((r: { status: string; mode: string; check: string; detail: string }) => [r.status, r.mode, r.check, r.detail])
    );
  });

  it("points contrast results at both tokens", () => {
    const styles = patch({ "primary-foreground": "oklch(0.7 0 0)", primary: "oklch(0.65 0 0)" });
    const r = runThemeCheck({ styles }).find((x) => x.check === "Tekst: primary-foreground på primary" && x.modeKey === "light");
    assert.equal(r?.status, "fail");
    assert.deepEqual(r?.tokens, ["primary-foreground", "primary"]);
  });
});

describe("test theme fixes", () => {
  for (const n of [1, 2, 3]) {
    it(`test-${n} has no errors after fixing, only lightness changes`, () => {
      const original = stylesFromCss(readFileSync(`themes/test-${n}.css`, "utf8"));
      const { unfixed, changes } = fixErrors(original);
      assert.deepEqual(unfixed, []);
      assert.ok(changes.length > 0);
    });
  }

  it("leaves warnings alone (test-3 keeps its black/white destructive)", () => {
    const original = stylesFromCss(readFileSync("themes/test-3.css", "utf8"));
    const { styles } = fixErrors(original);
    assert.equal(styles.light.destructive, original.light.destructive);
    assert.equal(styles.dark.destructive, original.dark.destructive);
  });
});

describe("default theme", () => {
  it("is the app shell's default theme and passes theme:check without errors", () => {
    const fails = runThemeCheck(defaultThemeState).filter((r) => r.status === "fail");
    assert.deepEqual(fails, []);
    const shell = parseTheme(readFileSync("themes/app-shell-default.css", "utf8"));
    const ours = parseTheme(generateTailwindV4Css(defaultThemeState, "app-shell"));
    const deltaE = differenceEuclidean("oklab");
    for (const block of ["root", "dark"] as const) {
      for (const key of COLOR_KEYS) {
        const a = parse(shell[block].get(key))!;
        const b = parse(ours[block].get(key))!;
        assert.ok(deltaE(a, b) < 0.001 && Math.abs((a.alpha ?? 1) - (b.alpha ?? 1)) < 0.001, `${block} ${key}`);
      }
      assert.equal(ours[block].get("radius"), shell[block].get("radius"));
    }
  });
});
