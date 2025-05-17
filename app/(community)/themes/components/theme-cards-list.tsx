"use client";

import { useState } from "react";
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
  const [selectedTheme, setSelectedTheme] = useState<CommunityTheme | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleThemeClick = (theme: CommunityTheme) => {
    setSelectedTheme(theme);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <ThemeCard theme={theme} key={theme.id} onClick={() => handleThemeClick(theme)} />
        ))}
      </div>

      <ThemeDialog theme={selectedTheme} open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
