#!/usr/bin/env node
/**
 * DELT FIL – holdes ens i app shell-repoet og theme generator-repoet
 * (scripts/theme/check.mjs). Ret den ét sted og kopiér den til det andet.
 *
 * npm run theme:check [fil ...]   (standard: src/styles/theme.css)
 *
 * Tjekker et tema mod skallens kontrakt:
 * - påkrævede tokens (farver i både :root og .dark, resten i :root)
 * - WCAG-kontrast for forgrund/baggrund-par (4,5:1 tekst, 3:1 grafik)
 * - chart-1…5: ingen dubletter, til at skelne fra hinanden, 3:1 mod card
 * - ugyldige værdier (fx alpha over 1, negativ radius, farver der ikke kan læses)
 * - advarsler for designvalg, der kan give problemer
 *
 * Selve reglerne ligger i rules.mjs (deles med generatorens live tjek).
 * Denne fil læser filerne, tjekker fonts.css og skriver tabellen.
 * Afslutter med exit code 1, hvis noget fejler.
 */
import { existsSync, readFileSync } from "node:fs"
import { basename, relative, resolve } from "node:path"

import {
  FONT_TOKENS,
  baseFamily,
  isSystemFont,
  parseTheme,
  primaryFamily,
} from "./lib.mjs"
import { checkTheme } from "./rules.mjs"

const ROOT = resolve(import.meta.dirname, "../..")
const DEFAULT = resolve(ROOT, "src/styles/theme.css")
const FONTS_CSS = resolve(ROOT, "src/styles/fonts.css")

const results = []

function checkFile(file) {
  const name = basename(file)
  const theme = parseTheme(readFileSync(file, "utf8"))
  results.push(...checkTheme(theme, name))

  // --- Fonte (kun det aktive tema: er de indlæst i fonts.css?) ------------
  const isActive = resolve(file) === DEFAULT
  if (isActive && existsSync(FONTS_CSS)) {
    const fontsCss = readFileSync(FONTS_CSS, "utf8")
    for (const token of FONT_TOKENS) {
      const family = primaryFamily(theme.root.get(token))
      if (!family || isSystemFont(family)) continue
      const base = baseFamily(family)
      const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const loaded =
        fontsCss.includes(`/${slug}"`) ||
        fontsCss.includes(`/${slug}/`) ||
        new RegExp(`font-family:\\s*["']?${base}["']?`, "i").test(fontsCss)
      if (!loaded)
        results.push({
          status: "warn",
          theme: name,
          mode: "–",
          modeKey: null,
          check: "Fonte indlæst",
          detail: `--${token}: "${base}" indlæses ikke i fonts.css (kør theme:apply eller tilføj @font-face)`,
          tokens: [token],
        })
    }
  }
}

// ---------------------------------------------------------------------------

const files = process.argv.slice(2).filter((a) => !a.startsWith("--"))
const targets = files.length
  ? files.map((f) => resolve(process.cwd(), f))
  : [DEFAULT]
for (const f of targets) {
  if (!existsSync(f)) {
    console.error(`Filen findes ikke: ${f}`)
    process.exit(2)
  }
  checkFile(f)
}

const LABEL = { pass: "✔ bestået", fail: "✖ fejlet", warn: "⚠ advarsel" }
const COLOR = { pass: 32, fail: 31, warn: 33 }
const status = (s) => `\x1b[${COLOR[s]}m${LABEL[s].padEnd(10)}\x1b[0m`
const verbose = process.argv.includes("--all")

for (const f of targets) {
  const name = basename(f)
  const mine = results.filter((r) => r.theme === name)
  const rows = verbose ? mine : mine.filter((r) => r.status !== "pass")
  const wMode = Math.max(5, ...rows.map((r) => r.mode.length))
  const wCheck = Math.max(4, ...rows.map((r) => r.check.length))
  console.log(`\n\x1b[1m${relative(process.cwd(), f) || name}\x1b[0m`)
  if (rows.length) {
    console.log(
      `${"Status".padEnd(10)}  ${"Tema".padEnd(wMode)}  ${"Tjek".padEnd(wCheck)}  Detalje`
    )
    for (const r of rows)
      console.log(
        `${status(r.status)}  ${r.mode.padEnd(wMode)}  ${r.check.padEnd(wCheck)}  ${r.detail}`
      )
  }
  const count = (s) => mine.filter((r) => r.status === s).length
  console.log(
    `\n${count("pass")} bestået · ${count("fail")} fejlet · ${count("warn")} advarsler${verbose ? "" : " (vis også beståede med --all)"}`
  )
}

process.exit(results.some((r) => r.status === "fail") ? 1 : 0)
