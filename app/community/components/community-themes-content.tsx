"use client";

import { useCommunityThemes } from "@/hooks/themes";
import type { CommunitySortOption } from "@/types/community";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Flame, Clock, Loader2, Palette } from "lucide-react";
import { CommunityThemeCard } from "./community-theme-card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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

function ThemeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border">
      <Skeleton className="h-36 rounded-none" />
      <div className="space-y-2.5 p-3">
        <Skeleton className="h-4 w-3/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-4 rounded-full" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}

export function CommunityThemesContent() {
  const [sort, setSort] = useState<CommunitySortOption>("popular");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCommunityThemes(sort);

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        {!isLoading && themes.length > 0 && (
          <p className="text-muted-foreground hidden text-sm sm:block">
            {themes.length} theme{themes.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ThemeCardSkeleton key={i} />
          ))}
        </div>
      ) : themes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-24">
          <div className="bg-muted mb-5 flex size-14 items-center justify-center rounded-full">
            <Palette className="text-muted-foreground size-6" />
          </div>
          <h3 className="mb-1.5 text-lg font-semibold">No themes yet</h3>
          <p className="text-muted-foreground mx-auto mb-6 max-w-xs text-center text-sm leading-relaxed">
            Be the first to share a theme with the community. Create one in the
            editor and publish it.
          </p>
          <Button asChild size="sm">
            <Link href="/editor/theme">Create a theme</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {themes.map((theme) => (
              <CommunityThemeCard key={theme.id} theme={theme} />
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load more themes"
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
