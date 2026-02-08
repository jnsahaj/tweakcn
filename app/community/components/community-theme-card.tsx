"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useMemo } from "react";
import { useTheme } from "@/components/theme-provider";
import { useToggleLike } from "@/hooks/themes";
import { useSessionGuard } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import Link from "next/link";
import type { CommunityTheme } from "@/types/community";
import type { ThemeStyleProps } from "@/types/theme";

interface CommunityThemeCardProps {
  theme: CommunityTheme;
}

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

export function CommunityThemeCard({ theme }: CommunityThemeCardProps) {
  const { theme: currentTheme } = useTheme();
  const toggleLike = useToggleLike();
  const { checkValidSession } = useSessionGuard();

  usePostLoginAction("LIKE_THEME", (data?: { communityThemeId: string }) => {
    if (data?.communityThemeId === theme.id) {
      toggleLike.mutate(theme.id);
    }
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      !checkValidSession("signin", "LIKE_THEME", {
        communityThemeId: theme.id,
      })
    ) {
      return;
    }

    toggleLike.mutate(theme.id);
  };

  const colorSwatches = useMemo(() => {
    return swatchDefinitions.map((def) => ({
      name: def.name,
      bg: theme.styles[currentTheme][def.bgKey] || "#ffffff",
      fg:
        theme.styles[currentTheme][def.fgKey] ||
        theme.styles[currentTheme].foreground ||
        "#000000",
    }));
  }, [theme.styles, currentTheme]);

  const authorInitials = theme.author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const publishedDate = new Date(theme.publishedAt).toLocaleDateString(
    "en-US",
    { day: "numeric", month: "short" }
  );

  return (
    <Link href={`/themes/${theme.themeId}`}>
      <Card className="group overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md hover:border-foreground/20">
        <div className="relative flex h-36">
          {colorSwatches.map((swatch) => (
            <div
              key={swatch.name + swatch.bg}
              className={cn(
                "group/swatch relative h-full flex-1 transition-all duration-300 ease-in-out",
                "hover:flex-grow-[1.5]"
              )}
              style={{ backgroundColor: swatch.bg }}
            >
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  "opacity-0 group-hover/swatch:opacity-100",
                  "transition-opacity duration-300 ease-in-out",
                  "pointer-events-none text-xs font-medium"
                )}
                style={{ color: swatch.fg }}
              >
                {swatch.name}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-foreground truncate text-sm font-semibold">
                {theme.name}
              </h3>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-4 w-4">
                    {theme.author.image && (
                      <AvatarImage
                        src={theme.author.image}
                        alt={theme.author.name}
                      />
                    )}
                    <AvatarFallback className="text-[8px]">
                      {authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground truncate text-xs">
                    {theme.author.name}
                  </span>
                </div>
                <span className="text-muted-foreground/60 text-xs">
                  {publishedDate}
                </span>
              </div>
            </div>
            <button
              onClick={handleLike}
              className={cn(
                "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                theme.isLikedByMe
                  ? "bg-red-500/10 text-red-500"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Heart
                className={cn(
                  "h-3.5 w-3.5",
                  theme.isLikedByMe && "fill-current"
                )}
              />
              {theme.likeCount > 0 && <span>{theme.likeCount}</span>}
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
