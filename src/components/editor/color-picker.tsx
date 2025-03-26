import React, { useState, useCallback, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { ColorPickerProps } from "@/types";
import { debounce } from "@/utils/debounce";

const ColorPicker = ({ color, onChange, label }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);

  // Update localColor if the prop changes externally
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Create debounced onChange handler with useCallback to maintain reference
  const debouncedOnChange = useCallback(
    debounce((value) => {
      onChange(value);
    }, 10), // 300ms debounce delay - adjust as needed
    [onChange]
  );

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLocalColor(newColor);
    debouncedOnChange(newColor);
  };

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1.5">
        <Label
          htmlFor={`color-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="text-xs font-medium"
        >
          {label}
        </Label>
        <div className="text-xs text-muted-foreground">{localColor}</div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="h-8 w-8 rounded border cursor-pointer overflow-hidden relative flex items-center justify-center"
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
          className="flex-1 h-8 px-2 text-sm rounded-md border bg-background"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
