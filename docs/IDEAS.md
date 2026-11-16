# Ideas

Not in scope; noted for later.

- **"Vivid mid-tones" option** for muted brand colours: scale chroma relative to the sRGB maximum at each
  lightness, so a dusty dark green can still produce a vivid 400–600 (closer to Tailwind's emerald).
- **Reorder palettes** (drag and drop; `@dnd-kit` is already a dependency).
- **Show unlinked tokens that exactly match a brand step** and offer to link them.
- **Sidebar Sync copies links**, not just values.
- **Dedicated hover tokens per role** (e.g. `--primary-hover` from the next step of the primary palette) — part of Phase 4 component tokens; today shadcn components derive hover in-component (`bg-primary/90`).
- **Neutral tint control** — near-grey brand neutrals (chroma < 0.02) keep their chroma on every step, so a warm grey's 50 reads slightly peach as a page background. An option to fade chroma towards 50/950 for neutrals.
- **Per-token rule editing** — let the designer change a token's rule (e.g. ring → Primary 300) instead of only overriding its colour.
- **Figma/DTCG export (separate session).** Phase 2 item 3 is postponed. When it's built, radius tokens must
  use exactly the app shell's 7-step formula from `docs/theme-generator-krav.md` §2.1 (`--radius × 0.6 / 0.8 / 1
  / 1.4 / 1.8 / 2.2 / 2.6`, plus `rounded-full` = 9999px), the same as the preview (`app/globals.css`) and the
  Standalone CSS export (`features/app-shell/generate-css.ts` → `APP_SHELL_THEME_INLINE`).
- **Preview uses shadcn's current component style (Nova).** Current shadcn puts `ring-1 ring-foreground/10` on
  cards instead of a shadow, so hard "brutalist" shadows look softer in the app shell than in our preview
  (`docs/theme-generator-krav.md` §2.3). Updating the preview components would make it match the app shell.
- **Fix themes automatically in the editor** — a "Fix errors" button using the same lightness-only fixer as
  `features/app-shell/dev/test-themes.ts`, with a before/after preview.
- **tweakcn's CSS import** converts colours to hex and ignores `--shadow-x/-y`, `--tracking-normal` and the
  dark-mode `--shadow-opacity`; teach it the app shell format so exported themes round-trip.
