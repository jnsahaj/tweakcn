export type ControlSectionProps = {
  title: string;
  children: React.ReactNode;
  expanded?: boolean;
  className?: string;
  id?: string;
};

export type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  label: string;
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
