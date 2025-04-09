import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorConfig, BaseEditorState, ThemeEditorState } from "@/types/editor";
import { ThemeStyles } from "@/types/theme";
import CodePanel from "./code-panel";
import { Sliders } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useToast } from "@/components/ui/use-toast";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";

interface EditorProps {
  config: EditorConfig;
  initialState?: BaseEditorState;
}

const isThemeStyles = (styles: any): styles is ThemeStyles => {
  return !!styles && "light" in styles && "dark" in styles;
};

const Editor: React.FC<EditorProps> = ({ config }) => {
  const { themeState, setThemeState, resetToDefault, hasStateChanged } =
    useEditorStore();
  const { toast } = useToast();
  const Controls = config.controls;
  const Preview = config.preview;
  const [isCodePanelOpen, setIsCodePanelOpen] = useState(true);

  const hasChanges = hasStateChanged(config.type);

  const handleStyleChange = (newStyles: ThemeStyles) => {
    setThemeState({ ...themeState, styles: newStyles });
  };

  const handleReset = () => {
    resetToDefault(config.type);
    toast({
      title: "Reset successful",
      description: "All settings have been restored to their default values.",
    });
  };

  // Ensure we have valid theme styles
  const styles = !isThemeStyles(themeState.styles)
    ? (config.defaultState as ThemeEditorState).styles
    : themeState.styles;

  return (
    <div className="h-full overflow-hidden">
      {/* Desktop Layout */}
      <div className="h-full hidden md:block">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <div className="h-full p-4">
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                onReset={handleReset}
                hasChanges={hasChanges}
                currentMode={themeState.currentMode}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <Collapsible open={isCodePanelOpen} className="h-full">
                  <div className="h-full flex">
                    <div className="flex-1 p-4">
                      <Preview
                        styles={styles}
                        currentMode={themeState.currentMode}
                        isCodePanelOpen={isCodePanelOpen}
                        onCodePanelToggle={() =>
                          setIsCodePanelOpen(!isCodePanelOpen)
                        }
                      />
                    </div>

                    <CollapsibleContent className="w-1/3 border-l transition-all">
                      <CodePanel
                        config={config}
                        themeEditorState={themeState}
                        onCodePanelToggle={() =>
                          setIsCodePanelOpen(!isCodePanelOpen)
                        }
                      />
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Mobile Layout */}
      <div className="h-full md:hidden">
        <Tabs defaultValue="controls" className="h-full">
          <TabsList className="w-full">
            <TabsTrigger value="controls" className="flex-1">
              <Sliders className="h-4 w-4 mr-2" />
              Controls
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">
              Preview
            </TabsTrigger>
            <TabsTrigger value="code" className="flex-1">
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="controls" className="h-[calc(100%-2.5rem)]">
            <div className="h-full p-4">
              <Controls
                styles={styles}
                onChange={handleStyleChange}
                onReset={handleReset}
                hasChanges={hasChanges}
                currentMode={themeState.currentMode}
              />
            </div>
          </TabsContent>
          <TabsContent value="preview" className="h-[calc(100%-2.5rem)]">
            <div className="h-full p-4">
              <Preview
                styles={styles}
                currentMode={themeState.currentMode}
                isCodePanelOpen={isCodePanelOpen}
                onCodePanelToggle={() => setIsCodePanelOpen(!isCodePanelOpen)}
              />
            </div>
          </TabsContent>
          <TabsContent value="code" className="h-[calc(100%-2.5rem)]">
            <CodePanel
              config={config}
              themeEditorState={themeState}
              onCodePanelToggle={() => setIsCodePanelOpen(!isCodePanelOpen)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Editor;
