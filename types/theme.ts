import { theme } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { z } from "zod";

export const themeStylePropsSchema = z.object({
  background: z.string(),
  foreground: z.string(),
  card: z.string(),
  "card-foreground": z.string(),
  popover: z.string(),
  "popover-foreground": z.string(),
  primary: z.string(),
  "primary-foreground": z.string(),
  secondary: z.string(),
  "secondary-foreground": z.string(),
  muted: z.string(),
  "muted-foreground": z.string(),
  accent: z.string(),
  "accent-foreground": z.string(),
  destructive: z.string(),
  "destructive-foreground": z.string(),
  border: z.string(),
  input: z.string(),
  ring: z.string(),
  "chart-1": z.string(),
  "chart-2": z.string(),
  "chart-3": z.string(),
  "chart-4": z.string(),
  "chart-5": z.string(),
  sidebar: z.string(),
  "sidebar-foreground": z.string(),
  "sidebar-primary": z.string(),
  "sidebar-primary-foreground": z.string(),
  "sidebar-accent": z.string(),
  "sidebar-accent-foreground": z.string(),
  "sidebar-border": z.string(),
  "sidebar-ring": z.string(),
  "font-sans": z.string(),
  "font-serif": z.string(),
  "font-mono": z.string(),
  radius: z.string(),
  "shadow-color": z.string(),
  "shadow-opacity": z.string(),
  "shadow-blur": z.string(),
  "shadow-spread": z.string(),
  "shadow-offset-x": z.string(),
  "shadow-offset-y": z.string(),
  "letter-spacing": z.string(),
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

export interface CommunityTheme {
  id: string;
  theme: {
    id: string;
    name: string;
    styles: ThemeStyles;
  };
  created_at: Date;
  likes_count: number;
  is_liked: boolean;
  community_profile: {
    id: string;
    name?: string | null;
    image?: string | null;
  };
}
