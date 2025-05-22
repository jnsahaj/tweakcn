"use client";

import { useState, useEffect, useMemo } from "react";
import { CommunityThemeCard } from "./community-theme-card";
import { CommunityThemePreviewDialog } from "./community-theme-preview-dialog";
import { type CommunityTheme } from "@/types/theme";

interface CommunityThemesListProps {
  themes: CommunityTheme[];
}

export function CommunityThemesList({ themes }: CommunityThemesListProps) {
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <CommunityThemeCard
            theme={theme}
            key={theme.id}
            onClick={() => handleThemeClick(theme)}
          />
        ))}
      </div>

      {currentThemeForDialog && (
        <CommunityThemePreviewDialog
          communityTheme={currentThemeForDialog}
          open={dialogOpen}
          onOpenChange={handleDialogStateChange}
        />
      )}
    </>
  );
}
