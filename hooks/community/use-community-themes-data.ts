import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { getFeaturedThemes, getPopularThemes, getCommunityThemesByTag } from "@/actions/community";

export const communityThemeKeys = {
  all: ["communityThemes"] as const,
  lists: () => [...communityThemeKeys.all, "list"] as const,
  featured: () => [...communityThemeKeys.lists(), "featured"] as const,
  popular: () => [...communityThemeKeys.lists(), "popular"] as const,
  byTag: (slug: string) => [...communityThemeKeys.lists(), "tag", slug] as const,
  details: () => [...communityThemeKeys.all, "detail"] as const,
  detail: (id: string) => [...communityThemeKeys.details(), id] as const,
};

export function useFeaturedCommunityThemes() {
  return usePaginatedQuery(communityThemeKeys.featured(), getFeaturedThemes);
}

export function usePopularCommunityThemes() {
  return usePaginatedQuery(communityThemeKeys.popular(), getPopularThemes);
}

export function useCommunityThemesByTag(tagSlug: string) {
  return usePaginatedQuery(communityThemeKeys.byTag(tagSlug), (limit, cursor) =>
    getCommunityThemesByTag(tagSlug, limit, cursor)
  );
}
