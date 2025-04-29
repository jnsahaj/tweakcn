"use client";

import React, { useEffect, use } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorConfig } from "@/types/editor";
import { Theme, ThemeStyles } from "@/types/theme";
import { Sliders } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { authClient } from "@/lib/auth-client";

interface EditorProps {
  config: EditorConfig;
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

const Editor: React.FC<EditorProps> = ({ config, themePromise }) => {
  const themeState = useEditorStore((state) => state.themeState);
  const setThemeState = useEditorStore((state) => state.setThemeState);
  const saveThemeCheckpoint = useEditorStore(
    (state) => state.saveThemeCheckpoint
  );
  const Controls = config.controls;
  const Preview = config.preview;

  const loadSavedPresets = useThemePresetStore(
    (state) => state.loadSavedPresets
  );

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      loadSavedPresets();
    }
  }, [loadSavedPresets, session?.user]);

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
      setThemeState({ ...prev, styles: initialTheme.styles });
      saveThemeCheckpoint();
    }
  }, [initialTheme, setThemeState, saveThemeCheckpoint]);

  if (initialTheme && !isThemeStyles(initialTheme.styles)) {
    return (
      <div className="flex justify-center items-center h-full text-destructive">
        Fetched theme data is invalid.
      </div>
    );
  }

  const styles = themeState.styles;

  return (
    <div className="h-full overflow-hidden">
      {/* Desktop Layout */}
      <div className="h-full hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full flex flex-col">
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
                themePromise={themePromise}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70} minSize={20}>
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0 flex flex-col">
                <Preview styles={styles} currentMode={themeState.currentMode} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="h-full md:hidden">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="w-full rounded-none">
            <TabsTrigger value="controls" className="flex-1">
              <Sliders className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="h-[calc(100%-2.5rem)] mt-0">
            <div className="h-full flex flex-col">
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                currentMode={themeState.currentMode}
                themePromise={themePromise}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100%-2.5rem)] mt-0">
            <div className="h-full flex flex-col">
              <Preview styles={styles} currentMode={themeState.currentMode} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor;
