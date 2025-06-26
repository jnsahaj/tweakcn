// color-picker.tsx
import React, { useState, useEffect, useMemo, useCallback, useRef, useContext } from "react";
import { ColorPickerProps, ColorSwatchProps, ValidShade } from "@/types";
import { debounce } from "@/utils/debounce";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { tailwindColors, tailwindColorShades } from "@/utils/registry/tailwind-colors";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { convertColorhexToTailClasses, isValidHexColor } from "@/utils/color-type-checker";
import { useColorControlFocus } from "@/store/color-control-focus-store";
import { SectionContext } from "./section-context";

const ColorPicker = ({ color, onChange, label, name }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [showPalette, setShowPalette] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0, width: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);
  const validShades = useMemo(() => tailwindColorShades as ValidShade[], []);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sectionCtx = useContext(SectionContext);
  const { registerColor, unregisterColor, highlightTarget } = useColorControlFocus();

  // Register/unregister this color control with the focus store
  useEffect(() => {
    if (!name) return;
    registerColor(name, rootRef.current);
    return () => unregisterColor(name);
  }, [name, registerColor, unregisterColor]);

  // Update localColor if the prop changes externally
  useEffect(() => {
    if (color !== localColor) {
      setLocalColor(color);
    }
  }, [color]);

  // Handle click outside for close the color box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Create a stable debounced onChange handler
  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        if (isValidHexColor(value)) {
          onChange(value);
        }
      }, DEBOUNCE_DELAY),
    [onChange]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setLocalColor(newColor);
      const convertedColor = convertColorhexToTailClasses(newColor, validShades);
      if (convertedColor !== newColor) {
        debouncedOnChange(convertedColor);
      } else {
        debouncedOnChange(newColor);
      }
    },
    [debouncedOnChange, validShades]
  );

  const handleColorSelect = useCallback(
    (hex: string) => {
      setLocalColor(hex);
      onChange(hex);
      setShowPalette(false);
    },
    [onChange]
  );

  const handlePaletteToggle = useCallback(() => {
    setShowPalette((prev) => !prev);
  }, []);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => debouncedOnChange.cancel();
  }, [debouncedOnChange]);

  // Update palette position
  useEffect(() => {
    if (!showPalette || !pickerRef.current) return;

    const updatePosition = () => {
      const rect = pickerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPalettePosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showPalette]);

  // Memoize the ColorSwatch component
  const ColorSwatch = useCallback(
    ({ hex, name, size = "sm" }: ColorSwatchProps) => {
      const sizeClasses = {
        sm: "w-6 h-6",
        md: "w-8 h-8",
        lg: "w-10 h-10",
      };

      return (
        <button
          onClick={() => handleColorSelect(hex)}
          className={cn(
            "group focus:ring-primary relative rounded-md border border-white/20 transition-all duration-200 hover:z-10 hover:scale-110 hover:shadow-lg focus:ring-2 focus:outline-none",
            sizeClasses[size]
          )}
          style={{ backgroundColor: hex }}
          title={`${name} (${hex})`}
          aria-label={`Select color ${name}`}
        >
          <div className="absolute inset-0 rounded-md ring-2 ring-transparent transition-all duration-200 group-hover:ring-white/50" />
        </button>
      );
    },
    [handleColorSelect]
  );
  const convertedColor = useMemo(
    () => convertColorhexToTailClasses(localColor, validShades),
    [localColor, validShades]
  );

  const isHighlighted = name && highlightTarget === name;

  useEffect(() => {
    if (isHighlighted) {
      // Trigger animation
      setShouldAnimate(true);

      sectionCtx?.setIsExpanded(true);
      setTimeout(
        () => {
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        },
        sectionCtx?.isExpanded ? 0 : 100
      );

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 1000); // Duration should match the animation duration

      return () => clearTimeout(timer);
    }
  }, [isHighlighted, sectionCtx]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "mb-3 transition-all duration-300",
        shouldAnimate && "bg-border/50 -m-1.5 mb-1.5 rounded-sm p-1.5"
      )}
    >
      <div className="mb-1.5 flex items-center justify-between">
        <Label
          htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-xs font-medium"
        >
          {label}
        </Label>
      </div>
      <div className="relative flex items-center gap-1">
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border"
          style={{ backgroundColor: convertedColor }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="color"
            id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={localColor}
            onChange={handleColorChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <input
          type="text"
          value={localColor}
          onChange={handleColorChange}
          className="bg-input/25 border-border/20 h-8 flex-1 rounded border px-2 text-sm"
          placeholder="Enter color (hex or tailwind class)"
        />
        <Button
          onClick={handlePaletteToggle}
          className="px-3 py-3 transition-colors"
          variant="outline"
          aria-expanded={showPalette}
          aria-label="Toggle color palette"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", showPalette && "rotate-180")}
          />
        </Button>

        <div
          className={cn(
            "bg-background border-accent-foreground fixed z-50 rounded-xl border shadow-2xl",
            showPalette ? "block" : "hidden"
          )}
          style={
            palettePosition
              ? {
                  position: "fixed",
                  top: palettePosition.top,
                  left: palettePosition.left,
                  width: palettePosition.width,
                }
              : undefined
          }
          role="dialog"
          aria-label="Color palette"
        >
          <Command className="bg-background w-full shadow-md">
            <CommandInput
              placeholder="Search colors..."
              className="h-10 rounded-t-md px-3 text-sm"
            />

            <ScrollArea className="h-60">
              <CommandList className="!overflow-x-visible !overflow-y-visible">
                <CommandEmpty className="text-muted-foreground p-4 text-center">
                  No tailwind color found. Please try a different search term.
                </CommandEmpty>
                <CommandGroup heading="Tailwind classes" className="!overflow-auto p-2">
                  {Object.entries(tailwindColors).map(([colorName, shades]) =>
                    Object.entries(shades).map(([shade, hex]) => (
                      <CommandItem
                        key={hex}
                        className="flex items-center gap-3 rounded-md px-3 py-2 transition-colors"
                        onClick={() => handleColorSelect(hex)}
                      >
                        <ColorSwatch hex={hex} name={`${colorName}-${shade}`} />
                        <span className="text-base font-medium">{`${colorName}-${shade}`}</span>
                      </CommandItem>
                    ))
                  )}
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
