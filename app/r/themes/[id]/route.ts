import { NextResponse } from "next/server";

import { getTheme } from "@/actions/themes";
import { generateThemeRegistryItemFromStyles } from "@/utils/registry/themes";
import { registryItemSchema } from "shadcn/registry";
import { getBuiltInThemeStyles } from "@/utils/theme-preset-helper";
import { ThemeStyles } from "@/types/theme";

export const dynamic = "force-static";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // First, check if this is a built-in theme
    let themeName: string;
    let themeStyles: ThemeStyles;

    const builtInTheme = getBuiltInThemeStyles(id.replace(/\.json$/, ""));
    if (builtInTheme) {
      themeName = builtInTheme.name;
      themeStyles = builtInTheme.styles;
    } else {
      // Fall back to database lookup for user-saved themes
      const theme = await getTheme(id);
      themeName = theme.name;
      themeStyles = theme.styles;
    }

    const generatedRegistryItem = generateThemeRegistryItemFromStyles(themeName, themeStyles);

    // Validate the generated registry item against the official shadcn registry item schema
    // https://ui.shadcn.com/docs/registry/registry-item-json
    const parsedRegistryItem = registryItemSchema.safeParse(generatedRegistryItem);
    if (!parsedRegistryItem.success) {
      console.error(
        "Could not parse the registry item from the database:",
        parsedRegistryItem.error.format()
      );

      return new NextResponse("Unexpected registry item format.", {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // If the parsing is successful, we can safely access the data property
    // and return it as the registry item json being sure it's in a correct format.
    const registryItem = parsedRegistryItem.data;
    return new NextResponse(JSON.stringify(registryItem), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("Error fetching the theme registry item:", e);

    return new NextResponse("Failed to fetch the theme registry item.", {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
