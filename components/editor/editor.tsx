"use client";

import React, { useEffect, use } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Theme, ThemeStyles } from "@/types/theme";
import { Sliders } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { ActionBar } from "./action-bar/action-bar";
import ThemeControlPanel from "./theme-control-panel";
import ThemePreviewPanel from "./theme-preview-panel";

interface EditorProps {
  themePromise: Promise<Theme | null>;
}

const isThemeStyles = (styles: unknown): styles is ThemeStyles => {
  return (
    !!styles &&
    typeof styles === "object" &&
    styles !== null &&
    "light" in styles &&
    "dark" in styles
  );
};

const Editor: React.FC<EditorProps> = ({ themePromise }) => {
  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);

  const initialTheme = themePromise ? use(themePromise) : null;

  const handleStyleChange = React.useCallback(
    (newStyles: ThemeStyles) => {
      const prev = useEditorStore.getState().themeState;
      setThemeState({ ...prev, styles: newStyles });
    },
    [setThemeState]
  );

  useEffect(() => {
    if (initialTheme && isThemeStyles(initialTheme.styles)) {
      const prev = useEditorStore.getState().themeState;
      setThemeState({
        ...prev,
        styles: initialTheme.styles,
        preset: initialTheme.id,
      });
    }
  }, [initialTheme, setThemeState]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const prev = useEditorStore.getState().themeState;
      setThemeState({
        ...prev,
        currentMode: prefersDark ? "dark" : "light",
      });
    }
  }, [setThemeState]);

  if (initialTheme && !isThemeStyles(initialTheme.styles)) {
    return (
      <div className="text-destructive flex h-full items-center justify-center">
        Fetched theme data is invalid.
      </div>
    );
  }

  const styles = themeState.styles;

  return (
    <div className="relative isolate flex flex-1 overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden size-full md:block">
        <ResizablePanelGroup direction="horizontal" className="isolate">
          <ResizablePanel
            defaultSize={30}
            minSize={20}
            maxSize={40}
            className="z-1 min-w-[max(20%,22rem)]"
          >
            <div className="relative isolate flex h-full flex-1 flex-col">
              <ThemeControlPanel
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
                themePromise={themePromise}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full flex-col">
              <div className="flex min-h-0 flex-1 flex-col">
                <ActionBar />
                <ThemePreviewPanel styles={styles} currentMode={themeState.currentMode} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      {/* Mobile Layout */}
      <div className="h-full w-full flex-1 overflow-hidden md:hidden">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="controls" className="flex-1">
              <Sliders className="mr-2 h-4 w-4" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="mt-0 h-[calc(100%-2.5rem)]">
            <div className="flex h-full flex-col">
              <ThemeControlPanel
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
                themePromise={themePromise}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="mt-0 h-[calc(100%-2.5rem)]">
            <div className="flex h-full flex-col">
              <ActionBar />
              <ThemePreviewPanel styles={styles} currentMode={themeState.currentMode} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor;
