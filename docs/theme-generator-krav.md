# Krav til theme generatorens eksport

Til Claude Code i theme generator-projektet (tweakcn-fork). Dokumentet beskriver, hvad CSS-eksporten skal indeholde, så den kan bruges direkte i app-skallen (`npm run theme:apply <fil>`), hvad der skal ændres i generatoren, og hvilke fejl der blev fundet i de tre testtemaer (`test-1.css`, `test-2.css`, `test-3.css`).

Kontrollen i skallen er `npm run theme:check <fil>` (`scripts/theme/check.mjs`). Generatoren bør lave de samme tjek i sin editor, så fejl fanges, før temaet eksporteres (se afsnit 4).

---

## 1. Hvad eksporten skal indeholde

Skallen deler temaet i to:

| Fil | Indhold | Ejes af |
|---|---|---|
| `src/styles/theme.css` | **Kun** `:root { … }` og `.dark { … }` med værdier | Temaet (generatoren) |
| `src/styles/globals.css` | `@import "tailwindcss"`, `@custom-variant dark`, `@theme inline` (mapping til Tailwind) og `@layer base` | Skallen |

### 1.1 Struktur

- [ ] Eksportér **kun** `:root` og `.dark`. Ingen `@import "tailwindcss"`, `@custom-variant`, `@theme inline` eller `@layer base`. De ligger allerede i skallen, og `@import "tailwindcss"` i temaet indlæser Tailwind to gange.
- [ ] Vil generatoren stadig tilbyde den fulde fil (til andre projekter), så gør det til et valg ("Standalone CSS"), og lad "App shell" være standard.
- [ ] Ingen andre regler eller selektorer. `theme:apply` fjerner alt andet med en advarsel.

### 1.2 Tokens

**Farver – påkrævet i både `:root` og `.dark`** (OKLCH foretrækkes, alle CSS-farveformater kan læses):

```
background, foreground, card, card-foreground, popover, popover-foreground,
primary, primary-foreground, secondary, secondary-foreground,
muted, muted-foreground, accent, accent-foreground,
destructive, destructive-foreground, border, input, ring,
chart-1, chart-2, chart-3, chart-4, chart-5,
sidebar, sidebar-foreground, sidebar-primary, sidebar-primary-foreground,
sidebar-accent, sidebar-accent-foreground, sidebar-border, sidebar-ring
```

**Øvrige – påkrævet i `:root`** (gentages gerne i `.dark`; mangler de dér, arves de fra `:root`):

```
--radius
--font-sans, --font-serif, --font-mono
--shadow-2xs, --shadow-xs, --shadow-sm, --shadow, --shadow-md, --shadow-lg, --shadow-xl, --shadow-2xl
--tracking-normal
--spacing
```

**Valgfrie:**

| Token | Betydning | Uden token |
|---|---|---|
| `--font-heading` | Font til overskrifter (`font-heading`, bruges på alle sidetitler, kort- og sektionsoverskrifter) | `--font-sans` |
| `--shadow-x`, `--shadow-y`, `--shadow-blur`, `--shadow-spread`, `--shadow-opacity`, `--shadow-color` | Skyggens byggesten (se 2.3) | – |

- [ ] **Nyt:** tilføj `--font-heading` som valgfrit felt i generatoren (standard: samme som sans). Eksportér det kun, når det afviger fra `--font-sans`.

### 1.3 Format

- [ ] Fontnavne i anførselstegn med en fuld fallback-stak, fx `--font-sans: "Oxanium", ui-sans-serif, system-ui, sans-serif;` (i dag: `Oxanium, sans-serif` og `Fira Code, monospace`).
- [ ] Brug fonte, der findes på [fontsource](https://fontsource.org) (= Google Fonts + flere). `theme:apply` installerer dem som npm-pakker (self-hosted, ingen kald til Google). Fonte, der ikke findes dér, kræver manuelt arbejde – vis en advarsel i generatoren.
- [ ] Ingen alpha over 1 og ingen negative værdier (se 2.3).

---

## 2. Ændringer i generatoren

### 2.1 Radius – brug shadcn's formel og alle 7 trin

Generatoren bruger i dag `radius ± 4px` og kun fire trin (sm–xl). Skallen (og shadcn's nuværende version) bruger **multiplikatorer** og **syv trin**. Forskellen er stor ved små radier: med `--radius: 0` får `rounded-xl` 4px hjørner i generatorens preview, men 0 i skallen. Med `0.3rem` bliver `rounded-sm` 0,8px i stedet for 2,9px.

Brug præcis denne formel i **både preview og Figma-eksport**:

| Utility | Formel | `--radius: 0.625rem` (10px) | `0.3rem` (4,8px) | `0` |
|---|---|---|---|---|
| `rounded-sm` | `--radius × 0.6` | 6px | 2,88px | 0 |
| `rounded-md` | `--radius × 0.8` | 8px | 3,84px | 0 |
| `rounded-lg` | `--radius × 1` | 10px | 4,8px | 0 |
| `rounded-xl` | `--radius × 1.4` | 14px | 6,72px | 0 |
| `rounded-2xl` | `--radius × 1.8` | 18px | 8,64px | 0 |
| `rounded-3xl` | `--radius × 2.2` | 22px | 10,56px | 0 |
| `rounded-4xl` | `--radius × 2.6` | 26px | 12,48px | 0 |
| `rounded-full` | `9999px` (fast) | – | – | – |

Skallens mapping (fra `src/styles/globals.css`). Eksporterer generatoren en standalone-fil med `@theme inline`, skal blokken indeholde præcis dette:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* … alle farvetokens som --color-<token>: var(--<token>); … */

  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-serif: var(--font-serif);
  --font-heading: var(--font-heading, var(--font-sans));

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);

  --tracking-tighter: calc(var(--tracking-normal) - 0.05em);
  --tracking-tight: calc(var(--tracking-normal) - 0.025em);
  --tracking-normal: var(--tracking-normal);
  --tracking-wide: calc(var(--tracking-normal) + 0.025em);
  --tracking-wider: calc(var(--tracking-normal) + 0.05em);
  --tracking-widest: calc(var(--tracking-normal) + 0.1em);
}
```

Og i base-laget: `body { letter-spacing: var(--tracking-normal); }`. Uden den har `--tracking-normal` ingen effekt.

### 2.2 Tracking og spacing

- `--tracking-normal` og `--spacing` kun i `:root` er i orden (`.dark` sidder på `<html>` og arver). Det, der manglede, var tracking-mappingen i `@theme inline` og `letter-spacing` på `body` (se 2.1). Det har skallen nu.
- Generatorens preview skal anvende `--tracking-normal` på `body` og beregne `tracking-tight` osv. relativt til den, som ovenfor.

### 2.3 Skygger

- [ ] **Alpha må aldrig overstige 1.** `--shadow-2xl` beregnes i dag som `shadow-opacity × 2.5`, så `--shadow-opacity: 1` giver `/ 2.50` (test-3). Brug `min(1, opacity × 2.5)`. Browsere runder ned til 1, så det ses ikke, men det er en ugyldig værdi, og `theme:check` fejler på den.
- [ ] Skyggerne er færdigberegnede med farven indsat som literal (`hsl(28 18% 25% / 0.18)`), så `--shadow-color` og `--shadow-opacity` i filen ikke gør noget, hvis man retter dem. Byg skyggerne ud fra variablerne, fx:
  ```css
  --shadow-sm: var(--shadow-x) var(--shadow-y) var(--shadow-blur) var(--shadow-spread)
      color-mix(in oklab, var(--shadow-color) calc(var(--shadow-opacity) * 100%), transparent),
    var(--shadow-x) 1px 2px -1px
      color-mix(in oklab, var(--shadow-color) calc(var(--shadow-opacity) * 100%), transparent);
  ```
  Kan det ikke lade sig gøre, så skal literalerne i det mindste altid svare til `--shadow-color`/`--shadow-opacity`.
- [ ] Mørkt tema: sort skygge med 10–18 % opacitet kan ikke ses mod en næsten sort baggrund (alle tre testtemaer). Foreslå højere opacitet i `.dark` (fx 0,4–0,6), eller vis en advarsel.
- Bemærk: shadcn's nuværende stil (Nova) bruger `ring-1 ring-foreground/10` på kort, ikke skygger. Skygger ses især på popovers, dropdowns, sheets og knapper. Et "brutalistisk" tema med hårde skygger (test-3) ser derfor mere afdæmpet ud i skallen end i generatorens preview, hvis preview'et lægger skygger på kort. Preview'et bør bruge de samme komponenter som shadcn.

### 2.4 Fonte

- [ ] Anførselstegn og fallback-stak (1.3).
- [ ] Fontsource-navn: variable fonte hedder `"<Navn> Variable"` i `@fontsource-variable`. `theme:apply` sætter selv `"Oxanium Variable", "Oxanium", …` forrest – generatoren skal **ikke** gøre det.
- [ ] Vis en advarsel, når en valgt font ikke findes på fontsource.

### 2.5 Indbygget validering

Generatoren bør advare, mens man redigerer (se kravene i afsnit 4). Det vigtigste:

- Kontrastpar under 4,5:1 (tekst) og 3:1 (grafik).
- Chart-farver, der er ens eller næsten ens, eller under 3:1 mod `card`.
- `destructive`, der ikke er rød/orange, eller som ligner `primary`.
- `destructive` i mørkt tema skal både kunne læses som tekst på `background` (≥ 4,5) **og** bære `destructive-foreground` (≥ 4,5). Ofte løses det bedst med mørk `destructive-foreground` i mørkt tema, som skallens standardtema gør.

---

## 3. Fejl i de tre testtemaer

Fundet med `npm run theme:check themes/test-N.css` og ved at gennemgå /components, dashboard, /sales, kundelisten, "Ny kunde" og login i lyst og mørkt tema (skærmbilleder i [`docs/theme-screenshots/`](theme-screenshots/)).

**Alle tre:** indeholder `@import "tailwindcss"`, `@custom-variant`, `@theme inline` (med den gamle radius-formel) og `@layer base` (1.1, 2.1). Fontnavne uden anførselstegn eller fallback (1.3). Usynlige skygger i mørkt tema (2.3).

### test-1 (lyserød/lilla, radius 0, systemfonte) – 9 fejl, 8 advarsler

| Tema | Fejl | Værdi |
|---|---|---|
| Mørkt | **`destructive` er næsten lig baggrunden** (`oklch(0.2258 …)` på `oklch(0.2409 …)`). Fejltekster og destructive-knapper er usynlige (se `test-1/components-dark.jpg`, "Slet"). | 1,05:1 (krav 4,5) |
| Mørkt | `destructive` på `destructive/20` | 1,04:1 (4,5) |
| Mørkt | `primary` som tekst og grafik på `background` | 2,09:1 (4,5 / 3) |
| Mørkt | `sidebar-primary` på `sidebar` | 2,77:1 (3) |
| Mørkt | `chart-1`, `chart-2` på `card` | 2,59 / 2,91:1 (3) |
| Lyst | `chart-4`, `chart-5` på `card` (gul/orange på næsten hvid) | 1,56 / 1,89:1 (3) |
| Advarsel | `destructive` ufarvet i mørkt (chroma 0,05), `destructive` ≈ `primary` i lyst (ΔE 0,06), chart-4 ≈ chart-5 (lyst), chart-2 ≈ chart-4 (mørkt) | |

### test-2 (varm/orange, Oxanium/Merriweather/Fira Code, radius 0.3rem) – 9 fejl, 5 advarsler

| Tema | Fejl | Værdi |
|---|---|---|
| Lyst | **`chart-2` og `chart-4` er identiske** (`oklch(0.5534 0.0116 58.0708)`) – to statusser/serier får samme farve | ΔE 0 |
| Lyst | `muted-foreground` på `muted` / `card` | 3,98 / 4,38:1 (4,5) |
| Lyst | `secondary-foreground` på `secondary` | 4,45:1 (4,5) |
| Lyst | `chart-5` på `card` | 2,68:1 (3) |
| Mørkt | `primary-foreground` (hvid) på `primary` (lys orange) – knapper | 2,80:1 (4,5) |
| Mørkt | `sidebar-primary-foreground` på `sidebar-primary` | 2,80:1 (4,5) |
| Mørkt | `destructive` på `background` / `destructive/20` | 3,62 / 3,08:1 (4,5) |
| Advarsel | chart-1 ≈ chart-3 (ΔE 0,05), stort set grå chart-2/4 (chroma 0,01) | |

### test-3 (brutalist, sort/hvid, DM Sans/Space Mono, radius 0) – 8 fejl, 4 advarsler

| Tema | Fejl | Værdi |
|---|---|---|
| Begge | **`--shadow-2xl` har alpha 2,50** (ugyldig, max 1) | 2.3 |
| Lyst | `primary-foreground` (hvid) på `primary` (rød) og `primary` som tekst | 3,64:1 (4,5) |
| Lyst | `sidebar-primary-foreground` på `sidebar-primary` | 3,64:1 (4,5) |
| Lyst | `chart-2` (gul) på hvid `card` – næsten usynlig | 1,07:1 (3) |
| Lyst | `chart-4` (grøn) på `card` | 2,18:1 (3) |
| Mørkt | `chart-5` på `card` | 2,96:1 (3) |
| Advarsel | **`destructive` er sort (lyst) / hvid (mørkt)** – slet-knapper ligner almindelige knapper | chroma 0 |
| Info | Space Mono findes kun statisk på fontsource (ingen variabel version) – virker, men kun vægt 400/700 | |

---

## 4. Tjek, generatoren bør køre (samme som `theme:check`)

**Fejl:**

| Type | Par (forgrund på baggrund) | Krav |
|---|---|---|
| Tekst | `foreground`/`background`, `card-foreground`/`card`, `popover-foreground`/`popover`, `primary-foreground`/`primary`, `secondary-foreground`/`secondary`, `accent-foreground`/`accent`, `muted-foreground` på `background`, `muted` og `card`, `primary`/`background`, `destructive`/`background`, `destructive` på `destructive` 10 % (lyst) / 20 % (mørkt) over `background`, `destructive-foreground`/`destructive`, `sidebar-foreground`/`sidebar`, `sidebar-primary-foreground`/`sidebar-primary`, `sidebar-accent-foreground`/`sidebar-accent` | 4,5:1 |
| Grafik | `primary`/`background` (checkbox, switch, progress), `sidebar-primary`/`sidebar`, `chart-1…5`/`card` | 3:1 |
| Chart | Ingen to chart-farver med ΔE (OKLab) under 0,02 | – |
| Værdier | Alpha ≤ 1, OKLCH-lyshed ≤ 1, `--shadow-opacity` 0–1, `--radius` ≥ 0, alle farvetokens kan læses | – |
| Struktur | Alle påkrævede tokens (1.2) | – |

Gennemsigtige farver (fx `oklch(1 0 0 / 10%)`) lægges oven på baggrunden, før kontrasten beregnes.

**Advarsler:** `input`/`background` og `ring`/`background` under 3:1, chart-farver med ΔE under 0,08, `destructive` med chroma under 0,08 eller farvetone uden for 0–50°/330–360°, `destructive` ≈ `primary` (ΔE under 0,08), skygge (`shadow-md`) under 1,2:1 mod baggrunden.
