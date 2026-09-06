import * as culori from "culori";
import { ColorFormat } from "../types";
import { Hsl } from "culori";

export const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return "0";
  if (num === 0) return "0";
  return num % 1 === 0 ? String(num) : num.toFixed(4);
};

const hasAlpha = (color: { alpha?: number }): boolean => {
  return color.alpha !== undefined && color.alpha < 1;
};

export const formatHsl = (hsl: Hsl) => {
  const h = formatNumber(hsl.h);
  const s = formatNumber(hsl.s * 100);
  const l = formatNumber(hsl.l * 100);

  if (hasAlpha(hsl)) {
    return `hsl(${h} ${s}% ${l}% / ${formatNumber(hsl.alpha)})`;
  }
  return `hsl(${h} ${s}% ${l}%)`;
};

export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = "hsl",
  tailwindVersion: "3" | "4" = "3"
): string => {
  try {
    const color = culori.parse(colorValue);
    if (!color) throw new Error("Invalid color input");

    switch (format) {
      case "hsl": {
        const hsl = culori.converter("hsl")(color);
        if (tailwindVersion === "4") {
          return formatHsl(hsl);
        }
        const base = `${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%`;
        if (hasAlpha(hsl)) {
          return `${base} / ${formatNumber(hsl.alpha)}`;
        }
        return base;
      }
      case "rgb":
        return culori.formatRgb(color); // e.g., "rgb(64, 128, 192)"
      case "oklch": {
        const oklch = culori.converter("oklch")(color);
        const l = formatNumber(oklch.l);
        const c = formatNumber(oklch.c);
        const h = formatNumber(oklch.h);
        if (hasAlpha(oklch)) {
          return `oklch(${l} ${c} ${h} / ${formatNumber(oklch.alpha)})`;
        }
        return `oklch(${l} ${c} ${h})`;
      }
      case "hex":
        if (hasAlpha(color)) {
          return culori.formatHex8(color); // e.g., "#4080c0ff"
        }
        return culori.formatHex(color); // e.g., "#4080c0"
      default:
        return colorValue;
    }
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error);
    return colorValue;
  }
};

export const convertToHSL = (colorValue: string): string => colorFormatter(colorValue, "hsl");
