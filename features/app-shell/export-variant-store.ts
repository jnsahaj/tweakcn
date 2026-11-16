import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExportVariant = "app-shell" | "standalone";

/** Which CSS export the code panel shows. "App shell" is the default (theme-generator-krav.md 1.1). */
export const useExportVariantStore = create<{
  variant: ExportVariant;
  setVariant: (variant: ExportVariant) => void;
}>()(
  persist(
    (set) => ({
      variant: "app-shell",
      setVariant: (variant) => set({ variant }),
    }),
    { name: "abtion-export-variant" }
  )
);
