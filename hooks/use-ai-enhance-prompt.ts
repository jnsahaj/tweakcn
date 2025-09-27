"use client";

import { toast } from "@/hooks/use-toast";
import { parseAiSdkTransportError } from "@/lib/ai/parse-ai-sdk-transport-error";
import { useAILocalDraftStore } from "@/store/ai-local-draft-store";
import { useGetProDialogStore } from "@/store/get-pro-dialog-store";
import { AIPromptData } from "@/types/ai";
import { convertPromptDataToJSONContent } from "@/utils/ai/ai-prompt";
import { useCompletion } from "@ai-sdk/react";
import { JSONContent } from "@tiptap/react";
import posthog from "posthog-js";
import { useCallback, useMemo, useRef } from "react";

export function useAIEnhancePrompt() {
  const { openGetProDialog } = useGetProDialogStore();
  const { complete, completion, isLoading, stop, setCompletion } = useCompletion({
    api: "/api/enhance-prompt",
    onError: (error) => {
      const defaultMessage = "Failed to enhance prompt. Please try again.";
      const normalized = parseAiSdkTransportError(error, defaultMessage);

      try {
        posthog.capture("ENHANCE_PROMPT_ERROR", {
          message: normalized.message,
          code: normalized.code,
          status: normalized.status,
        });
      } catch {}

      if (normalized.code === "SUBSCRIPTION_REQUIRED") {
        openGetProDialog();
      }

      toast({
        title: "An error occurred",
        description: normalized.message,
        variant: "destructive",
      });
    },
    onFinish: (_prompt, finalCompletion) => {
      try {
        const durationMs = startTimeRef.current ? Date.now() - startTimeRef.current : undefined;
        posthog.capture("ENHANCE_PROMPT_FINISH", {
          durationMs,
          finalLength: finalCompletion?.length ?? 0,
        });
      } catch {}

      const promptData: AIPromptData = {
        content: finalCompletion,
        mentions: activeMentionsRef.current.map((m) => ({
          id: m.id,
          label: m.label,
          themeData: { light: {}, dark: {} },
        })),
      };
      const jsonContent = convertPromptDataToJSONContent(promptData);
      useAILocalDraftStore.getState().setEditorContentDraft(jsonContent);
    },
  });

  const activeMentionsRef = useRef<Array<{ id: string; label: string }>>([]);
  const startTimeRef = useRef<number | null>(null);

  const enhancedPromptAsJsonContent: JSONContent | undefined = useMemo(() => {
    if (!completion) return undefined;
    const promptData: AIPromptData = {
      content: completion,
      mentions: activeMentionsRef.current.map((m) => ({
        id: m.id,
        label: m.label,
        themeData: { light: {}, dark: {} },
      })),
    };
    return convertPromptDataToJSONContent(promptData);
  }, [completion]);

  const startEnhance = useCallback(
    async (promptData: AIPromptData) => {
      const prompt = promptData?.content ?? "";
      if (!prompt?.trim()) return;

      if (isLoading) stop();
      setCompletion("");

      startTimeRef.current = Date.now();
      activeMentionsRef.current =
        promptData?.mentions?.map((m) => ({ id: m.id, label: m.label })) ?? [];

      try {
        posthog.capture("ENHANCE_PROMPT_START", {
          contentLength: prompt.length,
          mentionCount: promptData?.mentions?.length ?? 0,
          imageCount: promptData?.images?.length ?? 0,
        });
      } catch {}

      await complete(prompt, { body: { promptData } });
    },
    [complete, isLoading, stop, setCompletion]
  );

  const stopEnhance = useCallback(() => {
    stop();

    if (enhancedPromptAsJsonContent) {
      useAILocalDraftStore.getState().setEditorContentDraft(enhancedPromptAsJsonContent);
    }

    try {
      const durationMs = startTimeRef.current ? Date.now() - startTimeRef.current : undefined;
      posthog.capture("ENHANCE_PROMPT_CANCEL", { durationMs });
    } catch {}
  }, [stop, enhancedPromptAsJsonContent]);

  return {
    startEnhance,
    stopEnhance,
    enhancedPrompt: completion,
    enhancedPromptAsJsonContent,
    isEnhancingPrompt: isLoading,
  } as const;
}
