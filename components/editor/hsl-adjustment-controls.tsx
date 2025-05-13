"use client";

import React, { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { SliderWithInput } from "./slider-with-input";
import { useEditorStore } from "../../store/editor-store";
import { COMMON_STYLES, defaultThemeState } from "../../config/theme";
import { ThemeEditorState } from "@/types/editor";
import { converter, formatHex, Hsl } from "culori";
import { debounce } from "@/utils/debounce";
import { isDeepEqual } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HslPresetButton } from "./hsl-preset-button";
import { ChevronDown } from "lucide-react";

// Adjusts a color by modifying HSL values
function adjustColorByHsl(
  color: string,
  hueShift: number,
  saturationScale: number,
  lightnessScale: number
): string {
  const hsl = converter("hsl")(color);
  const h = hsl?.h;
  const s = hsl?.s;
  const l = hsl?.l;

  if (h === undefined || s === undefined || l === undefined) {
    return color;
  }

  const adjustedHsl = {
    h: (((h + hueShift) % 360) + 360) % 360,
    s: Math.min(1, Math.max(0, s * saturationScale)),
    l: Math.min(1, Math.max(0.1, l * lightnessScale)),
  };

  const out = converter("hsl")(adjustedHsl as Hsl);
  return formatHex(out);
}

// Preset HSL adjustment values
const HSL_PRESETS = [
  // Hue Adjustments
  { label: "Hue (-120°)", hueShift: -120, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (-60°)", hueShift: -60, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (+60°)", hueShift: 60, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue (+120°)", hueShift: 120, saturationScale: 1, lightnessScale: 1 },
  { label: "Hue Invert", hueShift: 180, saturationScale: 1, lightnessScale: 1 },

  // Saturation Adjustments
  { label: "Grayscale", hueShift: 0, saturationScale: 0, lightnessScale: 1 },
  { label: "Muted", hueShift: 0, saturationScale: 0.6, lightnessScale: 1 },
  { label: "Vibrant", hueShift: 0, saturationScale: 1.4, lightnessScale: 1 },

  // Lightness Adjustments
  { label: "Dimmer", hueShift: 0, saturationScale: 1, lightnessScale: 0.8 },
  { label: "Brighter", hueShift: 0, saturationScale: 1, lightnessScale: 1.2 },

  // Combined Adjustments
  { label: "H(+30) S(-50) L(-5%)", hueShift: 30, saturationScale: 0.5, lightnessScale: 0.95 },
  { label: "H(-20) S(+20) L(+5%)", hueShift: -20, saturationScale: 1.2, lightnessScale: 1.05 },
  { label: "H(+20) S(-30) L(-5%)", hueShift: 20, saturationScale: 0.7, lightnessScale: 0.95 },
  { label: "H(-10) S(-25) L(+10%)", hueShift: -10, saturationScale: 0.75, lightnessScale: 1.1 },
  { label: "H(+60) S(+50) L(+10%)", hueShift: 60, saturationScale: 1.5, lightnessScale: 1.1 },
];

const HslAdjustmentControls = () => {
  const { themeState, setThemeState, saveThemeCheckpoint, themeCheckpoint } = useEditorStore();
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce> | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get current HSL adjustments with fallback to defaults
  const currentHslAdjustments = useMemo(
    () => themeState.hslAdjustments ?? defaultThemeState.hslAdjustments!,
    [themeState.hslAdjustments]
  );

  // Save checkpoint if HSL adjustments are at default values
  useEffect(() => {
    if (isDeepEqual(themeState.hslAdjustments, defaultThemeState.hslAdjustments)) {
      saveThemeCheckpoint();
    }
  }, [themeState.hslAdjustments, saveThemeCheckpoint]);

  // Setup debounced update function
  useEffect(() => {
    debouncedUpdateRef.current = debounce((hslAdjustments: ThemeEditorState["hslAdjustments"]) => {
      const {
        hueShift = defaultThemeState.hslAdjustments!.hueShift,
        saturationScale = defaultThemeState.hslAdjustments!.saturationScale,
        lightnessScale = defaultThemeState.hslAdjustments!.lightnessScale,
      } = hslAdjustments ?? {};

      const adjustments = { hueShift, saturationScale, lightnessScale };
      const state = themeCheckpoint ?? themeState;
      const { light: lightStyles, dark: darkStyles } = state.styles;

      const updatedLightStyles = Object.keys(lightStyles)
        .filter((key) => !COMMON_STYLES.includes(key))
        .reduce<Record<string, string>>((acc, key) => {
          const colorKey = key as keyof typeof lightStyles;
          return {
            ...acc,
            [key]: adjustColorByHsl(
              lightStyles[colorKey],
              adjustments.hueShift,
              adjustments.saturationScale,
              adjustments.lightnessScale
            ),
          };
        }, {});

      const updatedDarkStyles = Object.keys(darkStyles)
        .filter((key) => !COMMON_STYLES.includes(key))
        .reduce<Record<string, string>>((acc, key) => {
          const colorKey = key as keyof typeof darkStyles;
          return {
            ...acc,
            [key]: adjustColorByHsl(
              darkStyles[colorKey],
              adjustments.hueShift,
              adjustments.saturationScale,
              adjustments.lightnessScale
            ),
          };
        }, {});

      // Update theme state with all changes
      setThemeState({
        ...themeState,
        hslAdjustments,
        styles: {
          light: { ...lightStyles, ...updatedLightStyles },
          dark: { ...darkStyles, ...updatedDarkStyles },
        },
      });
    }, 10);

    return () => debouncedUpdateRef.current?.cancel();
  }, [themeState, setThemeState, themeCheckpoint]);

  // Handle HSL value changes
  const handleHslChange = useCallback(
    (property: keyof typeof currentHslAdjustments, value: number) => {
      if (debouncedUpdateRef.current) {
        debouncedUpdateRef.current({
          ...currentHslAdjustments,
          [property]: value,
        });
      }
    },
    [currentHslAdjustments]
  );

  const handleBatchHslChange = useCallback((value: typeof currentHslAdjustments) => {
    if (debouncedUpdateRef.current) {
      debouncedUpdateRef.current(value);
    }
  }, []);

  const currentStyles = (themeCheckpoint ?? themeState).styles[themeState.currentMode];

  return (
    <div className="@container">
      {/* Responsive preset grid */}
      <div
        className={cn(
          "-m-1 mb-2 grid grid-cols-5 gap-2 overflow-hidden p-1 transition-all duration-300 ease-in-out @sm:grid-cols-7 @md:grid-cols-9 @lg:grid-cols-11 @xl:grid-cols-13",
          !isExpanded ? "h-10" : "h-auto"
        )}
      >
        {HSL_PRESETS.map((preset) => (
          <HslPresetButton
            key={preset.label}
            label={preset.label}
            hueShift={preset.hueShift}
            saturationScale={preset.saturationScale}
            lightnessScale={preset.lightnessScale}
            baseBg={currentStyles.background}
            basePrimary={currentStyles.primary}
            baseSecondary={currentStyles.secondary}
            selected={
              currentHslAdjustments.hueShift === preset.hueShift &&
              currentHslAdjustments.saturationScale === preset.saturationScale &&
              currentHslAdjustments.lightnessScale === preset.lightnessScale
            }
            adjustColorByHsl={adjustColorByHsl}
            onClick={() => {
              handleBatchHslChange(preset);
            }}
          />
        ))}
      </div>

      {/* Show/Hide more button - shows if total presets exceed the smallest breakpoint's column count */}
      {HSL_PRESETS.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-4 flex w-full items-center justify-center text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide" : "Show more"} presets
          <ChevronDown
            className={cn(
              "ml-1 h-4 w-4 transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </Button>
      )}

      <SliderWithInput
        value={currentHslAdjustments.hueShift}
        onChange={(value) => handleHslChange("hueShift", value)}
        unit="deg"
        min={-180}
        max={180}
        step={1}
        label="Hue Shift"
      />
      <SliderWithInput
        value={currentHslAdjustments.saturationScale}
        onChange={(value) => handleHslChange("saturationScale", value)}
        unit="x"
        min={0}
        max={2}
        step={0.01}
        label="Saturation Multiplier"
      />
      <SliderWithInput
        value={currentHslAdjustments.lightnessScale}
        onChange={(value) => handleHslChange("lightnessScale", value)}
        unit="x"
        min={0.2}
        max={2}
        step={0.01}
        label="Lightness Multiplier"
      />
    </div>
  );
};

export default HslAdjustmentControls;
