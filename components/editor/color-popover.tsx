"use client";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ColorSwatchProps } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tailwindColors } from "@/utils/registry/tailwind-colors";
import { 
    Popover, 
    PopoverContent, 
    PopoverTrigger 
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";


type ColorPopoverProps = {
  onChange: (color: string) => void;
  setLocalColor: (color: string) => void;
};
const ColorPopover = ({ onChange, setLocalColor }: ColorPopoverProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);
  const [showPalette, setShowPalette] = useState(false);
  const handlePaletteToggle = useCallback(() => {
    setShowPalette((prev) => !prev);
  }, []);

  const handleColorSelect = useCallback(
    (hex: string) => {
      setLocalColor(hex);
      onChange(hex);
      setShowPalette(false);
    },
    [onChange]
  );

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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          onClick={handlePaletteToggle}
          className="px-3 py-3 transition-colors"
          variant="outline"
        >
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", showPalette && "rotate-180")}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 px-0 py-0" align="end">
        <Command className="bg-background w-full shadow-md">
          <CommandInput placeholder="Search colors..." className="h-10 rounded-t-md px-3 text-sm" />
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
      </PopoverContent>
    </Popover>
  );
};

export default ColorPopover;
