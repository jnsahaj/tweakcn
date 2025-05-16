import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LikeButton } from "./like-button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Define the color palette structure
interface ThemeColorPalette {
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  accent: string;
  "accent-foreground": string;
  muted: string;
  "muted-foreground": string;
  background: string;
  foreground: string;
  [key: string]: string; // For flexibility with other theme colors
}

// Define the styles structure for light and dark modes
interface ThemeStyles {
  light: Partial<ThemeColorPalette>; // Use Partial if not all colors are guaranteed
  dark: Partial<ThemeColorPalette>;
}

// Update the theme structure for ThemeCardProps
interface CommunityTheme {
  id: string;
  name: string;
  community_profile: {
    name?: string | null;
    image?: string | null;
  };
  likes_count: number;
  is_liked: boolean;
  styles: ThemeStyles; // Added styles object
}

// Define the props for the ThemeCard component
interface ThemeCardProps {
  theme: CommunityTheme;
}

// Define swatch definitions, similar to the dashboard card
type SwatchDefinition = {
  name: string;
  bgKey: keyof ThemeColorPalette;
  fgKey: keyof ThemeColorPalette;
};

const swatchDefinitions: SwatchDefinition[] = [
  { name: "Primary", bgKey: "primary", fgKey: "primary-foreground" },
  { name: "Secondary", bgKey: "secondary", fgKey: "secondary-foreground" },
  { name: "Accent", bgKey: "accent", fgKey: "accent-foreground" },
  { name: "Muted", bgKey: "muted", fgKey: "muted-foreground" },
  { name: "Background", bgKey: "background", fgKey: "foreground" },
];

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme }) => {
  // Assuming 'light' mode for community themes, or this could be a prop/context based
  const mode = "light";

  const colorSwatches = useMemo(() => {
    const currentStyles = theme.styles[mode] || {};
    const fallbackForeground = currentStyles.foreground || "#000000";

    return swatchDefinitions.map((def) => ({
      name: def.name,
      bg: currentStyles[def.bgKey] || "#ffffff",
      fg: currentStyles[def.fgKey] || fallbackForeground,
    }));
  }, [theme.styles]); // Mode is hardcoded, so only theme.styles is a dependency

  return (
    <div>
      <Link href={`/community/themes/${theme.id}`} key={theme.id} className="block h-full">
        <Card
          className={cn(
            "group flex h-full min-h-24 overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md"
          )}
        >
          {/* Color Swatches Display */}
          <div className="relative flex h-full w-full overflow-hidden rounded-lg">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.name + swatch.bg}
                className={cn(
                  "relative h-full transition-all duration-200 ease-in-out",
                  swatch.name === "Primary" ? "flex-[2]" : "flex-1"
                )}
                style={{ backgroundColor: swatch.bg }}
              >
                {swatch.name === "Primary" && (
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      "pointer-events-none text-2xl font-bold"
                    )}
                    style={{ color: swatch.fg }}
                  >
                    Aa
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Content Section: Avatar, Theme Name, and Like Button */}
        </Card>
      </Link>
      <div className="bg-background mt-2 flex items-center justify-between py-2">
        {/* Left Side: Avatar and Theme Name */}
        <div className="flex items-center space-x-3">
          {theme.community_profile.image ? (
            <img
              src={theme.community_profile.image}
              alt={theme.community_profile.name || theme.name || "Avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-muted-foreground text-xs">
                {(theme.community_profile.name || theme.name || "U").substring(0, 1).toUpperCase()}
              </span>
            </div>
          )}
          <h3 className={cn("text-foreground line-clamp-1 text-sm font-medium")}>{theme.name}</h3>
        </div>

        {/* Right Side: Like Button */}
        <div>
          <LikeButton
            themeId={theme.id}
            initialIsLiked={theme.is_liked}
            initialLikesCount={theme.likes_count}
          />
        </div>
      </div>
    </div>
  );
};
