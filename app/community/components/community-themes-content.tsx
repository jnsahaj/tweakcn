"use client";

import { useCommunityThemes } from "@/hooks/themes";
import type { CommunitySortOption } from "@/types/community";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CommunityThemeCard } from "./community-theme-card";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions: { value: CommunitySortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

export function CommunityThemesContent() {
  const [sort, setSort] = useState<CommunitySortOption>("popular");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useCommunityThemes(sort);

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  return (
    <div className="space-y-6">
      <Tabs
        value={sort}
        onValueChange={(v) => setSort(v as CommunitySortOption)}
      >
        <TabsList>
          {sortOptions.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-lg" />
          ))}
        </div>
      ) : themes.length === 0 ? (
        <div className="py-20 text-center">
          <h3 className="mb-2 text-lg font-medium">No themes yet</h3>
          <p className="text-muted-foreground">
            Be the first to publish a theme to the community!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme) => (
              <CommunityThemeCard key={theme.id} theme={theme} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
