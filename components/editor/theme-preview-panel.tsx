"use client";

import ShadcnBlocksLogo from "@/assets/shadcnblocks.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useThemeInspector } from "@/hooks/use-theme-inspector";
import { cn } from "@/lib/utils";
import { ThemeEditorPreviewProps } from "@/types/theme";
import { Inspect, Maximize, Minimize, MoreVertical } from "lucide-react";
import Link from "next/link";
import { lazy, useState } from "react";
import { HorizontalScrollArea } from "../horizontal-scroll-area";
import { ThemeToggle } from "../theme-toggle";
import { TooltipWrapper } from "../tooltip-wrapper";
import InspectorOverlay from "./inspector-overlay";
import ColorPreview from "./theme-preview/color-preview";
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";

const DemoCards = lazy(() => import("@/components/examples/cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoDashboard = lazy(() => import("@/components/examples/dashboard"));
const DemoPricing = lazy(() => import("@/components/examples/pricing/pricing"));
const TypographyDemo = lazy(() => import("@/components/examples/typography/typography-demo"));

const ThemePreviewPanel = ({ styles, currentMode }: ThemeEditorPreviewProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [activeTab, setActiveTab] = useState("cards");

  const {
    rootRef,
    inspector,
    inspectorEnabled,
    handleMouseMove,
    handleMouseLeave,
    toggleInspector,
  } = useThemeInspector();

  if (!styles || !styles[currentMode]) {
    return null;
  }

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
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsList>

            <div className="flex items-center gap-0.5">
              {isFullscreen && (
                <ThemeToggle
                  variant="ghost"
                  size="icon"
                  className="group size-8 hover:[&>svg]:scale-120 hover:[&>svg]:transition-all"
                />
              )}
              {/* Inspector toggle button */}
              <TooltipWrapper label="Toggle Inspector" asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleInspector}
                  className={cn(
                    "group size-8",
                    inspectorEnabled && "bg-accent text-accent-foreground w-auto"
                  )}
                >
                  <Inspect className="transition-all group-hover:scale-120" />
                  {inspectorEnabled && <span className="text-xs tracking-wide uppercase">on</span>}
                </Button>
              </TooltipWrapper>
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

          <section className="relative size-full overflow-hidden p-4 pt-1">
            <div
              className="relative isolate size-full overflow-hidden rounded-lg border"
              ref={rootRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <TabsContent value="cards" className="m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <DemoCards />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="dashboard" className="@container m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <DemoDashboard />
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="pricing" className="@container mt-0 h-full space-y-6">
                <ExamplesPreviewContainer className="size-full">
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
                  <ScrollArea className="size-full">
                    <DemoPricing />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="mail" className="@container m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <DemoMail />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="typography" className="m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <TypographyDemo />
                  </ScrollArea>
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="colors" className="m-0 size-full">
                <ScrollArea className="size-full">
                  <div className="p-4">
                    <ColorPreview styles={styles} currentMode={currentMode} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </section>
        </Tabs>
      </div>

      <InspectorOverlay inspector={inspector} enabled={inspectorEnabled} rootRef={rootRef} />
    </>
  );
};

export default ThemePreviewPanel;
