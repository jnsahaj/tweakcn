import { toast } from "@/components/ui/use-toast";
import { useAIThemeGenerationStore } from "@/store/ai-theme-generation-store";

export function useAIThemeGeneration() {
  const generateTheme = useAIThemeGenerationStore((state) => state.generateTheme);
  const loading = useAIThemeGenerationStore((state) => state.loading);
  const cancelThemeGeneration = useAIThemeGenerationStore((state) => state.cancelThemeGeneration);

  const handleGenerateTheme = async (prompt: string) => {
    try {
      const result = await generateTheme(prompt);

      toast({
        title: "Theme generated",
        description: "Your AI-generated theme has been applied",
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
