// Dev helper: print generated scales next to Tailwind's. Run: npx tsx features/brand-palettes/dev/compare.ts
import { differenceEuclidean, parse } from "culori";
import { TAILWIND_PALETTE } from "@/utils/registry/tailwind-colors";
import { SCALE_STEPS, generateScale, parseToOklch } from "../scale";

const dE = differenceEuclidean("oklab");
const samples = [["#0B3D2E", "emerald"], ["#FF6B1A", "orange"], ["#1D4ED8", "blue"], ["#F5E6A8", "yellow"], ["#1A1A1A", "neutral"]] as const;
const fmt = (vals: string[]) => {
  const o = vals.map((v) => parseToOklch(v)!);
  const de = vals.map((v, i) => (i ? dE(parse(vals[i - 1])!, parse(v)!) : 0));
  return [
    "L  " + o.map((x) => x.l.toFixed(3)).join(" "),
    "C  " + o.map((x) => (x.c ?? 0).toFixed(3)).join(" "),
    "dE " + de.map((x) => x.toFixed(3)).join(" "),
  ].join("\n");
};
for (const [hex, tw] of samples) {
  const g = generateScale(hex);
  console.log(`\n${hex} anchor ${g.anchorStep}\n${fmt(SCALE_STEPS.map((s) => g.steps[s]))}`);
  console.log(`tailwind ${tw}\n${fmt(SCALE_STEPS.map((s) => (TAILWIND_PALETTE[tw] as Record<number, string>)[s]))}`);
}
