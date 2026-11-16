/**
 * Fælles logik for theme:apply, theme:check og dev-preview af temaer.
 *
 * Et tema (theme.css) består kun af `:root { ... }` og `.dark { ... }` med
 * værdier. Alt andet i generatorens eksport (@import, @custom-variant,
 * @theme inline, @layer base) hører til skallen og fjernes.
 */

/** Farvetokens, der skal findes i både :root og .dark. */
export const COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

/**
 * Valgfrie farvetokens og det token, de falder tilbage på, når temaet ikke har
 * dem (samme fallback som i globals.css). `brand` er knappers og badges'
 * baggrund – så `primary` kan være mørk nok til tekst og små kontroller,
 * mens en lys brandfarve stadig bruges på knapperne.
 */
export const COLOR_FALLBACKS = {
  brand: "primary",
  "brand-foreground": "primary-foreground",
}
export const OPTIONAL_COLOR_TOKENS = Object.keys(COLOR_FALLBACKS)

/** Øvrige tokens, der skal findes i :root (arves af .dark, hvis de mangler dér). */
export const ROOT_TOKENS = [
  "radius",
  "font-sans",
  "font-serif",
  "font-mono",
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
  "tracking-normal",
  "spacing",
]

/** Valgfrie tokens, som skallen forstår. */
export const OPTIONAL_TOKENS = [
  "font-heading",
  "shadow-x",
  "shadow-y",
  "shadow-blur",
  "shadow-spread",
  "shadow-opacity",
  "shadow-color",
]

export const FONT_TOKENS = [
  "font-sans",
  "font-serif",
  "font-mono",
  "font-heading",
]

/** Font-navne, der ikke skal indlæses (systemfonte og generiske familier). */
const SYSTEM_FONTS = new Set(
  [
    "ui-sans-serif",
    "ui-serif",
    "ui-monospace",
    "ui-rounded",
    "system-ui",
    "-apple-system",
    "blinkmacsystemfont",
    "segoe ui",
    "helvetica neue",
    "helvetica",
    "arial",
    "noto sans",
    "georgia",
    "cambria",
    "times new roman",
    "times",
    "sfmono-regular",
    "menlo",
    "monaco",
    "consolas",
    "liberation mono",
    "courier new",
    "sans-serif",
    "serif",
    "monospace",
    "cursive",
    "fantasy",
    "apple color emoji",
    "segoe ui emoji",
    "segoe ui symbol",
    "noto color emoji",
  ].map((s) => s.toLowerCase())
)

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "")
}

/** Deler en streng ved `sep` på øverste niveau (ikke inde i parenteser). */
export function splitTop(value, sep) {
  const out = []
  let depth = 0
  let quote = null
  let cur = ""
  for (const ch of value) {
    if (quote) {
      if (ch === quote) quote = null
    } else if (ch === '"' || ch === "'") quote = ch
    else if (ch === "(") depth++
    else if (ch === ")") depth--
    else if (ch === sep && depth === 0) {
      out.push(cur)
      cur = ""
      continue
    }
    cur += ch
  }
  if (cur.trim()) out.push(cur)
  return out.map((s) => s.trim()).filter(Boolean)
}

/**
 * Parser en CSS-fil på øverste niveau.
 * Returnerer { root: Map, dark: Map, removed: string[], unknown: string[] }.
 */
export function parseTheme(css) {
  const src = stripComments(css)
  const root = new Map()
  const dark = new Map()
  const removed = []
  const unknown = []
  let i = 0
  while (i < src.length) {
    while (i < src.length && /\s/.test(src[i])) i++
    if (i >= src.length) break
    // Find enten ';' (statement) eller '{' (blok) først
    let j = i
    while (j < src.length && src[j] !== ";" && src[j] !== "{") j++
    const head = src.slice(i, j).trim()
    if (src[j] === ";" || j >= src.length) {
      if (head) removed.push(head)
      i = j + 1
      continue
    }
    // Blok: find matchende '}'
    let depth = 0
    let k = j
    for (; k < src.length; k++) {
      if (src[k] === "{") depth++
      else if (src[k] === "}") {
        depth--
        if (depth === 0) break
      }
    }
    const body = src.slice(j + 1, k)
    const selector = head.replace(/\s+/g, " ")
    if (selector === ":root" || selector === ".dark") {
      const target = selector === ":root" ? root : dark
      for (const decl of splitTop(body, ";")) {
        const m = decl.match(/^--([\w-]+)\s*:\s*([\s\S]*)$/)
        if (m) target.set(m[1], m[2].replace(/\s+/g, " ").trim())
      }
    } else if (/^@(theme|layer|custom-variant|import)/.test(selector)) {
      removed.push(selector)
    } else {
      unknown.push(selector)
    }
    i = k + 1
  }
  return { root, dark, removed, unknown }
}

/** Den første font-familie i en font-stak, uden anførselstegn. */
export function primaryFamily(value) {
  const first = splitTop(value ?? "", ",")[0]
  if (!first) return null
  const name = first.replace(/^["']|["']$/g, "").trim()
  return name
}

export function isSystemFont(name) {
  return !name || SYSTEM_FONTS.has(name.toLowerCase())
}

/** "Oxanium Variable" → "Oxanium" (fontsource-variable's familienavn). */
export function baseFamily(name) {
  return name.replace(/\s+Variable$/, "")
}

export function fontSlug(name) {
  return baseFamily(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/** Alle custom fonte, temaet bruger (unikke, uden " Variable"). */
export function themeFonts(theme) {
  const names = new Set()
  for (const block of [theme.root, theme.dark]) {
    for (const token of FONT_TOKENS) {
      const name = primaryFamily(block.get(token))
      if (name && !isSystemFont(name)) names.add(baseFamily(name))
    }
  }
  return [...names]
}

/**
 * Sætter fontsource-variable's familienavn ("X Variable") forrest i stakken,
 * med det oprindelige navn som fallback. Gør intet ved andre fonte.
 */
export function withVariableFamily(value, variableFamilies) {
  const parts = splitTop(value, ",")
  const name = primaryFamily(value)
  if (!name || !variableFamilies.has(baseFamily(name))) return value
  const base = baseFamily(name)
  const rest = parts
    .slice(1)
    .filter((p) => p.replace(/^["']|["']$/g, "") !== base)
  return [`"${base} Variable"`, `"${base}"`, ...rest].join(", ")
}

/** Kopi af temaet med font-stakke tilpasset de variable fonte. */
export function mapFonts(theme, variableFamilies) {
  const map = (block) =>
    new Map(
      [...block].map(([k, v]) => [
        k,
        FONT_TOKENS.includes(k) ? withVariableFamily(v, variableFamilies) : v,
      ])
    )
  return { ...theme, root: map(theme.root), dark: map(theme.dark) }
}

/** Skriver blokkene som CSS (formateres bagefter af Prettier). */
export function serializeBlocks(
  theme,
  { root = ":root", dark = ".dark" } = {}
) {
  const block = (sel, map) =>
    `${sel} {\n${[...map].map(([k, v]) => `  --${k}: ${v};`).join("\n")}\n}\n`
  return `${block(root, theme.root)}\n${block(dark, theme.dark)}`
}
