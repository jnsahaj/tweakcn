import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getThemes, getTheme } from "@/actions/themes";
import { Theme } from "@/types/theme";

export type ThemeWithPublished = Awaited<ReturnType<typeof getThemes>>[number];

export const themeKeys = {
  all: ["themes"] as const,
  lists: () => [...themeKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...themeKeys.lists(), { filters }] as const,
  details: () => [...themeKeys.all, "detail"] as const,
  detail: (id: string) => [...themeKeys.details(), { id }] as const,
};

export function useThemesData(initialData?: ThemeWithPublished[]) {
  return useQuery({
    queryKey: themeKeys.lists(),
    queryFn: getThemes,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useThemeData(themeId: string | null, initialData?: Theme) {
  return useQuery({
    queryKey: themeKeys.detail(themeId!),
    queryFn: () => getTheme(themeId!),
    enabled: !!themeId,
    initialData,
    staleTime: 1000 * 60 * 10, // 10 minutes for individual themes
  });
}

export function usePrefetchThemes() {
  const queryClient = useQueryClient();

  return (themeIds: string[]) => {
    themeIds.forEach((id) => {
      queryClient.prefetchQuery({
        queryKey: themeKeys.detail(id),
        queryFn: () => getTheme(id),
        staleTime: 1000 * 60 * 10,
      });
    });
  };
}
