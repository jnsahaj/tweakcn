import React, { useState, useEffect, useMemo, useRef, useContext } from "react";
import { Label } from "@/components/ui/label";
import { ColorPickerProps } from "@/types";
import { debounce } from "@/utils/debounce";
import { useColorControlFocus } from "@/store/color-control-focus-store";
import { cn } from "@/lib/utils";
import { SectionContext } from "./section-context";

const ColorPicker = ({ color, onChange, label, name }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionCtx = useContext(SectionContext);
  const { registerColor, unregisterColor, highlightTarget } = useColorControlFocus();

  useEffect(() => {
    if (!name) return;
    registerColor(name, rootRef.current);
    return () => unregisterColor(name);
  }, [name, registerColor, unregisterColor]);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  const debouncedOnChange = useMemo(
    () => debounce((value: string) => onChange(value), 20),
    [onChange]
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    debouncedOnChange(newColor);
  };

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
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
  }, [isHighlighted]);

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
      <div className="flex items-center gap-1">
        <div
          className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded border"
          style={{ backgroundColor: localColor }}
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
        />
      </div>
    </div>
  );
};

export default ColorPicker;
