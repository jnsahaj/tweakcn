import { useChatContext } from "@/hooks/use-chat-context";
import { AIPromptData } from "@/types/ai";

export function useAIThemeGenerationCore() {
  const { status, sendMessage, stop } = useChatContext();
  const isGeneratingTheme = status === "submitted" || status === "streaming";

  const generateThemeCore = async (promptData?: AIPromptData) => {
    if (!promptData) throw new Error("Failed to generate theme. Please try again.");

    sendMessage({
      text: promptData.content,
      metadata: { promptData },
    });
  };

  return {
    generateThemeCore,
    isGeneratingTheme,
    cancelThemeGeneration: stop,
  };
}
