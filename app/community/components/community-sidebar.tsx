"use client";

import { cn } from "@/lib/utils";
import { useCommunityTagCounts } from "@/hooks/themes";
import { useSessionGuard } from "@/hooks/use-guards";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CommunityFilterOption } from "@/types/community";

interface CommunitySidebarProps {
  filter: CommunityFilterOption;
  selectedTags: string[];
  onFilterChange: (filter: CommunityFilterOption) => void;
  onTagToggle: (tag: string) => void;
}

const filterItems = [
  { value: "all" as const, label: "All Themes" },
  { value: "mine" as const, label: "My Themes" },
  { value: "liked" as const, label: "Liked Themes" },
];

export function CommunitySidebarContent({
  filter,
  selectedTags,
  onFilterChange,
  onTagToggle,
}: CommunitySidebarProps) {
  const { data: tagCounts = [], isLoading: isLoadingTags } =
    useCommunityTagCounts();
  const { checkValidSession } = useSessionGuard();

  const handleFilterClick = (value: CommunityFilterOption) => {
    if (value === "mine" || value === "liked") {
      if (!checkValidSession("signin")) return;
    }
    onFilterChange(value);
  };

  return (
    <nav className="space-y-1">
      {filterItems.map((item) => (
        <button
          key={item.value}
          onClick={() => handleFilterClick(item.value)}
          className={cn(
            "flex w-full items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            filter === item.value
              ? "bg-foreground/10 text-foreground"
              : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
          )}
        >
          {item.label}
        </button>
      ))}

      <Separator className="!my-3" />
      <div className="px-3 py-1">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
          Tags
        </span>
      </div>

      {isLoadingTags ? (
        <div className="space-y-1 px-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-full rounded-lg" />
          ))}
        </div>
      ) : tagCounts.length > 0 ? (
        <div className="space-y-0.5">
          {tagCounts.map(({ tag, count }) => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors",
                selectedTags.includes(tag)
                  ? "bg-foreground/10 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              )}
            >
              <span>{tag}</span>
              <span
                className={cn(
                  "text-xs tabular-nums",
                  selectedTags.includes(tag)
                    ? "text-foreground/70"
                    : "text-muted-foreground/60"
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
