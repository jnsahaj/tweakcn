import { Card } from "@/components/ui/card";
import { LikeButton } from "./like-button";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { type CommunityTheme, type ThemeStyleProps } from "@/types/theme";

// Define swatch definitions
type SwatchDefinition = {
  name: string;
  bgKey: keyof ThemeStyleProps;
  fgKey: keyof ThemeStyleProps;
};

const swatchDefinitions: SwatchDefinition[] = [
  { name: "Primary", bgKey: "primary", fgKey: "primary-foreground" },
  { name: "Secondary", bgKey: "secondary", fgKey: "secondary-foreground" },
  { name: "Accent", bgKey: "accent", fgKey: "accent-foreground" },
  { name: "Muted", bgKey: "muted", fgKey: "muted-foreground" },
  { name: "Background", bgKey: "background", fgKey: "foreground" },
];

// Define the props for the ThemeCard component
interface CommunityThemeCardProps {
  theme: CommunityTheme;
  onClick?: (theme: CommunityTheme) => void;
}

export const CommunityThemeCard: React.FC<CommunityThemeCardProps> = ({ theme, onClick }) => {
  // Assuming 'light' mode for community themes, or this could be a prop/context based
  const mode = "light";

  const colorSwatches = useMemo(() => {
    const currentStyles = theme.theme.styles[mode] || {};
    const fallbackForeground = currentStyles.foreground || "#000000";

    return swatchDefinitions.map((def) => ({
      name: def.name,
      bg: currentStyles[def.bgKey] || "#ffffff",
      fg: currentStyles[def.fgKey] || fallbackForeground,
    }));
  }, [theme.theme.styles]); // Mode is hardcoded, so only theme.styles is a dependency

  const handleClick = () => {
    if (onClick) {
      onClick(theme);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="block cursor-pointer" onClick={handleClick}>
        <Card
          className={cn(
            "group flex h-full min-h-48 overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md"
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
      </div>
      <div className="bg-background mt-2 flex items-center justify-between py-2">
        {/* Left Side: Avatar and Theme Name */}
        <div className="flex items-center space-x-3">
          {theme.community_profile.image ? (
            <img
              src={theme.community_profile.image}
              alt={theme.community_profile.name || "Avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
              <span className="text-muted-foreground text-xs">
                {(theme.community_profile.name || "U").substring(0, 1).toUpperCase()}
              </span>
            </div>
          )}
          <h3 className={cn("text-foreground line-clamp-1 text-sm font-medium")}>
            {theme.theme.name}
          </h3>
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
