import { toast } from "@/components/ui/use-toast";
import { useAIThemeGenerationStore } from "@/store/ai-theme-generation-store";
import { ChatMessage } from "@/types/ai";
import { ApiError } from "@/types/errors";
import { ThemeStyles } from "@/types/theme";
import { useQueryClient } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";
import { SUBSCRIPTION_STATUS_QUERY_KEY } from "./use-subscription";

type AIThemeGenerationResult =
  | { success: true; data: { text: string; theme: ThemeStyles } }
  | { success: false; error: Error; message: string };

export function useAIThemeGeneration() {
  const generateTheme = useAIThemeGenerationStore((state) => state.generateTheme);
  const loading = useAIThemeGenerationStore((state) => state.loading);
  const cancelThemeGeneration = useAIThemeGenerationStore((state) => state.cancelThemeGeneration);
  const posthog = usePostHog();
  const queryClient = useQueryClient();

  const handleGenerateTheme = async (messages: ChatMessage[]): Promise<AIThemeGenerationResult> => {
    try {
      const result = await generateTheme(messages);

      const lastUserMessage = messages.filter((m) => m.role === "user").pop();
      posthog.capture("AI_GENERATE_THEME", {
        prompt: lastUserMessage?.promptData?.content,
        includesImage:
          lastUserMessage?.promptData?.images && lastUserMessage.promptData.images.length > 0,
        imageCount: lastUserMessage?.promptData?.images?.length,
      });

      toast({
        title: "Theme generated",
        description: "Your AI-generated theme has been applied.",
      });

      return { success: true, data: result };
    } catch (error) {
      let message = "Failed to generate theme. Please try again.";

      if (error instanceof Error && error.name === "AbortError") {
        message = "The theme generation was cancelled, no changes were made.";
        toast({
          title: "Theme generation cancelled",
          description: message,
        });
      } else if (error instanceof ApiError) {
        if (error.code === "SUBSCRIPTION_REQUIRED") {
          toast({
            title: "Subscription required",
            description: error.message,
          });
        } else {
          toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        const description = error instanceof Error ? error.message : message;
        toast({
          title: "Error",
          description,
          variant: "destructive",
        });
      }

      return { success: false, error: error as Error, message };
    } finally {
      queryClient.invalidateQueries({ queryKey: [SUBSCRIPTION_STATUS_QUERY_KEY] });
    }
  };

  return {
    generateTheme: handleGenerateTheme,
    loading,
    cancelThemeGeneration,
  };
}
