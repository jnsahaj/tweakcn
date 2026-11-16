// Modified by Abtion: shows and accepts brand palette references (e.g. "forest-green-700"), role status slot.
import { DEBOUNCE_DELAY } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useColorControlFocus } from "@/store/color-control-focus-store";
import { ColorPickerProps } from "@/types";
import { debounce } from "@/utils/debounce";
import { Link2 } from "lucide-react";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ColorSelectorPopover } from "./color-selector-popover";
import { SectionContext } from "./section-context";

type BrandProps = {
  /** Live brand reference of this token, shown instead of the raw value. */
  brandRef?: string;
  /** Try to link the token to a brand step; returns false if `ref` isn't one. */
  onBrandRef?: (ref: string) => boolean;
  /** Extra line under the label (brand role status: "Auto · Primary 700" / "Manual"). */
  status?: React.ReactNode;
};

const ColorPicker = ({ color, onChange, label, name, brandRef, onBrandRef, status }: ColorPickerProps & BrandProps) => {
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
    if (textInputRef.current) {
      textInputRef.current.value = brandRef ?? color;
    }
  }, [color, brandRef]);

  const debouncedOnChange = useMemo(
    () =>
      debounce((value: string) => {
        if (onBrandRef?.(value.trim())) return;
        onChange(value);
      }, DEBOUNCE_DELAY),
    [onChange, onBrandRef]
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
        "group hover:bg-muted/50 -mx-1 flex items-center gap-2.5 rounded-lg px-2 py-0.5 transition-all duration-200",
        shouldAnimate && "bg-muted ring-primary ring-2"
      )}
    >
      <div
        className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border shadow-sm"
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

      {status ? (
        <div className="flex min-w-0 shrink-0 flex-col gap-0.5 py-0.5">
          <span className="text-foreground text-[13px] font-medium">{label}</span>
          {status}
        </div>
      ) : (
        <span className="text-foreground min-w-0 shrink-0 text-[13px] font-medium">{label}</span>
      )}

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        {brandRef && (
          <span title={`Linked to brand step ${brandRef}`} className="text-muted-foreground shrink-0">
            <Link2 className="size-3.5" aria-label="Linked to brand palette" />
          </span>
        )}
        <input
          ref={textInputRef}
          type="text"
          defaultValue={brandRef ?? color}
          onChange={handleTextInputChange}
          className="bg-muted/50 text-muted-foreground focus:text-foreground focus:border-ring h-7 w-full min-w-0 rounded border px-2 text-xs font-mono transition-colors outline-none"
          placeholder="hex or tailwind"
        />
        <ColorSelectorPopover
          currentColor={color}
          onChange={onChange}
          brandRef={brandRef}
          onBrandSelect={onBrandRef ? (ref) => void onBrandRef(ref) : undefined}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
