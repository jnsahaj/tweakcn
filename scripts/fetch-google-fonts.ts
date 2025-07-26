import { fetchGoogleFonts } from "@/utils/fonts/google-fonts";
import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";

// Load environment variables from .env.local
config({ path: ".env.local" });

const OUTPUT_PATH = join(process.cwd(), "public", "assets", "google-fonts.json");

async function fetchAndSaveGoogleFonts() {
  const API_KEY = process.env.GOOGLE_FONTS_API_KEY;

  if (!API_KEY) {
    console.error("❌ GOOGLE_FONTS_API_KEY environment variable not found");
    process.exit(1);
  }

  try {
    const fonts = await fetchGoogleFonts(API_KEY);

    // Sort alphabetically for consistent ordering
    fonts.sort((a, b) => a.family.localeCompare(b.family));

    // Ensure directory exists
    mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

    // Save to file
    writeFileSync(OUTPUT_PATH, JSON.stringify(fonts, null, 2));

    console.log(`✅ Successfully saved ${fonts.length} fonts to ${OUTPUT_PATH}`);
    console.log("📊 Font breakdown:");

    // Show breakdown by category
    const breakdown = fonts.reduce(
      (acc, font) => {
        acc[font.category] = (acc[font.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(breakdown).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} fonts`);
    });
  } catch (error) {
    console.error("❌ Failed to fetch Google Fonts:", error);
    process.exit(1);
  }
}

// Run the script
fetchAndSaveGoogleFonts();
