import { PaginatedFontsResponse, type GoogleFontCategory } from "@/types/fonts";
import { useInfiniteQuery } from "@tanstack/react-query";

export type FontCategory = "all" | GoogleFontCategory;

interface UseFontSearchParams {
  query: string;
  category?: FontCategory;
  limit?: number;
}

export function useFontSearch({ query, category = "all", limit = 20 }: UseFontSearchParams) {
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
  });
}
