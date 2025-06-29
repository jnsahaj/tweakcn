import { theme } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const themeStylePropsSchema = z.object({
  background: z.string().describe("The default background color, paired with `foreground`."),
  foreground: z.string().describe("Paired with `background`."),
  card: z.string().describe("The background color for cards, paired with `card-foreground`."),
  "card-foreground": z.string().describe("Paired with `card`."),
  popover: z
    .string()
    .describe("The background color for popovers, paired with `popover-foreground`."),
  "popover-foreground": z.string().describe("Paired with `popover`."),
  primary: z.string().describe("The main color, paired with `primary-foreground`."),
  "primary-foreground": z.string().describe("Paired with `primary`."),
  secondary: z.string().describe("A secondary color, paired with `secondary-foreground`."),
  "secondary-foreground": z.string().describe("Paired with `secondary`."),
  muted: z.string().describe("A muted background color, paired with `muted-foreground`."),
  "muted-foreground": z.string().describe("Paired with `muted`."),
  accent: z
    .string()
    .describe("Subtle color for hover or highlight, paired with `accent-foreground`."),
  "accent-foreground": z.string().describe("Paired with `accent`."),
  destructive: z
    .string()
    .describe("Color for destructive actions, paired with `destructive-foreground`."),
  "destructive-foreground": z.string().describe("Paired with `destructive`."),
  border: z.string().describe("The color for borders."),
  input: z.string().describe("The background color for input fields."),
  ring: z.string().describe("The color for focus rings."),
  "chart-1": z.string(),
  "chart-2": z.string(),
  "chart-3": z.string(),
  "chart-4": z.string(),
  "chart-5": z.string(),
  sidebar: z
    .string()
    .describe("The background color for the sidebar, paired with `sidebar-foreground`."),
  "sidebar-foreground": z.string().describe("Paired with `sidebar`."),
  "sidebar-primary": z
    .string()
    .describe("The primary color for sidebar elements, paired with `sidebar-primary-foreground`."),
  "sidebar-primary-foreground": z.string().describe("Paired with `sidebar-primary`."),
  "sidebar-accent": z
    .string()
    .describe("An accent color for the sidebar, paired with `sidebar-accent-foreground`."),
  "sidebar-accent-foreground": z.string().describe("Paired with `sidebar-accent`."),
  "sidebar-border": z.string().describe("The color for borders within the sidebar."),
  "sidebar-ring": z.string().describe("The color for focus rings within the sidebar."),
  "font-sans": z.string().describe("The preferred sans-serif font family."),
  "font-serif": z.string().describe("The preferred serif font family."),
  "font-mono": z.string().describe("The preferred monospace font family."),
  radius: z
    .string()
    .describe("The global border-radius for components. Use 0rem for sharp corners."),
  "shadow-color": z.string(),
  "shadow-opacity": z.string(),
  "shadow-blur": z.string(),
  "shadow-spread": z.string(),
  "shadow-offset-x": z.string(),
  "shadow-offset-y": z.string(),
  "letter-spacing": z.string().describe("The global letter spacing for text."),
  spacing: z.string(),
});

export const themeStylesSchema = z.object({
  light: themeStylePropsSchema,
  dark: themeStylePropsSchema,
});

export type ThemeStyleProps = z.infer<typeof themeStylePropsSchema>;
export type ThemeStyles = z.infer<typeof themeStylesSchema>;

export interface ThemeEditorPreviewProps {
  styles: ThemeStyles;
  currentMode: "light" | "dark";
}

export interface ThemeEditorControlsProps {
  styles: ThemeStyles;
  currentMode: "light" | "dark";
  onChange: (styles: ThemeStyles) => void;
  themePromise: Promise<Theme | null>;
}

export type ThemePreset = {
  source?: "SAVED" | "BUILT_IN";
  createdAt?: string;
  label?: string;
  styles: {
    light: Partial<ThemeStyleProps>;
    dark: Partial<ThemeStyleProps>;
  };
};

export type Theme = InferSelectModel<typeof theme>;
