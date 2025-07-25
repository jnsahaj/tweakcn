"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { FontCategory, useFontSearch } from "@/hooks/use-font-search";
import { FontInfo, GoogleFontCategory } from "@/types/fonts";
import { buildFontFamily, getDefaultWeights, loadGoogleFont, waitForFont } from "@/utils/fonts";
import { ChevronDown, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface GoogleFontPickerProps {
  value?: string;
  category?: GoogleFontCategory;
  onSelect: (font: FontInfo) => void;
  placeholder?: string;
  className?: string;
}

export function GoogleFontPicker({
  value,
  category,
  onSelect,
  placeholder = "Search fonts...",
  className,
}: GoogleFontPickerProps) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FontCategory>(category || "all");
  const [loadingFont, setLoadingFont] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const debouncedSetSearchQuery = useDebouncedCallback(setSearchQuery, 300);

  useEffect(() => {
    debouncedSetSearchQuery(inputValue);
  }, [inputValue, debouncedSetSearchQuery]);

  const fontQuery = useFontSearch({
    query: searchQuery,
    category: selectedCategory,
    limit: 15,
  });

  // Flatten all pages into a single array
  const allFonts = useMemo(() => {
    if (!fontQuery.data) return [];
    return fontQuery.data.pages.flatMap((page) => page.fonts);
  }, [fontQuery.data]);

  // Infinite scroll detection
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      // Load more when scrolled to 80% of the way down
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        if (fontQuery.hasNextPage && !fontQuery.isFetchingNextPage) {
          fontQuery.fetchNextPage();
        }
      }
    };

    scrollElement.addEventListener("scroll", handleScroll);
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, [fontQuery]);

  const handleFontSelect = useCallback(
    async (font: FontInfo) => {
      setLoadingFont(font.family);

      try {
        const weights = getDefaultWeights(font.variants);
        loadGoogleFont(font.family, weights);
        await waitForFont(font.family, weights[0]);
      } catch (error) {
        console.warn(`Failed to load font ${font.family}:`, error);
      }

      setLoadingFont(null);
      onSelect(font);
      setInputValue("");
    },
    [onSelect]
  );

  // Get current font info for display
  const currentFont = useMemo(() => {
    if (!value) return null;

    // First try to find the font in the search results
    const foundFont = allFonts.find((font: FontInfo) => font.family === value);
    if (foundFont) return foundFont;

    // If not found in search results, create a fallback FontInfo object
    // This happens when a font is selected and then the search changes
    const extractedFontName = value.split(",")[0].trim().replace(/['"]/g, "");

    return {
      family: extractedFontName,
      category,
      variants: ["400"],
      variable: false,
    } as FontInfo;
  }, [value, allFonts]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className={`w-full justify-between ${className}`}>
          <div className="flex items-center gap-2">
            {currentFont ? (
              <span className="inline-flex items-center gap-2">
                <span
                  style={{
                    fontFamily: buildFontFamily(currentFont.family, currentFont.category),
                  }}
                >
                  {currentFont.family}
                </span>

                <span className="text-muted-foreground text-xs">{currentFont.category}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false} className="h-96 w-full overflow-hidden">
          <div className="flex flex-col">
            <CommandInput
              className="h-10 w-full border-none p-0"
              placeholder="Search Google fonts..."
              value={inputValue}
              onValueChange={setInputValue}
            />

            <div className="px-2 py-1">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as FontCategory)}
              >
                <SelectTrigger className="focus bg-background h-8 px-2 text-xs outline-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fonts</SelectItem>
                  <SelectItem value="sans-serif">Sans Serif Fonts</SelectItem>
                  <SelectItem value="serif">Serif Fonts</SelectItem>
                  <SelectItem value="monospace">Monospace Fonts</SelectItem>
                  <SelectItem value="display">Display Fonts</SelectItem>
                  <SelectItem value="handwriting">Handwriting Fonts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="relative isolate size-full">
            {fontQuery.isLoading ? (
              <div className="absolute inset-0 flex size-full items-center justify-center gap-2 text-center">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-muted-foreground text-sm">Loading fonts...</span>
              </div>
            ) : allFonts.length === 0 ? (
              <CommandEmpty>No fonts found.</CommandEmpty>
            ) : (
              <CommandList className="scrollbar-thin size-full p-1" ref={scrollRef}>
                {allFonts.map((font: FontInfo) => (
                  <CommandItem
                    key={font.family}
                    className="group/command-item flex cursor-pointer flex-col items-start gap-1 p-2"
                    onSelect={() => handleFontSelect(font)}
                    disabled={loadingFont === font.family}
                    onMouseEnter={() => {
                      // Preload font on hover
                      loadGoogleFont(font.family, ["400"]);
                    }}
                  >
                    <div className="flex w-full flex-col">
                      <span
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: buildFontFamily(font.family, font.category),
                        }}
                      >
                        <span className="text-base leading-tight font-medium">{font.family}</span>
                        {loadingFont === font.family && <Loader2 className="size-3 animate-spin" />}
                      </span>

                      <div className="text-muted-foreground group-hover/command-item:text-accent-foreground flex items-center gap-1">
                        <span className="text-xs">{font.category}</span>

                        {font.variable && (
                          <span className="inline-flex items-center gap-1 text-xs">
                            <span>•</span>
                            <span>Variable</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}

                {/* Loading indicator for infinite scroll */}
                {fontQuery.isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-muted-foreground text-sm">Loading more fonts...</span>
                  </div>
                )}
              </CommandList>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
