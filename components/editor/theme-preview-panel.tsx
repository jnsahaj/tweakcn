"use client";

import ShadcnBlocksLogo from "@/assets/shadcnblocks.svg";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { cn } from "@/lib/utils";
import { ThemeEditorPreviewProps } from "@/types/theme";
import { Maximize, Minimize, Moon, MoreVertical, Sun } from "lucide-react";
import Link from "next/link";
import { lazy, useState } from "react";
import { HorizontalScrollArea } from "../horizontal-scroll-area";
import { TooltipWrapper } from "../tooltip-wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ColorPreview from "./theme-preview/color-preview";
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";

const DemoCards = lazy(() => import("@/components/examples/cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoTasks = lazy(() => import("@/components/examples/tasks"));
const DemoMusic = lazy(() => import("@/components/examples/music"));
const DemoDashboard = lazy(() => import("@/components/examples/dashboard"));
const DemoPricing = lazy(() => import("@/components/examples/pricing/pricing"));
const TypographyDemo = lazy(() => import("@/components/examples/typography/typography-demo"));

const ThemePreviewPanel = ({ styles, currentMode }: ThemeEditorPreviewProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("cards");

  if (!styles || !styles[currentMode]) {
    return null;
  }

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    toggleTheme({ x, y });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <>
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          isFullscreen && "bg-background fixed inset-0 z-50"
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <HorizontalScrollArea className="mt-2 mb-1 flex w-full items-center justify-between px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="cards">Cards</TabsTriggerPill>
              <div className="hidden md:flex">
                <TabsTriggerPill value="dashboard">Dashboard</TabsTriggerPill>
                <TabsTriggerPill value="mail">Mail</TabsTriggerPill>
              </div>
              <TabsTriggerPill value="pricing">Pricing</TabsTriggerPill>
              <TabsTriggerPill value="colors">Color Palette</TabsTriggerPill>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TooltipWrapper label="More previews" asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical />
                    </Button>
                  </TooltipWrapper>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleTabChange("typography")}>
                    Typography
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTabChange("tasks")}
                    className="hidden md:flex"
                  >
                    Tasks
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleTabChange("music")}
                    className="hidden md:flex"
                  >
                    Music
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>

            <div className="flex items-center gap-0">
              {isFullscreen && (
                <TooltipWrapper label="Toggle Theme" asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleThemeToggle}
                    className="group size-8"
                  >
                    {theme === "light" ? (
                      <Sun className="transition-all group-hover:scale-120" />
                    ) : (
                      <Moon className="transition-all group-hover:scale-120" />
                    )}
                  </Button>
                </TooltipWrapper>
              )}
              <TooltipWrapper
                label={isFullscreen ? "Exit full screen" : "Full screen"}
                className="hidden md:inline-flex"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="group size-8"
                >
                  {isFullscreen ? (
                    <Minimize className="transition-all group-hover:scale-120" />
                  ) : (
                    <Maximize className="transition-all group-hover:scale-120" />
                  )}
                </Button>
              </TooltipWrapper>
            </div>
          </HorizontalScrollArea>

          <ScrollArea className="relative m-4 mt-1 flex flex-1 flex-col overflow-hidden rounded-lg border">
            <div className="flex h-full flex-1 flex-col">
              <TabsContent value="cards" className="m-0 h-full">
                <ExamplesPreviewContainer>
                  <DemoCards />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="dashboard" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer className="min-w-[1400px]">
                  <DemoDashboard />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="pricing" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer>
                  <div className="absolute top-4 right-4 z-10">
                    <Link
                      href="https://shadcnblocks.com?utm_source=tweakcn&utm_medium=theme-editor-preview"
                      target="_blank"
                    >
                      <Button variant="outline" className="group h-12 shadow-sm">
                        <div className="flex items-center gap-2">
                          <ShadcnBlocksLogo
                            className="shrink-0"
                            style={{ width: "24px", height: "24px" }}
                          />
                          <div className="text-left">
                            <div className="font-bold">Shadcnblocks.com</div>
                            <div className="text-muted-foreground group-hover:text-accent-foreground text-xs transition-colors">
                              600+ extra shadcn blocks
                            </div>
                          </div>
                        </div>
                      </Button>
                    </Link>
                  </div>
                  <DemoPricing />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="mail" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoMail />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="tasks" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoTasks />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="music" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer className="min-w-[1300px]">
                  <DemoMusic />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="typography" className="space-y-6 p-4">
                <ExamplesPreviewContainer>
                  <TypographyDemo />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="colors" className="space-y-6 p-4">
                <ColorPreview styles={styles} currentMode={currentMode} />
              </TabsContent>

              <ScrollBar orientation="horizontal" />
            </div>
          </ScrollArea>
        </Tabs>
      </div>
    </>
  );
};

export default ThemePreviewPanel;
