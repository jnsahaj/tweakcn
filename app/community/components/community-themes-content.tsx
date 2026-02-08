"use client";

import { useCommunityThemes } from "@/hooks/themes";
import type { CommunitySortOption } from "@/types/community";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Flame, Clock, Loader2, Info } from "lucide-react";
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

export function CommunityThemesContent() {
  const [sort, setSort] = useState<CommunitySortOption>("popular");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCommunityThemes(sort);

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSort(option.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                sort === option.value
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              )}
            >
              {option.icon}
              {option.label}
            </button>
          ))}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-1.5 text-xs"
            >
              <Info className="size-3.5" />
              <span className="hidden sm:inline">How to publish</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-0">
            <div className="p-4">
              <p className="text-sm font-medium">Publish your theme</p>
              <p className="text-muted-foreground mt-1.5 text-xs leading-relaxed">
                After saving a theme, click the{" "}
                <span className="text-foreground font-medium">
                  Publish
                </span>{" "}
                button in the editor to share it.
              </p>
            </div>
            <Separator />
            <div className="p-4">
              <p className="text-muted-foreground text-xs leading-relaxed">
                You can also manage all your saved themes from{" "}
                <Link
                  href="/settings/themes"
                  className="text-foreground font-medium underline underline-offset-2"
                >
                  Settings
                </Link>
                .
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="space-y-0 overflow-hidden rounded-xl border"
            >
              <Skeleton className="h-36 rounded-none" />
              <div className="space-y-2 p-3">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : themes.length === 0 ? (
        <div className="py-24 text-center">
          <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
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
