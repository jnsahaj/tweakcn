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
import { MoreVertical, Trash2, Edit, Loader2, Zap, ExternalLink, Copy } from "lucide-react";
import { useMemo } from "react";
import { useEditorStore } from "@/store/editor-store";
import { useDeleteTheme } from "@/hooks/themes";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
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
  const deleteThemeMutation = useDeleteTheme();
  const mode = themeState.currentMode;

  const handleDelete = () => {
    deleteThemeMutation.mutate(theme.id);
  };

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
      fg: theme.styles[mode][def.fgKey] || theme.styles[mode].foreground || "#000000",
    }));
  }, [mode, theme.styles]);

  return (
    <Card
      className={cn(
        "group overflow-hidden border shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      <div className="relative flex h-36">
        {colorSwatches.map((swatch) => (
          <div
            // Use a combination for a more robust key
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

      <div className="bg-background flex items-center justify-between p-4">
        <div>
          <h3 className={cn("text-foreground text-sm font-medium")}>{theme.name}</h3>
          <p className="text-muted-foreground text-xs">
            {new Date(theme.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="hover:bg-accent rounded-md p-2">
              <MoreVertical className="text-muted-foreground h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover w-48">
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
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive gap-2"
              disabled={deleteThemeMutation.isPending}
            >
              {deleteThemeMutation.isPending ? (
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
