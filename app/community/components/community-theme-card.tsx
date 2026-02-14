"use client";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import { useToggleLike } from "@/hooks/themes";
import { useSessionGuard } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import Link from "next/link";
import { ThemePreview } from "@/components/theme-preview";
import type { CommunityTheme } from "@/types/community";

interface CommunityThemeCardProps {
  theme: CommunityTheme;
}

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
    <Link href={`/themes/${theme.themeId}`} className="group">
      <div className="relative h-44 w-full overflow-hidden rounded-xl border shadow-sm transition-all duration-200 group-hover:shadow-md group-hover:border-foreground/20">
        <ThemePreview
          styles={theme.styles[currentTheme]}
          name={theme.name}
          className="transition-transform duration-300 group-hover:scale-102"
        />
        {theme.tags.length > 0 && (
          <div className="pointer-events-none absolute top-2 left-2 flex items-center gap-1">
            {theme.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                className="border-0 bg-background/80 px-1.5 py-0 text-[10px] text-foreground shadow-sm backdrop-blur-sm"
              >
                {tag}
              </Badge>
            ))}
            {theme.tags.length > 2 && (
              <Badge className="border-0 bg-background/80 px-1.5 py-0 text-[10px] text-foreground shadow-sm backdrop-blur-sm">
                +{theme.tags.length - 2}
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-2 px-1 pt-2">
        <div className="min-w-0 flex-1">
          <div className="mt-1 flex items-center gap-3">
            <div className="flex min-w-0 max-w-[120px] items-center gap-1.5">
              <Avatar className="h-4 w-4 shrink-0">
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
              <span className="truncate text-xs text-muted-foreground">
                {theme.author.name}
              </span>
            </div>
            <span className="text-xs text-muted-foreground/60">
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
    </Link>
  );
}
