/** Palette naming: slugs and clash validation. Pure module. */

/** Tailwind v4's built-in colour names (plus keywords) a brand palette must not shadow. */
export const TAILWIND_COLOR_NAMES = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  // Not in the installed Tailwind 4.1, but reserved by newer v4 releases; blocked to stay future-proof.
  "mauve",
  "olive",
  "mist",
  "taupe",
  // Keywords
  "black",
  "white",
  "transparent",
  "current",
  "inherit",
] as const;

/** shadcn semantic token roots: a palette called "primary" would read as `primary-500`, too confusing. */
export const SHADCN_TOKEN_NAMES = [
  "background",
  "foreground",
  "card",
  "popover",
  "primary",
  "secondary",
  "muted",
  "accent",
  "destructive",
  "border",
  "input",
  "ring",
  "chart",
  "sidebar",
  "radius",
  "shadow",
  "font",
  "spacing",
  "color",
] as const;

/** "Forest Green" → "forest-green"; "Æble Rød!" → "aeble-rod". */
export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .replace(/å/gi, "a")
    .replace(/ß/g, "ss")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Returns an error message for a palette name, or null when it's fine.
 * `existingSlugs` are the slugs of the *other* palettes (exclude the one being renamed).
 */
export function validatePaletteName(name: string, existingSlugs: string[]): string | null {
  if (!name.trim()) return "Enter a name.";
  const slug = slugify(name);
  if (!slug) return "Use at least one letter or number.";
  if (!/^[a-z]/.test(slug)) return "The name must start with a letter.";
  if (/-\d+$/.test(slug)) {
    return `"${slug}" ends in a number, which would be confused with a step (e.g. ${slug}-500).`;
  }
  if ((TAILWIND_COLOR_NAMES as readonly string[]).includes(slug)) {
    return `"${slug}" is a built-in Tailwind colour. Try e.g. "brand-${slug}".`;
  }
  if ((SHADCN_TOKEN_NAMES as readonly string[]).includes(slug)) {
    return `"${slug}" is a shadcn token name. Try e.g. "brand-${slug}".`;
  }
  if (existingSlugs.includes(slug)) return `A palette called "${slug}" already exists.`;
  return null;
}
