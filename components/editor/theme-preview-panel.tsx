"use client";

import ShadcnBlocksLogo from "@/assets/shadcnblocks.svg";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { useDialogActions } from "@/hooks/use-dialog-actions";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useThemeInspector } from "@/hooks/use-theme-inspector";
import { cn } from "@/lib/utils";
import { ThemeEditorPreviewProps } from "@/types/theme";
import { Inspect, Maximize, Minimize, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { lazy } from "react";
import InspectorOverlay from "./inspector-overlay";
import ColorPreview from "./theme-preview/color-preview";
import ExamplesPreviewContainer from "./theme-preview/examples-preview-container";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";

const DemoCards = lazy(() => import("@/components/examples/cards"));
const DemoMail = lazy(() => import("@/components/examples/mail"));
const DemoDashboard = lazy(() => import("@/components/examples/dashboard"));
const DemoPricing = lazy(() => import("@/components/examples/pricing/pricing"));
const TypographyDemo = lazy(() => import("@/components/examples/typography/typography-demo"));
const CustomDemo = lazy(() => import("@/components/examples/custom"));

const V0Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
      fill="currentColor"
    />
    <path
      d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
      fill="currentColor"
    />
  </svg>
);

const ThemePreviewPanel = ({ styles, currentMode }: ThemeEditorPreviewProps) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [activeTab, setActiveTab] = useQueryState("p", {
    defaultValue: "cards",
  });
  const { handleOpenInV0 } = useDialogActions();

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
              <TabsTriggerPill value="custom">Custom</TabsTriggerPill>
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
              <TooltipWrapper label="Open theme in v0" asChild>
                <Button variant="ghost" onClick={() => handleOpenInV0()} className="group px-2.5">
                  <span className="flex items-center justify-center gap-1 transition-all group-hover:scale-110">
                    Open in <V0Logo className="mb-0.5 !size-5" />
                  </span>
                </Button>
              </TooltipWrapper>
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
                asChild
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

              <TabsContent value="custom" className="@container m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <CustomDemo />
                </ExamplesPreviewContainer>
              </TabsContent>

              <TabsContent value="dashboard" className="@container m-0 size-full">
                <ExamplesPreviewContainer className="size-full">
                  <ScrollArea className="size-full">
                    <div className="size-full min-w-[1400px]">
                      <DemoDashboard />
                    </div>
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
                    <div className="size-full min-w-[1300px]">
                      <DemoMail />
                    </div>
                    <ScrollBar orientation="horizontal" />
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
