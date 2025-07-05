import { toast } from "@/components/ui/use-toast";
import { useAIThemeGenerationStore } from "@/store/ai-theme-generation-store";
import { usePostHog } from "posthog-js/react";

export function useAIThemeGeneration() {
  const generateTheme = useAIThemeGenerationStore((state) => state.generateTheme);
  const loading = useAIThemeGenerationStore((state) => state.loading);
  const cancelThemeGeneration = useAIThemeGenerationStore((state) => state.cancelThemeGeneration);
  const posthog = usePostHog();

  const handleGenerateTheme = async (prompt: string, imageFiles?: File[]) => {
    try {
      const result = await generateTheme(prompt, imageFiles);

      toast({
        title: "Theme generated",
        description: "Your AI-generated theme has been applied",
      });

      posthog.capture("AI_GENERATE_THEME", {
        prompt,
        includesImage: imageFiles && imageFiles.length > 0,
        imageCount: imageFiles?.length,
      });

      return result; // Return the result from the store
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        toast({
          title: "Theme generation cancelled",
          description: "The theme generation was cancelled, no changes were made.",
        });
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
