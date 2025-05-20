"use client";

import { Theme } from "@/types/theme"; // Assuming Theme type includes foreground colors
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  Zap,
  ExternalLink,
  Copy,
  Share, // Added for Publish
} from "lucide-react";
import { useMemo } from "react"; // Removed useState
import { useEditorStore } from "@/store/editor-store";
import { useThemeActions } from "@/hooks/use-theme-actions";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import SubmitCommunityThemeForm from "./submit-community-theme-form"; // Import the form
// import { createCommunityTheme } from "@/actions/community-themes"; // Removed import
import { useSubmitCommunityTheme } from "../hooks/use-submit-community-theme"; // Import the hook

interface ThemeCardProps {
  theme: Theme;
  className?: string;
}

type SwatchDefinition = {
  name: string; // Text to display on hover
  bgKey: keyof Theme["styles"]["light" | "dark"]; // Key for background color
  fgKey: keyof Theme["styles"]["light" | "dark"]; // Key for text color
};

const swatchDefinitions: SwatchDefinition[] = [
  { name: "Primary", bgKey: "primary", fgKey: "primary-foreground" },
  { name: "Secondary", bgKey: "secondary", fgKey: "secondary-foreground" },
  { name: "Accent", bgKey: "accent", fgKey: "accent-foreground" },
  { name: "Muted", bgKey: "muted", fgKey: "muted-foreground" },
  // Special case: Background swatch shows "Foreground" text using the main foreground color
  { name: "Background", bgKey: "background", fgKey: "foreground" },
];

export function ThemeCard({ theme, className }: ThemeCardProps) {
  const { themeState, setThemeState } = useEditorStore();
  const { deleteTheme, isDeletingTheme } = useThemeActions();
  const mode = themeState.currentMode;

  // Instantiate the hook
  const {
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    handleSubmit: handlePublishSubmit, // Renaming to match existing prop name
  } = useSubmitCommunityTheme({ theme });

  const handleDelete = () => {
    deleteTheme(theme.id);
  };

  // Removed old handlePublishSubmit function

  const handleQuickApply = () => {
    setThemeState({
      ...themeState,
      styles: theme.styles,
    });
  };

  const handleShare = () => {
    const url = `https://tweakcn.com/themes/${theme.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Theme URL copied to clipboard!",
    });
  };

  const colorSwatches = useMemo(() => {
    return swatchDefinitions.map((def) => ({
      name: def.name,
      // Get background color, fallback to a default if necessary (e.g., white)
      bg: theme.styles[mode][def.bgKey] || "#ffffff",
      // Get foreground color, fallback to main foreground or a default (e.g., black)
      fg:
        theme.styles[mode][def.fgKey] ||
        theme.styles[mode].foreground ||
        "#000000",
    }));
  }, [mode, theme.styles]);

  return (
    <Card
      className={cn(
        "group overflow-hidden border shadow-sm hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="flex h-36 relative">
        {colorSwatches.map((swatch) => (
          <div
            // Use a combination for a more robust key
            key={swatch.name + swatch.bg}
            className={cn(
              "group/swatch relative flex-1 h-full transition-all duration-300 ease-in-out",
              "hover:flex-grow-[1.5]"
            )}
            style={{ backgroundColor: swatch.bg }}
          >
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover/swatch:opacity-100",
                "transition-opacity duration-300 ease-in-out",
                "text-xs font-medium pointer-events-none"
              )}
              style={{ color: swatch.fg }}
            >
              {swatch.name}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 flex items-center justify-between bg-background">
        <div>
          <h3 className={cn("text-sm font-medium text-foreground")}>
            {theme.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {new Date(theme.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="p-2 hover:bg-accent rounded-md">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover">
              <DropdownMenuItem onClick={handleQuickApply} className="gap-2">
                <Zap className="h-4 w-4" />
                Quick Apply
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2">
                <Link href={`/themes/${theme.id}`} target="_blank">
                  <ExternalLink className="h-4 w-4" />
                  Open Theme
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2">
                <Link href={`/editor/theme/${theme.id}`}>
                  <Edit className="h-4 w-4" />
                  Edit Theme
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="gap-2">
                <Copy className="h-4 w-4" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuSeparator className="mx-2" />
              <DialogTrigger asChild>
                <DropdownMenuItem className="gap-2">
                  <Share className="h-4 w-4" />
                  Publish to Community
                </DropdownMenuItem>
              </DialogTrigger>
              <DropdownMenuSeparator className="mx-2" />
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive gap-2 focus:text-destructive"
                disabled={isDeletingTheme}
              >
                {isDeletingTheme ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete Theme
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <SubmitCommunityThemeForm
            onSubmit={handlePublishSubmit}
            isLoading={isLoading}
          />
        </Dialog>
      </div>
    </Card>
  );
}
              className="text-destructive gap-2 focus:text-destructive"
              disabled={isDeletingTheme}
            >
              {isDeletingTheme ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Delete Theme
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
