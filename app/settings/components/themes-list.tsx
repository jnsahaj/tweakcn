"use client";

import { useState, useEffect } from "react";
import type { Theme } from "@/types/theme";
import { ThemeCard } from "./theme-card";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface ThemesListProps {
  themes: Theme[];
}

export function ThemesList({ themes }: ThemesListProps) {
  const [filteredThemes, setFilteredThemes] = useState<Theme[]>(themes);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const isMobile = useIsMobile();

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
    <div className="space-y-6">
      <div className="bg-card rounded-lg border p-4">
        <div className="mb-6 flex flex-col space-y-4 md:flex-row md:justify-between md:gap-4 md:space-y-0">
          <div className="ml-auto flex w-full flex-row gap-2 md:w-auto">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                placeholder="Search themes..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[80px] w-full gap-2 md:w-[180px]">
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
        </div>

        {filteredThemes.length === 0 && searchTerm ? (
          <div className="py-12 text-center">
            <Search className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-medium">No themes found</h3>
            <p className="text-muted-foreground">
              No themes match your search term &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredThemes.map((theme: Theme) => (
              <ThemeCard key={theme.id} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
