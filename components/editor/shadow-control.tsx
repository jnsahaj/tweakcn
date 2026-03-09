import React from "react";
import { SliderWithInput } from "./slider-with-input";
import ColorPicker from "./color-picker";

interface ShadowControlProps {
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  onChange: (key: string, value: string | number) => void;
}

const ShadowControl: React.FC<ShadowControlProps> = ({
  shadowColor,
  shadowOpacity,
  shadowBlur,
  shadowSpread,
  shadowOffsetX,
  shadowOffsetY,
  onChange,
}) => {
  return (
    <div>
      <ColorPicker
        color={shadowColor}
        onChange={(color) => onChange("shadow-color", color)}
        label="Color"
      />

      <SliderWithInput
        value={shadowOpacity}
        onChange={(value) => onChange("shadow-opacity", value)}
        min={0}
        max={1}
        step={0.01}
        unit=""
        label="Opacity"
      />

      <SliderWithInput
        value={shadowBlur}
        onChange={(value) => onChange("shadow-blur", value)}
        min={0}
        max={50}
        step={0.5}
        unit="px"
        label="Blur"
      />

      <SliderWithInput
        value={shadowSpread}
        onChange={(value) => onChange("shadow-spread", value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Spread"
      />

      <SliderWithInput
        value={shadowOffsetX}
        onChange={(value) => onChange("shadow-offset-x", value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Offset X"
      />

      <SliderWithInput
        value={shadowOffsetY}
        onChange={(value) => onChange("shadow-offset-y", value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Offset Y"
      />
    </div>
  );
};

export default ShadowControl;
