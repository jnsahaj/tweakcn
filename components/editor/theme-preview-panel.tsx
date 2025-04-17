"use client";

import { ThemeEditorPreviewProps } from "@/types/theme";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import ColorPreview from "./theme-preview/color-preview";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container";
import { lazy } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, PanelRight, Moon, Sun } from "lucide-react";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/theme-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DemoCards = lazy(() => import("@/components/examples/demo-cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoTasks = lazy(() => import("@/components/examples/tasks"));
const DemoMusic = lazy(() => import("@/components/examples/music"));
const DemoDashboard = lazy(() => import("@/components/examples/dashboard"));

const ThemePreviewPanel = ({
  styles,
  currentMode,
  isCodePanelOpen,
  onCodePanelToggle,
}: ThemeEditorPreviewProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { theme, toggleTheme } = useTheme();

  if (!styles || !styles[currentMode]) {
    return null;
  }

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  return (
    <div
      className={cn(
        "max-h-full flex flex-col",
        isFullscreen && "fixed inset-0 z-50 bg-background p-4"
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Theme Preview</h2>
        <div className="flex items-center gap-0">
          {isFullscreen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleThemeToggle}
                  className="h-8 group"
                >
                  {theme === "light" ? (
                    <Sun className="size-4 group-hover:scale-120 transition-all" />
                  ) : (
                    <Moon className="size-4 group-hover:scale-120 transition-all" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Theme</TooltipContent>
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 group"
              >
                {isFullscreen ? (
                  <Minimize className="size-4 group-hover:scale-120 transition-all" />
                ) : (
                  <Maximize className="size-4 group-hover:scale-120 transition-all" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? "Exit full screen" : "Full screen"}
            </TooltipContent>
          </Tooltip>
          {!isCodePanelOpen && !isFullscreen && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCodePanelToggle(!isCodePanelOpen)}
                  className="h-8 invisible md:visible group"
                  aria-label="Show Code Panel"
                >
                  <PanelRight className="size-4 group-hover:scale-120 transition-all" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Hide Code Panel</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <Tabs defaultValue="cards" className="flex flex-col overflow-hidden">
          <TabsList className="inline-flex w-fit h-9 items-center justify-center rounded-full bg-background px-0 text-muted-foreground">
            <TabsTriggerPill value="cards">Cards</TabsTriggerPill>
            <div className="hidden md:flex">
              <TabsTriggerPill value="mail">Mail</TabsTriggerPill>
              <TabsTriggerPill value="tasks">Tasks</TabsTriggerPill>
              <TabsTriggerPill value="music">Music</TabsTriggerPill>
              <TabsTriggerPill value="dashboard">Dashboard</TabsTriggerPill>
            </div>
            <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>
          </TabsList>

          <ScrollArea className="rounded-lg border mt-2 flex flex-col flex-1">
            <div className="flex flex-col flex-1">
              <TabsContent
                value="cards"
                className="space-y-6 mt-0 py-4 px-4 h-full"
              >
                <ExamplesPreviewContainer>
                  <DemoCards />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="mail"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoMail />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="tasks"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoTasks />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="music"
                className="space-y-6 mt-0 h-full @container"
              >
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoMusic />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent
                value="dashboard"
                className="space-y-6 mt-0 h-full @container relative"
              >
                <ExamplesPreviewContainer className="min-w-[1400px]">
                  <DemoDashboard />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="colors" className="p-4 space-y-6">
                <ColorPreview styles={styles} currentMode={currentMode} />
              </TabsContent>

              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
};

export default ThemePreviewPanel;
