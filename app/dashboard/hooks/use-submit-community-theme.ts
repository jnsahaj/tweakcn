import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { createCommunityTheme } from "@/actions/community-themes";
import { getMyCommunityProfile } from "@/actions/community-profiles";
import { Theme } from "@/types/theme";

interface UseSubmitCommunityThemeProps {
  theme: Theme;
}

export const useSubmitCommunityTheme = ({
  theme,
}: UseSubmitCommunityThemeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (submittedThemeName: string) => {
    setIsLoading(true);
    try {
      // Fetch Community Profile ID
      const profileResult = await getMyCommunityProfile();
      if (!profileResult.success || !profileResult.profile?.id) {
        toast({
          title: "Error",
          description:
            profileResult.error ||
            "Could not fetch your community profile. Please ensure you have a community profile created and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      const communityProfileId = profileResult.profile.id;

      // Prepare form data
      const formData = {
        community_profile_id: communityProfileId,
        name: submittedThemeName,
        styles: theme.styles,
      };

      // Call createCommunityTheme
      const result = await createCommunityTheme(formData);

      if (result.success) {
        toast({
          title: "Theme Submitted!",
          description: `Theme "${submittedThemeName}" has been submitted for review.`,
        });
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Failed to Submit Theme",
          description: result.error || "An unknown error occurred.",
          variant: "destructive",
        });
        // Removed console.error for result.details
      }
    } catch (error) {
      // Removed console.error for caught error
      toast({
        title: "Unexpected Error",
        description: "An unexpected error occurred while submitting the theme. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDialogOpen,
    setIsDialogOpen,
    isLoading,
    handleSubmit,
  };
};
