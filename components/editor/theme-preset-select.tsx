import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { ThemePreset } from "@/types/theme";
import { getPresetThemeStyles } from "@/utils/theme-preset-helper";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Search,
  Settings,
  Shuffle,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "../theme-toggle";
import { TooltipWrapper } from "../tooltip-wrapper";

interface ThemePresetSelectProps extends React.ComponentProps<typeof Button> {
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

const ThemeControls = () => {
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);
  const presets = useThemePresetStore((store) => store.getAllPresets());

  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length);
    applyThemePreset(presetNames[random]);
  }, [presetNames, applyThemePreset]);

  return (
    <div className="flex gap-1">
      <ThemeToggle variant="ghost" size="icon" className="size-6 p-1" />

      <TooltipWrapper label="Random theme" asChild>
        <Button variant="ghost" size="sm" className="size-6 p-1" onClick={randomize}>
          <Shuffle className="h-3.5 w-3.5" />
        </Button>
      </TooltipWrapper>
    </div>
  );
};

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
        className={cn("aspect-square h-full shrink-0", className)}
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

interface ThemePresetCycleControlsProps extends React.ComponentProps<typeof Button> {
  filteredPresets: string[];
  currentPresetName: string;
  className?: string;
}

const ThemePresetCycleControls: React.FC<ThemePresetCycleControlsProps> = ({
  filteredPresets,
  currentPresetName,
  className,
  ...props
}) => {
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);

  const currentIndex =
    useMemo(
      () => filteredPresets.indexOf(currentPresetName || "default"),
      [filteredPresets, currentPresetName]
    ) ?? 0;

  const cycleTheme = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (currentIndex + 1) % filteredPresets.length
          : (currentIndex - 1 + filteredPresets.length) % filteredPresets.length;
      applyThemePreset(filteredPresets[newIndex]);
    },
    [currentIndex, filteredPresets, applyThemePreset]
  );
  return (
    <>
      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="prev"
        size="icon"
        className={cn("aspect-square min-h-8 w-auto", className)}
        onClick={() => cycleTheme("prev")}
        {...props}
      />

      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="next"
        size="icon"
        className={cn("aspect-square min-h-8 w-auto", className)}
        onClick={() => cycleTheme("next")}
        {...props}
      />
    </>
  );
};

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  withCycleThemes = true,
  className,
  ...props
}) => {
  const themeState = useEditorStore((store) => store.themeState);
  const applyThemePreset = useEditorStore((store) => store.applyThemePreset);
  const hasUnsavedChanges = useEditorStore((store) => store.hasUnsavedChanges);
  const currentPreset = themeState.preset;
  const mode = themeState.currentMode;

  const presets = useThemePresetStore((store) => store.getAllPresets());
  const loadSavedPresets = useThemePresetStore((store) => store.loadSavedPresets);
  const unloadSavedPresets = useThemePresetStore((store) => store.unloadSavedPresets);

  const [search, setSearch] = useState("");

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

  const presetNames = useMemo(() => ["default", ...Object.keys(presets)], [presets]);
  const currentPresetName = presetNames?.find((name) => name === currentPreset);

  const filteredPresets = useMemo(() => {
    const filteredList =
      search.trim() === ""
        ? presetNames
        : presetNames.filter((name) => {
            if (name === "default") {
              return "default".toLowerCase().includes(search.toLowerCase());
            }
            return presets[name]?.label?.toLowerCase().includes(search.toLowerCase());
          });

    // Separate saved and default themes
    const savedThemesList = filteredList.filter((name) => name !== "default" && isSavedTheme(name));
    const defaultThemesList = filteredList.filter((name) => !savedThemesList.includes(name));

    // Sort each list, with "default" at the top for default themes
    const sortThemes = (list: string[]) => {
      const defaultTheme = list.filter((name) => name === "default");
      const otherThemes = list
        .filter((name) => name !== "default")
        .sort((a, b) => {
          const labelA = presets[a]?.label || a;
          const labelB = presets[b]?.label || b;
          return labelA.localeCompare(labelB);
        });
      return [...defaultTheme, ...otherThemes];
    };

    // Combine saved themes first, then default themes
    return [...sortThemes(savedThemesList), ...sortThemes(defaultThemesList)];
  }, [presetNames, search, presets, isSavedTheme]);

  const filteredSavedThemes = useMemo(() => {
    return filteredPresets.filter((name) => name !== "default" && isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  const filteredDefaultThemes = useMemo(() => {
    return filteredPresets.filter((name) => name === "default" || !isSavedTheme(name));
  }, [filteredPresets, isSavedTheme]);

  return (
    <div className="flex w-full items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn("group relative w-full justify-between md:min-w-56", className)}
            {...props}
          >
            <div className="flex w-full items-center gap-3 overflow-hidden">
              <div className="flex gap-0.5">
                <ColorBox color={themeState.styles[mode].primary} />
                <ColorBox color={themeState.styles[mode].accent} />
                <ColorBox color={themeState.styles[mode].secondary} />
                <ColorBox color={themeState.styles[mode].border} />
              </div>
              {currentPresetName !== "default" &&
                currentPresetName &&
                isSavedTheme(currentPresetName) &&
                !hasUnsavedChanges() && (
                  <div className="bg-muted rounded-full p-1">
                    <Heart
                      className="size-1"
                      stroke="var(--muted)"
                      fill="var(--muted-foreground)"
                    />
                  </div>
                )}
              <span className="truncate text-left font-medium capitalize">
                {hasUnsavedChanges() ? (
                  <>Custom (Unsaved)</>
                ) : (
                  presets[currentPresetName || "default"]?.label || "default"
                )}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="center">
          <Command className="h-100 w-full">
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
            <div className="flex items-center justify-between px-3 py-2">
              <div className="text-muted-foreground text-sm">
                {filteredPresets.length} theme
                {filteredPresets.length !== 1 ? "s" : ""}
              </div>
              <ThemeControls />
            </div>
            <Separator />
            <ScrollArea className="h-[500px] max-h-[70vh]">
              <CommandEmpty>No themes found.</CommandEmpty>

              {/* Saved Themes Group */}
              {filteredSavedThemes.length > 0 && (
                <>
                  <CommandGroup
                    heading={
                      <div className="flex w-full items-center justify-between">
                        <span>Saved Themes</span>
                        <Link href="/settings/themes">
                          <Button
                            variant="link"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 p-0 text-xs"
                          >
                            <Settings />
                          </Button>
                        </Link>
                      </div>
                    }
                  >
                    {filteredSavedThemes
                      .filter((name) => name !== "default" && isSavedTheme(name))
                      .map((presetName, index) => (
                        <CommandItem
                          key={`${presetName}-${index}`}
                          value={`${presetName}-${index}`}
                          onSelect={() => {
                            applyThemePreset(presetName);
                            setSearch("");
                          }}
                          className="data-[highlighted]:bg-secondary/50 flex items-center gap-2 py-2"
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
                          {presetName === currentPresetName && (
                            <Check className="h-4 w-4 shrink-0 opacity-70" />
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                  <Separator className="my-2" />
                </>
              )}

              {filteredSavedThemes.length === 0 && search.trim() === "" && (
                <>
                  <div className="text-muted-foreground flex items-center gap-1.5 px-3 py-2 text-xs font-medium">
                    <div className="bg-muted flex items-center gap-1 rounded-md border px-2 py-0.5">
                      <Heart className="fill-muted-foreground size-3" />
                      <span>Save</span>
                    </div>
                    <span className="text-muted-foreground">a theme to find it here.</span>
                  </div>
                  <Separator />
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
                        applyThemePreset(presetName);
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
                      {presetName === currentPresetName && (
                        <Check className="h-4 w-4 shrink-0 opacity-70" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>

      {withCycleThemes && (
        <ThemePresetCycleControls
          filteredPresets={filteredPresets}
          currentPresetName={currentPresetName || "default"}
          className={className}
          disabled={props.disabled}
        />
      )}
    </div>
  );
};

export default ThemePresetSelect;
