import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTheme, updateTheme, deleteTheme } from "@/actions/themes";
import { themeKeys } from "./use-themes-data";
import { ThemeStyles, Theme } from "@/types/theme";
import { toast } from "@/components/ui/use-toast";
import { useThemePresetStore } from "@/store/theme-preset-store";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";

function handleMutationError(error: Error, operation: string) {
  console.error(`Theme ${operation} error:`, error);

  if (error.name !== "UnauthorizedError" && error.name !== "ValidationError") {
    try {
      posthog.capture("theme_mutation_error", {
        operation,
        error: error.message,
        errorName: error.name,
      });
    } catch (posthogError) {
      console.error("Failed to log to PostHog:", posthogError);
    }
  }

  const getErrorMessage = (error: Error) => {
    switch (error.name) {
      case "UnauthorizedError":
        return "Please sign in to continue.";
      case "ValidationError":
        return error.message || "Invalid input provided.";
      case "ThemeNotFoundError":
        return "Theme not found.";
      case "ThemeLimitError":
        return error.message || "Theme limit reached.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  toast({
    title: `Failed to ${operation} theme`,
    description: getErrorMessage(error),
    variant: "destructive",
  });

  return error;
}

export function useCreateTheme() {
  const queryClient = useQueryClient();
  const { registerPreset } = useThemePresetStore();

  return useMutation({
    mutationFn: (data: { name: string; styles: ThemeStyles }) => createTheme(data),
    onSuccess: (data) => {
      queryClient.setQueryData(themeKeys.lists(), (old: Theme[] | undefined) => {
        return old ? [...old, data] : [data];
      });

      registerPreset(data.id, {
        label: data.name,
        source: "SAVED",
        createdAt: data.createdAt.toISOString(),
        styles: data.styles,
      });

      toast({
        title: "Theme created",
        description: `"${data.name}" has been created successfully.`,
      });
    },
    onError: (error) => {
      handleMutationError(error as Error, "create");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.lists() });
    },
  });
}

export function useUpdateTheme() {
  const queryClient = useQueryClient();
  const { updatePreset } = useThemePresetStore();

  return useMutation({
    mutationFn: (data: { id: string; name?: string; styles?: ThemeStyles }) => updateTheme(data),
    onMutate: async (updatedTheme) => {
      await queryClient.cancelQueries({ queryKey: themeKeys.lists() });
      await queryClient.cancelQueries({ queryKey: themeKeys.detail(updatedTheme.id) });

      const previousThemes = queryClient.getQueryData(themeKeys.lists());
      const previousTheme = queryClient.getQueryData(themeKeys.detail(updatedTheme.id));

      queryClient.setQueryData(themeKeys.lists(), (old: Theme[] | undefined) => {
        if (!old) return [];
        return old.map((theme) =>
          theme.id === updatedTheme.id
            ? {
                ...theme,
                ...(updatedTheme.name && { name: updatedTheme.name }),
                ...(updatedTheme.styles && { styles: updatedTheme.styles }),
                updatedAt: new Date(),
              }
            : theme
        );
      });

      return { previousThemes, previousTheme };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(themeKeys.detail(data.id), data);
      queryClient.setQueryData(themeKeys.lists(), (old: Theme[] | undefined) => {
        if (!old) return [data];
        return old.map((theme) => (theme.id === data.id ? data : theme));
      });

      updatePreset(data.id, {
        label: data.name,
        source: "SAVED",
        createdAt: data.createdAt.toISOString(),
        styles: data.styles,
      });

      toast({
        title: "Theme updated",
        description: `"${data.name}" has been updated successfully.`,
      });
    },
    onError: (error, variables, context) => {
      if (context?.previousThemes) {
        queryClient.setQueryData(themeKeys.lists(), context.previousThemes);
      }
      if (context?.previousTheme) {
        queryClient.setQueryData(themeKeys.detail(variables.id), context.previousTheme);
      }
      handleMutationError(error as Error, "update");
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: themeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: themeKeys.detail(variables.id) });
    },
  });
}

export function useDeleteTheme() {
  const queryClient = useQueryClient();
  const { unregisterPreset } = useThemePresetStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (themeId: string) => deleteTheme(themeId),
    onMutate: async (themeId) => {
      await queryClient.cancelQueries({ queryKey: themeKeys.lists() });
      const previousThemes = queryClient.getQueryData(themeKeys.lists());

      queryClient.setQueryData(themeKeys.lists(), (old: Theme[] | undefined) => {
        return old ? old.filter((theme) => theme.id !== themeId) : [];
      });

      return { previousThemes, themeId };
    },
    onSuccess: (data, themeId) => {
      unregisterPreset(themeId);
      queryClient.removeQueries({ queryKey: themeKeys.detail(themeId) });

      toast({
        title: "Theme deleted",
        description: `"${data.name}" has been deleted successfully.`,
      });
      router.refresh();
    },
    onError: (error, _themeId, context) => {
      if (context?.previousThemes) {
        queryClient.setQueryData(themeKeys.lists(), context.previousThemes);
      }
      handleMutationError(error as Error, "delete");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: themeKeys.lists() });
    },
  });
}
