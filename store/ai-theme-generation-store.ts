import { generateThemeWithReferences } from "@/lib/ai-theme-generator";
import { create } from "zustand";

export interface GenerateThemeOptions {
  prompt?: string;
  jsonPrompt?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

interface AIThemeGenerationStore {
  loading: boolean;
  prompt: string;
  jsonPrompt: string;
  hasPrompted: boolean;
  lastGeneratedTheme: any | null;
  abortController: AbortController | null;

  // State setters
  setLoading: (loading: boolean) => void;
  setPrompt: (prompt: string) => void;
  setJsonPrompt: (jsonPrompt: string) => void;

  // Actions
  generateTheme: (options?: GenerateThemeOptions) => Promise<any>;
  cancelThemeGeneration: () => void;

  // Utility methods
  resetPrompts: () => void;
  resetState: () => void;
  updateLastGeneratedTheme: (theme: any) => void;
}

const initialState = {
  loading: false,
  prompt: "",
  jsonPrompt: "",
  hasPrompted: false,
  lastGeneratedTheme: null,
  abortController: null,
};

export const useAIThemeGenerationStore = create<AIThemeGenerationStore>()((set, get) => ({
  ...initialState,

  // State setters
  setLoading: (loading: boolean) => set({ loading }),
  setPrompt: (prompt: string) => set({ prompt }),
  setJsonPrompt: (jsonPrompt: string) => set({ jsonPrompt }),

  // Utility methods
  resetPrompts: () => set({ prompt: "", jsonPrompt: "" }),
  resetState: () => set(initialState),
  updateLastGeneratedTheme: (theme: any) => set({ lastGeneratedTheme: theme }),

  // Cancel ongoing theme generation
  cancelThemeGeneration: () => {
    const { abortController } = get();
    if (abortController) {
      abortController.abort();
      set({ loading: false, abortController: null });
    }
  },

  generateTheme: async (options?: GenerateThemeOptions) => {
    const state = get();
    const finalPrompt = options?.prompt || state.prompt;
    const finalJsonPrompt = options?.jsonPrompt || state.jsonPrompt;

    if (!finalPrompt.trim()) return;

    // Cancel any ongoing requests
    if (state.abortController) {
      state.abortController.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    set({ loading: true, abortController });

    try {
      const themeStyles = await generateThemeWithReferences(finalPrompt, finalJsonPrompt, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
        signal: abortController.signal,
      });

      set({
        hasPrompted: true,
        lastGeneratedTheme: themeStyles,
      });

      return themeStyles;
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false, abortController: null });
    }
  },
}));
