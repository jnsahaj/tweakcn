import { useEditorStore } from "@/store/editor-store";
import { useThemePresetStore } from "@/store/theme-preset-store";
import { defaultThemeState } from "@/config/theme";
import { JSONContent } from "@tiptap/react";
import { Theme } from "@/types/theme";
import { getTextContent } from "@/utils/tiptap-json-content";
interface GenerateThemeOptions {
  onSuccess?: (themeStyles: Theme["styles"]) => void;
  onError?: (error: Error) => void;
  signal?: AbortSignal;
}

/**
 * Generate a theme with AI using a text prompt
 */
export async function generateThemeWithAI(prompt: string, options?: GenerateThemeOptions) {
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
      throw new Error("Failed to generate theme");
    }

    const themeStyles = await response.json();
    applyGeneratedTheme(themeStyles);

    options?.onSuccess?.(themeStyles);
    return themeStyles;
  } catch (error) {
    console.error("AI theme generation error:", error);

    if (error instanceof Error) {
      options?.onError?.(error);
    } else {
      options?.onError?.(new Error("Unknown error occurred"));
    }

    throw error;
  }
}

/**
 * Generate a theme with AI using a structured prompt
 * with references to existing themes/presets
 */
export async function generateThemeWithReferences(
  jsonContent: JSONContent,
  options?: GenerateThemeOptions
) {
  if (!jsonContent) return null;

  const prompt = buildPrompt(jsonContent);
  return generateThemeWithAI(prompt, options);
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

function buildPrompt(jsonContent: JSONContent) {
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
