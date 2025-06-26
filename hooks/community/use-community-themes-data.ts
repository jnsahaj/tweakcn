import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeaturedThemes, getPopularThemes, getCommunityThemesByTag } from "@/actions/community";
import { Theme } from "@/types/theme";

export const communityThemeKeys = {
  all: ["communityThemes"] as const,
  featured: () => [...communityThemeKeys.all, "featured"] as const,
  popular: () => [...communityThemeKeys.all, "popular"] as const,
  byTag: (slug: string) => [...communityThemeKeys.all, "tag", slug] as const,
};

export function useFeaturedCommunityThemes(initialData?: Theme[]) {
  return useQuery({
    queryKey: communityThemeKeys.featured(),
    queryFn: getFeaturedThemes,
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePopularCommunityThemes(initialData?: Theme[]) {
  return useQuery({
    queryKey: communityThemeKeys.popular(),
    queryFn: () => getPopularThemes(50),
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCommunityThemesByTag(tagSlug: string, initialData?: Theme[]) {
  return useQuery({
    queryKey: communityThemeKeys.byTag(tagSlug),
    queryFn: () => getCommunityThemesByTag(tagSlug),
    enabled: !!tagSlug,
    initialData,
    staleTime: 1000 * 60 * 5,
  });
}

export function usePrefetchCommunityThemes() {
  const queryClient = useQueryClient();

  return (tagSlugs: string[]) => {
    tagSlugs.forEach((slug) => {
      queryClient.prefetchQuery({
        queryKey: communityThemeKeys.byTag(slug),
        queryFn: () => getCommunityThemesByTag(slug),
        staleTime: 1000 * 60 * 5,
      });
    });
  };
}
