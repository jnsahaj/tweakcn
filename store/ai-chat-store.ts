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
      version: 2,
      name: "ai-chat-storage",
      storage: createJSONStorage(() => idbStorage),
      partialize: (state) => ({ messages: state.messages }),
      migrate: (persistedState, fromVersion) => {
        if (!persistedState || typeof persistedState !== "object") {
          return { messages: [] };
        }

        if (fromVersion === 2) {
          const current = persistedState as AIChatStore;
          return { messages: Array.isArray(current.messages) ? current.messages : [] };
        }
      },
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated?.();
      },
    }
  )
);
