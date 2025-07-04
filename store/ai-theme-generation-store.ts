import { generateThemeWithAI } from "@/lib/ai/ai-theme-generator";
import { ThemeStyles } from "@/types/theme";
import { create } from "zustand";

interface AIThemeGenerationStore {
  loading: boolean;
  abortController: AbortController | null;

  setLoading: (loading: boolean) => void;
  // generateTheme now only takes prompt. Callbacks are removed.
  generateTheme: (
    prompt: string,
    imageFile?: File
  ) => Promise<{ text: string; theme: ThemeStyles }>;
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

  generateTheme: async (prompt: string, imageFile?: File) => {
    const state = get();
    if (!prompt.trim()) return; // Or throw new Error("Prompt cannot be empty");

    if (state.abortController) {
      state.abortController.abort();
    }

    const abortController = new AbortController();
    set({ loading: true, abortController });

    try {
      const response = await generateThemeWithAI(prompt, imageFile, {
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
