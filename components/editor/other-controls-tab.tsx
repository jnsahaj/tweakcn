import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeStyleProps } from "@/types/theme";
import ControlSection, { ControlSectionRef } from "./control-section";
import HslAdjustmentControls from "./hsl-adjustment-controls";
import ShadowControl from "./shadow-control";
import { SliderWithInput } from "./slider-with-input";

interface OtherControlsTabProps {
  currentStyles: ThemeStyleProps;
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void;
  sectionRefs: Record<string, React.RefObject<ControlSectionRef | null>>;
  radius: number;
}

export const OtherControlsTab: React.FC<OtherControlsTabProps> = ({
  currentStyles,
  updateStyle,
  sectionRefs,
  radius,
}) => {
  return (
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
  );
};
