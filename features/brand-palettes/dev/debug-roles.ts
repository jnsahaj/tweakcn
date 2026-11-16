// Dev helper: resolve the role rules for sample palettes and print labels, contrast and warnings.
// Run: npx tsx features/brand-palettes/dev/debug-roles.ts
import { wcagContrast } from "culori";
import { defaultThemeState } from "@/config/theme";
import { addPalette, createPalette } from "../palette";
import { assignRole, type RoleState } from "../roles";

const SAMPLES: [string, string][] = [
  ["Dark Green", "#0B3D2E"],
  ["Bright Orange", "#FF6B1A"],
  ["Saturated Blue", "#1D4ED8"],
  ["Pale Yellow", "#F5E6A8"],
  ["Near Black", "#1A1A1A"],
];
const NEUTRALS: [string, string][] = [
  ["Warm Grey", "#78716C"],
  ["Cool Grey", "#64748B"],
];

const c = (a: unknown, b: unknown) => wcagContrast(String(a), String(b)).toFixed(2);

for (const [nName, nHex] of NEUTRALS) {
  for (const [pName, pHex] of SAMPLES) {
    let s: RoleState = {
      styles: { light: { ...defaultThemeState.styles.light }, dark: { ...defaultThemeState.styles.dark } },
    };
    s = addPalette(s, createPalette(nName, nHex, "n"));
    s = addPalette(s, createPalette(pName, pHex, "p"));
    s = addPalette(s, createPalette("Sunset", "#FF6B1A", "s"));
    s = addPalette(s, createPalette("Alarm", "#DC2626", "d"));
    s = assignRole(s, "neutral", "n");
    s = assignRole(s, "primary", "p");
    s = assignRole(s, "secondary", "s");
    s = assignRole(s, "destructive", "d");
    console.log(`\n== Primary ${pName} ${pHex}, Neutral ${nName}`);
    for (const m of ["light", "dark"] as const) {
      const st = s.styles[m];
      const a = s.brandRoles!.auto[m];
      console.log(
        `${m.padEnd(5)} primary ${a.primary.label} (${c(st.primary, st.background)}:1 vs bg) · fg ${a["primary-foreground"].label} ${c(st["primary-foreground"], st.primary)}:1 · muted-fg ${a["muted-foreground"].label} ${c(st["muted-foreground"], st.background)}:1 · fg/bg ${c(st.foreground, st.background)}:1`
      );
      for (const [t, e] of Object.entries(a)) if (e.warning) console.log(`   ⚠ ${t}: ${e.warning}`);
    }
  }
}
