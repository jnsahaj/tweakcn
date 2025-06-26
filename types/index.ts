import { FocusColorId } from "@/store/color-control-focus-store";

export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
};

export type ColorPickerProps = {
  /**
   * The current color value.
   */
  color: string;
  /**
   * Callback invoked whenever the color value changes.
   */
  onChange: (color: string) => void;
  /**
   * Human-readable label for the control.
   */
  label: string;
  /**
   * (Optional) Identifier that maps this color picker to a theme style key.
   * When provided, it enables programmatic focusing via `focusColorControl()`.
   */
  name?: FocusColorId;
};

export type SliderInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  label: string;
  unit?: string;
};

export type ToggleOptionProps<T> = {
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
  label: string;
};

export type ReadOnlyColorDisplayProps = {
  color: string;
  label: string;
  linkTo: string;
};

export type ColorFormat = "hex" | "rgb" | "hsl" | "oklch";

export type ColorSwatchProps = {
  hex: string;
  name: string;
  size?: "sm" | "md" | "lg";
};

export type ValidShade = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';