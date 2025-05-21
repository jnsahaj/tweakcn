import { useState } from "react";
import { createCommunityTheme } from "@/actions/community-themes";
import { getMyCommunityProfile } from "@/actions/community-profiles";
import { useEditorStore } from "@/store/editor-store";
import { toast } from "@/components/ui/use-toast";
import { ThemeStyles } from "@/types/theme";

export interface SubmitCommunityThemeFormControl {
  isOpen: boolean;
  isLoading: boolean;
  themeName: string;
  actions: {
    open: () => void;
    close: () => void;
    setThemeName: (name: string) => void;
    submit: () => Promise<void>;
  };
}

export function useSubmitCommunityThemeForm(): SubmitCommunityThemeFormControl {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [themeName, setThemeName] = useState("");
  const { themeState } = useEditorStore();

  const handleSubmit = async () => {
    if (!themeName.trim()) {
      toast({
        title: "Error",
        description: "Theme name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const profile = await getMyCommunityProfile();
      if (!profile) {
        toast({
          title: "Error",
          description: "You need to create a community profile first",
          variant: "destructive",
        });
        return;
      }

      const result = await createCommunityTheme({
        community_profile_id: profile.id,
        name: themeName.trim(),
        styles: themeState.styles as ThemeStyles,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit theme");
      }

      toast({
        title: "Success",
        description: "Your theme has been submitted for review",
      });
      setIsOpen(false);
      setThemeName("");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit theme",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    isLoading,
    themeName,
    actions: {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      setThemeName,
      submit: handleSubmit,
    },
  };
}
