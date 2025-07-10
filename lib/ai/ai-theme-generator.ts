import { useEditorStore } from "@/store/editor-store";
import { ChatMessage } from "@/types/ai";
import { ApiError, ApiErrorCode } from "@/types/errors";
import { SubscriptionStatus } from "@/types/subscription";
import { Theme } from "@/types/theme";
import { convertChatMessagesToCoreMessages } from "@/utils/ai/message-converter";
import { mergeThemeStylesWithDefaults } from "@/utils/theme-styles";

async function handleError(response: Response) {
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const { code, message, data } = await response.json();
    throw new ApiError(
      (code as ApiErrorCode) ?? "UNKNOWN_ERROR",
      message ?? "Error",
      data,
      response.status
    );
  }
  const text = await response.text();
  throw new ApiError(
    "UNKNOWN_ERROR",
    text || "Failed to generate theme",
    undefined,
    response.status
  );
}

/**
 * Generate a theme with AI using a text prompt
 */
export async function generateThemeWithAI(
  messages: ChatMessage[],
  options?: { signal?: AbortSignal }
): Promise<{
  text: string;
  theme: Theme["styles"];
  subscriptionStatus?: SubscriptionStatus;
}> {
  try {
    const coreMessages = await convertChatMessagesToCoreMessages(messages);

    const response = await fetch("/api/generate-theme", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: coreMessages }),
      signal: options?.signal,
    });

    if (!response.ok) {
      await handleError(response);
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
