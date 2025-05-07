import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { ThemePreset } from "@/types/theme";
import { getPresetThemeStyles } from "@/utils/theme-preset-helper";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Moon,
  Search,
  Shuffle,
  Sun,
} from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

// This file is a temporary component: It's basically a copy of the ThemePresetSelect component in the editor
// but with a few adjustments to change its behavior and appearance.

interface ThemePresetSelectProps extends React.ComponentProps<typeof Button> {
  presets: Record<string, ThemePreset>;
  currentPreset: string | null;
  onPresetChange: (preset: string) => void;
  withCycleThemes?: boolean;
}

interface ColorBoxProps {
  color: string;
}

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <div className="border-muted h-3 w-3 rounded-sm border" style={{ backgroundColor: color }} />
);

interface ThemeColorsProps {
  presetName: string;
  mode: "light" | "dark";
}

const ThemeColors: React.FC<ThemeColorsProps> = ({ presetName, mode }) => {
  const styles = getPresetThemeStyles(presetName)[mode];
  return (
    <div className="flex gap-0.5">
      <ColorBox color={styles.primary} />
      <ColorBox color={styles.accent} />
      <ColorBox color={styles.secondary} />
      <ColorBox color={styles.border} />
    </div>
  );
};

const isThemeNew = (preset: ThemePreset) => {
  if (!preset.createdAt) return false;
  const createdAt = new Date(preset.createdAt);
  const timePeriod = new Date();
  timePeriod.setDate(timePeriod.getDate() - 5);
  return createdAt > timePeriod;
};

interface ThemeControlsProps {
  onRandomize: () => void;
  onThemeToggle: (event: React.MouseEvent<HTMLButtonElement>) => void;
  theme: string;
}

const ThemeControls: React.FC<ThemeControlsProps> = ({ onRandomize, onThemeToggle, theme }) => (
  <div className="flex gap-1">
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onThemeToggle}>
          {theme === "light" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">Toggle theme</p>
      </TooltipContent>
    </Tooltip>

    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onRandomize}>
          <Shuffle className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">Random theme</p>
      </TooltipContent>
    </Tooltip>
  </div>
);

interface ThemeCycleButtonProps extends React.ComponentProps<typeof Button> {
  direction: "prev" | "next";
}

const ThemeCycleButton: React.FC<ThemeCycleButtonProps> = ({
  direction,
  onClick,
  className,
  ...props
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn("bg-muted/10 size-14 shrink-0 rounded-none", className)}
        onClick={onClick}
        {...props}
      >
        {direction === "prev" ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{direction === "prev" ? "Previous theme" : "Next theme"}</TooltipContent>
  </Tooltip>
);

const ThemePresetCycleControls: React.FC<{
  cycleTheme: (direction: "prev" | "next") => void;
}> = ({ cycleTheme: onCycleTheme }) => {
  return (
    <>
      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="prev"
        onClick={() => onCycleTheme("prev")}
        className="size-8 rounded-lg bg-transparent"
      />

      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="next"
        onClick={() => onCycleTheme("next")}
        className="size-8 rounded-lg bg-transparent"
      />
    </>
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  presets,
  currentPreset,
  onPresetChange,
  withCycleThemes = true,
  className,
  ...props
}) => {
  const { themeState, hasUnsavedChanges } = useEditorStore();
  const { theme, toggleTheme } = useTheme();
  const mode = themeState.currentMode;
  const [search, setSearch] = useState("");

  const isSavedTheme = useCallback(
    (presetId: string) => {
      return presets[presetId]?.source === "SAVED";
    },
    [presets]
  );

  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
  const value = presetNames?.find((name) => name === currentPreset);

  const filteredPresets = useMemo(() => {
    const filteredList =
      search.trim() === ""
        ? presetNames
        : Object.entries(presets)
            .filter(([_, preset]) => preset.label?.toLowerCase().includes(search.toLowerCase()))
            .map(([name]) => name);

    // Separate saved and default themes
    const savedThemesList = filteredList.filter((name) => name !== "default" && isSavedTheme(name));
    const defaultThemesList = filteredList.filter((name) => !savedThemesList.includes(name));

    // Sort each list
    const sortThemes = (list: string[]) =>
      list.sort((a, b) => {
        const labelA = presets[a]?.label || a;
        const labelB = presets[b]?.label || b;
        return labelA.localeCompare(labelB);
      });

    // Combine saved themes first, then default themes
    return [...sortThemes(savedThemesList), ...sortThemes(defaultThemesList)];
  }, [presetNames, search, presets, isSavedTheme]);

  const currentIndex =
    useMemo(() => filteredPresets.indexOf(value || "default"), [filteredPresets, value]) ?? 0;

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * filteredPresets.length);
    onPresetChange(filteredPresets[random]);
  }, [onPresetChange, filteredPresets]);

  const cycleTheme = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % filteredPresets.length
          : (currentIndex - 1 + filteredPresets.length) % filteredPresets.length;
      onPresetChange(filteredPresets[newIndex]);
    },
    [currentIndex, filteredPresets, onPresetChange]
  );

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  const filteredSavedThemes = useMemo(() => {
    return filteredPresets.filter((name) => name !== "default" && isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  const filteredDefaultThemes = useMemo(() => {
    return filteredPresets.filter((name) => name === "default" || !isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  return (
    <div className="flex items-center gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "group relative w-full justify-between rounded-none md:min-w-56",
              "bg-muted/10 min-h-14",
              className
            )}
            {...props}
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                <ColorBox color={themeState.styles[mode].primary} />
                <ColorBox color={themeState.styles[mode].accent} />
                <ColorBox color={themeState.styles[mode].secondary} />
                <ColorBox color={themeState.styles[mode].border} />
              </div>
              {value !== "default" && value && isSavedTheme(value) && !hasUnsavedChanges() && (
                <div className="bg-muted rounded-full p-1">
                  <Heart className="size-1" stroke="var(--muted)" fill="var(--muted-foreground)" />
                </div>
              )}
              <span className="font-medium capitalize">
                {hasUnsavedChanges() ? (
                  <>Custom (Unsaved)</>
                ) : (
                  presets[value || "default"]?.label || "default"
                )}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="center">
          <Command className="h-96 w-full rounded-lg border shadow-md">
            <div className="flex w-full items-center">
              <div className="flex w-full items-center border-b px-3 py-1">
                <Search className="size-4 shrink-0 opacity-50" />
                <Input
                  placeholder="Search themes..."
                  className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2">
              <div className="text-muted-foreground text-xs">
                {filteredPresets.length} theme
                {filteredPresets.length !== 1 ? "s" : ""}
              </div>
              <ThemeControls
                onRandomize={randomize}
                onThemeToggle={handleThemeToggle}
                theme={theme}
              />
            </div>
            <Separator />
            <ScrollArea className="h-[500px] max-h-[70vh]">
              <CommandEmpty>No themes found.</CommandEmpty>

              {/* Saved Themes Group */}
              {filteredSavedThemes.length > 0 && (
                <>
                  <CommandGroup heading="Saved Themes">
                    {filteredSavedThemes
                      .filter((name) => name !== "default" && isSavedTheme(name))
                      .map((presetName, index) => (
                        <>
                          <CommandItem
                            key={`${presetName}-${index}`}
                            value={`${presetName}-${index}`}
                            onSelect={() => {
                              onPresetChange(presetName);
                              setSearch("");
                            }}
                            className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                          >
                            <ThemeColors presetName={presetName} mode={mode} />
                            <div className="flex flex-1 items-center gap-2">
                              <span className="text-sm font-medium capitalize">
                                {presets[presetName]?.label || presetName}
                              </span>
                              {presets[presetName] && isThemeNew(presets[presetName]) && (
                                <Badge variant="secondary" className="rounded-full text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            {presetName === value && (
                              <Check className="h-4 w-4 shrink-0 opacity-70" />
                            )}
                          </CommandItem>
                        </>
                      ))}
                  </CommandGroup>
                  <Separator className="my-2" />
                </>
              )}

              {filteredSavedThemes.length === 0 && search.trim() === "" && (
                <>
                  <div className="text-muted-foreground flex items-center gap-1.5 px-2 pt-2 text-xs">
                    <div className="flex items-center gap-1 rounded-md border px-2 py-1">
                      <Heart className="size-3" />
                      <span>Save</span>
                    </div>
                    <span>a theme to find it here.</span>
                  </div>
                  <Separator className="my-2" />
                </>
              )}

              {/* Default Theme Group */}
              {filteredDefaultThemes.length > 0 && (
                <CommandGroup heading="Built-in Themes">
                  {filteredDefaultThemes.map((presetName, index) => (
                    <CommandItem
                      key={`${presetName}-${index}`}
                      value={`${presetName}-${index}`}
                      onSelect={() => {
                        onPresetChange(presetName);
                        setSearch("");
                      }}
                      className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
                    >
                      <ThemeColors presetName={presetName} mode={mode} />
                      <div className="flex flex-1 items-center gap-2">
                        <span className="text-sm font-medium capitalize">
                          {presets[presetName]?.label || presetName}
                        </span>
                        {presets[presetName] && isThemeNew(presets[presetName]) && (
                          <Badge variant="secondary" className="rounded-full text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      {presetName === value && <Check className="h-4 w-4 shrink-0 opacity-70" />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {withCycleThemes && <ThemePresetCycleControls cycleTheme={cycleTheme} />}
    </div>
  );
};

export default ThemePresetSelect;
