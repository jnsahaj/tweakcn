export type GoogleFontCategory = "sans-serif" | "serif" | "display" | "handwriting" | "monospace";

// Google Fonts API response types
export type GoogleFontAxis = {
  tag: string;
  start: number;
  end: number;
};

export type GoogleFontFiles = {
  [variant: string]: string; // URL to font file
};

export type GoogleFont = {
  kind: "webfonts#webfont";
  family: string;
  category: GoogleFontCategory;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: GoogleFontFiles;
  menu?: string;
  axes?: GoogleFontAxis[]; // For variable fonts
};

export type GoogleFontsAPIResponse = {
  kind: "webfonts#webfontList";
  items: GoogleFont[];
};

// App's font info type
export type FontInfo = {
  family: string;
  category: GoogleFontCategory;
  variants: string[];
  variable: boolean;
};

export type PaginatedFontsResponse = {
  fonts: FontInfo[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
};
