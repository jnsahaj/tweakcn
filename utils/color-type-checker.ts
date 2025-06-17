import { ValidShade } from "@/types";
import { tailwindColors } from "./registry/tailwind-colors";

// Validation functions
export const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const isValidTailwindColor = (color: string): boolean => {
  return /^[a-z]+-\d+$/.test(color);
};

// Color conversion utility -> Hex to tailwind color classes
export const convertColorhexToTailClasses = (
  inputColor: string,
  validShades: ValidShade[]
): string => {
  if (isValidHexColor(inputColor)) {
    return inputColor;
  }

  if (isValidTailwindColor(inputColor)) {
    const [name, shade] = inputColor.split("-");
    if (name in tailwindColors && validShades.includes(shade as ValidShade)) {
      const colorShades = tailwindColors[name as keyof typeof tailwindColors];
      return colorShades[shade as ValidShade] || inputColor;
    }
  }
  return inputColor;
};
