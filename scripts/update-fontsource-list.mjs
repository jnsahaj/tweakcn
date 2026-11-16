#!/usr/bin/env node
/**
 * Regenerates features/app-shell/fontsource-families.json from the public Fontsource API.
 * The editor uses the file to warn when a font can't be installed by the app shell's theme:apply.
 *
 *   node scripts/update-fontsource-list.mjs
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve(import.meta.dirname, "../features/app-shell/fontsource-families.json");

const res = await fetch("https://api.fontsource.org/v1/fonts");
if (!res.ok) throw new Error(`Fontsource API: ${res.status}`);
const fonts = await res.json();

// { "Family Name": 1 (has a variable version) | 0 (static only) }
const families = Object.fromEntries(
  fonts
    .map((f) => [f.family, f.variable ? 1 : 0])
    .sort(([a], [b]) => a.localeCompare(b))
);

writeFileSync(OUT, JSON.stringify(families) + "\n");
console.log(`Wrote ${Object.keys(families).length} families to ${OUT}`);
