"use client";

import { useTheme } from "@/components/theme-provider";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { DialogActionsProvider, useDialogActions } from "@/hooks/use-dialog-actions";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { ChevronDown, ChevronUp, Code, Edit, Heart, Moon, RefreshCw, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePreviewPanel } from "../hooks/use-preview-panel";
import { TogglePreviewPanelButton } from "./toggle-preview-panel-button";

export function Toolbar() {
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  return (
    <DialogActionsProvider>
      {/* Mobile Toolbar */}
      <div className="bg-background z-10 overflow-hidden border-b transition-all duration-200 md:hidden">
        <ScrollArea className="isolate mx-auto flex w-full justify-center overflow-x-auto">
          <div className="isolate mx-auto flex w-full justify-center px-4 py-2">
            <ToolbarActions />
          </div>
          <ScrollBar orientation="horizontal" className="h-2" />
        </ScrollArea>
      </div>

      {/* Desktop Toolbar */}
      <div
        className={cn(
          "group/toolbar fixed inset-x-0 bottom-6 isolate z-50 mx-auto hidden w-fit transition-all duration-200 md:flex",
          isToolbarOpen ? "translate-y-0" : "bottom-0 translate-y-full"
        )}
      >
        <div
          className={cn(
            "animate-in fade-in absolute inset-0 z-[-1] blur-sm transition-all duration-1000",
            isToolbarOpen ? "bg-foreground/10" : "bg-transparent"
          )}
        />
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

        <div className="bg-background ring-border/30 rounded-lg border p-2 shadow ring">
          <ToolbarActions />
        </div>
      </div>
    </DialogActionsProvider>
  );
}

function ToolbarActions() {
  const { hasUnsavedChanges, resetToCurrentPreset } = useEditorStore();

  const isMobile = useIsMobile();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { loading: aiGenerateLoading } = useAIThemeGeneration();
  const { isPreviewPanelOpen } = usePreviewPanel();

  const { handleSaveClick, setCodePanelOpen } = useDialogActions();

  const handleOpenInEditor = () => {
    router.push("/editor/theme");
  };

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  const handleOpenCodePanel = () => {
    setCodePanelOpen(true);
  };

  const handleOpenSaveDialog = () => {
    handleSaveClick({ shareAfterSave: true });
  };

  return (
    <div className="flex items-center gap-1.5">
      {/* Theme Toggle Button */}
      <TooltipWrapper label="Toggle theme">
        <Button
          size="icon"
          variant="ghost"
          className="bg-background border"
          disabled={aiGenerateLoading}
          onClick={handleThemeToggle}
        >
          {theme === "light" ? <Moon className="size-3" /> : <Sun className="size-3" />}
        </Button>
      </TooltipWrapper>

      {/* Reset Button */}
      <TooltipWrapper label="Reset to preset defaults">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "default"}
          className="bg-background border"
          onClick={resetToCurrentPreset}
          disabled={!hasUnsavedChanges() || aiGenerateLoading}
        >
          <RefreshCw className="size-3" /> <span className="hidden md:block">Reset</span>
        </Button>
      </TooltipWrapper>

      {/* Save Button */}
      <TooltipWrapper label="Save theme">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "default"}
          className="bg-background border"
          onClick={handleOpenSaveDialog}
          disabled={aiGenerateLoading}
        >
          <Heart className="size-3" /> <span className="hidden md:block">Save</span>
        </Button>
      </TooltipWrapper>

      {/* Code Button */}
      <TooltipWrapper label="View theme code">
        <Button
          variant="ghost"
          size={isMobile ? "icon" : "default"}
          className="bg-background border"
          onClick={handleOpenCodePanel}
          disabled={aiGenerateLoading}
        >
          <Code className="size-3" /> <span className="hidden md:block">Code</span>
        </Button>
      </TooltipWrapper>

      {/* Open in Editor Button */}
      <TooltipWrapper label="Customize further in Editor">
        <Button
          variant="secondary"
          className="border shadow-none"
          onClick={handleOpenInEditor}
          disabled={aiGenerateLoading}
        >
          <Edit className="size-3" /> Open in Editor
        </Button>
      </TooltipWrapper>

      <TooltipWrapper
        label={isPreviewPanelOpen ? "Hide preview panel" : "Show preview panel"}
        asChild
      >
        <TogglePreviewPanelButton variant="ghost" className="border" />
      </TooltipWrapper>
    </div>
  );
}
