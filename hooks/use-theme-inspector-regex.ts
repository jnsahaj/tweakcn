"use client";

import { defaultLightThemeStyles } from "@/config/theme";

const createThemeClassRegex = () => {
  const excludePrefixes = ["font-", "shadow-", "letter-spacing", "spacing", "radius"];

  const tokens = Object.keys(defaultLightThemeStyles).filter((token) => {
    return !excludePrefixes.some((prefix) => token.startsWith(prefix));
  });

  const sortedTokens = tokens.sort((a, b) => b.length - a.length);
  const escapedTokens = sortedTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  const pattern = `\\b(?:bg|text|border|ring|fill|stroke)-(?:${escapedTokens.join(
    "|"
  )})(?:\\/\\d{1,3})?\\b`;

  return new RegExp(pattern);
};

export const THEME_CLASS_REGEX = createThemeClassRegex();
