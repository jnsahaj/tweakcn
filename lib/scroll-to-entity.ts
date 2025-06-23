

const ENTITY_MAP = {
  "primary": { tab: "colors", section: "Primary Colors" },
  "primary-foreground": { tab: "colors", section: "Primary Colors" },
  "secondary": { tab: "colors", section: "Secondary Colors" },
  "secondary-foreground": { tab: "colors", section: "Secondary Colors" },
  "accent": { tab: "colors", section: "Accent Colors" },
  "accent-foreground": { tab: "colors", section: "Accent Colors" },
  "background": { tab: "colors", section: "Base Colors" },
  "foreground": { tab: "colors", section: "Base Colors" },
  "card": { tab: "colors", section: "Card Colors" },
  "card-foreground": { tab: "colors", section: "Card Colors" },
  "popover": { tab: "colors", section: "Popover Colors" },
  "popover-foreground": { tab: "colors", section: "Popover Colors" },
  "muted": { tab: "colors", section: "Muted Colors" },
  "muted-foreground": { tab: "colors", section: "Muted Colors" },
  "destructive": { tab: "colors", section: "Destructive Colors" },
  "destructive-foreground": { tab: "colors", section: "Destructive Colors" },
  "border": { tab: "colors", section: "Border & Input Colors" },
  "input": { tab: "colors", section: "Border & Input Colors" },
  "ring": { tab: "colors", section: "Border & Input Colors" },
  "chart-1": { tab: "colors", section: "Chart Colors" },
  "chart-2": { tab: "colors", section: "Chart Colors" },
  "chart-3": { tab: "colors", section: "Chart Colors" },
  "chart-4": { tab: "colors", section: "Chart Colors" },
  "chart-5": { tab: "colors", section: "Chart Colors" },
  "sidebar": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-primary": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-primary-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-accent": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-accent-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-border": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-ring": { tab: "colors", section: "Sidebar Colors" },
  "font-sans": { tab: "typography", section: "Font Family" },
  "font-serif": { tab: "typography", section: "Font Family" },
  "font-mono": { tab: "typography", section: "Font Family" },
  "letter-spacing": { tab: "typography", section: "Letter Spacing" },
  "hue-shift": { tab: "other", section: "HSL Adjustments" },
  "saturation-multiplier": { tab: "other", section: "HSL Adjustments" },
  "lightness-multiplier": { tab: "other", section: "HSL Adjustments" },
  "radius": { tab: "other", section: "Radius" },
  "spacing": { tab: "other", section: "Spacing" },
  "shadow-color": { tab: "other", section: "Shadow" },
  "shadow-opacity": { tab: "other", section: "Shadow" },
  "shadow-blur": { tab: "other", section: "Shadow" },
  "shadow-spread": { tab: "other", section: "Shadow" },
  "shadow-offset-x": { tab: "other", section: "Shadow" },
  "shadow-offset-y": { tab: "other", section: "Shadow" },
} as const;

export type EntityName = keyof typeof ENTITY_MAP;

export const scrollToThemeEntity = (entity: EntityName) => {
  const globalWindow = window as unknown as { scrollToThemeEntity?: (entity: EntityName) => void };
  if (globalWindow.scrollToThemeEntity) {
    globalWindow.scrollToThemeEntity(entity);
  }
};

export { ENTITY_MAP };
