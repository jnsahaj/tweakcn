"use client";

import { AIPillActionButton } from "@/components/editor/ai/ai-pill-action-button";
import { useAIThemeGeneration } from "@/hooks/use-ai-theme-generation";
import { PROMPTS } from "@/utils/prompts";
import { createCurrentThemePromptJson } from "@/utils/tiptap-json-content";
import { JSONContent } from "@tiptap/react";
import { Sparkles } from "lucide-react";

export function SuggestedPillActions({
  handleThemeGeneration,
}: {
  handleThemeGeneration: (jsonContent: JSONContent | null) => void;
}) {
  const { loading: aiGenerateLoading } = useAIThemeGeneration();

  const handleGenerate = async (prompt: string) => {
    const jsonContent = createCurrentThemePromptJson({ prompt });
    handleThemeGeneration(jsonContent);
  };

  return (
    <>
      {Object.entries(PROMPTS).map(([key, { label, prompt }]) => (
        <AIPillActionButton
          key={key}
          onClick={() => handleGenerate(prompt)}
          disabled={aiGenerateLoading}
        >
          <Sparkles /> {label}
        </AIPillActionButton>
      ))}
    </>
  );
}
