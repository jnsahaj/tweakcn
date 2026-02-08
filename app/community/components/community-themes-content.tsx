"use client";

import { useCommunityThemes } from "@/hooks/themes";
import type { CommunitySortOption } from "@/types/community";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Loader2 } from "lucide-react";
import { CommunityThemeCard } from "./community-theme-card";
import { Skeleton } from "@/components/ui/skeleton";

const sortOptions: {
  value: CommunitySortOption;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "popular", label: "Popular", icon: <Flame className="size-3.5" /> },
  {
    value: "newest",
    label: "Newest",
    icon: <Clock className="size-3.5" />,
  },
  {
    value: "oldest",
    label: "Oldest",
    icon: <Clock className="size-3.5" />,
  },
];

export function CommunityThemesContent() {
  const [sort, setSort] = useState<CommunitySortOption>("popular");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCommunityThemes(sort);

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  return (
    <div className="space-y-8">
      <Tabs
        value={sort}
        onValueChange={(v) => setSort(v as CommunitySortOption)}
      >
        <TabsList>
          {sortOptions.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              className="gap-1.5"
            >
              {option.icon}
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-0 overflow-hidden rounded-lg border">
              <Skeleton className="h-32 rounded-none" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : themes.length === 0 ? (
        <div className="py-24 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <Flame className="text-muted-foreground size-8" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No themes yet</h3>
          <p className="text-muted-foreground mx-auto max-w-sm">
            Be the first to publish a theme to the community! Save a theme in
            the editor, then publish it from your settings.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme) => (
              <CommunityThemeCard key={theme.id} theme={theme} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
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
