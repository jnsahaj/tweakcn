import { usePaginatedQuery } from "@/hooks/use-paginated-query";
import { getFeaturedThemes, getPopularThemes, getCommunityThemesByTag } from "@/actions/community";

export const communityThemeKeys = {
  all: ["communityThemes"] as const,
  featured: () => [...communityThemeKeys.all, "featured"] as const,
  popular: () => [...communityThemeKeys.all, "popular"] as const,
  byTag: (slug: string) => [...communityThemeKeys.all, "tag", slug] as const,
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
