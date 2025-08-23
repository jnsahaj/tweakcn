import { ChatMessage } from "@/types/ai";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { idbStorage } from "./idb-storage";

interface AIChatStore {
  messages: ChatMessage[];
  setMessages: (messages: ChatMessage[]) => void;

  // Hook into zustand hydration lifecycle
  hasHydrated: boolean;
  _setHasHydrated: () => void;
}

export const useAIChatStore = create<AIChatStore>()(
  persist(
    (set) => ({
      messages: [],
      setMessages: (messages: ChatMessage[]) => {
        set({ messages });
      },
      hasHydrated: false,
      _setHasHydrated: () => {
        set({ hasHydrated: true });
      },
    }),
    {
      name: "ai-chat-storage-v2",
      storage: createJSONStorage(() => idbStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated?.();
      },
    }
  )
);
