import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ColorPickerProps, ColorSwatchProps } from "@/types";
import { debounce } from "@/utils/debounce";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { tailwindColors } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDown, Palette, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// Validate hex color format
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [showPalette, setShowPalette] = useState(false);
  const [palettePosition, setPalettePosition] = useState({ top: 0, left: 0, width: 0 });
  const pickerRef = useRef<HTMLDivElement>(null);

  // Update localColor if the prop changes externally
  useEffect(() => {
    if (isValidHexColor(color)) {
      setLocalColor(color);
    }
  }, [color]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPalette(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create a stable debounced onChange handler
  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        if (isValidHexColor(value)) {
          onChange(value);
        }
      }, 20),
    [onChange]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      setLocalColor(newColor);
      if (isValidHexColor(newColor)) {
        debouncedOnChange(newColor);
      }
    },
    [debouncedOnChange]
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
    const newShowPalette = !showPalette;
    setShowPalette(newShowPalette);
  }, [showPalette]);

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  useEffect(() => {
    if (showPalette && pickerRef.current) {
      const updatePosition = () => {
        const rect = pickerRef?.current?.getBoundingClientRect();
        if (!rect) return;
        setPalettePosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      };
      
      updatePosition();
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }
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

  return (
    <div className="mb-3" ref={pickerRef}>
      <div className="flex items-center justify-between mb-1.5">
        <Label
          htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-xs font-medium"
        >
          {label}
        </Label>
      </div>
      <div className="relative flex items-center gap-1">
        <div
          className="h-8 w-8 border cursor-pointer relative flex items-center justify-center rounded"
          style={{ backgroundColor: localColor }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="color"
            id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={localColor}
            onChange={handleColorChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <input
          type="text"
          value={localColor}
          onChange={handleColorChange}
          className="flex-1 h-8 px-2 text-sm rounded bg-input/25 border-border/20"
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
          <div className="w-full">
            <Tabs defaultValue="palette">
              <TabsList className="w-full">
                <TabsTrigger value="palette" className="w-full">
                  <Palette className="mr-2 inline h-4 w-4" />
                  Palette
                </TabsTrigger>
                <TabsTrigger value="color_search" className="w-full">
                  <Search className="mr-2 inline h-4 w-4" />
                  Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="palette">
                <ScrollArea className="h-60 p-2">
                  <div className="space-y-6">
                    {Object.entries(tailwindColors).map(([colorName, shades]) => (
                      <div key={colorName} className="space-y-2">
                        <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
                          {colorName}
                        </h4>
                        <div className="grid grid-cols-11 gap-1.5">
                          {Object.entries(shades).map(([shade, hex]) => (
                            <ColorSwatch
                              key={`${colorName}-${shade}`}
                              hex={hex}
                              name={`${colorName}-${shade}`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="color_search">
                <Command className="bg-background w-full shadow-md">
                  <CommandInput
                    placeholder="Search colors..."
                    className="h-10 rounded-t-md px-3 text-sm"
                  />

                  <ScrollArea className="h-60">
                    <CommandList className="!overflow-x-visible !overflow-y-visible">
                      <CommandEmpty className="text-muted-foreground p-4 text-center">
                        No results found.
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
