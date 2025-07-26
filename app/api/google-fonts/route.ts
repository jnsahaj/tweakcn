import { FontInfo, PaginatedFontsResponse } from "@/types/fonts";
import { FALLBACK_FONTS } from "@/utils/fonts";
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

function loadFontsFromFile(): FontInfo[] {
  try {
    const fontsPath = join(process.cwd(), "public", "assets", "google-fonts.json");
    const fontsData = readFileSync(fontsPath, "utf-8");
    const fonts: FontInfo[] = JSON.parse(fontsData);

    console.log(`✅ Loaded ${fonts.length} fonts from static file`);
    return fonts;
  } catch (error) {
    console.warn("⚠️ Could not load fonts from static file, using fallback fonts:", error);
    return FALLBACK_FONTS;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toLowerCase();
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    const allFonts = loadFontsFromFile();

    // Filter fonts based on search query and category
    let filteredFonts = allFonts;

    if (query) {
      filteredFonts = filteredFonts.filter((font) => font.family.toLowerCase().includes(query));
    }

    if (category && category !== "all") {
      filteredFonts = filteredFonts.filter((font) => font.category === category);
    }

    const paginatedFonts = filteredFonts.slice(offset, offset + limit);

    const response: PaginatedFontsResponse = {
      fonts: paginatedFonts,
      total: filteredFonts.length,
      offset,
      limit,
      hasMore: offset + limit < filteredFonts.length,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in Google Fonts API:", error);
    return NextResponse.json({ error: "Failed to fetch fonts" }, { status: 500 });
  }
}
