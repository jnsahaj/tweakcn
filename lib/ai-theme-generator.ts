import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { defaultThemeState } from "@/config/theme";
import { JSONContent } from "@tiptap/react";
import { Theme } from "@/types/theme";
import { getTextContent } from "@/utils/tiptap-json-content";

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
      let errorMessage = "Failed to generate theme";
      try {
        const errorBody = await response.json();
        errorMessage = errorBody.message || errorBody.error || errorMessage;
      } catch (e) {
        // Ignore if error body isn't valid JSON or doesn't contain a message
      }
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

export function buildPrompt(jsonContent: JSONContent) {
  const mentionedReferences = getTransformedMentionedReferences(jsonContent);
  const textContent = getTextContent(jsonContent);
  return `${textContent}\n\n${mentionedReferences}`;
}

/**
 * Transform a prompt to include references to other themes
 */
function getTransformedMentionedReferences(jsonContent: JSONContent) {
  const mentions = jsonContent.content?.[0]?.content?.filter((item) => item.type === "mention");

  const getMentionContent = (id: string) => {
    if (id === "editor:current-changes") {
      return useEditorStore.getState().themeState.styles;
    }

    return useThemePresetStore.getState().getPreset(id)?.styles;
  };

  const mentionReferences = mentions?.map(
    (mention) => `@${mention.attrs?.label} = 
  ${JSON.stringify(getMentionContent(mention.attrs?.id))}`
  );

  return mentionReferences?.join("\n") || "";
}
