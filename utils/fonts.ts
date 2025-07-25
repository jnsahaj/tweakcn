import { FontInfo, GoogleFont, GoogleFontCategory, GoogleFontsAPIResponse } from "@/types/fonts";

// Popular fallback fonts if API fails
const POPULAR_FONTS: FontInfo[] = [
  {
    family: "Inter",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Roboto",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    variable: false,
  },
  {
    family: "Open Sans",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Poppins",
    category: "sans-serif",
    variants: ["400", "500", "600", "700"],
    variable: false,
  },
  {
    family: "Playfair Display",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Merriweather",
    category: "serif",
    variants: ["400", "500", "600", "700"],
    variable: false,
  },
  {
    family: "JetBrains Mono",
    category: "monospace",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
  {
    family: "Fira Code",
    category: "monospace",
    variants: ["400", "500", "600", "700"],
    variable: true,
  },
];

export async function fetchGoogleFonts(): Promise<FontInfo[]> {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

  if (!API_KEY) {
    console.warn("GOOGLE_FONTS_API_KEY not found, using popular fonts fallback");
    return POPULAR_FONTS;
  }

  try {
    const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data: GoogleFontsAPIResponse = await response.json();

    // Transform to our format
    const fonts: FontInfo[] = data.items.map((font: GoogleFont) => ({
      family: font.family,
      category: font.category,
      variants: font.variants,
      variable: font.variants.some(
        (variant: string) => variant.includes("wght") || variant.includes("ital,wght")
      ),
    }));

    console.log(`✅ Fetched ${fonts.length} fonts from Google Fonts API`);
    return fonts;
  } catch (error) {
    console.error("Failed to fetch Google Fonts:", error);
    return POPULAR_FONTS; // Fallback to popular fonts
  }
}

// Build Google Fonts CSS API URL
export function buildFontCssUrl(family: string, weights: string[] = ["400"]): string {
  const encodedFamily = encodeURIComponent(family);
  const weightsParam = weights.join(";"); // Use semicolon for Google Fonts API v2
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`;
}

// Build font-family value for CSS
export function buildFontFamily(fontFamily: string, category: GoogleFontCategory): string {
  const FALLBACKS = {
    "sans-serif": "ui-sans-serif, sans-serif, system-ui",
    serif: "ui-serif, serif",
    monospace: "ui-monospace, monospace",
    display: "ui-serif, Georgia, serif",
    handwriting: "cursive",
  };

  return `${fontFamily}, ${FALLBACKS[category]}`;
}

// Get default weights for a font based on available variants
export function getDefaultWeights(variants: string[]): string[] {
  const weightMap = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
  const availableWeights = variants.filter((variant) => weightMap.includes(variant));

  if (availableWeights.length === 0) {
    return ["400"]; // Fallback to normal weight
  }

  const preferredWeights = ["400", "500", "600", "700"];
  const selectedWeights = preferredWeights.filter((weight) => availableWeights.includes(weight));

  // If none of the preferred weights are available, use the first two available
  if (selectedWeights.length === 0) {
    const fallbackWeights = availableWeights.slice(0, 2);
    return fallbackWeights.sort((a, b) => parseInt(a) - parseInt(b));
  }

  // Return up to 4 weights, starting with preferred ones
  const finalWeights = [
    ...selectedWeights,
    ...availableWeights.filter((w) => !selectedWeights.includes(w)),
  ].slice(0, 4);

  // Sort weights numerically for Google Fonts API requirement
  return finalWeights.sort((a, b) => parseInt(a) - parseInt(b));
}

// Simple font loading using native browser APIs
// Just use a <link> tag - seems to be the recommended approach
export function loadGoogleFont(family: string, weights: string[] = ["400", "700"]): void {
  if (typeof document === "undefined") return;

  // Check if already loaded
  const href = buildFontCssUrl(family, weights);
  const existing = document.querySelector(`link[href="${href}"]`);
  if (existing) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  console.log("link", link);
  document.head.appendChild(link);
}

// Check if a font is available using the native document.fonts API
export function isFontLoaded(family: string, weight = "400"): boolean {
  if (typeof document === "undefined" || !document.fonts) return false;

  // Use the native FontFaceSet.check() method
  return document.fonts.check(`${weight} 16px "${family}"`);
}

// Wait for a font to load using the native document.fonts API
export async function waitForFont(
  family: string,
  weight = "400",
  timeout = 3000
): Promise<boolean> {
  if (typeof document === "undefined" || !document.fonts) return false;

  const font = `${weight} 16px "${family}"`;

  try {
    // Use the native document.fonts.load() method
    await Promise.race([
      document.fonts.load(font),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout)),
    ]);

    return document.fonts.check(font);
  } catch {
    return false;
  }
}

// Extract font family name from CSS font-family value
// e.g., "Inter, ui-sans-serif, system-ui, sans-serif" -> "Inter"
export function extractFontFamily(fontFamilyValue: string): string | null {
  if (!fontFamilyValue) return null;

  // Split by comma and get the first font
  const firstFont = fontFamilyValue.split(",")[0].trim();

  // Remove quotes if present
  const cleanFont = firstFont.replace(/['"]/g, "");

  // Skip system fonts
  if (SYSTEM_FONTS.includes(cleanFont.toLowerCase())) return null;
  return cleanFont;
}

export const SYSTEM_FONTS = [
  "ui-sans-serif",
  "ui-serif",
  "ui-monospace",
  "system-ui",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
];

// Categories mapped to their display names and common fallbacks
export const FONT_CATEGORIES = {
  "sans-serif": {
    label: "Sans Serif",
    fallback: "ui-sans-serif, system-ui, sans-serif",
  },
  serif: {
    label: "Serif",
    fallback: "ui-serif, Georgia, serif",
  },
  monospace: {
    label: "Monospace",
    fallback:
      "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  display: {
    label: "Display",
    fallback: "ui-serif, Georgia, serif",
  },
  handwriting: {
    label: "Handwriting",
    fallback: "cursive",
  },
} as const;
