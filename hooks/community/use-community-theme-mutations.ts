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
    onMutate: async (themeId: string) => {
      // Cancel any outgoing refetches for this theme so we don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: communityThemeKeys.detail(themeId) });
      const previousTheme = queryClient.getQueryData<any>(communityThemeKeys.detail(themeId));

      // Optimistically update the cache
      queryClient.setQueryData<any>(communityThemeKeys.detail(themeId), (old: any) => {
        if (!old) return old;

        const liked = (old as any).liked ?? false;
        const likeCount = (old as any).likeCount ?? 0;

        return {
          ...old,
          liked: !liked,
          likeCount: likeCount + (liked ? -1 : 1),
        };
      });

      return { previousTheme };
    },
    onError: (error, themeId, context: { previousTheme: any } | undefined) => {
      if (context?.previousTheme) {
        queryClient.setQueryData(communityThemeKeys.detail(themeId), context.previousTheme);
      }
      handleCommunityError(error as Error, "like/unlike");
    },
  });
}
