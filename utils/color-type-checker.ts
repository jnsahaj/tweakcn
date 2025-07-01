import { ValidTailwindShade } from "@/types";
import { TAILWIND_PALETTE } from "./registry/tailwind-colors";

// Validation functions
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isValidTailwindColor = (color: string): boolean => {
  return /^[a-z]+-\d+$/.test(color);
};

// Color conversion utility -> Hex to tailwind color classes
export const convertColorToTailwindClasses = (
  inputColor: string,
  validShades: ValidTailwindShade[]
): string => {
  if (isValidHexColor(inputColor)) {
    return inputColor;
  }

  if (isValidTailwindColor(inputColor)) {
    const [name, shade] = inputColor.split("-");
    if (name in TAILWIND_PALETTE && validShades.includes(shade as ValidTailwindShade)) {
      const colorShades = TAILWIND_PALETTE[name as keyof typeof TAILWIND_PALETTE];
      return colorShades[shade as ValidTailwindShade] || inputColor;
    }
  }
  return inputColor;
};
