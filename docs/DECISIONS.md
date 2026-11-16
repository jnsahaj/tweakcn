# Decisions

One line each: what, why.

## Phase 0

- **License is Apache 2.0, not MIT** — acceptable (per Jacob). Keep `LICENSE` intact (there is no `NOTICE` file), add a `Modified by Abtion` comment at the top of every tweakcn file we change, and a "modified fork" line in the README (Apache 2.0 §4b requires modified files to say so).
- **npm, not pnpm** — upstream ships `pnpm-lock.yaml`, but pnpm isn't installed here and `node_modules` came from npm. We avoid adding dependencies so neither lockfile needs to change.
- **No services stubbed** — the theme editor runs without `.env`; auth/DB/AI calls fail quietly ("Unauthorized"), which doesn't affect editing.
- **Dev server config** in `.claude/launch.json` (`npm run dev`).

## Phase 1

- **New code lives in `features/brand-palettes/`** — the repo has no `src/`; a top-level feature folder keeps our code apart from upstream files for easy merging.
- **Tests use Node's built-in test runner via `tsx`** (`node --import tsx --test`) — `tsx` is already a devDependency, so no new test framework (vitest/jest) is added to the lockfiles.
- **References are stored next to the values, not instead of them** — `ThemeEditorState.brandRefs = { light: {token: "forest-green-700"}, dark: {...} }`, while `styles` keeps the resolved colour string. Smallest change: the preview, the existing CSS export, the contrast checker, AI and presets keep working on plain strings untouched.
- **A reference is only "live" while the token's value still equals the step's value** — if anything else changes the token (typing a colour, a preset, HSL adjustments, AI), the link is silently dropped instead of overwriting that change. Avoids hooking into every upstream code path that writes styles.
- **`package.json` has no "Modified by Abtion" comment** — JSON can't hold comments; the only change is the `test` script.
- **Gamut mapping uses culori `clampChroma` (constant L and H), not `toGamut`** — `toGamut` ends with an RGB clip that shifted the hue of light tints by up to ~14° (blue-100 went cyan), breaking "hue stays H_b".
- **Anchor OKLCH string uses as many decimals as needed (4–12)** to round-trip to the exact hex *and* stay inside sRGB (edge colours like `#00FF00` need more than 4).
- **Lightness bounds 0.995 (max) / 0.13 (min)** — when enforcing the 0.015 gap pushes a step past these (e.g. a near-white brand colour anchored at 100), the free steps between the anchor and the end are spaced evenly in the room left instead.
- **Anchor ties go to the lighter step.**
- **Scale curve tuning (final values, `DEFAULT_SCALE_CONFIG` in `features/brand-palettes/scale.ts`)** — scored on 10 brand colours by how even the perceptual distance (OKLab ΔE) is between neighbouring steps 100→950. The spec's starting values had a visible jump at step 400 (300→400 lightness gap of 0.10). Tuned values cut the unevenness (coefficient of variation) from 0.21 to 0.12; the biggest remaining jump is next to the brand colour itself, which is fixed by definition. Helper script: `npx tsx features/brand-palettes/dev/compare.ts`.

  | Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
  |---|---|---|---|---|---|---|---|---|---|---|---|
  | L | 0.977 | 0.937 | 0.877 | 0.800 | 0.716 | 0.635 | 0.556 | 0.480 | 0.410 | 0.347 | 0.270 |
  | m | 0.14 | 0.30 | 0.54 | 0.78 | 0.92 | 1.0 | 1.0 | 0.97 | 0.88 | 0.78 | 0.68 |
- **Muted brand colours stay muted** — chroma is scaled relative to the brand colour (as specced), so a dusty dark green gives a sage-like 500 rather than a vivid Tailwind-emerald 500. Kept deliberately: it preserves the brand's character. Revisit if Jacob wants more vivid mid-tones.
- **Editing one step changes only that step** — it gets locked; nothing else regenerates. Regeneration only happens on a base colour change or a Reset. Otherwise editing the anchor swatch would silently move the brand hex to a neighbour.
- **Hand-edited (locked) steps don't push generated steps around** — the curve is computed as if nothing were locked and locked values are swapped in at the end. An odd override (e.g. 900 set to a light colour) stays a local exception instead of reflowing the whole palette. Consequence: with overrides, strict lightness order is the user's responsibility.
- **Anchor edge cases** — base colour change with the new natural anchor locked → the nearest unlocked step (tie → closest target L) holds the base hex (spec rule). Reset step / Reset all → keep the current anchor if the natural one is still locked, so resetting one step never moves the brand colour around. Resetting the anchor step itself puts the base hex back there.
- **Reset step regenerates the whole palette from the same inputs** — results are deterministic, so other unlocked steps only change when the anchor moves back (e.g. after resetting a locked natural anchor).
- **References are strings like `forest-green-700`**, rewritten when a palette is renamed. Not palette ids: matches the CSS/Figma names we'll export, and it stays open to a third layer (component tokens) using the same shape.
- **Hand-typed step colours are stored as given (converted to OKLCH), not gamut-mapped** — the designer's explicit choice wins; hex input keeps exact round-tripping.
- **IDs use `crypto.randomUUID()`** (fallback to a timestamp+random id).
- **Pre-existing lint errors in `types/editor.ts`** (`any` on lines 40–41, upstream code, outside `next lint`'s default folders) are left alone; we lint `features/` explicitly with `npx eslint features`.
- **UI placement** — "Brand palettes" is the first section of the Colors tab (tweakcn's `ControlSection`, expanded, with an "+ Add" header action styled like the Sidebar "Sync" button). Hidden while the colour search box has text.
- **Step editing happens in a popover** on each swatch (picker, hex/oklch field, contrast vs white and black with AA/AAA labels, "Used by …" list, Reset when edited). Swatch tooltips also show contrast. Anchor = small dot, edited = lock icon; the palette header shows the number of edited steps.
- **Palette menu** (⋯): Rename, Change base colour, Reset all overrides, Delete. Delete has no confirmation dialog because tweakcn's undo restores it, links included.
- **Brand group lists one group per palette** ("Brand · Forest Green") above Tailwind's colours in both list and grid views; brand steps are searchable by ref and palette name.
- **Linked tokens show the ref in their text field** (e.g. `forest-green-700`) plus a link icon; typing a ref there links it too. Typing any other colour unlinks.
- **Linking respects the Sidebar "Sync" toggle** — linking a base token while Sync is on also links its sidebar counterpart.
- **Dev lab page at `/dev/brand-scales`**

## Phase 1 adjustments

### Only the preview is themed

- **Page root gets tweakcn's default neutral theme** (`components/theme-provider.tsx` → `neutralEditorState`, and `components/theme-script.tsx` for the pre-load paint). It still follows the editor's light/dark toggle, which is the edited theme's `currentMode`, so the editor and the preview always show the same mode.
- **The edited theme is scoped to the preview area** — `features/preview-scope/PreviewThemeScope` replaces the preview `<section>` in `theme-preview-panel.tsx` and writes the theme's CSS variables onto it (own `applyScopedTheme`, because upstream `applyThemeToElement` also writes shadows and the `dark` class to the document root). Works because globals.css uses `@theme inline`, so utilities read `var(--primary)` at the element. The scope also sets `bg-background text-foreground font-sans tracking-normal`, which used to come from `body`.
- **Portals: a themed, body-level portal container + React context** — `PreviewThemeScope` creates `<div data-preview-portal-root>` in `<body>`, applies the same theme to it, and provides it via context. The 12 portal-using `components/ui/*` files pass `container={usePreviewPortalContainer()}` to their Radix/vaul `Portal`. Outside the preview the context is `undefined`, so the editor's own popovers render into `<body>` as before. Chosen over a portal container *inside* the preview so overlays aren't clipped by the preview's `overflow: hidden` / stacking context.
- **Verified:** primary, background and radius change only in the preview; dropdown, select, sheet (dialog) and tooltip opened from the preview are themed; the editor's colour popover stays neutral; light/dark both work.
### Brand tab

- **"Brand" is the first and default control tab** (`?tab=brand`, added to the tab list in `hooks/use-controls-tab-from-url.ts`). The inspector's "focus colour" used to jump to the default tab; it now jumps to `colors` explicitly (`store/color-control-focus-store.ts`).
- **The tab is a list of sections** (`features/brand-palettes/components/brand-tab-content.tsx` → `BRAND_SECTIONS`): Palettes, then Roles. A future Fonts section is one more entry.
- **Brand palettes section moved out of the Colors tab**; brand-step linking in the Colors tab's pickers stays.

### Preview scoping (continued)

- **Not themed any more (accepted):** the homepage preset showcase, `/themes/[id]` and the AI chat theme previews relied on the page-level theme and now render neutral. None are part of our workflow (the last two need DB/AI). Sonner toasts render at page level, so a toast triggered from the preview is neutral. — returns 404 when `NODE_ENV=production`.
- **Names that are blocked:** Tailwind colour names (incl. black/white/transparent/current/inherit and the newer mauve/olive/mist/taupe), shadcn token roots (`primary`, `chart`, `sidebar`, …, so you never get `primary-500` next to `primary`), names not starting with a letter, and names ending in `-<number>` (would read like a step).
- **Slugs transliterate Danish letters** (æ→ae, ø→o, å→a) and strip accents.
- **Palettes and refs are part of `ThemeEditorState`** — so they persist in `localStorage` (`editor-storage`) with the working theme and take part in undo/redo, with no store changes.

### Roles (palettes drive the whole theme)

- **Data:** `brandRoles` on `ThemeEditorState` — `assignments` (role → palette id), `whiteBackground`, `auto[mode][token]` (value, brand ref, label, warning the rule last wrote) and `manual[mode]` (tokens taken over). Rules and resolution are pure (`features/brand-palettes/roles.ts`, 25 tests in `roles.test.ts`).
- **Auto tokens write the same `brandRefs` as manual links** — so an Auto token is "linked" to e.g. `forest-green-700` exactly like a hand-picked one, and the Phase 2 exports (which read `brandRefs`) will output `var(--forest-green-700)` / DTCG aliases for both. Tokens resolved to white store no ref (plain value).
- **Manual detection without touching upstream code paths:** a role-driven token is Manual when its value differs from what its rule last wrote, *unless* it still points at the same brand step (a palette edit moved it). Once Manual it stays Manual until "↺ Auto" (per token) or "Reset all to Auto" (Roles section). Linking a different brand step by hand also makes it Manual.
- **One sync function runs after every editor change** (`role-sync.ts`, a zustand subscription started when the brand feature loads). It is idempotent and lands inside tweakcn's 500 ms history window, so it never adds an undo step. Effect: Auto foregrounds re-pick contrast even when you change their background manually; palette step edits flow through; undo/redo stay consistent.
- **Applying a preset / HSL adjustment / AI theme turns role-driven tokens Manual** (their values were replaced). Palettes and assignments survive; "Reset all to Auto" brings the roles back. Accepted: it never silently overwrites what a preset just set.
- **Unassigning a role leaves its tokens at their current colours** (no revert), and they stop being tracked. Deleting an assigned palette unassigns the role the same way.
- **Sidebar tokens mirror the *final* value of their main token** (including a manual one), with its reference — so `sidebar-primary` follows a manually set `primary` too.
- **"Auto (contrast)" foregrounds choose the highest contrast of white / palette 50 / palette 950** (spec, taken literally). In practice this is white or 950; the tinted 50 only wins when it is the best. If the best is under 4.5:1 the token shows a warning.
- **Preferred foregrounds** (`secondary-foreground` 900/100, `accent-foreground` 900/100) are used when they reach 4.5:1, otherwise the auto-contrast pick.
- **Light-mode primary is always the exact brand colour** (anchor step). If it is under 3:1 against the background (e.g. a bright orange or pale yellow brand), it is kept and a warning is shown instead of changing the brand colour.
- **"Pure white" background option lives on the Neutral role** and applies to `background`, `card` and `popover` in light mode (cards on white stay white). Dark mode is unaffected.
- **Warnings** show as a ⚠ next to "Auto · …" on the token (hover for details) and are listed in the Roles section for the current mode.
- **Dev-only `window.__editorStore`** (set in `role-sync.ts`, not in production builds) for browser testing.
- **Hover states unchanged** — shadcn components keep `bg-primary/90` etc.; dedicated hover tokens noted in IDEAS.md for Phase 4.

#### Token rules (final)

Tuned from the starting table, verified with `npx tsx features/brand-palettes/dev/debug-roles.ts` on the five sample colours as Primary with warm and cool neutrals.

| Token | Role | Light | Dark |
|---|---|---|---|
| background | Neutral | 50 (or white) | 950 |
| card, popover | Neutral | 50 (or white) | 900 |
| foreground, card-foreground, popover-foreground | Neutral | 950 | 50 |
| muted | Neutral | 100 | 800 |
| muted-foreground | Neutral | 600, darker until 4.5:1 on background, muted and card *(tuned: was 500; in practice lands on 700)* | 400, lighter until 4.5:1 on background, muted and card *(2026-11-16: was background only; dark muted/card are lighter than background)* |
| border, input | Neutral | 200 | 800 |
| brand | Primary | anchor (exact brand colour) | anchor |
| brand-foreground | Primary | auto contrast on brand | auto contrast on brand |
| primary | Primary | anchor, darker until 4.5:1 on background *(2026-11-16: was the anchor as-is with a warning)* | anchor, lighter until 4.5:1 on background *(was 3:1)* |
| primary-foreground | Primary | auto contrast on primary | auto contrast on primary |
| ring | Primary | 400 | 500 |
| secondary | Secondary | 100 | 800 |
| secondary-foreground | Secondary | 900 if ≥ 4.5:1, else auto contrast | 100 if ≥ 4.5:1, else auto contrast |
| accent | Secondary | 100 | 800 |
| accent-foreground | Secondary | 900 if ≥ 4.5:1, else auto contrast | 100 if ≥ 4.5:1, else auto contrast |
| destructive | Destructive (built-in red while unassigned) | 600, darker until 4.5:1 on background and on its own 10% tint, at most 800 | 400, lighter until 4.5:1 on background and on its own 20% tint, at most 200 *(tuned: was 500 — a mid red can't carry 4.5:1 text with white/50/950. 2026-11-16: was 3:1 on background only)* |
| destructive-foreground | Destructive | auto contrast | auto contrast |
| chart-1 | Primary | 600, darker until 3:1 on card | 400, lighter until 3:1 on card |
| chart-2 | Secondary | 400, darker until 3:1 on card | 300, lighter until 3:1 on card |
| chart-3 | Primary | 800, same, skipping chart-1's step | 200, same, skipping chart-1's step |
| chart-4 | Secondary | 700, same, skipping chart-2's step | 600, same, skipping chart-2's step |
| chart-5 | Primary | 300, same, skipping chart-1/3's steps | 700, same, skipping chart-1/3's steps |
| sidebar, sidebar-foreground, sidebar-primary(-foreground), sidebar-accent(-foreground), sidebar-border, sidebar-ring | as their main token | = background, foreground, primary(-foreground), accent(-foreground), border, ring | same |

"auto contrast" = highest contrast of white / palette 50 / palette 950; warning if under 4.5:1. Charts alternate palette and lightness so neighbouring series differ in both hue and lightness.

**2026-11-16 – rules aligned with the app shell's theme:check.** Every brand-palette theme failed `theme:check` on the same pairs (muted-foreground on muted/card in dark, chart-2/4/5 on card, destructive on its badge tint), because the rules only checked against background. The surfaces now match `TEXT_PAIRS`/`GRAPHIC_PAIRS` in `scripts/theme/rules.mjs`; keep them in sync when either changes. Destructive follows a built-in red (`FALLBACK_DESTRUCTIVE`, #DC2626, no brand reference, label "Default red …") while the role is unassigned but at least one other role is, since shadcn's default dark red fails the badge check on most brand backgrounds. Tested in `roles.test.ts` ("role rules pass the app shell theme check"). Still open: light primary on background (a light brand colour as button colour) and primary-foreground on a mid-tone dark primary.

### Fixes

- **Input borders follow the `input` token** — upstream `app/globals.css` had an unlayered `* { border-color: var(--color-border) }`. Unlayered CSS beats Tailwind v4's utility layer, so it overrode `border-input`, `border-ring` (focus) and `border-destructive` (invalid) on every component; editing `input` only changed the dark-mode field background (`dark:bg-input/30`). Removed that one declaration; the default border colour still comes from `@apply border-border` in `@layer base`, so components without an explicit border colour look the same. Affects the editor chrome too (its own inputs now use its neutral `input` value, as tweakcn's components intend).

## App shell export and live theme check (2026-11-13)

Requirements: `docs/theme-generator-krav.md`. Answers from Jacob: shared rules module, separate dark shadow
opacity, Figma/DTCG postponed, fixes change lightness only and only errors, Fontsource list in the repo.

- **Shared check files** live in `scripts/theme/` (same path as in the app shell): `check.mjs` (CLI, output
  unchanged), `rules.mjs` (pure rules, new) and `lib.mjs` (unchanged copy). `check.mjs` and `rules.mjs` say at the
  top that they are shared and must be kept identical. `rules.mjs` adds a `tokens` list (and `modeKey`) to each
  result so the editor can show it next to the right token; the CLI ignores them. `npm run theme:check` added.
- **Live check runs on the export itself:** the editor generates the App shell CSS, parses it with `lib.mjs` and
  runs `rules.mjs` — the same steps as `theme:check` on the downloaded file, so they can't disagree (unit test).
- **Generator-only font check:** `features/app-shell/fontsource-families.json` (2,103 families, regenerate with
  `node scripts/update-fontsource-list.mjs`). Missing font = warning; static-only (e.g. Space Mono) = info.
- **New code in `features/app-shell/`**; the code panel uses it for Tailwind v4. Tailwind v3 output is tweakcn's
  (untouched, apart from the shadow alpha cap).
- **App shell export is always OKLCH** (requirement: OKLCH preferred), so the format/version selects are hidden
  for it. Colours with alpha keep it (`oklch(1 0 0 / 0.1)`); tweakcn's formatter dropped it.
- **Font stacks:** custom family in double quotes + fallback for its kind (from its generic family, else the
  token): sans `ui-sans-serif, system-ui, sans-serif`; serif `ui-serif, Georgia, Cambria, "Times New Roman",
  Times, serif`; mono `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
  monospace`. A pure system stack keeps its order, only quoting is normalised.
- **`font-heading`** is an optional style key, shared across modes (in `COMMON_STYLES`). Exported only when it
  differs from `font-sans`. Preview: h1–h3, card/dialog/sheet titles use `var(--font-heading, var(--font-sans))`.
- **Shadows** in both v4 exports are built from the variables with `color-mix(in oklab, var(--shadow-color)
  calc(var(--shadow-opacity) * N%), transparent)`; `shadow-2xl` uses `min(1, opacity × 2.5)`. The preview still
  uses tweakcn's literal shadows, now capped at alpha 1.
- **Dark shadow opacity:** `shadow-opacity` stays in `COMMON_STYLES` (so colour code paths treat it as a plain
  value) but is listed in `PER_MODE_STYLES` (`config/theme.ts`); the control panel writes it to the current
  mode only and the preview reads it per mode. Presets still set both modes alike.
- **Radius:** `app/globals.css` uses the app shell's 7-step multipliers. This also affects the editor chrome
  slightly (it uses the same utilities).
- **Theme check section** is the third section of the Brand tab. UI labels in English like the rest of tweakcn;
  the check messages are the shared rules' Danish text, so they read exactly like `theme:check`.
- **Test theme fixer** (`features/app-shell/dev/test-themes.ts`): fixes one error at a time with the smallest
  lightness change (step 0.0025), never breaking a passing check where the moved colour is the foreground;
  surfaces before `*-foreground`; for `X-foreground on X` it tries both sides and takes the smaller change;
  sidebar tokens that were copies of their base token follow its fix. Chroma only drops where sRGB requires it.
- **test-2 chart-4 (Jacob's exception):** after the lightness fix it was still a grey next to grey chart-2.
  Hand-picked `oklch(0.55 0.1 232)` (dusty blue, the dark theme's accent hue, same lightness as the other
  charts): 4.33:1 on card, ΔE ≥ 0.11 to every other chart colour. Stored in `OVERRIDES` in
  `features/app-shell/dev/test-themes.ts`.
- **Default theme = the app shell's default theme** (`themes/app-shell-default.css` → `features/app-shell/
  default-theme.ts`, used by `defaultThemeState`: new themes, the "Default" preset, Reset). The editor chrome keeps
  tweakcn's neutral theme (`defaultLight/DarkThemeStyles`, untouched). Fonts stored as `"Geist", …` without
  "Geist Variable" (theme:apply adds it). The preview now keeps alpha on colours (dark borders are
  `oklch(1 0 0 / 10%)`), which tweakcn's formatter dropped.
- **Polar is optional:** without `POLAR_WEBHOOK_SECRET` the webhook route answers 503 instead of throwing at module
  load (which failed `next build`). The other Polar code didn't throw at load. With the secret, unchanged.
- **`prebuild` uses `npm run`** instead of `pnpm` (pnpm isn't installed; npm works everywhere). The generated
  `public/r/v0/` is now in `.gitignore` next to `public/r/themes`.


## Brand token: buttons keep the brand colour, primary reads as text (2026-11-16)

A light brand colour (e.g. lime) can't be both the button fill and the colour of links, switches, checkboxes and progress on a light page (1.3:1). The app shell (v1.1.0) therefore has an optional `brand` / `brand-foreground` token for the default `Button` and `Badge`; everything else keeps using `primary`.

- **Rules:** `brand` = the exact brand colour in both modes, `brand-foreground` = auto contrast on it. `primary` starts at the brand colour and walks darker (light) / lighter (dark) until it has 4.5:1 on background, since the app shell uses it as text (`TEXT_PAIRS`) as well as for small controls.
- **Optional, falls back to primary:** `brand` is only written by the role rules (no default value), exported only when set, and the app shell's `@theme inline` maps `--color-brand: var(--brand, var(--primary))`. Presets and plain shadcn themes therefore look the same as before. `scripts/theme/lib.mjs` (`COLOR_FALLBACKS`) makes `theme:check` read a missing `brand` as `primary`.
- **Editor:** two controls under Primary ("Brand (buttons)", "Brand FG") that show the primary value until set. The preview's `Button` and `Badge` use `bg-brand` (same change as the app shell's `components/ui`); the editor chrome has no `--brand`, so it is unchanged.
- **Only the app shell export carries it.** tweakcn's own shadcn exports don't know `brand`; with a primary role assigned they get the darker `primary` on buttons.
- Verified across 752 palette combinations (12 primaries × 4 neutrals × 4 secondaries, with/without destructive role and white background): all pass `theme:check` except mid grey #808080 as primary (no foreground reaches 4.5:1; the editor warns) and two near-identical greens as primary and secondary (chart-4 = chart-5).
