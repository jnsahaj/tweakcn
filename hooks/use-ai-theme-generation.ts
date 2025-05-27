import { toast } from "@/components/ui/use-toast";
import { GenerateThemeOptions, useAIThemeGenerationStore } from "@/store/ai-theme-generation-store";

// Hook for components that only need generation functionality
export function useAIThemeGeneration() {
  const _generateTheme = useAIThemeGenerationStore((state) => state.generateTheme);
  const loading = useAIThemeGenerationStore((state) => state.loading);
  const cancelThemeGeneration = useAIThemeGenerationStore((state) => state.cancelThemeGeneration);

  const generateTheme = async (options?: GenerateThemeOptions) => {
    return await _generateTheme({
      ...options,
      onSuccess: () => {
        toast({
          title: "Theme generated",
          description: "Your AI-generated theme has been applied",
        });
        options?.onSuccess?.();
      },
      onError: (error) => {
        if (error instanceof Error && error.name === "AbortError") {
          toast({
            title: "Theme generation cancelled",
            description: "The theme generation was cancelled, no changes were made.",
          });
          return;
        }

        toast({
          title: "Error",
          description: "Failed to generate theme. Please try again.",
          variant: "destructive",
        });
        options?.onError?.(error);
      },
    });
  };

  return {
    generateTheme,
    loading,
    cancelThemeGeneration,
  };
}

// Hook for components that only need prompt-related state and actions
export function useAIThemeGenerationPrompts() {
  const jsonContent = useAIThemeGenerationStore((state) => state.jsonContent);
  const setJsonContent = useAIThemeGenerationStore((state) => state.setJsonContent);
  const resetContent = useAIThemeGenerationStore((state) => state.resetContent);

  return {
    jsonContent,
    setJsonContent,
    resetContent,
  };
}

// Hook for components that need to know about the last generated theme
export function useAIThemeGenerationResult() {
  const lastGeneratedTheme = useAIThemeGenerationStore((state) => state.lastGeneratedTheme);
  const hasPrompted = useAIThemeGenerationStore((state) => state.hasPrompted);

  return {
    lastGeneratedTheme,
    hasPrompted,
  };
}
