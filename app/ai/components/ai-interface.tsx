"use client";

import ThemePreviewPanel from "@/components/editor/theme-preview-panel";
import { useTheme } from "@/components/theme-provider";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/editor-store";
import { usePreviewPanel } from "../hooks/use-preview-panel";
import { AIChatForm } from "./ai-chat-form";
import { SuggestedPillActions } from "./suggested-pill-actions";

export function AIInterface() {
  const { isPreviewPanelOpen, setIsPreviewPanelOpen } = usePreviewPanel();
  const isMobile = useIsMobile();
  const { themeState } = useEditorStore();
  const { theme: mode } = useTheme();

  return (
    <>
      <section className="@container relative isolate z-1 mx-auto flex max-w-[49rem] min-w-[max(30%,22rem)] flex-[30_1_0px] flex-col gap-4 p-4">
        <h1 className="animate-text from-foreground via-muted-foreground to-foreground bg-gradient-to-r bg-[200%_auto] bg-clip-text text-center text-[clamp(24px,7cqw,46px)] font-semibold tracking-tighter text-pretty text-transparent">
          What can I help you theme?
        </h1>
        <div className="relative mx-auto w-full content-center">
          <div className="relative isolate z-10 w-full space-y-4">
            <AIChatForm />
            <SuggestedPillActions />
          </div>
          <div className="animate-in fade-in absolute inset-0 bg-[radial-gradient(ellipse_at_10%_70%,var(--secondary),transparent_10%)] blur-3xl duration-1000"></div>
          <div className="animate-in fade-in absolute inset-0 bg-[radial-gradient(ellipse_at_90%_30%,var(--primary),transparent_15%)] blur-3xl duration-1000"></div>
        </div>
      </section>

      <section
        className={cn(
          "isolate z-2 flex h-full flex-col overflow-hidden transition-all duration-300 ease-out max-md:hidden",
          isPreviewPanelOpen ? "w-full" : "w-0"
        )}
      >
        <ThemePreviewPanel styles={themeState.styles} currentMode={mode} />
      </section>

      <Drawer open={isMobile && isPreviewPanelOpen} onOpenChange={setIsPreviewPanelOpen}>
        <DrawerContent className="flex max-h-[calc(90svh)] md:hidden">
          <DrawerTitle className="sr-only">Preview Panel</DrawerTitle>

          <section className="isolate flex flex-col overflow-hidden">
            {isMobile && <ThemePreviewPanel styles={themeState.styles} currentMode={mode} />}
          </section>
        </DrawerContent>
      </Drawer>
    </>
  );
}
