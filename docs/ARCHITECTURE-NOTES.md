# Architecture notes (Phase 0 discovery)

Fork of tweakcn, Next.js 15 (App Router, Turbopack), React 19, Tailwind v4, shadcn/ui, zustand, culori 4.
No `src/` folder — top-level `app/`, `components/`, `store/`, `types/`, `utils/`, `hooks/`, `config/`.
Path alias `@/*` → repo root.

## License

Apache 2.0 (`LICENSE`). No `NOTICE` file. Commercial use and modification allowed; modified files must carry a
notice that they were changed (we add a "Modified by Abtion" comment at the top of each changed tweakcn file).

## Running locally

`npm run dev` → `/editor/theme`. The editor works with no `.env`: auth/DB/AI/Google Fonts calls fail quietly
("Unauthorized" in the console is expected). Nothing had to be stubbed for the theme editor.
`pnpm-lock.yaml` is upstream's lockfile, but pnpm isn't installed here and `node_modules` was installed with npm,
so we use npm scripts.

## Theme state

- **Types:** `types/theme.ts` — `ThemeStyleProps` (zod schema; every token is a plain `string`, colour tokens
  hold CSS colour strings, mostly `oklch(L C H)`), `ThemeStyles = { light, dark }`.
  `types/editor.ts` — `ThemeEditorState = { styles, currentMode, preset?, hslAdjustments? }`.
- **Store:** `store/editor-store.ts` — zustand `useEditorStore` with `themeState`, a checkpoint, and undo/redo
  history (every `setThemeState` pushes history, throttled to 500 ms).
- **Persistence:** zustand `persist` middleware, default `localStorage`, key `editor-storage`. The whole
  `themeState` (and history) is saved. This is what makes the working theme survive a reload.
  Account saving (`theme-save-dialog`, `actions/`, `db/`) needs a database — out of scope.
- **Defaults/presets:** `config/theme.ts` (`defaultThemeState`, `COMMON_STYLES` = non-colour keys shared across
  modes), `utils/theme-presets.ts`, `utils/theme-preset-helper.ts`.

## Light / dark

`styles.light` and `styles.dark` are two full token maps. `currentMode` picks which one the controls edit and the
preview shows. Keys in `COMMON_STYLES` (fonts, radius, shadow numbers, spacing) are written to both modes.

## Colour editing

- `components/editor/theme-control-panel.tsx` — sidebar with tabs Colors / Typography / Other / Generate.
  Builds `updateStyle(key, value)` for the current mode and calls `onChange(styles)` → `Editor.handleStyleChange`
  → `setThemeState`.
- `components/editor/colors-tab-content.tsx` — the Colors tab: search box + `ControlSection`s (Primary,
  Secondary, …, Sidebar) each with `ColorPicker`s. Each picker gets `name` = the token key.
- `components/editor/color-picker.tsx` — one row: swatch (native `<input type=color>`), label, text input
  (debounced), and `ColorSelectorPopover`.
- `components/editor/color-selector-popover.tsx` — **the place tweakcn offers Tailwind palette colours**
  (`utils/registry/tailwind-colors.ts` → `TAILWIND_PALETTE`), with a list view (cmdk search) and a grid view.
  Selecting calls `onChange(oklchString)`.
- `components/editor/shadow-control.tsx` also uses `ColorPicker` (shadow colour, no `name`).
- HSL adjustments (`hsl-adjustment-controls.tsx`) rewrite every colour value.

## Preview

`components/theme-provider.tsx` and `hooks/use-iframe-theme-injector.ts` call `applyThemeToElement`
(`utils/apply-theme.ts`), which writes each token as a CSS variable (converted to `hsl()`) onto the root /
iframe root. It only reads `themeState.styles`, so any value in `styles` shows up live.

## Export

- **Code panel** (`components/editor/code-panel.tsx`, `code-panel-dialog.tsx`): CSS from
  `utils/theme-style-generator.ts` → `generateThemeCode(themeEditorState, colorFormat, tailwindVersion)`
  (`:root`, `.dark`, `@theme inline`), plus Tailwind v3 config and layout code.
- **Registry:** `npx shadcn add <url>/r/themes/<id>` served by `app/r/themes/[id]/route.ts`, built by
  `utils/registry/themes.ts` (`generateThemeRegistryItemFromStyles`). Needs a saved theme (DB) or a built-in
  preset id. `app/r/v0/[id]` + `utils/registry/v0.ts` for "Open in v0".
- **Figma:** `components/figma-export-dialog.tsx` (links to a paid Figma plugin, not a file export).

## Integration points for brand palettes

| What | Where |
|---|---|
| Data model | `types/editor.ts` — add optional `brandPalettes` and `brandRefs` to `ThemeEditorState` (persisted, part of undo/redo automatically) |
| Generator, refs, store helpers, UI | new folder `features/brand-palettes/` |
| Brand palettes section | `components/editor/colors-tab-content.tsx` — one section at the top of the Colors tab |
| Brand group in picker | `components/editor/color-selector-popover.tsx` |
| Show linked reference | `components/editor/color-picker.tsx` |
| Linking a token | `colors-tab-content.tsx` (knows the token key) |
| Preview | no change: resolved values are kept in `styles` |
| Exports (Phase 2) | `utils/theme-style-generator.ts`, `utils/registry/themes.ts` |
