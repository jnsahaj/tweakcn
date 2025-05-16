"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useQueryState } from "nuqs";

export function SortBySelector() {
  const [sortBy, setSortBy] = useQueryState("sort", {
    defaultValue: "newest",
    shallow: false,
  });

  return (
    <ToggleGroup
      type="single"
      value={sortBy}
      onValueChange={(value) => {
        if (value) {
          setSortBy(value);
        } else {
          // Optionally, reset to default if unselected, or prevent unselection
          setSortBy("newest");
        }
      }}
      aria-label="Sort by"
    >
      <ToggleGroupItem value="newest" aria-label="Sort by newest">
        Newest
      </ToggleGroupItem>
      <ToggleGroupItem value="popular" aria-label="Sort by popular">
        Most Popular
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
