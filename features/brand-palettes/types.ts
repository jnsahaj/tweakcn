import type { BrandRoles } from "./roles";
import type { ScaleStep } from "./scale";

export type { ScaleStep } from "./scale";

export type BrandPaletteStep = {
  /** `oklch(...)` string */
  value: string;
  /** true once manually edited; regeneration leaves it alone */
  locked: boolean;
};

export type BrandPalette = {
  id: string;
  /** display name, e.g. "Forest Green" */
  name: string;
  /** kebab-case slug, e.g. "forest-green" */
  slug: string;
  /** the client hex as entered, e.g. "#0B3D2E" */
  baseHex: string;
  /** step that holds baseHex exactly (auto-detected) */
  anchorStep: ScaleStep;
  steps: Record<ScaleStep, BrandPaletteStep>;
};

/**
 * A reference from a token to a brand step, e.g. "forest-green-700".
 *
 * Kept as a plain string so a future third layer (component tokens → semantic tokens) can use the
 * same shape to point at a semantic token instead.
 */
export type BrandRef = string;

/** token name → reference, per mode. Only tokens linked to a brand step have an entry. */
export type BrandRefMap = Partial<Record<string, BrandRef>>;

export type BrandRefs = {
  light: BrandRefMap;
  dark: BrandRefMap;
};

export type Mode = "light" | "dark";

/** The part of the editor theme state brand palettes live in (see `types/editor.ts`). */
export type BrandPaletteThemeFields = {
  brandPalettes?: BrandPalette[];
  brandRefs?: BrandRefs;
  /** Role assignments and Auto/Manual bookkeeping (see `roles.ts`). */
  brandRoles?: BrandRoles;
};
