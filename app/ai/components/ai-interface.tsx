"use client";

import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { useTheme } from "@/components/theme-provider";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useAIThemeGenerationResult } from "@/hooks/use-ai-theme-generation";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { useEffect, useRef, useState } from "react";
import { ImperativePanelGroupHandle } from "react-resizable-panels";
import { usePreviewPanel } from "../hooks/use-preview-panel";
import { AIChatForm } from "./ai-chat-form";
import { ChatHeading } from "./chat-heading";
import { ClosableSuggestedPillActions, SuggestedPillActions } from "./suggested-pill-actions";

export function AIInterface() {
  const isMobile = useIsMobile();
  const { themeState } = useEditorStore();
  const { theme: mode } = useTheme();
  const { hasPrompted } = useAIThemeGenerationResult();

  // Resizable panel
  const { isPreviewPanelOpen, setIsPreviewPanelOpen } = usePreviewPanel();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const [lastOpenLayout, setLastOpenLayout] = useState<number[]>([30, 70]);

  useEffect(() => {
    const panelGroup = panelGroupRef.current;
    if (!panelGroup) return;

    if (isMobile) {
      return;
    }

    if (isPreviewPanelOpen) {
      panelGroup.setLayout(lastOpenLayout); // Restore last open layout
    } else {
      // Before closing, capture the current layout if it was open
      const currentLayout = panelGroup.getLayout();
      if (currentLayout[1] > 1) {
        // If preview panel had some size
        setLastOpenLayout(currentLayout);
      }
      panelGroup.setLayout([100, 0]); // Collapse preview panel
    }
  }, [isPreviewPanelOpen, lastOpenLayout, isMobile]);

  return (
    <div className="relative isolate flex flex-1 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" ref={panelGroupRef} className="isolate">
        {/* Chat section */}
        <ResizablePanel
          defaultSize={isPreviewPanelOpen ? lastOpenLayout[0] : 100}
          minSize={30}
          className="z-1 min-w-[max(30%,22rem)]"
        >
          <section className="@container relative isolate z-1 mx-auto flex h-full max-w-[49rem] flex-col justify-center px-4">
            <ChatHeading />

            {/* TODO: Chat messages */}

            {/* Chat form input and suggestions */}
            <div className="relative mx-auto flex w-full flex-col">
              <div className="relative isolate z-10 w-full">
                {hasPrompted && <ClosableSuggestedPillActions />}

                <AIChatForm />

                {/* Background gradients */}
                <div
                  className={cn(
                    "animate-in fade-in pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_10%_70%,var(--secondary),transparent_15%)] blur-2xl duration-500",
                    hasPrompted ? "opacity-0" : "opacity-100 dark:opacity-50"
                  )}
                />
                <div
                  className={cn(
                    "animate-in fade-in pointer-events-none absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_15%)] blur-2xl duration-500",
                    hasPrompted ? "opacity-0" : "opacity-100 dark:opacity-50"
                  )}
                />
              </div>

              {/* Quick suggestions */}
              {!hasPrompted && (
                <HorizontalScrollArea className="mx-auto pt-4 pb-2">
                  <SuggestedPillActions />
                </HorizontalScrollArea>
              )}
            </div>

            <p className="text-muted-foreground truncate py-2 text-center text-xs tracking-tight">
              tweakcn may make mistakes. Please use with discretion.
            </p>
          </section>
        </ResizablePanel>

        {!isMobile && isPreviewPanelOpen && (
          <ResizableHandle className="after:hover:bg-muted z-1" />
        )}

        {/* Preview section */}
        {!isMobile && (
          <ResizablePanel
            defaultSize={isPreviewPanelOpen ? lastOpenLayout[1] : 0}
            maxSize={70}
            minSize={isPreviewPanelOpen ? 40 : 0}
            className="z-2"
          >
            <section
              className={cn("isolate z-2 flex h-full flex-col overflow-hidden max-md:hidden")}
            >
              <ThemePreviewPanel styles={themeState.styles} currentMode={mode} />
            </section>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      <Drawer open={isMobile && isPreviewPanelOpen} onOpenChange={setIsPreviewPanelOpen}>
        <DrawerContent className="flex max-h-[calc(90svh)] md:hidden">
          <DrawerTitle className="sr-only">Preview Panel</DrawerTitle>

          <section className="isolate flex flex-col overflow-hidden">
            {isMobile && <ThemePreviewPanel styles={themeState.styles} currentMode={mode} />}
          </section>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
