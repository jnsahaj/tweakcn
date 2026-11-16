# Progress

## Status

- [x] Phase 0 — Discovery (`docs/ARCHITECTURE-NOTES.md`)
- [x] Phase 1 — Brand palettes — done, reviewed
- [x] Phase 1b — Preview-only theming, Brand tab, Roles — **done, waiting for Jacob's review**
- [ ] Phase 2 — Exports: **App shell CSS export + live theme check done** (below); registry with primitives and
  Figma/DTCG not started (Figma postponed to its own session, see IDEAS.md)

## Checks

- Typecheck: `npx tsc --noEmit`
- Lint: `npm run lint` (upstream folders) **and** `npx eslint features app/dev` (`next lint` doesn't scan `features/`)
- Tests: `npm test` (Node test runner via tsx; 80 tests in `features/**/*.test.ts`)
- Theme check (same as the app shell): `npm run theme:check <file.css>`
- Run: `npm run dev` → `/editor/theme`; scale lab at `/dev/brand-scales`

## Phase 1 plan and status

1. [x] **Scale generator** — `features/brand-palettes/scale.ts` + `naming.ts`, unit tests.
2. [x] **Dev test page** — `/dev/brand-scales` (404 in production). Curve tuned; values in DECISIONS.md.
   Numeric comparison helper: `npx tsx features/brand-palettes/dev/compare.ts`.
3. [x] **Data model + references** — `brandPalettes`/`brandRefs` on `ThemeEditorState` (`types/editor.ts`);
   pure operations in `palette.ts`, React hooks in `use-brand-palettes.ts`. Unit tests.
4. [x] **Brand palettes section** — now in the Brand tab (`components/brand-palettes-section.tsx`,
   `palette-form.tsx`, `step-editor.tsx`).
5. [x] **Brand group in the colour popover** — `components/brand-color-groups.tsx`, wired into
   `color-selector-popover.tsx`; `color-picker.tsx` shows the linked ref + link icon and accepts typed refs.
6. [x] **Browser check** — add palette (with name validation), edit/lock step, link token via popover and by
   typing, step edit propagates to token + live preview, light/dark linked independently, reload keeps
   everything, delete keeps the colour as a plain value, undo restores palette + link.

## Phase 1b (adjustments after review)

1. [x] **Only the preview is themed** — `features/preview-scope/`; root gets the neutral default theme; themed
   body-level portal container for overlays opened from the preview. Verified: primary/background/radius change
   only in the preview; dropdown, select, sheet and tooltip from the preview are themed; editor popovers neutral.
2. [x] **Brand tab** — first and default tab; sections list (Palettes, Roles; Fonts later).
3. [x] **Roles** — `roles.ts` (rules, contrast, Auto/Manual, 25 tests), `role-sync.ts` (keeps Auto tokens in
   sync after every change), Roles section, "Auto · Primary 700" / "Manual ↺ Auto" under each token in Colors.
   Verified in the browser: Primary + Secondary + Neutral give a readable theme in light and dark; swapping
   Primary re-colours buttons, charts, ring and sidebar; a manual edit survives a role swap and resets to Auto.
   Rule report: `npx tsx features/brand-palettes/dev/debug-roles.ts`.

## App shell export and live check (requirements: `docs/theme-generator-krav.md`)

1. [x] `scripts/theme/check.mjs` split into CLI + `rules.mjs` (shared with the app shell repo; same output).
2. [x] Code panel: "App shell" (default: only `:root`/`.dark`, OKLCH, Download as theme.css) and "Standalone"
   (full globals.css with the app shell's `@theme inline`). Quoted font stacks, optional `--font-heading`,
   shadows from `--shadow-color`/`--shadow-opacity` with alpha ≤ 1, separate dark shadow opacity.
3. [x] Preview: 7-step radius multipliers, heading font on titles; tracking already via `--letter-spacing`.
4. [x] Live check: notes under each colour token (light and dark), fonts in Typography, shadows in Other,
   "Theme check" section in the Brand tab (click → mode + token), warning banner in the code panel.
   Verified in the browser with test-1: same 9 errors as `theme:check`, radius values match the table.
5. [x] Test themes fixed (approved list + chart-4 exception) and exported to `exports/test-1..3.css`
   (`npx tsx features/app-shell/dev/test-themes.ts --write`): 0 errors in `theme:check` (7 / 5 / 3 warnings).
6. [x] Default theme = the app shell's default theme (0 errors); editor chrome unchanged.
7. [x] `npm run build` and `npm run dev` work without `POLAR_WEBHOOK_SECRET` (and without pnpm).

## Upstream files touched (all marked "Modified by Abtion")

- `types/editor.ts` — optional brand fields on `ThemeEditorState`
- `components/editor/colors-tab-content.tsx` — passes brand ref, link handler and role status to pickers
- `components/editor/color-picker.tsx` — shows/accepts a brand ref; optional status line under the label
- `components/editor/theme-control-panel.tsx` — Brand tab
- `hooks/use-controls-tab-from-url.ts`, `store/color-control-focus-store.ts` — `brand` tab id, default tab
- `components/theme-provider.tsx`, `components/theme-script.tsx` — neutral theme on the page root
- `components/editor/theme-preview-panel.tsx` — `PreviewThemeScope` around the preview
- `components/ui/{alert-dialog,context-menu,dialog,drawer,dropdown-menu,hover-card,menubar,popover,revola,select,sheet,tooltip}.tsx` — portal container from preview context
- `components/editor/color-selector-popover.tsx` — Brand group at the top
- `README.md` — fork notice; `package.json` — `test` and `theme:check` scripts
- `types/theme.ts` (optional `font-heading`), `config/theme.ts` (`PER_MODE_STYLES`, `font-heading` in COMMON_STYLES),
  `utils/shadows.ts` (alpha cap), `app/globals.css` (radius scale, `--font-heading`, heading rule),
  `components/editor/code-panel.tsx` (export variants, check banner, download),
  `components/editor/theme-control-panel.tsx` (heading font, per-mode opacity, check notes),
  `components/dynamic-font-loader.tsx` (loads the heading font)

## Next (Phase 2, after review)

- CSS export: primitives in `:root`, `var()` references for linked tokens, `@theme inline` registration
  (`utils/theme-style-generator.ts`).
- Registry item including primitives (`utils/registry/themes.ts`, `app/r/themes/[id]`) — note this route
  currently needs a saved theme (DB) or a built-in preset id; local-only themes will need another way in.
- DTCG JSON for Figma + `docs/FIGMA-IMPORT.md`.

## Known issues / limitations

- Applying a preset, HSL adjustment or AI theme turns role-driven tokens Manual ("Reset all to Auto" in Roles
  brings them back).
- Homepage preset showcase, `/themes/[id]` and AI chat previews now render neutral (they relied on the page-level
  theme). Toasts triggered inside the preview are neutral.
- Near-grey neutrals keep their tint on every step (warm grey 50 reads slightly peach as a background).

- Existing exports (Code panel, registry) still output resolved colour values only — brand primitives and
  `var()` references arrive in Phase 2.
- Links are dropped whenever something else rewrites the token's value: typing a colour, applying a preset,
  HSL adjustments, AI generation, CSS import. Palettes themselves survive all of these. (By design; see
  DECISIONS.md.)
- Sidebar "Sync": linking a base token while Sync is on links the sidebar token too. Turning Sync on *after*
  linking copies the colour only (no link) — tweakcn's sync copies values.
- The shadow colour picker shows the Brand group, but picking a step sets a plain colour (no link).
- Upstream behaviour, unchanged: the token text field applies whatever you type after a short pause, so
  typing a brand ref very slowly briefly applies the partial text.
- Upstream hydration warnings / "Unauthorized" / 500s in the console are pre-existing (saved theme differs
  from server render; no auth/DB configured).
- `package-lock.json` was already modified by the local `npm install` before this work started; left
  uncommitted.
