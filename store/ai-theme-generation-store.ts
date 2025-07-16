import { generateThemeWithAI } from "@/lib/ai/ai-theme-generator";
import { ChatMessage } from "@/types/ai";
import { SubscriptionStatus } from "@/types/subscription";
import { ThemeStyles } from "@/types/theme";
import { create } from "zustand";

interface AIThemeGenerationStore {
  loading: boolean;
  abortController: AbortController | null;

  setLoading: (loading: boolean) => void;
  // generateTheme now only takes an optional prompt and image files. Callbacks are removed.
  generateTheme: (messages: ChatMessage[]) => Promise<{
    text: string;
    theme: ThemeStyles;
  }>;
  cancelThemeGeneration: () => void;
  resetState: () => void;
}

const initialState = {
  loading: false,
  abortController: null,
};

export const useAIThemeGenerationStore = create<AIThemeGenerationStore>()((set, get) => ({
  ...initialState,
  setLoading: (loading: boolean) => set({ loading }),
  resetState: () => set(initialState),

  cancelThemeGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ loading: false, abortController: null });
    }
  },

  generateTheme: async (messages: ChatMessage[]) => {
    if (messages.length === 0) {
      throw new Error("Messages are required");
    }

    const state = get();

    if (state.abortController) {
      state.abortController.abort();
    }

    const abortController = new AbortController();
    set({ loading: true, abortController });

    try {
      const response = await generateThemeWithAI(messages, {
        signal: abortController.signal,
      });
      return response;
    } catch (error) {
      console.error("Error in store generateTheme:", error);
      throw error;
    } finally {
      if (get().abortController === abortController) {
        set({ loading: false, abortController: null });
      } else {
        set({ loading: false });
      }
    }
  },
}));
