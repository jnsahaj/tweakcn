"use client";

import { toast } from "@/hooks/use-toast";
import { useAILocalDraftStore } from "@/store/ai-local-draft-store";
import { AIPromptData } from "@/types/ai";
import { convertPromptDataToJSONContent } from "@/utils/ai/ai-prompt";
import { parseAiSdkTransportError } from "@/utils/ai/parse-ai-sdk-transport-error";
import { useCompletion } from "@ai-sdk/react";
import { JSONContent } from "@tiptap/react";
import { useCallback, useMemo, useRef } from "react";

export function useAIEnhancePrompt() {
  const { complete, completion, isLoading, stop, setCompletion } = useCompletion({
    api: "/api/enhance-prompt",
    onError: (error) => {
      const defaultMessage = "Failed to enhance prompt. Please try again.";
      const normalized = parseAiSdkTransportError(error, defaultMessage);

      toast({
        title: "An error occurred",
        description: normalized.message,
        variant: "destructive",
      });
    },
    onFinish: (_prompt, finalCompletion) => {
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
      activeMentionsRef.current =
        promptData?.mentions?.map((m) => ({ id: m.id, label: m.label })) ?? [];
      await complete(prompt, { body: { promptData } });
    },
    [complete, isLoading, stop, setCompletion]
  );

  const stopEnhance = useCallback(() => {
    stop();
    if (enhancedPromptAsJsonContent) {
      useAILocalDraftStore.getState().setEditorContentDraft(enhancedPromptAsJsonContent);
    }
  }, [stop, enhancedPromptAsJsonContent]);

  return {
    startEnhance,
    stopEnhance,
    enhancedPrompt: completion,
    enhancedPromptAsJsonContent,
    isEnhancingPrompt: isLoading,
  } as const;
}
