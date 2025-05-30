import { defaultThemeState } from "@/config/theme";
import { useEditorStore } from "@/store/editor-store";
import { AIPromptData } from "@/types/ai";
import { Theme } from "@/types/theme";
import { buildPromptForAPI } from "@/utils/ai-prompt";

/**
 * Generate a theme with AI using a text prompt
 */
export async function generateThemeWithAI(prompt: string, options?: { signal?: AbortSignal }) {
  if (!prompt.trim()) return null;

  try {
    const response = await fetch("/api/generate-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      signal: options?.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errorMessage = errorBody || "Failed to generate theme. Please try again.";
      throw new Error(errorMessage);
    }

    const result = await response.json();
    applyGeneratedTheme(result.theme);

    return result;
  } catch (error) {
    console.error("AI theme generation error:", error);
    throw error;
  }
}

/**
 * Apply a generated theme to the editor state
 */
export function applyGeneratedTheme(themeStyles: Theme["styles"]) {
  const { themeState, setThemeState } = useEditorStore.getState();

  if (!document.startViewTransition) {
    setThemeState({
      ...themeState,
      styles: {
        ...themeState.styles,
        light: { ...defaultThemeState.styles.light, ...themeStyles.light },
        dark: { ...defaultThemeState.styles.dark, ...themeStyles.dark },
      },
    });
  } else {
    document.startViewTransition(() => {
      setThemeState({
        ...themeState,
        styles: {
          ...themeState.styles,
          light: {
            ...defaultThemeState.styles.light,
            ...themeStyles.light,
          },
          dark: { ...defaultThemeState.styles.dark, ...themeStyles.dark },
        },
      });
    });
  }
}

export function buildPrompt(promptData: AIPromptData) {
  return buildPromptForAPI(promptData);
}
