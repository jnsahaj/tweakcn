import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publishThemeToCommunity, addTagsToTheme, toggleThemeLike } from "@/actions/community";
import { communityThemeKeys } from "./use-community-themes-data";
import { toast } from "@/components/ui/use-toast";

function handleCommunityError(error: Error, operation: string) {
  console.error(`Community theme ${operation} error:`, error);
  toast({
    title: `Failed to ${operation} theme`,
    description: error.message || "An error occurred",
    variant: "destructive",
  });
}

export function usePublishThemeToCommunity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { themeId: string; tags?: string[] }) => publishThemeToCommunity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityThemeKeys.featured() });
      queryClient.invalidateQueries({ queryKey: communityThemeKeys.popular() });
      toast({ title: "Theme published", description: "Theme is now in the community!" });
    },
    onError: (error) => handleCommunityError(error as Error, "publish"),
  });
}

export function useAddTagsToTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { themeId: string; tags: string[] }) => addTagsToTheme(data),
    onSuccess: (_data, variables) => {
      // Invalidate tag related cache
      variables.tags.forEach((slug) =>
        queryClient.invalidateQueries({ queryKey: communityThemeKeys.byTag(slug) })
      );
      toast({ title: "Tags added", description: "Tags have been added to your theme." });
    },
    onError: (error) => handleCommunityError(error as Error, "tag"),
  });
}

export function useToggleThemeLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (themeId: string) => toggleThemeLike({ themeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityThemeKeys.popular() });
    },
    onError: (error) => handleCommunityError(error as Error, "like/unlike"),
  });
}
