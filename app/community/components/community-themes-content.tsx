"use client";

import { useCommunityThemes } from "@/hooks/themes";
import type {
  CommunitySortOption,
  CommunityFilterOption,
} from "@/types/community";
import {
  useQueryState,
  parseAsStringLiteral,
  parseAsArrayOf,
  parseAsString,
} from "nuqs";
import { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Flame, Loader2, Info, SlidersHorizontal } from "lucide-react";
import { CommunityThemeCard } from "./community-theme-card";
import { CommunitySidebarContent } from "./community-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

const sortOptions: {
  value: CommunitySortOption;
  label: string;
}[] = [
    { value: "popular", label: "Popular" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];

export function CommunityThemesContent() {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsStringLiteral(["popular", "newest", "oldest"] as const).withDefault(
      "popular"
    )
  );
  const [filter, setFilter] = useQueryState(
    "filter",
    parseAsStringLiteral(["all", "mine", "liked"] as const).withDefault("all")
  );
  const [tags, setTags] = useQueryState(
    "tags",
    parseAsArrayOf(parseAsString, ",").withDefault([])
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleFilterChange = useCallback(
    (newFilter: CommunityFilterOption) => {
      setFilter(newFilter);
      setSheetOpen(false);
    },
    [setFilter]
  );

  const handleTagToggle = useCallback(
    (tag: string) => {
      setTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
      );
    },
    [setTags]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useCommunityThemes(sort, filter, tags);

  const themes = data?.pages.flatMap((page) => page.themes) ?? [];

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const hasActiveFilters = filter !== "all" || tags.length > 0;

  const sidebarProps = {
    filter,
    selectedTags: tags,
    onFilterChange: handleFilterChange,
    onTagToggle: handleTagToggle,
  };

  return (
    <div className="flex flex-1">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 border-r lg:block">
        <div className="p-4">
          <Link href="/community" className="block">
            <h1 className="text-lg font-semibold tracking-tight">
              Community Themes
            </h1>
            <p className="text-muted-foreground mt-1 text-xs">
              Discover themes by the community
            </p>
          </Link>
        </div>

        <div className="p-4">
          <CommunitySidebarContent {...sidebarProps} />
        </div>
      </aside>

      {/* Main content */}
      <div className="min-w-0 flex-1">
        <div className="space-y-6 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {/* Mobile filter button */}
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "gap-1.5 lg:hidden",
                      hasActiveFilters && "border-primary text-primary"
                    )}
                  >
                    <SlidersHorizontal className="size-3.5" />
                    Filters
                    {hasActiveFilters && (
                      <span className="bg-primary text-primary-foreground flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
                        {(filter !== "all" ? 1 : 0) + tags.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="border-b px-6 py-4">
                    <SheetTitle>Community Themes</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <CommunitySidebarContent {...sidebarProps} />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="flex items-center">
                {sortOptions.map((option, i) => (
                  <div key={option.value} className="flex items-center">
                    {i > 0 && (
                      <Separator orientation="vertical" className="mx-1 h-4" />
                    )}
                    <button
                      onClick={() => setSort(option.value)}
                      className={cn(
                        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        sort === option.value
                          ? "bg-foreground/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                      )}
                    >
                      {option.label}
                    </button>
                  </div>
                ))}
              </div>
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
            <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
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
              <h3 className="mb-2 text-lg font-semibold">
                {filter === "mine"
                  ? "No published themes"
                  : filter === "liked"
                    ? "No liked themes"
                    : "No themes yet"}
              </h3>
              <p className="text-muted-foreground mx-auto max-w-sm">
                {filter === "mine"
                  ? "You haven't published any themes yet. Save a theme in the editor, then publish it."
                  : filter === "liked"
                    ? "You haven't liked any themes yet. Browse community themes and like your favorites."
                    : "Be the first to publish a theme to the community! Save a theme in the editor, then publish it from your settings."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 gap-y-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
                {themes.map((theme) => (
                  <CommunityThemeCard key={theme.id} theme={theme} />
                ))}
              </div>

              <div ref={sentinelRef} className="flex justify-center pt-4">
                {isFetchingNextPage && (
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
