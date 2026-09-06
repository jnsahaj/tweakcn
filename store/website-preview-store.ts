import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsitePreviewStore {
  currentUrl: string;
  setCurrentUrl: (url: string) => void;
  reset: () => void;
}

export const useWebsitePreviewStore = create<WebsitePreviewStore>()(
  persist(
    (set) => ({
      currentUrl: "",
      setCurrentUrl: (url: string) => set({ currentUrl: url }),
      reset: () => set({ currentUrl: "" }),
    }),
    {
      name: "website-preview-storage",
    }
  )
);
