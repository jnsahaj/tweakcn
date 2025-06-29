import { useEditorStore } from "@/store/editor-store";
import { AIPromptData } from "@/types/ai";
import { Theme } from "@/types/theme";
import { buildPromptForAPI } from "@/utils/ai/ai-prompt";
import { mergeThemeStylesWithDefaults } from "@/utils/theme-styles";

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

  // Merge the generated theme styles with the default theme styles
  // if the generated theme styles are missing a value, use the default theme styles
  const mergedStyles = mergeThemeStylesWithDefaults(themeStyles);

  if (!document.startViewTransition) {
    setThemeState({
      ...themeState,
      styles: mergedStyles,
    });
  } else {
    document.startViewTransition(() => {
      setThemeState({
        ...themeState,
        styles: mergedStyles,
      });
    });
  }
}

export function buildPrompt(promptData: AIPromptData) {
  return buildPromptForAPI(promptData);
}
