import { Label } from "@/components/ui/label";
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useColorControlFocus } from "@/store/color-control-focus-store";
import { ColorPickerProps } from "@/types";
import { debounce } from "@/utils/debounce";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ColorSelectorPopover } from "./color-selector-popover";
import { SectionContext } from "./section-context";

const ColorPicker = ({ color, onChange, label, name }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionCtx = useContext(SectionContext);
  const { registerColor, unregisterColor, highlightTarget } = useColorControlFocus();

  useEffect(() => {
    if (!name) return;
    registerColor(name, rootRef.current);
    return () => unregisterColor(name);
  }, [name, registerColor, unregisterColor]);

  useEffect(() => {
    // Update the text input value using ref when color prop changes
    if (textInputRef.current) {
      textInputRef.current.value = color;
    }
  }, [color]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        onChange(value);
      }, DEBOUNCE_DELAY),
    [onChange]
  );

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value;
      debouncedOnChange(newColor);
    },
    [debouncedOnChange]
  );

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const colorString = e.target.value;
      debouncedOnChange(colorString);
    },
    [debouncedOnChange]
  );

  useEffect(() => {
    return () => debouncedOnChange.cancel();
  }, [debouncedOnChange]);

  const isHighlighted = name && highlightTarget === name;

  useEffect(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
      animationTimerRef.current = null;
    }

    if (isHighlighted) {
      setShouldAnimate(true);
      sectionCtx?.setIsExpanded(true);

      setTimeout(
        () => {
          rootRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        },
        sectionCtx?.isExpanded ? 0 : 100
      );

      animationTimerRef.current = setTimeout(() => {
        setShouldAnimate(false);
        animationTimerRef.current = null;
      }, 1500);
    } else {
      setShouldAnimate(false);
    }

    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
    };
  }, [isHighlighted, sectionCtx]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "mb-3 transition-all duration-300",
        shouldAnimate && "bg-border/50 ring-primary -m-1.5 mb-1.5 rounded-sm p-1.5 ring-2"
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
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(!isOpen)}
        >
          <input
            type="color"
            id={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
            value={color}
            onChange={handleColorChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <input
          ref={textInputRef}
          type="text"
          defaultValue={color}
          onChange={handleTextInputChange}
          className="bg-input/25 border-border/20 h-8 flex-1 rounded border px-2 text-sm"
          placeholder="Enter color (hex or tailwind class)"
        />

        <ColorSelectorPopover currentColor={color} onChange={onChange} />
      </div>
    </div>
  );
};

export default ColorPicker;
