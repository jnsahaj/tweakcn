import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ColorPicker from "./color-picker";
import ControlSection, { ControlSectionRef } from "./control-section";
import { ThemeStyleProps } from "@/types/theme";

interface ColorControlsTabProps {
  currentStyles: ThemeStyleProps;
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void;
  sectionRefs: Record<string, React.RefObject<ControlSectionRef | null>>;
}

export const ColorControlsTab: React.FC<ColorControlsTabProps> = ({
  currentStyles,
  updateStyle,
  sectionRefs,
}) => {
  return (
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
  );
};
