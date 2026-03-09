import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";

export const SliderWithInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = "px",
}: {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  label: string;
  unit?: string;
}) => {
  const [localValue, setLocalValue] = useState(value.toString());

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalValue(raw);
    const num = parseFloat(raw.replace(',', '.'));
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)));
    }
  };

  return (
    <div className="flex items-center gap-2 py-0.5">
      <Label
        htmlFor={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
        className="text-muted-foreground w-16 shrink-0 text-[11px] font-medium"
      >
        {label}
      </Label>
      <Slider
        id={`slider-${label.replace(/\s+/g, "-").toLowerCase()}`}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => {
          const newValue = values[0];
          setLocalValue(newValue.toString());
          onChange(newValue);
        }}
        className="min-w-0 flex-1"
      />
      <div className="flex shrink-0 items-center gap-1">
        <Input
          id={`input-${label.replace(/\s+/g, "-").toLowerCase()}`}
          type="number"
          value={localValue}
          onChange={handleChange}
          onBlur={() => setLocalValue(value.toString())}
          min={min}
          max={max}
          step={step}
          className="h-6 w-14 px-1.5 text-xs"
        />
        <span className="text-muted-foreground w-5 text-[11px]">{unit}</span>
      </div>
    </div>
  );
};
