"use client";

import { useState, useEffect, useMemo } from "react";
import { ThemeCard } from "./theme-card";
import { ThemeDialog } from "./theme-dialog";
import { ThemeStyles } from "@/types/theme";

interface CommunityTheme {
  id: string;
  name: string;
  community_profile: {
    name?: string | null;
    image?: string | null;
  };
  likes_count: number;
  is_liked: boolean;
  styles: ThemeStyles;
}

interface ThemeCardsListProps {
  themes: CommunityTheme[];
}

export function ThemeCardsList({ themes }: ThemeCardsListProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentThemeForDialog = useMemo(() => {
    if (!selectedThemeId) {
      return null;
    }
    return themes.find((theme) => theme.id === selectedThemeId) || null;
  }, [themes, selectedThemeId]);

  useEffect(() => {
    if (dialogOpen && selectedThemeId && !currentThemeForDialog) {
      setDialogOpen(false);
      setSelectedThemeId(null);
    }
  }, [dialogOpen, selectedThemeId, currentThemeForDialog]);

  const handleThemeClick = (theme: CommunityTheme) => {
    setSelectedThemeId(theme.id);
    setDialogOpen(true);
  };

  const handleDialogStateChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedThemeId(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard theme={theme} key={theme.id} onClick={() => handleThemeClick(theme)} />
        ))}
      </div>

      <ThemeDialog
        theme={currentThemeForDialog}
        open={dialogOpen}
        onOpenChange={handleDialogStateChange}
      />
    </>
  );
}
