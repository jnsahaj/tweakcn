"use client";

import { Sparkles } from "lucide-react";
import React, { use } from "react";

import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { COMMON_STYLES, defaultThemeState } from "@/config/theme";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useControlsTabFromUrl, type ControlTab } from "@/hooks/use-controls-tab-from-url";
import { useEditorStore } from "@/store/editor-store";
import { ThemeEditorControlsProps } from "@/types/theme";
import { ENTITY_MAP, type EntityName } from "@/lib/scroll-to-entity";
import { HorizontalScrollArea } from "../horizontal-scroll-area";
import { AIInterface } from "./ai/ai-interface";
import { ColorControlsTab } from "./color-controls-tab";
import { ControlSectionRef } from "./control-section";
import { OtherControlsTab } from "./other-controls-tab";
import ThemeEditActions from "./theme-edit-actions";
import ThemePresetSelect from "./theme-preset-select";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";
import { TypographyControlsTab } from "./typography-controls-tab";

const ThemeControlPanel = ({
  styles,
  currentMode,
  onChange,
  themePromise,
}: ThemeEditorControlsProps) => {
  const {} = useEditorStore();
  const { tab, handleSetTab } = useControlsTabFromUrl();
  const { loading: aiGenerationLoading } = useAIThemeGeneration();

  const sectionRefs = React.useMemo(() => ({
    "Primary Colors": React.createRef<ControlSectionRef>(),
    "Secondary Colors": React.createRef<ControlSectionRef>(),
    "Accent Colors": React.createRef<ControlSectionRef>(),
    "Base Colors": React.createRef<ControlSectionRef>(),
    "Card Colors": React.createRef<ControlSectionRef>(),
    "Popover Colors": React.createRef<ControlSectionRef>(),
    "Muted Colors": React.createRef<ControlSectionRef>(),
    "Destructive Colors": React.createRef<ControlSectionRef>(),
    "Border & Input Colors": React.createRef<ControlSectionRef>(),
    "Chart Colors": React.createRef<ControlSectionRef>(),
    "Sidebar Colors": React.createRef<ControlSectionRef>(),
    "Font Family": React.createRef<ControlSectionRef>(),
    "Letter Spacing": React.createRef<ControlSectionRef>(),
    "HSL Adjustments": React.createRef<ControlSectionRef>(),
    "Radius": React.createRef<ControlSectionRef>(),
    "Spacing": React.createRef<ControlSectionRef>(),
    "Shadow": React.createRef<ControlSectionRef>(),
  }), []);

  const currentStyles = React.useMemo(
    () => ({
      ...defaultThemeState.styles[currentMode],
      ...styles?.[currentMode],
    }),
    [currentMode, styles]
  );

  const updateStyle = React.useCallback(
    <K extends keyof typeof currentStyles>(key: K, value: (typeof currentStyles)[K]) => {
      // apply common styles to both light and dark modes
      if (COMMON_STYLES.includes(key)) {
        onChange({
          ...styles,
          light: { ...styles.light, [key]: value },
          dark: { ...styles.dark, [key]: value },
        });
        return;
      }

      onChange({
        ...styles,
        [currentMode]: {
          ...currentStyles,
          [key]: value,
        },
      });
    },
    [onChange, styles, currentMode, currentStyles]
  );

  const scrollTo = React.useCallback((tab: ControlTab, entity: EntityName) => {
    const entityInfo = ENTITY_MAP[entity];
    if (!entityInfo) {
      console.warn(`Entity "${entity}" not found in entity map`);
      return;
    }

    if (tab !== entityInfo.tab) {
      console.warn(`Entity "${entity}" is not in tab "${tab}". Switching to correct tab "${entityInfo.tab}"`);
    }
    handleSetTab(entityInfo.tab as ControlTab);

    setTimeout(() => {
      const sectionRef = sectionRefs[entityInfo.section];
      if (sectionRef?.current) {
        sectionRef.current.expand();
        
        setTimeout(() => {
          const entityElement = document.getElementById(`color-${entity.replace(/\s+/g, "-").toLowerCase()}`) ||
                               document.querySelector(`[data-entity="${entity}"]`) ||
                               document.querySelector(`label[for*="${entity}"]`)?.closest('.mb-3, .mb-4');
          
          if (entityElement) {
            entityElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const highlightElement = entityElement.closest('.mb-3, .mb-4') || entityElement;
            highlightElement.classList.add('animate-pulse', 'ring-2', 'ring-primary', 'ring-opacity-50');
            
            setTimeout(() => {
              highlightElement.classList.remove('animate-pulse', 'ring-2', 'ring-primary', 'ring-opacity-50');
            }, 2000);
          } else {
            sectionRef.current?.scrollIntoView();
          }
        }, 250);
      }
    }, 100);
  }, [handleSetTab, sectionRefs]);

  React.useEffect(() => {
    (window as unknown as { scrollToThemeEntity?: typeof scrollTo }).scrollToThemeEntity = scrollTo;
    return () => {
      delete (window as unknown as { scrollToThemeEntity?: typeof scrollTo }).scrollToThemeEntity;
    };
  }, [scrollTo]);

  // Ensure we have valid styles for the current mode
  if (!currentStyles) {
    return null; // Or some fallback UI
  }

  const radius = parseFloat(currentStyles.radius.replace("rem", ""));

  const theme = use(themePromise);

  return (
    <>
      <div className="border-b">
        {!theme ? (
          <ThemePresetSelect className="h-14 rounded-none" disabled={aiGenerationLoading} />
        ) : (
          <ThemeEditActions theme={theme} disabled={aiGenerationLoading} />
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <Tabs
          value={tab}
          onValueChange={(v) => handleSetTab(v as ControlTab)}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <HorizontalScrollArea className="mt-2 mb-1 px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="colors">Colors</TabsTriggerPill>
              <TabsTriggerPill value="typography">Typography</TabsTriggerPill>
              <TabsTriggerPill value="other">Other</TabsTriggerPill>
              <TabsTriggerPill
                value="ai"
                className="data-[state=active]:[--effect:var(--secondary-foreground)] data-[state=active]:[--foreground:var(--muted-foreground)] data-[state=active]:[--muted-foreground:var(--effect)]"
              >
                <Sparkles className="mr-1 size-3.5 text-current" />
                <span className="animate-text via-foreground from-muted-foreground to-muted-foreground flex items-center gap-1 bg-gradient-to-r from-50% via-60% to-100% bg-[200%_auto] bg-clip-text text-sm text-transparent">
                  Generate
                </span>
              </TabsTriggerPill>
            </TabsList>
          </HorizontalScrollArea>

          <TabsContent value="colors" className="mt-1 size-full overflow-hidden">
            <ColorControlsTab
              currentStyles={currentStyles}
              updateStyle={updateStyle}
              sectionRefs={sectionRefs}
            />
          </TabsContent>

          <TabsContent value="typography" className="mt-1 size-full overflow-hidden">
            <TypographyControlsTab
              currentStyles={currentStyles}
              updateStyle={updateStyle}
              sectionRefs={sectionRefs}
            />
          </TabsContent>

          <TabsContent value="other" className="mt-1 size-full overflow-hidden">
            <OtherControlsTab
              currentStyles={currentStyles}
              updateStyle={updateStyle}
              sectionRefs={sectionRefs}
              radius={radius}
            />
          </TabsContent>

          <TabsContent value="ai" className="mt-1 size-full overflow-hidden">
            <AIInterface />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ThemeControlPanel;
