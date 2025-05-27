import { JSONContent } from "@tiptap/react";
import { generateThemeWithReferences } from "@/lib/ai-theme-generator";
import { create } from "zustand";

export interface GenerateThemeOptions {
  jsonContent?: JSONContent;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface AIThemeGenerationStore {
  loading: boolean;
  jsonContent: JSONContent | null;
  hasPrompted: boolean;
  lastGeneratedTheme: any | null;
  abortController: AbortController | null;

  // State setters
  setLoading: (loading: boolean) => void;
  setJsonContent: (jsonContent: JSONContent) => void;

  // Actions
  generateTheme: (options?: GenerateThemeOptions) => Promise<any>;
  cancelThemeGeneration: () => void;

  resetContent: () => void;
  resetState: () => void;
  updateLastGeneratedTheme: (theme: any) => void;
}

const initialState = {
  loading: false,
  jsonContent: null as JSONContent | null,
  hasPrompted: false,
  lastGeneratedTheme: null,
  abortController: null,
};

export const useAIThemeGenerationStore = create<AIThemeGenerationStore>()((set, get) => ({
  ...initialState,

  // State setters
  setLoading: (loading: boolean) => set({ loading }),
  setJsonContent: (jsonContent: JSONContent) => set({ jsonContent }),

  // Utility methods
  resetContent: () => set({ jsonContent: null }),
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
    const jsonContent = options?.jsonContent || state.jsonContent;

    if (!jsonContent) return;

    // Cancel any ongoing requests
    if (state.abortController) {
      state.abortController.abort();
    }

    // Create new AbortController for this request
    const abortController = new AbortController();
    set({ loading: true, abortController });

    try {
      const themeStyles = await generateThemeWithReferences(jsonContent, {
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
