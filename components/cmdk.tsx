"use client";

import * as React from "react";
import { Check, CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "./ui/kbd";
import { Button } from "./ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { authClient } from "@/lib/auth-client";
import { Badge } from "./ui/badge";
import { isThemeNew } from "@/utils/search/is-theme-new";
import { ThemeColors } from "./search/theme-colors";
import { NAVIGATION_ITEMS } from "@/utils/search/constants/navigation";
import { filterPresets } from "@/utils/search/filter-presets";
import { sortThemes } from "@/utils/search/sort-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

export function CmdK() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  const themeState = useEditorStore((store) => store.themeState);
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);
  const currentPreset = themeState.preset;
  const mode = themeState.currentMode;

  const presets = useThemePresetStore((store) => store.getAllPresets());
  const loadSavedPresets = useThemePresetStore((store) => store.loadSavedPresets);
  const unloadSavedPresets = useThemePresetStore((store) => store.unloadSavedPresets);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      loadSavedPresets();
    } else {
      unloadSavedPresets();
    }
  }, [loadSavedPresets, unloadSavedPresets, session?.user]);

  const isSavedTheme = useCallback(
    (presetId: string) => {
      return presets[presetId]?.source === "SAVED";
    },
    [presets]
  );

  const presetNames = useMemo(() => Array.from(new Set(["default", ...Object.keys(presets)])), [presets]);

  const filteredPresets = useMemo(() => {
    const filteredList = filterPresets(presetNames, presets, search);

    // Separate saved and default themes
    const savedThemesList = filteredList.filter((name) => name !== "default" && isSavedTheme(name));
    const defaultThemesList = filteredList.filter((name) => !savedThemesList.includes(name));

    return [...sortThemes(savedThemesList, presets), ...sortThemes(defaultThemesList, presets)];
  }, [presetNames, search, presets, isSavedTheme]);

  const filteredSavedThemes = useMemo(() => {
    return filteredPresets.filter((name) => name !== "default" && isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  const filteredDefaultThemes = useMemo(() => {
    return filteredPresets.filter((name) => name === "default" || !isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  const filteredNavigation = useMemo(() => {
    if (search.trim() === "") {
      return NAVIGATION_ITEMS;
    }
    const searchLower = search.toLowerCase();
    return NAVIGATION_ITEMS.filter((item) => {
      const matchesLabel = item.label.toLowerCase().includes(searchLower);
      const matchesKeywords = item.keywords?.some((keyword) =>
        keyword.toLowerCase().includes(searchLower)
      );
      return matchesLabel || matchesKeywords;
    });
  }, [search]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onThemeSelect = (presetName: string) => {
    applyThemePreset(presetName);
    setOpen(false);
    setSearch("");
  };

  const onNavigationSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearch("");
  };

  return (
    <>
      <Button
        variant={"outline"}
        className="flex h-8 items-center justify-between gap-6"
        onClick={() => setOpen(true)}
        aria-label="Open search"
      >
        <span className="flex items-center gap-2 text-sm">
          <Search className="size-4" aria-hidden="true" />
          <p className="hidden sm:block">Search...</p>
          <span className="sr-only">Search</span>
        </span>
        <KbdGroup className="hidden md:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search">
        <div className="bg-card m-1 rounded-md">
          <div className="mb-2 flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search themes, pages, and more..."
              className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandList className="mb-2 h-80 p-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CommandEmpty className="flex items-center justify-center py-32">
              <p>No results found.</p>
            </CommandEmpty>

            {/* Navigation Group */}
            {filteredNavigation.length > 0 && (
              <>
                <CommandGroup heading="Navigation" className="">
                  {filteredNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={() => onNavigationSelect(item.href)}
                        className="flex items-center gap-2"
                      >
                        <Icon className="h-3 w-3 shrink-0" />
                        <span className="text-sm">{item.label}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                {(filteredSavedThemes.length > 0 || filteredDefaultThemes.length > 0) && (
                  <CommandSeparator />
                )}
              </>
            )}

            {/* Saved Themes Group */}
            {filteredSavedThemes.length > 0 && (
              <>
                <CommandGroup heading="Saved Themes">
                  {filteredSavedThemes.map((presetName, index) => (
                    <CommandItem
                      key={`${presetName}-${index}`}
                      value={`${presetName}-${index}`}
                      onSelect={() => onThemeSelect(presetName)}
                      className="flex items-center gap-2"
                    >
                      <ThemeColors presetName={presetName} mode={mode} />

                      <div className="flex flex-1 items-center gap-2">
                        <span className="line-clamp-1 text-sm font-medium capitalize">
                          {presets[presetName]?.label || presetName}
                        </span>
                        {presets[presetName] && isThemeNew(presets[presetName]) && (
                          <Badge variant="secondary" className="rounded-full text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      {presetName === currentPreset && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Built-in Themes Group */}
            {filteredDefaultThemes.length > 0 && (
              <CommandGroup heading="Built-in Themes">
                {filteredDefaultThemes.map((presetName, index) => (
                  <CommandItem
                    key={`${presetName}-${index}`}
                    value={`${presetName}-${index}`}
                    onSelect={() => onThemeSelect(presetName)}
                    className="flex items-center gap-2"
                  >
                    <ThemeColors presetName={presetName} mode={mode} />
                    <div className="flex flex-1 items-center gap-2">
                      <span className="line-clamp-1 text-sm font-medium capitalize">
                        {presets[presetName]?.label || presetName}
                      </span>
                      {presets[presetName] && isThemeNew(presets[presetName]) && (
                        <Badge variant="secondary" className="rounded-full text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    {presetName === currentPreset && (
                      <Check className="h-4 w-4 shrink-0 opacity-70" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </div>
        <CommandFooter />
      </CommandDialog>
    </>
  );
}

const CommandFooter = () => {
  return (
    <div className="text-muted-foreground flex items-center gap-2 px-6 py-2 text-xs">
      <Kbd className="rounded-[4px] px-1">
        <CornerDownLeft />
      </Kbd>
      <p className="font-medium">Go to page</p>
    </div>
  );
};
