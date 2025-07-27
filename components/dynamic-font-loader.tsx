"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useEditorStore } from "@/store/editor-store";
import { extractFontFamily, getDefaultWeights } from "@/utils/fonts";
import { loadGoogleFont } from "@/utils/fonts/google-fonts";
import { useEffect, useMemo } from "react";

export function DynamicFontLoader() {
  const { themeState } = useEditorStore();
  const isMounted = useMounted();

  const fontSans = themeState.styles.light["font-sans"];
  const fontSerif = themeState.styles.light["font-serif"];
  const fontMono = themeState.styles.light["font-mono"];

  const currentFonts = useMemo(() => {
    return {
      sans: fontSans,
      serif: fontSerif,
      mono: fontMono,
    } as const;
  }, [fontSans, fontSerif, fontMono]);

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
