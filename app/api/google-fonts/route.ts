import { PaginatedFontsResponse } from "@/types/fonts";
import { fetchGoogleFonts } from "@/utils/fonts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toLowerCase() || "";
    const category = searchParams.get("category")?.toLowerCase();
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    const allFonts = await fetchGoogleFonts();

    // Filter fonts based on search query and category
    let filteredFonts = allFonts;

    if (query) {
      filteredFonts = filteredFonts.filter((font) => font.family.toLowerCase().includes(query));
    }

    if (category && category !== "all") {
      filteredFonts = filteredFonts.filter((font) => font.category === category);
    }

    // Sort alphabetically by family name
    filteredFonts.sort((a, b) => a.family.localeCompare(b.family));

    // Apply pagination
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
