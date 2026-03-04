"use client";

import { lazy, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { useToggleLike } from "@/hooks/themes";
import { useSessionGuard } from "@/hooks/use-guards";
import { usePostLoginAction } from "@/hooks/use-post-login-action";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExamplesPreviewContainer from "@/components/editor/theme-preview/examples-preview-container";
import { Heart, Moon, Sun, ArrowUpRight, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import type { CommunityTheme } from "@/types/community";

const DemoCards = lazy(() => import("@/components/examples/cards"));

interface CommunityThemePreviewDialogProps {
  theme: CommunityTheme | null;
  themes: CommunityTheme[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (theme: CommunityTheme) => void;
}

export function CommunityThemePreviewDialog({
  theme,
  themes,
  open,
  onOpenChange,
  onNavigate,
}: CommunityThemePreviewDialogProps) {
  const router = useRouter();
  const { themeState, setThemeState } = useEditorStore();
  const toggleLike = useToggleLike();
  const { checkValidSession } = useSessionGuard();

  const currentIndex = theme ? themes.findIndex((t) => t.id === theme.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < themes.length - 1;

  const goToPrev = useCallback(() => {
    if (hasPrev) onNavigate(themes[currentIndex - 1]);
  }, [hasPrev, themes, currentIndex, onNavigate]);

  const goToNext = useCallback(() => {
    if (hasNext) onNavigate(themes[currentIndex + 1]);
  }, [hasNext, themes, currentIndex, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrev, goToNext]);

  usePostLoginAction("LIKE_THEME", (data?: { communityThemeId: string }) => {
    if (theme && data?.communityThemeId === theme.id) {
      toggleLike.mutate(theme.id);
    }
  });

  if (!theme) return null;

  const currentMode = themeState.currentMode;

  const handleToggleTheme = () => {
    setThemeState({
      ...themeState,
      currentMode: currentMode === "light" ? "dark" : "light",
    });
  };

  const handleLike = () => {
    if (
      !checkValidSession("signin", "LIKE_THEME", {
        communityThemeId: theme.id,
      })
    ) {
      return;
    }
    toggleLike.mutate(theme.id);
  };

  const handleViewDetails = () => {
    onOpenChange(false);
    router.push(`/themes/${theme.themeId}`);
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.themeId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };

  const authorInitials = theme.author.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-[80vh] w-[95vw] max-w-6xl flex-col gap-0 overflow-visible p-0"
        style={{
          "--tw-enter-translate-x": "0",
          "--tw-enter-translate-y": "0",
          "--tw-exit-translate-x": "0",
          "--tw-exit-translate-y": "0",
        } as React.CSSProperties}
      >
        {/* Navigation arrows — positioned outside the dialog box */}
        {hasPrev && (
          <button
            onClick={goToPrev}
            className="absolute -left-14 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
            aria-label="Previous theme"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={goToNext}
            className="absolute -right-14 top-1/2 -translate-y-1/2 rounded-full border bg-background/80 p-2 text-foreground shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:scale-110"
            aria-label="Next theme"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
        {/* Inner content wrapper — clips content within dialog bounds */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">
          {/* Header: name + author */}
          <DialogHeader className="shrink-0 px-4 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-base font-semibold">
                {theme.name}
              </DialogTitle>
              <span className="text-muted-foreground/40">|</span>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Avatar className="h-5 w-5">
                  {theme.author.image && (
                    <AvatarImage
                      src={theme.author.image}
                      alt={theme.author.name}
                    />
                  )}
                  <AvatarFallback className="text-[9px]">
                    {authorInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{theme.author.name}</span>
              </div>
            </div>
          </DialogHeader>

          {/* Toolbar */}
          <div className="flex shrink-0 items-center justify-between px-4 py-1">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
              Preview
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
                  theme.isLikedByMe
                    ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
                title={theme.isLikedByMe ? "Unlike theme" : "Like theme"}
              >
                <Heart
                  className={cn(
                    "size-4",
                    theme.isLikedByMe && "fill-current"
                  )}
                />
                {theme.likeCount > 0 && <span>{theme.likeCount}</span>}
              </button>
              <button
                onClick={handleShare}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Share theme"
              >
                <Share2 className="size-4" />
              </button>
              <button
                onClick={handleToggleTheme}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                title="Toggle light/dark mode"
              >
                {currentMode === "dark" ? (
                  <Sun className="size-4" />
                ) : (
                  <Moon className="size-4" />
                )}
              </button>
              <div className="h-4 w-px bg-border mr-2" />
              <Button variant="link" className="p-0 text-foreground font-semibold" onClick={handleViewDetails}>
                View
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Card preview — scrollable */}
          <div className="min-h-0 flex-1">
            <ScrollArea className="h-full">
              <ExamplesPreviewContainer className="size-full">
                <DemoCards />
              </ExamplesPreviewContainer>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
