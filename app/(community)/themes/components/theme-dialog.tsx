"use client";

import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share, Sun, Moon, MoreVertical, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { useEditorStore } from "@/store/editor-store";
import { ThemeStyles } from "@/types/theme";
import { applyThemeToElement } from "@/utils/apply-theme";

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

  const applyThemeRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && theme) {
        applyThemeToElement({ ...themeState, styles: theme.styles }, node);
      }
    },
    [theme, open, themeState]
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={applyThemeRef}
        className="flex max-h-[90vh] max-w-4xl flex-col overflow-hidden"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{theme.name}</DialogTitle>
          <div className="mt-2 flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {currentMode === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            <Button variant="outline" size="default" onClick={handleShare}>
              <Share className="mr-2 size-4" />
              Share
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="gap-2" onClick={handleOpenInEditor}>
                  <Edit className="size-4" />
                  Open in Editor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </DialogHeader>

        <div className="-mx-4 mt-6 -mb-4 flex flex-1 flex-col overflow-hidden">
          <ThemePreviewPanel styles={theme.styles} currentMode={currentMode} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
