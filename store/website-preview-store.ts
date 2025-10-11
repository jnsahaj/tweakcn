import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WebsitePreviewStore {
  inputUrl: string;
  currentUrl: string;
  setInputUrl: (url: string) => void;
  setCurrentUrl: (url: string) => void;
  reset: () => void;
}

export const useWebsitePreviewStore = create<WebsitePreviewStore>()(
  persist(
    (set) => ({
      inputUrl: "",
      currentUrl: "",
      setInputUrl: (url: string) => set({ inputUrl: url }),
      setCurrentUrl: (url: string) => set({ currentUrl: url }),
      reset: () => set({ inputUrl: "", currentUrl: "" }),
    }),
    {
      name: "website-preview-storage",
    }
  )
);
