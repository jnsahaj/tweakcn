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
import { FilterFontCategory, useFontSearch } from "@/hooks/use-font-search";
import { cn } from "@/lib/utils";
import { FontInfo } from "@/types/fonts";
import { buildFontFamily, getDefaultWeights, waitForFont } from "@/utils/fonts";
import { loadGoogleFont } from "@/utils/fonts/google-fonts";
import { Check, ChevronDown, FunnelX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TooltipWrapper } from "../tooltip-wrapper";

interface FontPickerProps {
  value?: string;
  category?: FilterFontCategory;
  onSelect: (font: FontInfo) => void;
  placeholder?: string;
  className?: string;
}

export function FontPicker({
  value,
  category,
  onSelect,
  placeholder = "Search fonts...",
  className,
}: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FilterFontCategory>(category || "all");
  const [loadingFont, setLoadingFont] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedFontRef = useRef<HTMLDivElement>(null);
  const hasScrolledToSelectedFont = useRef(false);

  const debouncedSetSearchQuery = useDebouncedCallback(setSearchQuery, 300);

  useEffect(() => {
    debouncedSetSearchQuery(inputValue);
  }, [inputValue, debouncedSetSearchQuery]);

  const fontQuery = useFontSearch({
    query: searchQuery,
    category: selectedCategory,
    limit: 15,
    enabled: open,
  });

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedCategory, searchQuery, open]);

  useEffect(() => {
    if (open && fontQuery.data && !hasScrolledToSelectedFont.current) {
      requestAnimationFrame(() => {
        selectedFontRef.current?.scrollIntoView({
          block: "center",
          inline: "nearest",
        });
      });
      hasScrolledToSelectedFont.current = true;
    } else if (!open) {
      hasScrolledToSelectedFont.current = false;
    }
  }, [open, fontQuery.data]);

  // Flatten all pages into a single array
  const allFonts = useMemo(() => {
    if (!fontQuery.data) return [];
    return fontQuery.data.pages.flatMap((page) => page.fonts);
  }, [fontQuery.data]);

  // Intersection Observer ref callback for infinite scroll
  const loadMoreRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting && fontQuery.hasNextPage && !fontQuery.isFetchingNextPage) {
            fontQuery.fetchNextPage();
          }
        },
        {
          root: scrollRef.current,
          rootMargin: "100px",
          threshold: 0,
        }
      );

      observer.observe(node);
      return () => observer.unobserve(node);
    },
    [fontQuery.hasNextPage, fontQuery.isFetchingNextPage, fontQuery.fetchNextPage]
  );

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
      category: category || "sans-serif",
      variants: ["400"],
      variable: false,
    } as FontInfo;
  }, [value, allFonts, category]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn("bg-input/25 w-full justify-between", className)}
        >
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
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false} className="h-96 w-full overflow-hidden">
          <div className="flex flex-col">
            <div className="relative">
              <CommandInput
                className="h-10 w-full border-none p-0 pr-10"
                placeholder="Search Google fonts..."
                value={inputValue}
                onValueChange={setInputValue}
              />

              {inputValue && (
                <TooltipWrapper asChild label="Clear search">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setInputValue("")}
                    className="absolute top-2 right-2 size-6"
                  >
                    <FunnelX className="size-4" />
                  </Button>
                </TooltipWrapper>
              )}
            </div>

            <div className="px-2 py-1">
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as FilterFontCategory)}
              >
                <SelectTrigger className="focus bg-input/25 h-8 px-2 text-xs outline-none">
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
                {allFonts.map((font: FontInfo) => {
                  const isSelected = font.family === value;
                  const isLoading = loadingFont === font.family;
                  const fontFamily = buildFontFamily(font.family, font.category);

                  const handlePreloadOnHover = () => {
                    loadGoogleFont(font.family, ["400"]);
                  };

                  return (
                    <CommandItem
                      key={font.family}
                      className="flex cursor-pointer items-center justify-between gap-2 p-2"
                      onSelect={() => handleFontSelect(font)}
                      disabled={isLoading}
                      onMouseEnter={handlePreloadOnHover}
                      ref={isSelected ? selectedFontRef : null}
                    >
                      <div className="line-clamp-1 inline-flex w-full flex-1 flex-col justify-between">
                        <span
                          className="inline-flex items-center gap-2 truncate"
                          style={{ fontFamily }}
                        >
                          {font.family}
                          {isLoading && <Loader2 className="size-3 animate-spin" />}
                        </span>

                        <div className="flex items-center gap-1 text-xs font-normal opacity-70">
                          <span>{font.category}</span>

                          {font.variable && (
                            <span className="inline-flex items-center gap-1">
                              <span>•</span>
                              <span>Variable</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="size-4 shrink-0 opacity-70" />}
                    </CommandItem>
                  );
                })}

                {/* Load more trigger element */}
                {fontQuery.hasNextPage && <div ref={loadMoreRefCallback} className="h-2 w-full" />}

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
