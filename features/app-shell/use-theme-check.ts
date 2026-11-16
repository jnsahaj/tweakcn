"use client";

import { useDeferredValue } from "react";
import { useEditorStore } from "@/store/editor-store";
import { themeCheckFor, type ThemeCheckSummary } from "./theme-check";

/** The live theme check for the theme being edited (deferred, so sliders stay smooth). */
export function useThemeCheck(): ThemeCheckSummary {
  const styles = useEditorStore((s) => s.themeState.styles);
  const deferred = useDeferredValue(styles);
  return themeCheckFor(deferred);
}
