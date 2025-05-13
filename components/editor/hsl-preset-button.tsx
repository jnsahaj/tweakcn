"use client";

import type React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HslPresetButtonProps {
  label: string;
  hueShift: number;
  saturationScale: number;
  lightnessScale: number;
  baseBg: string;
  basePrimary: string;
  baseSecondary?: string;
  onClick: () => void;
  selected: boolean;
  adjustColorByHsl: (
    color: string,
    hueShift: number,
    saturationScale: number,
    lightnessScale: number
  ) => string;
}

export const HslPresetButton: React.FC<HslPresetButtonProps> = ({
  label,
  hueShift,
  saturationScale,
  lightnessScale,
  baseBg,
  basePrimary,
  baseSecondary = "#888888",
  onClick,
  selected,
  adjustColorByHsl,
}) => {
  const previewBg = adjustColorByHsl(baseBg, hueShift, saturationScale, lightnessScale);
  const previewPrimary = adjustColorByHsl(basePrimary, hueShift, saturationScale, lightnessScale);
  const previewSecondary = adjustColorByHsl(
    baseSecondary,
    hueShift,
    saturationScale,
    lightnessScale
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={onClick}
            size="sm"
            variant="outline"
            className={cn(
              "relative h-8 w-full overflow-hidden rounded-md p-0 shadow-sm transition-all duration-200",
              "hover:scale-105 hover:shadow-md",
              selected ? "ring-primary ring-1 ring-offset-1" : "border-border border"
            )}
            style={{ background: previewBg }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-full w-full">
                <div className="h-full w-1/2 rounded-l-md" style={{ background: previewPrimary }} />
                <div
                  className="h-full w-1/2 rounded-r-md"
                  style={{ background: previewSecondary }}
                />
              </div>
            </div>
            {selected && (
              <div className="bg-primary absolute right-0.5 bottom-0.5 h-2 w-2 rounded-full" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
