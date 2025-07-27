import { PaginatedFontsResponse, type FontCategory } from "@/types/fonts";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FilterFontCategory = "all" | FontCategory;

interface UseFontSearchParams {
  query: string;
  category?: FilterFontCategory;
  limit?: number;
  enabled?: boolean;
}

export function useFontSearch({
  query,
  category = "all",
  limit = 20,
  enabled = true,
}: UseFontSearchParams) {
  return useInfiniteQuery({
    queryKey: ["fonts", query, category],
    queryFn: async ({ pageParam }) => {
      const offset = pageParam || 0;
      const searchParams = new URLSearchParams({
        q: query,
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (category && category !== "all") {
        searchParams.append("category", category);
      }

      const response = await fetch(`/api/google-fonts?${searchParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch fonts");
      }

      return response.json() as Promise<PaginatedFontsResponse>;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
    enabled,
  });
}
