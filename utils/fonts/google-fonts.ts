import { FontInfo, GoogleFont, GoogleFontsAPIResponse } from "@/types/fonts";

export const GOOGLE_FONTS_API_URL = "https://www.googleapis.com/webfonts/v1/webfonts";

export async function fetchGoogleFonts(googleFontsApiKey: string | undefined): Promise<FontInfo[]> {
  try {
    if (!googleFontsApiKey) throw new Error("Google Fonts API key is required");

    const response = await fetch(`${GOOGLE_FONTS_API_URL}?key=${googleFontsApiKey}`);

    if (!response.ok) throw new Error(`Google Fonts API error: ${response.status}`);

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
    throw error;
  }
}

// Build Google Fonts CSS API URL
export function buildFontCssUrl(family: string, weights: string[] = ["400"]): string {
  const encodedFamily = encodeURIComponent(family);
  const weightsParam = weights.join(";"); // Use semicolon for Google Fonts API v2
  return `https://fonts.googleapis.com/css2?family=${encodedFamily}:wght@${weightsParam}&display=swap`;
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
  document.head.appendChild(link);
}
