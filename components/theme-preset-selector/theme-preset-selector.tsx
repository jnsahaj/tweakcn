"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// A single color box for the preview
const ColorBox = ({ color }: { color: string }) => (
  <div className="size-4 rounded" style={{ backgroundColor: color }} />
);

export interface ThemePreset {
  id: string;
  label: string;
  colors: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}

export interface ThemePresetSelectorProps {
  presets: Record<string, ThemePreset>;
  currentPresetId?: string;
  onSelectPreset: (presetId: string) => void;
  currentMode?: "light" | "dark";
  className?: string;
}

const ThemePresetSelector: React.FC<ThemePresetSelectorProps> = ({
  presets,
  currentPresetId,
  onSelectPreset,
  currentMode = "light",
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const presetList = useMemo(() => Object.values(presets), [presets]);

  const filteredPresets = useMemo(
    () =>
      presetList.filter((preset) =>
        preset.label.toLowerCase().includes(search.toLowerCase())
      ),
    [presetList, search]
  );

  const activePreset = currentPresetId ? presets[currentPresetId] : null;
  const activeColors = activePreset?.colors[currentMode];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn("group relative w-full justify-between md:min-w-56", className)}
        >
          <div className="flex w-full items-center gap-3 overflow-hidden">
            {activeColors && (
              <div className="flex gap-0.5">
                <ColorBox color={activeColors.primary} />
                <ColorBox color={activeColors.accent} />
                <ColorBox color={activeColors.secondary} />
                <ColorBox color={activeColors.border} />
              </div>
            )}
            <span className="truncate text-left font-medium capitalize">
              {activePreset?.label || "Select a theme"}
            </span>
          </div>
          <ChevronDown className="size-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-64 p-0" align="start">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder="Search themes..."
              value={search}
              onValueChange={setSearch}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <CommandList>
            <CommandEmpty>No themes found.</CommandEmpty>
            <ScrollArea className="h-64">
              <CommandGroup>
                {filteredPresets.map((preset) => (
                  <CommandItem
                    key={preset.id}
                    onSelect={() => {
                      onSelectPreset(preset.id);
                      setOpen(false);
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        <ColorBox color={preset.colors[currentMode].primary} />
                        <ColorBox color={preset.colors[currentMode].accent} />
                        <ColorBox color={preset.colors[currentMode].secondary} />
                        <ColorBox color={preset.colors[currentMode].border} />
                      </div>
                      <span className="capitalize">{preset.label}</span>
                    </div>
                    {currentPresetId === preset.id && <Check className="size-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ThemePresetSelector; 