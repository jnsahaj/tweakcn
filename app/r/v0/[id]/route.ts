import { NextResponse } from "next/server";
import { getTheme } from "@/actions/themes";
import { generateV0RegistryPayload } from "@/utils/registry/v0";
import { getBuiltInThemeStyles } from "@/utils/theme-preset-helper";

export const dynamic = "force-static";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // First, check if this is a built-in theme
    const builtInTheme = getBuiltInThemeStyles(id.replace(/\.json$/, ""));
    if (builtInTheme) {
      const payload = generateV0RegistryPayload(builtInTheme.name, builtInTheme.styles);
      return new NextResponse(JSON.stringify(payload), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    }

    // Fall back to database lookup for user-saved themes
    const theme = await getTheme(id);
    const payload = generateV0RegistryPayload(theme.name, theme.styles);

    return new NextResponse(JSON.stringify(payload), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating v0 registry payload:", error);

    const isNotFound =
      error instanceof Error &&
      (error.name === "ThemeNotFoundError" || error.message.includes("not found"));

    return new NextResponse(isNotFound ? "Theme not found" : "Failed to generate v0 payload", {
      status: isNotFound ? 404 : 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
