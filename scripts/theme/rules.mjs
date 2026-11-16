/**
 * DELT FIL – holdes ens i app shell-repoet og theme generator-repoet
 * (scripts/theme/rules.mjs). Ret den ét sted og kopiér den til det andet.
 *
 * Reglerne bag theme:check, uden fil- og konsol-adgang, så de også kan køre
 * i browseren (generatorens live tjek). CLI'en er scripts/theme/check.mjs.
 *
 * checkTheme(theme, name) tager et parset tema (parseTheme fra lib.mjs) og
 * returnerer en liste af resultater:
 *   { status: "pass"|"fail"|"warn", theme, mode: "lyst"|"mørkt"|"–",
 *     modeKey: "light"|"dark"|null, check, detail, tokens: string[] }
 * `tokens` er de tokens, resultatet handler om (forgrund først).
 */
import {
  converter,
  differenceEuclidean,
  parse,
  toGamut,
  wcagContrast,
} from "culori"

import {
  COLOR_FALLBACKS,
  COLOR_TOKENS,
  OPTIONAL_COLOR_TOKENS,
  ROOT_TOKENS,
} from "./lib.mjs"

const toRgb = toGamut("rgb", "oklch")
const toOklch = converter("oklch")
const deltaE = differenceEuclidean("oklab")

export const TEXT = 4.5
export const GRAPHIC = 3

/** Forgrund/baggrund-par. `tint` = forgrundsfarven med alpha over baggrunden. */
export const TEXT_PAIRS = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["brand-foreground", "brand", "knapper og badges"],
  ["secondary-foreground", "secondary"],
  ["accent-foreground", "accent"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["muted-foreground", "card"],
  ["primary", "background", "links og tekst i primærfarven"],
  ["destructive", "background", "fejltekster"],
  [
    "destructive",
    { tint: "destructive", over: "background", light: 0.1, dark: 0.2 },
    "destructive-knapper/-badges (bg-destructive/10, mørk /20)",
  ],
  ["destructive-foreground", "destructive"],
  ["sidebar-foreground", "sidebar"],
  ["sidebar-primary-foreground", "sidebar-primary"],
  ["sidebar-accent-foreground", "sidebar-accent"],
]

export const GRAPHIC_PAIRS = [
  ["primary", "background", "checkbox, switch, progress"],
  ["sidebar-primary", "sidebar", "workspace-logo"],
  ...[1, 2, 3, 4, 5].map((n) => [`chart-${n}`, "card", "graf"]),
]

/** Par, der kun giver advarsel (shadcn's standard består dem sjældent). */
export const WARN_PAIRS = [
  ["input", "background", GRAPHIC, "kant på formularfelter (WCAG 1.4.11)"],
  ["ring", "background", GRAPHIC, "fokusring"],
]

export const fmt = (n) => n.toFixed(2).replace(".", ",")

const MODE_LABEL = { light: "lyst", dark: "mørkt" }

/**
 * Slår et token op og følger var(--x) (inden for samme blok, ellers :root).
 * Valgfrie tokens, temaet ikke har, slås op via COLOR_FALLBACKS.
 */
export function lookup(theme, mode, token, seen = new Set()) {
  const block = mode === "dark" ? theme.dark : theme.root
  const raw = block.get(token) ?? theme.root.get(token)
  if (raw == null) {
    const fallback = COLOR_FALLBACKS[token]
    return fallback ? lookup(theme, mode, fallback, seen) : null
  }
  const m = raw.match(/^var\(--([\w-]+)\)$/)
  if (m && !seen.has(m[1])) {
    seen.add(m[1])
    return lookup(theme, mode, m[1], seen)
  }
  return raw
}

function color(theme, mode, token) {
  const raw = lookup(theme, mode, token)
  if (raw == null) return null
  const parsed = parse(raw)
  return parsed ?? null
}

/** Lægger en (evt. gennemsigtig) farve oven på en uigennemsigtig baggrund. */
function composite(fg, bg, alpha = fg.alpha ?? 1) {
  const f = toRgb(fg)
  const b = toRgb(bg)
  const mix = (k) => f[k] * alpha + b[k] * (1 - alpha)
  return { mode: "rgb", r: mix("r"), g: mix("g"), b: mix("b") }
}

function opaque(c, bg) {
  if ((c.alpha ?? 1) >= 1) return toRgb(c)
  return composite(c, bg)
}

/**
 * Den farve og alpha, skyggen (shadow-md) faktisk tegnes med. Læser en
 * literal farve i værdien, ellers --shadow-color og --shadow-opacity.
 */
function shadowPaint(theme, mode) {
  const src = lookup(theme, mode, "shadow-md") ?? ""
  const literal = src.match(/(?:hsla?|rgba?|oklch|oklab)\([^()]*\)/)
  const c = literal ? parse(literal[0]) : color(theme, mode, "shadow-color")
  if (!c) return null
  const alpha = Math.min(
    1,
    c.alpha ?? Number(lookup(theme, mode, "shadow-opacity") ?? 1)
  )
  return { color: c, alpha }
}

export function checkTheme(theme, name = "tema") {
  const results = []
  const add = (status, modeKey, check, detail = "", tokens = []) =>
    results.push({
      status,
      theme: name,
      mode: modeKey ? MODE_LABEL[modeKey] : "–",
      modeKey,
      check,
      detail,
      tokens,
    })

  if (theme.removed.length || theme.unknown.length) {
    add(
      "warn",
      null,
      "Struktur",
      `indeholder ${[...theme.removed, ...theme.unknown].join(", ")} – theme:apply fjerner det`
    )
  }

  // --- Påkrævede tokens ---------------------------------------------------
  for (const [modeKey, block] of [
    ["light", theme.root],
    ["dark", theme.dark],
  ]) {
    const missing = COLOR_TOKENS.filter((t) => !block.has(t))
    if (missing.length)
      add(
        "fail",
        modeKey,
        "Påkrævede farvetokens",
        `mangler: ${missing.join(", ")}`,
        missing
      )
    else
      add(
        "pass",
        modeKey,
        "Påkrævede farvetokens",
        `${COLOR_TOKENS.length} fundet`
      )
  }
  const missingRoot = ROOT_TOKENS.filter((t) => !theme.root.has(t))
  if (missingRoot.length)
    add(
      "fail",
      "light",
      "Påkrævede tokens i :root",
      `mangler: ${missingRoot.join(", ")}`,
      missingRoot
    )
  else
    add(
      "pass",
      "light",
      "Påkrævede tokens i :root",
      `${ROOT_TOKENS.length} fundet`
    )

  // --- Ugyldige værdier ---------------------------------------------------
  const invalid = []
  for (const [modeKey, block] of [
    ["light", theme.root],
    ["dark", theme.dark],
  ]) {
    const label = MODE_LABEL[modeKey]
    const bad = (token, msg) =>
      invalid.push({ modeKey, token, msg: `${label}: ${msg}` })
    for (const [token, value] of block) {
      for (const m of value.matchAll(
        /(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^()]*\/\s*([\d.]+)(%?)\s*\)/g
      )) {
        const alpha = Number(m[1]) / (m[2] ? 100 : 1)
        if (alpha > 1)
          bad(token, `--${token} har alpha ${m[1]}${m[2]} (max 1)`)
      }
      for (const m of value.matchAll(/oklch\(\s*([\d.]+)(%?)/g)) {
        const l = Number(m[1]) / (m[2] ? 100 : 1)
        if (l > 1) bad(token, `--${token} har OKLCH-lyshed ${m[1]} (max 1)`)
      }
      if (
        COLOR_TOKENS.includes(token) ||
        OPTIONAL_COLOR_TOKENS.includes(token) ||
        token === "shadow-color"
      ) {
        if (!/^var\(/.test(value) && !parse(value))
          bad(token, `--${token} kan ikke læses som farve (${value})`)
      }
    }
    const opacity = block.get("shadow-opacity")
    if (opacity != null && !(Number(opacity) >= 0 && Number(opacity) <= 1))
      bad("shadow-opacity", `--shadow-opacity er ${opacity} (skal være 0–1)`)
    const radius = block.get("radius")
    if (
      radius != null &&
      (/^-/.test(radius) || !/^[\d.]+(px|rem|em)?$/.test(radius))
    )
      bad("radius", `--radius er ${radius}`)
  }
  if (invalid.length)
    for (const i of invalid) {
      // Vises med "–" i tabellen (tilstanden står i teksten), men modeKey
      // fortæller editoren, hvilket tema fejlen hører til.
      add("fail", null, "Ugyldig værdi", i.msg, [i.token])
      results[results.length - 1].modeKey = i.modeKey
    }
  else add("pass", null, "Ugyldige værdier", "ingen")

  // --- Kontrast og farver pr. tilstand ------------------------------------
  for (const mode of ["light", "dark"]) {
    const bg = color(theme, mode, "background")
    if (!bg) continue
    const bgRgb = toRgb(bg)

    const resolvePair = (fgToken, bgSpec) => {
      if (typeof bgSpec === "string") {
        const b = color(theme, mode, bgSpec)
        if (!b) return null
        const bOpaque = opaque(b, bgRgb)
        const f = color(theme, mode, fgToken)
        if (!f) return null
        return {
          fg: opaque(f, bOpaque),
          bg: bOpaque,
          bgLabel: bgSpec,
          bgTokens: [bgSpec],
        }
      }
      const tint = color(theme, mode, bgSpec.tint)
      const over = color(theme, mode, bgSpec.over)
      const f = color(theme, mode, fgToken)
      if (!tint || !over || !f) return null
      const alpha = bgSpec[mode]
      const b = composite(tint, toRgb(over), alpha)
      return {
        fg: opaque(f, b),
        bg: b,
        bgLabel: `${bgSpec.tint}/${Math.round(alpha * 100)} på ${bgSpec.over}`,
        bgTokens: [bgSpec.tint, bgSpec.over],
      }
    }

    const pair = (status, fgToken, bgSpec, min, kind, note) => {
      const r = resolvePair(fgToken, bgSpec)
      if (!r) return
      const ratio = wcagContrast(r.fg, r.bg)
      const ok = ratio >= min
      add(
        ok ? "pass" : status,
        mode,
        `${kind}: ${fgToken} på ${r.bgLabel}`,
        `${fmt(ratio)}:1 (krav ${fmt(min)})${note ? ` – ${note}` : ""}`,
        [...new Set([fgToken, ...r.bgTokens])]
      )
    }

    for (const [f, b, note] of TEXT_PAIRS)
      pair("fail", f, b, TEXT, "Tekst", note)
    for (const [f, b, note] of GRAPHIC_PAIRS)
      pair("fail", f, b, GRAPHIC, "Grafik", note)
    for (const [f, b, min, note] of WARN_PAIRS)
      pair("warn", f, b, min, "Grafik", note)

    // Chart-farver: dubletter og afstand
    const charts = [1, 2, 3, 4, 5].map((n) => ({
      token: `chart-${n}`,
      c: color(theme, mode, `chart-${n}`),
    }))
    const tooClose = []
    const similar = []
    for (let i = 0; i < charts.length; i++) {
      for (let j = i + 1; j < charts.length; j++) {
        const a = charts[i]
        const b = charts[j]
        if (!a.c || !b.c) continue
        const d = deltaE(a.c, b.c)
        if (d < 0.02)
          tooClose.push({
            text: `${a.token} = ${b.token} (ΔE ${d.toFixed(3)})`,
            tokens: [a.token, b.token],
          })
        else if (d < 0.08)
          similar.push({
            text: `${a.token} ≈ ${b.token} (ΔE ${d.toFixed(3)})`,
            tokens: [a.token, b.token],
          })
      }
    }
    const tokensOf = (list) => [...new Set(list.flatMap((x) => x.tokens))]
    if (tooClose.length)
      add(
        "fail",
        mode,
        "Graffarver kan skelnes",
        `dubletter: ${tooClose.map((x) => x.text).join(", ")}`,
        tokensOf(tooClose)
      )
    else add("pass", mode, "Graffarver kan skelnes", "ingen dubletter")
    if (similar.length)
      add(
        "warn",
        mode,
        "Graffarver ligner hinanden",
        similar.map((x) => x.text).join(", "),
        tokensOf(similar)
      )

    // Destructive skal ligne en advarselsfarve
    const destructive = color(theme, mode, "destructive")
    if (destructive) {
      const o = toOklch(destructive)
      const hue = o.h ?? 0
      const reddish = hue <= 50 || hue >= 330
      if ((o.c ?? 0) < 0.08 || !reddish) {
        add(
          "warn",
          mode,
          "Destructive ligner en advarselsfarve",
          (o.c ?? 0) < 0.08
            ? `destructive er ufarvet (chroma ${(o.c ?? 0).toFixed(3)}) – sletning ligner en almindelig handling`
            : `destructive har farvetone ${Math.round(hue)}° – forventet rød/orange (0–50°)`,
          ["destructive"]
        )
      }
      const primary = color(theme, mode, "primary")
      if (primary && deltaE(primary, destructive) < 0.08) {
        add(
          "warn",
          mode,
          "Destructive kan forveksles med primary",
          `ΔE ${deltaE(primary, destructive).toFixed(3)}`,
          ["destructive", "primary"]
        )
      }
    }

    // Skygger, der ikke kan ses mod baggrunden
    const shadow = shadowPaint(theme, mode)
    if (shadow) {
      const visible = wcagContrast(
        composite(shadow.color, bgRgb, shadow.alpha),
        bgRgb
      )
      if (visible < 1.2)
        add(
          "warn",
          mode,
          "Skygger kan ses",
          `skyggen (shadow-md) giver kun ${fmt(visible)}:1 mod baggrunden – kort og popovers flyder sammen med siden`,
          ["shadow-color", "shadow-opacity"]
        )
    }
  }

  return results
}
