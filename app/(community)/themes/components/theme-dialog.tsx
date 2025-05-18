"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Sun, Moon, Edit, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { useEditorStore } from "@/store/editor-store";
import { ThemeStyles } from "@/types/theme";
import { applyThemeToElement } from "@/utils/apply-theme";
import { defaultThemeState } from "@/config/theme";
import { useOptimisticLike } from "../hooks/use-optimistic-like";

// Define the community theme structure
interface CommunityTheme {
  id: string;
  name: string;
  community_profile: {
    name?: string | null;
    image?: string | null;
  };
  likes_count: number;
  is_liked: boolean;
  styles: ThemeStyles; // Using imported ThemeStyles
}

interface ThemeDialogProps {
  theme: CommunityTheme | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeDialog({ theme, open, onOpenChange }: ThemeDialogProps) {
  const router = useRouter();
  const { themeState, setThemeState, saveThemeCheckpoint } = useEditorStore();
  const [currentMode, setCurrentMode] = useState<"light" | "dark">("light");

  // Ensure theme is not null before calling the hook
  const { optimisticIsLiked, optimisticLikesCount, handleLikeToggle } = useOptimisticLike({
    themeId: theme?.id || "",
    initialIsLiked: theme?.is_liked || false,
    initialLikesCount: theme?.likes_count || 0,
  });

  console.log("optimisticIsLiked", optimisticIsLiked);
  console.log("optimisticLikesCount", optimisticLikesCount);

  const applyThemeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && theme) {
        const styles = { ...defaultThemeState.styles[currentMode], ...theme.styles };
        applyThemeToElement({ ...themeState, styles, currentMode }, node);
      }
    },
    [theme, themeState, currentMode]
  );

  if (!theme) {
    return null;
  }

  const toggleTheme = () => {
    setCurrentMode(currentMode === "light" ? "dark" : "light");
  };

  const handleOpenInEditor = () => {
    // Close the dialog
    onOpenChange(false);

    // Set the theme in editor store
    setThemeState({
      ...themeState,
      styles: theme.styles,
      preset: undefined,
    });
    saveThemeCheckpoint();

    // Navigate to editor
    router.push("/editor/theme");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };

  const handleOptimisticLike = async () => {
    if (!theme) return; // Guard clause if theme is null
    await handleLikeToggle();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={applyThemeRef}
        className="text-foreground flex max-w-5xl flex-col overflow-hidden md:h-[90vh]"
      >
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="bg-muted relative h-12 w-12 overflow-hidden rounded-full">
              {theme.community_profile.image ? (
                <img
                  src={theme.community_profile.image}
                  alt={theme.community_profile.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-lg font-semibold">
                  {theme.community_profile.name?.[0]?.toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold">{theme.name}</h2>
              <p className="text-muted-foreground text-sm">
                {theme.community_profile.name || "Anonymous"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleOptimisticLike}
              className={optimisticIsLiked ? "text-red-500" : ""}
            >
              <Heart className="size-4" fill={optimisticIsLiked ? "currentColor" : "none"} />
              <span className="ml-1">{optimisticLikesCount}</span>
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {currentMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="mr-2 size-4" />
              Share
            </Button>
            <Button variant="default" size="sm" onClick={handleOpenInEditor}>
              <Edit className="mr-2 size-4" />
              Open in Editor
            </Button>
          </div>
        </div>

        <div className="-mx-4 mt-6 -mb-4 flex flex-1 flex-col overflow-hidden">
          <ThemePreviewPanel styles={theme.styles} currentMode={currentMode} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
