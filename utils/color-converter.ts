import * as culori from "culori";
import { ColorFormat } from "../types";
import { Hsl } from "culori";

export const formatNumber = (num?: number) => {
  if (!num) return "0";
  return num % 1 === 0 ? num : num.toFixed(4);
};

const normalizeHue = (hue?: number): number => {
  if (hue === undefined || Number.isNaN(hue)) {
    return 0;
  }

  return ((hue % 360) + 360) % 360;
};

const clampUnitInterval = (value?: number): number => {
  if (value === undefined || Number.isNaN(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
};

const normalizeHsl = (hsl: Hsl): Hsl => {
  const saturation = clampUnitInterval(hsl.s);

  return {
    ...hsl,
    h: saturation === 0 ? 0 : normalizeHue(hsl.h),
    s: saturation,
    l: clampUnitInterval(hsl.l),
  };
};

export const formatHsl = (hsl: Hsl, preserveAlpha = true) => {
  const normalized = normalizeHsl(hsl);
  const alphaSuffix = preserveAlpha ? formatAlphaSuffix(hsl.alpha) : "";
  return `hsl(${formatNumber(normalized.h)} ${formatNumber(normalized.s * 100)}% ${formatNumber(normalized.l * 100)}%${alphaSuffix})`;
};

const formatAlphaSuffix = (alpha?: number): string => {
  if (alpha === undefined || alpha >= 1) {
    return "";
  }

  return ` / ${formatNumber(alpha * 100)}%`;
};

export const formatColorInputHex = (colorValue: string): string => {
  const color = culori.parse(colorValue);

  return color ? culori.formatHex(color) : "#000000";
};

export const formatDisplayHex = (colorValue: string): string => {
  const color = culori.parse(colorValue);

  if (!color) {
    return colorValue;
  }

  return formatParsedHex(color);
};

const formatParsedHex = (color: culori.Color): string => {
  return color.alpha !== undefined && color.alpha < 1
    ? culori.formatHex8(color)
    : culori.formatHex(color);
};

export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3",
  preserveAlpha = true
): string => {
  try {
    const parsed = culori.parse(colorValue);
    if (!parsed) throw new Error("Invalid color input");
    const color = preserveAlpha ? parsed : { ...parsed, alpha: 1 };

    switch (format) {
      case "hsl": {
        const converted = culori.converter("hsl")(color);
        if (tailwindVersion === "4") {
          return formatHsl(converted);
        }
        const hsl = normalizeHsl(converted);
        return `${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%${formatAlphaSuffix(hsl.alpha)}`;
      }
      case "rgb":
        return culori.formatRgb(color); // e.g., "rgb(64, 128, 192)"
      case "oklch": {
        const oklch = culori.converter("oklch")(color);
        return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)}${formatAlphaSuffix(oklch.alpha)})`;
      }
      case "hex":
        return formatParsedHex(color);
      default:
        return colorValue;
    }
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue;
  }
};

export const convertToHSL = (colorValue: string): string => colorFormatter(colorValue, "hsl");
