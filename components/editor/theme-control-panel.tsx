"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import React, { use } from "react";

import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import {
  COMMON_STYLES,
  DEFAULT_FONT_MONO,
  DEFAULT_FONT_SANS,
  DEFAULT_FONT_SERIF,
  defaultThemeState,
} from "@/config/theme";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { useControlsTabFromUrl, type ControlTab } from "@/hooks/use-controls-tab-from-url";
import { useEditorStore } from "@/store/editor-store";
import { ThemeEditorControlsProps, ThemeStyleProps } from "@/types/theme";
import { getAppliedThemeFont, monoFonts, sansSerifFonts, serifFonts } from "@/utils/theme-fonts";
import { HorizontalScrollArea } from "../horizontal-scroll-area";
import { AIInterface } from "./ai/ai-interface";
import ColorPicker from "./color-picker";
import ControlSection, { ControlSectionRef } from "./control-section";
import HslAdjustmentControls from "./hsl-adjustment-controls";
import ShadowControl from "./shadow-control";
import { SliderWithInput } from "./slider-with-input";
import ThemeEditActions from "./theme-edit-actions";
import ThemeFontSelect from "./theme-font-select";
import ThemePresetSelect from "./theme-preset-select";
import TabsTriggerPill from "./theme-preview/tabs-trigger-pill";

const ENTITY_MAP = {
  "primary": { tab: "colors", section: "Primary Colors" },
  "primary-foreground": { tab: "colors", section: "Primary Colors" },
  "secondary": { tab: "colors", section: "Secondary Colors" },
  "secondary-foreground": { tab: "colors", section: "Secondary Colors" },
  "accent": { tab: "colors", section: "Accent Colors" },
  "accent-foreground": { tab: "colors", section: "Accent Colors" },
  "background": { tab: "colors", section: "Base Colors" },
  "foreground": { tab: "colors", section: "Base Colors" },
  "card": { tab: "colors", section: "Card Colors" },
  "card-foreground": { tab: "colors", section: "Card Colors" },
  "popover": { tab: "colors", section: "Popover Colors" },
  "popover-foreground": { tab: "colors", section: "Popover Colors" },
  "muted": { tab: "colors", section: "Muted Colors" },
  "muted-foreground": { tab: "colors", section: "Muted Colors" },
  "destructive": { tab: "colors", section: "Destructive Colors" },
  "destructive-foreground": { tab: "colors", section: "Destructive Colors" },
  "border": { tab: "colors", section: "Border & Input Colors" },
  "input": { tab: "colors", section: "Border & Input Colors" },
  "ring": { tab: "colors", section: "Border & Input Colors" },
  "chart-1": { tab: "colors", section: "Chart Colors" },
  "chart-2": { tab: "colors", section: "Chart Colors" },
  "chart-3": { tab: "colors", section: "Chart Colors" },
  "chart-4": { tab: "colors", section: "Chart Colors" },
  "chart-5": { tab: "colors", section: "Chart Colors" },
  "sidebar": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-primary": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-primary-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-accent": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-accent-foreground": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-border": { tab: "colors", section: "Sidebar Colors" },
  "sidebar-ring": { tab: "colors", section: "Sidebar Colors" },
  "font-sans": { tab: "typography", section: "Font Family" },
  "font-serif": { tab: "typography", section: "Font Family" },
  "font-mono": { tab: "typography", section: "Font Family" },
  "letter-spacing": { tab: "typography", section: "Letter Spacing" },
  "hue-shift": { tab: "other", section: "HSL Adjustments" },
  "saturation-multiplier": { tab: "other", section: "HSL Adjustments" },
  "lightness-multiplier": { tab: "other", section: "HSL Adjustments" },
  "radius": { tab: "other", section: "Radius" },
  "spacing": { tab: "other", section: "Spacing" },
  "shadow-color": { tab: "other", section: "Shadow" },
  "shadow-opacity": { tab: "other", section: "Shadow" },
  "shadow-blur": { tab: "other", section: "Shadow" },
  "shadow-spread": { tab: "other", section: "Shadow" },
  "shadow-offset-x": { tab: "other", section: "Shadow" },
  "shadow-offset-y": { tab: "other", section: "Shadow" },
} as const;

type EntityName = keyof typeof ENTITY_MAP;

const ThemeControlPanel = ({
  styles,
  currentMode,
  onChange,
  themePromise,
}: ThemeEditorControlsProps) => {
  const { themeState } = useEditorStore();
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
            <ScrollArea className="h-full px-4">
              <ControlSection title="Primary Colors" id="primary-colors" expanded ref={sectionRefs["Primary Colors"]}>
                <div data-entity="primary">
                  <ColorPicker
                    color={currentStyles.primary}
                    onChange={(color) => updateStyle("primary", color)}
                    label="Primary"
                  />
                </div>
                <div data-entity="primary-foreground">
                  <ColorPicker
                    color={currentStyles["primary-foreground"]}
                    onChange={(color) => updateStyle("primary-foreground", color)}
                    label="Primary Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Secondary Colors" expanded ref={sectionRefs["Secondary Colors"]}>
                <div data-entity="secondary">
                  <ColorPicker
                    color={currentStyles.secondary}
                    onChange={(color) => updateStyle("secondary", color)}
                    label="Secondary"
                  />
                </div>
                <div data-entity="secondary-foreground">
                  <ColorPicker
                    color={currentStyles["secondary-foreground"]}
                    onChange={(color) => updateStyle("secondary-foreground", color)}
                    label="Secondary Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Accent Colors" ref={sectionRefs["Accent Colors"]}>
                <div data-entity="accent">
                  <ColorPicker
                    color={currentStyles.accent}
                    onChange={(color) => updateStyle("accent", color)}
                    label="Accent"
                  />
                </div>
                <div data-entity="accent-foreground">
                  <ColorPicker
                    color={currentStyles["accent-foreground"]}
                    onChange={(color) => updateStyle("accent-foreground", color)}
                    label="Accent Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Base Colors" ref={sectionRefs["Base Colors"]}>
                <div data-entity="background">
                  <ColorPicker
                    color={currentStyles.background}
                    onChange={(color) => updateStyle("background", color)}
                    label="Background"
                  />
                </div>
                <div data-entity="foreground">
                  <ColorPicker
                    color={currentStyles.foreground}
                    onChange={(color) => updateStyle("foreground", color)}
                    label="Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Card Colors" ref={sectionRefs["Card Colors"]}>
                <div data-entity="card">
                  <ColorPicker
                    color={currentStyles.card}
                    onChange={(color) => updateStyle("card", color)}
                    label="Card Background"
                  />
                </div>
                <div data-entity="card-foreground">
                  <ColorPicker
                    color={currentStyles["card-foreground"]}
                    onChange={(color) => updateStyle("card-foreground", color)}
                    label="Card Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Popover Colors" ref={sectionRefs["Popover Colors"]}>
                <div data-entity="popover">
                  <ColorPicker
                    color={currentStyles.popover}
                    onChange={(color) => updateStyle("popover", color)}
                    label="Popover Background"
                  />
                </div>
                <div data-entity="popover-foreground">
                  <ColorPicker
                    color={currentStyles["popover-foreground"]}
                    onChange={(color) => updateStyle("popover-foreground", color)}
                    label="Popover Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Muted Colors" ref={sectionRefs["Muted Colors"]}>
                <div data-entity="muted">
                  <ColorPicker
                    color={currentStyles.muted}
                    onChange={(color) => updateStyle("muted", color)}
                    label="Muted"
                  />
                </div>
                <div data-entity="muted-foreground">
                  <ColorPicker
                    color={currentStyles["muted-foreground"]}
                    onChange={(color) => updateStyle("muted-foreground", color)}
                    label="Muted Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Destructive Colors" ref={sectionRefs["Destructive Colors"]}>
                <div data-entity="destructive">
                  <ColorPicker
                    color={currentStyles.destructive}
                    onChange={(color) => updateStyle("destructive", color)}
                    label="Destructive"
                  />
                </div>
                <div data-entity="destructive-foreground">
                  <ColorPicker
                    color={currentStyles["destructive-foreground"]}
                    onChange={(color) => updateStyle("destructive-foreground", color)}
                    label="Destructive Foreground"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Border & Input Colors" ref={sectionRefs["Border & Input Colors"]}>
                <div data-entity="border">
                  <ColorPicker
                    color={currentStyles.border}
                    onChange={(color) => updateStyle("border", color)}
                    label="Border"
                  />
                </div>
                <div data-entity="input">
                  <ColorPicker
                    color={currentStyles.input}
                    onChange={(color) => updateStyle("input", color)}
                    label="Input"
                  />
                </div>
                <div data-entity="ring">
                  <ColorPicker
                    color={currentStyles.ring}
                    onChange={(color) => updateStyle("ring", color)}
                    label="Ring"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Chart Colors" ref={sectionRefs["Chart Colors"]}>
                <div data-entity="chart-1">
                  <ColorPicker
                    color={currentStyles["chart-1"]}
                    onChange={(color) => updateStyle("chart-1", color)}
                    label="Chart 1"
                  />
                </div>
                <div data-entity="chart-2">
                  <ColorPicker
                    color={currentStyles["chart-2"]}
                    onChange={(color) => updateStyle("chart-2", color)}
                    label="Chart 2"
                  />
                </div>
                <div data-entity="chart-3">
                  <ColorPicker
                    color={currentStyles["chart-3"]}
                    onChange={(color) => updateStyle("chart-3", color)}
                    label="Chart 3"
                  />
                </div>
                <div data-entity="chart-4">
                  <ColorPicker
                    color={currentStyles["chart-4"]}
                    onChange={(color) => updateStyle("chart-4", color)}
                    label="Chart 4"
                  />
                </div>
                <div data-entity="chart-5">
                  <ColorPicker
                    color={currentStyles["chart-5"]}
                    onChange={(color) => updateStyle("chart-5", color)}
                    label="Chart 5"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Sidebar Colors" ref={sectionRefs["Sidebar Colors"]}>
                <div data-entity="sidebar">
                  <ColorPicker
                    color={currentStyles.sidebar}
                    onChange={(color) => updateStyle("sidebar", color)}
                    label="Sidebar Background"
                  />
                </div>
                <div data-entity="sidebar-foreground">
                  <ColorPicker
                    color={currentStyles["sidebar-foreground"]}
                    onChange={(color) => updateStyle("sidebar-foreground", color)}
                    label="Sidebar Foreground"
                  />
                </div>
                <div data-entity="sidebar-primary">
                  <ColorPicker
                    color={currentStyles["sidebar-primary"]}
                    onChange={(color) => updateStyle("sidebar-primary", color)}
                    label="Sidebar Primary"
                  />
                </div>
                <div data-entity="sidebar-primary-foreground">
                  <ColorPicker
                    color={currentStyles["sidebar-primary-foreground"]}
                    onChange={(color) => updateStyle("sidebar-primary-foreground", color)}
                    label="Sidebar Primary Foreground"
                  />
                </div>
                <div data-entity="sidebar-accent">
                  <ColorPicker
                    color={currentStyles["sidebar-accent"]}
                    onChange={(color) => updateStyle("sidebar-accent", color)}
                    label="Sidebar Accent"
                  />
                </div>
                <div data-entity="sidebar-accent-foreground">
                  <ColorPicker
                    color={currentStyles["sidebar-accent-foreground"]}
                    onChange={(color) => updateStyle("sidebar-accent-foreground", color)}
                    label="Sidebar Accent Foreground"
                  />
                </div>
                <div data-entity="sidebar-border">
                  <ColorPicker
                    color={currentStyles["sidebar-border"]}
                    onChange={(color) => updateStyle("sidebar-border", color)}
                    label="Sidebar Border"
                  />
                </div>
                <div data-entity="sidebar-ring">
                  <ColorPicker
                    color={currentStyles["sidebar-ring"]}
                    onChange={(color) => updateStyle("sidebar-ring", color)}
                    label="Sidebar Ring"
                  />
                </div>
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="typography" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="bg-muted/50 mb-4 flex items-start gap-2.5 rounded-md border p-3">
                <AlertCircle className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0" />
                <div className="text-muted-foreground text-sm">
                  <p>
                    To use custom fonts, embed them in your project. <br />
                    See{" "}
                    <a
                      href="https://tailwindcss.com/docs/font-family"
                      target="_blank"
                      className="hover:text-muted-foreground/90 underline underline-offset-2"
                    >
                      Tailwind docs
                    </a>{" "}
                    for details.
                  </p>
                </div>
              </div>

              <ControlSection title="Font Family" expanded ref={sectionRefs["Font Family"]}>
                <div className="mb-4" data-entity="font-sans">
                  <Label htmlFor="font-sans" className="mb-1.5 block text-xs">
                    Sans-Serif Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...sansSerifFonts, ...serifFonts, ...monoFonts }}
                    defaultValue={DEFAULT_FONT_SANS}
                    currentFont={getAppliedThemeFont(themeState, "font-sans")}
                    onFontChange={(value) => updateStyle("font-sans", value)}
                  />
                </div>

                <Separator className="my-4" />

                <div className="mb-4" data-entity="font-serif">
                  <Label htmlFor="font-serif" className="mb-1.5 block text-xs">
                    Serif Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...serifFonts, ...sansSerifFonts, ...monoFonts }}
                    defaultValue={DEFAULT_FONT_SERIF}
                    currentFont={getAppliedThemeFont(themeState, "font-serif")}
                    onFontChange={(value) => updateStyle("font-serif", value)}
                  />
                </div>

                <Separator className="my-4" />
                <div data-entity="font-mono">
                  <Label htmlFor="font-mono" className="mb-1.5 block text-xs">
                    Monospace Font
                  </Label>
                  <ThemeFontSelect
                    fonts={{ ...monoFonts, ...sansSerifFonts, ...serifFonts }}
                    defaultValue={DEFAULT_FONT_MONO}
                    currentFont={getAppliedThemeFont(themeState, "font-mono")}
                    onFontChange={(value) => updateStyle("font-mono", value)}
                  />
                </div>
              </ControlSection>

              <ControlSection title="Letter Spacing" expanded ref={sectionRefs["Letter Spacing"]}>
                <div data-entity="letter-spacing">
                  <SliderWithInput
                    value={parseFloat(currentStyles["letter-spacing"]?.replace("em", ""))}
                    onChange={(value) => updateStyle("letter-spacing", `${value}em`)}
                    min={-0.5}
                    max={0.5}
                    step={0.025}
                    unit="em"
                    label="Letter Spacing"
                  />
                </div>
              </ControlSection>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="other" className="mt-1 size-full overflow-hidden">
            <ScrollArea className="h-full px-4">
              <ControlSection title="HSL Adjustments" expanded ref={sectionRefs["HSL Adjustments"]}>
                <div data-entity="hue-shift">
                  <HslAdjustmentControls />
                </div>
              </ControlSection>

              <ControlSection title="Radius" expanded ref={sectionRefs["Radius"]}>
                <div data-entity="radius">
                  <SliderWithInput
                    value={radius}
                    onChange={(value) => updateStyle("radius", `${value}rem`)}
                    min={0}
                    max={5}
                    step={0.025}
                    unit="rem"
                    label="Radius"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Spacing" ref={sectionRefs["Spacing"]}>
                <div data-entity="spacing">
                  <SliderWithInput
                    value={parseFloat(currentStyles.spacing?.replace("rem", ""))}
                    onChange={(value) => updateStyle("spacing", `${value}rem`)}
                    min={0.15}
                    max={0.35}
                    step={0.01}
                    unit="rem"
                    label="Spacing"
                  />
                </div>
              </ControlSection>

              <ControlSection title="Shadow" ref={sectionRefs["Shadow"]}>
                <div data-entity="shadow-color">
                  <ShadowControl
                    shadowColor={currentStyles["shadow-color"]}
                    shadowOpacity={parseFloat(currentStyles["shadow-opacity"])}
                    shadowBlur={parseFloat(currentStyles["shadow-blur"]?.replace("px", ""))}
                    shadowSpread={parseFloat(currentStyles["shadow-spread"]?.replace("px", ""))}
                    shadowOffsetX={parseFloat(currentStyles["shadow-offset-x"]?.replace("px", ""))}
                    shadowOffsetY={parseFloat(currentStyles["shadow-offset-y"]?.replace("px", ""))}
                    onChange={(key, value) => {
                      if (key === "shadow-color") {
                        updateStyle(key, value as string);
                      } else if (key === "shadow-opacity") {
                        updateStyle(key, value.toString());
                      } else {
                        updateStyle(key as keyof ThemeStyleProps, `${value}px`);
                      }
                    }}
                  />
                </div>
              </ControlSection>
            </ScrollArea>
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

export const scrollToThemeEntity = (tab: ControlTab, entity: EntityName) => {
  const globalWindow = window as unknown as { scrollToThemeEntity?: (tab: ControlTab, entity: EntityName) => void };
  if (globalWindow.scrollToThemeEntity) {
    globalWindow.scrollToThemeEntity(tab, entity);
  }
};
