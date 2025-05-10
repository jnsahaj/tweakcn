"use client";

import { useTheme } from "@/components/theme-provider";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import {
  ChevronDown,
  ChevronUp,
  Code,
  Edit,
  Heart,
  Moon,
  Redo,
  RefreshCw,
  Sun,
  Undo,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export function Toolbar() {
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  return (
    <div
      className={cn(
        "group/toolbar fixed bottom-6 left-1/2 isolate z-50 -translate-x-1/2 transition-all duration-200",
        isToolbarOpen ? "translate-y-0" : "bottom-0 translate-y-full"
      )}
    >
      <div className="bg-foreground/10 absolute inset-0 z-[-1] blur-md" />
      <button
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        className={cn(
          "group/chevron absolute inset-x-0 top-0 z-[-1] mx-auto size-8 translate-y-0 rounded-lg p-1.5 opacity-0 transition-all duration-200",
          isToolbarOpen
            ? "group-hover/toolbar:-translate-y-full group-hover/toolbar:opacity-100"
            : "-translate-y-full opacity-100"
        )}
      >
        <div
          className={cn(
            "bg-background ring-border relative mx-auto flex size-5 items-center justify-center rounded-full p-1 ring",
            !isToolbarOpen && ""
          )}
        >
          {!isToolbarOpen && (
            <div className="bg-primary/50 absolute inset-0.5 z-[-1] animate-ping rounded-full" />
          )}
          {isToolbarOpen ? (
            <ChevronDown className="text-muted-foreground group-hover/chevron:text-foreground size-5 transition-all duration-200 group-hover/chevron:scale-115" />
          ) : (
            <ChevronUp className="text-muted-foreground group-hover/chevron:text-foreground size-5 stroke-2 transition-all duration-200 group-hover/chevron:scale-115" />
          )}
        </div>
      </button>

      <div className="bg-popover ring-border/30 rounded-lg border ring">
        <ToolbarActions />
      </div>
    </div>
  );
}

function ToolbarActions() {
  const {
    themeState,
    setThemeState,
    saveThemeCheckpoint,
    restoreThemeCheckpoint,
    hasThemeChangedFromCheckpoint,
  } = useEditorStore();
  const toggleThemeRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleOpenInEditor = () => {
    // Check this implementation once the AI flow works
    if (hasThemeChangedFromCheckpoint()) {
      setThemeState({
        ...themeState,
        preset: undefined,
      });
    }
    saveThemeCheckpoint();
    router.push("/editor/theme");
  };

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <div className="flex items-center gap-1.5 p-2">
      {/* Theme Toggle Button */}
      <TooltipWrapper label="Toggle theme">
        <Button
          ref={toggleThemeRef}
          size="icon"
          variant="ghost"
          className="bg-background border"
          disabled={false}
          onClick={handleThemeToggle}
        >
          {theme === "light" ? <Moon className="size-3" /> : <Sun className="size-3" />}
        </Button>
      </TooltipWrapper>

      {/* Undo Button */}
      <TooltipWrapper label="Undo">
        <Button size="icon" variant="ghost" className="bg-background border" disabled={true}>
          <Undo className="size-3" />
        </Button>
      </TooltipWrapper>

      {/* Redo Button */}
      <TooltipWrapper label="Redo">
        <Button size="icon" variant="ghost" className="bg-background border" disabled={true}>
          <Redo className="size-3" />
        </Button>
      </TooltipWrapper>

      {/* Reset Button */}
      <TooltipWrapper label="Reset to preset defaults">
        <Button
          size="icon"
          variant="ghost"
          className="bg-background border"
          onClick={restoreThemeCheckpoint}
          disabled={!hasThemeChangedFromCheckpoint()}
        >
          <RefreshCw className="size-3" />
        </Button>
      </TooltipWrapper>

      {/* Save Button */}
      <TooltipWrapper label="Save">
        <Button variant="ghost" className="bg-background border" disabled={false}>
          <Heart className="size-3" /> Save
        </Button>
      </TooltipWrapper>

      {/* Code Button */}
      <TooltipWrapper label="View theme code">
        <Button variant="ghost" className="bg-background border" disabled={false}>
          <Code className="size-3" /> Code
        </Button>
      </TooltipWrapper>

      {/* Open in Editor Button */}
      <TooltipWrapper label="Customize further in Editor">
        <Button
          variant="secondary"
          className="border"
          onClick={handleOpenInEditor}
          disabled={false}
        >
          <Edit className="size-3" /> Open in Editor
        </Button>
      </TooltipWrapper>
    </div>
  );
}
