"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMyPublishedThemeIds } from "@/hooks/themes";
import type { Theme } from "@/types/theme";
import { ArrowUpDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ThemeCard } from "./theme-card";

interface ThemesListProps {
  themes: Theme[];
}

export function ThemesList({ themes }: ThemesListProps) {
  const [filteredThemes, setFilteredThemes] = useState<Theme[]>(themes);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const isMobile = useIsMobile();
  const { data: publishedIds } = useMyPublishedThemeIds();

  const publishedSet = useMemo(
    () => new Set(publishedIds ?? []),
    [publishedIds]
  );

  useEffect(() => {
    const filtered = themes.filter((theme) =>
      theme.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort based on selected option
    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        case "oldest":
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });

    setFilteredThemes(sorted);
  }, [themes, searchTerm, sortOption]);

  return (
    <section className="space-y-4">
      <div className="ml-auto flex w-fit flex-row gap-2">
        <div className="relative w-fit">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
          <Input
            placeholder="Search themes..."
            className="w-full pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[80px] gap-2 md:w-[180px]">
            <ArrowUpDown className="text-muted-foreground h-4 w-4" />
            {!isMobile && <SelectValue placeholder="Sort by" />}
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="space-y-4 p-4">
        {filteredThemes.length === 0 && searchTerm ? (
          <div className="py-12 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 size-12" />
            <h3 className="mb-1 text-lg font-medium">No themes found</h3>
            <p className="text-muted-foreground text-pretty">
              No themes match your search term &quot;{searchTerm}&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme: Theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isPublished={publishedSet.has(theme.id)}
              />
            ))}
          </div>
        )}
      </Card>
    </section>
  );
}
