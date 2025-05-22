import { useState } from "react";
import { createCommunityTheme } from "@/actions/community-themes";
import { getMyCommunityProfile } from "@/actions/community-profiles";
import { toast } from "@/components/ui/use-toast";
import { Theme, ThemeStyles } from "@/types/theme";

export interface SubmitCommunityThemeFormControl {
  isOpen: boolean;
  isLoading: boolean;
  actions: {
    open: () => void;
    close: () => void;
    submit: (themeName: string) => Promise<void>;
  };
}

export function useSubmitCommunityThemeForm(theme: Theme): SubmitCommunityThemeFormControl {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (themeName: string) => {
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
        styles: theme.styles as ThemeStyles,
      });

      if (!result.success) {
        throw new Error(result.error || "Failed to submit theme");
      }

      toast({
        title: "Success",
        description: "Your theme has been submitted for review",
      });
      setIsOpen(false);
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
    actions: {
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      submit: handleSubmit,
    },
  };
}
