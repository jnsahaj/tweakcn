"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useEditorStore } from "@/store/editor-store";
import { extractFontFamily, getDefaultWeights, loadGoogleFont } from "@/utils/fonts";
import { useEffect, useMemo } from "react";

export function DynamicFontLoader() {
  const { themeState } = useEditorStore();
  const isMounted = useMounted();

  const currentFonts = useMemo(() => {
    return {
      sans: themeState.styles.light["font-sans"],
      serif: themeState.styles.light["font-serif"],
      mono: themeState.styles.light["font-mono"],
    } as const;
  }, [
    themeState.styles.light["font-sans"],
    themeState.styles.light["font-serif"],
    themeState.styles.light["font-mono"],
  ]);

  useEffect(() => {
    if (!isMounted) return;

    try {
      Object.entries(currentFonts).forEach(([_type, fontValue]) => {
        const fontFamily = extractFontFamily(fontValue);
        if (fontFamily) {
          const weights = getDefaultWeights(["400", "500", "600", "700"]);
          loadGoogleFont(fontFamily, weights);
        }
      });
    } catch (e) {
      console.warn("DynamicFontLoader: Failed to load Google fonts:", e);
    }
  }, [isMounted, currentFonts]);

  return null;
}
