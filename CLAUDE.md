# CLAUDE.md — Abtion Theme Editor (tweakcn fork)

## What this project is

A fork of [tweakcn](https://github.com/jnsahaj/tweakcn), the visual theme editor for shadcn/ui. tweakcn already works the way we want: live dashboard preview, component previews, presets, theme export. **Do not rebuild or redesign any of that.**

We are adding one feature on top: **brand palettes** — the client's own colour primitives. You enter one hex per brand colour, the tool generates a full 50–950 scale from it, every step can be adjusted by hand, and those scales become selectable for every shadcn token in the editor.

The owner (Jacob) is a designer, not a developer. When you report back, explain what you did and why in plain language, and say how he can see or test it in the browser.

---

## How to work: autonomous agent

Work independently. Make decisions, carry them out, and keep moving. Ask Jacob **only** when one of these is true:

1. **Irreversible or external actions:** pushing to a remote, deploying, deleting files you didn't create, rewriting git history, creating accounts, adding paid services.
2. **Secrets or credentials** are needed (API keys, database URLs, auth providers).
3. **A product decision that changes what the user sees or the data model**, *and* this file doesn't answer it, *and* a wrong guess would be expensive to undo.
4. **You are blocked** after making at least two genuinely different attempts.
5. **License problems:** anything suggesting the fork or a new dependency can't be used commercially.

For everything else — implementation details, file structure, library choices within the existing stack, UI details that follow tweakcn's existing patterns, naming of internal things — decide yourself, log it in `docs/DECISIONS.md` (one line: what, why), and continue.

When you do ask: batch your questions, give your recommended answer for each, and keep working on anything not blocked by the answer.

### Working rules

- Work on a feature branch (`feature/brand-palettes`). Commit small and often with clear messages. Never push without asking.
- Before calling a step done: typecheck, lint, and run tests (use the scripts in `package.json`; detect the package manager from the lockfile).
- Keep `docs/PROGRESS.md` updated: what's done, what's next, known issues. This is how the next session picks up where you left off.
- **Stay mergeable with upstream.** Put new code in new files/folders where possible (`src/features/brand-palettes/` or the repo's equivalent). Touch existing tweakcn files only where integration requires it, and keep those diffs minimal. Don't refactor or reformat unrelated code.
- Follow the repo's existing conventions (components, state management, styling, file naming). Don't introduce a new state library or UI framework.
- Don't add features not in this file. Note ideas in `docs/IDEAS.md` instead.
- If tweakcn features need external services to run locally (database, auth, AI features), disable or stub them for local development and note it in `docs/DECISIONS.md`. Only ask if the core theme editor can't run without them.

---

## Phase 0 — Discovery (do this first, change nothing)

1. Confirm the license in `LICENSE`. If it isn't MIT or similarly permissive, stop and tell Jacob.
2. Install and run the app locally. Get the theme editor working in the browser.
3. Write `docs/ARCHITECTURE-NOTES.md` covering:
   - How theme state is structured and stored (types, store, persistence)
   - How colour tokens are edited: the colour picker component(s), and where tweakcn offers Tailwind palette colours
   - How light/dark mode values are stored
   - How export works (CSS, registry/JSON, any other formats) and where that code lives
   - How the preview applies the theme
   - The exact integration points for brand palettes, with file paths
4. Then continue straight to Phase 1. No approval needed unless discovery reveals something that contradicts this file.

---

## Phase 1 — Brand palettes (detailed spec)

### Naming

- **Semantic tokens:** strictly shadcn's names (`background`, `foreground`, `primary`, `primary-foreground`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `chart-1…5`, `sidebar-*`, etc.). Don't rename, add or remove any.
- **Primitives (brand scales):** Tailwind convention. Name is a lowercase kebab-case slug of the colour name Jacob enters (e.g. "Forest Green" → `forest-green`). Steps: `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`. Full token: `forest-green-700`.
- Prevent name clashes with Tailwind's built-in palette names (`red`, `blue`, `slate`, …) and with other brand palettes; show an inline validation message.

### Data model

Store brand palettes as part of the theme so they save, load, share and export the same way the rest of the theme does.

```ts
type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

type BrandPalette = {
  id: string;
  name: string;               // display name: "Forest Green"
  slug: string;               // "forest-green"
  baseHex: string;            // the client hex as entered, e.g. "#0B3D2E"
  anchorStep: ScaleStep;      // step that holds baseHex exactly (auto-detected)
  steps: Record<ScaleStep, {
    value: string;            // oklch(...) string
    locked: boolean;          // true once manually edited
  }>;
};
```

A semantic token can point to a brand step. **Store the reference, not just the value**, e.g. `{ ref: "forest-green-700" }`, alongside or instead of the raw value, whichever fits tweakcn's existing token type with the smallest change. Resolve references to values for the preview. When a step changes, every token referencing it updates. When a palette is deleted, tokens that referenced it fall back to their last resolved value (converted to a plain value) — never leave a broken reference.

Light and dark mode each pick their own references (e.g. `primary` → `forest-green-700` in light, `forest-green-300` in dark). Palettes themselves are shared across modes.

### Scale generation

Use [culori](https://culorijs.org) for all colour maths (parsing, OKLCH conversion, gamut mapping, formatting). Put generation in a pure, framework-free module with unit tests.

1. **Convert** `baseHex` to OKLCH → `L_b, C_b, H_b`.
2. **Target lightness curve** (starting values; tune in step 7):

   | Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
   |---|---|---|---|---|---|---|---|---|---|---|---|
   | L | 0.975 | 0.945 | 0.895 | 0.825 | 0.725 | 0.635 | 0.550 | 0.470 | 0.400 | 0.345 | 0.265 |

3. **Anchor:** `anchorStep` = step whose target L is closest to `L_b`. That step's value is **exactly** `baseHex` (stored as OKLCH, but must round-trip to the identical hex).
4. **Bend the curve around the anchor:** `delta = L_b − L_target[anchor]`. For every other step, `L_i = L_target[i] + delta × w_i`, where `w_i` falls linearly from 1 at the anchor to 0 at the ends of the scale (step 50 and 950). Then enforce strictly decreasing lightness from 50 to 950 (minimum gap 0.015); if needed, nudge the non-anchor steps, never the anchor.
5. **Chroma taper:** relative multipliers per step:

   | Step | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
   |---|---|---|---|---|---|---|---|---|---|---|---|
   | m | 0.15 | 0.30 | 0.50 | 0.75 | 0.92 | 1.0 | 1.0 | 1.0 | 0.90 | 0.80 | 0.70 |

   `C_i = C_b × m_i / m_anchor`. Hue stays `H_b` for every step.
   For near-neutral brand colours (`C_b < 0.02`), keep chroma at `C_b` across the scale (a grey stays a grey).
6. **Gamut map** each non-anchor step into sRGB with culori's `toGamut('rgb', 'oklch')` (or equivalent) so every step is displayable and exports as a valid hex.
7. **Tune** using a test page (dev-only route) showing generated scales for these inputs side by side with Tailwind's own scales: a dark green `#0B3D2E`, a bright orange `#FF6B1A`, a saturated blue `#1D4ED8`, a pale yellow `#F5E6A8`, a near-black `#1A1A1A`. Adjust the curve/taper until the scales look evenly stepped and comparable in quality to Tailwind's. Log final values in `docs/DECISIONS.md`.

**Unit tests must cover:** the anchor step round-trips to the exact input hex; lightness strictly decreases; all steps are in sRGB gamut; very light and very dark inputs anchor at sensible steps (50/100 and 900/950); neutral inputs stay neutral; locked steps are untouched by regeneration.

### Manual overrides

- Every step can be edited (colour picker + text input accepting hex or oklch). Editing a step sets `locked: true` and shows a small lock indicator.
- Each locked step has a "Reset" action (regenerate that step only). The palette has "Reset all overrides".
- Changing `baseHex` regenerates all **unlocked** steps; locked steps keep their values. The anchor can be re-detected, but if the new anchor step is locked, keep the locked value and pick the nearest unlocked step as anchor instead — log this edge case behaviour in DECISIONS.md.
- Show the WCAG contrast ratio of each step against white and black (small, unobtrusive, e.g. on hover or in a detail row).

### UI

Follow tweakcn's existing editor UI patterns and components exactly; this should look like it shipped with tweakcn.

- A **Brand palettes** section in the editor sidebar/control panel: list of palettes, "Add brand colour" (name + hex), each palette rendered as an 11-swatch row, click a swatch to edit it, palette menu for rename/delete/reset.
- In every colour picker where tweakcn offers Tailwind palette colours, add a **Brand** group at the top listing the brand scales. Selecting a step sets the token's reference.
- Tokens that reference a brand step show that reference (e.g. "forest-green-700") in the picker so it's clear the value is linked.

### Phase 1 done when

- Jacob can add 3–4 brand colours, see generated scales, tweak steps, and assign steps to any shadcn token in light and dark mode.
- The dashboard and component previews update live, including when a palette step changes.
- Palettes survive reload/save the same way themes do.
- Tests pass; typecheck and lint are clean; `docs/PROGRESS.md` is updated.

---

## Phase 1b — Brand tab and Roles (built; see docs/DECISIONS.md for details)

### Preview-only theming
The editor chrome always uses tweakcn's default neutral theme (following the light/dark toggle). Only the preview area gets the edited theme, including overlays (dialogs, dropdowns, popovers, tooltips, sheets) opened from the preview, via a themed portal container (`features/preview-scope/`). Keep it that way when adding UI.

### Brand tab
- "Brand" is the **first** tab in the left panel (before Colors, Typography, Other, Generate) and the **default** tab when the editor opens.
- It contains, in order: **Brand palettes**, **Roles**. It is a list of sections (`features/brand-palettes/components/brand-tab-content.tsx`), so the future **Fonts** section (custom font upload, Roadmap 3) is added as one more entry. Don't build a placeholder for it.

### Roles: palettes drive the whole theme
- Roles: **Primary**, **Secondary**, **Neutral** (backgrounds, text, borders, muted surfaces), **Destructive** (optional). Each role can be assigned one brand palette or left empty. An unassigned role leaves its tokens exactly as they are.
- Every shadcn colour token has a default rule: a role plus a step for light and a step for dark. The final table is in docs/DECISIONS.md ("Token rules (final)"); change rules there and in `features/brand-palettes/roles.ts` together.
- Neutral has a light-mode background option: "Neutral 50" or "pure white" (applies to background, card, popover).
- **Contrast rules:**
  - Light-mode primary = the palette's anchor step (the client's exact brand colour). If it is under 3:1 against the background, keep it and show a warning.
  - "Auto (contrast)" foregrounds pick from white, the palette's 50 or its 950, whichever has the highest contrast; if that is under WCAG 4.5:1, show a warning on the token.
  - In dark mode, if the anchor step has less than 3:1 against the dark background, move to the nearest lighter step that meets 3:1. Same logic for secondary and destructive where they are solid colours.
- **Auto vs. Manual tokens:**
  - Every token linked to a role is "Auto" by default and shows its rule (e.g. "Auto · Primary 700").
  - Picking a different colour for it in the Colors tab makes it "Manual"; it keeps that choice when roles change. A reset action returns it to Auto (per token, and "Reset all to Auto" in Roles). Same behaviour as locked palette steps.
  - Assigning or swapping a palette updates all Auto tokens instantly, in light and dark mode.
  - Auto tokens are stored as references to the primitive steps they resolve to (`brandRefs`), exactly like manually linked tokens, so exports output `var(--forest-green-700)` / DTCG aliases for both.
- **Hover states:** shadcn components define hover in-component (e.g. `bg-primary/90`); keep it, don't modify components. Dedicated hover tokens per role belong to the Phase 4 component-token work (docs/IDEAS.md).

---

## Phase 2 — Exports

Extend tweakcn's existing export UI. Build all exports from the same resolved theme data.

1. **CSS (Tailwind v4 / shadcn `globals.css`):**
   - Primitives as CSS variables in `:root` (`--forest-green-700: oklch(...)`).
   - Semantic tokens reference primitives where linked (`--primary: var(--forest-green-700);`), raw values otherwise. Same for `.dark`.
   - Register primitives in `@theme inline` (`--color-forest-green-700: var(--forest-green-700);`) so `bg-forest-green-700` works as a utility.
   - Keep tweakcn's existing output for everything else.
2. **shadcn registry item:** extend tweakcn's existing registry export (if present) so a new project's whole setup is `npx shadcn add <url>`, including the brand primitives. **The export pipeline must be registry-based**, because later phases will ship modified component files through the same registry (see Roadmap).
3. **Design tokens JSON for Figma** (W3C DTCG format, compatible with Tokens Studio):
   - Set `primitives`: each brand scale (and any Tailwind colours actually used), `$type: "color"`.
   - Sets `semantic/light` and `semantic/dark`: shadcn tokens. Linked tokens are **aliases** (`"$value": "{forest-green.700}"`), unlinked ones raw values.
   - Include radius and other non-colour tokens tweakcn exposes, with the appropriate `$type`.
   - Downloadable as `.json`. Document the import steps for Tokens Studio in `docs/FIGMA-IMPORT.md`.

### Phase 2 done when

- Each export is tested: CSS pastes into a fresh shadcn + Tailwind v4 project and renders correctly; the registry item installs with `npx shadcn add` against a local URL; the JSON validates against the DTCG structure and aliases resolve.

---

## Roadmap (do not build yet — but don't block it)

3. **Custom font upload:** upload woff2/woff/otf, generate `@font-face`, font tokens in all exports.
4. **Component-level spacing:** per-component tokens (e.g. `--button-px`, `--card-padding`). This requires modified shadcn component files that read those variables, shipped through the registry. Implications for Phases 1–2:
   - Keep the token model open to a **third layer** (primitives → semantic → component tokens). Don't hard-code assumptions that only two layers exist.
   - Keep exports registry-based (above).
5. **App shell:** a registry block (sidebar, navigation, page layouts) installed into projects using the generated theme. Separate from the editor.
