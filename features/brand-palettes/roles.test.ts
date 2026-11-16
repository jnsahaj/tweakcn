import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { wcagContrast } from "culori";
import { defaultThemeState } from "@/config/theme";
import { addPalette, createPalette, deletePalette, getActiveRef, linkToken, renamePalette, setStepValue } from "./palette";
import {
  TOKEN_RULES,
  WHITE,
  assignRole,
  getTokenRoleStatus,
  resetAllToAuto,
  resetTokenToAuto,
  forgetRoleTracking,
  setWhiteBackground,
  syncRoles,
  type RoleState,
} from "./roles";
import { toHex } from "./scale";
import { parseTheme } from "@/scripts/theme/lib.mjs";
import { checkTheme } from "@/scripts/theme/rules.mjs";
import { generateTailwindV4Css } from "@/features/app-shell/generate-css";
import { defaultThemeState as editorDefaults } from "@/config/theme";

const fresh = (): RoleState => {
  let s: RoleState = {
    styles: {
      light: { ...defaultThemeState.styles.light },
      dark: { ...defaultThemeState.styles.dark },
    },
  };
  s = addPalette(s, createPalette("Forest Green", "#0B3D2E", "green"));
  s = addPalette(s, createPalette("Sunset", "#FF6B1A", "orange"));
  s = addPalette(s, createPalette("Stone Grey", "#78716C", "grey"));
  s = addPalette(s, createPalette("Ocean", "#1D4ED8", "blue"));
  s = addPalette(s, createPalette("Alarm", "#DC2626", "red"));
  return s;
};

const withRoles = (primary = "green") => {
  let s = fresh();
  s = assignRole(s, "neutral", "grey");
  s = assignRole(s, "primary", primary);
  s = assignRole(s, "secondary", "orange");
  return s;
};

const pal = (s: RoleState, id: string) => s.brandPalettes!.find((p) => p.id === id)!;
const contrast = (a: unknown, b: unknown) => wcagContrast(String(a), String(b));

describe("role rules", () => {
  it("unassigned roles leave tokens exactly as they are (except Destructive)", () => {
    const s0 = fresh();
    const s = assignRole(s0, "neutral", "grey");
    assert.equal(s.styles.light.primary, s0.styles.light.primary);
    assert.equal(s.styles.light["chart-2"], s0.styles.light["chart-2"]);
    assert.notEqual(s.styles.light.background, s0.styles.light.background);
  });

  it("unassigned Destructive follows the built-in red, without a brand reference", () => {
    const s = withRoles();
    const status = getTokenRoleStatus(s, "dark", "destructive");
    assert.equal(status?.kind, "auto");
    assert.match((status as { label: string }).label, /^Default red \d+$/);
    assert.equal(s.brandRefs?.dark["destructive"], undefined);
    assert.notEqual(s.styles.dark["destructive"], fresh().styles.dark["destructive"]);
  });

  it("no roles assigned: Destructive is left alone too", () => {
    const s0 = fresh();
    const s = syncRoles({ ...s0, brandRoles: { assignments: {}, auto: { light: {}, dark: {} }, manual: { light: [], dark: [] } } });
    assert.equal(s.styles.dark["destructive"], s0.styles.dark["destructive"]);
  });

  it("follows the step table and stores references", () => {
    const s = withRoles();
    const grey = pal(s, "grey");
    assert.equal(s.styles.light.background, grey.steps[50].value);
    assert.equal(s.styles.dark.background, grey.steps[950].value);
    assert.equal(s.styles.dark.card, grey.steps[900].value);
    assert.equal(s.styles.light.border, grey.steps[200].value);
    assert.equal(s.brandRefs!.light.background, "stone-grey-50");
    assert.equal(s.brandRefs!.dark.secondary, "sunset-800");
    assert.equal(s.styles.light.secondary, pal(s, "orange").steps[100].value);
  });

  it("primary in light mode is the exact brand colour (anchor step)", () => {
    const s = withRoles();
    assert.equal(toHex(String(s.styles.light.primary)), "#0b3d2e");
    assert.equal(s.brandRefs!.light.primary, "forest-green-900");
  });

  it("primary in dark mode moves lighter until it has 4.5:1 against the background", () => {
    const s = withRoles(); // forest green anchors at 900: far too dark on a dark background
    const ratio = contrast(s.styles.dark.primary, s.styles.dark.background);
    assert.ok(ratio >= 4.5, `ratio ${ratio}`);
    // nearest lighter step that passes: the step just darker than it must fail
    const ref = s.brandRefs!.dark.primary!;
    const stepNum = Number(ref.split("-").pop());
    assert.ok(stepNum < 900);
    const darker = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950][
      [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].indexOf(stepNum) + 1
    ] as 900;
    assert.ok(contrast(pal(s, "green").steps[darker].value, s.styles.dark.background) < 4.5);
  });

  it("keeps the anchor in dark mode when it already has 3:1", () => {
    const s = withRoles("orange"); // orange anchors at 400, bright enough on dark
    assert.equal(s.brandRefs!.dark.primary, "sunset-400");
  });

  it("auto foregrounds pick the highest-contrast of white / 50 / 950 and reach 4.5:1", () => {
    for (const primary of ["green", "orange", "blue"]) {
      const s = withRoles(primary);
      for (const mode of ["light", "dark"] as const) {
        const fg = s.styles[mode]["primary-foreground"];
        const bg = s.styles[mode].primary;
        assert.ok(contrast(fg, bg) >= 4.5, `${primary} ${mode}`);
        const p = pal(s, primary);
        for (const alt of [WHITE, p.steps[50].value, p.steps[950].value]) {
          assert.ok(contrast(fg, bg) >= contrast(alt, bg) - 1e-9);
        }
      }
    }
  });

  it("warns when no foreground reaches 4.5:1", () => {
    let s = fresh();
    s = addPalette(s, createPalette("Mid", "#808080", "mid"));
    s = assignRole(s, "primary", "mid"); // mid grey: white ≈ 3.9, black-ish 950 ≈ ... still checked
    const status = getTokenRoleStatus(s, "light", "primary-foreground");
    assert.equal(status?.kind, "auto");
    const ratio = contrast(s.styles.light["primary-foreground"], s.styles.light.primary);
    if (ratio < 4.5) assert.ok(status && status.kind === "auto" && status.warning);
    else assert.ok(status && status.kind === "auto" && !status.warning);
  });

  it("secondary foreground prefers 900 / 100 and falls back to contrast", () => {
    const s = withRoles();
    assert.equal(s.brandRefs!.light["secondary-foreground"], "sunset-900");
    assert.ok(contrast(s.styles.dark["secondary-foreground"], s.styles.dark.secondary) >= 4.5);
  });

  it("muted-foreground is readable on the background", () => {
    const s = withRoles();
    for (const mode of ["light", "dark"] as const) {
      assert.ok(contrast(s.styles[mode]["muted-foreground"], s.styles[mode].background) >= 4.5, mode);
    }
  });

  it("destructive meets 3:1 against the background in both modes", () => {
    let s = withRoles();
    s = assignRole(s, "destructive", "red");
    for (const mode of ["light", "dark"] as const) {
      assert.ok(contrast(s.styles[mode].destructive, s.styles[mode].background) >= 3, mode);
      assert.ok(contrast(s.styles[mode]["destructive-foreground"], s.styles[mode].destructive) >= 4.5, mode);
    }
  });

  it("charts alternate primary and secondary", () => {
    const s = withRoles();
    const refs = [1, 2, 3, 4, 5].map((i) => s.brandRefs!.light[`chart-${i}`]!);
    assert.deepEqual(refs.map((r) => r.split("-")[0]), ["forest", "sunset", "forest", "sunset", "forest"]);
    assert.equal(new Set(refs).size, 5);
  });

  it("sidebar tokens mirror their main tokens", () => {
    const s = withRoles();
    for (const mode of ["light", "dark"] as const) {
      assert.equal(s.styles[mode].sidebar, s.styles[mode].background);
      assert.equal(s.styles[mode]["sidebar-primary"], s.styles[mode].primary);
      assert.equal(s.brandRefs![mode]["sidebar-primary"], s.brandRefs![mode].primary);
      assert.equal(s.styles[mode]["sidebar-ring"], s.styles[mode].ring);
    }
  });

  it("pure white background option (light mode only)", () => {
    let s = withRoles();
    s = setWhiteBackground(s, true);
    assert.equal(s.styles.light.background, WHITE);
    assert.equal(s.styles.light.card, WHITE);
    assert.equal(s.brandRefs!.light.background, undefined);
    assert.notEqual(s.styles.dark.background, WHITE);
    assert.deepEqual(getTokenRoleStatus(s, "light", "background"), { kind: "auto", label: "White", warning: undefined });
  });

  it("every shadcn colour token has a rule", () => {
    const colourTokens = Object.keys(defaultThemeState.styles.light).filter(
      (k) => !k.startsWith("font-") && !k.startsWith("shadow-") && !["radius", "letter-spacing", "spacing"].includes(k)
    );
    for (const t of colourTokens) assert.ok(TOKEN_RULES[t], `missing rule for ${t}`);
  });
});

describe("auto vs manual", () => {
  it("tokens are Auto with a readable label", () => {
    const s = withRoles();
    assert.deepEqual(getTokenRoleStatus(s, "light", "secondary"), { kind: "auto", label: "Secondary 100", warning: undefined });
    assert.equal(getTokenRoleStatus(fresh(), "light", "secondary"), null); // no roles at all
  });

  it("swapping the primary palette re-colours every Auto primary token in both modes", () => {
    let s = withRoles("green");
    s = assignRole(s, "primary", "blue");
    for (const mode of ["light", "dark"] as const) {
      for (const t of ["primary", "ring", "chart-1", "sidebar-primary"]) {
        assert.match(s.brandRefs![mode][t]!, /^ocean-/, `${mode} ${t}`);
      }
    }
  });

  it("a manual edit becomes Manual and survives role changes", () => {
    let s = withRoles("green");
    s = { ...s, styles: { ...s.styles, light: { ...s.styles.light, primary: "#ff00ff" } } };
    s = syncRoles(s);
    assert.equal(getTokenRoleStatus(s, "light", "primary")?.kind, "manual");
    s = assignRole(s, "primary", "blue");
    assert.equal(s.styles.light.primary, "#ff00ff");
    assert.match(s.brandRefs!.dark.primary!, /^ocean-/); // dark mode still auto
  });

  it("linking a different brand step manually also counts as Manual", () => {
    let s = withRoles("green");
    s = syncRoles(linkToken(s, "light", "ring", "sunset-500"));
    s = assignRole(s, "primary", "blue");
    assert.equal(s.brandRefs!.light.ring, "sunset-500");
  });

  it("dependent Auto tokens follow a manual change (foreground re-picked)", () => {
    let s = withRoles("orange");
    s = { ...s, styles: { ...s.styles, light: { ...s.styles.light, primary: "#111111" } } };
    s = syncRoles(s);
    assert.ok(contrast(s.styles.light["primary-foreground"], "#111111") >= 4.5);
    assert.equal(s.styles.light["sidebar-primary"], "#111111");
  });

  it("reset returns a token to Auto", () => {
    let s = withRoles("green");
    const auto = s.styles.light.primary;
    s = syncRoles({ ...s, styles: { ...s.styles, light: { ...s.styles.light, primary: "#ff00ff" } } });
    s = resetTokenToAuto(s, "light", "primary");
    assert.equal(s.styles.light.primary, auto);
    assert.equal(getTokenRoleStatus(s, "light", "primary")?.kind, "auto");
  });

  it("reset all clears every manual token", () => {
    let s = withRoles("green");
    s = syncRoles({ ...s, styles: { ...s.styles, dark: { ...s.styles.dark, muted: "#ff00ff", border: "#00ff00" } } });
    s = resetAllToAuto(s);
    assert.equal(getTokenRoleStatus(s, "dark", "muted")?.kind, "auto");
    assert.equal(getTokenRoleStatus(s, "dark", "border")?.kind, "auto");
  });

  it("editing a palette step keeps linked tokens Auto and updates them", () => {
    let s = withRoles("orange");
    s = syncRoles(setStepValue(s, "orange", 100, "#ffeedd"));
    assert.equal(toHex(String(s.styles.light.secondary)), "#ffeedd");
    assert.equal(getTokenRoleStatus(s, "light", "secondary")?.kind, "auto");
  });

  it("renaming a palette keeps tokens Auto", () => {
    let s = withRoles("orange");
    s = syncRoles(renamePalette(s, "orange", "Tangerine"));
    assert.equal(getTokenRoleStatus(s, "light", "secondary")?.kind, "auto");
    s = syncRoles(setStepValue(s, "orange", 100, "#ffeedd"));
    assert.equal(getTokenRoleStatus(s, "light", "secondary")?.kind, "auto");
    assert.equal(getActiveRef(s, "light", "secondary"), "tangerine-100");
  });

  it("deleting an assigned palette unassigns the role; tokens keep their colours", () => {
    let s = withRoles("green");
    const primary = s.styles.light.primary;
    s = syncRoles(deletePalette(s, "green"));
    assert.equal(s.brandRoles!.assignments.primary, undefined);
    assert.equal(s.styles.light.primary, primary);
    assert.equal(getTokenRoleStatus(s, "light", "primary"), null);
  });

  it("syncRoles is idempotent", () => {
    const s = withRoles();
    assert.equal(syncRoles(s), s);
  });
});

// The rules must produce themes that pass the app shell's own theme:check (scripts/theme/rules.mjs).
describe("role rules pass the app shell theme check", () => {
  const cases: [string, string, string][] = [
    ["lime on teal grey", "#C6E85B", "#2F5D55"],
    ["dark green on warm grey", "#0B3D2E", "#78716C"],
    ["blue on cool grey", "#1D4ED8", "#64748B"],
    ["pale yellow on neutral", "#F5E6A8", "#737373"],
  ];
  for (const [name, primary, neutral] of cases) {
    for (const destructive of [true, false]) {
      it(`${name}${destructive ? "" : ", Destructive unassigned"}`, () => {
        let s = fresh();
        s = addPalette(s, createPalette("P", primary, "p"));
        s = addPalette(s, createPalette("N", neutral, "n"));
        s = assignRole(s, "neutral", "n");
        s = assignRole(s, "primary", "p");
        s = assignRole(s, "secondary", "orange");
        if (destructive) s = assignRole(s, "destructive", "red");
        const css = generateTailwindV4Css({ ...editorDefaults, styles: s.styles } as never, "app-shell");
        const fails = checkTheme(parseTheme(css), name)
          .filter((r: { status: string }) => r.status === "fail")
          .map((r: { mode: string; check: string; detail: string }) => `${r.mode} ${r.check} ${r.detail}`);
        assert.deepEqual(fails, []);
      });
    }
  }
});

describe("switching preset", () => {
  it("brand roles apply again on top of the new preset's styles", () => {
    const s0 = withRoles();
    const lime = s0.styles.light.primary;
    const preset = {
      light: { ...defaultThemeState.styles.light, primary: "#8839ef", radius: "1rem" },
      dark: { ...defaultThemeState.styles.dark, primary: "#cba6f7" },
    };
    // without forgetting, every role token is taken as a manual edit and stays on the preset
    const stuck = syncRoles({ ...s0, styles: preset });
    assert.equal(stuck.styles.light.primary, "#8839ef");
    const s = syncRoles(forgetRoleTracking({ ...s0, styles: preset }));
    assert.equal(s.styles.light.primary, lime);
    assert.equal(s.styles.light.radius, "1rem");
    assert.deepEqual(s.brandRoles!.manual, { light: [], dark: [] });
  });
});

describe("destructive stays recognisably red", () => {
  it("never walks past 800 (light) / 200 (dark), and warns instead", () => {
    let s = fresh();
    s = addPalette(s, createPalette("Teal", "#2F5D55", "teal"));
    s = addPalette(s, createPalette("Lime", "#C6E85B", "lime"));
    s = assignRole(s, "neutral", "teal");
    s = assignRole(s, "primary", "lime");
    const red = createPalette("Red", "#DC2626", "x");
    const allowed = (mode: "light" | "dark") =>
      (mode === "light" ? [600, 700, 800] : [400, 300, 200]).map((n) => red.steps[n as 200].value);
    for (const mode of ["light", "dark"] as const) {
      assert.ok(allowed(mode).includes(String(s.styles[mode].destructive)), `${mode}: ${s.styles[mode].destructive}`);
    }
  });
});

describe("brand and primary", () => {
  it("brand keeps the exact brand colour; primary darkens until it reads as text", () => {
    let s = fresh();
    s = addPalette(s, createPalette("Lime", "#C6E85B", "lime"));
    s = assignRole(s, "neutral", "grey");
    s = assignRole(s, "primary", "lime");
    const lime = pal(s, "lime");
    for (const mode of ["light", "dark"] as const) {
      assert.equal(s.styles[mode].brand, lime.steps[lime.anchorStep].value, mode);
      assert.ok(contrast(s.styles[mode]["brand-foreground"], s.styles[mode].brand) >= 4.5, `${mode} brand fg`);
      assert.ok(contrast(s.styles[mode].primary, s.styles[mode].background) >= 4.5, `${mode} primary`);
    }
    assert.notEqual(s.styles.light.primary, s.styles.light.brand);
  });

  it("no primary role: brand is not set, so the app shell falls back to primary", () => {
    const s = assignRole(fresh(), "neutral", "grey");
    assert.equal(s.styles.light.brand, undefined);
  });
});
