"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AiChatForm } from "./ai-chat-form";
import { SuggestedPillActions } from "./sugested-pill-actions";
import { PreviewPanel, TogglePreviewPanelButton } from "./toggle-preview-panel-button";

export function AiInterface() {
  const [isPreviewPanelOpen, setIsPreviewPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleTogglePreviewPanel = () => {
    console.log("Toggling preview panel");
    setIsPreviewPanelOpen((prev) => !prev);
  };

  return (
    <>
      <TooltipWrapper
        label={isPreviewPanelOpen ? "Collapse preview panel" : "Expand preview panel"}
        asChild
      >
        <TogglePreviewPanelButton
          className={cn(
            "absolute top-2 z-1",
            isPreviewPanelOpen && !isMobile ? "left-4" : "right-4"
          )}
          isOpen={isPreviewPanelOpen}
          handleTogglePreviewPanel={handleTogglePreviewPanel}
        />
      </TooltipWrapper>

      <section className="@container z-1 mx-auto flex max-w-[49rem] min-w-[max(30%,22rem)] flex-[30_1_0px] flex-col gap-4 p-4">
        <h1 className="animate-text from-foreground via-muted-foreground to-foreground bg-gradient-to-r bg-[200%_auto] bg-clip-text text-center text-[clamp(24px,7cqw,46px)] font-semibold tracking-tighter text-pretty text-transparent">
          What can I help you theme?
        </h1>
        <div className="relative mx-auto w-full content-center">
          <div className="relative isolate z-10 w-full space-y-4">
            <AiChatForm />
            <SuggestedPillActions />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--secondary),transparent_15%)] blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_15%)] blur-3xl"></div>
        </div>
      </section>

      <section
        className={cn(
          "isolate z-2 flex h-full flex-col overflow-hidden transition-all duration-300 ease-out max-md:hidden",
          isPreviewPanelOpen ? "w-full" : "w-0"
        )}
      >
        <PreviewPanel />
      </section>

      <Drawer open={isMobile && isPreviewPanelOpen} onOpenChange={setIsPreviewPanelOpen}>
        <DrawerContent className="flex max-h-[calc(90svh)] md:hidden">
          <DrawerTitle className="sr-only">Preview Panel</DrawerTitle>

          <section className="isolate flex flex-col overflow-hidden">
            {isMobile && <PreviewPanel />}
          </section>
        </DrawerContent>
      </Drawer>
    </>
  );
}
