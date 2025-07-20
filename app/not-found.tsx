"use client";

import { ThemePresetButtons } from "@/components/home/theme-preset-buttons";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useEditorStore } from "@/store/editor-store";
import { defaultPresets } from "@/utils/theme-presets";
import { Sun, Moon } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  const { theme, toggleTheme } = useTheme();
  const { themeState, applyThemePreset } = useEditorStore();
  const mode = themeState.currentMode;
  const presetNames = Object.keys(defaultPresets);
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="fixed top-4 right-4 z-50">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Toggle theme"
              onClick={(e) => toggleTheme({ x: e.clientX, y: e.clientY })}
            >
              {theme === "light" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Toggle theme</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <span className="text-muted-foreground mb-6 text-[6rem] leading-none font-extrabold select-none">
        404
      </span>
      <h1 className="text-foreground mb-2 text-3xl font-bold">Oops, Lost in Space?</h1>
      <p className="text-muted-foreground mb-8 max-w-md text-center text-lg">
        Go home or try switching the theme!
      </p>

      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/80 mb-10 rounded-md px-6 py-2 font-semibold shadow transition-colors"
      >
        Back to Home
      </Link>

      <div className="flex w-full justify-center">
        <ThemePresetButtons
          presetNames={presetNames}
          mode={mode}
          themeState={themeState}
          applyThemePreset={applyThemePreset}
        />
      </div>
    </div>
  );
}
