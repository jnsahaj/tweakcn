import { toast } from "@/components/ui/use-toast";
import { useAIThemeGenerationStore } from "@/store/ai-theme-generation-store";
import { usePostHog } from "posthog-js/react";
import { ApiError } from "@/types/errors";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { SUBSCRIPTION_STATUS_QUERY_KEY } from "./use-subscription";
import { ChatMessage } from "@/types/ai";

export function useAIThemeGeneration() {
  const generateTheme = useAIThemeGenerationStore((state) => state.generateTheme);
  const loading = useAIThemeGenerationStore((state) => state.loading);
  const cancelThemeGeneration = useAIThemeGenerationStore((state) => state.cancelThemeGeneration);
  const posthog = usePostHog();
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();

  const handleGenerateTheme = async (messages: ChatMessage[]) => {
    try {
      const result = await generateTheme(messages);

      if (result.subscriptionStatus && session?.user.id) {
        queryClient.setQueryData([SUBSCRIPTION_STATUS_QUERY_KEY], result.subscriptionStatus);
      }

      toast({
        title: "Theme generated",
        description: "Your AI-generated theme has been applied",
      });

      const lastUserMessage = messages.filter((m) => m.role === "user").pop();

      posthog.capture("AI_GENERATE_THEME", {
        prompt: lastUserMessage?.promptData?.content,
        includesImage:
          lastUserMessage?.promptData?.images && lastUserMessage.promptData.images.length > 0,
        imageCount: lastUserMessage?.promptData?.images?.length,
      });

      return result; // Return the result from the store
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast({
          title: "Theme generation cancelled",
          description: "The theme generation was cancelled, no changes were made.",
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
        const description =
          error instanceof Error ? error.message : "Failed to generate theme. Please try again.";
        toast({
          title: "Error",
          description,
          variant: "destructive",
        });
      }
    }
  };

  return {
    generateTheme: handleGenerateTheme,
    loading,
    cancelThemeGeneration,
  };
}
