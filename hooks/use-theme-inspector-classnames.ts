"use client";

import { useMemo } from "react";

export const useClassNames = (className: string) => {
  return useMemo(() => {
    const seen = new Set<string>();
    return className.split(/\s+/).filter((cls) => cls && !seen.has(cls) && seen.add(cls));
  }, [className]);
};
